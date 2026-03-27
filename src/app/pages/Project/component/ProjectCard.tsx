'use client'

import { useState, memo } from 'react'
import { motion, type Variants } from 'framer-motion'
import { ProjectStatus } from '@/data/cv'
import { ChevronDown, ChevronUp, ExternalLink, Eye } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

export type Project = {
  title: string
  subtitle?: string
  desc?: string
  tech?: string[]
  status?: ProjectStatus | string
  link?: string
  index?: number
}

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  [ProjectStatus.COMPLETED]: {
    label: 'Completed',
    bg: 'bg-emerald-900/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  [ProjectStatus.IN_PROGRESS]: {
    label: 'In Progress',
    bg: 'bg-amber-900/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
  },
  [ProjectStatus.ON_STANDBY]: {
    label: 'On Standby',
    bg: 'bg-gray-800/50',
    text: 'text-gray-400',
    dot: 'bg-gray-400',
  },
}

// Variant consumed by parent stagger
export const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const ProjectCardInner = ({ project }: { project: Project; index?: number }) => {
  const locale = useLocale()
  const [expanded, setExpanded] = useState(false)
  const fullDesc = project.desc ?? ''
  const badge = project.status ? statusConfig[project.status] : null

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 hover:border-blue-500/30 hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all duration-200 flex flex-col group self-start"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors duration-150 truncate">{project.title}</h3>
          {project.subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{project.subtitle}</p>
          )}
        </div>
        {badge && (
          <span className={`flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text} border border-current/20 flex-shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
        )}
      </div>

      {/* Description */}
      {fullDesc && (
        <div className="mb-4 flex-1">
          <p className={`text-sm text-gray-400 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
            {fullDesc}
          </p>
          {fullDesc.length > 160 && (
            <button
              onClick={() => setExpanded((s) => !s)}
              className="mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150 flex items-center gap-1"
            >
              {expanded ? (
                <><ChevronUp className="w-3 h-3" /> Show less</>
              ) : (
                <><ChevronDown className="w-3 h-3" /> Show more</>
              )}
            </button>
          )}
        </div>
      )}

      {/* Link */}
      {project.link && (
        project.link.startsWith('/') ? (
          <Link
            href={`/${locale}${project.link}`}
            className="inline-flex items-center gap-1.5 mb-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150 group/link"
          >
            <Eye className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:scale-110" />
            Preview Screens
          </Link>
        ) : (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mb-3 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150 group/link"
          >
            <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            View Project
          </a>
        )
      )}

      {/* Tech stack */}
      {project.tech && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-white/5">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-md bg-blue-900/20 text-blue-300 border border-blue-500/20 hover:bg-blue-900/40 transition-colors duration-150"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export const ProjectCard = memo(ProjectCardInner)
export default ProjectCard
