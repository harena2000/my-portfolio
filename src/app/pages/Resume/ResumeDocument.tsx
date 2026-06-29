'use client'

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { CVLocale } from '@/data/cv'

// Break lines only between words — avoids ugly mid-word hyphenation (e.g. "Mahefani-aina").
Font.registerHyphenationCallback((word) => [word])

/* ------------------------------------------------------------------ */
/*  Theme tokens (match the existing hand-designed resume)            */
/* ------------------------------------------------------------------ */
const COLORS = {
  sidebar: '#16243d',
  chip: '#1e335a',
  blue: '#3b82f6',
  blueDark: '#2563eb',
  gold: '#f59e0b',
  white: '#ffffff',
  sidebarMuted: '#9fb0c9',
  heading: '#1f2937',
  body: '#4b5563',
  muted: '#6b7280',
}

/* Localized section labels */
const LABELS: Record<string, Record<string, string>> = {
  en: {
    contact: 'Contact',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    skills: 'Skills',
    languages: 'Languages',
    education: 'Education',
    experience: 'Professional Experience',
    projects: 'Projects',
    technologies: 'Technologies:',
  },
  fr: {
    contact: 'Contact',
    email: 'Email',
    phone: 'Téléphone',
    address: 'Adresse',
    skills: 'Compétences',
    languages: 'Langues',
    education: 'Formation',
    experience: 'Expérience Professionnelle',
    projects: 'Projets',
    technologies: 'Technologies :',
  },
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: COLORS.body,
  },

  /* ---- Sidebar ---- */
  sidebar: {
    width: '34%',
    backgroundColor: COLORS.sidebar,
    color: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  photo: {
    width: 78,
    height: 78,
    borderRadius: 39,
    objectFit: 'cover',
    alignSelf: 'center',
    marginBottom: 10,
    border: `2 solid ${COLORS.blue}`,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 9,
    color: COLORS.sidebarMuted,
    textAlign: 'center',
    marginBottom: 10,
  },
  sideHeading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: COLORS.white,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottom: `1.5 solid ${COLORS.blue}`,
  },
  sideBlock: {
    marginBottom: 9,
  },
  contactLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: COLORS.blue,
    marginBottom: 1,
  },
  contactValue: {
    fontSize: 8.5,
    color: '#d6deeb',
    marginBottom: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  chip: {
    backgroundColor: COLORS.chip,
    border: `0.75 solid ${COLORS.blue}`,
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 8,
    color: COLORS.white,
  },
  sideItem: {
    fontSize: 8.5,
    color: '#d6deeb',
    marginBottom: 2,
  },
  eduPeriod: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: COLORS.blue,
  },
  eduDegree: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: COLORS.white,
    marginTop: 1,
  },
  eduSub: {
    fontSize: 8,
    color: COLORS.sidebarMuted,
  },

  /* ---- Main column ---- */
  main: {
    width: '66%',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  profile: {
    fontSize: 9.5,
    color: COLORS.heading,
    lineHeight: 1.3,
    marginBottom: 9,
  },
  mainHeading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    color: COLORS.heading,
    paddingBottom: 3,
    marginBottom: 6,
    borderBottom: `2 solid ${COLORS.gold}`,
  },
  entry: {
    marginBottom: 6.5,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  entryTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: COLORS.heading,
    flexShrink: 1,
  },
  entryDate: {
    fontSize: 8.5,
    color: COLORS.muted,
    marginLeft: 8,
  },
  entrySubtitle: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 9,
    color: COLORS.blueDark,
    marginTop: 1,
    marginBottom: 3,
  },
  entryDesc: {
    fontSize: 9,
    color: COLORS.body,
    lineHeight: 1.25,
  },
  techLine: {
    fontSize: 8.5,
    color: COLORS.body,
    marginTop: 2,
  },
  techLabel: {
    fontFamily: 'Helvetica-Bold',
    color: COLORS.heading,
  },
})

