export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Tools",
] as const;

export const PROFICIENCY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Expert",
] as const;

export const EXPERIENCE_TYPES = ["Work", "Education"] as const;

export const CONTACT_STATUSES = ["Unread", "Read", "Archived"] as const;

export const LANGUAGE_LEVELS = [
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Beginner",
] as const;
