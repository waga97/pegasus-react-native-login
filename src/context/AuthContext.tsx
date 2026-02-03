import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type ReactElement,
} from 'react';
import type { User, AuthResult, AuthContextValue } from '../types';
import { authService } from '../services/AuthService';

/**
 * Auth Context
 * Single responsibility: manage authentication state
 * Business logic delegated to AuthService
 */

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const restoreSession = async (): Promise<void> => {
      try {
        const restoredUser = await authService.restoreSession();
        if (restoredUser) {
          setUser(restoredUser);
          setIsDemo(authService.isDemo(restoredUser.email));
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      // Simulate network delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await authService.login(email, password);
      if (result.success) {
        const restoredUser = await authService.restoreSession();
        if (restoredUser) {
          setUser(restoredUser);
          setIsDemo(authService.isDemo(restoredUser.email));
        }
      }
      return result;
    } catch {
      return { success: false, error: 'An error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      // Simulate network delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await authService.signup(name, email, password);
      if (result.success) {
        const restoredUser = await authService.restoreSession();
        if (restoredUser) {
          setUser(restoredUser);
          setIsDemo(false);
        }
      }
      return result;
    } catch {
      return { success: false, error: 'An error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsDemo(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
