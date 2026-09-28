'use client'

import { Document, Font, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { SiteContent } from '@/lib/content-types'

/**
 * ATS-friendly resume: plain single column, standard section names, black text,
 * no photo, icons, colors or tables — so applicant tracking systems parse it reliably.
 * Follows the resume-builder guidelines (skills first for tech roles, reverse
 * chronological experience, en-dash dates aligned right, plain-text URLs).
 */

// Break lines only between words (no mid-word hyphenation)
Font.registerHyphenationCallback((word) => [word])

const LABELS: Record<string, Record<string, string>> = {
  en: {
    summary: 'Summary',
    skills: 'Technical Skills',
    experience: 'Experience',
    projects: 'Projects',
    education: 'Education',
    languages: 'Languages',
    technologies: 'Technologies',
  },
  fr: {
    summary: 'Profil',
    skills: 'Compétences techniques',
    experience: 'Expérience',
    projects: 'Projets',
    education: 'Formation',
    languages: 'Langues',
    technologies: 'Technologies',
  },
}

const INK = '#000000'
const MUTED = '#333333'

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.22,
    color: INK,
    paddingVertical: 30,
    paddingHorizontal: 43, // 0.6 in
  },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 16, textAlign: 'center' },
  headline: { fontSize: 11, textAlign: 'center', marginTop: 2 },
  contact: { fontSize: 9.5, textAlign: 'center', marginTop: 2, color: MUTED },
  link: { color: MUTED, textDecoration: 'none' },

  section: { marginTop: 7 },
  heading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingBottom: 1.5,
    marginBottom: 4,
    borderBottom: `0.75 solid ${INK}`,
  },

  entry: { marginBottom: 3.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  // flex: 1 makes the title take the remaining width and wrap before the date
  entryTitle: { fontFamily: 'Helvetica-Bold', flex: 1, paddingRight: 10 },
  date: { fontSize: 10, flexShrink: 0, textAlign: 'right' },
  sub: { fontFamily: 'Helvetica-Oblique', color: MUTED },

  bullet: { flexDirection: 'row', marginTop: 1 },
  bulletMark: { width: 10 },
  bulletText: { flex: 1 },
  tech: { fontSize: 9.5, color: MUTED, marginTop: 1 },
  inlineTech: { fontFamily: 'Helvetica-Oblique', fontSize: 9.5, color: MUTED },
})

/** "January 2026 — June 2026" → "January 2026 – June 2026" */
const dash = (text?: string) => (text ?? '').replace(/\s*[-—–]\s*/g, ' – ')
const stripUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      {/* Keep a heading with at least the start of its content */}
      <Text style={s.heading} minPresenceAhead={40}>
        {title}
      </Text>
      {children}
    </View>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((text) => (
        <View key={text} style={s.bullet}>
          <Text style={s.bulletMark}>•</Text>
          <Text style={s.bulletText}>{text.replace(/\.\s*$/, '')}</Text>
        </View>
      ))}
    </>
  )
}

export function ATSResumeDocument({ data, locale }: { data: SiteContent; locale: string }) {
  const t = LABELS[locale] ?? LABELS.en
  const { contact } = data

  type Part = { text: string; href?: string }
  const contactLines: Part[][] = [
    [
      contact.email && { text: contact.email, href: `mailto:${contact.email}` },
      contact.phone && { text: contact.phone },
      contact.city && { text: contact.city },
    ].filter(Boolean) as Part[],
    [
      contact.linkedin && { text: stripUrl(contact.linkedin), href: contact.linkedin },
      contact.github && { text: stripUrl(contact.github), href: contact.github },
    ].filter(Boolean) as Part[],
  ].filter((line) => line.length > 0)

  return (
    <Document title={`${data.name} - Resume`} author={data.name} subject={data.title}>
      <Page size="A4" style={s.page}>
        {/* Name & contact */}
        <Text style={s.name}>{data.name}</Text>
        <Text style={s.headline}>{data.title}</Text>
        {contactLines.map((line, li) => (
          <Text key={li} style={s.contact}>
            {line.map((c, i) => (
              <Text key={c.text}>
                {i > 0 ? '  |  ' : ''}
                {c.href ? (
                  <Link src={c.href} style={s.link}>
                    {c.text}
                  </Link>
                ) : (
                  c.text
                )}
              </Text>
            ))}
          </Text>
        ))}

        {data.profile ? (
          <Section title={t.summary}>
            <Text>{data.profile}</Text>
          </Section>
        ) : null}

        {/* Skills first: recruiters scan for technologies */}
        {data.skills.length > 0 && (
          <Section title={t.skills}>
            <Text>{[...data.skills].sort((a, b) => b.level - a.level).map((sk) => sk.name).join(', ')}</Text>
            {data.languages.length > 0 && (
              <Text style={{ marginTop: 2 }}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>{t.languages}: </Text>
                {data.languages.join(', ')}
              </Text>
            )}
          </Section>
        )}

        {data.experience.length > 0 && (
          <Section title={t.experience}>
            {data.experience.map((exp) => (
              <View key={exp.id} style={s.entry} wrap={false}>
                <View style={s.row}>
                  <Text style={s.entryTitle}>
                    {exp.role}, {exp.company}
                  </Text>
                  <Text style={s.date}>{dash(`${exp.from} – ${exp.to}`)}</Text>
                </View>
                <Bullets items={exp.highlights.length ? exp.highlights : exp.details ? [exp.details] : []} />
                {exp.tech.length > 0 && (
                  <Text style={s.tech}>
                    {t.technologies}: {exp.tech.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </Section>
        )}

        {data.projects.length > 0 && (
          <Section title={t.projects}>
            {data.projects.map((p) => (
              <View key={p.id} style={s.entry} wrap={false}>
                <View style={s.row}>
                  <Text style={s.entryTitle}>
                    {p.title}
                    {p.organization ? <Text style={s.sub}>{`, ${p.organization}`}</Text> : null}
                    {p.tech.length > 0 ? <Text style={s.inlineTech}>{`  |  ${p.tech.join(', ')}`}</Text> : null}
                  </Text>
                  {p.period ? <Text style={s.date}>{dash(p.period)}</Text> : null}
                </View>
                <Bullets items={[p.summary ?? p.desc ?? ''].filter(Boolean)} />
              </View>
            ))}
          </Section>
        )}

        {data.education.length > 0 && (
          <Section title={t.education}>
            {data.education.map((ed) => (
              <View key={`${ed.degree}-${ed.period}`} style={s.entry} wrap={false}>
                <View style={s.row}>
                  <Text style={s.entryTitle}>
                    {ed.degree}
                    {ed.track ? `, ${ed.track}` : ''}
                    <Text style={s.sub}>{` — ${ed.school}`}</Text>
                  </Text>
                  <Text style={s.date}>{dash(ed.period)}</Text>
                </View>
              </View>
            ))}
          </Section>
        )}

      </Page>
    </Document>
  )
}
