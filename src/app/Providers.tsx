import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { RootNavigator } from '../navigation/RootNavigator';
import { notificationService } from '@/services/NotificationService';
import { navigationRef } from '../navigation/navigationService'; 

const NotificationManager = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    let unsubscribeForeground: () => void;
    let unsubscribeTokenRefresh: () => void;

    const setupFCM = async () => {
      const hasPermission = await notificationService.requestUserPermission();
      
      if (hasPermission) {
        await notificationService.getFCMToken();
        
        unsubscribeTokenRefresh = notificationService.listenToTokenRefresh((newToken) => {
           console.log('FCM Token Refreshed:', newToken);
        });

        unsubscribeForeground = notificationService.setupForegroundListener((message) => {
          console.log('FCM Message Received:', message);
        });
      }
    };

    setupFCM();

    return () => {
      if (unsubscribeForeground) unsubscribeForeground();
      if (unsubscribeTokenRefresh) unsubscribeTokenRefresh();
    };
  }, []);

  return <>{children}</>;
};

export const Providers = () => {
  return (
    <Provider store={store}>
      <NotificationManager>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
        </NavigationContainer>
      </NotificationManager>
    </Provider>
  );
};