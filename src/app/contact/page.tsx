'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

type AudienceId = 'member' | 'partner' | 'musician' | 'press' | 'other'

const audiences: { id: AudienceId; label: string; description: string; icon: string }[] = [
  { id: 'member', label: 'Community-Mitglied', description: 'Frage zu Mitgliedschaft, Login, Kursen oder Profil.', icon: '👋' },
  { id: 'musician', label: 'Musiker:in / Formation', description: 'Ich spiele Volksmusik und möchte mich vorstellen oder bin neugierig.', icon: '🎵' },
  { id: 'partner', label: 'Betrieb / Organisation', description: 'Lokal, Bauer, Schule, Verein, Stiftung — Anliegen rund um Partnerschaft.', icon: '🏛️' },
  { id: 'press', label: 'Presse / Medien', description: 'Anfragen für Interviews, Berichterstattung oder Pressematerial.', icon: '📰' },
  { id: 'other', label: 'Anderes', description: 'Allgemeine Frage, Feedback oder Idee.', icon: '✉️' },
]

type Subject = { id: string; label: string; shortcut?: { href: string; label: string }; help?: string }

const subjectsByAudience: Record<AudienceId, Subject[]> = {
  member: [
    { id: 'account', label: 'Konto, Login oder Passwort', help: 'Falls du dich nicht mehr einloggen kannst, schreib uns deine E-Mail-Adresse.' },
    { id: 'abo', label: 'Mitgliedschaft / Abo' },
    { id: 'kurs', label: 'Frage zu einem Kurs oder Lernvideo' },
    { id: 'community', label: 'Community / Feed / Gruppen' },
    { id: 'bug', label: 'Etwas funktioniert nicht', help: 'Beschreib bitte kurz, was du gemacht hast und was dann passiert ist.' },
    { id: 'feedback', label: 'Feedback oder Idee' },
  ],
  musician: [
    {
      id: 'formation-eintrag',
      label: 'Meine Formation eintragen',
      shortcut: { href: '/partner/anmelden?kategorie=Formation', label: 'Direkt zum Formation-Formular' },
      help: 'Für einen vollständigen Eintrag (Mitglieder, Bilder, Auftritte) ist das Partner-Formular ideal.',
    },
    { id: 'auftritt', label: 'Auftrittsmöglichkeit finden' },
    { id: 'lehrer', label: 'Als Lehrperson bei LAEMU mitmachen' },
    { id: 'kooperation', label: 'Kooperation / Projekt vorschlagen' },
    { id: 'allgemein', label: 'Allgemeine Frage' },
  ],
  partner: [
    {
      id: 'partner-eintrag',
      label: 'Betrieb / Organisation eintragen',
      shortcut: { href: '/partner/anmelden', label: 'Direkt zum Partner-Formular' },
      help: 'Im Formular erfassen wir alles, was für deinen Eintrag wichtig ist — schneller und vollständiger als per Mail.',
    },
    { id: 'event', label: 'Event / Veranstaltung eintragen' },
    { id: 'sponsoring', label: 'Sponsoring oder Partnerschaft' },
    { id: 'angebot', label: 'Angebot für LAEMU-Mitglieder' },
    { id: 'allgemein', label: 'Allgemeine Frage' },
  ],
  press: [
    { id: 'interview', label: 'Interview-Anfrage' },
    { id: 'berichterstattung', label: 'Berichterstattung / Recherche' },
    { id: 'pressematerial', label: 'Pressematerial / Logos anfordern' },
    { id: 'event', label: 'Akkreditierung / Event-Besuch' },
  ],
  other: [
    { id: 'frage', label: 'Allgemeine Frage' },
    { id: 'feedback', label: 'Feedback / Idee' },
    { id: 'lob', label: 'Lob oder Kritik' },
    { id: 'sonstiges', label: 'Sonstiges' },
  ],
}

const socialLinks = [
  { name: 'Instagram', handle: '@laemu', href: 'https://instagram.com/laemu', color: 'hover:text-pink-500', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )},
  { name: 'YouTube', handle: '@laemu', href: 'https://youtube.com/@laemu', color: 'hover:text-red-500', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )},
  { name: 'Spotify', handle: 'LAEMU', href: 'https://open.spotify.com', color: 'hover:text-green-500', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )},
  { name: 'Facebook', handle: 'LAEMU', href: 'https://facebook.com/laemu', color: 'hover:text-blue-500', icon: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )},
]

