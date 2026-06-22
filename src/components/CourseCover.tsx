// Platzhalter-Cover für Kurse: ein neutrales Medien-Platzhalterbild mit
// Video-Play-Hinweis. Echte Bilder/Videos werden später ergänzt; das Instrument
// bleibt über ein kleines Emoji-Badge erkennbar.

const COVER_GRADIENTS: Record<string, string> = {
  handorgel: 'linear-gradient(135deg, #2a2622 0%, #3c352a 100%)',
  schwyzer: 'linear-gradient(135deg, #232722 0%, #343a30 100%)',
  allgemein: 'linear-gradient(135deg, #232326 0%, #3a3a40 100%)',
  default: 'linear-gradient(135deg, #232323 0%, #3a3a3a 100%)',
}

export function CourseCover({
  emoji,
  variant = 'default',
  size = 'md',
  className = '',
}: {
  emoji: string
  variant?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const play = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
  const playIcon = size === 'sm' ? 12 : size === 'lg' ? 22 : 16
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: COVER_GRADIENTS[variant] ?? COVER_GRADIENTS.default }}
      aria-label="Platzhalter"
    >
      {/* Platzhalter-Bild-Symbol (Foto-Icon) im Hintergrund */}
      <svg className="absolute inset-0 w-full h-full text-white/[0.06]" viewBox="0 0 100 60" fill="none" preserveAspectRatio="xMidYMid slice">
        <rect x="14" y="12" width="72" height="40" rx="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="26" r="5" fill="currentColor" />
        <path d="M22 50l20-18 14 12 10-8 14 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* Video-Play-Platzhalter */}
      <span className={`relative ${play} rounded-full bg-white/12 backdrop-blur-sm flex items-center justify-center`}>
        <svg width={playIcon} height={playIcon} viewBox="0 0 24 24" fill="white" className="ml-0.5"><polygon points="6 4 20 12 6 20 6 4" /></svg>
      </span>
      {/* Instrument-Emoji als kleines Badge */}
      <span className="absolute bottom-1.5 left-1.5 text-base leading-none select-none drop-shadow">{emoji}</span>
    </div>
  )
}
