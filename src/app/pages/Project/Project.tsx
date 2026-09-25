'use client'

import { CVData, ProjectStatus, type Project } from '@/data/cv'
import { useLocale, useTranslations } from 'next-intl'
import { motion, type Variants } from 'framer-motion'
import { memo, useMemo } from 'react'
import { Globe, Layers, Map as MapIcon, MousePointerClick, Smartphone } from 'lucide-react'
import { ProjectCard } from './component'
import Image from 'next/image'
import RadialOrbitalTimeline, { type TimelineItem } from '@/components/ui/radial-orbital-timeline'

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const toStatus = (status?: Project['status']): TimelineItem['status'] =>
  status === ProjectStatus.IN_PROGRESS
    ? 'in-progress'
    : status === ProjectStatus.ON_STANDBY
      ? 'pending'
      : 'completed'

/** "Futurmap | Web GIS Application" → ["Futurmap", "Web GIS Application"] */
const splitSubtitle = (subtitle = '') => {
  const [org, kind = ''] = subtitle.split('|').map((s) => s.trim())
  return { org, kind }
}

const projectIcon = (kind: string) => {
  const hasWeb = /web/i.test(kind)
  const hasMobile = /mobile/i.test(kind)
  if (/gis|sig/i.test(kind)) return MapIcon
  if (hasWeb && hasMobile) return Layers
  if (hasMobile) return Smartphone
  return Globe
}

/**
 * Link projects built for the same client/company; a project with no
 * siblings is linked to the ones it shares the most tech with.
 */
const findRelated = (projects: Project[], idx: number): number[] => {
  const { org } = splitSubtitle(projects[idx].subtitle)
  const sameOrg = projects
    .map((p, i) => ({ i, org: splitSubtitle(p.subtitle).org }))
    .filter((p) => p.i !== idx && p.org.toLowerCase() === org.toLowerCase())
    .map((p) => p.i)
  if (sameOrg.length) return sameOrg.map((i) => i + 1)

  const tech = new Set(projects[idx].tech ?? [])
  return projects
    .map((p, i) => ({ i, shared: (p.tech ?? []).filter((t) => tech.has(t)).length }))
    .filter((p) => p.i !== idx && p.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 2)
    .map((p) => p.i + 1)
}

function ProjectsInner() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Projects')

  const timelineData = useMemo<TimelineItem[]>(
    () =>
      cv.projects.map((p, idx) => {
        const { org, kind } = splitSubtitle(p.subtitle)
        const internal = p.link?.startsWith('/')
        return {
          id: idx + 1,
          title: p.title,
          subtitle: kind ? `${org} · ${kind}` : org,
          date: p.period ?? '',
          content: p.desc ?? '',
          category: kind,
          icon: projectIcon(kind),
          relatedIds: findRelated(cv.projects, idx),
          status: toStatus(p.status),
          tags: p.tech,
          link: p.link
            ? {
                href: internal ? `/${locale}${p.link}` : p.link,
                label: internal ? t('previewScreens') : t('viewProject'),
                external: !internal,
              }
            : undefined,
        }
      }),
    [cv.projects, locale, t]
  )

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
          className="mb-6 sm:mb-10 md:mb-0 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{t('subtitle')}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {t('title')}
            </h2>
            <p className="hidden md:flex items-center gap-2 mt-3 text-xs text-gray-500">
              <MousePointerClick className="w-3.5 h-3.5" />
              {t('hint')}
            </p>
          </div>
          <div className="hidden sm:block w-20 h-20 md:w-28 md:h-28 relative opacity-60 section-deco-float">
            <Image src="/images/projects-deco.png" alt="" fill className="object-contain" />
          </div>
        </motion.div>

        {/* Desktop: interactive orbit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hidden md:block"
        >
          <RadialOrbitalTimeline
            timelineData={timelineData}
            center={
              <Image src="/logo.png" alt={cv.name} fill sizes="72px" className="object-contain p-4" />
            }
            labels={{
              completed: t('completed'),
              inProgress: t('inProgress'),
              pending: t('onStandby'),
              tags: t('stack'),
              related: t('related'),
            }}
          />
        </motion.div>

        {/* Mobile: card grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="md:hidden columns-1 sm:columns-2 gap-4 sm:gap-5 [column-fill:balance]"
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

export const Projects = memo(ProjectsInner)
export default Projects
