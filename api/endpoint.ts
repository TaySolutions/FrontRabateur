// Update this with your actual backend URL
export const API_BASE_URL = __DEV__ ? "localhost:5000" : "";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/Auth/Login",
    LOGIN_B2B: "/api/Auth/LoginB2B",
  },
} as const;
