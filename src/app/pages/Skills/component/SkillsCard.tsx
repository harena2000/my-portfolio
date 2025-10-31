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

export function SkillsCard({ skill, align = "right" }: SkillsCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 1.02, y: -3 }}
      className="flex flex-col sm:flex-row items-center sm:items-center gap-4 rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] transition w-full"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {skill.logo && (
        <div className="flex-shrink-0 w-12 h-12 relative mb-2 sm:mb-0">
          <Image
            src={skill.logo}
            alt={`${skill.name} logo`}
            fill
            className="object-contain"
          />
        </div>
      )}

      <div className="flex-1 text-center sm:text-right w-full">
        <div className="flex justify-between mb-2 items-center">
          <span className="font-medium">{skill.name}</span>
          <span className="text-sm text-gray-300">{skill.level}%</span>
        </div>
        <Progress value={skill.level} />
      </div>
    </motion.div>
  );
}
