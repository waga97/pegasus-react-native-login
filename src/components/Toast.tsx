import { useEffect, useRef, type ReactElement } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../constants/colors';
import { spacing } from '../constants/spacing';

type ToastType = 'error' | 'success' | 'info';

const ICON_MAP: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  error: 'alert-circle',
  success: 'checkmark-circle',
  info: 'information-circle',
};

interface ToastItemProps {
  id: number;
  type: ToastType;
  message: string;
}

function ToastItem({ id, type, message }: ToastItemProps): ReactElement {
  const { hideToast } = useToast();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const bgColor = isDark ? colors.white : colors.black;
  const textColor = isDark ? colors.black : colors.white;

  const getIconColor = (): string => {
    if (type === 'error') return colors.red;
    if (type === 'success') return colors.green;
    return textColor;
  };
  const iconColor = getIconColor();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  const handleDismiss = (): void => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => hideToast(id));
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: bgColor,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Ionicons name={ICON_MAP[type]} size={20} color={iconColor} />
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      <TouchableOpacity
        onPress={handleDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={18} color={textColor} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ToastContainer(): ReactElement | null {
  const { toasts } = useToast();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { top: insets.top + spacing.sm }]}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  toast: ViewStyle;
  message: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginHorizontal: spacing.sm,
  },
});
