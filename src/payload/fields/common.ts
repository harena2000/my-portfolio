import type { Field } from 'payload'

/** Manual sort position; lists on the site are ordered by this ascending */
export const orderField: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 0,
  admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
}

/** A list of plain strings (e.g. tech stack), stored as rows of { value } */
export const stringList = (name: string, label: string, localized = false): Field => ({
  name,
  label,
  type: 'array',
  localized,
  labels: { singular: 'Item', plural: 'Items' },
  admin: { initCollapsed: true },
  fields: [{ name: 'value', type: 'text', required: true, localized: false }],
})

/**
 * Start/end dates for a period. `precision` controls display:
 * "January 2026 – June 2026" (month) or "2022 – 2024" (year).
 */
export const periodFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'startDate',
        type: 'date',
        admin: { width: '50%', date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } },
      },
      {
        name: 'endDate',
        type: 'date',
        admin: {
          width: '50%',
          date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' },
          condition: (_, siblingData) => !siblingData?.current,
        },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'current',
        type: 'checkbox',
        label: 'Ongoing (shows "Present")',
        defaultValue: false,
        admin: { width: '50%' },
      },
      {
        name: 'precision',
        type: 'select',
        defaultValue: 'month',
        options: [
          { label: 'Month and year', value: 'month' },
          { label: 'Year only', value: 'year' },
        ],
        admin: { width: '50%' },
      },
    ],
  },
]
