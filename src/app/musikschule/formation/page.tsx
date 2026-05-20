'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const benefits = [
  {
    emoji: '🎓',
    title: 'Günstiges Musikschul-Abo',
    desc: 'Alle Mitglieder lernen mit einem vorteilhaften Jahresabo gemeinsam. Egal ob zu dritt oder viert.',
  },
  {
    emoji: '🌐',
    title: 'Professionelle Präsenz',
    desc: 'Einfach und ohne grossen Aufwand: Formation-Profil, Auftrittskalender, Medienarchiv.',
  },
  {
    emoji: '🤝',
    title: 'Wertvolle Kontakte',
    desc: 'Vernetzung mit anderen Formationen, Veranstaltern, Instrumentenbauern und der gesamten Szene.',
  },
  {
    emoji: '🏆',
    title: 'LAEMU Membership für alle',
    desc: 'Alle Mitglieder erhalten automatisch die LAEMU Membership inklusive Community-Zugang.',
  },
]

const howItWorksSteps = [
  {
    num: '01',
    title: 'Formation registrieren',
    desc: 'Registriere deine Formation kostenlos auf LAEMU. Kein Abo nötig.',
  },
  {
    num: '02',
    title: 'Abo wählen',
    desc: 'Wähle das passende Musikschul-Abo für eure Formation und schliesse es ab.',
  },
  {
    num: '03',
    title: 'Gemeinsam loslegen',
    desc: 'Alle Formationsmitglieder erhalten sofortigen Zugang zu allen gebuchten Inhalten und zur LAEMU Membership.',
  },
]

