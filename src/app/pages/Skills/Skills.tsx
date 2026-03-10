'use client'

import { AnimatedSection } from '@/components/AnimatedSection'
import { CVData } from '@/data/cv'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Skill {
  name: string
  level: number
  logo: string
}

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-7 h-7 relative flex-shrink-0">
          <Image src={skill.logo} alt={skill.name} fill className="object-contain" />
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-gray-200">{skill.name}</span>
          <span className="text-xs text-blue-400 font-mono">{skill.level}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.08 + 0.3, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-300"
        />
      </div>
    </motion.div>
  )
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4, scale: 1.03 }}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-900/10 transition-all duration-300 cursor-default group"
    >
      <div className="w-10 h-10 relative">
        <Image src={skill.logo} alt={skill.name} fill className="object-contain" />
      </div>
      <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{skill.name}</span>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
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
    <AnimatedSection
      id="skills"
      className="w-full h-full flex items-center justify-center text-white py-12"
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Skill bars */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{t('subtitle')}</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {t('title')}
              </h2>
            </motion.div>
            <div className="space-y-5">
              {cv.skills.map((skill, i) => (
                <SkillBar key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </div>

          {/* Right: Skill cards grid */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {cv.skills.map((skill, i) => (
                <SkillCard key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
