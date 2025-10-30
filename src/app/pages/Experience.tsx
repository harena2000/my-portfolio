"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { CV } from "@/constant/cv";
import { motion } from "framer-motion";

export function Experience() {
  return (
    <AnimatedSection
      id="experience"
      className="w-full h-full flex items-center justify-center text-white py-12"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Experience
        </motion.h2>

        <div className="space-y-6">
          {CV.experience.map((e, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -3 }}
              className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition"
            >
              <h3 className="text-xl font-semibold">{e.role}</h3>
              <p className="text-sm text-gray-400">
                {e.company} | {e.from} - {e.to}
              </p>
              <p className="text-gray-300 text-sm mt-3">{e.details}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
