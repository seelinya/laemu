'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ACADEMY_INSTRUMENTS,
  individualPricing,
  individualPlanMeta,
  INDIVIDUAL_PLAN_ORDER,
  scopeLabels,
  formationPlanMeta,
  formationYearlyPrice,
  FORMATION_INCLUDED_MEMBERS,
  type Scope,
  type IndividualPlanId,
  type FormationPlanId,
} from '@/lib/academy'

const PROFILE_INSTRUMENTS = ['Schwyzerörgeli', 'Handorgel', 'Bassgeige', 'Klavierbegleitung', 'Klarinette']

const steps = [
  { number: 1, label: 'Angaben' },
  { number: 2, label: 'Mitgliedschaft' },
  { number: 3, label: 'Profil' },
]

const chf = (n: number) => `CHF ${n.toLocaleString('de-CH')}`

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])
  const [formationChoice, setFormationChoice] = useState<'yes' | 'no' | 'open' | null>(null)
  const [ort, setOrt] = useState('')
  const [done, setDone] = useState(false)

  // ── Mitgliedschaft (Step 2) ──────────────────────────────────────────────
  const [accountType, setAccountType] = useState<'individual' | 'formation'>('individual')
  const [billing, setBilling] = useState<'yearly' | 'monthly'>('yearly')
  const [individualPlan, setIndividualPlan] = useState<IndividualPlanId>('starter')
  const [scope, setScope] = useState<Scope>('1')
  const [aboInstruments, setAboInstruments] = useState<string[]>(['Handorgel'])
  const [formationPlan, setFormationPlan] = useState<FormationPlanId>('pro')
  const [memberCount, setMemberCount] = useState(4)

  const toggleInstrument = (inst: string) => {
    setSelectedInstruments(prev =>
      prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]
    )
  }

  // Instrumente pro Formationsmitglied (Mehrfachauswahl je Mitglied).
  const [memberInstruments, setMemberInstruments] = useState<Record<number, string[]>>({})
  const toggleMemberInstrument = (idx: number, inst: string) => {
    setMemberInstruments(prev => {
      const cur = prev[idx] ?? []
      return { ...prev, [idx]: cur.includes(inst) ? cur.filter(i => i !== inst) : [...cur, inst] }
    })
  }

  const scopeCount = (s: Scope) => (s === 'all' ? ACADEMY_INSTRUMENTS.length : Number(s))

  const toggleAboInstrument = (inst: string) => {
    setAboInstruments(prev => {
      if (prev.includes(inst)) return prev.filter(i => i !== inst)
      const max = scopeCount(scope)
      if (prev.length >= max) return [...prev.slice(1), inst]
      return [...prev, inst]
    })
  }

  const selectScope = (s: Scope) => {
    setScope(s)
    if (s === 'all') {
      setAboInstruments([...ACADEMY_INSTRUMENTS])
    } else {
      setAboInstruments(prev => prev.slice(0, Number(s)))
    }
  }

  // Preis des aktuell gewählten Einzel-Abos
  const individualPrice = (() => {
    if (individualPlan === 'lernvideo') return individualPricing.lernvideo[billing]
    return individualPricing[individualPlan][scope][billing]
  })()

  // Preis pro Plan-Karte (für die aktuelle Auswahl)
  const planCardPrice = (plan: IndividualPlanId) => {
    if (plan === 'lernvideo') return individualPricing.lernvideo[billing]
    return individualPricing[plan][scope][billing]
  }

  const formationPrice = formationYearlyPrice(formationPlan, memberCount)
  const formationExtra = Math.max(0, memberCount - FORMATION_INCLUDED_MEMBERS)

  const periodLabel = billing === 'yearly' ? '/ Jahr' : '/ Monat'

  // Formationen: Pflichtschritt — jedes Mitglied muss mindestens ein Instrument
  // für den Zugriff zugewiesen bekommen (im Hintergrund relevant für die
  // Freischaltung). Erst dann lässt sich die Registrierung abschliessen.
  const formationReady =
    accountType !== 'formation' ||
    Array.from({ length: memberCount }).every((_, idx) => (memberInstruments[idx]?.length ?? 0) > 0)

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
          <p className="font-sans text-text-secondary leading-relaxed mb-6">
            Dein Konto wurde erfolgreich erstellt. Du bist jetzt Teil der Schweizer Volksmusik-Community.
          </p>

          {accountType === 'formation' && (
            <div className="bg-accent-gold/5 border border-accent-gold/30 p-4 mb-8 text-left flex gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
              <div>
                <p className="font-sans text-sm font-semibold mb-1">Die weiteren Mitglieder sind informiert</p>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">
                  Da dein Abo bezahlt wurde, haben die anderen Mitglieder deiner Formation ein
                  Bestätigungs-E-Mail erhalten. Sobald sie ihr Login abgeschlossen (Passwort gesetzt)
                  haben, können sie sich ab sofort bei LAEMU einloggen — mit Zugriff auf die
                  zugewiesenen Instrumente. Die Grunddaten sind bereits hinterlegt; sie können nur
                  optionale Profilinhalte ergänzen.
                </p>
              </div>
            </div>
          )}

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
      <div className="bg-dark py-5 px-6 flex items-center justify-between">
        <Link href="/login" className="font-heading font-bold text-white text-lg tracking-tight">LAEMU</Link>
        <Link href="/login" className="font-sans text-xs text-white/50 hover:text-white transition-colors">Abbrechen</Link>
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
                    <label className="label text-text-secondary block mb-1.5">Strasse *</label>
                    <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Musterstrasse" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-1.5">Hausnummer *</label>
                    <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="12" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label text-text-secondary block mb-1.5">PLZ *</label>
                    <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="6000" />
                  </div>
                  <div className="col-span-2">
                    <label className="label text-text-secondary block mb-1.5">Ort *</label>
                    <input value={ort} onChange={e => setOrt(e.target.value)} type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Luzern" />
                  </div>
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
              {/* Headline */}
              <h1 className="font-heading text-3xl font-bold mb-2 whitespace-pre-line">
                {'Lerne Ländlermusik.\nVon Profis. Für alle.'}
              </h1>
              <p className="font-sans text-text-secondary text-sm mb-8 leading-relaxed">
                Die LAEMU Musikschule — Online-Kurse und originalgetreue Lernvideos zu unzähligen
                Stücken, gezeigt von den Besten der Szene.
              </p>

              {/* Account type toggle */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {([
                  { id: 'individual', label: 'Einzelperson', desc: 'Für dich allein' },
                  { id: 'formation', label: 'Formation', desc: 'Für deine Kapelle' },
                ] as const).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setAccountType(opt.id)}
                    className={`p-4 border-2 text-left transition-all ${accountType === opt.id ? 'border-dark bg-dark/5' : 'border-border bg-surface hover:border-dark'}`}
                  >
                    <p className="font-sans font-semibold text-sm">{opt.label}</p>
                    <p className="font-sans text-xs text-text-secondary">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {/* Billing toggle (individual only) */}
              {accountType === 'individual' && (
                <div className="flex items-center justify-center gap-1 mb-6 bg-surface border border-border p-1 w-fit mx-auto">
                  {([
                    { id: 'yearly', label: 'Jährlich', hint: '2 Monate gratis' },
                    { id: 'monthly', label: 'Monatlich', hint: null },
                  ] as const).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setBilling(opt.id)}
                      className={`px-4 py-2 font-sans text-sm transition-colors flex items-center gap-2 ${billing === opt.id ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
                    >
                      {opt.label}
                      {opt.hint && <span className={`font-sans text-[10px] px-1.5 py-0.5 ${billing === opt.id ? 'bg-accent-gold text-white' : 'bg-accent-gold/15 text-accent-gold'}`}>{opt.hint}</span>}
                    </button>
                  ))}
                </div>
              )}

              {/* ── INDIVIDUAL OFFERING ── */}
              {accountType === 'individual' && (
                <>
                  <div className="space-y-3 mb-6">
                    {INDIVIDUAL_PLAN_ORDER.map(planId => {
                      const meta = individualPlanMeta[planId]
                      const active = individualPlan === planId
                      return (
                        <button
                          key={planId}
                          onClick={() => setIndividualPlan(planId)}
                          className={`w-full text-left p-5 border-2 transition-all ${active ? (planId === 'pro' ? 'border-accent-gold bg-accent-gold/5' : 'border-dark bg-dark/5') : 'border-border hover:border-dark bg-surface'}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span>{meta.emoji}</span>
                                <span className="font-sans font-semibold text-sm">{meta.label}</span>
                                <span className="font-sans text-[10px] font-medium px-2 py-0.5 bg-accent-gold/15 text-accent-gold border border-accent-gold/30">{meta.audience}</span>
                                {meta.badge && (
                                  <span className="font-sans text-[10px] font-bold px-2 py-0.5 bg-accent-gold text-white">{meta.badge}</span>
                                )}
                              </div>
                              <p className="font-sans text-xs text-text-secondary leading-relaxed">{meta.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="font-heading font-bold text-xl text-accent-gold">{chf(planCardPrice(planId))}</span>
                              <span className="font-sans text-xs text-text-secondary block">{periodLabel}</span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Scope + instrument selection */}
                  {individualPlanMeta[individualPlan].hasScope && (
                    <div className="bg-surface border border-border p-5 mb-6">
                      <h3 className="font-heading font-bold text-sm mb-3">Umfang wählen</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                        {(['1', '2', '3', 'all'] as Scope[]).map(s => (
                          <button
                            key={s}
                            onClick={() => selectScope(s)}
                            className={`py-2.5 px-2 font-sans text-xs border transition-colors ${scope === s ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark'}`}
                          >
                            {scopeLabels[s]}
                          </button>
                        ))}
                      </div>

                      {scope !== 'all' ? (
                        <>
                          <p className="font-sans text-xs text-text-secondary mb-2">
                            Wähle {scopeCount(scope)} {scopeCount(scope) === 1 ? 'Instrument' : 'Instrumente'} ({aboInstruments.length}/{scopeCount(scope)})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {ACADEMY_INSTRUMENTS.map(inst => {
                              const selected = aboInstruments.includes(inst)
                              return (
                                <button
                                  key={inst}
                                  onClick={() => toggleAboInstrument(inst)}
                                  className={`font-sans text-sm px-3 py-2 border transition-all ${selected ? 'border-dark bg-dark text-white' : 'border-border bg-surface text-text-secondary hover:border-dark'}`}
                                >
                                  {inst}
                                </button>
                              )
                            })}
                          </div>
                        </>
                      ) : (
                        <p className="font-sans text-xs text-text-secondary">
                          All-in-One — alle Instrumente inklusive: {ACADEMY_INSTRUMENTS.join(' · ')}.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Feature list of selected plan */}
                  <div className="bg-background border border-border p-5 mb-8">
                    <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Enthalten</p>
                    <div className="space-y-2">
                      {individualPlanMeta[individualPlan].features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 font-sans text-sm">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                          <span>{f}</span>
                        </div>
                      ))}
                      {billing === 'yearly' && (
                        <div className="flex items-center gap-2 font-sans text-sm text-accent-gold">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                          <span>20 % Rabatt auf Instrumentenmieten (Jahresabo)</span>
                        </div>
                      )}
                    </div>
                    {individualPlanMeta[individualPlan].notIncluded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-2">
                        <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-1">Nicht enthalten</p>
                        {individualPlanMeta[individualPlan].notIncluded!.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 font-sans text-sm text-text-secondary">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-secondary/60 flex-shrink-0"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-border mt-4 pt-4">
                      <span className="font-sans text-sm text-text-secondary">Dein Preis</span>
                      <span className="font-heading font-bold text-2xl text-accent-gold">{chf(individualPrice)}<span className="font-sans text-sm font-normal text-text-secondary">{periodLabel}</span></span>
                    </div>
                  </div>
                </>
              )}

              {/* ── FORMATION OFFERING ── */}
              {accountType === 'formation' && (
                <>
                  <div className="bg-surface border border-border p-5 mb-6">
                    <h3 className="font-heading font-bold text-sm mb-1">Anzahl Mitglieder</h3>
                    <p className="font-sans text-xs text-text-secondary mb-4">
                      Das Formationsangebot gilt für bis zu {FORMATION_INCLUDED_MEMBERS} Mitglieder. Bei mehr als {FORMATION_INCLUDED_MEMBERS} Mitgliedern
                      wird ein Zuschlag von 10 % pro zusätzlichem Mitglied verrechnet.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setMemberCount(m => Math.max(1, m - 1))}
                        className="w-10 h-10 border border-border font-heading font-bold hover:border-dark transition-colors"
                      >−</button>
                      <span className="font-heading font-bold text-xl w-12 text-center tabular-nums">{memberCount}</span>
                      <button
                        onClick={() => setMemberCount(m => m + 1)}
                        className="w-10 h-10 border border-border font-heading font-bold hover:border-dark transition-colors"
                      >+</button>
                      {formationExtra > 0 && (
                        <span className="font-sans text-xs text-accent-gold ml-2">+{formationExtra} × 10 % Zuschlag</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {(['pro', 'lernvideo'] as FormationPlanId[]).map(planId => {
                      const meta = formationPlanMeta[planId]
                      const active = formationPlan === planId
                      const price = formationYearlyPrice(planId, memberCount)
                      return (
                        <button
                          key={planId}
                          onClick={() => setFormationPlan(planId)}
                          className={`w-full text-left p-5 border-2 transition-all ${active ? (planId === 'pro' ? 'border-accent-gold bg-accent-gold/5' : 'border-dark bg-dark/5') : 'border-border hover:border-dark bg-surface'}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span>{meta.emoji}</span>
                                <span className="font-sans font-semibold text-sm">Formation {meta.label}</span>
                                <span className="font-sans text-[10px] font-medium px-2 py-0.5 bg-accent-gold/15 text-accent-gold border border-accent-gold/30">{meta.audience}</span>
                              </div>
                              <p className="font-sans text-xs text-text-secondary leading-relaxed">{meta.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="font-heading font-bold text-xl text-accent-gold">{chf(price)}</span>
                              <span className="font-sans text-xs text-text-secondary block">/ Jahr</span>
                              {formationExtra > 0 && (
                                <span className="font-sans text-[10px] text-text-secondary block">Basis {chf(meta.basePrice)}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Enthalten (Formation) */}
                  <div className="bg-background border border-border p-5 mb-8">
                    <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Enthalten — Formation {formationPlanMeta[formationPlan].label}</p>
                    <div className="space-y-2">
                      {formationPlanMeta[formationPlan].features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 font-sans text-sm">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                          <span>{f}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 font-sans text-sm text-accent-gold">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                        <span>20 % Rabatt auf Instrumentenmieten (Jahresabo)</span>
                      </div>
                    </div>
                    {formationPlanMeta[formationPlan].notIncluded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-2">
                        <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-1">Nicht enthalten</p>
                        {formationPlanMeta[formationPlan].notIncluded!.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 font-sans text-sm text-text-secondary">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-secondary/60 flex-shrink-0"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="font-sans text-xs text-text-secondary border-t border-border mt-4 pt-4">Gilt für bis zu {FORMATION_INCLUDED_MEMBERS} Mitglieder · {memberCount} Mitglied{memberCount !== 1 ? 'er' : ''} gewählt</p>
                  </div>
                </>
              )}

              {/* Payment */}
              <div className="mb-8">
                <h3 className="font-heading font-bold text-lg mb-4">Zahlungsmittel</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'card', label: 'Kredit- / Debitkarte', sub: 'Visa, Mastercard', icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    )},
                    { id: 'twint', label: 'TWINT', sub: 'Direkte Zahlung per Smartphone', icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    )},
                    { id: 'vorkasse', label: 'Vorkasse', sub: 'Zahlung per Banküberweisung im Voraus', icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>
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
              {accountType === 'formation' ? (
                <>
                  <h1 className="font-heading text-3xl font-bold mb-2">Profile der Formationsmitglieder</h1>
                  <p className="font-sans text-text-secondary text-sm mb-6">
                    Für jedes der {memberCount} Mitglieder wird ein eigenes Konto mit eigenem Login und eigenem LAEMU-Profil erstellt.
                  </p>

                  {/* Info: Bestätigungs-E-Mail & Login-Abschluss der weiteren Mitglieder */}
                  <div className="bg-accent-gold/5 border border-accent-gold/30 p-4 mb-8 flex gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
                    <div>
                      <p className="font-sans text-sm font-semibold mb-1">So erhalten die anderen Mitglieder Zugang</p>
                      <p className="font-sans text-xs text-text-secondary leading-relaxed">
                        Sobald du die Registrierung abgeschlossen und das Abo bezahlt hast, erhält jedes weitere Mitglied
                        automatisch ein Bestätigungs-E-Mail. Damit schliesst es sein Login ab (Passwort setzen) und kann
                        sich anschliessend ab sofort bei LAEMU einloggen — mit Zugriff auf die hier zugewiesenen Instrumente.
                      </p>
                      <p className="font-sans text-xs text-text-secondary leading-relaxed mt-2">
                        Die Grunddaten (Name, E-Mail und Instrument-Zugriff) legst du hier verbindlich fest. Die Mitglieder
                        können später nur optionale Profilangaben (Profilbild, Bio, Social Media) ergänzen — die Grunddaten
                        lassen sich von ihnen nicht ändern.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {Array.from({ length: memberCount }).map((_, idx) => (
                      <div key={idx} className="border border-border bg-surface p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-heading font-bold text-base">Mitglied {idx + 1}{idx === 0 ? ' (du)' : ''}</h3>
                          <span className="font-sans text-[10px] bg-accent-gold/15 text-accent-gold border border-accent-gold/30 px-2 py-0.5">Eigenes Konto &amp; Login</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="label text-text-secondary block mb-1.5">Vorname *</label><input type="text" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface" /></div>
                          <div><label className="label text-text-secondary block mb-1.5">Nachname *</label><input type="text" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface" /></div>
                        </div>
                        <div><label className="label text-text-secondary block mb-1.5">E-Mail-Adresse *</label><input type="email" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface" /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="label text-text-secondary block mb-1.5">Passwort *</label><input type="password" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface" /></div>
                          <div><label className="label text-text-secondary block mb-1.5">Geburtsdatum *</label><input type="date" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface text-text-secondary" /></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2"><label className="label text-text-secondary block mb-1.5">Strasse *</label><input type="text" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface" /></div>
                          <div><label className="label text-text-secondary block mb-1.5">Hausnummer *</label><input type="text" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface" /></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div><label className="label text-text-secondary block mb-1.5">PLZ *</label><input type="text" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface" /></div>
                          <div className="col-span-2"><label className="label text-text-secondary block mb-1.5">Ort *</label><input type="text" defaultValue={idx === 0 ? ort : ''} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface" /></div>
                        </div>
                        <div>
                          <label className="label text-text-secondary block mb-1.5">Zugriff: Für welches Instrument? *</label>
                          <p className="font-sans text-xs text-text-secondary mb-2.5 leading-relaxed">
                            Wähle, für welche(s) Instrument(e) dieses Mitglied innerhalb des Formationsabos Zugriff auf die Lehrgänge und Lernvideos erhält.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {ACADEMY_INSTRUMENTS.map(inst => {
                              const sel = (memberInstruments[idx] ?? []).includes(inst)
                              return (
                                <button key={inst} onClick={() => toggleMemberInstrument(idx, inst)} className={`font-sans text-xs px-3 py-1.5 border transition-all ${sel ? 'border-dark bg-dark text-white' : 'border-border bg-surface text-text-secondary hover:border-dark'}`}>{inst}</button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
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

                    {/* Wohnort (automatisch aus den Angaben) */}
                    <div>
                      <label className="label text-text-secondary block mb-1.5">Wohnort</label>
                      <input
                        defaultValue={ort}
                        type="text"
                        placeholder="Luzern"
                        className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                      />
                      <p className="font-sans text-xs text-text-secondary mt-1.5">Automatisch aus deinen Angaben übernommen — du kannst ihn hier anpassen.</p>
                    </div>

                    {/* Instruments */}
                    <div>
                      <label className="label text-text-secondary block mb-3">Instrumente</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {PROFILE_INSTRUMENTS.map((inst) => (
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
                </>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors"
                >
                  ← Zurück
                </button>
                <button
                  onClick={() => setDone(true)}
                  disabled={!formationReady}
                  className={`flex-1 font-sans font-semibold py-4 transition-colors ${formationReady ? 'bg-accent-gold text-white hover:bg-dark' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Registrierung abschliessen ✓
                </button>
              </div>
              {accountType === 'formation' ? (
                !formationReady && (
                  <p className="font-sans text-xs text-text-secondary text-center mt-3">
                    Weise jedem Mitglied mindestens ein Instrument für den Zugriff zu, um die Registrierung abzuschliessen.
                  </p>
                )
              ) : (
                <button
                  onClick={() => setDone(true)}
                  className="w-full mt-3 font-sans text-sm text-text-secondary hover:text-dark transition-colors py-2"
                >
                  Überspringen — später im Profil ergänzen
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
