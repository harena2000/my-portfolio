'use client'

import {
  Circle,
  Defs,
  Document,
  Image,
  Line,
  LinearGradient,
  Link,
  Page,
  Path,
  RadialGradient,
  Rect,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View,
  Font,
} from '@react-pdf/renderer'
import type { SiteContent } from '@/lib/content-types'

// Break lines only between words — avoids ugly mid-word hyphenation (e.g. "Mahefani-aina").
Font.registerHyphenationCallback((word) => [word])

/* ------------------------------------------------------------------ */
/*  Theme tokens (match the portfolio's midnight-blue look)           */
/* ------------------------------------------------------------------ */
const C = {
  navy: '#0a1428',
  navy2: '#0f1d3a',
  blue: '#3b82f6',
  blueDark: '#2563eb',
  blueSoft: '#eaf1fe',
  cyan: '#22d3ee',
  cyanLight: '#67e8f9',
  ink: '#0f172a',
  body: '#475569',
  muted: '#64748b',
  line: '#dbe5f4',
  paper: '#f4f7fc',
  onDark: '#c3cee3',
  white: '#ffffff',
}

const PAGE_W = 595.28
const HEADER_H = 144
const SIDEBAR_W = 190
const SIDEBAR_PAD = 16
const BAR_W = SIDEBAR_W - SIDEBAR_PAD * 2

/* Localized section labels */
const LABELS: Record<string, Record<string, string>> = {
  en: {
    experience: 'Experience',
    projects: 'Selected Projects',
    skills: 'Skills',
    languages: 'Languages',
    education: 'Education',
    location: 'Location',
  },
  fr: {
    experience: 'Expérience',
    projects: 'Projets choisis',
    skills: 'Compétences',
    languages: 'Langues',
    education: 'Formation',
    location: 'Localisation',
  },
}

/* ------------------------------------------------------------------ */
/*  Icons (lucide geometry, drawn as PDF vectors)                     */
/* ------------------------------------------------------------------ */
type IconNode = [tag: 'path' | 'rect' | 'circle', attrs: Record<string, string>]

