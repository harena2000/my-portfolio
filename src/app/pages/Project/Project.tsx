"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { CV } from "@/constant/cv";
import { motion } from "framer-motion";
import { ProjectCard } from "./component";
import Image from "next/image";

export function Projects() {
  return (
    <AnimatedSection
      id="project"
      className="w-full h-full flex items-start justify-center text-white p-16 scrollbar-furtif"
    >
      <div className="max-w-8xl mx-auto px-6 w-full">
        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8 text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Projects
        </motion.h2>

        {/* Grid layout — only 2 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 items-start">
          {/* 🧱 Left column — Project cards (full width on md and sm) */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-4 p-4"
            style={{ maxHeight: "calc(100dvh - 500px)" }}
          >
            {CV.projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>

          {/* 🖼️ Right column — Illustration (hidden on md and sm) */}
          <div className="hidden lg:flex flex-shrink-0 w-full relative self-start -mt-8 h-[320px] lg:h-[460px]">
            <Image
              src="/images/project.png"
              alt="Projects illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default Projects;
