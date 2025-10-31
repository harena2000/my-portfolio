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
      className="w-full h-full flex items-start justify-center text-white py-12"
    >
      <div className="max-w-8xl mx-auto px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8 text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 items-start">
          {/* Left column: project grid (2 columns on md+, scrollable when many items) */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pr-4 scrollbar-furtif p-4"
            style={{ maxHeight: "calc(100dvh - 200px)" }}
          >
            {CV.projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>

          {/* Right column: illustration / image (no border, higher position) */}
          <div className="flex-shrink-0 w-full relative self-start -mt-8 md:-mt-12 h-[420px] md:h-[760px]">
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
// ...existing code...