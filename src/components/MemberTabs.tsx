'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Area = 'community' | 'academy' | 'lerndatenbank'

const tabs: { id: Area; label: string; emoji: string; href: string }[] = [
  { id: 'academy', label: 'Musikschule', emoji: '🎓', href: '/member/academy' },
  { id: 'lerndatenbank', label: 'Lernvideodatenbank', emoji: '🎵', href: '/member/academy/lernvideos' },
  { id: 'community', label: 'Community', emoji: '💬', href: '/member/community' },
]

const accountLinks = [
  { label: 'Konto & Daten', href: '/member/account?tab=konto' },
  { label: 'Mein Profil', href: '/member/profile' },
  { label: 'Meine Beiträge', href: '/member/account?tab=beitraege' },
  { label: 'Mein Abo', href: '/member/account?tab=abo' },
  { label: 'Rechnungen & Zahlungen', href: '/member/account?tab=rechnungen' },
  { label: 'Zahlungsmittel', href: '/member/account?tab=zahlungsmittel' },
  { label: 'Geräte', href: '/member/account?tab=geraete' },
]

const PROFILE_IMG = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'

type Notification = {
  id: string
  kind: 'reply' | 'feedback'
  title: string
  text: string
  time: string
  href: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: 'n1', kind: 'reply',
    title: 'Antwort auf deinen Kommentar',
    text: 'Cécile Schmidig (LAEMU Team) hat auf deinen Kommentar zu «Dr Alperose» geantwortet.',
    time: 'vor 2 Std.', href: '/member/academy/instrument/handorgel/kurs/grundlagen/modul/erste-schritte?lektion=koordination', read: false,
  },
  {
    id: 'n2', kind: 'feedback',
    title: 'Feedback vom LAEMU Team',
    text: 'Du hast eine persönliche Antwort auf deine Anfrage vom LAEMU Team erhalten.',
    time: 'gestern', href: '/member/account?tab=konto', read: false,
  },
  {
    id: 'n3', kind: 'reply',
    title: 'Antwort auf deinen Kommentar',
    text: 'Hansruedi Wenger (Lehrer) hat auf deine Frage im Grundlagenkurs geantwortet.',
    time: 'vor 3 Tagen', href: '/member/academy/instrument/handorgel/kurs/grundlagen', read: true,
  },
]

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notification[]>(initialNotifications)
  const unread = items.filter((n) => !n.read).length

  const openMenu = () => {
    setOpen((o) => !o)
  }
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })))

  return (
    <div className="relative flex-shrink-0">
      <button onClick={openMenu} className="relative p-2 text-text-secondary hover:text-dark transition-colors" aria-label="Benachrichtigungen">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-1 bg-accent-gold text-white text-[9px] font-sans font-bold rounded-full flex items-center justify-center">{unread}</span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-80 max-w-[calc(100vw-2rem)] bg-surface border border-border shadow-xl z-50">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <p className="font-heading font-bold text-sm">Benachrichtigungen</p>
              {unread > 0 && (
                <button onClick={markAllRead} className="font-sans text-xs text-accent-gold hover:text-dark transition-colors">Alle gelesen</button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="font-sans text-sm text-text-secondary text-center py-8">Keine Benachrichtigungen.</p>
              ) : (
                items.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => { setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))); setOpen(false) }}
                    className={`flex gap-3 px-3 py-3 border-b border-border last:border-0 transition-colors hover:bg-background ${n.read ? '' : 'bg-accent-gold/5'}`}
                  >
                    <span className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${n.kind === 'feedback' ? 'bg-accent-gold/15 text-accent-gold' : 'bg-dark/5 text-dark'}`}>
                      {n.kind === 'feedback' ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-sans text-xs font-semibold">{n.title}</p>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0" />}
                      </div>
                      <p className="font-sans text-xs text-text-secondary leading-snug mt-0.5">{n.text}</p>
                      <p className="font-sans text-[10px] text-text-secondary mt-1">{n.time}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function ProfileMenu() {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative flex-shrink-0">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2.5 py-2 group">
        <div className="hidden sm:block text-right leading-tight">
          <p className="font-heading font-bold text-sm text-dark">Niklaus Hess</p>
          <p className="font-sans text-[11px] text-accent-gold">Starter Mitglied</p>
        </div>
        <div className="relative w-9 h-9 overflow-hidden rounded-full border border-border flex-shrink-0">
          <Image src={PROFILE_IMG} alt="Niklaus Hess" fill className="object-cover" unoptimized />
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-64 bg-surface border border-border shadow-xl z-50">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="relative w-11 h-11 overflow-hidden rounded-full flex-shrink-0">
                <Image src={PROFILE_IMG} alt="Niklaus Hess" fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-bold text-sm truncate">Niklaus Hess</p>
                <p className="font-sans text-xs text-text-secondary truncate">niklaus@laemu.ch</p>
              </div>
            </div>
            <div className="py-1">
              {accountLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 font-sans text-sm text-text-secondary hover:bg-background hover:text-dark transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-border py-1">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 font-sans text-sm text-text-secondary hover:bg-background hover:text-dark transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                Abmelden
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function MemberTabs({ active }: { active: Area }) {
  return (
    <div className="bg-surface border-b border-border" style={{ borderTop: '2px solid rgba(196,151,58,0.25)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center overflow-x-auto">
            <div className="flex items-center gap-1.5 pr-5 border-r border-border flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-accent-gold flex-shrink-0">
                <path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z" />
              </svg>
              <span className="font-sans text-xs font-semibold text-accent-gold whitespace-nowrap">Mitgliederbereich</span>
            </div>

            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center gap-2 px-5 py-4 font-sans text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active === tab.id
                    ? 'border-accent-gold text-dark'
                    : 'border-transparent text-text-secondary hover:text-dark'
                }`}
              >
                <span>{tab.emoji}</span> {tab.label}
              </Link>
            ))}
          </div>

          {/* Right: notifications + profile */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <NotificationBell />
            <ProfileMenu />
          </div>

        </div>
      </div>
    </div>
  )
}
