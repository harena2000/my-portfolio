'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
  emailDelivered: z.boolean(),
  // Honeypot: hidden from people, filled in by naive bots
  website: z.string().max(0).optional(),
})

export type ContactResult = { ok: true } | { ok: false; error: 'invalid' | 'server' }

/** Saves a contact form submission to the Payload "messages" inbox */
export async function saveContactMessage(input: z.input<typeof schema>): Promise<ContactResult> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    // Pretend success to bots that filled the honeypot, so they don't retry
    if (input.website) return { ok: true }
    return { ok: false, error: 'invalid' }
  }

  try {
    const payload = await getPayload({ config })
    const { name, email, message, emailDelivered } = parsed.data
    await payload.create({
      collection: 'messages',
      data: { name, email, message, emailDelivered, status: 'new' },
      overrideAccess: true,
    })
    return { ok: true }
  } catch (err) {
    console.error('Failed to save contact message:', err)
    return { ok: false, error: 'server' }
  }
}
