import { storage } from "@/lib/storage";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./endpoint";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor - attach token
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle errors
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await storage.clearAuth();
    }
    const message = error.response?.data?.message || "Une erreur est survenue";
    return Promise.reject(new Error(message));
  },
);

export default client;
