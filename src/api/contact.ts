import apiClient from "./client";
import type { ContactMessage } from "@/lib/types";

const mockMessages: ContactMessage[] = [
  {
    id: "1",
    senderName: "John Doe",
    senderEmail: "john@example.com",
    message: "Hi! I love your portfolio. Would you be interested in working on a project together?",
    dateReceived: "2025-12-15T10:30:00Z",
    status: "Unread",
  },
  {
    id: "2",
    senderName: "Jane Smith",
    senderEmail: "jane@company.com",
    message: "We have an open position that matches your skill set. Let's schedule a call.",
    dateReceived: "2025-12-10T14:00:00Z",
    status: "Read",
  },
];

export const contactApi = {
  getAll: async (status?: string): Promise<ContactMessage[]> => {
    try {
      const params = status ? { status } : {};
      const { data } = await apiClient.get<ContactMessage[]>("/api/contact", { params });
      return data;
    } catch {
      return status
        ? mockMessages.filter((m) => m.status === status)
        : mockMessages;
    }
  },

  updateStatus: async (
    id: string,
    status: ContactMessage["status"]
  ): Promise<ContactMessage> => {
    const { data } = await apiClient.put<ContactMessage>(
      `/api/contact/${id}`,
      { status }
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/contact/${id}`);
  },
};
