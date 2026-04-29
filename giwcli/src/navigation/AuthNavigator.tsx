import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import AdminTabs from './AdminTabs';
import BuyerTabs from './BuyerTabs';
import SellerTabs from './SellerTabs';

// Types - Three roles: admin, buyer, seller
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Admin: undefined;
  BuyerHome: undefined;
  SellerDiamond: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Authentication Navigator
 * Handles navigation between auth screens and protected app screens
 *
 * Role-based routing:
 * - admin → Admin panel
 * - buyer → Buyer/Home
 * - seller → Seller/Diamond
 */
const AuthNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFF' },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack - accessible when not authenticated
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
          </>
        ) : (
          // App Stack - accessible when authenticated
          // Role-based routing
          <>
            {role === 'admin' && (
              <Stack.Screen name="Admin" component={AdminTabs} />
            )}
            {role === 'buyer' && (
              <Stack.Screen name="BuyerHome" component={BuyerTabs} />
            )}
            {role === 'seller' && (
              <Stack.Screen name="SellerDiamond" component={SellerTabs} />
            )}
            {/* Fallback for unknown role - default to buyer */}
            {!role ||
              (role !== 'admin' && role !== 'buyer' && role !== 'seller' && (
                <Stack.Screen name="BuyerHome" component={BuyerTabs} />
              ))}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
  },
});

export default AuthNavigator;
