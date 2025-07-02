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

### 🔧 Installation and Setup
To get the app running on your own device, follow these steps:

#### 1. Install Required Tools
Make sure you have these installed on your computer:

- Node.js – This lets you run JavaScript tools. Download from: https://nodejs.org
- Git – Used to download (clone) the project code. Download from: https://git-scm.com
- Expo Go App (on your phone) – Lets you preview the app easily.
- Android: Google Play Store – Expo Go  Download from: https://play.google.com/store/apps/details?id=host.exp.exponent
- iPhone: App Store – Expo Go  Download from: https://apps.apple.com/us/app/expo-go/id982107779
- link to the expo code https://snack.expo.dev/@desirayx/assessment
- Vercel link https://vercel.com/desirayxs-projects/travel-app-api
#### 2. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/Desirayx/travel-app-api.git
cd travel-app-api
```
This copies the app source code to your computer.

#### 3. Install Dependencies
Inside the project folder, run:
```bash
npm install
```
This installs all necessary libraries the app needs.

#### 4. Start the App
To run the mobile app:
```bash
cd client
npm install
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
The backend receives and stores GPS and photo data.
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
This repo contains both backend (API) and frontend (Expo app):
```go
📂 travel-app/
├── api/                 # Express backend API (deployed to Vercel)
│   └── location.js     
├── client/              # React Native frontend app (runs on Expo)
│   ├── App.js
│   ├── components/
│   └── ...
└── README.md            # Project documentation
