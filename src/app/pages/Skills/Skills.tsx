'use client'

import { CVData } from '@/data/cv'
import { useLocale, useTranslations } from 'next-intl'
import { motion, type Variants } from 'framer-motion'
import Image from 'next/image'

interface Skill {
  name: string
  level: number
  logo: string
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div variants={rowVariants} className="group">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-6 h-6 sm:w-7 sm:h-7 relative flex-shrink-0">
          <Image src={skill.logo} alt={skill.name} fill className="object-contain" />
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-gray-200">{skill.name}</span>
          <span className="text-xs text-blue-400 font-mono">{skill.level}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.06, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
          style={{ transformOrigin: 'left', width: `${skill.level}%`, willChange: 'transform' }}
        />
      </div>
    </motion.div>
  )
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-900/10 transition-colors duration-200 cursor-default group"
      style={{ willChange: 'transform' }}
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
        <Image src={skill.logo} alt={skill.name} fill className="object-contain" />
      </div>
      <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors duration-150 text-center">{skill.name}</span>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
          style={{ transformOrigin: 'left', width: `${skill.level}%`, willChange: 'transform' }}
        />
      </div>
    </motion.div>
  )
}

export function Skills() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Skills')

  return (
    <section
      className="w-full flex items-center justify-center text-white py-8 sm:py-12 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-6 sm:mb-8 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{t('subtitle')}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {t('title')}
            </h2>
          </div>
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden sm:block w-20 h-20 md:w-28 md:h-28 relative opacity-60"
            style={{ willChange: 'transform' }}
          >
            <Image src="/images/skills-deco.png" alt="" fill className="object-contain" />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Skill bars */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-4 sm:space-y-5"
          >
            {cv.skills.map((skill, i) => (
              <SkillBar key={skill.name} skill={skill} index={i} />
            ))}
          </motion.div>

          {/* Right: Skill cards grid */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3"
          >
            {cv.skills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
