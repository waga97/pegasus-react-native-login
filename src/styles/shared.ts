import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { spacing } from '../constants/spacing';

export interface SharedStyles {
  flex1: ViewStyle;
  screenContainer: ViewStyle;
  scrollContent: ViewStyle;
  scrollContentAuth: ViewStyle;
  header: ViewStyle;
  headerCompact: ViewStyle;
  logoRow: ViewStyle;
  logoMark: ViewStyle;
  logoMarkSmall: ViewStyle;
  logoSquare: ViewStyle;
  logoSquareSmall: ViewStyle;
  logoCircle: ViewStyle;
  logoCircleSmall: ViewStyle;
  themeToggle: ViewStyle;
  redLine: ViewStyle;
  title: TextStyle;
  titleSmall: TextStyle;
  form: ViewStyle;
  buttonContainer: ViewStyle;
  footer: ViewStyle;
  divider: ViewStyle;
}

export const sharedStyles = StyleSheet.create<SharedStyles>({
  flex1: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  scrollContentAuth: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  header: {
    marginBottom: 48,
  },
  headerCompact: {
    marginBottom: 40,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoMark: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMarkSmall: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSquare: {
    width: 32,
    height: 32,
  },
  logoSquareSmall: {
    width: 24,
    height: 24,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF0000',
    marginLeft: 8,
  },
  logoCircleSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF0000',
    marginLeft: 6,
  },
  themeToggle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redLine: {
    width: 60,
    height: 4,
    backgroundColor: '#FF0000',
    marginTop: spacing.md,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
  },
  titleSmall: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 46,
  },
  form: {
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
  footer: {
    marginTop: 'auto',
  },
  divider: {
    height: 1,
    marginBottom: spacing.lg,
  },
});
