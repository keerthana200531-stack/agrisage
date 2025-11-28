# AgriSage – Smart Agriculture Monitoring & Automated Irrigation System

AgriSage is a smart, IoT-driven precision agriculture system designed to help farmers—especially beginners—manage crops efficiently, sustainably, and profitably. It integrates real-time soil monitoring, AI-assisted recommendations, and a user-friendly dashboard to replace manual guesswork with intelligent automation.

## 🌱 Project Overview

AgriSage transforms traditional farming using IoT sensors, microcontrollers, and intelligent decision-making algorithms. The system continuously monitors soil moisture, categorizes soil condition, and provides actionable recommendations on irrigation and suitable plant types. This empowers farmers with data-driven insights to reduce water usage, prevent crop loss, and enhance productivity.

## ✨ Key Features

### 🔍 Real-Time Soil Monitoring

- Uses a Soil Moisture Sensor to measure moisture levels.
- Moisture readings are categorized into:
  - **Dry**
  - **Normal**
  - **Wet**
- Helps farmers instantly understand soil condition.

### 💧 Automated Irrigation Recommendation

- Based on moisture level:
  - **Dry** → Irrigation Needed
  - **Normal** → Irrigation Optional
  - **Wet** → Irrigation Not Required
- Supports sustainable resource usage.

### 🌿 Plant Recommendation System

- Suggests crops suitable for current soil moisture.
- Helps beginners choose appropriate plants.

### 🌐 Web Dashboard

- Displays live sensor readings.
- Visual moisture level indicators.
- Irrigation and crop recommendations.
- Simple, beginner-friendly UI.

### 🎤 Voice Assistant Integration

- Provides spoken updates like:
  - "Soil is dry, irrigation recommended."
  - "Moisture level normal today."
- Makes agricultural insights accessible to everyone.

### 🖥️ Hardware & Communication

- Arduino board for sensor data acquisition.
- CM05/ESP module (serial communication) for connectivity.
- Data transmitted to web interface in real time.

## 🛠️ Hardware Components

| Component | Purpose |
|-----------|---------|
| Arduino Board | Core microcontroller for data reading & processing |
| Soil Moisture Sensor v1.2 | Detects soil moisture level |
| CM05/ESP Serial Module | Sends sensor data to server/dashboard |
| Jumper Wires & Power Supply | Circuit assembly |

## 📡 System Architecture

1. **Soil Moisture Sensor** → Reads soil condition
2. **Arduino** → Processes sensor data
3. **CM05/ESP** → Sends data to server
4. **Cloud Server/Web App** → Displays soil moisture & recommendations
5. **Voice Assistant** → Delivers guidance via speech

## ⚙️ Software Workflow

1. Arduino collects analog data from moisture sensor.
2. Data is converted into moisture percentage.
3. Categorization logic maps reading → Dry/Normal/Wet.
4. Dashboard displays readings live.
5. AI logic recommends irrigation & possible crops.
6. Voice assistant summarizes daily status to user.

## 🌎 Benefits of AgriSage

- Up to 30% water savings through efficient irrigation.
- Reduced manual checking and errors.
- Increased farmer involvement with real-time interaction.
- Prevents crop stress and boosts yield.
- Encourages sustainable practices and environmental care.

## 🔑 Keywords

Smart Agriculture, Precision Farming, Real-time Monitoring, Automated Irrigation, Voice Assistant, Sustainability, IoT, Arduino

## 📁 Project Structure (Example)

```
/AgriSage
│── Arduino_Code/
│   └── agrisage.ino
│── WebApp/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│── README.md
│── Circuit_Diagram.png
```

## 🚀 Future Enhancements

- Weather-based irrigation prediction
- Mobile app integration
- Multi-sensor support (temperature, humidity, pH)
- AI crop disease detection

