import { useAuthhStore } from "@/store";
import { LoginRequest } from "@/types";
import { useCallback, useEffect } from "react";

export function useAuth() {
  const store = useAuthhStore();

  useEffect(() => {
    store.initialize();
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      return store.login(credentials);
    },
    [store.login],
  );

  const logout = useCallback(async () => {
    await store.logout();
  }, [store.logout]);

  return {
    // State
    user: store.user,
    token: store.token,
    isLoading: store.isLoading,
    error: store.error,
    isAuthenticated: store.isAuthenticated,

    // Actions
    login,
    loginB2B: store.loginB2B,
    logout,
    clearError: store.clearError,
    initialize: store.initialize,
  };
}
