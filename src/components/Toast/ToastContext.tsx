import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale as s, vs } from 'react-native-size-matters';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from 'lucide-react-native';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number; // ms
}

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
  error:   { bg: '#3a1a1a', border: '#e74c3c' },
  warning: { bg: '#3a2e1a', border: '#f39c12' },
  info:    { bg: '#1a2a3a', border: '#3498db' },
};

const TYPE_ICONS: Record<ToastType, (size: number) => React.ReactNode> = {
  success: size => <CheckCircle    size={size} color="#2ecc71" />,
  error:   size => <XCircle        size={size} color="#e74c3c" />,
  warning: size => <AlertTriangle  size={size} color="#f39c12" />,
  info:    size => <Info           size={size} color="#3498db" />,
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<Required<ToastConfig>>({
    message: '',
    type: 'info',
    duration: 3000,
  });

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    ({ message, type = 'info', duration = 3000 }: ToastConfig) => {
      // cancel any in-flight timer
      if (timerRef.current) clearTimeout(timerRef.current);

      setConfig({ message, type, duration });
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
        ]).start(() => setVisible(false));
      }, duration);
    },
    [translateY, opacity],
  );

  const { bg, border } = TYPE_STYLES[config.type];

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toast,
            {
              top: insets.top + vs(10),
              backgroundColor: bg,
              borderLeftColor: border,
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <View style={styles.iconWrapper}>
            {TYPE_ICONS[config.type](s(20))}
          </View>
          <Text style={styles.message} numberOfLines={3}>
            {config.message}
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: s(14),
    borderRadius: s(10),
    borderLeftWidth: s(4),
    zIndex: 9999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    gap: s(10),
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: s(13),
    color: '#fff',
    lineHeight: vs(18),
  },
});
