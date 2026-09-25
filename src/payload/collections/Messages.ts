import type { CollectionConfig } from 'payload'

const loggedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/** Contact form submissions. The site writes them through a server action, never the public API. */
export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'status', 'createdAt'], group: 'Inbox' },
  defaultSort: '-createdAt',
  access: { read: loggedIn, create: () => false, update: loggedIn, delete: loggedIn },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%', readOnly: true } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%', readOnly: true } },
      ],
    },
    { name: 'message', type: 'textarea', required: true, admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'emailDelivered',
      type: 'checkbox',
      label: 'Also delivered by EmailJS',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  timestamps: true,
}