const ICONS: Record<string, IconNode[]> = {
  mail: [
    ['path', { d: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7' }],
    ['rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }],
  ],
  phone: [
    ['path', { d: 'M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384' }],
  ],
  pin: [
    ['path', { d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0' }],
    ['circle', { cx: '12', cy: '10', r: '3' }],
  ],
  github: [
    ['path', { d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' }],
    ['path', { d: 'M9 18c-4.51 2-5-2-7-2' }],
  ],
  linkedin: [
    ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' }],
    ['rect', { width: '4', height: '12', x: '2', y: '9' }],
    ['circle', { cx: '4', cy: '4', r: '2' }],
  ],
  briefcase: [
    ['path', { d: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' }],
    ['rect', { width: '20', height: '14', x: '2', y: '6', rx: '2' }],
  ],
  rocket: [
    ['path', { d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z' }],
    ['path', { d: 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z' }],
    ['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0' }],
    ['path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' }],
  ],
  sparkles: [
    ['path', { d: 'M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z' }],
    ['path', { d: 'M20 2v4' }],
    ['path', { d: 'M22 4h-4' }],
    ['circle', { cx: '4', cy: '20', r: '2' }],
  ],
  languages: [
    ['path', { d: 'm5 8 6 6' }],
    ['path', { d: 'm4 14 6-6 2-3' }],
    ['path', { d: 'M2 5h12' }],
    ['path', { d: 'M7 2h1' }],
    ['path', { d: 'm22 22-5-10-5 10' }],
    ['path', { d: 'M14 18h6' }],
  ],
  cap: [
    ['path', { d: 'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z' }],
    ['path', { d: 'M22 10v6' }],
    ['path', { d: 'M6 12.5V16a6 3 0 0 0 12 0v-3.5' }],
  ],
}

function Icon({ name, size = 9, color = C.blue }: { name: keyof typeof ICONS; size?: number; color?: string }) {
  const stroke = { stroke: color, strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      {ICONS[name].map(([tag, a], i) =>
        tag === 'path' ? (
          <Path key={i} d={a.d} {...stroke} />
        ) : tag === 'rect' ? (
          <Rect key={i} x={a.x} y={a.y} width={a.width} height={a.height} rx={a.rx ?? '0'} {...stroke} />
        ) : (
          <Circle key={i} cx={a.cx} cy={a.cy} r={a.r} {...stroke} />
        )
      )}
    </Svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */
const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 8, color: C.body, backgroundColor: C.white },

  /* ---- Header ---- */
  header: { height: HEADER_H, position: 'relative', color: C.white },
  headerInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, paddingTop: 24 },
  photoWrap: { width: 92, height: 92, marginRight: 20, position: 'relative' },
  photo: { position: 'absolute', top: 5, left: 5, width: 82, height: 82, borderRadius: 41, objectFit: 'cover' },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 23, color: C.white, letterSpacing: -0.3 },
  title: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: C.cyanLight, letterSpacing: 2, marginTop: 5, textTransform: 'uppercase' },
  profile: { fontSize: 8, color: C.onDark, lineHeight: 1.5, marginTop: 8, maxWidth: 400 },

  /* ---- Contact strip ---- */
  strip: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: C.navy2, paddingHorizontal: 30, height: 26,
  },
  stripItem: { flexDirection: 'row', alignItems: 'center', textDecoration: 'none' },
  stripText: { fontSize: 7.6, color: '#dbe4f3', marginLeft: 5, textDecoration: 'none' },

  /* ---- Body ---- */
  body: { flexDirection: 'row', flexGrow: 1 },
  main: { flex: 1, paddingTop: 16, paddingLeft: 26, paddingRight: 18 },
  side: { width: SIDEBAR_W, backgroundColor: C.paper, paddingTop: 16, paddingHorizontal: SIDEBAR_PAD },

  heading: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headingIcon: { width: 16, height: 16, borderRadius: 4, backgroundColor: C.blueSoft, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  headingText: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: C.ink, letterSpacing: 1.4, textTransform: 'uppercase' },
  headingRule: { flex: 1, height: 0.75, backgroundColor: C.line, marginLeft: 8 },

  /* Timeline */
  timeline: { position: 'relative', marginBottom: 6 },
  rail: { position: 'absolute', left: 3.9, top: 5, bottom: 8, width: 1, backgroundColor: '#c7d6f0' },
  entry: { flexDirection: 'row', marginBottom: 8 },
  gutter: { width: 16, paddingTop: 2 },
  dot: { width: 8.8, height: 8.8, borderRadius: 4.4, border: `1.8 solid ${C.blue}`, backgroundColor: C.white },
  dotFirst: { backgroundColor: C.blue, border: `1.8 solid ${C.cyanLight}` },
  entryBody: { flex: 1 },
  entryHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  role: { fontFamily: 'Helvetica-Bold', fontSize: 9.6, color: C.ink, flexShrink: 1 },
  datePill: { fontSize: 6.8, color: C.blueDark, backgroundColor: C.blueSoft, borderRadius: 6, paddingVertical: 1.6, paddingHorizontal: 6, marginLeft: 6 },
  company: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: C.blue, marginTop: 1.5, marginBottom: 3 },
  bullet: { flexDirection: 'row', marginBottom: 1.6 },
  bulletMark: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.cyan, marginTop: 3.4, marginRight: 5 },
  bulletText: { flex: 1, fontSize: 7.8, lineHeight: 1.38, color: C.body },
  tech: { fontSize: 6.9, color: C.muted, marginTop: 2, letterSpacing: 0.2 },

  /* Projects */
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48.8%', backgroundColor: C.paper, borderRadius: 6, borderLeft: `2 solid ${C.blue}`,
    paddingVertical: 6, paddingHorizontal: 8, marginBottom: 6,
  },
  cardTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.6, color: C.ink },
  cardPeriod: { fontFamily: 'Helvetica-Bold', fontSize: 5.9, color: C.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 1.5 },
  cardSub: { fontSize: 6.8, color: C.blueDark, marginTop: 1, marginBottom: 2.5 },
  cardText: { fontSize: 7.2, lineHeight: 1.35, color: C.body },
  cardTech: { fontSize: 6.4, color: C.muted, marginTop: 3 },

  /* Sidebar blocks */
  sideBlock: { marginBottom: 14 },
  skillRow: { marginBottom: 6.5 },
  skillHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2.4 },
  skillName: { fontFamily: 'Helvetica-Bold', fontSize: 7.8, color: C.ink },
  skillLevel: { fontSize: 6.8, color: C.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    fontSize: 7.4, color: C.blueDark, backgroundColor: C.white, border: `0.75 solid #c7d6f0`,
    borderRadius: 8, paddingVertical: 2.5, paddingHorizontal: 8, marginRight: 4, marginBottom: 4,
  },
  sideText: { fontSize: 7.6, color: C.body, lineHeight: 1.4 },
  sideStrong: { fontFamily: 'Helvetica-Bold', fontSize: 7.8, color: C.ink },
  edu: { marginBottom: 8, paddingLeft: 7, borderLeft: `1.5 solid ${C.blue}` },
  eduPeriod: { fontFamily: 'Helvetica-Bold', fontSize: 6.8, color: C.blue, marginBottom: 1.5 },
  eduDegree: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: C.ink, lineHeight: 1.25 },
  eduSub: { fontSize: 7.1, color: C.muted, marginTop: 1, lineHeight: 1.3 },
})

