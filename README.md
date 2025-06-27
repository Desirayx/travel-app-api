# Travel App Tracker

React Native app for traveling and sending recurring geolocation data to a monitoring server via web API or SMS (fallback when offline). Works in low-signal areas. Geofencing. Picture taking with auto-stamping with timestamp and GPS location data. Offline-first capabilities.

## 📦 Features

- 🔄 Sends GPS location to an API or SMS every 3 minutes.
- 🌐 Sends data to web API if internet connection available.
- 📱 Falls back to SMS when internet is unavailable.
- 📷 Take pictures that are automatically timestamped and geotagged.
- 🧭 Geofencing: in/out of safe zone alerts with audio.
- 🧠 AsyncStorage used for storing persistent on-device data.
- 🔧 Full create/read/update/delete support for data on device.
- 🗃️ Local history of taken pictures and locations.

## 🧪 Technologies Used

- React Native (via Expo)
- `expo-camera`
- `expo-location`
- `expo-sms`
- `expo-network`
- `@react-native-async-storage/async-storage`
- Express.js (backend API)
- Vercel (hosting backend API)

## 🚀 Getting Started

### Prerequisites

- Node.js
- Expo CLI
- Git

### Installation

```bash
git clone https://github.com/Desirayx/travel-app-api.git
cd travel-app-api
npm install
npx expo start

## Backend API

The backend receives and stores GPS and photo data.
