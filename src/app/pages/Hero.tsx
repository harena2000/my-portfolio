'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CV } from '@/constant/cv'
import { AnimatedSection } from '@/components/AnimatedSection'

export function Hero() {
  return (
    <AnimatedSection
      id="home"
      className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden bg-gradient-to-b from-[#020618] via-[#0f1e64] to-[#132f9c] text-white"
    >
      {/* Content Container */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center z-10">
        {/* Left Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Harena Rico <br />
              <span className="text-white/90">Mahefaniaiana.</span>
            </h1>
            <p className="mt-4 text-gray-300 max-w-lg">
              {CV.profile}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-2">
              Explore Projects
            </Button>
            <Button
              variant="outline"
              className="rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 px-6 py-2"
            >
              Hire Me
            </Button>
          </div>
        </motion.div>

        {/* Right Spacer (optional image or gradient glow) */}
        <div className="relative flex justify-end">
          <div className="absolute -top-10 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="mt-16 md:mt-24 max-w-7xl mx-auto grid md:grid-cols-3 gap-6 z-10"
      >
        {CV.experience.slice(0, 3).map((exp) => (
          <div
            key={exp.company}
            className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
                {exp.company[0]}
              </div>
              <div>
                <h4 className="font-semibold text-white">{exp.company}</h4>
                <p className="text-sm text-gray-400">{exp.role}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">{exp.details}</p>
            <div className="text-xs text-gray-400">
              {exp.from} – {exp.to}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Gradient glow background overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </AnimatedSection>
  )
}
