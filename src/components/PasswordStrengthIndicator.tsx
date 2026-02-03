import { type ReactElement } from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { getPasswordStrength } from '../utils';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const STRENGTH_LEVELS = [1, 2, 3] as const;

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps): ReactElement | null {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {STRENGTH_LEVELS.map((level) => (
          <View
            key={level}
            style={[
              styles.bar,
              {
                backgroundColor:
                  level <= strength.level ? colors.text : colors.border,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: colors.text }]}>{strength.label}</Text>
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  bars: ViewStyle;
  bar: ViewStyle;
  label: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  bars: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    marginRight: spacing.sm,
  },
  bar: {
    flex: 1,
    height: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    width: 60,
  },
});
