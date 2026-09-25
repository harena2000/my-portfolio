import { setRequestLocale } from 'next-intl/server'
import { ContentProvider } from '@/components/ContentProvider'
import { getContent } from '@/lib/content'
import HomeClient from './HomeClient'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const content = await getContent(locale)

  return (
    <ContentProvider value={content}>
      <HomeClient />
    </ContentProvider>
  )
}
