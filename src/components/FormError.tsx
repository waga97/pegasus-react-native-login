import { type ReactElement } from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../constants/colors';
import { spacing } from '../constants/spacing';

interface FormErrorProps {
  message: string;
}

export default function FormError({ message }: FormErrorProps): ReactElement {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#3D1515' : '#FFF0F0' },
      ]}
    >
      <Ionicons name="alert-circle" size={18} color={colors.red} />
      <Text style={[styles.text, { color: colors.red }]}>{message}</Text>
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: spacing.sm,
    flex: 1,
  },
});
