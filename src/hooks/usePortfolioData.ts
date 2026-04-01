"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { CVData, type CVLocale } from "@/data/cv";
import { API_BASE_URL } from "@/lib/constants";

/**
 * Fetches portfolio data from the Express API.
 * Falls back to the hardcoded CVData if the API is unreachable.
 */
export function usePortfolioData() {
  const locale = useLocale();
  const fallback = CVData[locale as keyof typeof CVData] ?? CVData.en;
  const [data, setData] = useState<CVLocale>(fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [homeRes, skillsRes, projectsRes, experienceRes] =
          await Promise.allSettled([
            fetch(`${API_BASE_URL}/api/home`),
            fetch(`${API_BASE_URL}/api/skills`),
            fetch(`${API_BASE_URL}/api/projects`),
            fetch(`${API_BASE_URL}/api/experience`),
          ]);

        if (cancelled) return;

        const home =
          homeRes.status === "fulfilled" && homeRes.value.ok
            ? await homeRes.value.json()
            : null;
        const skills =
          skillsRes.status === "fulfilled" && skillsRes.value.ok
            ? await skillsRes.value.json()
            : null;
        const projects =
          projectsRes.status === "fulfilled" && projectsRes.value.ok
            ? await projectsRes.value.json()
            : null;
        const experience =
          experienceRes.status === "fulfilled" && experienceRes.value.ok
            ? await experienceRes.value.json()
            : null;

        // Map API data to CVLocale format, using fallback for missing fields
        setData({
          name: home?.fullName || fallback.name,
          title: home?.tagline || fallback.title,
          profile: home?.bio || fallback.profile,
          contact: {
            email: home?.socialLinks?.email || fallback.contact.email,
            phone: fallback.contact.phone,
            address: fallback.contact.address,
            github: home?.socialLinks?.github || fallback.contact.github,
            linkedin: home?.socialLinks?.linkedin || fallback.contact.linkedin,
          },
          skills: skills
            ? skills.map((s: { name: string; iconUrl: string; proficiency: string }) => ({
                name: s.name,
                level:
                  s.proficiency === "Expert"
                    ? 90
                    : s.proficiency === "Intermediate"
                      ? 70
                      : 50,
                logo: s.iconUrl.startsWith("/") ? s.iconUrl : `/logos/${s.iconUrl}.svg`,
              }))
            : fallback.skills,
          experience: experience
            ? experience.map(
                (e: {
                  companyOrSchool: string;
                  roleOrDegree: string;
                  startDate: string;
                  endDate: string | null;
                  isPresent: boolean;
                  description: string;
                }) => ({
                  company: e.companyOrSchool,
                  role: e.roleOrDegree,
                  from: e.startDate,
                  to: e.isPresent ? "Present" : e.endDate || "",
                  details: e.description,
                })
              )
            : fallback.experience,
          projects: projects
            ? projects.map(
                (p: {
                  title: string;
                  shortDescription: string;
                  techStack: string[];
                  featured: boolean;
                  liveDemoUrl: string;
                }) => ({
                  title: p.title,
                  desc: p.shortDescription,
                  tech: p.techStack,
                  status: p.featured ? "Completed" : "In Progress",
                  link: p.liveDemoUrl,
                })
              )
            : fallback.projects,
          resumeUrl: fallback.resumeUrl,
        });
      } catch {
        // API unreachable — keep fallback data
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [locale, fallback]);

  return { data, isLoading };
}
