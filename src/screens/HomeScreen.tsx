import { useState, useEffect, type ReactElement } from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { GreetingHeader, Button, ScreenLayout } from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../constants/colors';
import { spacing } from '../constants/spacing';

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function HomeScreen(): ReactElement {
  const { user, logout, isLoading, isDemo } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const firstName = user?.name?.split(' ')[0] ?? 'User';

  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScreenLayout>
      <GreetingHeader greeting="HELLO," name={firstName.toUpperCase()} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          PROFILE
        </Text>
        <View style={[styles.infoGrid, { borderTopColor: colors.text }]}>
          <ProfileItem label="NAME" value={user?.name} colors={colors} />
          <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
          <ProfileItem label="EMAIL" value={user?.email} colors={colors} />
        </View>
      </View>

      <View style={[styles.statsRow, { borderColor: colors.text }]}>
        <View style={styles.clockSection}>
          <Text style={[styles.clockTime, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>{time}</Text>
          <Text style={[styles.clockLabel, { color: colors.textSecondary }]}>
            LOCAL TIME
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.text }]} />
        <View style={styles.badgeSection}>
          <View style={[styles.statusDot, { backgroundColor: isDemo ? colors.red : colors.green }]} />
          <Text style={[styles.badgeText, { color: colors.text }]}>
            {isDemo ? 'DEMO' : 'NEW'}
          </Text>
          <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>
            ACCOUNT
          </Text>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <Button
          title="SIGN OUT"
          onPress={logout}
          loading={isLoading}
          variant="outline"
          isDark={isDark}
        />
      </View>
    </ScreenLayout>
  );
}

interface ProfileItemProps {
  label: string;
  value?: string;
  colors: ReturnType<typeof getColors>;
}

function ProfileItem({ label, value, colors }: ProfileItemProps): ReactElement {
  return (
    <View style={styles.infoItem}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

interface Styles {
  section: ViewStyle;
  sectionTitle: TextStyle;
  infoGrid: ViewStyle;
  infoItem: ViewStyle;
  infoLabel: TextStyle;
  infoValue: TextStyle;
  infoDivider: ViewStyle;
  statsRow: ViewStyle;
  clockSection: ViewStyle;
  clockTime: TextStyle;
  clockLabel: TextStyle;
  statDivider: ViewStyle;
  badgeSection: ViewStyle;
  statusDot: ViewStyle;
  badgeText: TextStyle;
  badgeLabel: TextStyle;
  logoutContainer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  infoGrid: {
    borderTopWidth: 1,
  },
  infoItem: {
    paddingVertical: spacing.md,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '500',
  },
  infoDivider: {
    height: 1,
  },
  statsRow: {
    flexDirection: 'row',
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  clockSection: {
    flex: 1.4,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  clockTime: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  clockLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
  },
  badgeSection: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  logoutContainer: {
    marginTop: 'auto',
  },
});