/* ------------------------------------------------------------------ */

export function ResumeDocument({
  data,
  locale,
}: {
  data: CVLocale
  locale: string
}) {
  const t = LABELS[locale] ?? LABELS.en
  const { contact } = data

  return (
    <Document
      title={`CV - ${data.name}`}
      author={data.name}
      subject={data.title}
    >
      <Page size="A4" style={styles.page} wrap={false}>
        {/* ============ Sidebar ============ */}
        <View style={styles.sidebar}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          {data.photo ? <Image src={data.photo} style={styles.photo} /> : null}
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.jobTitle}>{data.title}</Text>

          {/* Contact */}
          <View style={styles.sideBlock}>
            <Text style={styles.sideHeading}>{t.contact}</Text>
            <Text style={styles.contactLabel}>{t.email}</Text>
            <Text style={styles.contactValue}>{contact.email}</Text>
            <Text style={styles.contactLabel}>{t.phone}</Text>
            <Text style={styles.contactValue}>{contact.phone}</Text>
            <Text style={styles.contactLabel}>{t.address}</Text>
            <Text style={styles.contactValue}>{contact.address}</Text>
          </View>

          {/* Skills */}
          {data.skills.length > 0 && (
            <View style={styles.sideBlock}>
              <Text style={styles.sideHeading}>{t.skills}</Text>
              <View style={styles.chipsRow}>
                {data.skills.map((s) => (
                  <Text key={s.name} style={styles.chip}>
                    {s.name}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <View style={styles.sideBlock}>
              <Text style={styles.sideHeading}>{t.languages}</Text>
              {data.languages.map((lang) => (
                <Text key={lang} style={styles.sideItem}>
                  {lang}
                </Text>
              ))}
            </View>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <View style={styles.sideBlock}>
              <Text style={styles.sideHeading}>{t.education}</Text>
              {data.education.map((edu) => (
                <View key={`${edu.degree}-${edu.period}`} style={{ marginBottom: 5 }}>
                  <Text style={styles.eduPeriod}>{edu.period}</Text>
                  <Text style={styles.eduDegree}>{edu.degree}</Text>
                  {edu.track ? <Text style={styles.eduSub}>{edu.track}</Text> : null}
                  <Text style={styles.eduSub}>{edu.school}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ============ Main ============ */}
        <View style={styles.main}>
          <Text style={styles.profile}>{data.profile}</Text>

          {/* Experience */}
          <Text style={styles.mainHeading}>{t.experience}</Text>
          {data.experience.map((exp, i) => (
            <View key={`${exp.company}-${i}`} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{exp.role}</Text>
                <Text style={styles.entryDate}>
                  {exp.from} - {exp.to}
                </Text>
              </View>
              <Text style={styles.entrySubtitle}>{exp.company}</Text>
              <Text style={styles.entryDesc}>{exp.details}</Text>
              {exp.tech && exp.tech.length > 0 && (
                <Text style={styles.techLine}>
                  <Text style={styles.techLabel}>{t.technologies} </Text>
                  {exp.tech.join(', ')}
                </Text>
              )}
            </View>
          ))}

          {/* Projects */}
          <Text style={styles.mainHeading}>{t.projects}</Text>
          {data.projects.map((proj, i) => (
            <View key={`${proj.title}-${i}`} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{proj.title}</Text>
                {proj.period ? <Text style={styles.entryDate}>{proj.period}</Text> : null}
              </View>
              {proj.subtitle ? (
                <Text style={styles.entrySubtitle}>{proj.subtitle}</Text>
              ) : null}
              {proj.desc ? <Text style={styles.entryDesc}>{proj.desc}</Text> : null}
              {proj.tech && proj.tech.length > 0 && (
                <Text style={styles.techLine}>
                  <Text style={styles.techLabel}>{t.technologies} </Text>
                  {proj.tech.join(', ')}
                </Text>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
