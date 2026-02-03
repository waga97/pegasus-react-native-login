import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, StoredUser, UsersDatabase, AuthResult } from '../types';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { normalizeEmail, sanitizeName } from '../utils/sanitizers';

/**
 * Authentication Service
 * Single responsibility: handle all authentication business logic
 */

const AUTH_KEY = '@auth_user';
const USERS_DB_KEY = '@users_db';

// Demo users with their plain text passwords (will be hashed on init)
const DEMO_CREDENTIALS = [
  { name: 'John Doe', email: 'john@example.com', password: 'Password123' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'Password123' },
] as const;

export const DEMO_EMAILS: readonly string[] = DEMO_CREDENTIALS.map((u) => u.email);

class AuthService {
  private initialized = false;
  private demoUsers: UsersDatabase = {};

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Hash demo passwords once on initialization
    const entries = await Promise.all(
      DEMO_CREDENTIALS.map(async ({ name, email, password }) => {
        const passwordHash = await hashPassword(password);
        return [email, { name, email, passwordHash }] as const;
      })
    );

    this.demoUsers = Object.fromEntries(entries);
    this.initialized = true;
  }

  async login(email: string, password: string): Promise<AuthResult> {
    await this.initialize();

    const normalizedEmail = normalizeEmail(email);
    const usersDB = await this.getUsersDB();
    const user = usersDB[normalizedEmail];

    if (!user) {
      return { success: false, error: 'No account found with this email' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Incorrect password' };
    }

    await this.saveSession({ name: user.name, email: user.email });
    return { success: true };
  }

  async signup(name: string, email: string, password: string): Promise<AuthResult> {
    await this.initialize();

    const sanitizedName = sanitizeName(name);
    const normalizedEmail = normalizeEmail(email);
    const usersDB = await this.getUsersDB();

    if (usersDB[normalizedEmail]) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const passwordHash = await hashPassword(password);
    const newUser: StoredUser = {
      name: sanitizedName,
      email: normalizedEmail,
      passwordHash,
    };

    // Save only non-demo users to storage
    const storedUsers = await this.getStoredUsers();
    storedUsers[normalizedEmail] = newUser;
    await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(storedUsers));

    await this.saveSession({ name: sanitizedName, email: normalizedEmail });
    return { success: true };
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_KEY);
  }

  async restoreSession(): Promise<User | null> {
    const json = await AsyncStorage.getItem(AUTH_KEY);
    return json ? JSON.parse(json) : null;
  }

  isDemo(email: string): boolean {
    return DEMO_EMAILS.includes(normalizeEmail(email));
  }

  private async getUsersDB(): Promise<UsersDatabase> {
    await this.initialize();
    const storedUsers = await this.getStoredUsers();
    // Demo users take precedence (can't be overwritten)
    return { ...storedUsers, ...this.demoUsers };
  }

  private async getStoredUsers(): Promise<UsersDatabase> {
    const json = await AsyncStorage.getItem(USERS_DB_KEY);
    return json ? JSON.parse(json) : {};
  }

  private async saveSession(user: User): Promise<void> {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}

export const authService = new AuthService();
