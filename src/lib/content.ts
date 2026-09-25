/**
 * Server-only: loads portfolio content from Payload CMS and maps it into the
 * site's own shape (src/lib/content-types.ts). Cached under the "cms" tag, which
 * Payload hooks invalidate on every edit (src/payload/hooks/revalidate.ts).
 */
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { Media, Project as ProjectDoc } from '@/payload-types'
import { CMS_TAG } from '@/payload/hooks/revalidate'
import {
  formatDate,
  formatPeriod,
  presentLabel,
  type MediaRef,
  type Precision,
  type Project,
  type ProjectDetail,
  type SiteContent,
} from './content-types'

type Locale = 'en' | 'fr'
const asLocale = (locale: string): Locale => (locale === 'fr' ? 'fr' : 'en')

const values = (rows?: { value?: string | null }[] | null) =>
  (rows ?? []).map((r) => r.value ?? '').filter(Boolean)

const SERVER_URL = (process.env.NEXT_PUBLIC_SERVER_URL || '').replace(/\/$/, '')

/** Payload prefixes local files with serverURL; keep them site-relative so next/image treats them as local */
const mediaUrl = (url?: string | null) =>
  url ? (SERVER_URL && url.startsWith(SERVER_URL) ? url.slice(SERVER_URL.length) : url) : undefined

const media = (value: unknown): MediaRef | undefined => {
  if (!value || typeof value !== 'object') return undefined
  const m = value as Media
  const url = mediaUrl(m.url)
  if (!url) return undefined
  return {
    url,
    alt: m.alt ?? '',
    width: m.width ?? undefined,
    height: m.height ?? undefined,
    thumbUrl: mediaUrl(m.sizes?.thumb?.url),
  }
}

const mapProject = (p: ProjectDoc, locale: Locale): Project => {
  const precision = (p.precision ?? 'month') as Precision
  return {
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    subtitle: [p.organization, p.kind].filter(Boolean).join(' | ') || undefined,
    organization: p.organization ?? undefined,
    kind: p.kind ?? undefined,
    desc: p.description ?? undefined,
    summary: p.summary ?? undefined,
    tech: values(p.tech),
    status: p.status,
    period: formatPeriod(p.startDate, p.endDate, Boolean(p.current), precision, locale) || undefined,
    link: p.hasDetailPage ? `/projects/${p.slug}` : p.externalUrl || undefined,
    hasDetailPage: Boolean(p.hasDetailPage),
  }
}

async function loadContent(locale: Locale): Promise<SiteContent> {
  const payload = await getPayload({ config })
  const common = { locale, fallbackLocale: 'en' as const, depth: 1, limit: 100, sort: 'order', pagination: false }

  const [profile, settings, skills, experiences, education, projects] = await Promise.all([
    payload.findGlobal({ slug: 'profile', locale, fallbackLocale: 'en', depth: 1 }),
    payload.findGlobal({ slug: 'site-settings', locale, fallbackLocale: 'en', depth: 0 }),
    payload.find({ collection: 'skills', ...common }),
    payload.find({ collection: 'experiences', ...common }),
    payload.find({ collection: 'education', ...common }),
    payload.find({ collection: 'projects', ...common }),
  ])

  const contact = profile.contact ?? { email: '' }

  return {
    locale,
    name: profile.name ?? '',
    title: profile.title ?? '',
    profile: profile.bio ?? '',
    photo: media(profile.photo),
    contact: {
      email: contact.email ?? '',
      phone: contact.phone ?? '',
      address: contact.address ?? '',
      city: contact.city ?? '',
      lat: contact.lat ?? undefined,
      lng: contact.lng ?? undefined,
      github: contact.github ?? undefined,
      linkedin: contact.linkedin ?? undefined,
    },
    languages: values(profile.languages),
    skills: skills.docs.map((s) => ({ name: s.name, level: s.level, logo: media(s.logo)?.url })),
    experience: experiences.docs.map((e) => {
      const precision = (e.precision ?? 'month') as Precision
      const current = Boolean(e.current)
      return {
        id: String(e.id),
        company: e.company,
        role: e.role,
        from: formatDate(e.startDate, precision, locale),
        to: current ? presentLabel(locale) : formatDate(e.endDate, precision, locale),
        current,
        details: e.details ?? '',
        highlights: (e.highlights ?? []).map((h) => h.text).filter(Boolean),
        tech: values(e.tech),
      }
    }),
    education: education.docs.map((ed) => ({
      period: ed.endYear && ed.endYear !== ed.startYear ? `${ed.startYear} – ${ed.endYear}` : String(ed.startYear),
      degree: ed.degree,
      track: ed.track ?? undefined,
      school: ed.school,
    })),
    projects: projects.docs.map((p) => mapProject(p, locale)),
    settings: {
      openToWork: settings.openToWork ?? true,
      yearsOfExperience: settings.yearsOfExperience ?? 0,
      heroBadges: values(settings.heroBadges),
      emailjs: {
        serviceId: settings.emailjs?.serviceId ?? undefined,
        templateId: settings.emailjs?.templateId ?? undefined,
        publicKey: settings.emailjs?.publicKey ?? undefined,
      },
    },
  }
}

async function loadProject(slug: string, locale: Locale): Promise<ProjectDetail | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug }, hasDetailPage: { equals: true } },
    locale,
    fallbackLocale: 'en',
    depth: 1,
    limit: 1,
  })
  const p = docs[0]
  if (!p) return null
  return {
    ...mapProject(p, locale),
    tagline: p.tagline ?? undefined,
    accent: p.accent ?? 'blue',
    icon: p.icon ?? 'smartphone',
    screenGroups: (p.screenGroups ?? []).map((g) => ({
      title: g.title,
      screens: (g.screens ?? []).flatMap((s) => {
        const img = media(s.image)
        return img ? [{ src: img.url, label: s.label ?? '', width: img.width, height: img.height }] : []
      }),
    })),
  }
}

async function loadProjectSlugs(): Promise<string[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { hasDetailPage: { equals: true } },
    depth: 0,
    limit: 100,
    pagination: false,
    select: { slug: true },
  })
  return docs.map((d) => d.slug)
}

export const getContent = (locale: string) =>
  unstable_cache(() => loadContent(asLocale(locale)), ['content', asLocale(locale)], { tags: [CMS_TAG] })()

export const getProject = (slug: string, locale: string) =>
  unstable_cache(() => loadProject(slug, asLocale(locale)), ['project', slug, asLocale(locale)], { tags: [CMS_TAG] })()

export const getProjectSlugs = () => unstable_cache(loadProjectSlugs, ['project-slugs'], { tags: [CMS_TAG] })()
