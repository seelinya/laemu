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
        background: '#F0F0F0',
        surface: '#FFFFFF',
        'text-primary': '#0A0A0A',
        'text-secondary': '#5A5A5A',
        'accent-gold': '#C4973A',
        'accent-warm': '#D4A84B',
        'accent-yellow': '#EDD84B',
        border: '#DCDCDC',
        'border-dark': '#B0B0B0',
        dark: '#0A0A0A',
        'dark-secondary': '#1A1A1A',
      },
      fontFamily: {
        heading: ['var(--font-syne)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['var(--font-syne)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
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
