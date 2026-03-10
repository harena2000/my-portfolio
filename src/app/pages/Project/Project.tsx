'use client'

import { AnimatedSection } from '@/components/AnimatedSection'
import { CVData } from '@/data/cv'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ProjectCard } from './component'

export function Projects() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Projects')

  return (
    <AnimatedSection
      id="project"
      className="w-full min-h-screen flex items-start justify-center text-white p-4 sm:p-8 md:p-12 lg:p-16 scrollbar-furtif pt-20 sm:pt-16 md:pt-12 lg:pt-8"
    >
      <div className="max-w-7xl mx-auto px-4 w-full">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {cv.projects.map((p, idx) => (
            <ProjectCard key={p.title} project={p} index={idx} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default Projects
