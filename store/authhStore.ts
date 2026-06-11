import { storage } from "@/lib/storage";
import { authService } from "@/services/authService";
import { AuthState, LoginRequest } from "@/types";
import { create } from "zustand";

interface AuthActions {
  // Initialize auth state from storage
  initialize: () => Promise<void>;
  // Login
  login: (credentials: LoginRequest) => Promise<boolean>;
  // Login variants
  loginB2B: (credentials: LoginRequest) => Promise<boolean>;

  // Logout
  logout: () => Promise<void>;
  // Clear error
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthhStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Initialize from secure storage
  initialize: async () => {
    set({ isLoading: true });
    try {
      const authData = await storage.initAuth();
      if (authData) {
        set({
          user: authData.user,
          token: authData.token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false, isAuthenticated: false });
      }
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false });
      console.error("Auth initialization error:", error);
    }
  },

  // Generic login handler
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(credentials);

      // Persist to secure storage
      await Promise.all([storage.setToken(user.token), storage.setUser(user)]);

      set({
        user,
        token: user.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur de connexion";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  loginB2B: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.loginB2B(credentials);
      await Promise.all([storage.setToken(user.token), storage.setUser(user)]);
      set({ user, token: user.token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur de connexion";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: async () => {
    await storage.clearAuth();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
