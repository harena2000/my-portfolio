import path from 'path'
import type { CollectionConfig } from 'payload'
import { contentHooks } from '../hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  admin: { group: 'Content' },
  hooks: contentHooks,
  fields: [{ name: 'alt', type: 'text', localized: true }],
  upload: {
    // Used when no BLOB_READ_WRITE_TOKEN is set (local development). Resolved from the
    // project root: import.meta.url points into .next/ once Next bundles the config.
    staticDir: path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*'],
    imageSizes: [
      // Square JPEG crop for the resume PDF photo: small, and react-pdf can't read WebP
      {
        name: 'thumb',
        width: 480,
        height: 480,
        position: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 88 } },
      },
    ],
    adminThumbnail: 'thumb',
  },
}
