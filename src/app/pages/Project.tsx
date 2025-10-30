"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { CV } from "@/constant/cv";
import { motion } from "framer-motion";

export function Projects() {
  return (
    <AnimatedSection
      id="project"
      className="w-full h-full flex items-center justify-center text-white py-12"
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Projects
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {CV.projects.map((p) => (
            <motion.div
              key={p.title}
              whileHover={{ scale: 1.02, y: -3 }}
              className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition"
            >
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{p.subtitle}</p>
              <p className="text-sm text-gray-300 mb-4">{p.desc}</p>
              <div className="text-xs text-gray-400">{p.tech.join(" • ")}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
