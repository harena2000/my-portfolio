import type { CollectionConfig } from 'payload'
import { orderField } from '../fields/common'
import { contentHooks } from '../hooks/revalidate'

export const Education: CollectionConfig = {
  slug: 'education',
  labels: { singular: 'Education', plural: 'Education' },
  access: { read: () => true },
  defaultSort: 'order',
  admin: { useAsTitle: 'degree', defaultColumns: ['degree', 'school', 'startYear', 'order'], group: 'Content' },
  hooks: contentHooks,
  fields: [
    { name: 'degree', type: 'text', required: true, localized: true },
    { name: 'track', type: 'text', localized: true },
    { name: 'school', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'startYear', type: 'number', required: true, admin: { width: '50%' } },
        { name: 'endYear', type: 'number', admin: { width: '50%', description: 'Leave empty for a single year.' } },
      ],
    },
    orderField,
  ],
}
