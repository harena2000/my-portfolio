'use client'

import { Button } from '@/components/ui/button'
import { FormDots, GlobeWireframe } from '@/components/ui/contact-with-globe'
import { CVData } from '@/data/cv'
import { motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Check, Github, Linkedin, Loader2, Mail, MapPin, Phone, X } from 'lucide-react'
import { useRef, useState, memo } from 'react'
import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_vjp2u4k'
const TEMPLATE_ID = 'template_862cspe'
const PUBLIC_KEY = 'n2PoQohU4NjWDSAco'

/** Ambohimanambola, Antananarivo */
const HOME_LOCATION: [number, number] = [-18.93, 47.6]

const smoothEase = [0.25, 0.1, 0.25, 1] as const

const fieldClass =
  'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-600 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 transition-all duration-200'
const labelClass = 'text-[11px] font-semibold tracking-widest uppercase text-gray-500'

function ContactInner() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Contact')
  const formRef = useRef<HTMLFormElement>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [globeFocus, setGlobeFocus] = useState<[number, number] | null>(null)

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

  const contactLinks = [
    { icon: Mail, label: t('email'), value: cv.contact.email, href: `mailto:${cv.contact.email}` },
    { icon: Phone, label: t('phone'), value: cv.contact.phone, href: `tel:${cv.contact.phone.replace(/\s/g, '')}` },
    {
      icon: MapPin,
      label: t('location'),
      value: cv.contact.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cv.contact.address + ', Antananarivo, Madagascar')}`,
      focusGlobe: true,
    },
  ]

  const socials = [
    { icon: Github, label: 'GitHub', href: cv.contact.github },
    { icon: Linkedin, label: 'LinkedIn', href: cv.contact.linkedin },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href))

  return (
    <section className="relative w-full text-white py-6 sm:py-10 px-4 sm:px-6">
      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30"
          >
            <span className="text-xs sm:text-sm text-blue-400 font-medium">{t('subtitle')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          >
            {t('title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="text-sm sm:text-base text-gray-400 max-w-md"
          >
            {t('description')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Left: channels + globe */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white">{t('getInTouch')}</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">{t('getInTouchDesc')}</p>
            </div>

            <div className="flex flex-col gap-3">
              {contactLinks.map(({ icon: Icon, label, value, href, focusGlobe }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={`${label}: ${value}`}
                  onMouseEnter={focusGlobe ? () => setGlobeFocus(HOME_LOCATION) : undefined}
                  onMouseLeave={focusGlobe ? () => setGlobeFocus(null) : undefined}
                  onFocus={focusGlobe ? () => setGlobeFocus(HOME_LOCATION) : undefined}
                  onBlur={focusGlobe ? () => setGlobeFocus(null) : undefined}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: smoothEase }}
                  className="group flex items-center gap-3 w-fit max-w-full text-sm text-gray-400 hover:text-white transition-colors duration-200 outline-none focus-visible:text-white"
                >
                  <span className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 group-focus-visible:border-blue-500/60 flex items-center justify-center shrink-0 transition-all duration-200">
                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                  </span>
                  <span className="truncate">{value}</span>
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + contactLinks.length * 0.1, ease: smoothEase }}
                className="flex gap-2 pt-1"
              >
                {socials.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="group w-9 h-9 rounded-lg bg-white/[0.04] border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 flex items-center justify-center transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
                  </a>
                ))}
              </motion.div>
            </div>

            {/* Globe, cropped and faded out at the bottom */}
            <div
              className="relative h-60 overflow-hidden"
              style={{ maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)' }}
            >
              <GlobeWireframe
                className="mx-auto max-w-[360px] text-blue-300/50"
                initialLocation={HOME_LOCATION}
                focus={globeFocus}
                markers={[{ location: HOME_LOCATION, label: 'Antananarivo' }]}
              />
            </div>
            <p className="-mt-6 text-xs text-gray-500 text-center">{t('basedIn')}</p>
          </motion.div>

          {/* Right: form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="rounded-2xl border border-white/10 bg-[#050d1f]/70 backdrop-blur-sm p-5 sm:p-7 flex flex-col gap-5 shadow-[0_0_40px_rgba(59,130,246,0.06)]"
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-0.5">{t('sendTitle')}</h3>
              <p className="text-sm text-gray-400">{t('sendDesc')}</p>
            </div>

            <FormDots />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className={labelClass}>{t('nameLabel')}</label>
                <input
                  id="contact-name"
                  name="from_name"
                  type="text"
                  autoComplete="name"
                  placeholder={t('namePlaceholder')}
                  required
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-email" className={labelClass}>{t('emailLabel')}</label>
                <input
                  id="contact-email"
                  name="from_email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('yourEmail')}
                  required
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contact-message" className={labelClass}>{t('messageLabel')}</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder={t('messagePlaceholder')}
                rows={5}
                required
                className={`${fieldClass} py-3 resize-none`}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={sending || sent}
                className={`h-11 px-7 rounded-xl font-semibold text-sm text-white group shadow-lg transition-colors duration-200 disabled:opacity-100 ${
                  sent
                    ? 'bg-emerald-600 hover:bg-emerald-600 shadow-emerald-600/20'
                    : error
                      ? 'bg-red-600 hover:bg-red-600 shadow-red-600/20'
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25'
                }`}
              >
                {sent ? (
                  <><Check className="w-4 h-4" /> {t('sent')}</>
                ) : error ? (
                  <><X className="w-4 h-4" /> {t('failed')}</>
                ) : sending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('sending')}</>
                ) : (
                  <>
                    {t('send')}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
              <span className="sr-only" role="status" aria-live="polite">
                {sent ? t('sent') : error ? t('failed') : ''}
              </span>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export const Contact = memo(ContactInner)
