import {
  createNavigationContainerRef,
  ParamListBase,
} from '@react-navigation/native';

type ChatNotificationData = {
  type?: string;
  senderId?: string;
  senderName?: string;
  senderImage?: string;
  senderRole?: string;
};

type ChatRouteParams = {
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
  receiverRole: string;
};

export const navigationRef = createNavigationContainerRef<ParamListBase>();

let pendingChatParams: ChatRouteParams | null = null;

const getStringValue = (value: unknown) => {
  return typeof value === 'string' && value.trim() ? value : undefined;
};

const getChatParamsFromNotificationData = (
  data?: Record<string, unknown>,
): ChatRouteParams | null => {
  const notificationData = data as ChatNotificationData | undefined;

  if (notificationData?.type !== 'chat') return null;

  const senderId = getStringValue(notificationData.senderId);
  if (!senderId) return null;

  return {
    receiverId: senderId,
    receiverName: getStringValue(notificationData.senderName) || 'Admin',
    receiverImage: getStringValue(notificationData.senderImage),
    receiverRole: getStringValue(notificationData.senderRole) || 'Admin',
  };
};

export const openChatFromNotificationData = (
  data?: Record<string, unknown>,
) => {
  const chatParams = getChatParamsFromNotificationData(data);
  if (!chatParams) return false;

  if (navigationRef.isReady()) {
    navigationRef.navigate('ChatScreen', chatParams);
    return true;
  }

  pendingChatParams = chatParams;
  return true;
};

export const flushPendingNotificationNavigation = () => {
  if (!pendingChatParams || !navigationRef.isReady()) return;

  const chatParams = pendingChatParams;
  pendingChatParams = null;
  navigationRef.navigate('ChatScreen', chatParams);
};
