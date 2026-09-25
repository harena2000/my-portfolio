import type { CollectionConfig } from 'payload'
import { orderField, periodFields, stringList } from '../fields/common'
import { contentHooks } from '../hooks/revalidate'

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: { read: () => true },
  defaultSort: 'order',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'organization', 'status', 'order'], group: 'Content' },
  hooks: contentHooks,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'title', type: 'text', required: true, localized: true, admin: { width: '50%' } },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  index: true,
                  admin: { width: '50%', description: 'URL of the detail page: /projects/<slug>' },
                  hooks: {
                    beforeValidate: [
                      ({ value, siblingData }) =>
                        slugify(typeof value === 'string' && value ? value : String(siblingData?.title ?? '')),
                    ],
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'organization', type: 'text', admin: { width: '50%', description: 'e.g. Freelance, Futurmap' } },
                { name: 'kind', type: 'text', localized: true, admin: { width: '50%', description: 'e.g. Mobile Application' } },
              ],
            },
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'completed',
              options: [
                { label: 'Completed', value: 'completed' },
                { label: 'In progress', value: 'in-progress' },
                { label: 'On standby', value: 'on-standby' },
              ],
            },
            ...periodFields,
            { name: 'summary', type: 'textarea', localized: true, admin: { description: 'One line, used on the resume PDF.' } },
            { name: 'description', type: 'textarea', localized: true },
            stringList('tech', 'Tech stack'),
            { name: 'externalUrl', type: 'text', admin: { description: 'Store page or live site (used when there is no detail page).' } },
          ],
        },
        {
          label: 'Detail page',
          fields: [
            { name: 'hasDetailPage', type: 'checkbox', defaultValue: false, label: 'Show a screenshot gallery page' },
            {
              type: 'row',
              admin: { condition: (_, siblingData) => Boolean(siblingData?.hasDetailPage) },
              fields: [
                {
                  name: 'accent',
                  type: 'select',
                  defaultValue: 'blue',
                  options: [
                    { label: 'Blue', value: 'blue' },
                    { label: 'Purple', value: 'purple' },
                    { label: 'Emerald', value: 'emerald' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'icon',
                  type: 'select',
                  defaultValue: 'smartphone',
                  options: ['smartphone', 'music', 'globe', 'map', 'layers', 'code'].map((v) => ({ label: v, value: v })),
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'tagline',
              type: 'text',
              localized: true,
              admin: { condition: (_, siblingData) => Boolean(siblingData?.hasDetailPage) },
            },
            {
              name: 'screenGroups',
              type: 'array',
              labels: { singular: 'Screen group', plural: 'Screen groups' },
              admin: { condition: (_, siblingData) => Boolean(siblingData?.hasDetailPage) },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                {
                  name: 'screens',
                  type: 'array',
                  fields: [
                    { name: 'image', type: 'upload', relationTo: 'media', required: true },
                    { name: 'label', type: 'text', localized: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    orderField,
  ],
}
