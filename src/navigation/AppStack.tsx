import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTabs } from './AppTabs';
import { ProductDetailScreen } from '@/features/product/productDetail/ui/ProductDetailScreen';
import { AppStackParamList } from './types';
import { CheckoutScreen } from '@/features/checkout/ui/CheckoutScreen';
import { SurveyScreen } from '@/features/service/Survey/ui/SurveyScreen';
import { DeliveryScreen } from '@/features/service/delivery/ui/DeliveryScreen';
import { EmergencyScreen } from '@/features/service/emergency/ui/EmergencyScreen';
import { SettingsScreen } from '@/features/settings/ui/SettingsScreen';
import { EditProfileScreen } from '@/features/profile/ui/EditProfileScreen';
import { OrdersScreen } from '@/features/orders/ui/OrdersScreen';
import { AddressesScreen } from '@/features/addresses/ui/AddressesScreen';
import { PaymentsScreen } from '@/features/payments/ui/PaymentsScreen';
import { SupportScreen } from '@/features/support/ui/SupportScreen';
import { NotificationsScreen } from '@/features/notifications/ui/NotificationsScreen';
import { SecurityScreen } from '@/features/security/ui/SecurityScreen';
import { SuccessScreen } from '@/features/checkout/ui/SuccessScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const  AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={AppTabs} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Survey" component={SurveyScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="Delivery" component={DeliveryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
};
