import apiClient from "./client";
import type { Skill } from "@/lib/types";

const mockSkills: Skill[] = [
  { id: "1", name: "React", iconUrl: "react", category: "Frontend", proficiency: "Expert", order: 0 },
  { id: "2", name: "Next.js", iconUrl: "nextjs", category: "Frontend", proficiency: "Expert", order: 1 },
  { id: "3", name: "TypeScript", iconUrl: "typescript", category: "Frontend", proficiency: "Expert", order: 2 },
  { id: "4", name: "Node.js", iconUrl: "nodejs", category: "Backend", proficiency: "Intermediate", order: 0 },
  { id: "5", name: "Docker", iconUrl: "docker", category: "DevOps", proficiency: "Intermediate", order: 0 },
];

export const skillsApi = {
  getAll: async (): Promise<Skill[]> => {
    try {
      const { data } = await apiClient.get<Skill[]>("/api/skills");
      return data;
    } catch {
      return mockSkills;
    }
  },

  create: async (payload: Omit<Skill, "id">): Promise<Skill> => {
    const { data } = await apiClient.post<Skill>("/api/skills", payload);
    return data;
  },

  update: async (id: string, payload: Partial<Skill>): Promise<Skill> => {
    const { data } = await apiClient.put<Skill>(`/api/skills/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/skills/${id}`);
  },
};
