"use client";

import { useQuery } from "@tanstack/react-query";
import AdminShell from "@/components/admin/layout/AdminShell";
import Header from "@/components/admin/layout/Header";
import { Skeleton } from "@/components/admin/ui/Skeleton";
import { skillsApi } from "@/api/skills";
import { projectsApi } from "@/api/projects";
import { experienceApi } from "@/api/experience";
import { contactApi } from "@/api/contact";
import {
  Layers,
  FolderKanban,
  Briefcase,
  Mail,
  Star,
  AlertCircle,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  isLoading,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent: string;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/15 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2.5 ${accent}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">
            {label}
          </p>
          {isLoading ? (
            <Skeleton className="h-7 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-white">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const skills = useQuery({ queryKey: ["skills"], queryFn: skillsApi.getAll });
  const projects = useQuery({ queryKey: ["projects"], queryFn: projectsApi.getAll });
  const experience = useQuery({ queryKey: ["experience"], queryFn: experienceApi.getAll });
  const messages = useQuery({ queryKey: ["contact"], queryFn: () => contactApi.getAll() });

  const unreadCount = messages.data?.filter((m) => m.status === "Unread").length ?? 0;
  const featuredCount = projects.data?.filter((p) => p.featured).length ?? 0;

  return (
    <AdminShell>
      <Header title="Dashboard" description="Overview of your portfolio content" />
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Layers}
            label="Skills"
            value={skills.data?.length ?? 0}
            accent="bg-blue-500/15 text-blue-400"
            isLoading={skills.isLoading}
          />
          <StatCard
            icon={FolderKanban}
            label="Projects"
            value={projects.data?.length ?? 0}
            accent="bg-purple-500/15 text-purple-400"
            isLoading={projects.isLoading}
          />
          <StatCard
            icon={Briefcase}
            label="Experience"
            value={experience.data?.length ?? 0}
            accent="bg-green-500/15 text-green-400"
            isLoading={experience.isLoading}
          />
          <StatCard
            icon={Mail}
            label="Messages"
            value={messages.data?.length ?? 0}
            accent="bg-orange-500/15 text-orange-400"
            isLoading={messages.isLoading}
          />
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Unread messages */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-orange-400" />
              <h3 className="text-sm font-semibold text-white">Unread Messages</h3>
            </div>
            {messages.isLoading ? (
              <Skeleton className="h-20" />
            ) : unreadCount === 0 ? (
              <p className="text-sm text-gray-500">No unread messages</p>
            ) : (
              <div className="space-y-2">
                {messages.data
                  ?.filter((m) => m.status === "Unread")
                  .slice(0, 3)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="rounded-lg bg-white/5 px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-white">
                        {m.senderName}
                      </span>
                      <span className="text-gray-500 ml-2 text-xs">
                        {m.senderEmail}
                      </span>
                      <p className="text-gray-400 text-xs mt-1 truncate">
                        {m.message}
                      </p>
                    </div>
                  ))}
                {unreadCount > 3 && (
                  <p className="text-xs text-gray-500">
                    +{unreadCount - 3} more unread
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Featured projects */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star size={18} className="text-yellow-400" />
              <h3 className="text-sm font-semibold text-white">Featured Projects</h3>
            </div>
            {projects.isLoading ? (
              <Skeleton className="h-20" />
            ) : featuredCount === 0 ? (
              <p className="text-sm text-gray-500">No featured projects</p>
            ) : (
              <div className="space-y-2">
                {projects.data
                  ?.filter((p) => p.featured)
                  .slice(0, 3)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2"
                    >
                      <Star size={14} className="text-yellow-400" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {p.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.techStack.join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Skills by category */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Skills by Category</h3>
          {skills.isLoading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(
                (skills.data ?? []).reduce(
                  (acc, s) => {
                    acc[s.category] = (acc[s.category] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                )
              ).map(([category, count]) => (
                <div
                  key={category}
                  className="rounded-lg bg-white/5 px-4 py-3 text-center"
                >
                  <p className="text-lg font-bold text-white">{count}</p>
                  <p className="text-xs text-gray-500 font-mono">{category}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
