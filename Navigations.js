import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Navigations() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Regularly check for token and user in AsyncStorage
  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        // console.log(user)
        // console.log(token)
        
        setUserToken(token);
        setUserInfo(user ? JSON.parse(user) : null);
      } catch (error) {
        console.log('Error reading token or user from AsyncStorage:', error);
      } finally {
        setIsLoading(false); // Ensure loading state is false after the check
      }
    };

    // Call the check function once and set an interval for checking regularly
    checkUserToken();

    const interval = setInterval(checkUserToken, 1000); // Poll every second

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderAppStack = () => {
    if (userInfo?.isDriver) {
      return <AppStack initialRouteName="DriverTabs" />;
    } else {
      return <AppStack initialRouteName="Tabs" />;
    }
  };

  return (
    <NavigationContainer>
      {userToken ? renderAppStack() : <AuthStack />}
    </NavigationContainer>
  );
}
