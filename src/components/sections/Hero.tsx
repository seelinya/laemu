'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { clsx } from 'clsx'

interface HeroProps {
  title: string
  subtitle?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  imageSrc: string
  imageAlt?: string
  dark?: boolean
  size?: 'full' | 'large' | 'medium'
  tag?: string
}

export function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt = '',
  size = 'large',
}: HeroProps) {
  return (
    <section
      className={clsx(
        'relative flex items-center overflow-hidden',
        size === 'full' ? 'min-h-screen' : size === 'large' ? 'min-h-[80vh]' : 'min-h-[60vh]'
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6 whitespace-pre-line"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="font-sans text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {primaryCta && (
              <Button href={primaryCta.href} variant="primary" size="lg">
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button href={secondaryCta.href} variant="outline" size="lg">
                {secondaryCta.label}
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {size === 'full' && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="font-sans text-xs uppercase tracking-widest text-white/50">Scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      )}
    </section>
  )
}
