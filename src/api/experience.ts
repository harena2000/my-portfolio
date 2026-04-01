import apiClient from "./client";
import type { Experience } from "@/lib/types";

const mockExperience: Experience[] = [
  {
    id: "1",
    type: "Work",
    companyOrSchool: "Tech Company",
    roleOrDegree: "Full-stack Developer",
    location: "Remote",
    startDate: "2023-01-01",
    endDate: null,
    isPresent: true,
    description: "Building web and mobile applications using modern technologies.",
    logoUrl: "",
  },
  {
    id: "2",
    type: "Education",
    companyOrSchool: "University",
    roleOrDegree: "Computer Science Degree",
    location: "Madagascar",
    startDate: "2019-09-01",
    endDate: "2023-06-30",
    isPresent: false,
    description: "Bachelor's degree in Computer Science with focus on software engineering.",
    logoUrl: "",
  },
];

export const experienceApi = {
  getAll: async (): Promise<Experience[]> => {
    try {
      const { data } = await apiClient.get<Experience[]>("/api/experience");
      return data;
    } catch {
      return mockExperience;
    }
  },

  create: async (payload: Omit<Experience, "id">): Promise<Experience> => {
    const { data } = await apiClient.post<Experience>("/api/experience", payload);
    return data;
  },

  update: async (id: string, payload: Partial<Experience>): Promise<Experience> => {
    const { data } = await apiClient.put<Experience>(`/api/experience/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/experience/${id}`);
  },
};
