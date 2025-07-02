
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [location, setLocation] = useState(null);
  const [lastSent, setLastSent] = useState(null);
  const [sending, setSending] = useState(false);
  const [locationHistory, setLocationHistory] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoHistory, setPhotoHistory] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState('back');
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    const loadPhotos = async () => {
      const storedPhotos = await AsyncStorage.getItem('@photo_history');
      if (storedPhotos) setPhotoHistory(JSON.parse(storedPhotos));
    };
    loadPhotos();

    const interval = setInterval(() => {
      sendLocation();
    }, 180000);  // 3 minutes
    fetchHistory();
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    const stored = await AsyncStorage.getItem('@location_logs');
    if (stored) setLocationHistory(JSON.parse(stored));
  };

   const sendLocation = async () => {
  setSending(true);
  const timestamp = new Date().toISOString();
  try {
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    setLastSent(timestamp); // update immediately

    const newLog = { timestamp, coords: loc.coords };
    const logs = JSON.parse(await AsyncStorage.getItem('@location_logs')) || [];
    logs.push(newLog);
    await AsyncStorage.setItem('@location_logs', JSON.stringify(logs));
    setLocationHistory(logs);

    const network = await Network.getNetworkStateAsync();
    if (!network.isConnected || !network.isInternetReachable) {
      const message = `Offline Location: ${loc.coords.latitude}, ${loc.coords.longitude} at ${timestamp}`;
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(['07925740676'], message);
      }
      Alert.alert("Offline", "No internet - sent location via SMS.");
      return;
    }
try {
      await fetch("https://travel-app-api-three.vercel.app/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      });
      Alert.alert("Success", "Location sent via internet.");
    } catch (error) {
      console.error("Web API failed", error);
    }

//geolocation out of bounds
    const dangerZone = { latitude: 51.5, longitude: -0.1 };
    const distance = Math.sqrt(
      Math.pow(loc.coords.latitude - dangerZone.latitude, 2) +
      Math.pow(loc.coords.longitude - dangerZone.longitude, 2)
    );
    if (distance > 0.01) {
      Alert.alert("Geofence alert", "Device has moved out of the safe zone!");
    }
  } catch (error) {
    console.error("Send location failed:", error);
    Alert.alert("Error", "Failed to send location.");
  } finally {
    setSending(false);
  }
};


  const takePhoto = async () => {
    if (isTakingPhoto || !cameraRef.current?.takePictureAsync) return;
    setIsTakingPhoto(true);
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const photoData = await cameraRef.current.takePictureAsync({ base64: true });
      setPhoto(photoData.uri);
      const timestamp = new Date().toISOString();
      const newEntry = { uri: photoData.uri, timestamp, coords: loc.coords };
      const newHistory = [...photoHistory, newEntry];
      setPhotoHistory(newHistory);
      await AsyncStorage.setItem('@photo_history', JSON.stringify(newHistory));
      setShowCamera(false);

      await fetch("https://travel-app-api-three.vercel.app/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoBase64: photoData.base64, timestamp }),
      });
    } catch (error) {
      console.error("Photo error:", error);
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  if (showCamera) {
    return (
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto} disabled={isTakingPhoto}>
            <Text style={styles.text}>{isTakingPhoto ? "Taking..." : "Take"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setShowCamera(false)}>
            <Text style={styles.text}>Back</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  }

 return (
  <ScrollView contentContainerStyle={styles.container}>
    <StatusBar hidden={false} style="dark" />
    <Text style={styles.title}>Travel App Tracker</Text>
    <Text>
      {location
        ? `Lat: ${location.latitude}, Lon: ${location.longitude}`
        : "Getting location..."}
    </Text>
    <Text>Last Sent: {lastSent || "Never"}</Text>
    <Button
  title={sending ? "Sending..." : "Send Now"}
  onPress={sendLocation}
  disabled={sending}/>

    <View style={{ marginVertical: 10 }} />
    <Button title="Open Camera" onPress={() => setShowCamera(true)} />

    {photo && (
      <>
        <Text style={styles.subtitle}>Last Photo Taken:</Text>
        <Image source={{ uri: photo }} style={styles.image} />
      </>
    )}

    <Text style={styles.subtitle}>Location History:</Text>
    <Button title="Clear All Locations" color="crimson" onPress={() => {
      Alert.alert("Clear All Locations", "Are you sure you want to delete all location logs?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All", style: "destructive", onPress: async () => {
            await AsyncStorage.removeItem('@location_logs');
            setLocationHistory([]);
          }
        }
      ]);
    }} />
    {locationHistory.map((entry, index) => (
      <View key={index} style={styles.entryItem}>
        <Text>{`${entry.timestamp}\nLat: ${entry.coords.latitude}, Lon: ${entry.coords.longitude}`}</Text>
        <Button title="Delete" onPress={() => {
          Alert.alert("Delete", "Delete this location?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete", style: "destructive", onPress: async () => {
                const updated = locationHistory.filter((_, i) => i !== index);
                setLocationHistory(updated);
                await AsyncStorage.setItem('@location_logs', JSON.stringify(updated));
              }
            }
          ]);
        }} />
      </View>
    ))}

    <Text style={styles.subtitle}>Photo History:</Text>
    <Button title="Clear All Photos" color="crimson" onPress={() => {
      Alert.alert("Clear All Photos", "Are you sure you want to delete all photos?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All", style: "destructive", onPress: async () => {
            await AsyncStorage.removeItem('@photo_history');
            setPhotoHistory([]);
          }
        }
      ]);
    }} />
    {photoHistory.map((entry, index) => (
      <View key={index} style={styles.entryItem}>
        <Image source={{ uri: entry.uri }} style={styles.historyImage} />
        <Text style={{ fontSize: 12 }}>{`${entry.timestamp}\nLat: ${entry.coords.latitude}, Lon: ${entry.coords.longitude}`}</Text>
        <Button title="Delete" onPress={() => {
          Alert.alert("Delete", "Delete this photo?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete", style: "destructive", onPress: async () => {
                const updated = photoHistory.filter((_, i) => i !== index);
                setPhotoHistory(updated);
                await AsyncStorage.setItem('@photo_history', JSON.stringify(updated));
              }
            }
          ]);
        }} />
      </View>
    ))}
  </ScrollView>
);


}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D6ECFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#004B8D'
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#004B8D'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10
  },
  entryItem: {
    marginBottom: 10,
    alignItems: 'center'
  },
  historyImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#007ACC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600'
  }
});
