import { Platform } from 'react-native';
import messaging, { // Import the default messaging instance generator
  requestPermission,
  getToken,
  onTokenRefresh,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  AuthorizationStatus,
  registerDeviceForRemoteMessages,
  RemoteMessage // Updated type for the modular SDK
} from '@react-native-firebase/messaging';

class NotificationService {
  // 1. Initialize the messaging instance once
  private msgInstance = messaging();

  async requestUserPermission(): Promise<boolean> {
    // 2. Pass the instance as the first argument
    const authStatus = await requestPermission(this.msgInstance);
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
        await registerDeviceForRemoteMessages(this.msgInstance);
      }

      const token = await getToken(this.msgInstance);
      console.log('📱 FCM Device Token:', token);
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  listenToTokenRefresh(onTokenRefreshed: (newToken: string) => void) {
    // 3. Explicitly type 'newToken' as string
    return onTokenRefresh(this.msgInstance, (newToken: string) => {
      onTokenRefreshed(newToken);
    });
  }

  setupForegroundListener(onMessageReceived: (message: RemoteMessage) => void) {
    // 4. Explicitly type 'remoteMessage' as RemoteMessage
    return onMessage(this.msgInstance, async (remoteMessage: RemoteMessage) => {
      console.log('📩 New Foreground Message:', remoteMessage);
      onMessageReceived(remoteMessage);
    });
  }

  setupBackgroundTapListener(onNotificationTapped: (message: RemoteMessage) => void) {
    return onNotificationOpenedApp(this.msgInstance, (remoteMessage: RemoteMessage) => {
      console.log('🚀 App opened from background via notification:', remoteMessage);
      onNotificationTapped(remoteMessage);
    });
  }

  async checkInitialNotification(onNotificationTapped: (message: RemoteMessage) => void) {
    const initialNotification = await getInitialNotification(this.msgInstance);
    if (initialNotification) {
      console.log('💀 App opened from quit state via notification:', initialNotification);
      onNotificationTapped(initialNotification);
    }
  }
}

export const notificationService = new NotificationService();