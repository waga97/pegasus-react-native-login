import { useRef, type ReactElement } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { getColors } from '../constants/colors';
import { buttonHeight } from '../constants/spacing';
import type { ButtonProps } from '../types';

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'filled',
  isDark = false,
}: ButtonProps): ReactElement {
  const colors = getColors(isDark);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (): void => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const isFilled = variant === 'filled';
  const isDisabled = disabled || loading;

  const buttonStyle: ViewStyle = isFilled
    ? { backgroundColor: colors.text }
    : { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.text };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.button, buttonStyle, isDisabled && styles.disabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator
            color={isFilled ? colors.background : colors.text}
            size="small"
          />
        ) : (
          <Text
            style={[styles.text, { color: isFilled ? colors.background : colors.text }]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

interface Styles {
  button: ViewStyle;
  disabled: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  button: {
    height: buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
