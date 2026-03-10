'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CVData } from '@/data/cv'
import { AnimatedSection } from '@/components/AnimatedSection'
import { motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react'
import { useState } from 'react'

export function Contact() {
  const locale = useLocale()
  const cv = CVData[locale as keyof typeof CVData]
  const t = useTranslations('Contact')
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      alert('Message sent (demo)')
    }, 1500)
  }

  const contactItems = [
    { icon: Mail, label: t('email'), value: cv.contact.email, href: `mailto:${cv.contact.email}` },
    { icon: Phone, label: t('phone'), value: cv.contact.phone, href: `tel:${cv.contact.phone}` },
    { icon: MapPin, label: t('address'), value: cv.contact.address, href: null },
  ]

  return (
    <AnimatedSection
      id="contact"
      className="w-full h-full flex items-center justify-center text-white py-12"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{t('subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {t('title')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {contactItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-900/10 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-900/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-900/50 transition-all">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-gray-200 hover:text-blue-400 transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-sm text-gray-200">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex gap-3 pt-2"
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-900/30 hover:border-blue-500/40 transition-all duration-300 hover:scale-110"
              >
                <Github className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-900/30 hover:border-blue-500/40 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/20 transition-all duration-300"
          >
            <Input
              placeholder={t('yourName')}
              required
              className="bg-white/5 text-white border-white/10 focus:border-blue-500/50 rounded-lg placeholder:text-gray-600 transition-all"
            />
            <Input
              placeholder={t('yourEmail')}
              type="email"
              required
              className="bg-white/5 text-white border-white/10 focus:border-blue-500/50 rounded-lg placeholder:text-gray-600 transition-all"
            />
            <Textarea
              placeholder={t('message')}
              required
              rows={4}
              className="bg-white/5 text-white border-white/10 focus:border-blue-500/50 rounded-lg placeholder:text-gray-600 resize-none transition-all"
            />
            <Button
              type="submit"
              disabled={sending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 justify-center"
            >
              {sending ? (
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
    </AnimatedSection>
  )
}
