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
      className="min-h-screen flex items-center justify-center text-white py-12"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Skills
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {CV.skills.map((s) => (
            <motion.div
              key={s.name}
              whileHover={{ scale: 1.02, y: -3 }}
              className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition"
            >
              <div className="grid grid-rows-[32px,auto] items-center gap-2">
                {s.logo && (
                  <div className="relative w-8 h-8 row-span-1">
                    <Image
                      src={s.logo}
                      alt={`${s.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="">
                  <div className="flex justify-between mb-2">
                    {" "}
                    <span className="font-medium">{s.name}</span>{" "}
                    <span className="text-sm text-gray-300">{s.level}%</span>{" "}
                  </div>{" "}
                  <Progress value={s.level} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
