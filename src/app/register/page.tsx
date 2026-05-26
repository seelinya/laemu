'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const INSTRUMENTS = [
  'Handorgel', 'Schwyzerörgeli', 'Steirische Harmonika', 'Klavier',
  'Kontrabass / Bass', 'Klarinette', 'Violine / Geige', 'Trompete / Flügelhorn',
  'Zither', 'Volksgesang',
]

const ABOS = [
  {
    id: 'community-monthly',
    name: 'Community Monatsmitgliedschaft',
    price: 'CHF 5',
    period: '/ Monat',
    description: 'Zugang zur LAEMU Community: Feed, Gruppen, Direktnachrichten, Events.',
    highlight: false,
  },
  {
    id: 'community-yearly',
    name: 'Community Jahres­mitgliedschaft',
    price: 'CHF 49',
    period: '/ Jahr',
    description: 'Gleiche Vorteile wie monatlich — 2 Monate gratis gegenüber dem Monatsabo.',
    highlight: false,
    badge: '2 Monate gratis',
  },
  {
    id: 'academy-monthly',
    name: 'Musikschule + Community',
    price: 'CHF 19',
    period: '/ Monat',
    description: 'Vollzugang zu allen Video-Kursen, Live-Sessions, Kurs-Chats und Community.',
    highlight: true,
    badge: 'Beliebt',
  },
  {
    id: 'academy-yearly',
    name: 'Musikschule + Community Jahresabo',
    price: 'CHF 179',
    period: '/ Jahr',
    description: 'Bester Preis — über 2 Monate gespart. Alle Academy- und Community-Vorteile.',
    highlight: false,
    badge: 'Bester Preis',
  },
]

