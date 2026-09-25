import type { CollectionConfig } from 'payload'
import { orderField, periodFields, stringList } from '../fields/common'
import { contentHooks } from '../hooks/revalidate'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  labels: { singular: 'Experience', plural: 'Experience' },
  access: { read: () => true },
  defaultSort: 'order',
  admin: { useAsTitle: 'role', defaultColumns: ['role', 'company', 'startDate', 'order'], group: 'Content' },
  hooks: contentHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text', required: true, localized: true, admin: { width: '50%' } },
        { name: 'company', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    ...periodFields,
    { name: 'details', type: 'textarea', localized: true, admin: { description: 'Short summary, shown on the website.' } },
    {
      name: 'highlights',
      type: 'array',
      localized: true,
      admin: { description: 'Achievement bullets for the resume PDF.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    stringList('tech', 'Tech stack'),
    orderField,
  ],
}
