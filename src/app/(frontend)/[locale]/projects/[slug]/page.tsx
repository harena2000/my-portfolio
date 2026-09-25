import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import ProjectGallery from '@/components/ProjectGallery'
import { getProject } from '@/lib/content'

type Params = Promise<{ locale: string; slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getProject(slug, locale)
  if (!project) return {}
  return {
    title: `${project.title} | Harena Rico`,
    description: project.tagline ?? project.summary ?? project.desc,
  }
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const project = await getProject(slug, locale)
  if (!project) notFound()
  return <ProjectGallery project={project} />
}
