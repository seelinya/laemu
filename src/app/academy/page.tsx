'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Hero } from '@/components/sections/Hero'

// ─── Subscription data ───────────────────────────────────────────────────────

const plans = [
  { id: 'handorgel', label: 'Handorgel-Lehrgang', emoji: '🪗', monthlyChf: 29, yearlyChf: 278, desc: 'Strukturierter Lehrgang von Grundlagen bis Fortgeschrittenenstufe.' },
  { id: 'schwyzer', label: 'Schwyzerörgeli-Lehrgang', emoji: '🎶', monthlyChf: 29, yearlyChf: 278, desc: 'Diatonisch und voller Seele — von Anfänger bis Profi.' },
  { id: 'begleit', label: 'Begleitinstrument-Lehrgang', emoji: '🎸', monthlyChf: 25, yearlyChf: 240, desc: 'Bass, Klarinette, Klavier — dein Fundament in der Kapelle.' },
  { id: 'buehne', label: 'Bühnenpräsenz-Lehrgang', emoji: '🎤', monthlyChf: 39, yearlyChf: 374, desc: 'Auftritt, Ausdruck und Bühnenwirkung für Ländlermusiker.' },
  { id: 'videos', label: 'Lernvideo-Bibliothek', emoji: '🎬', monthlyChf: 15, yearlyChf: 144, desc: 'Zugang zur gesamten Lernvideo-Datenbank mit 200+ Stücken.' },
]

const formations = [
  { id: 'hess', name: 'Ländlerkapelle Hess' },
  { id: 'alpstein', name: 'Trio Alpstein' },
  { id: 'rigi', name: 'Quartett Rigi' },
]

// ─── AcademySubscribeModal ────────────────────────────────────────────────────

type ModalProps = {
  onClose: () => void
  initialPlanId?: string
}

