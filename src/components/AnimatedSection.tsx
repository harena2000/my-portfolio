'use client'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  id?: string     // 👈 Add this line
}

export function AnimatedSection({ children, className, id }: Props) {
  const ref = useRef(null)
  const controls = useAnimation()
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) controls.start('visible')
  }, [isInView, controls])

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}
