'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NotificationBell, ProfileMenu } from '@/components/MemberTabs'
import { LaemuLogo } from '@/components/LaemuLogo'
import { useUserAbo } from '@/lib/userPlan'

// ─── Mitglieder-Chrome: persistente, einklappbare Seitenleiste (Desktop) +
// mobiler Header/Drawer. Gilt für ALLE Mitglieder-Seiten (via member/layout).
// Der Seiten-Header (Titel/Breadcrumb/Aktionen) wird pro Seite via Context
// registriert, damit es nur eine konsistente Topbar gibt. ──────────────────

type Area = 'community' | 'academy' | 'lerndatenbank' | ''

export type MemberHeader = {
  title?: string
  breadcrumb?: ReactNode
  right?: ReactNode
}

const HeaderCtx = createContext<(h: MemberHeader | null) => void>(() => {})

/** Registriert den Seiten-Header in der Chrome-Topbar. `key` kapselt dynamische
 *  Werte (z. B. Zähler), damit Updates greifen. */
export function useMemberHeader(header: MemberHeader, key: string) {
  const setHeader = useContext(HeaderCtx)
  useEffect(() => {
    setHeader(header)
    return () => setHeader(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}

/** Konsistente Breadcrumb für die Topbar. Erbt die Textfarbe (dunkel auf hellem
 *  Desktop-Bar, weiss im mobilen dunklen Header). */
export function MemberBreadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  const lastIdx = items.length - 1
  const last = items[lastIdx]
  const parent = lastIdx > 0 ? items[lastIdx - 1] : null
  const hasAncestors = items.length > 2
  return (
    <>
      {/* Mobile: kompakt — Zurück-Pfeil zum übergeordneten Punkt, zu lange Pfade
          werden mit «…» abgekürzt. */}
      <nav className="flex sm:hidden items-center gap-1.5 min-w-0 font-sans text-sm">
        {parent?.href && (
          <Link href={parent.href} aria-label={`Zurück zu ${parent.label}`} className="flex items-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </Link>
        )}
        {hasAncestors && <span className="opacity-40 flex-shrink-0">…</span>}
        <span className="font-semibold truncate">{last.label}</span>
      </nav>
      {/* Desktop/Tablet: vollständige Breadcrumb */}
      <nav className="hidden sm:flex items-center gap-2 min-w-0 font-sans text-sm">
        {items.map((it, i) => {
          const isLast = i === items.length - 1
          return (
            <span key={i} className="flex items-center gap-2 min-w-0">
              {it.href && !isLast ? (
                <Link href={it.href} className="flex items-center gap-1.5 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  {i === 0 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>}
                  {it.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-semibold truncate' : 'opacity-60 flex-shrink-0'}>{it.label}</span>
              )}
              {!isLast && <span className="opacity-30 flex-shrink-0">/</span>}
            </span>
          )
        })}
      </nav>
    </>
  )
}

function IconAcademy() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>
}
function IconNote() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
}
function IconChat() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
}
function IconUser() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}
function IconLogout() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
}

const NAV: { id: Area; label: string; href: string; icon: ReactNode }[] = [
  { id: 'academy', label: 'Musikschule', href: '/member/academy', icon: <IconAcademy /> },
  { id: 'lerndatenbank', label: 'Stücke', href: '/member/academy/lernvideos', icon: <IconNote /> },
  { id: 'community', label: 'Community', href: '/member/community', icon: <IconChat /> },
]

