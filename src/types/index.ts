import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// User types
export interface User {
  name: string;
  email: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface UsersDatabase {
  [email: string]: StoredUser;
}

// Auth types
export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

// Theme types
export interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => Promise<void>;
}

export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  error: string;
  success: string;
  border: string;
  white: string;
  black: string;
  red: string;
  green: string;
  inputBg: string;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Home: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;
export type ForgotPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Component prop types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'filled' | 'outline';
  isDark?: boolean;
}

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  isDark?: boolean;
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined;
  email?: string;
  password?: string;
  name?: string;
  form?: string;
}

export interface PasswordStrength {
  level: number;
  label: string;
}
