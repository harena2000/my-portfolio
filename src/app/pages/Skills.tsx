'use client'

import { AnimatedSection } from "@/components/AnimatedSection";
import { Progress } from "@/components/ui/progress";
import { CV } from "@/constant/cv";

export function Skills() {
  return (
    <AnimatedSection id="skills" className="min-h-screen flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {CV.skills.map((s) => (
            <div key={s.name} className="p-4 border rounded-lg">
              <div className="flex justify-between mb-1">
                <span>{s.name}</span>
                <span>{s.level}%</span>
              </div>
              <Progress value={s.level} />
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
