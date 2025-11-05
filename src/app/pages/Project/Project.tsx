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
      className="scroll-mt-24 sm:scroll-mt-28 lg:scroll-mt-36 w-full min-h-screen flex items-start justify-center text-white p-16 scrollbar-furtif"
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

        {/* Responsive 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 items-start">
          {/* 🧱 Left column — Fixed proportion */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pr-4 p-4"
            style={{ maxHeight: "calc(100dvh - 500px)" }}
          >
            {CV.projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
          {/* 🖼️ Right column — More flexible & responsive */}
          <div className="flex justify-center items-center w-full relative self-start">
            <div className="relative w-full max-w-[500px] h-[240px] sm:h-[320px] lg:h-[460px] hidden lg:block">
              <Image
                src="/images/project.png"
                alt="Projects illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default Projects;
