import { Platform } from 'react-native';
import {
  getMessaging,
  requestPermission,
  getToken,
  onTokenRefresh,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
  registerDeviceForRemoteMessages,
  RemoteMessage
} from '@react-native-firebase/messaging';

class NotificationService {

  async requestUserPermission(): Promise<boolean> {
    const authStatus = await requestPermission(getMessaging());
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('FCM Authorization status:', authStatus);
      return true;
    }
    console.log('FCM Notification permission denied');
    return false;
  }

  async getFCMToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'ios') {
        await registerDeviceForRemoteMessages(getMessaging());
      }

      const token = await getToken(getMessaging());
      console.log('📱 FCM Device Token:', token);
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  listenToTokenRefresh(onTokenRefreshed: (newToken: string) => void) {
    return onTokenRefresh(getMessaging(), (newToken: string) => {
      onTokenRefreshed(newToken);
    });
  }

  setupForegroundListener(onMessageReceived: (message: RemoteMessage) => void) {
    return onMessage(getMessaging(), async (remoteMessage: RemoteMessage) => {
      console.log('📩 New Foreground Message:', remoteMessage);
      onMessageReceived(remoteMessage);
    });
  }

  setupBackgroundTapListener(onNotificationTapped: (message: RemoteMessage) => void) {
    return onNotificationOpenedApp(getMessaging(), (remoteMessage: RemoteMessage) => {
      console.log('🚀 App opened from background via notification:', remoteMessage);
      onNotificationTapped(remoteMessage);
    });
  }

  async checkInitialNotification(onNotificationTapped: (message: RemoteMessage) => void) {
    const initialNotification = await getInitialNotification(getMessaging());
    if (initialNotification) {
      console.log('💀 App opened from quit state via notification:', initialNotification);
      onNotificationTapped(initialNotification);
    }
  }
}

export const notificationService = new NotificationService();