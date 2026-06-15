import Link from 'next/link'
import type { ReactNode } from 'react'

type LegalSection = {
  heading: string
  body: ReactNode
}

export function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string
  intro: string
  updated: string
  sections: LegalSection[]
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-dark py-5 px-6 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-white text-lg tracking-tight">LAEMU</Link>
        <Link href="/register" className="font-sans text-xs text-white/50 hover:text-white transition-colors">
          ← Zurück zur Registrierung
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-heading text-3xl font-bold mb-2">{title}</h1>
        <p className="font-sans text-xs text-text-secondary mb-8">Zuletzt aktualisiert: {updated}</p>

        <p className="font-sans text-sm text-text-secondary leading-relaxed mb-10">{intro}</p>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-heading text-lg font-bold mb-2">
                <span className="text-accent-gold tabular-nums">{i + 1}.</span> {s.heading}
              </h2>
              <div className="font-sans text-sm text-text-secondary leading-relaxed space-y-2">{s.body}</div>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <p className="font-sans text-xs text-text-secondary leading-relaxed">
            Dies ist eine vereinfachte, informative Zusammenfassung für die LAEMU-Plattform und ersetzt keine
            individuelle Rechtsberatung. Bei Fragen erreichst du uns unter{' '}
            <a href="mailto:hallo@laemu.ch" className="text-accent-gold hover:underline">hallo@laemu.ch</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
