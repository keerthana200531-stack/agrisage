const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');

// Configuration
const PORT = process.env.PORT || 3000;
const STATIC_DIR = path.join(__dirname, 'public');
const COM_OVERRIDE = process.env.SERIAL_PORT || process.env.COM_PORT || '';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(STATIC_DIR));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

let latestReading = {
  raw: null,
  percent: null,
  condition: 'unknown',
  at: null
};

// Utility: parse incoming serial line into a number
function parseMoistureFromLine(line) {
  // Accept common formats: just a number, or "Moisture: 523", or percentage like "67%"
  const trimmed = String(line).trim();
  if (!trimmed) return null;

  // Percentage like "67%"
  const pctMatch = trimmed.match(/(\d{1,3})\s*%/);
  if (pctMatch) {
    const pct = Math.max(0, Math.min(100, parseInt(pctMatch[1], 10)));
    // Convert to pseudo-raw 0..1023 for uniform downstream handling
    const raw = Math.round((100 - pct) * 1023 / 100);
    return { raw, percent: pct };
  }

  // Raw number possibly embedded
  const numMatch = trimmed.match(/(-?\d{1,5})/);
  if (!numMatch) return null;
  const rawCandidate = parseInt(numMatch[1], 10);
  if (Number.isNaN(rawCandidate)) return null;
  // Clamp raw to 0..1023 typical Arduino analog range
  const raw = Math.max(0, Math.min(1023, rawCandidate));
  const percent = Math.round(100 - (raw / 1023) * 100);
  return { raw, percent };
}

function classifyCondition(percent) {
  if (percent == null) return 'unknown';
  if (percent <= 3) return 'sensor_not_on_soil'; // likely in air / disconnected
  if (percent < 30) return 'dry';
  if (percent <= 60) return 'normal';
  return 'wet';
}

function recommendationsFor(condition) {
  switch (condition) {
    case 'dry':
      return ['Cactus', 'Succulents', 'Rosemary', 'Lavender'];
    case 'normal':
      return ['Tomato', 'Beans', 'Marigold', 'Basil'];
    case 'wet':
      return ['Rice', 'Taro', 'Watermint', 'Iris'];
    default:
      return [];
  }
}

app.get('/api/moisture', (req, res) => {
  res.json({
    ...latestReading,
    recommendations: recommendationsFor(latestReading.condition)
  });
});

// Diagnostics: list available serial ports
app.get('/api/ports', async (req, res) => {
  try {
    const ports = await SerialPort.list();
    res.json(ports.map(p => ({
      path: p.path || p.comName,
      manufacturer: p.manufacturer,
      vendorId: p.vendorId,
      productId: p.productId,
      friendlyName: p.friendlyName
    })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

io.on('connection', (socket) => {
  // Send the latest immediately upon connect
  socket.emit('moisture', {
    ...latestReading,
    recommendations: recommendationsFor(latestReading.condition)
  });
});

async function openSerialPort() {
  const list = await SerialPort.list();

  let selectedPath = null;
  if (COM_OVERRIDE) {
    selectedPath = COM_OVERRIDE;
  } else {
    const preferredVendors = ['arduino', 'wch', 'wch.cn', 'silicon labs', 'ftdi'];
    const candidate = list.find((port) => {
      const text = [port.manufacturer, port.vendorId, port.productId, port.friendlyName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return preferredVendors.some(v => text.includes(v));
    }) || list[0];
    if (candidate) selectedPath = candidate.path || candidate.comName; // path in new serialport
  }

  if (!selectedPath) {
    console.warn('No serial ports found. The server will run without sensor input.');
    return null;
  }

  const port = new SerialPort({ path: selectedPath, baudRate: 9600 });
  console.log(`Opened serial port: ${selectedPath}`);

  let buffer = '';
  port.on('data', (data) => {
    buffer += data.toString('utf8');
    let idx;
    while ((idx = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, idx).replace(/\r$/, '');
      buffer = buffer.slice(idx + 1);
      const parsed = parseMoistureFromLine(line);
      if (!parsed) {
        // Debug: uncomment to see unparsed lines
        // console.log('Unparsed line:', line);
      }
      if (!parsed) continue;

      const condition = classifyCondition(parsed.percent);
      latestReading = {
        raw: parsed.raw,
        percent: parsed.percent,
        condition,
        at: new Date().toISOString()
      };

      io.emit('moisture', {
        ...latestReading,
        recommendations: recommendationsFor(condition)
      });
    }
  });

  port.on('error', (err) => {
    console.error('Serial port error:', err.message);
  });

  port.on('close', () => {
    console.warn('Serial port closed. Will attempt to reopen in 5s...');
    setTimeout(() => openSerialPort().catch(() => {}), 5000);
  });

  return port;
}

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await openSerialPort();
  } catch (e) {
    console.warn('Failed to open serial port:', e.message);
  }
});


