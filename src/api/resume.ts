import apiClient from "./client";
import type { ResumeData } from "@/lib/types";

const mockResume: ResumeData = {
  pdfUrl: null,
  summary: "Passionate full-stack developer with experience in web and mobile development.",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "Flutter", "Docker"],
  workExperience: [],
  education: [],
  certifications: [
    { name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2024-01", url: "" },
  ],
  languages: [
    { name: "French", level: "Native" },
    { name: "English", level: "Fluent" },
  ],
};

export const resumeApi = {
  get: async (): Promise<ResumeData> => {
    try {
      const { data } = await apiClient.get<ResumeData>("/api/resume");
      return data;
    } catch {
      return mockResume;
    }
  },

  update: async (payload: Partial<ResumeData>): Promise<ResumeData> => {
    const { data } = await apiClient.put<ResumeData>("/api/resume", payload);
    return data;
  },

  uploadPdf: async (file: File): Promise<{ pdfUrl: string }> => {
    const formData = new FormData();
    formData.append("pdf", file);
    const { data } = await apiClient.post<{ pdfUrl: string }>(
      "/api/resume/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  deletePdf: async (): Promise<void> => {
    await apiClient.delete("/api/resume/pdf");
  },
};
