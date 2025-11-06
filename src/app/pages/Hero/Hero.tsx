'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CV } from '@/constant/cv'
import Image from 'next/image'
import { CompanyCard } from '@/app/pages/Hero/component'

export function Hero() {
  return (
    // We use overflow-y-auto as a failsafe, but the goal is to make content fit without scrolling.
    <section
      id="home"
      className="w-full h-full flex flex-col items-center justify-center p-16 scrollbar-furtif pt-150 sm:pt-120 md:pt-20 lg:pt-0"
    >
      {/* Main content container with reduced vertical gaps on mobile */}
      <div className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-x-8 gap-y-4 items-center z-10">
        
        {/* Left Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          // Reduced vertical spacing from space-y-4 to space-y-2
          className="space-y-2 text-center md:text-left order-last md:order-first"
        >
          <div>
            {/* STEP 1: Reduce font size on mobile */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Harena Rico <br />
              <span className="text-white/90">Mahefaniaina.</span>
            </h1>
            <p className="mt-2 text-xs sm:text-base text-gray-300 max-w-lg mx-auto md:mx-0">
              {CV.profile}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1 justify-center md:justify-start">
            <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-5">
              Explore Projects
            </Button>
            <Button size="sm" variant="outline" className="rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 px-5">
              Hire Me
            </Button>
          </div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center md:justify-end order-first md:order-last"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-blue-600/20 rounded-full blur-3xl" />
          
          {/* STEP 2: Make the image significantly smaller on mobile */}
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <Image
              src="/profile.png"
              alt="Harena Rico"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, 288px"
            />
          </div>
        </motion.div>
      </div>

      {/* Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        // STEP 3: Stack cards vertically on mobile and reduce spacing
        // We removed `hidden` so they are always visible.
        className="flex flex-col md:grid md:grid-cols-3 gap-3 mt-25 w-full max-w-7xl z-10"
      >
        {CV.experience.slice(0, 3).map((exp, idx) => (
          <CompanyCard key={idx} exp={exp} />
        ))}
      </motion.div>
    </section>
  )
}