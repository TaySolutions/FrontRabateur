import { AuthUser } from "@/types";
import * as SecureStore from "expo-secure-store";

const KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
} as const;

export const storage = {
  // Token
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.TOKEN);
  },

  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.TOKEN, token);
  },

  // User
  async getUser(): Promise<AuthUser | null> {
    const userJson = await SecureStore.getItemAsync(KEYS.USER);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as AuthUser;
    } catch {
      return null;
    }
  },

  async setUser(user: AuthUser): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER, JSON.stringify(user));
  },

  // Clear all auth data
  async clearAuth(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.TOKEN);
    await SecureStore.deleteItemAsync(KEYS.USER);
  },

  // Initialize auth (check if user is logged in)
  async initAuth(): Promise<{ user: AuthUser; token: string } | null> {
    const [token, user] = await Promise.all([
      storage.getToken(),
      storage.getUser(),
    ]);

    if (token && user) {
      return { user, token };
    }
    await storage.clearAuth();
    return null;
  },
};
