import client from "@/api/client";
import { ENDPOINTS } from "@/api/endpoint";
import { AuthUser, LoginRequest, LoginResponse } from "@/types";

function mapToAuthUser(data: LoginResponse, token: string): AuthUser {
  return {
    id: data.id || "",
    fullName: data.fullName || "",
    userName: data.userName || "",
    role: data.role || "",
    checkoutId: data.checkoutId,
    ccaId: data.ccaId,
    childCheckoutId: data.childCheckoutId,
    token,
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthUser> {
    const { data } = await client.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    );

    if (!data.success || !data.token) {
      throw new Error(data.message || "Identifiants incorrects");
    }

    return mapToAuthUser(data, data.token);
  },

  async loginB2B(credentials: LoginRequest): Promise<AuthUser> {
    const { data } = await client.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN_B2B,
      credentials,
    );

    if (!data.success || !data.token) {
      throw new Error(data.message || "Identifiants incorrects");
    }

    return mapToAuthUser(data, data.token);
  },
};
