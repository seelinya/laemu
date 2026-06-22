import Link from 'next/link'

// ─── Offizielle LAEMU-Kanäle ──────────────────────────────────────────────────
// Zentrale Stelle für die echten Links — hier eintragen, sobald verfügbar.
const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@laemu',
  instagram: 'https://www.instagram.com/laemu.ch',
  facebook: 'https://www.facebook.com/laemu',
  tiktok: 'https://www.tiktok.com/@laemu',
  linkedin: 'https://www.linkedin.com/company/laemu',
  whatsapp: 'https://whatsapp.com/channel/',
}

const QUICK_LINKS = [
  { label: 'Nutzungsbedingungen (AGB)', href: '/agb' },
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutzerklärung', href: '/datenschutz' },
]

type SocialIcon = { label: string; href: string; path: React.ReactNode }

const SOCIALS: SocialIcon[] = [
  {
    label: 'YouTube',
    href: SOCIAL_LINKS.youtube,
    path: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'Instagram',
    href: SOCIAL_LINKS.instagram,
    path: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: 'Facebook',
    href: SOCIAL_LINKS.facebook,
    path: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
  },
  {
    label: 'TikTok',
    href: SOCIAL_LINKS.tiktok,
    path: <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />,
  },
  {
    label: 'LinkedIn',
    href: SOCIAL_LINKS.linkedin,
    path: (
      <>
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: 'WhatsApp',
    href: SOCIAL_LINKS.whatsapp,
    path: <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />,
  },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="font-heading font-bold text-lg tracking-tight mb-2">LAEMU</p>
            <p className="font-sans text-sm text-white/50 leading-relaxed max-w-xs">
              Musikschule, Community und Lernvideodatenbank für die Schweizer Ländlermusik.
            </p>
          </div>

          {/* Quicklinks */}
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.15em] text-accent-gold mb-4">Quicklinks</p>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-sans text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.15em] text-accent-gold mb-4">Folge uns</p>
            <div className="flex flex-wrap gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center border border-white/15 text-white/70 hover:bg-accent-gold hover:border-accent-gold hover:text-white transition-colors"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-white/40">© {year} LAEMU — Ländlermusik. Alle Rechte vorbehalten.</p>
          <a href="mailto:info@laemu.ch" className="font-sans text-xs text-white/40 hover:text-white transition-colors">
            info@laemu.ch
          </a>
        </div>
      </div>
    </footer>
  )
}
