'use client'

import Link from 'next/link'

type Area = 'community' | 'academy' | 'lerndatenbank' | 'streaming'

const tabs: { id: Area; label: string; emoji: string; href: string }[] = [
  { id: 'community', label: 'Community', emoji: '💬', href: '/member/community' },
  { id: 'academy', label: 'Musikschule', emoji: '🎓', href: '/member/academy' },
  { id: 'lerndatenbank', label: 'Lernvideodatenbank', emoji: '🎵', href: '/member/academy/lernvideos' },
  { id: 'streaming', label: 'Streaming', emoji: '🔊', href: '/member/streaming' },
]

export function MemberTabs({ active }: { active: Area }) {
  return (
    <div className="bg-surface border-b border-border" style={{ borderTop: '2px solid rgba(196,151,58,0.25)' }}>
      <div className="max-w-7xl mx-auto px-4">
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

          {/* Right: logout */}
          <div className="ml-auto flex items-center gap-4 py-4 flex-shrink-0">
            <div className="h-4 w-px bg-border" />
            <Link
              href="/login"
              className="flex items-center gap-1.5 font-sans text-xs text-text-secondary hover:text-dark transition-colors whitespace-nowrap"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Abmelden
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