function AcademySubscribeModal({ onClose, initialPlanId }: ModalProps) {
  const [step, setStep] = useState(1)
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlanId ?? '')
  const [purchaserType, setPurchaserType] = useState<'individual' | 'formation' | ''>('')
  const [selectedFormation, setSelectedFormation] = useState<string>('')
  const [customFormation, setCustomFormation] = useState('')
  const [accountMode, setAccountMode] = useState<'existing' | 'new' | ''>('')
  const [password, setPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const plan = plans.find(p => p.id === selectedPlan)
  const basePrice = billing === 'monthly' ? (plan?.monthlyChf ?? 0) : (plan?.yearlyChf ?? 0)
  const hasFormationDiscount = purchaserType === 'formation'
  const discountedPrice = hasFormationDiscount ? Math.round(basePrice * 0.8) : basePrice

  const stepTitles = [
    { title: 'Plan wählen', subtitle: 'Wähle deinen Lehrgang aus.' },
    { title: 'Wer kauft?', subtitle: 'Als Einzelperson oder als Teil einer Formation.' },
    { title: 'Konto', subtitle: 'Melde dich an oder erstelle ein neues Konto.' },
    { title: 'Bestätigung', subtitle: 'Überprüfe dein Abonnement.' },
  ]

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <motion.div
      key="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        className="relative bg-surface w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="h-1 bg-border">
          <motion.div
            className="h-full bg-accent-gold"
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div>
            <p className="font-sans text-xs text-text-secondary mb-0.5">Schritt {step} von 4</p>
            <h2 className="font-heading text-xl font-bold">{stepTitles[step - 1].title}</h2>
            <p className="font-sans text-sm text-text-secondary">{stepTitles[step - 1].subtitle}</p>
          </div>
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="font-sans text-sm text-text-secondary hover:text-dark transition-colors px-3 py-1.5 border border-border"
              >
                ← Zurück
              </button>
            )}
            <button
              onClick={onClose}
              className="font-sans text-xl text-text-secondary hover:text-dark transition-colors w-8 h-8 flex items-center justify-center"
              aria-label="Schliessen"
            >
              ×
            </button>
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Plan wählen ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Billing toggle */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    className={`font-sans text-sm px-4 py-2 border transition-colors ${billing === 'monthly' ? 'bg-dark text-white border-dark' : 'border-border text-text-secondary hover:border-dark'}`}
                    onClick={() => setBilling('monthly')}
                  >
                    Monatlich
                  </button>
                  <button
                    className={`font-sans text-sm px-4 py-2 border transition-colors ${billing === 'yearly' ? 'bg-dark text-white border-dark' : 'border-border text-text-secondary hover:border-dark'}`}
                    onClick={() => setBilling('yearly')}
                  >
                    Jährlich
                    <span className="ml-1.5 text-accent-gold text-xs font-medium">–20%</span>
                  </button>
                </div>

                {/* Plan cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {plans.map(p => {
                    const price = billing === 'monthly' ? p.monthlyChf : p.yearlyChf
                    const period = billing === 'monthly' ? '/Mt.' : '/Jahr'
                    const active = selectedPlan === p.id
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id)}
                        className={`text-left p-4 border transition-all ${active ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-2xl">{p.emoji}</span>
                          <span className="font-heading font-bold text-base">
                            CHF {price}
                            <span className="font-sans text-xs text-text-secondary font-normal ml-0.5">{period}</span>
                          </span>
                        </div>
                        <p className="font-heading font-bold text-sm mb-1">{p.label}</p>
                        <p className="font-sans text-xs text-text-secondary leading-snug">{p.desc}</p>
                      </button>
                    )
                  })}
                </div>

                <button
                  disabled={!selectedPlan}
                  onClick={() => setStep(2)}
                  className={`w-full py-3 font-sans font-medium text-sm transition-colors ${selectedPlan ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Weiter →
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: Wer kauft? ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {(['individual', 'formation'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setPurchaserType(type)}
                      className={`p-5 border text-center transition-all ${purchaserType === type ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                    >
                      <span className="text-3xl block mb-2">{type === 'individual' ? '👤' : '👥'}</span>
                      <p className="font-heading font-bold text-sm">
                        {type === 'individual' ? 'Als Einzelperson' : 'Als Teil einer Formation'}
                      </p>
                    </button>
                  ))}
                </div>

                {purchaserType === 'formation' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 space-y-3"
                  >
                    <select
                      value={selectedFormation}
                      onChange={e => setSelectedFormation(e.target.value)}
                      className="w-full border border-border px-3 py-2.5 font-sans text-sm bg-surface focus:outline-none focus:border-dark"
                    >
                      <option value="">Formation wählen…</option>
                      {formations.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                      <option value="other">Andere Formation…</option>
                    </select>
                    {selectedFormation === 'other' && (
                      <input
                        type="text"
                        placeholder="Name deiner Formation"
                        value={customFormation}
                        onChange={e => setCustomFormation(e.target.value)}
                        className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                      />
                    )}
                    <div className="bg-accent-gold/10 border border-accent-gold/30 p-4">
                      <p className="font-sans text-xs text-dark leading-relaxed">
                        <strong className="text-accent-gold">Formation-Rabatt: 20% günstiger</strong> — sofern sich eine weitere Person dieser Formation innerhalb von 14 Tagen ebenfalls anmeldet. Andernfalls entfällt der Rabatt automatisch.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Price summary */}
                {purchaserType && plan && (
                  <div className="border border-border p-4 mb-6 bg-background">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-sm text-text-secondary">{plan.label}</span>
                      <div className="text-right">
                        {hasFormationDiscount && (
                          <span className="font-sans text-xs text-text-secondary line-through mr-2">CHF {basePrice}</span>
                        )}
                        <span className="font-heading font-bold">
                          CHF {discountedPrice}
                          <span className="font-sans text-xs text-text-secondary font-normal ml-0.5">
                            {billing === 'monthly' ? '/Mt.' : '/Jahr'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  disabled={!purchaserType || (purchaserType === 'formation' && !selectedFormation) || (selectedFormation === 'other' && !customFormation)}
                  onClick={() => setStep(3)}
                  className={`w-full py-3 font-sans font-medium text-sm transition-colors ${(purchaserType && (purchaserType !== 'formation' || (selectedFormation && (selectedFormation !== 'other' || customFormation)))) ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Weiter →
                </button>
              </motion.div>
            )}

            {/* ── STEP 3: Konto ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {(['existing', 'new'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setAccountMode(mode)}
                      className={`p-4 border text-center transition-all ${accountMode === mode ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                    >
                      <span className="text-2xl block mb-2">{mode === 'existing' ? '🔑' : '✨'}</span>
                      <p className="font-heading font-bold text-xs leading-snug">
                        {mode === 'existing' ? 'Ich habe bereits ein LAEMU-Profil' : 'Ich bin neu bei LAEMU'}
                      </p>
                    </button>
                  ))}
                </div>

                {accountMode === 'existing' && (
                  <motion.div
                    key="existing-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3 mb-5"
                  >
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">E-Mail</label>
                      <input
                        type="email"
                        defaultValue="niklaus@laemu.ch"
                        className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">Passwort</label>
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Dein Passwort"
                        className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                      />
                    </div>
                    <button
                      onClick={() => setStep(4)}
                      className="w-full py-3 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors"
                    >
                      Anmelden &amp; weiter
                    </button>
                  </motion.div>
                )}

                {accountMode === 'new' && (
                  <motion.div
                    key="new-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3 mb-5"
                  >
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">Name</label>
                      <input
                        type="text"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        placeholder="Dein vollständiger Name"
                        className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">E-Mail</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        placeholder="deine@email.ch"
                        className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">Passwort</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Mindestens 8 Zeichen"
                        className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                      />
                    </div>
                    <button
                      onClick={() => setStep(4)}
                      className="w-full py-3 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors"
                    >
                      Konto erstellen &amp; weiter
                    </button>
                  </motion.div>
                )}

                {!accountMode && (
                  <p className="font-sans text-sm text-text-secondary text-center py-4">
                    Wähle eine Option oben, um fortzufahren.
                  </p>
                )}
              </motion.div>
            )}

            {/* ── STEP 4: Bestätigung ── */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <AnimatePresence mode="wait">
                  {!success ? (
                    <motion.div key="confirm" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* Summary */}
                      <div className="border border-border p-5 mb-6 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-sans text-xs text-text-secondary uppercase tracking-wide">Plan</span>
                          <span className="font-heading font-bold text-sm">{plan?.emoji} {plan?.label}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-sans text-xs text-text-secondary uppercase tracking-wide">Abrechnung</span>
                          <span className="font-sans text-sm">{billing === 'monthly' ? 'Monatlich' : 'Jährlich'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-sans text-xs text-text-secondary uppercase tracking-wide">Käufer</span>
                          <span className="font-sans text-sm">{purchaserType === 'individual' ? 'Einzelperson' : 'Formation'}</span>
                        </div>
                        <div className="border-t border-border pt-3 flex justify-between items-center">
                          <span className="font-sans text-xs text-text-secondary uppercase tracking-wide">Preis</span>
                          <div className="text-right">
                            {hasFormationDiscount && (
                              <span className="font-sans text-xs text-text-secondary line-through mr-2">CHF {basePrice}</span>
                            )}
                            <span className="font-heading font-bold text-lg">
                              CHF {discountedPrice}
                              <span className="font-sans text-sm text-text-secondary font-normal ml-0.5">
                                {billing === 'monthly' ? '/Mt.' : '/Jahr'}
                              </span>
                            </span>
                          </div>
                        </div>
                        {hasFormationDiscount && (
                          <p className="font-sans text-xs text-accent-gold">
                            20% Formation-Rabatt angewendet (vorbehaltlich Bestätigung)
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => setSuccess(true)}
                        className="w-full py-4 bg-accent-gold text-white font-sans font-semibold text-base hover:bg-accent-gold/90 transition-colors"
                      >
                        Jetzt abonnieren
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', damping: 20 }}
                      className="py-8 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                        className="w-20 h-20 rounded-full bg-accent-gold/10 border-2 border-accent-gold flex items-center justify-center mx-auto mb-6"
                      >
                        <span className="text-4xl">✓</span>
                      </motion.div>
                      <h3 className="font-heading text-2xl font-bold mb-2">Willkommen in der Academy!</h3>
                      <p className="font-sans text-text-secondary text-sm mb-8">
                        Dein Abonnement ist aktiv. Viel Freude beim Lernen!
                      </p>
                      <Link
                        href="/member/academy"
                        className="inline-block px-8 py-3 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors"
                      >
                        Zur Academy →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── SubscribePlans section ───────────────────────────────────────────────────

function SubscribePlans({ onSelectPlan }: { onSelectPlan: (planId: string) => void }) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <section className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="label text-accent-gold">Abonnements</span>
          <h2 className="heading-lg mt-3 mb-4">Dein Lehrgang. Dein Preis.</h2>
          <p className="body-lg text-text-secondary max-w-xl mx-auto mb-8">
            Wähle deinen Lehrgang und starte noch heute. Monatlich kündbar.
          </p>
          {/* Billing toggle */}
          <div className="inline-flex border border-border">
            <button
              className={`font-sans text-sm px-5 py-2.5 transition-colors ${billing === 'monthly' ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
              onClick={() => setBilling('monthly')}
            >
              Monatlich
            </button>
            <button
              className={`font-sans text-sm px-5 py-2.5 transition-colors ${billing === 'yearly' ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
              onClick={() => setBilling('yearly')}
            >
              Jährlich <span className="text-accent-gold text-xs font-medium ml-1">–20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {plans.map(p => {
            const price = billing === 'monthly' ? p.monthlyChf : p.yearlyChf
            const period = billing === 'monthly' ? '/Mt.' : '/Jahr'
            return (
              <div key={p.id} className="border border-border p-6 flex flex-col hover:border-accent-gold transition-colors group">
                <span className="text-4xl mb-4 block">{p.emoji}</span>
                <h3 className="font-heading font-bold text-base mb-2 group-hover:text-accent-gold transition-colors leading-snug">
                  {p.label}
                </h3>
                <p className="font-sans text-xs text-text-secondary leading-relaxed mb-4 flex-1">{p.desc}</p>
                <div className="mb-4">
                  <span className="font-heading text-2xl font-bold">CHF {price}</span>
                  <span className="font-sans text-xs text-text-secondary ml-1">{period}</span>
                </div>
                <button
                  onClick={() => onSelectPlan(p.id)}
                  className="w-full py-2.5 bg-dark text-white font-sans text-sm font-medium hover:bg-accent-gold transition-colors"
                >
                  Jetzt starten
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

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

const steps = [
  { num: '01', title: 'Kurs wählen', desc: 'Such dir dein Instrument und Niveau — von Anfänger bis Fortgeschrittene.' },
  { num: '02', title: 'Zugang erhalten', desc: 'Nach der Anmeldung erhältst du sofortigen Zugang zu allen Kursinhalten.' },
  { num: '03', title: 'Lernen & wachsen', desc: 'Lerne in deinem Tempo, mit echten Lehrern und strukturierten Lektionen.' },
  { num: '04', title: 'Fortschritt feiern', desc: 'Verfolge deine Entwicklung, erhalte Badges und teile Erfolge mit der Community.' },
]

const instruments = [
  { emoji: '🪗', name: 'Handorgel', desc: 'Das Herzstück der Ländlermusik', tiers: ['Schnupper', 'Starter', 'Pro'] },
  { emoji: '🎶', name: 'Schwyzerörgeli', desc: 'Diatonisch und voller Seele', tiers: ['Schnupper', 'Starter', 'Pro'] },
  { emoji: '🎹', name: 'Klavier', desc: 'Harmonischer Anker der Kapelle', tiers: ['Einsteiger', 'Fortgeschritten', 'Profi'] },
  { emoji: '🎸', name: 'Bass', desc: 'Das Fundament des Klangs', tiers: ['Einsteiger', 'Fortgeschritten', 'Profi'] },
  { emoji: '🎵', name: 'Klarinette', desc: 'Melodisch und ausdrucksstark', tiers: ['Einsteiger', 'Fortgeschritten', 'Profi'] },
]

const teachers = [
  { name: 'Hansruedi Wenger', instrument: 'Handorgel', bio: 'Über 30 Jahre Bühnenerfahrung und Leidenschaft fürs Lehren.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Maria Kälin', instrument: 'Schwyzerörgeli', bio: 'Preisgekrönte Musikerin und einfühlsame Lehrperson.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'Peter Gasser', instrument: 'Klarinette', bio: 'Konzertklarinettist mit Herz für die Volksmusik.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'Lisa Frei', instrument: 'Piano', bio: 'Klassisch ausgebildet und tief in der Ländlermusik verwurzelt.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
]

const gamification = [
  { icon: '🔥', title: 'Streaks', desc: 'Lerne täglich und bau deinen Streak auf.' },
  { icon: '🏆', title: 'Achievements', desc: 'Verdiene Abzeichen für deine Meilensteine.' },
  { icon: '⭐', title: 'Meilensteine', desc: 'Feiern besondere Lernerfolge.' },
  { icon: '📈', title: 'Fortschritt', desc: 'Sehe wie weit du schon gekommen bist.' },
]

const testimonials = [
  { name: 'Sandra B.', location: 'Luzern', rating: 5, text: 'Seit ich die LAEMU Academy nutze, hat sich mein Spiel enorm verbessert. Die Lehrpersonen sind fantastisch!' },
  { name: 'Markus H.', location: 'Bern', rating: 5, text: 'Endlich eine Plattform, die Ländlermusik modern vermittelt. Ich lerne schneller als je zuvor.' },
  { name: 'Elena R.', location: 'Zürich', rating: 5, text: 'Als Anfängerin war ich unsicher — aber der Schnupperkurs hat mich sofort begeistert. Jetzt bin ich im Pro-Kurs!' },
]

const faqs = [
  { q: 'Brauche ich Vorkenntnisse?', a: 'Nein! Wir bieten Kurse für alle Niveaus — vom absoluten Anfänger bis zum Fortgeschrittenen.' },
  { q: 'Kann ich jederzeit kündigen?', a: 'Ja, monatliche Abonnements können jederzeit per Ende Monat gekündigt werden. Keine Bindung.' },
  { q: 'Wie läuft ein Live-Call ab?', a: 'Monatlich finden gruppenbasierte Live-Calls via Video statt. Du kannst Fragen stellen und direkt Feedback erhalten.' },
  { q: 'Bekomme ich persönliches Feedback?', a: 'Im Pro-Kurs ja! Du kannst Videos einsenden und erhältst detailliertes, persönliches Feedback vom Lehrer.' },
  { q: 'Gibt es eine kostenlose Testphase?', a: 'Der Schnupperkurs ist unser Einstiegsangebot für CHF 29 — drei vollständige Lektionen ohne Abo-Bindung.' },
  { q: 'Sind die Kurse auf Schweizerdeutsch?', a: 'Die meisten Kurse werden auf Schweizerdeutsch gehalten, einige auch auf Hochdeutsch.' },
]

export default function AcademyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPlanId, setModalPlanId] = useState<string | undefined>(undefined)

  function openModal(planId?: string) {
    setModalPlanId(planId)
    setModalOpen(true)
  }

  return (
    <>
      <AnimatePresence>
        {modalOpen && (
          <AcademySubscribeModal
            onClose={() => setModalOpen(false)}
            initialPlanId={modalPlanId}
          />
        )}
      </AnimatePresence>

      <Hero
        title={"Lerne. Wachse.\nStrahle."}
        subtitle="Die LAEMU Academy — dein persönlicher Weg zur Meisterschaft in der Ländlermusik."
        primaryCta={{ label: 'Jetzt starten', href: '/member/academy' }}
        imageSrc="https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1920&q=80"
        size="large"
      />

      {/* HOW IT WORKS */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Der Weg</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">So funktioniert's</motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-xl mx-auto">
              In vier einfachen Schritten zu deiner musikalischen Meisterschaft.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} className="relative">
                {i < steps.length - 1 && (
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

      {/* INSTRUMENTS */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Instrumente</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Dein Instrument. Dein Kurs.</motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-xl mx-auto">
              Wähle dein Instrument und tauche ein in die Welt der Ländlermusik.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {instruments.map((inst) => (
              <motion.div key={inst.name} variants={fadeUp}>
                <Card hover padding="md" className="text-center cursor-pointer group">
                  <span className="text-4xl block mb-3">{inst.emoji}</span>
                  <h4 className="font-heading font-bold text-base mb-1 group-hover:text-accent-gold transition-colors">{inst.name}</h4>
                  <p className="font-sans text-xs text-text-secondary mb-3">{inst.desc}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {inst.tiers.map(t => (
                      <span key={t} className="font-sans text-[10px] px-1.5 py-0.5 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">{t}</span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Preise</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Wähle deinen Kurs</motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Schnupper',
                price: 'CHF 29',
                period: 'einmalig',
                tag: 'Für Neugierige',
                popular: false,
                features: ['3 vollständige Lektionen', 'Basis-Feedback', 'Community-Zugang inklusive', 'Kein Abo, keine Bindung'],
                cta: 'Jetzt schnuppern',
              },
              {
                name: 'Starter',
                price: 'CHF 79',
                period: '/Monat',
                tag: 'Für Einsteiger',
                popular: false,
                features: ['Strukturierter Lehrgang', 'Community-Zugang inklusive', 'Kurs-Chat mit Mitschülern', 'Monatliche Live-Calls', 'Fortschritts-Tracking & Badges'],
                cta: 'Starter beginnen',
              },
              {
                name: 'Pro',
                price: 'CHF 149',
                period: '/Monat',
                tag: 'Für Ambitionierte',
                popular: true,
                features: ['Alles aus Starter', 'Lernvideo-Datenbank (alle Stücke)', 'Persönliches Video-Feedback', 'Zugang zu Camps & Events', 'Direktzugang zu Lehrern', 'Einzelne Lernvideos kaufen (CHF 18)'],
                cta: 'Pro starten',
              },
            ].map((plan) => (
              <motion.div key={plan.name} variants={fadeUp}>
                <div
                  className={`relative p-8 h-full flex flex-col ${
                    plan.popular
                      ? 'bg-dark border-2 border-accent-gold'
                      : 'bg-surface border border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-gold text-white text-xs px-4 py-1 font-sans font-medium">
                      ⭐ MOST POPULAR
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className={`font-heading text-2xl font-bold mb-1 ${plan.popular ? 'text-white' : ''}`}>{plan.name}</h3>
                    <p className={`font-sans text-sm ${plan.popular ? 'text-white/60' : 'text-text-secondary'}`}>{plan.tag}</p>
                  </div>
                  <div className="mb-8">
                    <span className={`font-heading text-5xl font-bold ${plan.popular ? 'text-accent-gold' : ''}`}>{plan.price}</span>
                    <span className={`font-sans text-sm ${plan.popular ? 'text-white/50' : 'text-text-secondary'}`}>{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-center gap-3 font-sans text-sm ${plan.popular ? 'text-white/80' : ''}`}>
                        <span className={plan.popular ? 'text-accent-gold' : 'text-muted-green'}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => openModal()}
                    variant={plan.popular ? 'primary' : 'secondary'}
                    size="md"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* TEACHERS */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Die Lehrpersonen</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Lerne von den Besten.</motion.h2>
          </Section>
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teachers.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="group">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <Image src={t.img} alt={t.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 p-4">
                    <span className="font-sans text-xs text-accent-gold">{t.instrument}</span>
                  </div>
                </div>
                <h4 className="font-heading font-bold text-base mb-1">{t.name}</h4>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">{t.bio}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* GAMIFICATION */}
      <section className="py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Gamification</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mt-3 mb-4">Lerne spielerisch.</motion.h2>
          </Section>
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gamification.map((g) => (
              <motion.div key={g.title} variants={fadeUp}>
                <div className="text-center p-8 border border-white/10 hover:border-accent-gold transition-colors">
                  <span className="text-5xl block mb-4">{g.icon}</span>
                  <h3 className="font-heading text-lg font-bold text-white mb-2">{g.title}</h3>
                  <p className="font-sans text-white/50 text-sm">{g.desc}</p>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Stimmen</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-4">Was unsere Schüler sagen.</motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card padding="lg">
                  <div className="flex mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <span key={j} className="text-accent-gold">★</span>
                    ))}
                  </div>
                  <p className="font-sans text-text-secondary text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="font-heading font-bold text-sm">{t.name}</p>
                    <p className="font-sans text-xs text-text-secondary">{t.location}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* OFFLINE EVENTS */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.span variants={fadeUp} className="label text-accent-gold">Offline Erlebnisse</motion.span>
              <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-6">Mehr als Online-Lernen.</motion.h2>
              <motion.p variants={fadeUp} className="body-lg text-text-secondary mb-8">
                Ergänze dein digitales Lernen mit unvergesslichen Live-Erfahrungen.
              </motion.p>
              <Section className="space-y-6">
                {[
                  { icon: '🏕️', title: 'Lernwochenenden', desc: 'Intensive Wochenenden mit Gleichgesinnten in der Natur der Schweiz.' },
                  { icon: '⛺', title: 'Sommercamps', desc: 'Einwöchige Musiklager für alle Altersgruppen und Niveaus.' },
                  { icon: '📡', title: 'Live-Calls', desc: 'Monatliche Online-Sessions mit deinem Lehrer und kleinen Gruppen.' },
                ].map((item) => (
                  <motion.div key={item.title} variants={fadeUp} className="flex gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-heading font-bold">{item.title}</h4>
                      <p className="font-sans text-sm text-text-secondary">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </Section>
            </div>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80"
                alt="Music camp"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </Section>
        </div>
      </section>

      {/* SUBSCRIBE PLANS */}
      <SubscribePlans onSelectPlan={(planId) => openModal(planId)} />

      {/* FAQ */}
      <section className="py-32 bg-background">
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
                      className="text-accent-gold text-xl font-light"
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

      {/* CTA */}
      <section className="py-32 bg-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Section>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mb-6">
              Bereit für dein nächstes musikalisches Level?
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/60 mb-10">
              Starte noch heute mit dem Schnupperkurs — kein Risiko, volle Begeisterung.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => openModal()} variant="primary" size="lg">Jetzt starten</Button>
              <Button href="/contact" variant="outline" size="lg">Frage stellen</Button>
            </motion.div>
          </Section>
        </div>
      </section>
    </>
  )
}
