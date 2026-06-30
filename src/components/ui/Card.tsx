'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className, hover = false, onClick, padding = 'md' }: CardProps) {
  const baseStyles = clsx(
    'bg-surface border border-border transition-colors',
    paddingStyles[padding],
    hover && 'cursor-pointer hover:border-border-dark',
    className
  )

  if (hover) {
    return (
      <motion.div
        className={baseStyles}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={baseStyles} onClick={onClick}>
      {children}
    </div>
  )
}
