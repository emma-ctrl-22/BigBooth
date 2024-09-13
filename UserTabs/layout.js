import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeIcon,ChatBubbleLeftIcon,ClockIcon } from 'react-native-heroicons/outline';// Assuming you are using Expo, change this if not

import HomeScreen from '../screens/HomeScreen';
import History from '../screens/History';
import ChatStackScreen from '../screens/ChatBotScreen';

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    height: '10%',
    elevation: 0.1,
    backgroundColor: '#1c3530',
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
  },
  tabBarActiveTintColor:"white"
};

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={screenOptions}
      tabBarActiveTint
    >
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ color, size }) => (
          <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:"25%" }}>
            <ClockIcon color="white" size={size} />
          </View>
          ),
        }}
      />   
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:"25%" }}>
              <HomeIcon color="white" size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackScreen} 
        initialRouteName="Channel"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' ,marginTop:"25%"}}>
              <ChatBubbleLeftIcon color="white" size={size} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;