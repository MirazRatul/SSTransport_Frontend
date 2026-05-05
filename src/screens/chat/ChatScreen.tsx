import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Send, User, X, Image as ImageIcon } from 'lucide-react-native';
import { launchImageLibrary, PhotoQuality } from 'react-native-image-picker';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@env';
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
  imageUrl?: string;
  replyTo?: {
    messageId: string;
    text?: string;
    imageUrl?: string | null;
    senderName: string;
    senderId: string;
  };
}

type SwipeableMessageRowProps = {
  isMine: boolean;
  onReply: () => void;
  style?: any;
  children: React.ReactNode;
};

const SwipeableMessageRow = ({ isMine, onReply, style, children }: SwipeableMessageRowProps) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const dragLimit = s(64);

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dy) < 8,
      onPanResponderMove: (_, gestureState) => {
        let dx = gestureState.dx;
        dx = isMine ? Math.min(0, dx) : Math.max(0, dx);
        dx = Math.max(-dragLimit, Math.min(dragLimit, dx));
        translateX.setValue(dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const dx = gestureState.dx;
        if (isMine && dx < -40) {
          onReply();
        }

        if (!isMine && dx > 40) {
          onReply();
        }

        resetPosition();
      },
      onPanResponderTerminate: (_, gestureState) => {
        const dx = gestureState.dx;
        if (isMine && dx < -40) {
          onReply();
        }

        if (!isMine && dx > 40) {
          onReply();
        }

        resetPosition();
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[style, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
};

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

const formatMessageDate = (createdAt?: any) => {
  const date = createdAt?.toDate?.();
  if (!date) return '';

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return 'Today';
  }

  if (isYesterday) {
    return 'Yesterday';
  }

  const dayDifference = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (dayDifference < 7) {
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  }

  // Check if same year
  if (date.getFullYear() === today.getFullYear()) {
    // Same year: show "Apr 19"
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } else {
    // Different year: show "Apr 19, 2025"
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
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
  const [receiverLastSeen, setReceiverLastSeen] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [viewingImageUrl, setViewingImageUrl] = useState<string | null>(null);
  const [isReceiverTyping, setIsReceiverTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);

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

  const updateTypingStatus = useCallback(
    async (isTyping: boolean) => {
      if (!conversationRef || !currentUser?.uid) return;

      try {
        await conversationRef.set(
          {
            typingBy: { [currentUser.uid]: isTyping },
            typingUpdatedAt: {
              [currentUser.uid]: firestore.FieldValue.serverTimestamp(),
            },
          },
          { merge: true },
        );
      } catch (error) {
        console.log('Typing status error:', error);
      }
    },
    [conversationRef, currentUser?.uid],
  );

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
          setIsReceiverTyping(Boolean(data?.typingBy?.[receiverId]));
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

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      updateTypingStatus(false);
    };
  }, [updateTypingStatus]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const showSub = Keyboard.addListener('keyboardDidShow', event => {
      setAndroidKeyboardHeight(event.endCoordinates?.height || 0);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setAndroidKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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

  const handleSend = async (imageUrl?: string) => {
    const trimmedMessage = messageText.trim();
    if (
      (!trimmedMessage && !imageUrl) ||
      !conversationRef ||
      !currentUser?.uid ||
      !receiverId
    ) {
      return;
    }

    try {
      setSending(true);
      setMessageText('');
      updateTypingStatus(false);

      const createdAt = firestore.FieldValue.serverTimestamp();
      const messageRef = conversationRef.collection('messages').doc();
      const batch = firestore().batch();

      const messageData: any = {
        senderId: currentUser.uid,
        receiverId,
        createdAt,
      };

      // Add text or image
      if (trimmedMessage) messageData.text = trimmedMessage;
      if (imageUrl) messageData.imageUrl = imageUrl;

      // Add replyTo if replying to a message
      if (replyingTo) {
        messageData.replyTo = {
          messageId: replyingTo.id,
            text: replyingTo.text || (replyingTo.imageUrl ? '📷 Image' : ''),
            imageUrl: replyingTo.imageUrl || null,
          senderName: replyingTo.senderId === currentUser.uid ? 'You' : (receiverName || 'Admin'),
          senderId: replyingTo.senderId,
        };
      }

      batch.set(messageRef, messageData);

      batch.set(
        conversationRef,
        {
          participants: [currentUser.uid, receiverId],
          lastMessage: imageUrl ? '📷 Image' : trimmedMessage,
          lastMessageSenderId: currentUser.uid,
          updatedAt: createdAt,
        },
        { merge: true },
      );

      await batch.commit();
      setReplyingTo(null);
    } catch (error) {
      console.log('Send message error:', error);
      if (!imageUrl) setMessageText(trimmedMessage);
      Alert.alert('Message Error', 'Unable to send your message.');
    } finally {
      setSending(false);
    }
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
  };

  // ─── Upload to Cloudinary ───────────────────────────────────────────────────
  const uploadToCloudinary = async (localUri: string, fileName: string): Promise<string> => {
    const filename = fileName || localUri.split('/').pop() || 'chat_image.jpg';
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    const formData = new FormData();
    formData.append('file', {
      uri: localUri,
      name: filename,
      type: mimeType,
    } as any);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'ChatImages');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData },
    );
    const json = await response.json();
    if (!json.secure_url) throw new Error(json.error?.message || 'Cloudinary upload failed');
    return json.secure_url;
  };

  // ─── Image Picker ───────────────────────────────────────────────────────────
  const handleImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo' as const,
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.8 as PhotoQuality,
    });
    if (result.assets && result.assets.length > 0) {
      setSelectedImageUri(result.assets[0].uri || null);
    }
  };

  const handleChangeText = (text: string) => {
    setMessageText(text);
    updateTypingStatus(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 1500);
  };

  // ─── Send image message ──────────────────────────────────────────────────────
  const handleSendImage = async () => {
    if (!selectedImageUri) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadToCloudinary(selectedImageUri, 'chat_image.jpg');
      
      // Send as message with image
      await handleSend(imageUrl);
      setSelectedImageUri(null);
    } catch (error: any) {
      console.log('Error uploading image:', error);
      Alert.alert('Upload Error', error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isMine = item.senderId === currentUser?.uid;
    const isLastSeen = isMine && item.id === lastSeenMessageId;

    // For an inverted list, compare with the next item and render the separator after the message
    // so it appears above the first message of the day in the UI.
    const nextMessage = messages[index + 1];
    const currentDate = item.createdAt?.toDate?.()?.toDateString?.();
    const nextDate = nextMessage?.createdAt?.toDate?.()?.toDateString?.();
    const showDateSeparator = currentDate !== nextDate;

    return (
      <>
        <SwipeableMessageRow
          isMine={isMine}
          onReply={() => handleReply(item)}
          style={[
            styles.messageRow,
            isMine ? styles.myMessageRow : styles.theirMessageRow,
          ]}
        >
          {!isMine && (
            receiverImage ? (
              <Image
                source={{ uri: receiverImage }}
                style={styles.receiverAvatar}
              />
            ) : (
              <View
                style={[styles.receiverAvatar, styles.receiverAvatarPlaceholder]}
              >
                <User size={s(12)} color={AppColors.textColor} />
              </View>
            )
          )}
          <View
            style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}
          >
            <View
              style={[
                styles.bubbleTail,
                isMine ? styles.myBubbleTail : styles.theirBubbleTail,
              ]}
            />
            {/* ─── Show quoted message if this is a reply ──────────────────────── */}
            {item.replyTo && (
              <View style={[styles.quotedMessage, isMine ? styles.quotedMessageMine : styles.quotedMessageTheir]}>
                <AppText style={styles.quotedSenderName}>
                  {item.replyTo.senderName}
                </AppText>
                <AppText
                  style={styles.quotedText}
                  numberOfLines={2}
                >
                    {item.replyTo.text || (item.replyTo.imageUrl ? '📷 Image' : '')}
                </AppText>
              </View>
            )}

            {/* ─── Display Image ──────────────────────────────────────────────── */}
            {item.imageUrl && (
              <TouchableOpacity onPress={() => setViewingImageUrl(item.imageUrl || '')}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.messageImage}
                />
              </TouchableOpacity>
            )}

            {/* ─── Display Text ──────────────────────────────────────────────── */}
            {item.text && (
              <AppText
                style={[
                  styles.messageText,
                  isMine ? styles.myMessageText : styles.theirMessageText,
                ]}
              >
                  {item.text || (item.imageUrl ? '📷 Image' : '')}
              </AppText>
            )}

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
        </SwipeableMessageRow>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <AppText style={styles.dateSeparatorText}>
              {formatMessageDate(item.createdAt)}
            </AppText>
          </View>
        )}
      </>
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
              ListHeaderComponent={
                isReceiverTyping ? (
                  <View style={styles.typingRow}>
                    {receiverImage ? (
                      <Image
                        source={{ uri: receiverImage }}
                        style={styles.typingAvatar}
                      />
                    ) : (
                      <View
                        style={[
                          styles.typingAvatar,
                          styles.typingAvatarPlaceholder,
                        ]}
                      >
                        <User size={s(10)} color={AppColors.textColor} />
                      </View>
                    )}
                    <View style={styles.typingBubble}>
                      <AppText style={styles.typingText}>Typing...</AppText>
                    </View>
                  </View>
                ) : null
              }
            />
          )}
        </View>

        {/* ─── Reply Preview ──── */}
        {replyingTo && (
          <View style={styles.replyPreviewContainer}>
            <View style={styles.replyPreviewContent}>
              <View style={{ flex: 1 }}>
                <AppText style={styles.replyPreviewLabel}>Replying to:</AppText>
                <AppText style={styles.replyPreviewText} numberOfLines={2}>
                  {replyingTo.text || (replyingTo.imageUrl ? '📷 Image' : '')}
                </AppText>
              </View>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <X size={s(18)} color="#8f9299" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── Image Preview ──────────────────────────────────────────────────── */}
        {selectedImageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.selectedImagePreview}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImageUri(null)}
            >
              <X size={s(16)} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <View
          style={[
            styles.inputContainer,
            {
              paddingBottom: vs(6),
              marginBottom: Platform.OS === 'android' ? androidKeyboardHeight : 0,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={handleImagePicker}
            disabled={uploadingImage}
          >
            <ImageIcon size={s(20)} color={AppColors.secondaryColor} />
          </TouchableOpacity>

          <TextInput
            value={messageText}
            onChangeText={handleChangeText}
            placeholder="Message"
            placeholderTextColor="#8f9299"
            multiline
            style={styles.input}
            editable={!uploadingImage}
            onBlur={() => {
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }
              updateTypingStatus(false);
            }}
          />

          {selectedImageUri ? (
            <TouchableOpacity
              style={[
                styles.sendButton,
                uploadingImage && styles.disabledSendButton,
              ]}
              onPress={handleSendImage}
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <ActivityIndicator size="small" color={AppColors.primaryColor} />
              ) : (
                <Send size={s(18)} color={AppColors.primaryColor} />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!messageText.trim() || sending) && styles.disabledSendButton,
              ]}
              onPress={() => handleSend()}
              disabled={!messageText.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color={AppColors.primaryColor} />
              ) : (
                <Send size={s(18)} color={AppColors.primaryColor} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Full Image Viewer Modal ─────────────────────────────────────── */}
        <Modal
          visible={!!viewingImageUrl}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setViewingImageUrl(null)}
        >
          <View style={styles.fullImageContainer}>
            {viewingImageUrl && (
              <Image
                source={{ uri: viewingImageUrl }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
            <TouchableOpacity
              style={styles.closeFullImageButton}
              onPress={() => setViewingImageUrl(null)}
            >
              <X size={s(24)} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
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
  typingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingVertical: vs(4),
  },
  typingAvatar: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    marginRight: s(6),
    borderWidth: 1,
    borderColor: AppColors.secondaryColor,
  },
  typingAvatarPlaceholder: {
    backgroundColor: AppColors.inputColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingBubble: {
    backgroundColor: AppColors.cardColor,
    borderRadius: s(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    maxWidth: '78%',
  },
  typingText: {
    fontSize: s(12),
    color: '#8f9299',
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
    marginBottom: vs(10),
    alignItems: 'flex-end', // ← keeps seen avatar pinned to bubble bottom
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  receiverAvatar: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    marginRight: s(6),
    borderWidth: 1,
    borderColor: AppColors.secondaryColor,
  },
  receiverAvatarPlaceholder: {
    backgroundColor: AppColors.inputColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: s(12),
    paddingHorizontal: s(12),
    paddingVertical: vs(7),
    minWidth: s(36),
    position: 'relative',
  },
  myBubble: {
    backgroundColor: AppColors.secondaryColor,
    borderBottomRightRadius: s(4),
    borderTopRightRadius: s(14),
  },
  theirBubble: {
    backgroundColor: AppColors.cardColor,
    borderBottomLeftRadius: s(4),
    borderTopLeftRadius: s(14),
  },
  bubbleTail: {
    position: 'absolute',
    bottom: s(5),
    width: s(6),
    height: s(6),
    transform: [{ rotate: '45deg' }],
  },
  myBubbleTail: {
    right: s(-2),
    backgroundColor: AppColors.secondaryColor,
    borderTopRightRadius: s(2),
  },
  theirBubbleTail: {
    left: s(-2),
    backgroundColor: AppColors.cardColor,
    borderTopLeftRadius: s(2),
  },
  messageText: {
    fontSize: s(14),
    lineHeight: s(18),
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
    minHeight: s(42),
    maxHeight: s(110),
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
  // ─── Date separator styles ────────────────────────────────────────────────
  dateSeparator: {
    alignItems: 'center',
    marginVertical: vs(12),
  },
  dateSeparatorText: {
    fontSize: s(12),
    color: '#a6a9b0',
  },
  // ─── Quoted message styles ────────────────────────────────────────────────
  quotedMessage: {
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    marginBottom: vs(6),
    borderLeftWidth: 3,
    borderRadius: s(4),
  },
  quotedMessageMine: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderLeftColor: '#433900',
  },
  quotedMessageTheir: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderLeftColor: AppColors.textColor,
  },
  quotedSenderName: {
    fontSize: s(10),
    fontWeight: '600',
    color: AppColors.textColor,
    marginBottom: vs(2),
  },
  quotedText: {
    fontSize: s(11),
    color: AppColors.textColor,
  },
  // ─── Reply preview styles ─────────────────────────────────────────────────
  replyPreviewContainer: {
    backgroundColor: AppColors.cardColor,
    borderTopWidth: 1,
    borderTopColor: AppColors.inputColor,
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
  },
  replyPreviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyPreviewLabel: {
    fontSize: s(10),
    color: '#8f9299',
    fontWeight: '600',
  },
  replyPreviewText: {
    fontSize: s(12),
    color: AppColors.textColor,
    marginTop: vs(2),
  },
  // ─── Image message styles ─────────────────────────────────────────────────
  messageImage: {
    width: s(170),
    height: s(170),
    borderRadius: s(12),
    marginBottom: vs(6),
  },
  // ─── Image preview styles ─────────────────────────────────────────────────
  imagePreviewContainer: {
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    backgroundColor: AppColors.cardColor,
    borderTopWidth: 1,
    borderTopColor: AppColors.inputColor,
  },
  selectedImagePreview: {
    width: '100%',
    height: vs(200),
    borderRadius: s(8),
  },
  removeImageButton: {
    position: 'absolute',
    top: vs(12),
    right: s(16),
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ─── Image picker button styles ───────────────────────────────────────────
  imagePickerButton: {
    width: s(42),
    height: s(42),
    borderRadius: s(8),
    marginRight: s(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.inputColor,
  },
  // ─── Full image viewer modal styles ────────────────────────────────────────
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeFullImageButton: {
    position: 'absolute',
    top: s(20),
    right: s(20),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});