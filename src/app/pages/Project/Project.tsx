'use client'

import { CVData } from '@/data/cv'
import { useLocale, useTranslations } from 'next-intl'
import { motion, type Variants } from 'framer-motion'
import { ProjectCard } from './component'
import Image from 'next/image'

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export function Projects() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Projects')

  return (
    <section
      className="w-full flex items-start justify-center text-white px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto w-full">
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
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden sm:block w-20 h-20 md:w-28 md:h-28 relative opacity-60"
            style={{ willChange: 'transform' }}
          >
            <Image src="/images/projects-deco.png" alt="" fill className="object-contain" />
          </motion.div>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="columns-1 sm:columns-2 xl:columns-3 gap-4 sm:gap-5 [column-fill:balance]"
        >
          {cv.projects.map((p, idx) => (
            <div key={p.title} className="mb-4 sm:mb-5 break-inside-avoid">
              <ProjectCard project={p} index={idx} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
