import type { ReactNode } from 'react'

// Schwarzer Header ganz oben — überall exakt gleich (gleiche Höhe & Stil wie in
// der Musikschule). Links ein Titel, rechts optionaler Inhalt (Badges/Buttons).
export function MemberTopBar({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="bg-dark text-white px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
      <h1 className="font-heading font-bold text-lg truncate">{title}</h1>
      {right ? <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">{right}</div> : null}
    </div>
  )
}
