"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export type Skill = {
  name: string;
  level: number;
  logo?: string;
};

interface SkillsCardProps {
  skill: Skill;
  align?: "left" | "right";
}

export function SkillsCard({ skill }: SkillsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.01 }}
      className="w-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 transition shadow-sm"
      style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
    >
      {/* Row: logo | content */}
      <div className="flex items-start gap-4">
        {skill.logo && (
          <div className="flex-shrink-0 w-10 h-10 relative">
            <Image src={skill.logo} alt={`${skill.name} logo`} fill className="object-contain" />
          </div>
        )}

        {/* The content area must be able to shrink: use min-w-0 for truncation */}
        <div className="flex-1 min-w-0">
          {/* Top row: name (truncated) + percent */}
          <div className="flex items-center justify-between gap-3">
            <div className="truncate font-medium text-sm sm:text-base">
              {skill.name}
            </div>

            {/* percent is kept separate so it doesn't overlay the progress */}
            <div className="flex-shrink-0 text-xs sm:text-sm text-gray-300 whitespace-nowrap pl-2">
              {skill.level}%
            </div>
          </div>

          {/* Progress container — takes full available width inside the card padding */}
          <div className="mt-3">
            {/* Ensure Progress component fills this container and has rounded corners */}
            <div className="w-full h-2 rounded-full overflow-hidden">
              {/* If your Progress accepts className, pass `w-full h-full` */}
              <Progress value={skill.level} className="w-full h-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

