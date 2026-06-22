// Instrument-treue Kurs-Cover: ein Verlauf je Instrument mit grossem Emoji.
// Ersetzt unpassende/zerbrochene Stockfotos (z. B. Gitarre für Schwyzerörgeli)
// durch eine konsistente, eindeutig zugeordnete Darstellung.

const COVER_GRADIENTS: Record<string, string> = {
  handorgel: 'linear-gradient(135deg, #1f1a12 0%, #6b4e1f 55%, #C4973A 100%)',
  schwyzer: 'linear-gradient(135deg, #18211c 0%, #3f4d3a 50%, #8a7a3c 100%)',
  allgemein: 'linear-gradient(135deg, #1d1d20 0%, #3a3a40 60%, #5b5b62 100%)',
  default: 'linear-gradient(135deg, #232323 0%, #4a4a4a 100%)',
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
  const emojiSize = size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-5xl' : 'text-4xl'
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: COVER_GRADIENTS[variant] ?? COVER_GRADIENTS.default }}
    >
      {/* dezenter Notenschlüssel-Schimmer im Hintergrund */}
      <span className="absolute -right-2 -bottom-3 text-6xl opacity-10 select-none">♪</span>
      <span className={`${emojiSize} drop-shadow-lg select-none`}>{emoji}</span>
    </div>
  )
}
