'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Area = 'community' | 'academy' | 'lerndatenbank' | 'streaming'

const tabs: { id: Area; label: string; emoji: string; href: string }[] = [
  { id: 'academy', label: 'Musikschule', emoji: '🎓', href: '/member/academy' },
  { id: 'lerndatenbank', label: 'Lernvideodatenbank', emoji: '🎵', href: '/member/academy/lernvideos' },
  { id: 'community', label: 'Community', emoji: '💬', href: '/member/community' },
  { id: 'streaming', label: 'Streaming', emoji: '🔊', href: '/member/streaming' },
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

function ProfileMenu() {
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
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="relative w-11 h-11 overflow-hidden rounded-full flex-shrink-0">
                <Image src={PROFILE_IMG} alt="Niklaus Hess" fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-bold text-sm truncate">Niklaus Hess</p>
                <p className="font-sans text-xs text-text-secondary truncate">niklaus@laemu.ch</p>
              </div>
            </div>
            {/* Account links */}
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
            {/* Logout */}
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
            {/* Exclusive area badge */}
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

          {/* Right: profile menu */}
          <ProfileMenu />

        </div>
      </div>
    </div>
  )
}
