import type { CollectionConfig } from 'payload'
import { orderField } from '../fields/common'
import { contentHooks } from '../hooks/revalidate'

export const Skills: CollectionConfig = {
  slug: 'skills',
  access: { read: () => true },
  defaultSort: 'order',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'level', 'order'], group: 'Content' },
  hooks: contentHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'level', type: 'number', required: true, min: 0, max: 100, admin: { description: 'Proficiency, 0–100.' } },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    orderField,
  ],
}
