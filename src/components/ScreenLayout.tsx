import { type ReactElement, type ReactNode } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../constants/colors';
import { useResponsiveLayout } from '../hooks';
import { sharedStyles } from '../styles';

interface ScreenLayoutProps {
  children: ReactNode;
  withKeyboard?: boolean;
  contentStyle?: ViewStyle;
}

export default function ScreenLayout({
  children,
  withKeyboard = false,
  contentStyle,
}: ScreenLayoutProps): ReactElement {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const { constrainedStyle } = useResponsiveLayout();

  const scrollContentStyle = [
    sharedStyles.scrollContent,
    constrainedStyle,
    contentStyle,
  ];

  const content = (
    <ScrollView
      contentContainerStyle={scrollContentStyle}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );

  return (
    <View style={[sharedStyles.screenContainer, { backgroundColor: colors.background }]}>
      <SafeAreaView style={sharedStyles.flex1}>
        {withKeyboard ? (
          <KeyboardAvoidingView
            style={sharedStyles.flex1}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {content}
          </KeyboardAvoidingView>
        ) : (
          content
        )}
      </SafeAreaView>
    </View>
  );
}
