import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps-expo';
import * as Location from 'expo-location'; // For getting user location
import { API_URLS } from '../apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [route, setRoute] = useState({});
    const [showSlider, setShowSlider] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [driverDetails, setDriverDetails] = useState(null);
    const [userId, setUserId] = useState(null);
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const user = await AsyncStorage.getItem('user');
          if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser && parsedUser.id) {
              setUserId(parsedUser.id);
              console.log('User ID:', parsedUser.id);
            } else {
              Alert.alert('Error', 'No user found in storage');
            }
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch user from storage');
        }
      };
  
      fetchUser();
    }, []);
  
    const placeOrder = async () => {
      if (!currentLocation || !destination || !userId) return;
  
      setLoading(true);
      try {
        const response = await fetch(API_URLS.sendOrder, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            pickupLocation: currentLocation,
            dropoffLocation: destination,
            price: route.price,
            distance: route.distance,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to place order');
        }
  
        const data = await response.json();
        console.log('Order response:', data);
        setLoading(false);
        setOrderPlaced(true);
        if (data.order && data.order.driver) {
          setDriverDetails(data.order.driver);
          console.log('Driver details:', data.order.driver);
        } else {
          console.log('No driver details in the response');
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', error.message);
      }
    };

  // Calculate distance between two locations
  const calculateDistance = (loc1, loc2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.latitude * Math.PI) / 180) *
        Math.cos((loc2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Handle map press to set current location and destination
  const handleMapPress = (e) => {
    if (!currentLocation) {
      setCurrentLocation(e.nativeEvent.coordinate);
    } else if (!destination) {
      setDestination(e.nativeEvent.coordinate);
      setShowSlider(true);
      const distance = calculateDistance(currentLocation, e.nativeEvent.coordinate);
      const price = (distance * 1.5).toFixed(2); // Assuming price is 1.5 per km
      setRoute({
        distance: distance.toFixed(2),
        price: price,
      });
    }
  };

  return (
    <View style={styles.container}>
    <MapView
      style={styles.map}
      onPress={handleMapPress}
      initialRegion={{
        latitude: 5.6037,
        longitude: -0.1870,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {currentLocation && <Marker coordinate={currentLocation} title="Current Location" />}
      {destination && <Marker coordinate={destination} title="Destination" />}
      {currentLocation && destination && (
        <Polyline
          coordinates={[currentLocation, destination]}
          strokeColor="#000"
          strokeWidth={3}
        />
      )}
    </MapView>

    {!showSlider && !currentLocation && (
      <View style={styles.floatingView}>
        <Text style={styles.floatingText}>
          Click on the map to select your current location, then press Order
        </Text>
      </View>
    )}

    {currentLocation && !destination && (
      <View style={styles.orderButtonContainer}>
        <Button title="Order" onPress={() => setShowSlider(true)} />
      </View>
    )}

    {showSlider && !orderPlaced && (
      <View style={styles.slider}>
        <Text style={styles.sliderText}>Pick your destination on the map!</Text>
        {destination && (
          <>
            <Text style={styles.sliderText}>Distance: {route.distance} km</Text>
            <Text style={styles.sliderText}>Price: ${route.price}</Text>
            <TouchableOpacity style={styles.placeOrderButton} onPress={placeOrder}>
              <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    )}

    {loading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Placing your order...</Text>
      </View>
    )}

    {orderPlaced && (
      <View style={styles.slider}>
        <Text style={styles.sliderText}>Order sent!</Text>
        {driverDetails ? (
          <>
            <Text style={styles.sliderText}>Driver Name: {driverDetails.name}</Text>
            <Text style={styles.sliderText}>Driver Email: {driverDetails.email}</Text>
          </>
        ) : (
          <Text style={styles.sliderText}>Waiting for driver assignment...</Text>
        )}
      </View>
    )}
  </View>
);
};

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  floatingView: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  floatingText: {
    fontSize: 16,
    color: '#333',
  },
  orderButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
  slider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  sliderText: {
    fontSize: 18,
    marginVertical: 5,
  },
  placeOrderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
