'use client'

import { createContext, useContext } from 'react'
import type { SiteContent } from '@/lib/content-types'

const ContentContext = createContext<SiteContent | null>(null)

/** Makes the CMS content (loaded on the server) available to client sections */
export function ContentProvider({ value, children }: { value: SiteContent; children: React.ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent(): SiteContent {
  const content = useContext(ContentContext)
  if (!content) throw new Error('useContent must be used inside <ContentProvider>')
  return content
}