const steps = [
  { number: 1, label: 'Angaben' },
  { number: 2, label: 'Mitgliedschaft' },
  { number: 3, label: 'Profil' },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [selectedAbo, setSelectedAbo] = useState('community-monthly')
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])
  const [formationChoice, setFormationChoice] = useState<'yes' | 'no' | 'open' | null>(null)
  const [done, setDone] = useState(false)

  const toggleInstrument = (inst: string) => {
    setSelectedInstruments(prev =>
      prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-accent-gold flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">Willkommen bei LAEMU!</h1>
          <p className="font-sans text-text-secondary leading-relaxed mb-8">
            Dein Konto wurde erfolgreich erstellt. Du bist jetzt Teil der Schweizer Volksmusik-Community.
          </p>
          <div className="space-y-3">
            <Link
              href="/member/community"
              className="block w-full bg-dark text-white text-center font-sans font-semibold py-4 hover:bg-accent-gold transition-colors"
            >
              Zur Community →
            </Link>
            <Link
              href="/member/academy"
              className="block w-full bg-surface border border-border text-center font-sans text-sm py-3 hover:border-dark transition-colors"
            >
              Musikschule entdecken
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-dark py-5 px-6 flex items-center justify-between mt-20">
        <Link href="/" className="font-heading font-bold text-white text-lg tracking-tight">LAEMU</Link>
        <Link href="/" className="font-sans text-xs text-white/50 hover:text-white transition-colors">Abbrechen</Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center font-heading font-bold text-sm transition-all ${
                  step > s.number ? 'bg-accent-gold text-white' :
                  step === s.number ? 'bg-dark text-white' :
                  'bg-border text-text-secondary'
                }`}>
                  {step > s.number ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : s.number}
                </div>
                <span className={`font-sans text-xs mt-2 ${step === s.number ? 'text-dark font-medium' : 'text-text-secondary'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 mb-5 transition-colors ${step > s.number ? 'bg-accent-gold' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-heading text-3xl font-bold mb-2">Konto erstellen</h1>
              <p className="font-sans text-text-secondary text-sm mb-8">
                Nur für natürliche Personen — keine Firmen oder Organisationen.
              </p>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-text-secondary block mb-1.5">Vorname *</label>
                    <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Niklaus" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-1.5">Nachname *</label>
                    <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Hess" />
                  </div>
                </div>
                <div>
                  <label className="label text-text-secondary block mb-1.5">E-Mail-Adresse *</label>
                  <input type="email" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="deine@email.ch" />
                </div>
                <div>
                  <label className="label text-text-secondary block mb-1.5">Passwort *</label>
                  <input type="password" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Mindestens 8 Zeichen" />
                </div>
                <div>
                  <label className="label text-text-secondary block mb-1.5">Geburtsdatum *</label>
                  <input type="date" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface text-text-secondary" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="label text-text-secondary block mb-1.5">Strasse und Hausnummer *</label>
                    <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Musterstrasse 12" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-1.5">PLZ *</label>
                    <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="6000" />
                  </div>
                </div>
                <div>
                  <label className="label text-text-secondary block mb-1.5">Ort *</label>
                  <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Luzern" />
                </div>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">
                  Mit der Registrierung stimmst du den{' '}
                  <Link href="/agb" className="text-accent-gold hover:underline">Nutzungsbedingungen</Link>{' '}
                  und der{' '}
                  <Link href="/datenschutz" className="text-accent-gold hover:underline">Datenschutzerklärung</Link>{' '}
                  von LAEMU zu.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-dark text-white font-sans font-semibold py-4 hover:bg-accent-gold transition-colors"
                >
                  Weiter →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-heading text-3xl font-bold mb-2">Mitgliedschaft wählen</h1>
              <p className="font-sans text-text-secondary text-sm mb-8">Wähle das passende Abo und dein Zahlungsmittel.</p>

              <div className="space-y-3 mb-8">
                {ABOS.map((abo) => (
                  <button
                    key={abo.id}
                    onClick={() => setSelectedAbo(abo.id)}
                    className={`w-full text-left p-5 border-2 transition-all ${
                      selectedAbo === abo.id
                        ? abo.highlight ? 'border-accent-gold bg-accent-gold/5' : 'border-dark bg-dark/5'
                        : 'border-border hover:border-dark bg-surface'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-sans font-semibold text-sm">{abo.name}</span>
                          {abo.badge && (
                            <span className={`font-sans text-[10px] font-bold px-2 py-0.5 ${abo.highlight ? 'bg-accent-gold text-white' : 'bg-dark text-white'}`}>{abo.badge}</span>
                          )}
                        </div>
                        <p className="font-sans text-xs text-text-secondary leading-relaxed">{abo.description}</p>
                      </div>
                      <div className="ml-4 text-right flex-shrink-0">
                        <span className="font-heading font-bold text-xl text-accent-gold">{abo.price}</span>
                        <span className="font-sans text-xs text-text-secondary block">{abo.period}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <h3 className="font-heading font-bold text-lg mb-4">Zahlungsmittel</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'card', label: 'Kredit- / Debitkarte', sub: 'Visa, Mastercard', icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    )},
                    { id: 'postfinance', label: 'PostFinance', sub: 'PostFinance Card / E-Finance', icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    )},
                    { id: 'twint', label: 'TWINT', sub: 'Direkte Zahlung per Smartphone', icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    )},
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex items-center gap-4 p-4 border-2 text-left transition-all ${
                        selectedPayment === method.id ? 'border-dark bg-dark/5' : 'border-border bg-surface hover:border-dark'
                      }`}
                    >
                      <span className={selectedPayment === method.id ? 'text-dark' : 'text-text-secondary'}>{method.icon}</span>
                      <div>
                        <p className="font-sans font-semibold text-sm">{method.label}</p>
                        <p className="font-sans text-xs text-text-secondary">{method.sub}</p>
                      </div>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPayment === method.id ? 'border-dark bg-dark' : 'border-border'}`}>
                        {selectedPayment === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors"
                >
                  ← Zurück
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-dark text-white font-sans font-semibold py-4 hover:bg-accent-gold transition-colors"
                >
                  Weiter →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-heading text-3xl font-bold mb-2">Profil einrichten</h1>
              <p className="font-sans text-text-secondary text-sm mb-8">
                Alle Angaben hier sind optional — du kannst sie jederzeit in deinem Profil ergänzen.
              </p>

              <div className="space-y-7">
                {/* Profile photo */}
                <div>
                  <label className="label text-text-secondary block mb-3">Profilbild</label>
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-border flex items-center justify-center flex-shrink-0">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <button className="font-sans text-sm border border-border px-4 py-2.5 hover:border-dark transition-colors">
                      Bild hochladen
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="label text-text-secondary block mb-1.5">Bio</label>
                  <textarea
                    rows={3}
                    className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface resize-none"
                    placeholder="Erzähl der Community etwas über dich — deine Musik, deine Heimat, deine Geschichte."
                  />
                </div>

                {/* Instruments */}
                <div>
                  <label className="label text-text-secondary block mb-3">Instrumente</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {INSTRUMENTS.map((inst) => (
                      <button
                        key={inst}
                        onClick={() => toggleInstrument(inst)}
                        className={`font-sans text-sm px-3 py-2 border transition-all ${
                          selectedInstruments.includes(inst)
                            ? 'border-dark bg-dark text-white'
                            : 'border-border bg-surface text-text-secondary hover:border-dark'
                        }`}
                      >
                        {inst}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Weiteres Instrument (freitext)"
                    className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                  />
                </div>

                {/* Formation */}
                <div>
                  <label className="label text-text-secondary block mb-3">Formation</label>
                  <div className="flex gap-2 mb-4">
                    {[
                      { id: 'yes', label: 'Ja, ich spiele in einer Formation' },
                      { id: 'no', label: 'Nein' },
                      { id: 'open', label: 'Offen für Formationen' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setFormationChoice(opt.id as 'yes' | 'no' | 'open')}
                        className={`font-sans text-sm px-4 py-2.5 border transition-all ${
                          formationChoice === opt.id ? 'border-dark bg-dark text-white' : 'border-border bg-surface text-text-secondary hover:border-dark'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {formationChoice === 'yes' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <input
                        type="text"
                        placeholder="Name der Formation"
                        className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors"
                >
                  ← Zurück
                </button>
                <button
                  onClick={() => setDone(true)}
                  className="flex-1 bg-accent-gold text-white font-sans font-semibold py-4 hover:bg-dark transition-colors"
                >
                  Registrierung abschliessen ✓
                </button>
              </div>
              <button
                onClick={() => setDone(true)}
                className="w-full mt-3 font-sans text-sm text-text-secondary hover:text-dark transition-colors py-2"
              >
                Überspringen — später im Profil ergänzen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
