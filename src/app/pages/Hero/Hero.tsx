'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CV } from '@/constant/cv'
import Image from 'next/image'
import { CompanyCard } from '@/app/pages/Hero/component'

export function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-gradient-to-b from-[#020618] via-[#0f1e64] to-[#132f9c] text-white"
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
              <span className="text-white/90">Mahefaniaina.</span>
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

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center md:justify-end"
        >
          {/* Glow behind image */}
          <div className="absolute -top-10 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl" />
          
          {/* Profile Image */}
          <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
            <Image
              src="/profile.png"
              alt="Harena Rico"
              fill
              className="object-cover rounded-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </motion.div>
      </div>

      {/* Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="mt-16 md:mt-24 max-w-7xl mx-auto grid md:grid-cols-3 gap-6 z-10"
      >
        {CV.experience.slice(0, 3).map((exp, idx) => (
          <CompanyCard key={idx} exp={exp} />
        ))}
      </motion.div>

      {/* Gradient glow background overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" /> */}
    </section>
  )
}
