'use client'

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas'

interface RiveAnimationProps {
  src: string
  artboard?: string
  stateMachines?: string
  className?: string
}

export default function RiveAnimation({ src, artboard, stateMachines, className }: RiveAnimationProps) {
  const { RiveComponent } = useRive({
    src,
    artboard,
    stateMachines,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  })

  return (
    <div className={`w-full h-full relative ${className || ''}`}>
      {/* Glow effect behind the animation */}
      <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-2xl" />
      <RiveComponent className="relative z-10" />
    </div>
  )
}
