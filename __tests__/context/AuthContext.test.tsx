import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const waitForInitialization = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
};

describe('AuthContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('useAuth hook', () => {
    it('throws error when used outside AuthProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('initial state', () => {
    it('starts with no user and isInitializing true', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isDemo).toBe(false);
      expect(result.current.isInitializing).toBe(true);
    });

    it('sets isInitializing to false after initialization', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      expect(result.current.isInitializing).toBe(false);
    });

    it('restores session from AsyncStorage on initialization', async () => {
      renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@auth_user');
    });
  });

  describe('login', () => {
    it('logs in successfully with valid demo credentials', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      let response;
      await act(async () => {
        response = await result.current.login('john@example.com', 'Password123');
      });

      expect(response).toEqual({ success: true });
      expect(result.current.user).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isDemo).toBe(true);
    });

    it('normalizes email to lowercase and trims whitespace', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      await act(async () => {
        await result.current.login('  JOHN@EXAMPLE.COM  ', 'Password123');
      });

      expect(result.current.user?.email).toBe('john@example.com');
    });

    it('returns error for non-existent email', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      let response;
      await act(async () => {
        response = await result.current.login('unknown@example.com', 'password');
      });

      expect(response).toEqual({
        success: false,
        error: 'No account found with this email',
      });
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('returns error for incorrect password', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      let response;
      await act(async () => {
        response = await result.current.login('john@example.com', 'wrongpassword');
      });

      expect(response).toEqual({
        success: false,
        error: 'Incorrect password',
      });
      expect(result.current.user).toBeNull();
    });

    it('sets isLoading during login process', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      expect(result.current.isLoading).toBe(false);

      let loginPromise: Promise<any>;
      act(() => {
        loginPromise = result.current.login('john@example.com', 'Password123');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        await loginPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('persists user to AsyncStorage on successful login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      await act(async () => {
        await result.current.login('john@example.com', 'Password123');
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@auth_user',
        JSON.stringify({ name: 'John Doe', email: 'john@example.com' })
      );
    });
  });

  describe('signup', () => {
    it('creates new user successfully', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      let response;
      await act(async () => {
        response = await result.current.signup('New User', 'new@example.com', 'password123');
      });

      expect(response).toEqual({ success: true });
      expect(result.current.user).toEqual({
        name: 'New User',
        email: 'new@example.com',
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isDemo).toBe(false);
    });

    it('normalizes email and trims name', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      await act(async () => {
        await result.current.signup('  Jane Doe  ', '  NEW@EXAMPLE.COM  ', 'password');
      });

      expect(result.current.user).toEqual({
        name: 'Jane Doe',
        email: 'new@example.com',
      });
    });

    it('returns error when email already exists', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      let response;
      await act(async () => {
        response = await result.current.signup('John Copy', 'john@example.com', 'password');
      });

      expect(response).toEqual({
        success: false,
        error: 'An account with this email already exists',
      });
      expect(result.current.user).toBeNull();
    });

    it('saves new user to AsyncStorage', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      await act(async () => {
        await result.current.signup('Test User', 'test@example.com', 'password123');
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@users_db',
        expect.stringContaining('test@example.com')
      );
    });

    it('allows login with newly signed up account', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      await act(async () => {
        await result.current.signup('Test User', 'test@example.com', 'mypassword');
      });

      await act(async () => {
        await result.current.logout();
      });

      let loginResponse;
      await act(async () => {
        loginResponse = await result.current.login('test@example.com', 'mypassword');
      });

      expect(loginResponse).toEqual({ success: true });
      expect(result.current.user?.email).toBe('test@example.com');
      expect(result.current.isDemo).toBe(false);
    });
  });

  describe('logout', () => {
    it('clears user state', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      await act(async () => {
        await result.current.login('john@example.com', 'Password123');
      });

      expect(result.current.user).not.toBeNull();

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isDemo).toBe(false);
    });

    it('removes user from AsyncStorage', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      await act(async () => {
        await result.current.login('john@example.com', 'Password123');
      });

      jest.clearAllMocks();

      await act(async () => {
        await result.current.logout();
      });

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@auth_user');
    });
  });

  describe('isDemo flag', () => {
    it('is true for demo users', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      await act(async () => {
        await result.current.login('john@example.com', 'Password123');
      });

      expect(result.current.isDemo).toBe(true);

      await act(async () => {
        await result.current.logout();
      });

      await act(async () => {
        await result.current.login('jane@example.com', 'Password123');
      });

      expect(result.current.isDemo).toBe(true);
    });

    it('is false for newly signed up users', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      await act(async () => {
        await result.current.signup('New User', 'new@example.com', 'password123');
      });

      expect(result.current.isDemo).toBe(false);
    });

    it('resets to false on logout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitForInitialization();

      await act(async () => {
        await result.current.login('john@example.com', 'Password123');
      });

      expect(result.current.isDemo).toBe(true);

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isDemo).toBe(false);
    });
  });
});
