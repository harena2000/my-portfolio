/**
 * Seeds Payload CMS with the portfolio content that used to live in src/data/cv.ts
 * (now ./data.ts) plus the MENTO / SingSong screenshot galleries.
 *
 *   npm run seed                  → skips if content already exists
 *   SEED_FORCE=1 npm run seed     → wipes content collections + media first
 *
 * Creates each item in English, then writes the French fields onto the same document.
 * Never creates users: make your admin account at /admin on first visit.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, type Payload } from 'payload'
import config from '../../payload.config'
import { CVData } from './data'
import { galleries, projectExtras, settings } from './extras'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(dirname, '../../../public')
// A fresh object per call: Payload and the storage plugin write flags onto `context`
// (e.g. skipCloudStorage), and a shared object would silently skip later Blob uploads.
const ctx = () => ({ skipRevalidate: true })

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

type Precision = 'month' | 'year'
type Period = { startDate?: string; endDate?: string; current: boolean; precision: Precision }

const iso = (year: number, month = 1) => new Date(Date.UTC(year, month - 1, 1)).toISOString()

/** "January 2026" → { year: 2026, month: 1 }, "2022" → { year: 2022 }, "April" → { month: 4 } */
const parseDate = (text: string) => {
  const t = text.trim().toLowerCase()
  const year = t.match(/\d{4}/)?.[0]
  const month = MONTHS.findIndex((m) => t.includes(m)) + 1
  return { year: year ? Number(year) : undefined, month: month || undefined }
}

/** Parses the free-text English periods of the old data file */
const parsePeriod = (from?: string, to?: string): Period => {
  if (!from) return { current: false, precision: 'month' }
  const current = /present/i.test(to ?? '')
  const a = parseDate(from)
  const b = to && !current ? parseDate(to) : undefined
  const precision: Precision = a.month || b?.month ? 'month' : 'year'
  const startYear = a.year ?? b?.year
  return {
    startDate: startYear ? iso(startYear, a.month ?? 1) : undefined,
    endDate: b?.year ? iso(b.year, b.month ?? 1) : undefined,
    current,
    precision,
  }
}

/** "April - July 2024" / "2023 - Present" → from/to parts */
const splitRange = (period?: string) => {
  if (!period) return [undefined, undefined] as const
  const [from, to] = period.split(/\s+[-–—]\s+/)
  return [from, to] as const
}

const statusMap: Record<string, 'completed' | 'in-progress' | 'on-standby'> = {
  Completed: 'completed',
  'In Progress': 'in-progress',
  'On Standby': 'on-standby',
}

const rows = (list?: string[]) => (list ?? []).map((value) => ({ value }))

async function upload(payload: Payload, publicPath: string, alt: string) {
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(PUBLIC, publicPath),
    context: ctx(),
  })
  return doc.id
}

async function wipe(payload: Payload) {
  for (const collection of ['skills', 'experiences', 'education', 'projects', 'media'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, context: ctx() })
  }
}

