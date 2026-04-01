import apiClient from "./client";
import type { Project } from "@/lib/types";

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Portfolio Website",
    shortDescription: "Personal developer portfolio built with Next.js",
    fullDescription: "A modern developer portfolio featuring snap-scroll navigation, animations, and responsive design.",
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
    thumbnailUrl: "",
    liveDemoUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    displayOrder: 0,
  },
];

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    try {
      const { data } = await apiClient.get<Project[]>("/api/projects");
      return data;
    } catch {
      return mockProjects;
    }
  },

  create: async (payload: Omit<Project, "id">): Promise<Project> => {
    const { data } = await apiClient.post<Project>("/api/projects", payload);
    return data;
  },

  update: async (id: string, payload: Partial<Project>): Promise<Project> => {
    const { data } = await apiClient.put<Project>(`/api/projects/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/projects/${id}`);
  },
};