/* ------------------------------------------------------------------ */
/*  Pieces                                                            */
/* ------------------------------------------------------------------ */
const range = (a: string, b?: string) => (b ? `${a} – ${b}` : a).replace(/\s*[-—]\s*/g, ' – ')
const absoluteUrl = (url: string) =>
  /^https?:\/\//.test(url) || typeof window === 'undefined' ? url : new URL(url, window.location.origin).href
const stripUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function HeaderBackground() {
  const lines = []
  for (let x = 24; x < PAGE_W; x += 24) lines.push(<Line key={`v${x}`} x1={x} y1={0} x2={x} y2={HEADER_H} stroke={C.blue} strokeWidth={0.4} strokeOpacity={0.09} />)
  for (let y = 24; y < HEADER_H; y += 24) lines.push(<Line key={`h${y}`} x1={0} y1={y} x2={PAGE_W} y2={y} stroke={C.blue} strokeWidth={0.4} strokeOpacity={0.09} />)
  return (
    <Svg width={PAGE_W} height={HEADER_H} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Defs>
        <RadialGradient id="glowA" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor={C.blue} stopOpacity={0.45} />
          <Stop offset="1" stopColor={C.blue} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="glowB" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor={C.cyan} stopOpacity={0.22} />
          <Stop offset="1" stopColor={C.cyan} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={C.blue} />
          <Stop offset="1" stopColor={C.cyan} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={PAGE_W} height={HEADER_H} fill={C.navy} />
      {lines}
      <Circle cx={PAGE_W - 70} cy={10} r={170} fill="url(#glowA)" />
      <Circle cx={70} cy={HEADER_H + 20} r={120} fill="url(#glowB)" />
      <Rect x={0} y={HEADER_H - 2} width={PAGE_W} height={2} fill="url(#edge)" />
    </Svg>
  )
}

function PhotoRing() {
  return (
    <Svg width={92} height={92} style={{ position: 'absolute', top: 0, left: 0 }}>
      <Defs>
        <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.cyan} />
          <Stop offset="1" stopColor={C.blueDark} />
        </LinearGradient>
      </Defs>
      <Circle cx={46} cy={46} r={44.5} stroke="url(#ring)" strokeWidth={2.2} fill="none" />
      <Circle cx={83} cy={16} r={3} fill={C.cyan} />
    </Svg>
  )
}

function Heading({ icon, children }: { icon: keyof typeof ICONS; children: string }) {
  return (
    <View style={s.heading}>
      <View style={s.headingIcon}>
        <Icon name={icon} size={9} color={C.blueDark} />
      </View>
      <Text style={s.headingText}>{children}</Text>
      <View style={s.headingRule} />
    </View>
  )
}

function SkillBar({ level, id }: { level: number; id: string }) {
  const w = Math.max(0, Math.min(100, level)) / 100 * BAR_W
  return (
    <Svg width={BAR_W} height={4}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={C.blueDark} />
          <Stop offset="1" stopColor={C.cyan} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={BAR_W} height={4} rx={2} fill="#e2e8f0" />
      <Rect x={0} y={0} width={w} height={4} rx={2} fill={`url(#${id})`} />
    </Svg>
  )
}

/* ------------------------------------------------------------------ */

