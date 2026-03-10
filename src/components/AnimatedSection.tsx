'use client'
import { motion, type Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  id?: string
}

// Simple, lightweight section animation using whileInView
// No useAnimation/useInView/useEffect chain — framer-motion handles it internally
export function AnimatedSection({ children, className, id }: Props) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.section>
  )
}
