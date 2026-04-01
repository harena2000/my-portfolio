import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Home
export const homeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  bio: z.string().min(1, "Bio is required"),
  avatarUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  socialLinks: z.object({
    github: z.string().url("Must be a valid URL").or(z.literal("")),
    linkedin: z.string().url("Must be a valid URL").or(z.literal("")),
    twitter: z.string().url("Must be a valid URL").or(z.literal("")),
    email: z.string().email("Must be a valid email").or(z.literal("")),
  }),
});

// Skills
export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  iconUrl: z.string().min(1, "Icon URL or slug is required"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.enum(["Beginner", "Intermediate", "Expert"]),
});

// Projects
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  techStack: z.array(z.string()).min(1, "At least one tech is required"),
  thumbnailUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  liveDemoUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  featured: z.boolean(),
  displayOrder: z.number().int().min(0),
});

// Experience
export const experienceSchema = z.object({
  type: z.enum(["Work", "Education"]),
  companyOrSchool: z.string().min(1, "Company/School is required"),
  roleOrDegree: z.string().min(1, "Role/Degree is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable(),
  isPresent: z.boolean(),
  description: z.string().min(1, "Description is required"),
  logoUrl: z.string().url("Must be a valid URL").or(z.literal("")),
});

// Contact (update status only)
export const contactUpdateSchema = z.object({
  status: z.enum(["Unread", "Read", "Archived"]),
});

// Resume
export const certificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  url: z.string().url("Must be a valid URL").or(z.literal("")),
});

export const languageSchema = z.object({
  name: z.string().min(1, "Language is required"),
  level: z.string().min(1, "Level is required"),
});

export const resumeSchema = z.object({
  summary: z.string().min(1, "Summary is required"),
  skills: z.array(z.string()),
  certifications: z.array(certificationSchema),
  languages: z.array(languageSchema),
});
