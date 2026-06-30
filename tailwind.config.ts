import type { Config } from 'tailwindcss'

// Farben werden über CSS-Variablen im Kanal-Format (`R G B`) definiert, damit
// dasselbe Token je nach Scope einen anderen Wert annehmen kann: hell global
// (`:root`), dunkel nur im Mitgliederbereich (`.theme-dark`, siehe globals.css
// und src/app/member/layout.tsx). Das Kanal-Format erhält die Opacity-Modifier
// (z. B. `bg-accent-gold/10`, `border-accent-gold/30`).
const withVar = (name: string) => `rgb(var(${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: withVar('--color-background'),
        surface: withVar('--color-surface'),
        'text-primary': withVar('--color-text-primary'),
        'text-secondary': withVar('--color-text-secondary'),
        'accent-gold': withVar('--color-accent-gold'),
        'accent-gold-hover': withVar('--color-accent-gold-hover'),
        'accent-warm': withVar('--color-accent-warm'),
        'accent-yellow': withVar('--color-accent-yellow'),
        'accent-silver': withVar('--color-accent-silver'),
        border: withVar('--color-border'),
        'border-dark': withVar('--color-border-dark'),
        dark: withVar('--color-dark'),
        'dark-secondary': withVar('--color-dark-secondary'),
        // Instrumentfarben (Mixer-/Kurs-Kennzeichnung) — feste Marken-Tonalitäten,
        // in beiden Scopes identisch.
        'instrument-handorgel': '#BC8C33',
        'instrument-schwyzeroergeli': '#C9C9C9',
        'instrument-bassgeige': '#787878',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'var(--font-syne)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['var(--font-heading)', 'var(--font-syne)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        body: ['var(--font-sans)', 'var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
