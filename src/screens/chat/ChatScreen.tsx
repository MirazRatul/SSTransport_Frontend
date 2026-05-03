import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Send, User } from 'lucide-react-native';
import { scale as s, vs } from 'react-native-size-matters';
import AppText from '../../components/AppText';
import CommonHeader from '../../components/CommonHeader';
import { container } from '../../constants/container';
import { AppColors } from '../../styles/colors';

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt?: any;
}

const getChatId = (firstUserId: string, secondUserId: string) => {
  return [firstUserId, secondUserId].sort().join('_');
};

const formatTime = (createdAt?: any) => {
  const date = createdAt?.toDate?.();
  if (!date) return '';

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ChatScreen = ({ route }: any) => {
  const { receiverId, receiverName, receiverImage, receiverRole } =
    route.params || {};
  const insets = useSafeAreaInsets();
  const currentUser = auth().currentUser;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [receiverLastSeen, setReceiverLastSeen] = useState<number | null>(null); // ← NEW

  const conversationId = useMemo(() => {
    if (!currentUser?.uid || !receiverId) return null;
    return getChatId(currentUser.uid, receiverId);
  }, [currentUser?.uid, receiverId]);

  const conversationRef = useMemo(() => {
    if (!conversationId) return null;
    return firestore().collection('conversations').doc(conversationId);
  }, [conversationId]);

  const ensureConversation = useCallback(async () => {
    if (!conversationRef || !currentUser?.uid || !receiverId) return;

    await conversationRef.set(
      {
        participants: [currentUser.uid, receiverId],
        participantDetails: {
          [currentUser.uid]: {
            name: currentUser.displayName || currentUser.email || 'You',
            email: currentUser.email || null,
          },
          [receiverId]: {
            name: receiverName || 'Admin',
            image: receiverImage || null,
            role: receiverRole || null,
          },
        },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }, [
    conversationRef,
    currentUser?.displayName,
    currentUser?.email,
    currentUser?.uid,
    receiverId,
    receiverImage,
    receiverName,
    receiverRole,
  ]);

  // ─── Mark current user as seen ───────────────────────────────────────────
  const markAsSeen = useCallback(() => {
    if (!conversationRef || !currentUser?.uid) return;
    conversationRef.set(
      { seenBy: { [currentUser.uid]: firestore.FieldValue.serverTimestamp() } },
      { merge: true },
    );
  }, [conversationRef, currentUser?.uid]);

  useEffect(() => {
    if (!conversationRef || !currentUser?.uid || !receiverId) {
      setLoading(false);
      return;
    }

    let unsubscribeMessages: (() => void) | undefined;
    let unsubscribeConversation: (() => void) | undefined;

    ensureConversation()
      .then(() => {
        // Mark self as seen when screen opens
        markAsSeen();

        // Listen to messages
        unsubscribeMessages = conversationRef
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .onSnapshot(
            snapshot => {
              const nextMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<ChatMessage, 'id'>),
              }));
              setMessages(nextMessages);
              setLoading(false);
              // Mark seen whenever new messages arrive
              markAsSeen();
            },
            error => {
              console.log('Chat listener error:', error);
              setLoading(false);
              Alert.alert('Chat Error', 'Unable to load messages right now.');
            },
          );

        // ─── Listen to receiver's seen timestamp ──────────────────────────
        unsubscribeConversation = conversationRef.onSnapshot(snapshot => {
          const data = snapshot.data();
          const ts = data?.seenBy?.[receiverId];
          setReceiverLastSeen(ts?.toDate?.()?.getTime?.() ?? null);
        });
      })
      .catch(error => {
        console.log('Conversation setup error:', error);
        setLoading(false);
        Alert.alert('Chat Error', 'Unable to start this conversation.');
      });

    return () => {
      unsubscribeMessages?.();
      unsubscribeConversation?.();
    };
  }, [conversationRef, currentUser?.uid, ensureConversation, markAsSeen, receiverId]);

  // ─── Find the last message sent by me that receiver has seen ─────────────
  const lastSeenMessageId = useMemo(() => {
    if (!receiverLastSeen || messages.length === 0) return null;

    const lastSeen = messages.find(
      m =>
        m.senderId === currentUser?.uid &&
        m.createdAt?.toDate?.()?.getTime?.() <= receiverLastSeen,
    );

    return lastSeen?.id ?? null;
  }, [receiverLastSeen, messages, currentUser?.uid]);

  const handleSend = async () => {
    const trimmedMessage = messageText.trim();
    if (
      !trimmedMessage ||
      !conversationRef ||
      !currentUser?.uid ||
      !receiverId
    ) {
      return;
    }

    try {
      setSending(true);
      setMessageText('');

      const createdAt = firestore.FieldValue.serverTimestamp();
      const messageRef = conversationRef.collection('messages').doc();
      const batch = firestore().batch();

      batch.set(messageRef, {
        text: trimmedMessage,
        senderId: currentUser.uid,
        receiverId,
        createdAt,
      });

      batch.set(
        conversationRef,
        {
          participants: [currentUser.uid, receiverId],
          lastMessage: trimmedMessage,
          lastMessageSenderId: currentUser.uid,
          updatedAt: createdAt,
        },
        { merge: true },
      );

      await batch.commit();
    } catch (error) {
      console.log('Send message error:', error);
      setMessageText(trimmedMessage);
      Alert.alert('Message Error', 'Unable to send your message.');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMine = item.senderId === currentUser?.uid;
    const isLastSeen = isMine && item.id === lastSeenMessageId; // ← NEW

    return (
      <View
        style={[
          styles.messageRow,
          isMine ? styles.myMessageRow : styles.theirMessageRow,
        ]}
      >
        <View
          style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}
        >
          <AppText
            style={[
              styles.messageText,
              isMine ? styles.myMessageText : styles.theirMessageText,
            ]}
          >
            {item.text}
          </AppText>
          <AppText
            style={[
              styles.timeText,
              isMine ? styles.myTimeText : styles.theirTimeText,
            ]}
          >
            {formatTime(item.createdAt)}
          </AppText>
        </View>

        {/* ─── Seen avatar (like Messenger) ──────────────────────────────── */}
        {isLastSeen && (
          <View style={styles.seenAvatarWrapper}>
            {receiverImage ? (
              <Image
                source={{ uri: receiverImage }}
                style={styles.seenAvatar}
              />
            ) : (
              <View style={[styles.seenAvatar, styles.seenAvatarPlaceholder]}>
                <User size={s(9)} color={AppColors.textColor} />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  if (!currentUser?.uid || !receiverId) {
    return (
      <SafeAreaView style={container}>
        <CommonHeader title="Chat" />
        <View style={styles.centerContainer}>
          <AppText style={styles.emptyText}>
            This admin does not have a chat account yet.
          </AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={container}>
      <CommonHeader title="Chat" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.contentContainer} onTouchStart={Keyboard.dismiss}>
          <View style={styles.profileHeader}>
            {receiverImage ? (
              <Image
                source={{ uri: receiverImage }}
                style={styles.profileAvatar}
              />
            ) : (
              <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
                <User size={s(28)} color={AppColors.textColor} />
              </View>
            )}
            <View style={styles.nameBadge}>
              <AppText variant="bold" style={styles.receiverName}>
                {receiverName || 'Admin'}
              </AppText>
            </View>
          </View>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator
                size="large"
                color={AppColors.secondaryColor}
              />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.centerContainer}>
              <AppText style={styles.emptyText}>No messages yet.</AppText>
            </View>
          ) : (
            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderMessage}
              inverted
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesContent}
            />
          )}
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              paddingBottom:
                Platform.OS === 'ios' ? Math.max(insets.bottom, vs(10)) : vs(6),
            },
          ]}
        >
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Message"
            placeholderTextColor="#8f9299"
            multiline
            style={styles.input}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!messageText.trim() || sending) && styles.disabledSendButton,
            ]}
            onPress={handleSend}
            disabled={!messageText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={AppColors.primaryColor} />
            ) : (
              <Send size={s(18)} color={AppColors.primaryColor} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: vs(2),
    paddingBottom: vs(10),
  },
  profileAvatar: {
    width: s(58),
    height: s(58),
    borderRadius: s(29),
    marginBottom: vs(3),
    borderWidth: 2,
    borderColor: AppColors.secondaryColor,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.inputColor,
  },
  nameBadge: {
    borderWidth: 1,
    borderColor: AppColors.cardColor,
    borderRadius: s(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
  },
  receiverName: {
    fontSize: s(15),
    textAlign: 'center',
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: vs(12),
  },
  emptyText: {
    color: '#a6a9b0',
    textAlign: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: vs(8),
    alignItems: 'flex-end', // ← keeps seen avatar pinned to bubble bottom
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: s(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
  },
  myBubble: {
    backgroundColor: AppColors.secondaryColor,
    borderBottomRightRadius: s(2),
  },
  theirBubble: {
    backgroundColor: AppColors.cardColor,
    borderBottomLeftRadius: s(2),
  },
  messageText: {
    fontSize: s(14),
    lineHeight: s(19),
  },
  myMessageText: {
    color: AppColors.primaryColor,
  },
  theirMessageText: {
    color: AppColors.textColor,
  },
  timeText: {
    alignSelf: 'flex-end',
    fontSize: s(10),
    marginTop: vs(4),
  },
  myTimeText: {
    color: '#433900',
  },
  theirTimeText: {
    color: '#a6a9b0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: vs(10),
    borderTopWidth: 1,
    borderTopColor: AppColors.cardColor,
  },
  input: {
    flex: 1,
    minHeight: vs(42),
    maxHeight: vs(110),
    paddingHorizontal: s(12),
    paddingVertical: vs(9),
    borderRadius: s(8),
    backgroundColor: AppColors.inputColor,
    color: AppColors.textColor,
    fontSize: s(14),
  },
  sendButton: {
    width: s(42),
    height: s(42),
    borderRadius: s(8),
    marginLeft: s(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.secondaryColor,
  },
  disabledSendButton: {
    opacity: 0.45,
  },
  // ─── Seen avatar styles ───────────────────────────────────────────────────
  seenAvatarWrapper: {
    marginLeft: s(4),
    marginBottom: vs(1),
    justifyContent: 'flex-end',
  },
  seenAvatar: {
    width: s(16),
    height: s(16),
    borderRadius: s(8),
    borderWidth: 1,
    borderColor: AppColors.secondaryColor,
  },
  seenAvatarPlaceholder: {
    backgroundColor: AppColors.inputColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});