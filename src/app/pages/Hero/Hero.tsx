'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CVData } from '@/data/cv'
import { useLocale, useTranslations } from 'next-intl'
import { CompanyCard } from '@/app/pages/Hero/component'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Dynamically import Rive to avoid SSR issues
const RiveAnimation = dynamic(() => import('@/components/RiveAnimation'), { ssr: false })

export function Hero() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Hero')
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50])
  const [riveLoaded, setRiveLoaded] = useState(false)

  // Cursor-following glow
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springX = useSpring(cursorX, { stiffness: 80, damping: 20 })
  const springY = useSpring(cursorY, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    setRiveLoaded(true)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [cursorX, cursorY])

  const nameParts = cv.name.split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts[1]
  const rest = nameParts.slice(2).join(' ')

  return (
    <section
      id="home"
      ref={ref}
      className="w-full h-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-16 scrollbar-furtif pt-16 md:pt-8 lg:pt-0 relative overflow-hidden"
    >
      {/* Cursor glow effect */}
      <motion.div
        className="fixed pointer-events-none z-0 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-3xl"
        style={{
          left: springX,
          top: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      <motion.div
        style={{ opacity, y }}
        className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-6 items-center z-10"
      >
        {/* Left Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-5 text-center md:text-left order-last md:order-first"
        >
          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-900/30 border border-blue-500/30 rounded-full tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {t('available')}
            </span>
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="text-white">{firstName} </span>
              <span className="text-blue-400">{lastName}</span>
              {rest && (
                <>
                  <br />
                  <span className="text-white/70">{rest}.</span>
                </>
              )}
            </h1>
            <p className="mt-2 text-lg font-medium text-blue-300/70">{cv.title}</p>
          </motion.div>

          {/* Profile */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-sm text-gray-400 max-w-lg mx-auto md:mx-0 leading-relaxed"
          >
            {cv.profile}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-3 justify-center md:justify-start"
          >
            <Button
              size="sm"
              className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6 shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-blue-500/50 hover:scale-105 cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('navigateToSection', { detail: { id: 'project', index: 2 } }))}
            >
              {t('exploreProjects')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full border border-blue-500/40 bg-blue-900/10 text-white hover:bg-blue-900/30 px-6 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('navigateToSection', { detail: { id: 'contact', index: 4 } }))}
            >
              {t('hireMe')}
            </Button>
          </motion.div>

          {/* Status row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex items-center gap-4 justify-center md:justify-start"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400">{t('openToWork')}</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-xs text-gray-400">3.5+ {t('yearsExp')}</span>
          </motion.div>
        </motion.div>

        {/* Right Animation Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center md:justify-end order-first md:order-last"
        >
          {/* Decorative rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-blue-500/10 animate-[spin_20s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-blue-500/15 animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />

          {/* Rive animation container */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96"
          >
            {/* Background glow for Rive */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent rounded-full blur-2xl" />
            {riveLoaded && (
              <RiveAnimation src="/vehicles.riv" className="relative z-10" />
            )}
          </motion.div>

          {/* Floating tech badges */}
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-4 right-4 sm:right-8 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-blue-500/30 text-xs text-blue-300 font-medium shadow-lg"
          >
            Flutter
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0], rotate: [2, -2, 2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-8 right-2 sm:right-6 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-blue-500/30 text-xs text-blue-300 font-medium shadow-lg"
          >
            Next.js
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [1, -1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute top-1/2 -left-2 sm:left-0 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-blue-500/30 text-xs text-blue-300 font-medium shadow-lg"
          >
            TypeScript
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8 }}
        className="flex flex-col md:grid md:grid-cols-3 gap-3 mt-8 w-full max-w-7xl z-10"
      >
        {cv.experience.slice(0, 3).map((exp, idx) => (
          <CompanyCard key={idx} exp={exp} index={idx} />
        ))}
      </motion.div>
    </section>
  )
}
