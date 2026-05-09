import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale as s, vs } from 'react-native-size-matters';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  MessageCircle,
  User,
  XCircle,
} from 'lucide-react-native';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastVariant = 'default' | 'chat';

interface ToastConfig {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number; // ms
  onPress?: () => void;
  variant?: ToastVariant;
  avatarUrl?: string;
}

type ResolvedToastConfig = Required<Omit<ToastConfig, 'onPress'>> & {
  onPress?: () => void;
  pressable: boolean;
};

interface ToastContextValue {
  showToast: (config: ToastConfig) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useToast = () => useContext(ToastContext);

// ─── Styles per type ─────────────────────────────────────────────────────────
const TYPE_STYLES: Record<ToastType, { bg: string; border: string }> = {
  success: { bg: '#1a3a2a', border: '#2ecc71' },
  error: { bg: '#3a1a1a', border: '#e74c3c' },
  warning: { bg: '#3a2e1a', border: '#f39c12' },
  info: { bg: '#1a2a3a', border: '#3498db' },
};

const TYPE_ICONS: Record<ToastType, (size: number) => React.ReactNode> = {
  success: size => <CheckCircle size={size} color="#2ecc71" />,
  error: size => <XCircle size={size} color="#e74c3c" />,
  warning: size => <AlertTriangle size={size} color="#f39c12" />,
  info: size => <Info size={size} color="#3498db" />,
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<ResolvedToastConfig>({
    title: '',
    message: '',
    type: 'info',
    duration: 3000,
    variant: 'default',
    avatarUrl: '',
    pressable: false,
  });

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(
    (afterDismiss?: () => void) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
        afterDismiss?.();
      });
    },
    [translateY, opacity],
  );

  const showToast = useCallback(
    ({
      title = '',
      message,
      type = 'info',
      duration = 3000,
      onPress,
      variant = 'default',
      avatarUrl = '',
    }: ToastConfig) => {
      // cancel any in-flight timer
      if (timerRef.current) clearTimeout(timerRef.current);

      setConfig({
        title,
        message,
        type,
        duration,
        onPress,
        variant,
        avatarUrl,
        pressable: Boolean(onPress),
      });
      setVisible(true);

      // slide in + fade in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // auto dismiss
      timerRef.current = setTimeout(() => {
        dismissToast();
      }, duration);
    },
    [dismissToast, translateY, opacity],
  );

  const { bg, border } = TYPE_STYLES[config.type];
  const isChatToast = config.variant === 'chat';

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toast,
            {
              top: insets.top + vs(10),
              backgroundColor: isChatToast ? '#121826' : bg,
              borderLeftColor: isChatToast ? '#38bdf8' : border,
              transform: [{ translateY }],
              opacity,
            },
            isChatToast && styles.chatToast,
          ]}
        >
          <Pressable
            disabled={!config.pressable}
            onPress={() => dismissToast(config.onPress)}
            style={[
              styles.toastContent,
              isChatToast && styles.chatToastContent,
            ]}
          >
            {isChatToast ? (
              <>
                <View style={styles.avatarWrapper}>
                  {config.avatarUrl ? (
                    <Image
                      source={{ uri: config.avatarUrl }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <User size={s(18)} color="#d7e0ea" />
                    </View>
                  )}
                  <View style={styles.messageBadge}>
                    <MessageCircle size={s(12)} color="#ffffff" />
                  </View>
                </View>
                <View style={styles.textContainer}>
                  <View style={styles.chatTitleRow}>
                    <Text style={styles.chatTitle} numberOfLines={1}>
                      {config.title || 'New message'}
                    </Text>
                    <Text style={styles.chatHint}>now</Text>
                  </View>
                  <Text style={styles.chatMessage} numberOfLines={2}>
                    {config.message}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.iconWrapper}>
                  {TYPE_ICONS[config.type](s(20))}
                </View>
                <View style={styles.textContainer}>
                  {config.title ? (
                    <Text style={styles.title} numberOfLines={1}>
                      {config.title}
                    </Text>
                  ) : null}
                  <Text style={styles.message} numberOfLines={2}>
                    {config.message}
                  </Text>
                </View>
              </>
            )}
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    width: '88%',
    borderRadius: s(10),
    borderLeftWidth: s(4),
    zIndex: 9999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  chatToast: {
    width: '92%',
    borderLeftWidth: 0,
    borderRadius: s(14),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: s(14),
    gap: s(10),
  },
  chatToastContent: {
    paddingVertical: vs(10),
    paddingHorizontal: s(12),
    gap: s(12),
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: s(13),
    fontWeight: '700',
    marginBottom: vs(2),
  },
  message: {
    fontSize: s(13),
    color: '#fff',
    lineHeight: vs(18),
  },
  avatarWrapper: {
    position: 'relative',
    width: s(44),
    height: s(44),
  },
  avatar: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#273244',
  },
  messageBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: s(20),
    height: s(20),
    borderRadius: s(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    borderWidth: 2,
    borderColor: '#121826',
  },
  chatTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  chatTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: s(14),
    fontWeight: '700',
  },
  chatHint: {
    color: '#8ea0b5',
    fontSize: s(11),
  },
  chatMessage: {
    color: '#cbd5e1',
    fontSize: s(13),
    lineHeight: vs(18),
    marginTop: vs(2),
  },
});
