/**
 * Shape of the portfolio content as the site consumes it, already localized.
 * Built from Payload CMS data by src/lib/content.ts; safe to import in client components.
 */

export type ProjectStatus = 'completed' | 'in-progress' | 'on-standby'
export type Precision = 'month' | 'year'

export interface MediaRef {
  url: string
  alt: string
  width?: number
  height?: number
  /** 480×480 crop, used for the resume PDF */
  thumbUrl?: string
}

export interface Skill {
  name: string
  level: number
  logo?: string
}

export interface Experience {
  id: string
  company: string
  role: string
  /** Formatted start, e.g. "January 2026" or "2022" */
  from: string
  /** Formatted end, or the localized "Present" when current */
  to: string
  current: boolean
  details: string
  highlights: string[]
  tech: string[]
}

export interface Education {
  period: string
  degree: string
  track?: string
  school: string
}

export interface ScreenGroup {
  title: string
  screens: { src: string; label: string; width?: number; height?: number }[]
}

export interface Project {
  id: string
  slug: string
  title: string
  /** "Organization | Kind", kept for components that split it */
  subtitle?: string
  organization?: string
  kind?: string
  desc?: string
  summary?: string
  tech: string[]
  status: ProjectStatus
  period?: string
  /** Internal "/projects/<slug>" when there is a detail page, else the external URL */
  link?: string
  hasDetailPage: boolean
}

export interface ProjectDetail extends Project {
  tagline?: string
  accent: 'blue' | 'purple' | 'emerald'
  icon: string
  screenGroups: ScreenGroup[]
}

export interface Contact {
  email: string
  phone: string
  address: string
  city: string
  lat?: number
  lng?: number
  github?: string
  linkedin?: string
}

export interface SiteSettings {
  openToWork: boolean
  yearsOfExperience: number
  heroBadges: string[]
  emailjs: { serviceId?: string; templateId?: string; publicKey?: string }
}

export interface SiteContent {
  locale: string
  name: string
  title: string
  profile: string
  photo?: MediaRef
  contact: Contact
  skills: Skill[]
  languages: string[]
  education: Education[]
  experience: Experience[]
  projects: Project[]
  settings: SiteSettings
}

const PRESENT: Record<string, string> = { en: 'Present', fr: 'Présent' }

export const presentLabel = (locale: string) => PRESENT[locale] ?? PRESENT.en

/** Format one date of a period in the given locale ("January 2026", "Janvier 2026", "2022") */
export function formatDate(value: string | null | undefined, precision: Precision, locale: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  if (precision === 'year') return String(date.getUTCFullYear())
  const text = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** "January 2026 – June 2026", "2022 – 2024", "April – July 2024", "2023 – Present" */
export function formatPeriod(
  start: string | null | undefined,
  end: string | null | undefined,
  current: boolean,
  precision: Precision,
  locale: string
): string {
  const from = formatDate(start, precision, locale)
  if (current) return from ? `${from} – ${presentLabel(locale)}` : presentLabel(locale)
  const to = formatDate(end, precision, locale)
  if (!from) return to
  if (!to || to === from) return from
  // Same year, month precision: "April – July 2024"
  if (precision === 'month' && start && end) {
    const a = new Date(start)
    const b = new Date(end)
    if (a.getUTCFullYear() === b.getUTCFullYear()) {
      const month = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(a)
      return `${month.charAt(0).toUpperCase() + month.slice(1)} – ${to}`
    }
  }
  return `${from} – ${to}`
}
