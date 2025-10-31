"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectStatus } from "@/constant/cv";

export type Project = {
  title: string;
  subtitle?: string;
  desc?: string;
  tech?: string[];
  status?: ProjectStatus | string;
};

export function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const DESC_CUT = 160;

  const fullDesc = project.desc ?? "";
  const needsToggle = fullDesc.length > DESC_CUT;
  const preview =
    !needsToggle || expanded
      ? fullDesc
      : fullDesc
          .slice(0, DESC_CUT)
          .trimEnd()
          .replace(/\s+[^\s]*$/, "") + "…";

  const status = project.status;
  const statusMap: Record<string, { label: string; classes: string }> = {
    [ProjectStatus.COMPLETED]: { label: ProjectStatus.COMPLETED, classes: "bg-emerald-600 text-white" },
    [ProjectStatus.IN_PROGRESS]: { label: ProjectStatus.IN_PROGRESS, classes: "bg-amber-200 text-black" },
    [ProjectStatus.ON_STANDBY]: { label: ProjectStatus.ON_STANDBY, classes: "bg-slate-500 text-white" },
  };
  const badge = status
    ? statusMap[status]
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      className="rounded-2xl bg-white/2 border border-white/10 p-6 hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] transition"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {badge && (
        <span
          aria-hidden={!badge}
          className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.classes}`}
        >
          {badge.label}
        </span>
      )}
    
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      {project.subtitle && (
        <p className="text-sm text-gray-400 mb-3">{project.subtitle}</p>
      )}

      {fullDesc ? (
        <div className="mb-4">
          <p className="text-sm text-gray-300">{preview}</p>

          {needsToggle && (
            <button
              onClick={() => setExpanded((s) => !s)}
              className="mt-3 text-xs font-medium text-blue-400 hover:underline"
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      ) : null}

      {project.tech && (
        <div className="text-xs text-gray-400">{project.tech.join(" • ")}</div>
      )}
    </motion.div>
  );
}

export default ProjectCard;
