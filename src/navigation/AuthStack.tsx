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

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Smooth modern transition
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
