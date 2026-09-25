import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'

export const Profile: GlobalConfig = {
  slug: 'profile',
  access: { read: () => true },
  admin: { group: 'Content' },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'title', type: 'text', required: true, localized: true, admin: { width: '50%', description: 'e.g. Mobile & Web Developer' } },
      ],
    },
    { name: 'bio', type: 'textarea', required: true, localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media', admin: { description: 'Used in the hero and on the resume PDF.' } },
    {
      name: 'languages',
      type: 'array',
      localized: true,
      labels: { singular: 'Language', plural: 'Languages' },
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
            { name: 'phone', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'address', type: 'text', admin: { width: '50%' } },
            { name: 'city', type: 'text', localized: true, admin: { width: '50%', description: 'e.g. Antananarivo, Madagascar' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'lat', type: 'number', admin: { width: '50%', description: 'Globe marker latitude' } },
            { name: 'lng', type: 'number', admin: { width: '50%', description: 'Globe marker longitude' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'github', type: 'text', admin: { width: '50%' } },
            { name: 'linkedin', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
}
