import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── LAEMU Brand-Palette (Light Mode) ──────────────────────────────
        // Werte 1:1 aus dem finalisierten Design System / den Brand Guidelines.
        background: '#EFEFEF',           // Silbergrau — Seitenhintergrund
        surface: '#FFFFFF',              // Bühnenweiss — Karten, Panels, Modals
        'surface-muted': '#F7F7F7',      // sekundäre Flächen, Listenzeilen
        'nav-dark': '#000000',           // Klangschwarz — obere Navigationsleiste
        'text-primary': '#000000',       // Klangschwarz — Headlines, Fliesstext
        'text-secondary': '#505050',     // Steingrau — Labels, Metadaten
        'text-on-dark': '#FFFFFF',       // Text/Icons auf nav-dark
        'text-on-dark-secondary': 'rgba(239,239,239,0.7)', // inaktive Tabs auf dunkel
        'text-on-gold': '#000000',       // Text/Icons auf Gold (Kontrast-Pflicht)
        border: '#E0E0E0',               // Standard-Rahmen auf hellem Grund
        'border-dark': '#505050',        // Steingrau — betonte Rahmen, Hover
        'accent-gold': '#BC8C33',        // Klanggold — einzige Markenfarbe
        'accent-gold-hover': '#A57726',  // Gold-Hover (dunkler, für Kontrast auf Weiss)
        'accent-silver': '#C9C9C9',      // Silbergrau-Akzent (Schwyzerörgeli)
        'status-success': '#2E7D32',     // funktional — „Abgeschlossen"
        // dark === nav-dark; als Alias erhalten für bestehende Nutzung.
        dark: '#000000',
      },
      fontFamily: {
        // Radona Norm ist lizenziert (kein Google Font) → lokal via @font-face
        // einbinden; bis dahin greift der Fallback-Stack (FOUT-/Performance-sicher).
        heading: ['var(--font-heading)', 'var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        body: ['var(--font-sans)', 'var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
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
