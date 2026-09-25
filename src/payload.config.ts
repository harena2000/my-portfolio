import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import * as neonDriver from '@neondatabase/serverless'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import sharp from 'sharp'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Skills } from './payload/collections/Skills'
import { Experiences } from './payload/collections/Experiences'
import { Education } from './payload/collections/Education'
import { Projects } from './payload/collections/Projects'
import { Messages } from './payload/collections/Messages'
import { Profile } from './payload/globals/Profile'
import { SiteSettings } from './payload/globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const databaseUrl = process.env.DATABASE_URL || ''
// Neon: talk Postgres over WebSockets (port 443) with Neon's pg-compatible driver.
// Works on networks that block port 5432, and on serverless hosts. Other URLs use node-postgres.
const useNeonDriver = /\.neon\.tech/.test(databaseUrl)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — Portfolio CMS' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Skills, Experiences, Education, Projects, Media, Messages, Users],
  globals: [Profile, SiteSettings],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Français', code: 'fr' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  i18n: { supportedLanguages: { en, fr }, fallbackLanguage: 'en' },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: databaseUrl },
    ...(useNeonDriver ? { pg: neonDriver as unknown as NonNullable<Parameters<typeof postgresAdapter>[0]['pg']> } : {}),
  }),
  plugins: [
    vercelBlobStorage({
      // Without a token, uploads stay on local disk (./media)
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Images are public: link straight to the Blob CDN instead of proxying through /api/media/file
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
