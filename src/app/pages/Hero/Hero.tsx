'use client'

import { motion, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CVData } from '@/data/cv'
import { useLocale, useTranslations } from 'next-intl'
import { CompanyCard } from '@/app/pages/Hero/component'
import { useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const cardsVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } },
}

function FloatingBadge({ label, className }: { label: string; className: string }) {
  return (
    <motion.div
      className={`absolute px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-blue-500/30 text-xs text-blue-300 font-medium shadow-lg ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3 + Math.random() * 1.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      style={{ willChange: 'transform' }}
    >
      {label}
    </motion.div>
  )
}

export function Hero() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Hero')
  const glowRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const onMouseMove = useCallback((e: MouseEvent) => {
    targetRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  useEffect(() => {
    // Only run cursor glow on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
    function animate() {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.06)
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.06)
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentRef.current.x - 250}px, ${currentRef.current.y - 250}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [onMouseMove])

  const nameParts = cv.name.split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts[1]
  const rest = nameParts.slice(2).join(' ')

  return (
    <section
      className="w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-10 relative"
    >
      {/* Cursor glow — hidden on touch devices */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-0 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-3xl hidden md:block"
        style={{ willChange: 'transform', top: 0, left: 0 }}
      />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 items-center z-10">

        {/* Left Text Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 text-center md:text-left order-last md:order-first"
        >
          {/* Available badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-900/30 border border-blue-500/30 rounded-full tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {t('available')}
            </span>
          </motion.div>

          {/* Name */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="text-white">{firstName} </span>
              <span className="text-blue-400">{lastName}</span>
              {rest && (
                <>
                  <br />
                  <span className="text-white/70">{rest}.</span>
                </>
              )}
            </h1>
            <p className="mt-2 text-base md:text-lg font-medium text-blue-300/70">{cv.title}</p>
          </motion.div>

          {/* Profile — hidden on very small screens to save space */}
          <motion.p
            variants={itemVariants}
            className="text-sm text-gray-400 max-w-lg mx-auto md:mx-0 leading-relaxed hidden sm:block"
          >
            {cv.profile}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Button
              size="sm"
              className="rounded-full bg-blue-600 hover:bg-blue-500 text-white px-5 shadow-lg shadow-blue-600/30 transition-colors duration-200 cursor-pointer text-sm"
              style={{ willChange: 'transform' }}
              onClick={() => window.dispatchEvent(new CustomEvent('navigateToSection', { detail: { id: 'project', index: 2 } }))}
            >
              {t('exploreProjects')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full border border-blue-500/40 bg-blue-900/10 text-white hover:bg-blue-900/30 px-5 transition-colors duration-200 cursor-pointer text-sm"
              style={{ willChange: 'transform' }}
              onClick={() => window.dispatchEvent(new CustomEvent('navigateToSection', { detail: { id: 'contact', index: 4 } }))}
            >
              {t('hireMe')}
            </Button>
          </motion.div>

          {/* Status row */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 justify-center md:justify-start">
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
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="relative flex justify-center md:justify-end order-first md:order-last"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Decorative rings */}
          <div
            className="absolute top-1/2 left-1/2 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] rounded-full border border-blue-500/10"
            style={{ transform: 'translate(-50%,-50%)', animation: 'spin 20s linear infinite', willChange: 'transform' }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-[180px] h-[180px] sm:w-[230px] sm:h-[230px] md:w-[280px] md:h-[280px] rounded-full border border-blue-500/15"
            style={{ transform: 'translate(-50%,-50%)', animation: 'spin 15s linear infinite reverse', willChange: 'transform' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

          {/* Profile photo */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
            className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80"
            style={{ willChange: 'transform' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-900/10 rounded-full blur-2xl scale-110" />
            <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-2 border-blue-500/30 shadow-2xl shadow-blue-600/20">
              <Image
                src="/images/profile.webp"
                alt="Harena Rico"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            {/* Glow ring around photo */}
            <div className="absolute inset-0 rounded-full border border-blue-400/20 scale-[1.08] pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-blue-400/10 scale-[1.16] pointer-events-none" />
          </motion.div>

          {/* Floating tech badges — hidden on very small screens */}
          <FloatingBadge label="Flutter" className="top-0 right-0 sm:top-2 sm:right-2 hidden xs:block" />
          <FloatingBadge label="Next.js" className="bottom-4 right-0 sm:right-2 hidden xs:block" />
          <FloatingBadge label="TypeScript" className="top-1/3 -left-6 sm:-left-2 hidden sm:block" />
          <FloatingBadge label="Vue.js" className="bottom-8 -left-4 sm:left-0 hidden sm:block" />
          <FloatingBadge label="Express.js" className="top-0 left-1/4 sm:left-1/3 hidden sm:block" />
        </motion.div>
      </div>

      {/* Experience Cards — horizontal scroll on mobile, grid on desktop */}
      <motion.div
        variants={cardsVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 md:mt-8 w-full max-w-7xl z-10"
      >
        {/* Mobile: horizontal scrollable row */}
        <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {cv.experience.slice(0, 3).map((exp, idx) => (
            <div key={idx} className="flex-shrink-0 w-64">
              <CompanyCard exp={exp} index={idx} />
            </div>
          ))}
        </div>
        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-3">
          {cv.experience.slice(0, 3).map((exp, idx) => (
            <CompanyCard key={idx} exp={exp} index={idx} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
