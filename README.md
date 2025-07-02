# Travel App Tracker

A React Native mobile app for travellers that sends recurring geolocation data to a monitoring system via web API or SMS (offline fallback). Works reliably in low-signal areas. Features geofencing, photo capture with timestamp and GPS tagging, and persistent offline storage.

## 📖 Table of Contents
- [📦 Features](#-features)
- [🧪 Technologies Used](#-technologies-used)
- [🚀 Getting Started](#-getting-started)
- [📱 App Usage](#-app-usage)
- [🌐 Backend API](#-backend-api)
- [📁 Project Structure](#-project-structure)

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

**Backend**
- Serverless function (`api/location.js`) deployed on **Vercel**

## 🚀 Getting Started

### 🔧 Installation and Setup

To run the app locally on your device:

#### 1. Install Required Tools

Make sure you have the following:

- [Node.js](https://nodejs.org)
- [Git](https://git-scm.com)
- Expo Go App on your mobile:
  - [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS (App Store)](https://apps.apple.com/us/app/expo-go/id982107779)

> 📎 Optionally, preview the app on Expo Snack:  
> [Expo Snack Project (read-only)](https://snack.expo.dev/@desirayx/assessment)

#### 2. Clone the Repository

```bash
git clone https://github.com/Desirayx/travel-app-api.git
cd travel-app-api/client
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Start the App
To run the mobile app:
```bash
npx expo start
```
#### 5. Run the App on Your Phone
Open the Expo Go app on your phone.

Scan the QR code that appears in your browser.

The app will open on your phone, ready to use!

## 📱 App Usage
Once the app is open on your device, here’s how to navigate it:

#### 📍 Sending Your Location
- Press the “SEND NOW” button.
- The app will get your current GPS coordinates and try to send them to the internet server.
- If internet isn’t available, it will automatically send the location via SMS instead.
- You’ll see a popup confirming either:
  -  ✅ “Location sent via internet.” or
  -  📱 “No internet – sent location via SMS.”



#### 📷 Taking a Photo with GPS Tag
Tap “OPEN CAMERA”.
- You'll see a camera view with buttons to Flip, Take, or Go Back.
- Tap “Take” to capture a photo. The app will:
  - Save the image
  - Attach your GPS location and timestamp
  - Store it locally
  - Send it to the backend server

#### 🧾 Viewing Last Photo and History
Below the main buttons, the app shows:
- Last Photo Taken
- Location History
- Photo History
Each history item shows the timestamp and latitude/longitude where it was taken.


#### 🚨 Geofencing Alerts
If you move too far away from the defined safe zone, the app will show a Geofence alert like this:
```bash
Geofence alert:
Device has moved out of the safe zone!
```
#### 🧹 Clear All History
You can delete all saved locations or photos by pressing:
- “CLEAR ALL LOCATIONS”
- “CLEAR ALL PHOTOS”

The app will ask for confirmation before deleting anything.

## Backend API
This app uses a Vercel Serverless Function to receive location/photo data.
### Endpoint:

```http
POST /api/location
```
### Body Example:

```json
{
  "timestamp": "2024-06-06T12:00:00.000Z",
  "coords": {
    "latitude": 51.509865,
    "longitude": -0.118092
  },
  "photoBase64": "..."
}
```
Hosted at: https://travel-app-api-three.vercel.app/api/location

##  📁 Project Structure
This repository contains both the mobile app frontend and the backend function.
```go
📂 travel-app-api/
├── client/               # React Native (Expo) mobile app
│   ├── App.js
│   ├── components/
│   ├── assets/
│   └── ...
├── api/                  # Serverless backend (Vercel Function)
│   └── location.js
└── README.md             # This documentation