const faqs = [
  {
    q: 'Wie kann ich Mitglied bei LAEMU werden?',
    a: 'Über die Registrierung — Community-Abo ab CHF 5/Monat, Musikschule + Community ab CHF 19/Monat.',
    href: '/register',
    hrefLabel: 'Zur Registrierung',
  },
  {
    q: 'Wie trage ich meine Formation oder meinen Betrieb ein?',
    a: 'Über das Partner-Formular — dort erfassen wir alle Infos für deinen öffentlichen Eintrag.',
    href: '/partner/anmelden',
    hrefLabel: 'Zum Partner-Formular',
  },
  {
    q: 'Wie kann ich einen Event eintragen?',
    a: 'Sende uns Datum, Ort, Beschreibung und ein Bild über das Kontaktformular — wir nehmen ihn ins Programm auf.',
  },
  {
    q: 'Ich habe Bilder oder Videos, die zu gross sind.',
    a: 'Sende sie via WeTransfer an info@laemu.ch — mit Betreff «Bilder [Dein Name / Formation]».',
    href: 'mailto:info@laemu.ch',
    hrefLabel: 'info@laemu.ch',
  },
]

const inputCls = 'w-full border border-border p-4 font-sans text-sm focus:outline-none focus:border-accent-gold bg-surface transition-colors'

