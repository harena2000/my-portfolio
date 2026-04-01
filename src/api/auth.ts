import apiClient from "./client";
import type { AuthResponse, LoginCredentials } from "@/lib/types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/api/auth/login",
      credentials
    );
    return data;
  },

  me: async () => {
    const { data } = await apiClient.get("/api/auth/me");
    return data;
  },
};
