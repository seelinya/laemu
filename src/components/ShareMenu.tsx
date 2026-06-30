'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Wiederverwendbarer Teilen-Button ──────────────────────────────────────────
// Nutzt auf Mobilgeräten das native Teilen-Sheet (navigator.share → WhatsApp,
// Nachrichten, Instagram, AirDrop …). Fällt sonst auf ein kleines Menü zurück
// (Link kopieren, WhatsApp, Nachrichten, E-Mail).

type ShareMenuProps = {
  title?: string
  text?: string
  /** Wenn leer: aktuelle Seiten-URL. */
  url?: string
  className?: string
  children?: ReactNode
  align?: 'left' | 'right'
}

function currentUrl(url?: string): string {
  if (url) return url
  if (typeof window !== 'undefined') return window.location.href
  return ''
}

function IconLink() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
}
function IconWhatsApp() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.115zm5.464-6.875c-.075-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" /></svg>
}
function IconMessage() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
}
function IconMail() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
}

export function ShareMenu({ title = 'LAEMU', text = '', url, className, children, align = 'right' }: ShareMenuProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const shareUrl = currentUrl(url)
    const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }) : undefined
    if (nav && typeof nav.share === 'function') {
      try {
        await nav.share({ title, text, url: shareUrl })
        return
      } catch {
        /* abgebrochen oder nicht unterstützt → Fallback-Menü */
      }
    }
    setOpen((o) => !o)
  }

  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const shareUrl = currentUrl(url)
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      /* ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setOpen(false)
  }

  const shareUrl = currentUrl(url)
  const enc = encodeURIComponent
  const body = `${text ? text + ' ' : ''}${shareUrl}`
  const waHref = `https://wa.me/?text=${enc(body)}`
  const smsHref = `sms:?&body=${enc(body)}`
  const mailHref = `mailto:?subject=${enc(title)}&body=${enc(`${text ? text + '\n' : ''}${shareUrl}`)}`

  const linkClass = 'w-full text-left px-4 py-2.5 font-sans text-sm hover:bg-background transition-colors flex items-center gap-3 text-text-secondary hover:text-text-primary'

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleClick} className={className} aria-label="Teilen">
        {children}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1 bg-surface border border-border shadow-xl z-50 min-w-[190px] overflow-hidden`}
          >
            <button onClick={copyLink} className={linkClass}>
              <span className="text-accent-gold flex-shrink-0"><IconLink /></span>
              {copied ? 'Link kopiert ✓' : 'Link kopieren'}
            </button>
            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className={linkClass}>
              <span className="text-accent-gold flex-shrink-0"><IconWhatsApp /></span>
              WhatsApp
            </a>
            <a href={smsHref} onClick={() => setOpen(false)} className={linkClass}>
              <span className="text-accent-gold flex-shrink-0"><IconMessage /></span>
              Nachrichten
            </a>
            <a href={mailHref} onClick={() => setOpen(false)} className={linkClass}>
              <span className="text-accent-gold flex-shrink-0"><IconMail /></span>
              E-Mail
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
