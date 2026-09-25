import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { withPayload } from '@payloadcms/next/withPayload';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const blobHost = process.env.BLOB_READ_WRITE_TOKEN ? [{ protocol: 'https' as const, hostname: '*.public.blob.vercel-storage.com' }] : [];

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 80, 95],
    // CMS media: local /api/media files in dev, Vercel Blob in production
    remotePatterns: blobHost,
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/**' }],
  },
};

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false });
