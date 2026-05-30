import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { UpdateMemberScreen } from '@/features/auth/ui/UpdateMemberScreen';
import { useAppSelector, useAppDispatch } from '@/store';
import { initializeApp } from '@/features/auth/store/authThunks';
import { notificationService } from '@/services/NotificationService';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { navigate } from './navigationService'; 

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isAppReady, isFirstLaunch, user } = useAppSelector((state) => state.auth);
  
  const [pendingRoute, setPendingRoute] = useState<{ name: string; params?: any } | null>(null);

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  useEffect(() => {
    const handleNotificationRoute = (message: FirebaseMessagingTypes.RemoteMessage) => {
      const routeType = message.data?.type;
      
      if (routeType === 'product' && message.data?.product_id) {
        const routeData = { 
          name: 'ProductDetail', 
          params: { product: { id: message.data.product_id } } 
        };
        
        if (isAppReady && isAuthenticated) {
          navigate(routeData.name, routeData.params);
        } else {
          setPendingRoute(routeData);
        }
      }
    };

    const unsubscribeBackground = notificationService.setupBackgroundTapListener(handleNotificationRoute);
    notificationService.checkInitialNotification(handleNotificationRoute);

    return () => unsubscribeBackground();
  }, [isAppReady, isAuthenticated]);

  useEffect(() => {
    if (isAppReady && isAuthenticated && pendingRoute) {
      setTimeout(() => {
        navigate(pendingRoute.name, pendingRoute.params);
        setPendingRoute(null); 
      }, 100);
    }
  }, [isAppReady, isAuthenticated, pendingRoute]);

  if (!isAppReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  // 1. Unauthenticated -> Show Auth Stack
  if (!isAuthenticated || !user) {
    return <AuthStack isFirstLaunch={isFirstLaunch} />;
  }

  // 2. STRICT GATEKEEPER: Check if Member ID is missing, empty, or literally "null"
  const needsMemberIdUpdate = 
    !user.member_id || 
    String(user.member_id).trim() === '' || 
    String(user.member_id).toLowerCase() === 'null';

  if (needsMemberIdUpdate) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UpdateMember" component={UpdateMemberScreen} />
      </Stack.Navigator>
    );
  }

  // 3. Fully Authenticated & Verified -> Load Main App Stack
  return <AppStack />; 
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});