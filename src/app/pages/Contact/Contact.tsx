'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { usePortfolioData } from '@/hooks/usePortfolioData'
import { motion, type Variants } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react'
import { useRef, useState, memo } from 'react'
import Image from 'next/image'
import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_vjp2u4k'
const TEMPLATE_ID = 'template_862cspe'
const PUBLIC_KEY = 'n2PoQohU4NjWDSAco'

const colVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
}

function ContactInner() {
  const { data: cv } = usePortfolioData()
  const t = useTranslations('Contact')
  const formRef = useRef<HTMLFormElement>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return

    setSending(true)
    setError(false)

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      })
      setSent(true)
      formRef.current.reset()
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      console.error('EmailJS error:', err)
      setError(true)
      setTimeout(() => setError(false), 4000)
    } finally {
      setSending(false)
    }
  }

  const contactItems = [
    { icon: Mail, label: t('email'), value: cv.contact.email, href: `mailto:${cv.contact.email}` },
    { icon: Phone, label: t('phone'), value: cv.contact.phone, href: `tel:${cv.contact.phone}` },
    { icon: MapPin, label: t('address'), value: cv.contact.address, href: null },
  ]

  return (
    <section
      className="w-full flex items-center justify-center text-white py-8 sm:py-12 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-6 sm:mb-10 flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{t('subtitle')}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {t('title')}
            </h2>
          </div>
          <div className="hidden sm:block w-20 h-20 md:w-28 md:h-28 relative opacity-60 section-deco-float">
            <Image src="/images/contact-deco.png" alt="" fill className="object-contain" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left: Contact info */}
          <motion.div
            variants={colVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-3 sm:space-y-4"
          >
            {contactItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  variants={rowVariants}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-900/10 transition-colors duration-200 group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-900/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-900/50 transition-colors duration-200">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-gray-200 hover:text-blue-400 transition-colors duration-150 truncate block">{item.value}</a>
                    ) : (
                      <p className="text-sm text-gray-200 truncate">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {/* Social links */}
            <motion.div variants={rowVariants} className="flex gap-3 pt-1">
              <a
                href={cv.contact.github ?? 'https://github.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-900/30 hover:border-blue-500/40 transition-colors duration-200"
              >
                <Github className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-150" />
              </a>
              <a
                href={cv.contact.linkedin ?? 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-900/30 hover:border-blue-500/40 transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-white transition-colors duration-150" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-3 sm:space-y-4 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-blue-500/20 transition-colors duration-200"
          >
            <Input
              name="from_name"
              placeholder={t('yourName')}
              required
              className="bg-white/5 text-white border-white/10 focus:border-blue-500/50 rounded-lg placeholder:text-gray-600 transition-colors duration-150 text-sm"
            />
            <Input
              name="from_email"
              placeholder={t('yourEmail')}
              type="email"
              required
              className="bg-white/5 text-white border-white/10 focus:border-blue-500/50 rounded-lg placeholder:text-gray-600 transition-colors duration-150 text-sm"
            />
            <Textarea
              name="message"
              placeholder={t('message')}
              required
              rows={4}
              className="bg-white/5 text-white border-white/10 focus:border-blue-500/50 rounded-lg placeholder:text-gray-600 resize-none transition-colors duration-150 text-sm"
            />
            <Button
              type="submit"
              disabled={sending || sent}
              className={`w-full rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 justify-center text-sm ${
                sent
                  ? 'bg-green-600 hover:bg-green-600 shadow-green-600/20'
                  : error
                    ? 'bg-red-600 hover:bg-red-600 shadow-red-600/20'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 hover:shadow-blue-500/30'
              }`}
            >
              {sent ? (
                <span className="flex items-center gap-2">✓ {t('sent') ?? 'Sent!'}</span>
              ) : error ? (
                <span className="flex items-center gap-2">✕ Failed — try again</span>
              ) : sending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('sending')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  {t('send')}
                </span>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export const Contact = memo(ContactInner)