async function seed() {
  const payload = await getPayload({ config })
  const en = CVData.en
  const fr = CVData.fr

  const existing = await payload.count({ collection: 'skills' })
  if (existing.totalDocs > 0) {
    if (!process.env.SEED_FORCE) {
      payload.logger.info('Content already exists; skipping. Run with SEED_FORCE=1 to wipe and reseed.')
      return
    }
    payload.logger.info('SEED_FORCE set: wiping existing content…')
    await wipe(payload)
  }

  // ── Profile ────────────────────────────────────────────────
  payload.logger.info('Profile & settings…')
  const photo = await upload(payload, '/images/profile.webp', en.name)
  await payload.updateGlobal({
    slug: 'profile',
    locale: 'en',
    context: ctx(),
    data: {
      name: en.name,
      title: en.title,
      bio: en.profile,
      photo,
      languages: rows(en.languages),
      contact: {
        email: en.contact.email,
        phone: en.contact.phone,
        address: en.contact.address,
        city: settings.city.en,
        lat: settings.location.lat,
        lng: settings.location.lng,
        github: en.contact.github,
        linkedin: en.contact.linkedin,
      },
    },
  })
  await payload.updateGlobal({
    slug: 'profile',
    locale: 'fr',
    context: ctx(),
    data: { title: fr.title, bio: fr.profile, languages: rows(fr.languages), contact: { email: en.contact.email, city: settings.city.fr } },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    context: ctx(),
    data: {
      openToWork: settings.openToWork,
      yearsOfExperience: settings.yearsOfExperience,
      heroBadges: rows(settings.heroBadges),
      emailjs: settings.emailjs,
    },
  })

  // ── Skills ─────────────────────────────────────────────────
  payload.logger.info(`Skills (${en.skills.length})…`)
  for (const [i, s] of en.skills.entries()) {
    const logo = await upload(payload, s.logo, `${s.name} logo`)
    await payload.create({
      collection: 'skills',
      context: ctx(),
      data: { name: s.name, level: s.level, logo, order: (i + 1) * 10 },
    })
  }

  // ── Experience ─────────────────────────────────────────────
  payload.logger.info(`Experience (${en.experience.length})…`)
  for (const [i, e] of en.experience.entries()) {
    const f = fr.experience[i]
    const doc = await payload.create({
      collection: 'experiences',
      locale: 'en',
      context: ctx(),
      data: {
        company: e.company,
        role: e.role,
        ...parsePeriod(e.from, e.to),
        details: e.details,
        highlights: (e.highlights ?? []).map((text) => ({ text })),
        tech: rows(e.tech),
        order: (i + 1) * 10,
      },
    })
    await payload.update({
      collection: 'experiences',
      id: doc.id,
      locale: 'fr',
      context: ctx(),
      data: { role: f.role, details: f.details, highlights: (f.highlights ?? []).map((text) => ({ text })) },
    })
  }

  // ── Education ──────────────────────────────────────────────
  payload.logger.info(`Education (${en.education.length})…`)
  for (const [i, ed] of en.education.entries()) {
    const f = fr.education[i]
    const [start, end] = ed.period.split(/\s*[-–—]\s*/).map(Number)
    const doc = await payload.create({
      collection: 'education',
      locale: 'en',
      context: ctx(),
      data: { degree: ed.degree, track: ed.track, school: ed.school, startYear: start, endYear: end || undefined, order: (i + 1) * 10 },
    })
    await payload.update({
      collection: 'education',
      id: doc.id,
      locale: 'fr',
      context: ctx(),
      data: { degree: f.degree, track: f.track, school: f.school },
    })
  }

  // ── Projects (+ galleries) ─────────────────────────────────
  payload.logger.info(`Projects (${en.projects.length})…`)
  for (const [i, p] of en.projects.entries()) {
    const f = fr.projects[i]
    const [org, kind] = (p.subtitle ?? '').split('|').map((s) => s.trim())
    const kindFr = (f.subtitle ?? '').split('|')[1]?.trim()
    const extra = projectExtras[p.title] ?? {}
    const gallery = extra.slug ? galleries[extra.slug] : undefined
    const external = p.link && !p.link.startsWith('/') ? p.link : undefined

    // Upload screenshots once; images are shared by both locales
    const groups: { title: string; titleFr: string; screens: { image: number; label: string }[] }[] = []
    for (const g of gallery ?? []) {
      const screens: { image: number; label: string }[] = []
      for (const s of g.screens) {
        screens.push({ image: await upload(payload, s.src, `${p.title} — ${s.label}`), label: s.label })
      }
      groups.push({ title: g.title, titleFr: g.titleFr, screens })
    }

    const doc = await payload.create({
      collection: 'projects',
      locale: 'en',
      context: ctx(),
      data: {
        title: p.title,
        slug: extra.slug ?? p.title,
        organization: org || undefined,
        kind: kind || undefined,
        status: statusMap[p.status ?? 'Completed'] ?? 'completed',
        ...parsePeriod(...splitRange(p.period)),
        summary: p.summary,
        description: p.desc,
        tech: rows(p.tech),
        externalUrl: external,
        hasDetailPage: Boolean(gallery),
        accent: extra.accent,
        icon: extra.icon,
        tagline: extra.tagline?.en,
        screenGroups: groups.map((g) => ({ title: g.title, screens: g.screens.map(({ image, label }) => ({ image, label })) })),
        order: (i + 1) * 10,
      },
    })

    // French: localized fields, including the rows of the gallery (matched by row id)
    await payload.update({
      collection: 'projects',
      id: doc.id,
      locale: 'fr',
      context: ctx(),
      data: {
        title: f.title,
        kind: kindFr || undefined,
        summary: f.summary,
        description: f.desc,
        tagline: extra.tagline?.fr,
        screenGroups: (doc.screenGroups ?? []).map((row, gi) => ({
          id: row.id,
          title: groups[gi].titleFr,
          screens: (row.screens ?? []).map((s) => ({
            id: s.id,
            image: typeof s.image === 'object' ? s.image.id : s.image,
            label: s.label,
          })),
        })),
      },
    })
  }

  const counts = await Promise.all(
    (['skills', 'experiences', 'education', 'projects', 'media'] as const).map(async (c) => `${c}: ${(await payload.count({ collection: c })).totalDocs}`)
  )
  payload.logger.info(`Seed complete → ${counts.join(', ')}`)
}

await seed()
process.exit(0)
