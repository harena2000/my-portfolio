import apiClient from "./client";
import type { HomeData } from "@/lib/types";

// Mock data fallback
const mockHomeData: HomeData = {
  fullName: "Harena Rico",
  tagline: "Full-stack Mobile & Web Developer",
  bio: "Passionate developer specializing in Flutter, Next.js, TypeScript, and GIS solutions.",
  avatarUrl: "",
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "hello@example.com",
  },
};

export const homeApi = {
  get: async (): Promise<HomeData> => {
    try {
      const { data } = await apiClient.get<HomeData>("/api/home");
      return data;
    } catch {
      return mockHomeData;
    }
  },

  update: async (payload: HomeData): Promise<HomeData> => {
    const { data } = await apiClient.put<HomeData>("/api/home", payload);
    return data;
  },
};
