// ─── Admin Backoffice Types ───

// Auth
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; email: string; name: string };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

// Home
export interface HomeData {
  fullName: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
  };
}

// Skills
export interface Skill {
  id: string;
  name: string;
  iconUrl: string;
  category: "Frontend" | "Backend" | "DevOps" | "Tools" | string;
  proficiency: "Beginner" | "Intermediate" | "Expert";
  order?: number;
}

// Projects
export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  thumbnailUrl: string;
  liveDemoUrl: string;
  githubUrl: string;
  featured: boolean;
  displayOrder: number;
}

// Experience
export interface Experience {
  id: string;
  type: "Work" | "Education";
  companyOrSchool: string;
  roleOrDegree: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  description: string;
  logoUrl: string;
}

// Contact
export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string;
  dateReceived: string;
  status: "Unread" | "Read" | "Archived";
}

// Resume
export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface ResumeData {
  pdfUrl: string | null;
  summary: string;
  skills: string[];
  workExperience: Experience[];
  education: Experience[];
  certifications: Certification[];
  languages: Language[];
}

// API
export interface ApiError {
  message: string;
  status?: number;
}
