import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { useAppSelector, useAppDispatch } from '@/store';
import { initializeApp } from '@/features/auth/store';
import { notificationService } from '@/services/NotificationService';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { navigate } from './navigationService'; 

export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isAppReady, isFirstLaunch } = useAppSelector((state) => state.auth);
  
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

  if (!isAuthenticated) {
    return <AuthStack isFirstLaunch={isFirstLaunch} />;
  }

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