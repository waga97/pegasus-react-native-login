import { type ReactElement, type ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getColors } from '../constants/colors';
import { sharedStyles } from '../styles';

type LogoVariant = 'square-first' | 'circle-first';
type Size = 'default' | 'small';

interface HeaderProps {
  title?: ReactNode;
  logoVariant?: LogoVariant;
  size?: Size;
  showThemeToggle?: boolean;
}

export default function Header({
  title,
  logoVariant = 'square-first',
  size = 'default',
  showThemeToggle = true,
}: HeaderProps): ReactElement {
  const { isDark, toggleTheme } = useTheme();
  const colors = getColors(isDark);

  const isSmall = size === 'small';
  const squareStyle = isSmall ? sharedStyles.logoSquareSmall : sharedStyles.logoSquare;
  const circleStyle = isSmall ? sharedStyles.logoCircleSmall : sharedStyles.logoCircle;

  const logoElements =
    logoVariant === 'square-first' ? (
      <>
        <View style={[squareStyle, { backgroundColor: colors.text }]} />
        <View style={circleStyle} />
      </>
    ) : (
      <>
        <View style={circleStyle} />
        <View style={[squareStyle, { backgroundColor: colors.text }]} />
      </>
    );

  return (
    <View style={isSmall ? sharedStyles.headerCompact : sharedStyles.header}>
      <View style={sharedStyles.logoRow}>
        <View style={sharedStyles.logoMark}>{logoElements}</View>
        {showThemeToggle && (
          <TouchableOpacity onPress={toggleTheme} style={sharedStyles.themeToggle}>
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
      {title && (
        <>
          {typeof title === 'string' ? (
            <Text
              style={[
                isSmall ? sharedStyles.titleSmall : sharedStyles.title,
                { color: colors.text },
              ]}
            >
              {title}
            </Text>
          ) : (
            title
          )}
          <View style={sharedStyles.redLine} />
        </>
      )}
    </View>
  );
}

interface GreetingHeaderProps {
  greeting: string;
  name: string;
}

export function GreetingHeader({ greeting, name }: GreetingHeaderProps): ReactElement {
  const { isDark, toggleTheme } = useTheme();
  const colors = getColors(isDark);

  return (
    <View style={styles.header}>
      <View style={sharedStyles.logoRow}>
        <View style={sharedStyles.logoMark}>
          <View style={[sharedStyles.logoSquareSmall, { backgroundColor: colors.text }]} />
          <View style={sharedStyles.logoCircleSmall} />
        </View>
        <TouchableOpacity onPress={toggleTheme} style={sharedStyles.themeToggle}>
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting}</Text>
      <Text style={[sharedStyles.title, { color: colors.text }]}>{name}</Text>
      <View style={sharedStyles.redLine} />
    </View>
  );
}

interface GreetingStyles {
  header: ViewStyle;
  greeting: TextStyle;
}

const styles = StyleSheet.create<GreetingStyles>({
  header: {
    marginBottom: 48,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 2,
  },
});