export default function ContactPage() {
  const [audience, setAudience] = useState<AudienceId | null>(null)
  const [subject, setSubject] = useState<string>('')
  const [subscribe, setSubscribe] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const subjects = audience ? subjectsByAudience[audience] : []
  const activeSubject = subjects.find((s) => s.id === subject)

  return (
    <>
      {/* HERO */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.span variants={fadeUp} className="label text-accent-gold">Kontakt</motion.span>
            <motion.h1 variants={fadeUp} className="font-heading text-6xl md:text-8xl font-bold leading-tight mt-4 mb-6">
              Lass uns sprechen.
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans text-xl text-text-secondary leading-relaxed max-w-xl">
              Ob Frage, Idee oder Zusammenarbeit — wir freuen uns von dir zu hören.
              Damit deine Nachricht direkt bei der richtigen Person landet, sag uns kurz, worum es geht.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

            {/* FORM */}
            <div className="lg:col-span-2">
              <Section>
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-muted-green/10 border border-muted-green/20 p-12 text-center">
                    <span className="text-5xl block mb-4">✓</span>
                    <h3 className="font-heading text-2xl font-bold mb-2">Nachricht gesendet!</h3>
                    <p className="font-sans text-text-secondary mb-6">Wir melden uns innert 1–3 Werktagen bei dir.</p>
                    <button
                      onClick={() => { setSubmitted(false); setAudience(null); setSubject(''); }}
                      className="font-sans text-sm text-accent-gold hover:underline"
                    >
                      Weitere Nachricht schreiben
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* AUDIENCE STEP */}
                    <motion.h2 variants={fadeUp} className="heading-sm mb-2">Wer schreibt uns?</motion.h2>
                    <motion.p variants={fadeUp} className="font-sans text-sm text-text-secondary mb-6">
                      Damit wir dir gezielt helfen können.
                    </motion.p>
                    <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                      {audiences.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => { setAudience(a.id); setSubject('') }}
                          className={`text-left p-4 border-2 transition-all ${audience === a.id ? 'border-accent-gold bg-accent-gold/5' : 'border-border bg-surface hover:border-dark'}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl flex-shrink-0">{a.icon}</span>
                            <div>
                              <p className="font-heading font-bold text-sm mb-0.5">{a.label}</p>
                              <p className="font-sans text-xs text-text-secondary leading-relaxed">{a.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>

                    <AnimatePresence>
                      {audience && (
                        <motion.div
                          key="form-body"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ duration: 0.25 }}
                        >
                          <h2 className="heading-sm mb-2">Worum geht es?</h2>
                          <p className="font-sans text-sm text-text-secondary mb-5">Wähle das passende Thema — wir leiten direkt an die richtige Person weiter.</p>
                          <div className="flex flex-wrap gap-2 mb-8">
                            {subjects.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => setSubject(s.id)}
                                className={`font-sans text-sm px-4 py-2.5 border transition-all ${subject === s.id ? 'border-dark bg-dark text-white' : 'border-border bg-surface text-text-secondary hover:border-dark'}`}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>

                          {/* Smart routing — wenn es ein dediziertes Formular gibt */}
                          {activeSubject?.shortcut && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-2 border-accent-gold bg-accent-gold/5 p-5 mb-8">
                              <div className="flex items-start gap-3">
                                <span className="text-xl flex-shrink-0">💡</span>
                                <div className="flex-1">
                                  <p className="font-heading font-bold text-sm mb-1">Schneller geht's mit dem Spezial-Formular</p>
                                  <p className="font-sans text-sm text-text-secondary mb-3">{activeSubject.help}</p>
                                  <Link
                                    href={activeSubject.shortcut.href}
                                    className="inline-block bg-accent-gold text-white font-sans text-sm font-semibold px-5 py-2.5 hover:bg-dark transition-colors"
                                  >
                                    {activeSubject.shortcut.label} →
                                  </Link>
                                  <p className="font-sans text-xs text-text-secondary mt-3">
                                    Oder schreib uns trotzdem hier — wir helfen gerne weiter.
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Nachricht */}
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="label text-text-secondary block mb-2">Vorname *</label>
                                <input type="text" className={inputCls} placeholder="Dein Vorname" />
                              </div>
                              <div>
                                <label className="label text-text-secondary block mb-2">Nachname *</label>
                                <input type="text" className={inputCls} placeholder="Dein Nachname" />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="label text-text-secondary block mb-2">E-Mail *</label>
                                <input type="email" className={inputCls} placeholder="deine@email.ch" />
                              </div>
                              <div>
                                <label className="label text-text-secondary block mb-2">
                                  Telefon <span className="text-text-secondary/70">(optional)</span>
                                </label>
                                <input type="tel" className={inputCls} placeholder="Nur falls du gerne angerufen wirst" />
                              </div>
                            </div>

                            {/* Audience-spezifisches Zusatzfeld */}
                            {audience === 'partner' && (
                              <div>
                                <label className="label text-text-secondary block mb-2">Betrieb / Organisation</label>
                                <input type="text" className={inputCls} placeholder="z.B. Restaurant Sagi, Harmonika-Atelier Steiner" />
                              </div>
                            )}
                            {audience === 'musician' && (
                              <div>
                                <label className="label text-text-secondary block mb-2">Formation / Hauptinstrument <span className="text-text-secondary/70">(optional)</span></label>
                                <input type="text" className={inputCls} placeholder="z.B. Trio Alpstein, Handorgel" />
                              </div>
                            )}
                            {audience === 'press' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="label text-text-secondary block mb-2">Medium</label>
                                  <input type="text" className={inputCls} placeholder="z.B. Volksmusik-Magazin, SRF, …" />
                                </div>
                                <div>
                                  <label className="label text-text-secondary block mb-2">Deadline <span className="text-text-secondary/70">(optional)</span></label>
                                  <input type="date" className={inputCls} />
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="label text-text-secondary block mb-2">Nachricht *</label>
                              <textarea
                                rows={6}
                                className={`${inputCls} resize-none`}
                                placeholder={
                                  audience === 'partner'
                                    ? 'Erzähl uns kurz, was du erreichen möchtest — wir melden uns innert 1–3 Werktagen.'
                                    : audience === 'musician'
                                    ? 'Worum geht es konkret? Je mehr Kontext, desto besser können wir helfen.'
                                    : audience === 'press'
                                    ? 'Worüber berichtest du? Welche Infos / Bilder / Gesprächspartner brauchst du?'
                                    : audience === 'member'
                                    ? 'Wie können wir dir helfen?'
                                    : 'Was möchtest du uns mitteilen?'
                                }
                              />
                            </div>

                            <label className="flex items-start gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={subscribe}
                                onChange={(e) => setSubscribe(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-accent-gold flex-shrink-0"
                              />
                              <span className="font-sans text-xs text-text-secondary leading-relaxed">
                                Ja, ich möchte gelegentlich Neuigkeiten aus dem LAEMU-Universum per E-Mail erhalten. Abmeldung jederzeit möglich.
                              </span>
                            </label>

                            <div>
                              <Button
                                variant="primary"
                                size="lg"
                                onClick={() => setSubmitted(true)}
                                className="w-full md:w-auto"
                              >
                                Nachricht senden
                              </Button>
                              <p className="font-sans text-[11px] text-text-secondary mt-3">
                                Mit dem Absenden stimmst du der{' '}
                                <Link href="/datenschutz" className="text-accent-gold hover:underline">Datenschutzerklärung</Link>{' '}zu.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </Section>
            </div>

            {/* DIRECT CONTACTS */}
            <div>
              <Section className="space-y-6">
                <motion.h2 variants={fadeUp} className="heading-sm mb-2">Direkt schreiben.</motion.h2>
                <motion.p variants={fadeUp} className="font-sans text-sm text-text-secondary mb-6">
                  Du weisst schon, wer dein Anliegen am besten beantwortet?
                </motion.p>
                {[
                  {
                    name: 'Niklaus Hess',
                    role: 'Co-Founder',
                    email: 'niklaus@laemu.ch',
                    topics: ['Ländlermusik', 'Musikschule', 'Instrumente', 'Musikinhalte'],
                    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
                  },
                  {
                    name: 'Selina Strickler',
                    role: 'Co-Founder',
                    email: 'selina@laemu.ch',
                    topics: ['Branding', 'Partnerschaften', 'Marketing', 'Events', 'Kooperationen'],
                    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
                  },
                ].map((contact) => (
                  <motion.div key={contact.name} variants={fadeUp}>
                    <Card padding="lg">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <img src={contact.img} alt={contact.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold">{contact.name}</h4>
                          <p className="font-sans text-xs text-accent-gold">{contact.role}</p>
                        </div>
                      </div>
                      <p className="font-sans text-xs text-text-secondary mb-3">
                        <strong className="text-text-primary">Für:</strong>{' '}
                        {contact.topics.join(', ')}
                      </p>
                      <a href={`mailto:${contact.email}`} className="font-sans text-sm text-accent-gold hover:text-accent-earth transition-colors">
                        {contact.email}
                      </a>
                    </Card>
                  </motion.div>
                ))}

                <motion.div variants={fadeUp}>
                  <Card padding="lg">
                    <h4 className="font-heading font-bold mb-2">Allgemein</h4>
                    <a href="mailto:info@laemu.ch" className="font-sans text-sm text-accent-gold hover:text-accent-earth">info@laemu.ch</a>
                    <p className="font-sans text-xs text-text-secondary mt-3 leading-relaxed">
                      Auch für grosse Datei-Sendungen via{' '}
                      <a href="https://wetransfer.com" target="_blank" rel="noopener noreferrer" className="text-accent-gold hover:underline">WeTransfer</a>.
                    </p>
                  </Card>
                </motion.div>
              </Section>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — vor dem Form ausfüllen */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <Section>
            <motion.span variants={fadeUp} className="label text-accent-gold">Vielleicht hilft das schon</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-10">Häufige Fragen.</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
              {faqs.map((faq) => (
                <motion.div variants={fadeUp} key={faq.q} className="bg-surface p-6">
                  <h3 className="font-heading font-bold mb-2">{faq.q}</h3>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed mb-3">{faq.a}</p>
                  {faq.href && (
                    <Link href={faq.href} className="font-sans text-sm text-accent-gold hover:underline">
                      {faq.hrefLabel} →
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section className="py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <Section>
            <motion.span variants={fadeUp} className="label text-accent-gold">Social Media</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mt-3 mb-6">
              Verpasse keine News von LAEMU.
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/60 mb-12 max-w-xl mx-auto">
              Folge uns auf unseren Kanälen für aktuelle Neuigkeiten, Musik und Einblicke hinter die Kulissen.
            </motion.p>
            <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeUp}
                  className={`flex flex-col items-center gap-3 p-6 border border-white/10 text-white/60 transition-all duration-300 hover:border-white/30 ${s.color}`}
                  whileHover={{ y: -4 }}
                >
                  {s.icon}
                  <span className="font-sans text-sm font-medium">{s.name}</span>
                  <span className="font-sans text-xs text-white/40">{s.handle}</span>
                </motion.a>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>
    </>
  )
}
