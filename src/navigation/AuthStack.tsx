import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '@/features/auth/ui/WelcomeScreen';
import { LoginScreen } from '@/features/auth/ui/LoginScreen';
import { SignupScreen } from '@/features/auth/ui/SignupScreen';
import { OTPScreen } from '@/features/auth/ui/OTPScreen';
import { ForgotPasswordScreen } from '@/features/auth/ui/ForgotPasswordScreen';
import { SuccessScreen } from '@/features/auth/ui/SuccessScreen';
import { AuthStackParamList } from './types';
import { NewPasswordScreen } from '@/features/auth/ui/NewPasswordScreen';
import { ProductDetailScreen } from '@/features/product/productDetail/ui/ProductDetailScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Accept the isFirstLaunch prop (default to true just in case)
export const AuthStack = ({ isFirstLaunch = true }: { isFirstLaunch?: boolean }) => {
  return (
    <Stack.Navigator
      // This is the magic line: it decides where the stack begins
      initialRouteName={isFirstLaunch ? 'Welcome' : 'Login'}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', 
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
};