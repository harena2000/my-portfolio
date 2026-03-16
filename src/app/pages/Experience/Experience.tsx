'use client'

import { CVData } from '@/data/cv'
import { useLocale, useTranslations } from 'next-intl'
import { motion, type Variants } from 'framer-motion'
import { Briefcase, Calendar, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function Experience() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Experience')

  return (
    <section
      className="w-full flex items-center justify-center text-white py-8 sm:py-12 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-6 sm:mb-10 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{t('subtitle')}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {t('title')}
            </h2>
          </div>
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden sm:block w-20 h-20 md:w-28 md:h-28 relative opacity-60"
            style={{ willChange: 'transform' }}
          >
            <Image src="/images/experience-deco.png" alt="" fill className="object-contain" />
          </motion.div>
        </motion.div>

        <div className="relative">
          {/* Timeline line — only on md+ */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent hidden md:block" />

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-4 sm:space-y-6"
          >
            {cv.experience.map((exp, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                className="relative flex gap-3 sm:gap-6 group"
                style={{ willChange: 'transform' }}
              >
                {/* Timeline icon — only on md+ */}
                <div className="hidden md:flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-900/50 group-hover:border-blue-500/60 transition-colors duration-200">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 sm:p-5 hover:border-blue-500/30 hover:bg-white/[0.08] transition-colors duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                  {/* Mobile: show briefcase icon inline */}
                  <div className="flex items-start gap-3 mb-3 md:hidden">
                    <div className="w-9 h-9 rounded-lg bg-blue-900/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors duration-150 leading-tight">{exp.role}</h3>
                      <span className="text-sm font-medium text-blue-400">{exp.company}</span>
                    </div>
                    <span className={`self-start text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${exp.to === 'Present' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                      {exp.to === 'Present' ? '● Now' : 'Past'}
                    </span>
                  </div>

                  {/* Desktop header */}
                  <div className="hidden md:flex flex-row items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-150">{exp.role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-blue-400">{exp.company}</span>
                        <ChevronRight className="w-3 h-3 text-gray-600" />
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{exp.from} — {exp.to}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`self-start text-xs px-2 py-1 rounded-full font-medium ${exp.to === 'Present' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                      {exp.to === 'Present' ? '● Current' : 'Past'}
                    </span>
                  </div>

                  {/* Date on mobile */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 md:hidden">
                    <Calendar className="w-3 h-3" />
                    <span>{exp.from} — {exp.to}</span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed">{exp.details}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
