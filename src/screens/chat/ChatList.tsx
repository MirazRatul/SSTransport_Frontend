import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { MessageCircle, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { scale as s, vs } from 'react-native-size-matters';
import AppHeader from '../../components/AppHeader';
import AppText from '../../components/AppText';
import { container } from '../../constants/container';
import { AppColors } from '../../styles/colors';
import apiClient from '../../api/api';

interface Admin {
  id: string;
  name?: string;
  email?: string;
  contact?: string;
  imageUrl?: string;
}

interface Conversation {
  id: string;
  participants?: string[];
  lastMessage?: string;
  lastMessageSenderId?: string;
  updatedAt?: any;
  seenBy?: Record<string, any>;
}

const normalizeAdminsResponse = (data: any): Admin[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.admins)) return data.admins;
  return [];
};

const formatConversationTime = (updatedAt?: any) => {
  const date = updatedAt?.toDate?.();
  if (!date) return '';

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ChatList = () => {
  const navigation = useNavigation<any>();
  const currentUser = auth().currentUser;
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [conversationsByAdminId, setConversationsByAdminId] = useState<
    Record<string, Conversation>
  >({});
  const [onlineStatus, setOnlineStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentUserId = currentUser?.uid;

  const fetchAdmins = useCallback(
    async (showLoader = true) => {
      if (!currentUserId) {
        setAdmins([]);
        setLoading(false);
        return;
      }

      try {
        if (showLoader) setLoading(true);
        const response = await apiClient.get('/admins');
        const adminsData = normalizeAdminsResponse(response.data).filter(
          admin => admin.id?.toString() !== currentUserId,
        );
        setAdmins(adminsData);
      } catch (error) {
        console.log('Error fetching admins:', error);
        setAdmins([]);
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [currentUserId],
  );

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchAdmins(false);
    } finally {
      setRefreshing(false);
    }
  }, [fetchAdmins]);

  // ─── Listen to conversations ──────────────────────────────────────────────
  useEffect(() => {
    if (!currentUserId) {
      setChatLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('conversations')
      .where('participants', 'array-contains', currentUserId)
      .onSnapshot(
        snapshot => {
          const nextConversationsByAdminId = snapshot.docs.reduce<
            Record<string, Conversation>
          >((acc, doc) => {
            const data = doc.data();
            if (!data) return acc;

            const conversation = {
              id: doc.id,
              ...(data as Omit<Conversation, 'id'>),
            };
            const adminId = conversation.participants?.find(
              participant => participant !== currentUserId,
            );
            if (adminId) {
              acc[adminId] = conversation;
            }
            return acc;
          }, {});

          setConversationsByAdminId(nextConversationsByAdminId);
          setChatLoading(false);
        },
        error => {
          console.log('Chat list listener error:', error);
          setChatLoading(false);
        },
      );

    return unsubscribe;
  }, [currentUserId]);

  // ─── Listen to online presence of all admins ──────────────────────────────
  useEffect(() => {
    if (admins.length === 0) return;

    const unsubscribes = admins.map(admin => {
      return firestore()
        .collection('presence')
        .doc(admin.id)
        .onSnapshot(snapshot => {
          if (!snapshot) return; // ← guard against null snapshot
          const data = snapshot.exists() ? snapshot.data() ?? null : null;
          setOnlineStatus(prev => ({
            ...prev,
            [admin.id]: data?.online === true,
          }));
        });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [admins]);

  const emptyMessage = useMemo(() => {
    if (!currentUserId) return 'Please sign in to view admins.';
    return 'No admins found.';
  }, [currentUserId]);

  const sortedAdmins = useMemo(() => {
    return [...admins].sort((first, second) => {
      const firstTime =
        conversationsByAdminId[first.id]?.updatedAt?.toMillis?.() || 0;
      const secondTime =
        conversationsByAdminId[second.id]?.updatedAt?.toMillis?.() || 0;
      if (firstTime !== secondTime) return secondTime - firstTime;
      return (first.name || '').localeCompare(second.name || '');
    });
  }, [admins, conversationsByAdminId]);

  const openAdminChat = (admin: Admin) => {
    if (!currentUserId) return;
    navigation.getParent()?.navigate('ChatScreen', {
      receiverId: admin.id,
      receiverName: admin.name || admin.email || 'Admin',
      receiverImage: admin.imageUrl || undefined,
      receiverRole: 'Admin',
    });
  };

  // ─── Check if conversation has unread messages ────────────────────────────
  const isUnread = useCallback(
    (adminId: string): boolean => {
      if (!currentUserId) return false;
      const conversation = conversationsByAdminId[adminId];
      if (!conversation?.lastMessage) return false;

      if (conversation.lastMessageSenderId === currentUserId) return false;

      const lastUpdated = conversation.updatedAt?.toMillis?.() ?? 0;
      const myLastSeen =
        conversation.seenBy?.[currentUserId]?.toMillis?.() ?? 0;

      return lastUpdated > myLastSeen;
    },
    [currentUserId, conversationsByAdminId],
  );

  const renderAdmin = ({ item }: { item: Admin }) => {
    const conversation = conversationsByAdminId[item.id];
    const isOnline = onlineStatus[item.id] === true;
    const hasUnread = isUnread(item.id);

    return (
      <TouchableOpacity
        style={styles.chatRow}
        activeOpacity={0.8}
        onPress={() => openAdminChat(item)}
      >
        <View style={styles.avatarContainer}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <User size={s(22)} color={AppColors.textColor} />
            </View>
          )}
          {isOnline && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatTitleRow}>
            <AppText
              variant="bold"
              style={[styles.chatName, hasUnread && styles.unreadName]}
              numberOfLines={1}
            >
              {item.name || item.email || 'Admin'}
            </AppText>
            <AppText style={[styles.timeText, hasUnread && styles.unreadTime]}>
              {formatConversationTime(conversation?.updatedAt)}
            </AppText>
          </View>

          <View style={styles.lastMessageRow}>
            <AppText
              style={[styles.lastMessage, hasUnread && styles.unreadMessage]}
              numberOfLines={1}
            >
              {conversation?.lastMessage ||
                item.email ||
                'Tap to start chatting'}
            </AppText>
            {hasUnread && <View style={styles.unreadBadge} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <AppHeader title="My Chat" />
      <View style={container}>
        {loading || chatLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={AppColors.secondaryColor} />
          </View>
        ) : (
          <FlatList
            data={sortedAdmins}
            keyExtractor={item => item.id}
            renderItem={renderAdmin}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[AppColors.secondaryColor]}
                tintColor={AppColors.secondaryColor}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MessageCircle size={s(34)} color="#8f9299" />
                <AppText style={styles.emptyText}>{emptyMessage}</AppText>
              </View>
            }
          />
        )}
      </View>
    </>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingTop: vs(10),
    paddingBottom: vs(18),
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.cardColor,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: s(46),
    height: s(46),
    borderRadius: s(23),
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.inputColor,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: s(12),
    height: s(12),
    borderRadius: s(6),
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: AppColors.primaryColor,
  },
  chatInfo: {
    flex: 1,
    marginLeft: s(12),
  },
  chatTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatName: {
    flex: 1,
    fontSize: s(15),
  },
  unreadName: {
    color: AppColors.textColor,
  },
  timeText: {
    color: '#8f9299',
    fontSize: s(11),
    marginLeft: s(8),
  },
  unreadTime: {
    color: AppColors.secondaryColor,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
  },
  lastMessage: {
    flex: 1,
    color: '#a6a9b0',
    fontSize: s(13),
  },
  unreadMessage: {
    color: AppColors.textColor,
    fontWeight: '600',
  },
  unreadBadge: {
    width: s(9),
    height: s(9),
    borderRadius: s(5),
    backgroundColor: AppColors.secondaryColor,
    marginLeft: s(6),
  },
});
