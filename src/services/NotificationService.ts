import { Platform } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

class NotificationService {
  async requestUserPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ FCM Authorization status:', authStatus);
      return true;
    }
    console.log('❌ FCM Notification permission denied');
    return false;
  }

  async getFCMToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'ios') {
        // Required for iOS before retrieving the token
        await messaging().registerDeviceForRemoteMessages();
      }

      const token = await messaging().getToken();
      console.log('📱 FCM Device Token:', token);
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  listenToTokenRefresh(onTokenRefreshed: (newToken: string) => void) {
    return messaging().onTokenRefresh((newToken: string) => {
      onTokenRefreshed(newToken);
    });
  }

  setupForegroundListener(onMessageReceived: (message: FirebaseMessagingTypes.RemoteMessage) => void) {
    return messaging().onMessage(async (remoteMessage) => {
      console.log('📩 New Foreground Message:', remoteMessage);
      onMessageReceived(remoteMessage);
    });
  }

  setupBackgroundTapListener(onNotificationTapped: (message: FirebaseMessagingTypes.RemoteMessage) => void) {
    return messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('🚀 App opened from background via notification:', remoteMessage);
      onNotificationTapped(remoteMessage);
    });
  }

  async checkInitialNotification(onNotificationTapped: (message: FirebaseMessagingTypes.RemoteMessage) => void) {
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      console.log('💀 App opened from quit state via notification:', initialNotification);
      onNotificationTapped(initialNotification);
    }
  }
}

export const notificationService = new NotificationService();