export function MemberChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || ''
  const abo = useUserAbo()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [header, setHeader] = useState<MemberHeader | null>(null)

  useEffect(() => {
    try { setCollapsed(window.localStorage.getItem('laemu-sidebar-collapsed') === '1') } catch {}
  }, [])
  const toggleCollapsed = () =>
    setCollapsed((c) => {
      const n = !c
      try { window.localStorage.setItem('laemu-sidebar-collapsed', n ? '1' : '0') } catch {}
      return n
    })

  const active: Area = pathname.startsWith('/member/community')
    ? 'community'
    : pathname.includes('/academy/lernvideos')
      ? 'lerndatenbank'
      : pathname.includes('/member/academy')
        ? 'academy'
        : ''

  const visibleNav = NAV.filter((n) => !(n.id === 'academy' && abo.plan === 'lernvideo'))
  const isDisabled = (id: Area) => id === 'community' && abo.plan === 'none'

  const navRow = (n: (typeof NAV)[number], opts?: { collapsed?: boolean; onClick?: () => void }) => {
    const isActive = active === n.id
    const base = 'flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm transition-colors'
    if (isDisabled(n.id)) {
      return (
        <span key={n.id} aria-disabled="true" title="Mit einem kostenpflichtigen Abo verfügbar"
          className={`${base} text-white/30 cursor-not-allowed ${opts?.collapsed ? 'justify-center' : ''}`}>
          <span className="flex-shrink-0">{n.icon}</span>
          {!opts?.collapsed && n.label}
        </span>
      )
    }
    return (
      <Link key={n.id} href={n.href} onClick={opts?.onClick} title={opts?.collapsed ? n.label : undefined}
        className={`${base} ${opts?.collapsed ? 'justify-center' : ''} ${isActive ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
        <span className={`flex-shrink-0 ${isActive ? 'text-accent-gold' : ''}`}>{n.icon}</span>
        {!opts?.collapsed && n.label}
      </Link>
    )
  }

  const bottomLinks = (collapsedView: boolean, onClick?: () => void) => (
    <div className="space-y-1">
      {!collapsedView && <p className="px-3 pb-1 font-sans text-[10px] uppercase tracking-widest text-white/35">Links</p>}
      <Link href="/member/account?tab=konto" onClick={onClick} title={collapsedView ? 'Konto verwalten' : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors ${collapsedView ? 'justify-center' : ''}`}>
        <span className="flex-shrink-0"><IconUser /></span>{!collapsedView && 'Konto verwalten'}
      </Link>
      <Link href="/login" onClick={onClick} title={collapsedView ? 'Abmelden' : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors ${collapsedView ? 'justify-center' : ''}`}>
        <span className="flex-shrink-0"><IconLogout /></span>{!collapsedView && 'Abmelden'}
      </Link>
    </div>
  )

  return (
    <HeaderCtx.Provider value={setHeader}>
      <div className="min-h-screen bg-background lg:flex">
        {/* ── Desktop-Seitenleiste (persistent, einklappbar) ── */}
        <aside className={`hidden lg:flex lg:flex-col lg:shrink-0 bg-nav-dark text-text-on-dark lg:sticky lg:top-0 lg:h-screen transition-[width] duration-200 ${collapsed ? 'lg:w-[76px]' : 'lg:w-64'}`}>
          <div className={`flex items-center h-16 border-b border-white/10 ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
            {!collapsed && <Link href="/member/academy" aria-label="LAEMU — zur Musikschule" className="text-white"><LaemuLogo className="h-6 w-auto" /></Link>}
            <button onClick={toggleCollapsed} aria-label={collapsed ? 'Menü ausklappen' : 'Menü einklappen'}
              className="w-8 h-8 rounded-full bg-accent-gold text-white flex items-center justify-center hover:bg-accent-gold-hover transition-colors flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}><polyline points="15 18 9 12 15 6" /></svg>
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {visibleNav.map((n) => navRow(n, { collapsed }))}
          </nav>
          <div className="px-3 py-4 border-t border-white/10">{bottomLinks(collapsed)}</div>
        </aside>

        {/* ── Hauptspalte ── */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Mobile-Header — kompakt, einzeilig: links der Standort (Breadcrumb/
              Titel), in der Mitte das LAEMU-Logo, rechts Benachrichtigung und
              Burger-Menü. Die beiden Seitenzonen sind gleich breit (flex-1),
              damit das Logo mittig bleibt. */}
          <header className="lg:hidden sticky top-0 z-30 bg-nav-dark text-text-on-dark">
            <div className="flex items-center gap-2 h-12 px-4">
              {/* Links: Standort-Label */}
              <div className="min-w-0 flex-1 flex items-center text-white">
                {header?.breadcrumb ? header.breadcrumb : header?.title ? <h1 className="font-heading font-bold text-sm text-white truncate">{header.title}</h1> : null}
              </div>
              {/* Mitte: Logo */}
              <Link href="/member/academy" aria-label="LAEMU — zur Musikschule" className="text-white flex-shrink-0">
                <LaemuLogo className="h-5 w-auto" />
              </Link>
              {/* Rechts: Aktionen */}
              <div className="min-w-0 flex-1 flex items-center justify-end gap-0.5">
                {header?.right}
                <NotificationBell className="text-white hover:text-accent-gold" />
                <button onClick={() => setDrawerOpen(true)} aria-label="Menü öffnen" className="p-2 -mr-2 text-white hover:text-accent-gold transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                </button>
              </div>
            </div>
          </header>

          {/* Desktop-Topbar */}
          <header className="hidden lg:flex sticky top-0 z-20 bg-surface border-b border-border h-16 items-center justify-between gap-4 px-6">
            <div className="min-w-0 flex-1">
              {header?.breadcrumb ? header.breadcrumb : header?.title ? <h1 className="font-heading font-bold text-lg truncate">{header.title}</h1> : null}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {header?.right}
              <NotificationBell />
              <ProfileMenu />
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>

        {/* ── Mobile-Drawer ── */}
        {drawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-nav-dark text-text-on-dark flex flex-col shadow-xl">
              <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
                <span className="text-white"><LaemuLogo className="h-6 w-auto" /></span>
                <button onClick={() => setDrawerOpen(false)} aria-label="Menü schliessen" className="p-2 -mr-2 text-white/80 hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {visibleNav.map((n) => navRow(n, { onClick: () => setDrawerOpen(false) }))}
              </nav>
              <div className="px-3 py-4 border-t border-white/10">{bottomLinks(false, () => setDrawerOpen(false))}</div>
            </div>
          </div>
        )}
      </div>
    </HeaderCtx.Provider>
  )
}
