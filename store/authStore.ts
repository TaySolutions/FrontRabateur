import { MOCK_USERS } from "@/data/mockData";
import type { User } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 700));

    const found = MOCK_USERS.find(
      (u) => u.email === email && (u as any)._password === password,
    );

    if (found) {
      set({ user: found, isLoading: false });
      return true;
    }

    set({ isLoading: false, error: "Email ou mot de passe incorrect" });
    return false;
  },

  logout: () => set({ user: null, error: null }),
}));
