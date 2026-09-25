import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: { read: () => true },
  admin: { group: 'Admin' },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'openToWork', type: 'checkbox', defaultValue: true, label: 'Available for work', admin: { width: '50%' } },
        { name: 'yearsOfExperience', type: 'number', min: 0, defaultValue: 4, admin: { width: '50%' } },
      ],
    },
    {
      name: 'heroBadges',
      type: 'array',
      labels: { singular: 'Badge', plural: 'Hero badges' },
      admin: { description: 'Floating tech badges around the hero photo.' },
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'emailjs',
      label: 'EmailJS (contact form email delivery)',
      type: 'group',
      fields: [
        { name: 'serviceId', type: 'text' },
        { name: 'templateId', type: 'text' },
        { name: 'publicKey', type: 'text', admin: { description: 'Public key, safe to expose in the browser.' } },
      ],
    },
  ],
}
