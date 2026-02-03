import { Platform, useWindowDimensions, type ViewStyle } from 'react-native';
import { maxWidth } from '../constants/spacing';

interface ResponsiveLayout {
  width: number;
  isWeb: boolean;
  shouldConstrainWidth: boolean;
  constrainedStyle: ViewStyle | null;
}

export function useResponsiveLayout(): ResponsiveLayout {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const shouldConstrainWidth = isWeb && width > maxWidth;

  const constrainedStyle: ViewStyle | null = shouldConstrainWidth
    ? { width: '100%', maxWidth, alignSelf: 'center' }
    : null;

  return { width, isWeb, shouldConstrainWidth, constrainedStyle };
}
