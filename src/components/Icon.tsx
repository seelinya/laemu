// ─── Material Symbols Icon (Design System Kap. 11) ────────────────────────────
// Einheitlicher Icon-Helfer auf Basis der Material Symbols (Outlined). Ersetzt
// die früheren Inline-SVGs. Grösse über `size` (px), Farbe erbt via
// `currentColor` aus der Textfarbe (z. B. text-text-secondary / text-accent-gold).
import { clsx } from 'clsx'

export function Icon({
  name,
  size = 20,
  fill = false,
  weight = 400,
  className,
  style,
}: {
  name: string
  size?: number
  fill?: boolean
  weight?: 300 | 400
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className={clsx('material-symbols-outlined select-none leading-none', className)}
      aria-hidden="true"
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'opsz' ${size}`,
        ...style,
      }}
    >
      {name}
    </span>
  )
}
