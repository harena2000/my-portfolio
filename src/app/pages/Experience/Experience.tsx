'use client'

import { AnimatedSection } from '@/components/AnimatedSection'
import { CVData } from '@/data/cv'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Briefcase, Calendar, ChevronRight } from 'lucide-react'

export function Experience() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Experience')

  return (
    <AnimatedSection
      id="experience"
      className="w-full h-full flex items-center justify-center text-white py-12"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{t('subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {t('title')}
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent hidden md:block" />

          <div className="space-y-6">
            {cv.experience.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ x: 4 }}
                className="relative flex gap-6 group"
              >
                {/* Timeline dot */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-900/50 group-hover:border-blue-500/60 transition-all duration-300">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 hover:border-blue-500/30 hover:bg-white/8 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">{exp.role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-blue-400">{exp.company}</span>
                        <ChevronRight className="w-3 h-3 text-gray-600" />
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{exp.from} — {exp.to}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`self-start text-xs px-2 py-1 rounded-full font-medium ${exp.to === 'Present' || exp.to === 'Present' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                      {exp.to === 'Present' ? '● Current' : 'Past'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{exp.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
