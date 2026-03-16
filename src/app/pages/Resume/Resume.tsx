'use client'

import { motion, type Variants } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { Download, FileText, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { useState, useRef, useCallback, useEffect } from 'react'

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
  const [pageImages, setPageImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const pdfUrl = RESUME_FILES[locale] ?? RESUME_FILES.en

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.2, 2.5))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }, [])

  const handleResetZoom = useCallback(() => {
    setZoom(1)
  }, [])

  // Render PDF pages to canvas images using pdf.js
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    setPageImages([])

    const renderPdf = async () => {
      try {
        // Dynamically load pdf.js from CDN
        const pdfjsLib = await loadPdfJs()
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise

        const images: string[] = []
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return
          const page = await pdf.getPage(i)
          // Render at 2x for crisp display
          const scale = 2
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')!
          await page.render({ canvasContext: ctx, viewport }).promise
          images.push(canvas.toDataURL('image/png'))
        }

        if (!cancelled) {
          setPageImages(images)
          setLoading(false)
        }
      } catch (err) {
        console.error('PDF render error:', err)
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      }
    }

    renderPdf()
    return () => { cancelled = true }
  }, [pdfUrl])

  return (
    <section className="w-full flex items-start justify-center text-white px-4 sm:px-6">
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
          className="flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-white/5 border border-white/10 sticky top-16 z-20 backdrop-blur-xl"
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

        {/* PDF Pages — rendered as full images, scrolled by the parent section */}
        <motion.div
          ref={canvasContainerRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="flex flex-col items-center gap-6"
          style={{ willChange: 'transform, opacity' }}
        >
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <svg className="animate-spin w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-gray-500">{locale === 'fr' ? 'Chargement du CV...' : 'Loading resume...'}</span>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <FileText className="w-12 h-12 text-gray-600" />
              <p className="text-sm text-gray-500">{locale === 'fr' ? 'Impossible de charger le PDF' : 'Failed to load PDF'}</p>
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                {t('download')}
              </a>
            </div>
          )}

          {pageImages.map((src, idx) => (
            <div
              key={idx}
              className="w-full rounded-2xl overflow-hidden border border-white/10 bg-white shadow-2xl shadow-black/30"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                marginBottom: zoom !== 1 ? `${(zoom - 1) * 100}%` : undefined,
                transition: 'transform 0.25s ease-out',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${t('title')} - Page ${idx + 1}`}
                className="w-full h-auto block"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>

        {/* Mobile: prominent download CTA */}
        {!loading && !error && pageImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6 sm:hidden"
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
        )}
      </div>
    </section>
  )
}

/** Dynamically load pdf.js from CDN (only once) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadPdfJs(): Promise<any> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).pdfjsLib) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).pdfjsLib)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs'
    script.type = 'module'

    // For module scripts, we need a different approach
    const inlineScript = document.createElement('script')
    inlineScript.type = 'module'
    inlineScript.textContent = `
      import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
      window.pdfjsLib = pdfjsLib;
      window.dispatchEvent(new Event('pdfjsReady'));
    `

    const onReady = () => {
      window.removeEventListener('pdfjsReady', onReady)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).pdfjsLib)
    }

    window.addEventListener('pdfjsReady', onReady)
    document.head.appendChild(inlineScript)

    // Timeout fallback
    setTimeout(() => {
      window.removeEventListener('pdfjsReady', onReady)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).pdfjsLib) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve((window as any).pdfjsLib)
      } else {
        reject(new Error('pdf.js load timeout'))
      }
    }, 10000)
  })
}
