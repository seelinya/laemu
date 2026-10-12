'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { NotificationBell, ProfileMenu } from '@/components/MemberTabs'
import { useUserAbo } from '@/lib/userPlan'

// Bereichs-Navigation der Musikschule. Auf Desktop als linke Seitenleiste, auf
// Mobile als Drawer (Hamburger). Dunkelgrau statt Schwarz (Brand Guidelines).

type Area = 'community' | 'academy' | 'lerndatenbank'

function IconAcademy() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>
  )
}
function IconNote() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
  )
}
function IconChat() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
  )
}

const NAV: { id: Area; label: string; href: string; icon: ReactNode }[] = [
  { id: 'academy', label: 'Musikschule', href: '/member/academy', icon: <IconAcademy /> },
  { id: 'lerndatenbank', label: 'Stücke', href: '/member/academy/lernvideos', icon: <IconNote /> },
  { id: 'community', label: 'Community', href: '/member/community', icon: <IconChat /> },
]

export function MemberShell({
  active,
  title,
  right,
  children,
}: {
  active: Area
  title?: string
  right?: ReactNode
  children: ReactNode
}) {
  const abo = useUserAbo()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Lernvideo-only sieht keine Musikschule; Free-Account hat Community gesperrt.
  const visibleNav = NAV.filter((n) => !(n.id === 'academy' && abo.plan === 'lernvideo'))
  const isDisabled = (id: Area) => id === 'community' && abo.plan === 'none'

  const navRow = (n: (typeof NAV)[number], onClick?: () => void) => {
    const activeCls = active === n.id
      ? 'bg-white/10 text-white'
      : 'text-white/70 hover:bg-white/5 hover:text-white'
    if (isDisabled(n.id)) {
      return (
        <span
          key={n.id}
          aria-disabled="true"
          title="Mit einem kostenpflichtigen Abo verfügbar"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm text-white/30 cursor-not-allowed"
        >
          <span className="flex-shrink-0">{n.icon}</span>
          {n.label}
        </span>
      )
    }
    return (
      <Link
        key={n.id}
        href={n.href}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm transition-colors ${activeCls}`}
      >
        <span className={`flex-shrink-0 ${active === n.id ? 'text-accent-gold' : ''}`}>{n.icon}</span>
        {n.label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* ── Desktop-Seitenleiste ── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-nav-dark text-text-on-dark lg:sticky lg:top-0 lg:h-screen">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/member/academy" className="font-heading text-2xl font-bold tracking-tight text-white">LAEMU</Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleNav.map((n) => navRow(n))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <p className="px-3 pb-1 font-sans text-[10px] uppercase tracking-widest text-white/35">Links</p>
          <Link href="/member/account?tab=konto" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            Konto verwalten
          </Link>
          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Abmelden
          </Link>
        </div>
      </aside>

      {/* ── Hauptspalte ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile-Header (dunkelgrau): Hamburger + Logo + Benachrichtigungen/Profil */}
        <header className="lg:hidden sticky top-0 z-30 bg-nav-dark text-text-on-dark">
          <div className="flex items-center justify-between gap-2 h-14 px-4">
            <button onClick={() => setMobileOpen(true)} aria-label="Menü öffnen" className="p-2 -ml-2 text-white/80 hover:text-white transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <Link href="/member/academy" className="font-heading text-xl font-bold tracking-tight text-white">LAEMU</Link>
            <div className="flex items-center gap-0.5">
              <NotificationBell />
              <ProfileMenu />
            </div>
          </div>
          {(title || right) && (
            <div className="flex items-center justify-between gap-3 px-4 pb-3">
              {title ? <h1 className="font-heading font-bold text-base text-white truncate">{title}</h1> : <span />}
              {right ? <div className="flex items-center gap-1.5 flex-shrink-0">{right}</div> : null}
            </div>
          )}
        </header>

        {/* Desktop-Topbar: Titel links, Aktionen + Benachrichtigungen/Profil rechts */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-surface border-b border-border h-16 items-center justify-between gap-4 px-6">
          {title ? <h1 className="font-heading font-bold text-lg truncate">{title}</h1> : <span />}
          <div className="flex items-center gap-2 flex-shrink-0">
            {right}
            <NotificationBell />
            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {/* ── Mobile-Drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-nav-dark text-text-on-dark flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span className="font-heading text-xl font-bold tracking-tight text-white">LAEMU</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Menü schliessen" className="p-2 -mr-2 text-white/80 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {visibleNav.map((n) => navRow(n, () => setMobileOpen(false)))}
            </nav>
            <div className="px-3 py-4 border-t border-white/10 space-y-1">
              <Link href="/member/account?tab=konto" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                Konto verwalten
              </Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                Abmelden
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
