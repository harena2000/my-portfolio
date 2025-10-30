"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { Progress } from "@/components/ui/progress";
import { CV } from "@/constant/cv";
import { motion } from "framer-motion";
import Image from "next/image";

export function Skills() {
  return (
    <AnimatedSection
      id="skills"
      className="w-full h-full flex items-center justify-center text-white"
    >
      <div className="max-w-8xl mx-auto px-20 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Skills
        </motion.h2>

        <div className="grid md:grid-cols-2 items-center justify-center">
          <div className="flex-shrink-0 w-full h-full relative">
            <Image
              src="/images/dev.png"
              alt={`Images dev`}
              fill
              className="object-contain"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {CV.skills.map((s) => (
              <motion.div
                key={s.name}
                whileTap={{ scale: 1.02, y: -3 }}
                className="flex items-center gap-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition"
              >
                {s.logo && (
                  <div className="flex-shrink-0 w-12 h-12 relative">
                    <Image
                      src={s.logo}
                      alt={`${s.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-sm text-gray-300">{s.level}%</span>
                  </div>
                  <Progress value={s.level} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
