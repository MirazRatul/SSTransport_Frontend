import { PermissionsAndroid, Platform } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import apiClient from '../api/api';

type ChatNotificationPayload = {
  receiverId: string;
  conversationId: string;
  messageId: string;
  text: string;
};

const FCM_TOKEN_ENDPOINT = '/devices/fcm-token';
const CHAT_NOTIFICATION_ENDPOINT = '/notifications/chat';

const requestAndroidNotificationPermission = async () => {
  if (Platform.OS !== 'android' || Number(Platform.Version) < 33) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
};

const requestMessagingPermission = async () => {
  const androidPermissionGranted = await requestAndroidNotificationPermission();
  if (!androidPermissionGranted) return false;

  const status = await messaging().requestPermission();

  return (
    status === messaging.AuthorizationStatus.AUTHORIZED ||
    status === messaging.AuthorizationStatus.PROVISIONAL
  );
};

const sendFcmTokenToBackend = async (token: string) => {
  if (!auth().currentUser?.uid) return;

  await apiClient.post(FCM_TOKEN_ENDPOINT, {
    token,
    platform: Platform.OS,
  });
};

export const registerForPushNotifications = async () => {
  try {
    if (!auth().currentUser?.uid) return null;

    const permissionGranted = await requestMessagingPermission();
    if (!permissionGranted) return null;

    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }

    const token = await messaging().getToken();

    if (token) {
      await sendFcmTokenToBackend(token);
    }

    return token;
  } catch (error) {
    console.log('Push notification registration error:', error);
    return null;
  }
};

export const subscribeToFcmTokenRefresh = () => {
  return messaging().onTokenRefresh(async token => {
    try {
      await sendFcmTokenToBackend(token);
    } catch (error) {
      console.log('FCM token refresh error:', error);
    }
  });
};

export const subscribeToForegroundMessages = (
  onMessage?: (message: FirebaseMessagingTypes.RemoteMessage) => void,
) => {
  return messaging().onMessage(async remoteMessage => {
    onMessage?.(remoteMessage);
  });
};

export const subscribeToNotificationOpenEvents = (
  onOpen: (message: FirebaseMessagingTypes.RemoteMessage) => void,
) => {
  return messaging().onNotificationOpenedApp(onOpen);
};

export const handleInitialNotification = async (
  onOpen: (message: FirebaseMessagingTypes.RemoteMessage) => void,
) => {
  const remoteMessage = await messaging().getInitialNotification();

  if (remoteMessage) {
    onOpen(remoteMessage);
  }
};

export const setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background push notification:', remoteMessage.messageId);
  });
};

export const notifyChatMessage = async (payload: ChatNotificationPayload) => {
  try {
    await apiClient.post(CHAT_NOTIFICATION_ENDPOINT, payload);
  } catch (error) {
    console.log('Chat notification request error:', error);
  }
};
