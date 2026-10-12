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
        'nav-dark': '#333333',           // Dunkelgrau — obere/seitliche Navigation
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
        // Radona Norm ist die Markenschrift (lokal via @font-face); Fallback Open Sans.
        heading: ['var(--font-heading)', 'var(--font-opensans)', 'Open Sans', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'var(--font-opensans)', 'Open Sans', 'system-ui', 'sans-serif'],
        body: ['var(--font-sans)', 'var(--font-opensans)', 'Open Sans', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      // Weiche, freundliche Schatten (Design-Angleichung) — dezente Tiefe für
      // Karten, Panels und Modals auf hellem Grund.
      boxShadow: {
        soft: '0 1px 2px rgba(17, 17, 17, 0.04), 0 2px 8px rgba(17, 17, 17, 0.06)',
        card: '0 2px 10px rgba(17, 17, 17, 0.06), 0 10px 30px rgba(17, 17, 17, 0.07)',
        'soft-lg': '0 4px 16px rgba(17, 17, 17, 0.08), 0 16px 40px rgba(17, 17, 17, 0.08)',
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
