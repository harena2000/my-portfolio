'use client'

import { CVData } from '@/data/cv'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { memo, useMemo } from 'react'
import { Code2, Rocket, Smartphone } from 'lucide-react'
import Image from 'next/image'
import ScrollTimeline, { type ScrollTimelineItem } from '@/components/ui/scroll-timeline'

const isCurrent = (to: string) => /^(present|présent)$/i.test(to)

const roleIcon = (role: string) => {
  if (/lead/i.test(role)) return Rocket
  if (/mobile/i.test(role)) return Smartphone
  return Code2
}

function ExperienceInner() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Experience')

  // Newest first, so the line draws downward from the latest role
  const items = useMemo<ScrollTimelineItem[]>(
    () =>
      cv.experience.map((exp, idx) => ({
        id: idx,
        marker: exp.from.match(/\d{4}/)?.[0] ?? exp.from,
        date: `${exp.from} — ${exp.to}`,
        title: exp.role,
        subtitle: exp.company,
        content: exp.details,
        tags: exp.tech,
        icon: roleIcon(exp.role),
        current: isCurrent(exp.to),
      })),
    [cv.experience]
  )

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
          className="mb-8 sm:mb-12 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{t('subtitle')}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {t('title')}
            </h2>
          </div>
          <div className="hidden sm:block w-20 h-20 md:w-28 md:h-28 relative opacity-60 section-deco-float">
            <Image src="/images/experience-deco.png" alt="" fill className="object-contain" />
          </div>
        </motion.div>

        <ScrollTimeline
          items={items}
          labels={{ current: t('current'), past: t('past'), stack: t('stack') }}
        />
      </div>
    </section>
  )
}

export const Experience = memo(ExperienceInner)
