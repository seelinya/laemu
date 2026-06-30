'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { clsx } from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  external?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent-gold text-white hover:bg-accent-gold-hover border-2 border-accent-gold hover:border-accent-gold-hover',
  secondary: 'bg-surface text-text-primary hover:border-border-dark border-2 border-border',
  outline: 'bg-transparent text-text-on-dark hover:bg-surface hover:text-text-primary border-2 border-white',
  ghost: 'bg-transparent text-text-primary hover:bg-surface-muted border-2 border-transparent',
  dark: 'bg-nav-dark text-text-on-dark hover:bg-accent-gold hover:text-white border-2 border-nav-dark hover:border-accent-gold',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className,
  disabled,
  type = 'button',
  external,
}: ButtonProps) {
  const baseStyles = clsx(
    'inline-flex items-center justify-center gap-2 font-sans font-bold tracking-wide transition-all duration-200 rounded-none cursor-pointer',
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.02 },
    whileTap: disabled ? {} : { scale: 0.98 },
    transition: { duration: 0.15 },
  }

  if (href) {
    if (external) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseStyles}
          {...motionProps}
        >
          {children}
        </motion.a>
      )
    }
    return (
      <motion.div {...motionProps}>
        <Link href={href} className={baseStyles}>
          {children}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      {...motionProps}
    >
      {children}
    </motion.button>
  )
}
