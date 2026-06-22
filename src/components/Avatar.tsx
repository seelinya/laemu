'use client'

import Image from 'next/image'
import { initialsFromName } from '@/lib/userProfile'

// Profilbild-Vorschau: zeigt das hochgeladene Bild — oder, solange keines
// hinterlegt ist, einen Initialen-Platzhalter (statt eines fremden Stockfotos).
export function Avatar({
  src,
  name,
  className = '',
  textClassName = 'text-sm',
}: {
  src?: string
  name: string
  className?: string
  textClassName?: string
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-full flex-shrink-0 ${className}`}>
        <Image src={src} alt={name} fill className="object-cover" unoptimized />
      </div>
    )
  }
  return (
    <div
      className={`rounded-full flex-shrink-0 bg-accent-gold/15 text-accent-gold flex items-center justify-center font-heading font-bold ${textClassName} ${className}`}
      aria-label={name}
    >
      {initialsFromName(name)}
    </div>
  )
}