const faqs = [
  {
    q: 'Wie viele Mitglieder kann eine Formation haben?',
    a: 'Formations-Abos gelten für Formationen bis zu 6 Mitglieder. Egal ob Trio, Quartett, Quintett oder Sextett.',
  },
  {
    q: 'Was passiert, wenn ein Mitglied die Formation verlässt?',
    a: 'Das Abo läuft weiter für die übrigen Mitglieder. Neue Mitglieder können jederzeit hinzugefügt werden.',
  },
  {
    q: 'Muss die Formation bereits bei LAEMU registriert sein?',
    a: 'Nein, du kannst dich beim Kauf gleichzeitig registrieren. Wir helfen dir beim Onboarding.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-dark pt-24 pb-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Section>
            <motion.div variants={fadeUp} className="mb-8">
              <Link
                href="/musikschule"
                className="font-sans text-sm text-white/50 hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                ← Zur Musikschule
              </Link>
            </motion.div>
            <motion.span variants={fadeUp} className="font-sans text-xs text-accent-gold uppercase tracking-widest mb-4 block">
              Für Formationen
            </motion.span>
            <motion.h1 variants={fadeUp} className="font-heading text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              LAEMU Musikschule für Formationen
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans text-white/60 text-lg leading-relaxed max-w-2xl">
              Egal ob Trio, Quartett oder Kapelle — mit einem einzigen Abo lernen alle Mitglieder zusammen. Dazu Präsenz, Netzwerk und die Gemeinschaft von LAEMU.
            </motion.p>
          </Section>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Vorteile</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">
              Alle Vorteile auf einen Blick
            </motion.h2>
          </Section>

          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeUp}
                className="bg-surface border border-border p-6 hover:border-accent-gold transition-colors group"
              >
                <span className="text-3xl block mb-4">{benefit.emoji}</span>
                <h3 className="font-heading font-bold text-base mb-2 group-hover:text-accent-gold transition-colors">
                  {benefit.title}
                </h3>
                <p className="font-sans text-sm text-text-secondary leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── FORMATION PLANS ── */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Angebote</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">
              Musikschul-Angebote für Formationen
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-xl mx-auto">
              Beide Angebote gelten für die gesamte Formation — egal ob ihr zu dritt oder zu viert seid.
            </motion.p>
          </Section>

          <Section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Pro All-in-One */}
            <motion.div
              variants={fadeUp}
              className="relative bg-dark border-2 border-accent-gold p-8 flex flex-col"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-gold text-white text-xs px-4 py-1 font-sans font-medium whitespace-nowrap">
                Für Aufsteiger
              </div>
              <p className="text-3xl mb-3">🏆</p>
              <h3 className="font-heading text-xl font-bold text-white mb-1">Pro All-in-One</h3>
              <p className="font-sans text-xs text-white/50 mb-5">Für die gesamte Formation</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {[
                  'Pro-Lehrgang für alle Mitglieder',
                  'Alle 4 Instrumente inklusive',
                  'Vollständige Lernvideo-Datenbank',
                  'Monatliche Live-Calls & Video-Feedback',
                  'LAEMU Membership für alle',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 font-sans text-xs text-white/80">
                    <span className="text-accent-gold flex-shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <div className="mb-6">
                <span className="font-heading text-4xl font-bold text-accent-gold">CHF 2&apos;499</span>
                <span className="font-sans text-sm text-white/50 ml-1">/Jahr</span>
              </div>
              <Link
                href="/musikschule"
                className="w-full py-3 bg-accent-gold text-white font-sans text-sm font-medium hover:bg-accent-gold/90 transition-colors text-center block"
              >
                Formation anmelden
              </Link>
            </motion.div>

            {/* Lernvideodatenbank */}
            <motion.div
              variants={fadeUp}
              className="relative bg-background border border-border p-8 flex flex-col hover:border-accent-gold transition-colors"
            >
              <p className="text-3xl mb-3">📹</p>
              <h3 className="font-heading text-xl font-bold mb-1">Lernvideodatenbank</h3>
              <p className="font-sans text-xs text-text-secondary mb-5">Für die gesamte Formation</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {[
                  'Lernvideo-Datenbank für alle Mitglieder',
                  'Alle Instrumente inklusive',
                  'Ständig wachsendes Angebot',
                  'LAEMU Membership für alle',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 font-sans text-xs text-text-secondary">
                    <span className="text-accent-gold flex-shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <div className="mb-6">
                <span className="font-heading text-4xl font-bold">CHF 1&apos;999</span>
                <span className="font-sans text-sm text-text-secondary ml-1">/Jahr</span>
              </div>
              <Link
                href="/musikschule"
                className="w-full py-3 border border-dark text-dark font-sans text-sm font-medium hover:bg-dark hover:text-white transition-colors text-center block"
              >
                Formation anmelden
              </Link>
            </motion.div>
          </Section>

          <Section>
            <motion.p variants={fadeUp} className="text-center font-sans text-xs text-text-secondary mt-6 max-w-lg mx-auto">
              Rabatt-Codes können nicht auf Formations-Abos angewendet werden. Der Preis gilt für die gesamte Formation.
            </motion.p>
          </Section>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">So funktioniert's</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">
              Wie es funktioniert
            </motion.h2>
          </Section>

          <Section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorksSteps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} className="relative">
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border z-0 -translate-x-4" />
                )}
                <div className="relative z-10">
                  <div className="font-heading text-6xl font-bold text-accent-gold/20 mb-4">{step.num}</div>
                  <h3 className="font-heading text-xl font-bold mb-3">{step.title}</h3>
                  <p className="font-sans text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-32 bg-surface">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">FAQ</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Häufige Fragen.</motion.h2>
          </Section>

          <Section className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div
                  className="border border-border cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-center justify-between p-6">
                    <h4 className="font-heading font-bold">{faq.q}</h4>
                    <motion.span
                      className="text-accent-gold text-xl font-light flex-shrink-0 ml-4"
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      +
                    </motion.span>
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="font-sans text-text-secondary text-sm px-6 pb-6 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 bg-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Section>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mb-6">
              Bereit, als Formation durchzustarten?
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/60 mb-10">
              Registriere deine Formation kostenlos und entdecke alle Vorteile.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Button href="/register" variant="primary" size="lg">Formation registrieren</Button>
              <Button href="/contact" variant="outline" size="lg">Fragen stellen</Button>
            </motion.div>
          </Section>
        </div>
      </section>
    </>
  )
}
