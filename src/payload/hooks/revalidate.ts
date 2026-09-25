import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

/** Cache tag shared by every CMS read on the public site (see src/lib/content.ts) */
export const CMS_TAG = 'cms'

const revalidate = async (req: PayloadRequest) => {
  // Seeding and scripts run outside Next.js, where there is no cache to invalidate
  if (req.context?.skipRevalidate) return
  try {
    const { revalidateTag } = await import('next/cache')
    revalidateTag(CMS_TAG, { expire: 0 })
  } catch {
    // Not inside a Next.js request (e.g. `payload run`)
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await revalidate(req)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidate(req)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req }) => {
  await revalidate(req)
  return doc
}

export const contentHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
