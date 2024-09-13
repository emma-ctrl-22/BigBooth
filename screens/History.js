import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_URLS } from '../apiConfig'; // Ensure this path is correct

export default function History() {
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchRideHistory = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
    
      if (!user) {
        Alert.alert('Error', 'No user found in storage');
        return;
      }
      const parsedUser = JSON.parse(user);
      const userId = parsedUser.id;
      console.log('User ID:', userId);

      const response = await fetch(`${API_URLS.getUserHistory}/${userId}`);
      console.log(response.data,'response');
      if (!response.ok) {
        throw new Error('Failed to fetch ride history');
      }

      const data = await response.json();
      console.log(data,'data');
      setRideHistory(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'token']);
      // Optionally, you can navigate the user back to the login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading state when the screen is focused
      fetchRideHistory();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.rideItem}>
      <View style={styles.row}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{item.pickupLocation.latitude}, {item.pickupLocation.longitude}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{item.dropoffLocation.latitude}, {item.dropoffLocation.longitude}</Text>
      </View>
      {/* <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View> */}
       <View style={styles.row}>
        <Text style={styles.label}>Arrival:</Text>
        <Text style={styles.value}>{item.arrived === 'true' ? 'Yes' : 'No'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cost:</Text>
        <Text style={styles.value}>${item.price}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Distance:</Text>
        <Text style={styles.value}>{item.distance} km</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Driver:</Text>
        <Text style={styles.value}>{item.driverName} ({item.driverEmail})</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Ride History</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={rideHistory.slice().reverse()}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  rideItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#555',
  },
});
