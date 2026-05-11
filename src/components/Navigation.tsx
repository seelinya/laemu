'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

function LaemuLogo({ white = false }: { white?: boolean }) {
  return (
    <div className={`flex items-center leading-none select-none ${white ? 'text-white' : 'text-dark'}`}>
      <span className="font-heading font-black text-[1.6rem] tracking-[-0.04em]">LAE</span>
      <svg
        width="36"
        height="28"
        viewBox="0 0 72 54"
        fill="none"
        className="mx-[1px] translate-y-[1px]"
        aria-hidden="true"
      >
        <path
          d="M 2,50 C 12,2 24,2 36,28 C 46,48 56,54 70,28"
          stroke="currentColor"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-heading font-black text-[1.6rem] tracking-[-0.04em]">U</span>
    </div>
  )
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const isHeroPage = pathname === '/'
  const isDark = !scrolled && !menuOpen && isHeroPage

  return (
    <>
      <motion.nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || menuOpen
            ? 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <LaemuLogo white={isDark} />
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'font-sans text-sm font-medium tracking-wide transition-colors duration-200 relative group',
                    isDark
                      ? 'text-white/75 hover:text-white'
                      : 'text-text-secondary hover:text-dark',
                    pathname === link.href && (isDark ? 'text-white' : 'text-dark')
                  )}
                >
                  {link.label}
                  <span
                    className={clsx(
                      'absolute -bottom-1 left-0 h-px transition-all duration-200 group-hover:w-full',
                      isDark ? 'bg-white' : 'bg-dark',
                      pathname === link.href ? 'w-full' : 'w-0'
                    )}
                  />
                </Link>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-4">
              <Link
                href="/member/community"
                className={clsx(
                  'hidden lg:inline-flex items-center px-5 py-2.5 font-sans text-sm font-semibold tracking-wide transition-all duration-200',
                  isDark
                    ? 'bg-white text-dark hover:bg-accent-gold hover:text-white'
                    : 'bg-dark text-white hover:bg-accent-gold'
                )}
              >
                Mitmachen
              </Link>

              <button
                className={clsx(
                  'lg:hidden flex flex-col gap-1.5 p-2',
                  isDark ? 'text-white' : 'text-dark'
                )}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                <motion.span
                  className={clsx('block h-0.5 w-6', isDark && !menuOpen ? 'bg-white' : 'bg-dark')}
                  animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className={clsx('block h-0.5 w-6', isDark && !menuOpen ? 'bg-white' : 'bg-dark')}
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className={clsx('block h-0.5 w-6', isDark && !menuOpen ? 'bg-white' : 'bg-dark')}
                  animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-dark lg:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex flex-col h-full pt-24 px-6 pb-12">
              <div className="flex-1 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={clsx(
                        'block py-4 font-heading text-4xl font-black border-b border-white/10 transition-colors',
                        pathname === link.href ? 'text-accent-gold' : 'text-white hover:text-accent-gold'
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
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/member/community"
                  className="block w-full text-center py-4 bg-white text-dark font-heading font-black tracking-wide text-lg hover:bg-accent-gold hover:text-white transition-colors"
                >
                  Mitmachen
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
