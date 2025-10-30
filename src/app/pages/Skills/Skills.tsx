// ...existing code...
"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { CV } from "@/constant/cv";
import { motion } from "framer-motion";
import Image from "next/image";
import { SkillsCard } from "@/app/pages/Skills/component";


export function Skills() {
  return (
    <AnimatedSection
      id="skills"
      className="w-full h-full flex items-center justify-center text-white"
    >
      {/* shift the whole content up by an exact amount without using items-start */}
      <div className="max-w-8xl mx-auto px-8 w-full transform -translate-y-[80px]">
        <div className="flex justify-end">
          {/* remove the global heading from here */}
        </div>

        <div className="grid md:grid-cols-2 items-center justify-start gap-8">
          {/* Illustration on the left */}
          <div className="flex-shrink-0 w-full h-full relative order-1 md:order-1">
            <Image
              src="/images/dev.png"
              alt={`Images dev`}
              fill
              className="object-contain"
            />
          </div>

          {/* Skills column on the right with heading at top-left */}
          <div className="order-2 md:order-2 flex flex-col">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold mb-3 text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
            >
              Skills
            </motion.h2>

            <div className="grid grid-cols-2 gap-6">
              {CV.skills.map((s) => (
                <SkillsCard key={s.name} skill={s} align="right" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
// ...existing code...