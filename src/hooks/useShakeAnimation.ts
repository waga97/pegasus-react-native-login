import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

interface ShakeAnimation {
  shakeValue: Animated.Value;
  shake: () => void;
}

export function useShakeAnimation(): ShakeAnimation {
  const shakeValue = useRef(new Animated.Value(0)).current;

  const shake = useCallback((): void => {
    Animated.sequence([
      Animated.timing(shakeValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeValue]);

  return { shakeValue, shake };
}
