import { type ReactElement } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../constants/colors';
import { sharedStyles } from '../styles';
import { spacing } from '../constants/spacing';

interface AuthFooterLinkProps {
  prompt: string;
  linkText: string;
  onPress: () => void;
}

export default function AuthFooterLink({
  prompt,
  linkText,
  onPress,
}: AuthFooterLinkProps): ReactElement {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <View style={sharedStyles.footer}>
      <View style={[sharedStyles.divider, { backgroundColor: colors.border }]} />
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          {prompt}{' '}
          <Text style={[styles.textBold, { color: colors.text }]}>{linkText}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

interface Styles {
  button: ViewStyle;
  text: TextStyle;
  textBold: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  button: {
    paddingVertical: spacing.md,
  },
  text: {
    fontSize: 12,
    letterSpacing: 1,
  },
  textBold: {
    fontWeight: '700',
  },
});
