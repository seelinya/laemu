'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

const navLinks = [
  { label: 'Entdecken', href: '/' },
  { label: 'Community', href: '/community' },
  { label: 'Academy', href: '/academy' },
  { label: 'Events', href: '/events' },
  { label: 'Formationen', href: '/formations' },
  { label: 'Mission', href: '/mission' },
  { label: 'Shop', href: '/shop' },
]

/** LAEMU wave mark — replicates the sinusoidal wave from the brand identity */
function WaveMark({ className = '', color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4,20 C7,20 9,5 16,5 C23,5 25,20 32,20 C39,20 41,9 48,9 C55,9 58,15 60,15"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** LAEMU full wordmark with embedded wave */
function LaemuLogo({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? '#FFFFFF' : '#0A0A0A'
  const waveColor = isDark ? '#FFFFFF' : '#0A0A0A'
  return (
    <svg
      width="110"
      height="28"
      viewBox="0 0 110 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LAEMU"
    >
      {/* L */}
      <text x="0" y="22" fontFamily="var(--font-sans), DM Sans, sans-serif" fontSize="22" fontWeight="700" letterSpacing="-1" fill={textColor}>L</text>
      {/* A */}
      <text x="14" y="22" fontFamily="var(--font-sans), DM Sans, sans-serif" fontSize="22" fontWeight="700" letterSpacing="-1" fill={textColor}>A</text>
      {/* E */}
      <text x="30" y="22" fontFamily="var(--font-sans), DM Sans, sans-serif" fontSize="22" fontWeight="700" letterSpacing="-1" fill={textColor}>E</text>
      {/* Wave mark in place of M */}
      <path
        d="M47,18 C49,18 51,6 54,6 C57,6 59,18 62,18 C65,18 67,10 70,10 C73,10 74,14 76,14"
        stroke={waveColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* U */}
      <text x="79" y="22" fontFamily="var(--font-sans), DM Sans, sans-serif" fontSize="22" fontWeight="700" letterSpacing="-1" fill={textColor}>U</text>
    </svg>
  )
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isDark = !scrolled && !menuOpen && pathname === '/'

  return (
    <>
      <motion.nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || menuOpen
            ? 'bg-white/95 backdrop-blur-sm border-b border-border shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-0" aria-label="LAEMU – Startseite">
              <LaemuLogo isDark={isDark} />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'font-sans text-sm font-medium tracking-wide transition-colors duration-200 relative group',
                    isDark
                      ? 'text-white/80 hover:text-white'
                      : 'text-text-secondary hover:text-text-primary',
                    pathname === link.href && (isDark ? 'text-white' : 'text-text-primary')
                  )}
                >
                  {link.label}
                  <span
                    className={clsx(
                      'absolute -bottom-0.5 left-0 h-px transition-all duration-200 group-hover:w-full',
                      isDark ? 'bg-white' : 'bg-accent-gold',
                      pathname === link.href ? 'w-full' : 'w-0'
                    )}
                  />
                </Link>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-4">
              <Link
                href="/community"
                className={clsx(
                  'hidden lg:inline-flex items-center px-5 py-2.5 font-sans text-sm font-semibold tracking-wide transition-all duration-200',
                  isDark
                    ? 'bg-white text-text-primary hover:bg-white/90'
                    : 'bg-text-primary text-white hover:bg-neutral-800'
                )}
              >
                Mitmachen
              </Link>

              <button
                className={clsx(
                  'lg:hidden p-2',
                  isDark ? 'text-white' : 'text-text-primary'
                )}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menü öffnen"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {menuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="7" x2="21" y2="7"/>
                      <line x1="3" y1="12" x2="21" y2="12"/>
                      <line x1="3" y1="17" x2="21" y2="17"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white lg:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex flex-col h-full pt-24 px-8 pb-12">
              <div className="flex-1 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.08 }}
                  >
                    <Link
                      href={link.href}
                      className={clsx(
                        'block py-4 font-serif text-4xl font-bold border-b border-border transition-colors',
                        pathname === link.href ? 'text-accent-gold' : 'text-text-primary hover:text-accent-gold'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Link
                  href="/community"
                  className="block w-full text-center py-4 bg-text-primary text-white font-sans font-semibold tracking-wide text-lg hover:bg-neutral-800 transition-colors"
                >
                  Jetzt mitmachen
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
