import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type ReactElement,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  User,
  StoredUser,
  UsersDatabase,
  AuthResult,
  AuthContextValue,
} from '../types';

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = '@auth_user';
const USERS_DB_KEY = '@users_db';

// Sample users for demo purposes
const SAMPLE_USERS: UsersDatabase = {
  'john@example.com': {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123',
  },
  'jane@example.com': {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'Password123',
  },
};

interface AuthProviderProps {
  children: ReactNode;
}

const DEMO_EMAILS = Object.keys(SAMPLE_USERS);

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async (): Promise<void> => {
    try {
      const userJson = await AsyncStorage.getItem(AUTH_KEY);
      if (userJson) {
        const userData = JSON.parse(userJson) as User;
        setUser(userData);
        setIsDemo(DEMO_EMAILS.includes(userData.email.toLowerCase()));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const getUsersDB = async (): Promise<UsersDatabase> => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_DB_KEY);
      const sessionUsers = usersJson ? (JSON.parse(usersJson) as UsersDatabase) : {};
      // Merge sample users with any session signups (sample users take precedence)
      return { ...sessionUsers, ...SAMPLE_USERS };
    } catch {
      return { ...SAMPLE_USERS };
    }
  };

  const saveUsersDB = async (users: UsersDatabase): Promise<void> => {
    await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const usersDB = await getUsersDB();
      const normalizedEmail = email.toLowerCase().trim();

      const existingUser: StoredUser | undefined = usersDB[normalizedEmail];

      if (!existingUser) {
        return { success: false, error: 'No account found with this email' };
      }

      if (existingUser.password !== password) {
        return { success: false, error: 'Incorrect password' };
      }

      const userData: User = { name: existingUser.name, email: existingUser.email };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsDemo(DEMO_EMAILS.includes(normalizedEmail));

      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const usersDB = await getUsersDB();
      const normalizedEmail = email.toLowerCase().trim();

      if (usersDB[normalizedEmail]) {
        return { success: false, error: 'An account with this email already exists' };
      }

      usersDB[normalizedEmail] = {
        name: name.trim(),
        email: normalizedEmail,
        password,
      };

      await saveUsersDB(usersDB);

      const userData: User = { name: name.trim(), email: normalizedEmail };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      setUser(userData);
      setIsDemo(false);

      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      setUser(null);
      setIsDemo(false);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isInitializing,
    isAuthenticated: !!user,
    isDemo,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