export function ResumeDocument({ data, locale }: { data: SiteContent; locale: string }) {
  const t = LABELS[locale] ?? LABELS.en
  const { contact } = data
  // react-pdf only reads JPEG/PNG, and resolves URLs against the page when rendered in the browser
  const photoSrc = data.photo ? absoluteUrl(data.photo.thumbUrl ?? data.photo.url) : undefined

  const contacts = [
    { icon: 'mail' as const, text: contact.email, href: `mailto:${contact.email}` },
    { icon: 'phone' as const, text: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
    contact.github && { icon: 'github' as const, text: stripUrl(contact.github), href: contact.github },
    contact.linkedin && { icon: 'linkedin' as const, text: stripUrl(contact.linkedin), href: contact.linkedin },
  ].filter(Boolean) as { icon: keyof typeof ICONS; text: string; href: string }[]

  return (
    <Document title={`CV - ${data.name}`} author={data.name} subject={data.title}>
      <Page size="A4" style={s.page} wrap={false}>
        {/* ============ Header ============ */}
        <View style={s.header}>
          <HeaderBackground />
          <View style={s.headerInner}>
            <View style={s.photoWrap}>
              <PhotoRing />
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              {photoSrc ? <Image src={photoSrc} style={s.photo} /> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{data.name}</Text>
              <Text style={s.title}>{data.title}</Text>
              <Text style={s.profile}>{data.profile}</Text>
            </View>
          </View>
        </View>

        {/* ============ Contact strip ============ */}
        <View style={s.strip}>
          {contacts.map((c) => (
            <Link key={c.text} src={c.href} style={s.stripItem}>
              <Icon name={c.icon} size={8.5} color={C.cyanLight} />
              <Text style={s.stripText}>{c.text}</Text>
            </Link>
          ))}
        </View>

        {/* ============ Body ============ */}
        <View style={s.body}>
          <View style={s.main}>
            <Heading icon="briefcase">{t.experience}</Heading>
            <View style={s.timeline}>
              <View style={s.rail} />
              {data.experience.map((exp, i) => (
                <View key={`${exp.company}-${i}`} style={s.entry}>
                  <View style={s.gutter}>
                    <View style={i === 0 ? [s.dot, s.dotFirst] : s.dot} />
                  </View>
                  <View style={s.entryBody}>
                    <View style={s.entryHead}>
                      <Text style={s.role}>{exp.role}</Text>
                      <Text style={s.datePill}>{range(exp.from, exp.to)}</Text>
                    </View>
                    <Text style={s.company}>{exp.company}</Text>
                    {(exp.highlights?.length ? exp.highlights : [exp.details]).map((h) => (
                      <View key={h} style={s.bullet}>
                        <View style={s.bulletMark} />
                        <Text style={s.bulletText}>{h}</Text>
                      </View>
                    ))}
                    {exp.tech && exp.tech.length > 0 && <Text style={s.tech}>{exp.tech.join('  ·  ')}</Text>}
                  </View>
                </View>
              ))}
            </View>

            <Heading icon="rocket">{t.projects}</Heading>
            <View style={s.grid}>
              {data.projects.map((p) => {
                const [org, kind] = (p.subtitle ?? '').split('|').map((x) => x.trim())
                return (
                  <View key={p.title} style={s.card}>
                    {p.period ? <Text style={s.cardPeriod}>{range(p.period)}</Text> : null}
                    <Text style={s.cardTitle}>{p.title}</Text>
                    {p.subtitle ? <Text style={s.cardSub}>{kind ? `${org} · ${kind}` : org}</Text> : null}
                    <Text style={s.cardText}>{p.summary ?? p.desc}</Text>
                    {p.tech && p.tech.length > 0 && <Text style={s.cardTech}>{p.tech.join(' · ')}</Text>}
                  </View>
                )
              })}
            </View>
          </View>

          {/* ============ Sidebar ============ */}
          <View style={s.side}>
            <View style={s.sideBlock}>
              <Heading icon="sparkles">{t.skills}</Heading>
              {[...data.skills].sort((a, b) => b.level - a.level).map((sk, i) => (
                <View key={sk.name} style={s.skillRow}>
                  <View style={s.skillHead}>
                    <Text style={s.skillName}>{sk.name}</Text>
                    <Text style={s.skillLevel}>{sk.level}%</Text>
                  </View>
                  <SkillBar level={sk.level} id={`skill${i}`} />
                </View>
              ))}
            </View>

            {data.languages.length > 0 && (
              <View style={s.sideBlock}>
                <Heading icon="languages">{t.languages}</Heading>
                <View style={s.chips}>
                  {data.languages.map((lang) => (
                    <Text key={lang} style={s.chip}>{lang}</Text>
                  ))}
                </View>
              </View>
            )}

            {data.education.length > 0 && (
              <View style={s.sideBlock}>
                <Heading icon="cap">{t.education}</Heading>
                {data.education.map((edu) => (
                  <View key={`${edu.degree}-${edu.period}`} style={s.edu}>
                    <Text style={s.eduPeriod}>{range(edu.period)}</Text>
                    <Text style={s.eduDegree}>{edu.degree}</Text>
                    {edu.track ? <Text style={s.eduSub}>{edu.track}</Text> : null}
                    <Text style={s.eduSub}>{edu.school}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={s.sideBlock}>
              <Heading icon="pin">{t.location}</Heading>
              {contact.city ? <Text style={s.sideStrong}>{contact.city}</Text> : null}
              <Text style={s.sideText}>{contact.address}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
