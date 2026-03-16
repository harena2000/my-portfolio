'use client'

import { motion, type Variants } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { Download, FileText, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const RESUME_FILES: Record<string, string> = {
  en: '/resume/cv-en.pdf',
  fr: '/resume/cv-fr.pdf',
}

export function Resume() {
  const locale = useLocale()
  const t = useTranslations('Resume')
  const [zoom, setZoom] = useState(1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const pdfUrl = RESUME_FILES[locale] ?? RESUME_FILES.en

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.2, 2))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }, [])

  const handleResetZoom = useCallback(() => {
    setZoom(1)
  }, [])

  return (
    <section className="w-full flex items-start justify-center text-white py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-6 sm:mb-8"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
                {t('subtitle')}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {t('title')}
              </h2>
            </div>

            {/* Download button */}
            <motion.a
              variants={itemVariants}
              href={pdfUrl}
              download
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-colors duration-200 group"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
              {t('download')}
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.15 }}
          className="flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">
              {locale === 'fr' ? 'CV-HarenaRicoMahefaniaina.pdf' : 'CV-HarenaRicoMahefaniaina(english).pdf'}
            </span>
            <span className="sm:hidden">CV.pdf</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-150"
              title={t('zoomOut')}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 min-w-[3rem] text-center font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-150"
              title={t('zoomIn')}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-150 ml-1"
              title={t('resetZoom')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* PDF Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-500/20 transition-colors duration-200"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* PDF iframe container with zoom */}
          <div
            className="w-full overflow-auto scrollbar-furtif"
            style={{ height: 'calc(100dvh - 280px)', minHeight: '400px' }}
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                width: zoom !== 1 ? `${100 / zoom}%` : '100%',
                transition: 'transform 0.2s ease-out',
              }}
            >
              <iframe
                ref={iframeRef}
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full border-0"
                style={{ height: 'calc(100dvh - 280px)', minHeight: '400px' }}
                title={t('title')}
              />
            </div>
          </div>
        </motion.div>

        {/* Mobile: prominent download CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-4 sm:hidden"
        >
          <a
            href={pdfUrl}
            download
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-600/20 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            {t('download')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
