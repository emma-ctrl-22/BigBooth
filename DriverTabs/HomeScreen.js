import React, { useState, useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URLS } from '../apiConfig';
import { BottomSheet } from 'react-native-btr'; // You can use any bottom sheet library of your choice

export default function HomeScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

    useEffect(() => {
        const fetchDriverIdAndOrders = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                if (user) {
                    const parsedUser = JSON.parse(user);
                    const driverId = parsedUser.id;

                    if (driverId) {
                        const fetchOrders = async () => {
                            try {
                                const response = await fetch(`${API_URLS.getDriverOrders}/${driverId}`);
                                if (!response.ok) {
                                    throw new Error('Failed to fetch orders');
                                }
                                const data = await response.json();
                                setOrders(data);
                                setLoading(false);
                            } catch (error) {
                                console.error(error);
                                setLoading(false);
                            }
                        };

                        fetchOrders(); // Initial fetch
                        const interval = setInterval(fetchOrders, 1000); // Poll every second
                        return () => clearInterval(interval); // Cleanup interval on unmount
                    } else {
                        console.error('Driver ID not found in user object');
                        setLoading(false);
                    }
                } else {
                    console.error('User not found in AsyncStorage');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch driver ID or orders:', error);
                setLoading(false);
            }
        };

        fetchDriverIdAndOrders();
    }, []);

    const handleMarkerPress = (order) => {
        setSelectedOrder(order);
        setBottomSheetVisible(true);
    };

    const handleAcceptOrder = async () => {
        try {
            const response = await fetch(`${API_URLS.updateOrderStatus}/${selectedOrder._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'accepted' }),
            });
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
            const data = await response.json();
            console.log(data);
            // Update the orders state or refetch orders here if necessary
            setSelectedOrder({ ...selectedOrder, status: 'accepted' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleArrived = async () => {
        try {
            const response = await fetch(`${API_URLS.updateArrivalStatus}/${selectedOrder._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ arrived: true }), // Update the field to 'arrived' (you may need to adjust based on your schema)
            });
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
            const data = await response.json();
            console.log(data);
            // Update the orders state or refetch orders here if necessary
            setSelectedOrder({ ...selectedOrder, arrived: true });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825, // Default latitude
                    longitude: -122.4324, // Default longitude
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {orders.map(order => (
                    <Marker
                        key={order._id}
                        coordinate={{
                            latitude: order.pickupLocation.latitude,
                            longitude: order.pickupLocation.longitude,
                        }}
                        title={`Order ${order._id}`}
                        description={`Price: $${order.price}`}
                        onPress={() => handleMarkerPress(order)}
                    />
                ))}
            </MapView>

            {selectedOrder && (
                <BottomSheet
                    visible={bottomSheetVisible}
                    onBackButtonPress={() => setBottomSheetVisible(false)}
                    onBackdropPress={() => setBottomSheetVisible(false)}
                >
                    <View style={styles.bottomSheet}>
                        <Text style={styles.orderText}>Order ID: {selectedOrder._id}</Text>
                        <Text style={styles.orderText}>Pickup Location: {selectedOrder.pickupLocation.latitude}, {selectedOrder.pickupLocation.longitude}</Text>
                        <Text style={styles.orderText}>Dropoff Location: {selectedOrder.dropoffLocation.latitude}, {selectedOrder.dropoffLocation.longitude}</Text>
                        <Text style={styles.orderText}>Price: ${selectedOrder.price}</Text>
                        <Text style={styles.orderText}>Status: {selectedOrder.status}</Text>
                        <Text style={styles.orderText}>Name: {selectedOrder.user.name}</Text>

                        {selectedOrder.status === 'pending' && (
                            <TouchableOpacity style={styles.button} onPress={handleAcceptOrder}>
                                <Text style={styles.buttonText}>Accept</Text>
                            </TouchableOpacity>
                        )}
                        {selectedOrder.status === 'accepted' && !selectedOrder.arrived && (
                            <TouchableOpacity style={styles.button} onPress={handleArrived}>
                                <Text style={styles.buttonText}>Arrived</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </BottomSheet>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    bottomSheet: {
        height:"40%",
        backgroundColor: 'white',
        padding: 20,
    },
    orderText: {
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});
