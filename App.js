import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar'; // Add this import
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import CryptoDetailScreen from './src/screens/CryptoDetailScreen';
import SplashScreen from './src/screens/SplashScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Home
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CryptoDetail" 
        component={CryptoDetailScreen}
        options={({ route }) => ({
          title: route.params?.crypto?.name || 'Details',
          headerStyle: { 
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
          headerTintColor: '#1C1C1E',
          headerTitleStyle: { 
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator for Search
const SearchStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SearchMain" 
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CryptoDetail" 
        component={CryptoDetailScreen}
        options={({ route }) => ({
          title: route.params?.crypto?.name || 'Details',
          headerStyle: { 
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
          headerTintColor: '#1C1C1E',
          headerTitleStyle: { 
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator for Watchlist
const WatchlistStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="WatchlistMain" 
        component={WatchlistScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CryptoDetail" 
        component={CryptoDetailScreen}
        options={({ route }) => ({
          title: route.params?.crypto?.name || 'Details',
          headerStyle: { 
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
          headerTintColor: '#1C1C1E',
          headerTitleStyle: { 
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator for Portfolio
const PortfolioStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PortfolioMain" 
        component={PortfolioScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CryptoDetail" 
        component={CryptoDetailScreen}
        options={({ route }) => ({
          title: route.params?.crypto?.name || 'Details',
          headerStyle: { 
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
          headerTintColor: '#1C1C1E',
          headerTitleStyle: { 
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
};

// Custom Tab Navigator with Safe Area handling
const TabNavigatorWithSafeArea = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Watchlist') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Portfolio') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Your app's tab bar - white
          borderTopColor: '#E5E5EA',
          borderTopWidth: 0.5,
          // Critical fix for Android navigation bar overlap
          paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 15) + 10 : Math.max(insets.bottom, 8),
          paddingTop: 8,
          // Adjust height to accommodate Android navigation bar
          height: Platform.OS === 'android' ? 70 + Math.max(insets.bottom, 15) : 65 + Math.max(insets.bottom, 8),
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 10, // Higher elevation to appear above system nav bar
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
          marginBottom: Platform.OS === 'android' ? 2 : 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        headerTintColor: '#1C1C1E',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator}
        options={{ 
          headerShown: false,
          title: 'Home'
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchStackNavigator}
        options={{ 
          headerShown: false,
          title: 'Search'
        }}
      />
      <Tab.Screen 
        name="Watchlist" 
        component={WatchlistStackNavigator}
        options={{ 
          headerShown: false,
          title: 'Watchlist'
        }}
      />
      <Tab.Screen 
        name="Portfolio" 
        component={PortfolioStackNavigator}
        options={{ 
          headerShown: false,
          title: 'Portfolio'
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
 const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds splash screen

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <TabNavigatorWithSafeArea />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
