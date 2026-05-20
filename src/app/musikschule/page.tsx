'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Hero } from '@/components/sections/Hero'

// ─── Utilities ───────────────────────────────────────────────────────────────

function chf(n: number): string {
  if (n >= 1000) {
    return `CHF ${Math.floor(n / 1000)}'${String(n % 1000).padStart(3, '0')}`
  }
  return `CHF ${n}`
}

// ─── Data ────────────────────────────────────────────────────────────────────

const instruments = [
  { id: 'handorgel', label: 'Handorgel', emoji: '🪗', subtitle: 'Das Herzstück der Ländlermusik' },
  { id: 'schwyzer', label: 'Schwyzerörgeli', emoji: '🎶', subtitle: 'Diatonisch und voller Seele' },
  { id: 'begleit', label: 'Begleitinstrument', emoji: '🎸', subtitle: 'Bass · Klarinette · Klavier' },
  { id: 'buehne', label: 'Bühnenpräsenz', emoji: '🎤', subtitle: 'Auftreten mit Ausstrahlung' },
]

type IndividualPlan = 'lernvideo' | 'starter' | 'pro'
type Scope = '1' | '2' | 'all'
type FormationPlan = 'pro_all' | 'formation_lernvideo'

const scopeLabels: Record<Scope, string> = {
  '1': '1 Instrument',
  '2': '2 Instrumente',
  'all': 'All-in-One',
}

const individualPricing: Record<string, Record<string, { monthly: number; yearly: number }>> = {
  lernvideo: { single: { monthly: 99, yearly: 999 } },
  starter: {
    '1': { monthly: 69, yearly: 699 },
    '2': { monthly: 99, yearly: 999 },
    'all': { monthly: 119, yearly: 1199 },
  },
  pro: {
    '1': { monthly: 119, yearly: 1199 },
    '2': { monthly: 149, yearly: 1499 },
    'all': { monthly: 169, yearly: 1699 },
  },
}

const formationPricingData: Record<FormationPlan, number> = {
  pro_all: 2499,
  formation_lernvideo: 1999,
}

const individualPlanMeta: Record<IndividualPlan, { label: string; emoji: string; badge: string | null; desc: string; features: string[]; hasScope: boolean }> = {
  lernvideo: {
    label: 'Lernvideodatenbank',
    emoji: '📹',
    badge: null,
    desc: 'Zugang zur gesamten Lernvideo-Datenbank für alle Instrumente der Ländlermusik.',
    features: [
      'Lernvideo-Datenbank (alle Instrumente)',
      'Ständig wachsendes Angebot',
      'LAEMU Membership inklusive',
    ],
    hasScope: false,
  },
  starter: {
    label: 'Starter',
    emoji: '🎓',
    badge: null,
    desc: 'Strukturierter Lehrgang mit Starter-Videos — wähle 1, 2 oder alle Instrumente.',
    features: [
      'Strukturierter Online-Lehrgang',
      'Starter-Videos in der Lernvideodatenbank',
      'Kurs-Chat & Community',
      'Lernfortschritt & Badges',
      'LAEMU Membership inklusive',
    ],
    hasScope: true,
  },
  pro: {
    label: 'Pro',
    emoji: '⭐',
    badge: 'Empfohlen',
    desc: 'Voller Zugang: Starter + komplette Lernvideodatenbank — für 1, 2 oder alle Instrumente.',
    features: [
      'Alles aus Starter',
      'Vollständige Lernvideo-Datenbank',
      'Persönliches Video-Feedback',
      'Monatliche Live-Calls',
      'LAEMU Membership inklusive',
    ],
    hasScope: true,
  },
}

// ─── Onboarding Quiz ─────────────────────────────────────────────────────────

type QuizResult = {
  label: string
  plan: IndividualPlan | FormationPlan
  scope?: Scope
  isFormation: boolean
  monthly?: number
  yearly: number
  tag: string
}

function deriveRecommendation(
  isFormation: boolean,
  level: 'beginner' | 'intermediate' | 'pro' | '',
  scope: Scope | '',
): QuizResult | null {
  if (!level) return null

  if (isFormation) {
    if (level === 'pro') {
      return { label: 'Lernvideodatenbank', plan: 'formation_lernvideo', isFormation: true, yearly: 1999, tag: 'Für Profis' }
    }
    return { label: 'Pro All-in-One', plan: 'pro_all', isFormation: true, yearly: 2499, tag: 'Für Aufsteiger' }
  }

  if (level === 'pro') {
    return { label: 'Lernvideodatenbank', plan: 'lernvideo', isFormation: false, monthly: 99, yearly: 999, tag: 'Für Könner' }
  }

  if (!scope) return null
  const planId: IndividualPlan = level === 'beginner' ? 'starter' : 'pro'
  const pricing = individualPricing[planId][scope]
  return {
    label: `${individualPlanMeta[planId].label} — ${scopeLabels[scope]}`,
    plan: planId,
    scope,
    isFormation: false,
    monthly: pricing.monthly,
    yearly: pricing.yearly,
    tag: level === 'beginner' ? 'Für Einsteiger' : 'Für Fortgeschrittene',
  }
}

type OnboardingQuizProps = {
  onStartSubscription: (config: { purchaserType: 'individual' | 'formation'; plan?: IndividualPlan | FormationPlan; scope?: Scope }) => void
}

function OnboardingQuiz({ onStartSubscription }: OnboardingQuizProps) {
  const [formation, setFormation] = useState<boolean | null>(null)
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'pro' | ''>('')
  const [scope, setScope] = useState<Scope | ''>('')

  const showLevel = formation !== null
  const showScope = showLevel && level !== '' && level !== 'pro' && formation === false
  const result = formation !== null ? deriveRecommendation(formation, level, scope) : null
  const showResult = result !== null && (formation === true || (level === 'pro' || scope !== ''))

  function reset() {
    setFormation(null)
    setLevel('')
    setScope('')
  }

  return (
    <div className="bg-surface border border-border p-8 max-w-2xl mx-auto">
      <p className="font-sans text-xs text-accent-gold uppercase tracking-widest mb-2">Angebots-Finder</p>
      <h3 className="font-heading text-2xl font-bold mb-6">Finde dein passendes Angebot</h3>

      {/* Q1 */}
      <div className="mb-6">
        <p className="font-sans text-sm font-medium mb-3">Spielst du in einer Formation?</p>
        <div className="flex gap-3">
          {[{ val: false, label: '👤 Nein, ich spiele solo' }, { val: true, label: '👥 Ja, wir sind eine Formation' }].map(opt => (
            <button
              key={String(opt.val)}
              onClick={() => { setFormation(opt.val); setLevel(''); setScope('') }}
              className={`flex-1 py-3 px-4 border font-sans text-sm text-left transition-all ${formation === opt.val ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border hover:border-dark'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Q2 */}
      <AnimatePresence>
        {showLevel && (
          <motion.div
            key="q2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <p className="font-sans text-sm font-medium mb-3">
              {formation ? 'Wie erfahren ist eure Formation?' : 'Wie erfahren bist du?'}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'beginner' as const, label: '🌱 Einsteiger', desc: 'Wenig oder keine Erfahrung' },
                { val: 'intermediate' as const, label: '🎵 Gut', desc: 'Spielst schon eine Weile' },
                { val: 'pro' as const, label: '🏆 Profi', desc: 'Erfahrener Musiker' },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => { setLevel(opt.val); setScope('') }}
                  className={`py-3 px-3 border font-sans text-xs text-left transition-all ${level === opt.val ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                >
                  <span className="block font-medium mb-0.5">{opt.label}</span>
                  <span className="text-text-secondary">{opt.desc}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Q3 */}
      <AnimatePresence>
        {showScope && (
          <motion.div
            key="q3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <p className="font-sans text-sm font-medium mb-3">Für wie viele Instrumente interessierst du dich?</p>
            <div className="grid grid-cols-3 gap-3">
              {([
                { val: '1' as Scope, label: '1 Instrument', desc: 'Fokus auf ein Instrument' },
                { val: '2' as Scope, label: '2 Instrumente', desc: 'Zwei Instrumente lernen' },
                { val: 'all' as Scope, label: 'Alle Instrumente', desc: 'Das komplette Angebot' },
              ]).map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setScope(opt.val)}
                  className={`py-3 px-3 border font-sans text-xs text-left transition-all ${scope === opt.val ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                >
                  <span className="block font-medium mb-0.5">{opt.label}</span>
                  <span className="text-text-secondary">{opt.desc}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-accent-gold bg-accent-gold/5 p-5"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="font-sans text-xs text-accent-gold uppercase tracking-widest mb-1 block">Empfehlung für dich</span>
                <p className="font-heading text-xl font-bold">{result.label}</p>
                <p className="font-sans text-xs text-text-secondary mt-0.5">{result.tag}</p>
              </div>
              <div className="text-right flex-shrink-0">
                {result.monthly && (
                  <p className="font-sans text-sm text-text-secondary">
                    {chf(result.monthly)}<span className="text-xs">/Mt.</span>
                  </p>
                )}
                <p className="font-heading font-bold text-xl">
                  {chf(result.yearly)}<span className="font-sans text-sm text-text-secondary font-normal">/Jahr</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  onStartSubscription({
                    purchaserType: result.isFormation ? 'formation' : 'individual',
                    plan: result.plan as IndividualPlan | FormationPlan,
                    scope: result.scope,
                  })
                }
                className="flex-1 py-3 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors"
              >
                Jetzt abonnieren →
              </button>
              <button
                onClick={reset}
                className="px-4 py-3 border border-border font-sans text-sm text-text-secondary hover:border-dark transition-colors"
              >
                Zurücksetzen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Subscription Modal ───────────────────────────────────────────────────────

type ModalConfig = {
  purchaserType?: 'individual' | 'formation'
  plan?: IndividualPlan | FormationPlan
  scope?: Scope
}

type ModalProps = {
  onClose: () => void
  initial?: ModalConfig
}

function MusiksSchuleModal({ onClose, initial }: ModalProps) {
  const [step, setStep] = useState(initial?.purchaserType ? 2 : 1)
  const [purchaserType, setPurchaserType] = useState<'individual' | 'formation' | ''>(initial?.purchaserType ?? '')
  // Individual state
  const [indPlan, setIndPlan] = useState<IndividualPlan | ''>(
    (initial?.plan && ['lernvideo', 'starter', 'pro'].includes(initial.plan)) ? (initial.plan as IndividualPlan) : ''
  )
  const [scope, setScope] = useState<Scope | ''>(initial?.scope ?? '')
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')
  // Formation state
  const [formPlan, setFormPlan] = useState<FormationPlan | ''>(
    (initial?.plan && ['pro_all', 'formation_lernvideo'].includes(initial.plan)) ? (initial.plan as FormationPlan) : ''
  )
  const [formationName, setFormationName] = useState('')
  // Account state
  const [accountMode, setAccountMode] = useState<'existing' | 'new' | ''>('')
  const [email, setEmail] = useState('niklaus@laemu.ch')
  const [password, setPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const isFormation = purchaserType === 'formation'
  const meta = indPlan ? individualPlanMeta[indPlan] : null
  const needsScope = !isFormation && (indPlan === 'starter' || indPlan === 'pro')
  const numInstruments = scope === 'all' ? null : scope === '2' ? 2 : 1

  function getPrice(): number {
    if (isFormation && formPlan) return formationPricingData[formPlan]
    if (!indPlan) return 0
    if (indPlan === 'lernvideo') {
      return billing === 'monthly' ? 99 : 999
    }
    if (scope) {
      const p = individualPricing[indPlan][scope]
      return billing === 'monthly' ? p.monthly : p.yearly
    }
    return 0
  }

  const price = getPrice()
  const billingLabel = isFormation ? '/Jahr' : billing === 'monthly' ? '/Mt.' : '/Jahr'

  const canProceedStep2 = isFormation
    ? (formPlan !== '' && formationName.trim().length > 0)
    : indPlan !== '' && (
        indPlan === 'lernvideo' ||
        (scope !== '' && (scope === 'all' || selectedInstruments.length === parseInt(scope)))
      )

  const canProceedStep3 = accountMode !== '' && (
    accountMode === 'existing' ? (email.trim() !== '' && password !== '') :
    (newName.trim() !== '' && newEmail.trim() !== '' && newPassword.length >= 8)
  )

  const stepTitles = [
    { title: 'Wer bist du?', subtitle: 'Einzelperson oder Formation?' },
    { title: 'Paket wählen', subtitle: isFormation ? 'Das passende Angebot für deine Formation.' : 'Wähle dein Abonnement.' },
    { title: 'Konto', subtitle: 'Melde dich an oder erstelle ein neues Konto.' },
    { title: 'Bestätigung', subtitle: 'Überprüfe dein Abonnement und schliesse ab.' },
  ]

  function toggleInstrument(id: string) {
    const max = numInstruments ?? 0
    setSelectedInstruments(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= max) return [...prev.slice(-(max - 1)), id]
      return [...prev, id]
    })
  }

  function handlePurchaserType(type: 'individual' | 'formation') {
    setPurchaserType(type)
    setIndPlan('')
    setFormPlan('')
    setScope('')
    setSelectedInstruments([])
    setStep(2)
  }

  function handleIndPlanSelect(plan: IndividualPlan) {
    setIndPlan(plan)
    setScope('')
    setSelectedInstruments([])
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  const { title, subtitle } = stepTitles[step - 1]

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
        className="relative bg-surface w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl"
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
            <h2 className="font-heading text-xl font-bold">{title}</h2>
            <p className="font-sans text-sm text-text-secondary">{subtitle}</p>
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

        {/* Membership badge */}
        <div className="px-6 pt-4">
          <div className="inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/30 px-3 py-1.5">
            <span className="text-accent-gold text-xs">✓</span>
            <span className="font-sans text-xs font-medium">LAEMU Membership in jedem Abo inklusive</span>
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-6">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Wer bist du? ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handlePurchaserType('individual')}
                    className="group p-6 border border-border hover:border-accent-gold text-center transition-all hover:bg-accent-gold/5"
                  >
                    <span className="text-4xl block mb-3">👤</span>
                    <p className="font-heading font-bold text-base mb-1 group-hover:text-accent-gold transition-colors">Einzelperson</p>
                    <p className="font-sans text-xs text-text-secondary">Ich lerne für mich</p>
                  </button>
                  <button
                    onClick={() => handlePurchaserType('formation')}
                    className="group p-6 border border-border hover:border-accent-gold text-center transition-all hover:bg-accent-gold/5"
                  >
                    <span className="text-4xl block mb-3">👥</span>
                    <p className="font-heading font-bold text-base mb-1 group-hover:text-accent-gold transition-colors">Formation</p>
                    <p className="font-sans text-xs text-text-secondary">Wir lernen gemeinsam</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Paket wählen ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Individual plans */}
                {!isFormation && (
                  <>
                    {/* Billing toggle */}
                    <div className="flex items-center gap-2 mb-5">
                      <button
                        onClick={() => setBilling('monthly')}
                        className={`font-sans text-xs px-4 py-2 border transition-colors ${billing === 'monthly' ? 'bg-dark text-white border-dark' : 'border-border text-text-secondary hover:border-dark'}`}
                      >
                        Monatlich
                      </button>
                      <button
                        onClick={() => setBilling('yearly')}
                        className={`font-sans text-xs px-4 py-2 border transition-colors relative ${billing === 'yearly' ? 'bg-dark text-white border-dark' : 'border-border text-text-secondary hover:border-dark'}`}
                      >
                        Jährlich
                        <span className="ml-1.5 text-accent-gold font-medium">–14%</span>
                      </button>
                      {billing === 'yearly' && (
                        <span className="font-sans text-[10px] text-text-secondary ml-1">Rabattcodes nur für Jahresabos</span>
                      )}
                    </div>

                    {/* Plan cards */}
                    <div className="space-y-3 mb-4">
                      {(['lernvideo', 'starter', 'pro'] as IndividualPlan[]).map((planId) => {
                        const m = individualPlanMeta[planId]
                        const isActive = indPlan === planId
                        const priceVal = planId === 'lernvideo'
                          ? (billing === 'monthly' ? 99 : 999)
                          : scope ? individualPricing[planId][scope][billing] : null
                        const period = billing === 'monthly' ? '/Mt.' : '/Jahr'

                        return (
                          <div
                            key={planId}
                            className={`border transition-all ${isActive ? 'border-accent-gold' : 'border-border'}`}
                          >
                            <button
                              className="w-full text-left p-4"
                              onClick={() => handleIndPlanSelect(planId)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors ${isActive ? 'border-accent-gold bg-accent-gold' : 'border-border'}`} />
                                  <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="font-heading font-bold text-sm">{m.emoji} {m.label}</span>
                                      {m.badge && (
                                        <span className="font-sans text-[10px] bg-accent-gold text-white px-1.5 py-0.5">{m.badge}</span>
                                      )}
                                    </div>
                                    <p className="font-sans text-xs text-text-secondary leading-relaxed">{m.desc}</p>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-3">
                                  {priceVal ? (
                                    <span className="font-heading font-bold text-sm">{chf(priceVal)}<span className="font-sans text-xs text-text-secondary font-normal">{period}</span></span>
                                  ) : (
                                    <span className="font-sans text-xs text-text-secondary">ab {chf(individualPricing[planId]['1'][billing])}<span>{period}</span></span>
                                  )}
                                </div>
                              </div>
                            </button>

                            {/* Scope + instrument selection (Starter/Pro) */}
                            <AnimatePresence>
                              {isActive && m.hasScope && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden border-t border-border bg-background"
                                >
                                  <div className="p-4">
                                    <p className="font-sans text-[10px] text-text-secondary uppercase tracking-widest mb-2">Umfang wählen</p>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                      {(['1', '2', 'all'] as Scope[]).map(s => {
                                        const p = individualPricing[planId][s][billing]
                                        return (
                                          <button
                                            key={s}
                                            onClick={() => { setScope(s); setSelectedInstruments([]) }}
                                            className={`py-2 px-2 border text-xs text-center transition-all ${scope === s ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                                          >
                                            <span className="block font-medium">{scopeLabels[s]}</span>
                                            <span className="text-text-secondary">{chf(p)}<span className="text-[10px]">{billing === 'monthly' ? '/Mt.' : '/J.'}</span></span>
                                          </button>
                                        )
                                      })}
                                    </div>

                                    {/* Instrument picker (only for 1 or 2 instruments) */}
                                    <AnimatePresence>
                                      {(scope === '1' || scope === '2') && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          <p className="font-sans text-[10px] text-text-secondary uppercase tracking-widest mb-2">
                                            {scope === '1' ? 'Wähle dein Instrument' : 'Wähle deine 2 Instrumente'}
                                          </p>
                                          <div className="grid grid-cols-2 gap-2">
                                            {instruments.map(inst => {
                                              const sel = selectedInstruments.includes(inst.id)
                                              return (
                                                <button
                                                  key={inst.id}
                                                  onClick={() => toggleInstrument(inst.id)}
                                                  className={`text-left px-3 py-2.5 border text-xs transition-all ${sel ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                                                >
                                                  <span className="mr-1.5">{inst.emoji}</span>
                                                  <span className="font-medium">{inst.label}</span>
                                                  <span className="block text-text-secondary text-[10px] mt-0.5 ml-5">{inst.subtitle}</span>
                                                </button>
                                              )
                                            })}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}

                {/* Formation plans */}
                {isFormation && (
                  <div className="space-y-4 mb-5">
                    {([
                      { id: 'pro_all' as FormationPlan, emoji: '🏆', label: 'Pro All-in-One', price: 2499, tag: 'Für Aufsteiger', desc: 'Pro-Zugang für alle Mitglieder — alle Instrumente, volle Lernvideodatenbank.', features: ['Pro-Lehrgang für alle Mitglieder', 'Alle 4 Instrumente inklusive', 'Vollständige Lernvideo-Datenbank', 'Live-Calls & Video-Feedback', 'LAEMU Membership für alle'] },
                      { id: 'formation_lernvideo' as FormationPlan, emoji: '📹', label: 'Lernvideodatenbank', price: 1999, tag: 'Für Profis', desc: 'Zugang zur gesamten Lernvideo-Datenbank für alle Mitglieder.', features: ['Lernvideo-Datenbank für alle', 'Alle Instrumente inklusive', 'LAEMU Membership für alle'] },
                    ]).map(plan => (
                      <button
                        key={plan.id}
                        onClick={() => setFormPlan(plan.id)}
                        className={`w-full text-left p-5 border transition-all ${formPlan === plan.id ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-heading font-bold">{plan.emoji} {plan.label}</span>
                              <span className="font-sans text-[10px] border border-accent-gold/40 text-accent-gold px-1.5 py-0.5">{plan.tag}</span>
                            </div>
                            <p className="font-sans text-xs text-text-secondary">{plan.desc}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <span className="font-heading font-bold">{chf(plan.price)}</span>
                            <span className="font-sans text-xs text-text-secondary">/Jahr</span>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {plan.features.map(f => (
                            <li key={f} className="font-sans text-xs text-text-secondary flex items-center gap-1.5">
                              <span className="text-accent-gold">✓</span>{f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}

                    {/* Formation name */}
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1.5">Name deiner Formation</label>
                      <input
                        type="text"
                        value={formationName}
                        onChange={e => setFormationName(e.target.value)}
                        placeholder="z. B. Trio Alpstein"
                        className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                      />
                      <p className="font-sans text-[10px] text-text-secondary mt-1">Alle Formationsmitglieder erhalten mit diesem Abo Zugang.</p>
                    </div>
                  </div>
                )}

                {/* Price summary */}
                {price > 0 && canProceedStep2 && (
                  <div className="bg-background border border-border p-3 mb-4 flex justify-between items-center">
                    <span className="font-sans text-sm text-text-secondary">Total</span>
                    <span className="font-heading font-bold text-lg">
                      {chf(price)}
                      <span className="font-sans text-sm text-text-secondary font-normal ml-0.5">{billingLabel}</span>
                    </span>
                  </div>
                )}

                <button
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                  className={`w-full py-3 font-sans font-medium text-sm transition-colors ${canProceedStep2 ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
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
                        {mode === 'existing' ? 'Ich habe ein LAEMU-Konto' : 'Ich bin neu bei LAEMU'}
                      </p>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {accountMode === 'existing' && (
                    <motion.div key="existing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mb-5">
                      <div>
                        <label className="font-sans text-xs text-text-secondary block mb-1">E-Mail</label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
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
                    </motion.div>
                  )}
                  {accountMode === 'new' && (
                    <motion.div key="new" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mb-5">
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
                    </motion.div>
                  )}
                </AnimatePresence>

                {!accountMode && (
                  <p className="font-sans text-sm text-text-secondary text-center py-4 mb-5">
                    Wähle eine Option oben, um fortzufahren.
                  </p>
                )}

                <button
                  disabled={!canProceedStep3}
                  onClick={() => setStep(4)}
                  className={`w-full py-3 font-sans font-medium text-sm transition-colors ${canProceedStep3 ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Weiter →
                </button>
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
                      <div className="border border-border p-5 mb-6 space-y-3">
                        {/* Plan */}
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-0.5">Paket</p>
                            {isFormation ? (
                              <p className="font-heading font-bold text-sm">
                                {formPlan === 'pro_all' ? '🏆 Pro All-in-One' : '📹 Lernvideodatenbank'} (Formation)
                              </p>
                            ) : (
                              <p className="font-heading font-bold text-sm">
                                {indPlan ? `${individualPlanMeta[indPlan].emoji} ${individualPlanMeta[indPlan].label}` : '—'}
                                {scope && ` — ${scopeLabels[scope]}`}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Instrument selection */}
                        {selectedInstruments.length > 0 && (
                          <div>
                            <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-0.5">Instrument(e)</p>
                            <p className="font-sans text-sm">
                              {selectedInstruments.map(id => {
                                const inst = instruments.find(i => i.id === id)
                                return inst ? `${inst.emoji} ${inst.label}` : id
                              }).join(' · ')}
                            </p>
                          </div>
                        )}

                        {/* Formation name */}
                        {isFormation && formationName && (
                          <div>
                            <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-0.5">Formation</p>
                            <p className="font-sans text-sm">{formationName}</p>
                          </div>
                        )}

                        {/* Billing */}
                        {!isFormation && (
                          <div>
                            <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-0.5">Abrechnung</p>
                            <p className="font-sans text-sm">{billing === 'monthly' ? 'Monatlich' : 'Jährlich'}</p>
                          </div>
                        )}

                        {/* Membership */}
                        <div className="flex items-center gap-1.5 py-1">
                          <span className="text-accent-gold text-xs">✓</span>
                          <span className="font-sans text-xs text-text-secondary">LAEMU Membership inklusive</span>
                        </div>

                        {/* Total */}
                        <div className="border-t border-border pt-3 flex justify-between items-center">
                          <span className="font-sans text-sm text-text-secondary uppercase tracking-wide">Total</span>
                          <span className="font-heading font-bold text-xl">
                            {chf(price)}
                            <span className="font-sans text-sm text-text-secondary font-normal ml-0.5">{billingLabel}</span>
                          </span>
                        </div>
                      </div>

                      {/* Discount code field */}
                      {!isFormation && billing === 'yearly' && (
                        <div className="mb-4">
                          <label className="font-sans text-xs text-text-secondary block mb-1.5">Rabattcode (optional)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="z. B. LAEMU2026"
                              className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark"
                            />
                            <button className="px-4 py-2 border border-border font-sans text-sm text-text-secondary hover:border-dark transition-colors">
                              Anwenden
                            </button>
                          </div>
                        </div>
                      )}

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
                      <h3 className="font-heading text-2xl font-bold mb-2">Willkommen in der Musikschule!</h3>
                      <p className="font-sans text-text-secondary text-sm mb-2">
                        Dein Abonnement ist aktiv — viel Freude beim Lernen!
                      </p>
                      <p className="font-sans text-xs text-text-secondary mb-8">
                        Deine LAEMU Membership ist ab sofort ebenfalls aktiv.
                      </p>
                      <Link
                        href="/member/academy"
                        className="inline-block px-8 py-3 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors"
                      >
                        Zur Musikschule →
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

// ─── Offering Overview (public pricing section) ───────────────────────────────

type OfferingOverviewProps = {
  onSelectPlan: (config: ModalConfig) => void
}

function OfferingOverview({ onSelectPlan }: OfferingOverviewProps) {
  const [tab, setTab] = useState<'individual' | 'formation'>('individual')
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')
  const [starterScope, setStarterScope] = useState<Scope>('1')
  const [proScope, setProScope] = useState<Scope>('1')

  return (
    <section className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="label text-accent-gold">Angebote</span>
          <h2 className="heading-lg mt-3 mb-4">Das richtige Angebot für dich.</h2>
          <p className="body-lg text-text-secondary max-w-xl mx-auto mb-8">
            Egal ob du alleine lernst oder in einer Formation spielst — wir haben das passende Abo.
          </p>

          {/* Tab: Individual / Formation */}
          <div className="inline-flex border border-border mb-8">
            <button
              onClick={() => setTab('individual')}
              className={`font-sans text-sm px-6 py-3 transition-colors ${tab === 'individual' ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
            >
              👤 Einzelpersonen
            </button>
            <button
              onClick={() => setTab('formation')}
              className={`font-sans text-sm px-6 py-3 transition-colors ${tab === 'formation' ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
            >
              👥 Formationen
            </button>
          </div>
        </div>

        {/* Individual offering */}
        <AnimatePresence mode="wait">
          {tab === 'individual' && (
            <motion.div
              key="individual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Billing toggle */}
              <div className="flex justify-center mb-10">
                <div className="inline-flex border border-border">
                  <button
                    onClick={() => setBilling('monthly')}
                    className={`font-sans text-sm px-5 py-2.5 transition-colors ${billing === 'monthly' ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
                  >
                    Monatlich
                  </button>
                  <button
                    onClick={() => setBilling('yearly')}
                    className={`font-sans text-sm px-5 py-2.5 transition-colors ${billing === 'yearly' ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
                  >
                    Jährlich <span className="text-accent-gold text-xs ml-1">–14%</span>
                  </button>
                </div>
                {billing === 'yearly' && (
                  <span className="ml-3 flex items-center font-sans text-xs text-text-secondary">Rabattcodes nur für Jahresabos</span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lernvideodatenbank */}
                <div className="relative border border-border p-6 flex flex-col hover:border-accent-gold transition-colors group">
                  <p className="font-sans text-2xl mb-2">📹</p>
                  <h3 className="font-heading text-xl font-bold mb-1 group-hover:text-accent-gold transition-colors">Lernvideodatenbank</h3>
                  <p className="font-sans text-xs text-text-secondary mb-4 leading-relaxed">
                    Voller Zugang zur Lernvideo-Datenbank für alle Instrumente — ideal für Könner, die Referenz-Videos und neue Stücke suchen.
                  </p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {['Lernvideo-Datenbank (alle Instrumente)', 'Alle Stücke & Genres inklusive', 'Ständig wachsendes Angebot', 'LAEMU Membership inklusive'].map(f => (
                      <li key={f} className="flex items-start gap-2 font-sans text-xs">
                        <span className="text-accent-gold mt-0.5 flex-shrink-0">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <div className="mb-5">
                    <span className="font-heading text-3xl font-bold">{chf(billing === 'monthly' ? 99 : 999)}</span>
                    <span className="font-sans text-xs text-text-secondary ml-1">{billing === 'monthly' ? '/Mt.' : '/Jahr'}</span>
                  </div>
                  <button
                    onClick={() => onSelectPlan({ purchaserType: 'individual', plan: 'lernvideo' })}
                    className="w-full py-2.5 border border-dark text-dark font-sans text-sm font-medium hover:bg-dark hover:text-white transition-colors"
                  >
                    Jetzt starten
                  </button>
                </div>

                {/* Starter */}
                <div className="relative border border-border p-6 flex flex-col hover:border-accent-gold transition-colors group">
                  <p className="font-sans text-2xl mb-2">🎓</p>
                  <h3 className="font-heading text-xl font-bold mb-1 group-hover:text-accent-gold transition-colors">Starter</h3>
                  <p className="font-sans text-xs text-text-secondary mb-4 leading-relaxed">
                    Strukturierter Lehrgang für Einsteiger — mit Starter-Videos in der Datenbank. Wähle 1, 2 oder alle Instrumente.
                  </p>
                  <ul className="space-y-2 mb-4 flex-1">
                    {['Strukturierter Online-Lehrgang', 'Starter-Videos in der Lernvideodatenbank', 'Kurs-Chat & Community', 'Lernfortschritt & Badges', 'LAEMU Membership inklusive'].map(f => (
                      <li key={f} className="flex items-start gap-2 font-sans text-xs">
                        <span className="text-accent-gold mt-0.5 flex-shrink-0">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  {/* Scope selector */}
                  <div className="grid grid-cols-3 gap-1.5 mb-4">
                    {(['1', '2', 'all'] as Scope[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setStarterScope(s)}
                        className={`py-1.5 text-center border font-sans text-[10px] transition-all ${starterScope === s ? 'border-accent-gold bg-accent-gold/5 text-dark' : 'border-border text-text-secondary hover:border-dark'}`}
                      >
                        {scopeLabels[s]}
                      </button>
                    ))}
                  </div>
                  <div className="mb-5">
                    <span className="font-heading text-3xl font-bold">{chf(individualPricing.starter[starterScope][billing])}</span>
                    <span className="font-sans text-xs text-text-secondary ml-1">{billing === 'monthly' ? '/Mt.' : '/Jahr'}</span>
                  </div>
                  <button
                    onClick={() => onSelectPlan({ purchaserType: 'individual', plan: 'starter', scope: starterScope })}
                    className="w-full py-2.5 border border-dark text-dark font-sans text-sm font-medium hover:bg-dark hover:text-white transition-colors"
                  >
                    Jetzt starten
                  </button>
                </div>

                {/* Pro */}
                <div className="relative border-2 border-accent-gold p-6 flex flex-col bg-dark text-white">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-gold text-white text-xs px-4 py-1 font-sans font-medium whitespace-nowrap">
                    ⭐ Empfohlen
                  </div>
                  <p className="font-sans text-2xl mb-2">⭐</p>
                  <h3 className="font-heading text-xl font-bold mb-1 text-white">Pro</h3>
                  <p className="font-sans text-xs text-white/60 mb-4 leading-relaxed">
                    Alles aus Starter plus vollständige Lernvideodatenbank. Für 1, 2 oder alle Instrumente.
                  </p>
                  <ul className="space-y-2 mb-4 flex-1">
                    {['Alles aus Starter', 'Vollständige Lernvideo-Datenbank', 'Persönliches Video-Feedback', 'Monatliche Live-Calls', 'LAEMU Membership inklusive'].map(f => (
                      <li key={f} className="flex items-start gap-2 font-sans text-xs text-white/80">
                        <span className="text-accent-gold mt-0.5 flex-shrink-0">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  {/* Scope selector */}
                  <div className="grid grid-cols-3 gap-1.5 mb-4">
                    {(['1', '2', 'all'] as Scope[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setProScope(s)}
                        className={`py-1.5 text-center border font-sans text-[10px] transition-all ${proScope === s ? 'border-accent-gold bg-accent-gold text-white' : 'border-white/20 text-white/60 hover:border-white/50'}`}
                      >
                        {scopeLabels[s]}
                      </button>
                    ))}
                  </div>
                  <div className="mb-5">
                    <span className="font-heading text-3xl font-bold text-accent-gold">{chf(individualPricing.pro[proScope][billing])}</span>
                    <span className="font-sans text-xs text-white/50 ml-1">{billing === 'monthly' ? '/Mt.' : '/Jahr'}</span>
                  </div>
                  <button
                    onClick={() => onSelectPlan({ purchaserType: 'individual', plan: 'pro', scope: proScope })}
                    className="w-full py-2.5 bg-accent-gold text-white font-sans text-sm font-medium hover:bg-accent-gold/90 transition-colors"
                  >
                    Jetzt starten
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Formation offering */}
          {tab === 'formation' && (
            <motion.div
              key="formation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {[
                  {
                    id: 'pro_all' as FormationPlan,
                    emoji: '🏆',
                    label: 'Pro All-in-One',
                    price: 2499,
                    tag: 'Für Aufsteiger',
                    popular: true,
                    desc: 'Das Rundum-Paket für eure Formation. Alle Mitglieder erhalten vollen Pro-Zugang für alle Instrumente.',
                    features: ['Pro-Lehrgang für alle Mitglieder', 'Alle 4 Instrumente inklusive', 'Vollständige Lernvideo-Datenbank', 'Live-Calls & Video-Feedback', 'LAEMU Membership für alle Mitglieder'],
                  },
                  {
                    id: 'formation_lernvideo' as FormationPlan,
                    emoji: '📹',
                    label: 'Lernvideodatenbank',
                    price: 1999,
                    tag: 'Für Profis',
                    popular: false,
                    desc: 'Für erfahrene Formationen. Alle Mitglieder erhalten Zugang zur gesamten Lernvideo-Datenbank.',
                    features: ['Lernvideo-Datenbank für alle Mitglieder', 'Alle Instrumente inklusive', 'Ständig wachsendes Angebot', 'LAEMU Membership für alle Mitglieder'],
                  },
                ].map(plan => (
                  <div
                    key={plan.id}
                    className={`relative p-8 flex flex-col ${plan.popular ? 'bg-dark border-2 border-accent-gold' : 'bg-surface border border-border'}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-gold text-white text-xs px-4 py-1 font-sans font-medium whitespace-nowrap">
                        Für Aufsteiger
                      </div>
                    )}
                    <p className="text-3xl mb-2">{plan.emoji}</p>
                    <h3 className={`font-heading text-xl font-bold mb-1 ${plan.popular ? 'text-white' : ''}`}>{plan.label}</h3>
                    <p className={`font-sans text-xs mb-5 leading-relaxed ${plan.popular ? 'text-white/60' : 'text-text-secondary'}`}>{plan.desc}</p>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className={`flex items-center gap-2 font-sans text-xs ${plan.popular ? 'text-white/80' : ''}`}>
                          <span className="text-accent-gold">✓</span>{f}
                        </li>
                      ))}
                    </ul>
                    <div className="mb-6">
                      <span className={`font-heading text-4xl font-bold ${plan.popular ? 'text-accent-gold' : ''}`}>{chf(plan.price)}</span>
                      <span className={`font-sans text-sm ml-1 ${plan.popular ? 'text-white/50' : 'text-text-secondary'}`}>/Jahr</span>
                    </div>
                    <button
                      onClick={() => onSelectPlan({ purchaserType: 'formation', plan: plan.id })}
                      className={`w-full py-3 font-sans text-sm font-medium transition-colors ${plan.popular ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'border border-dark text-dark hover:bg-dark hover:text-white'}`}
                    >
                      Formation anmelden
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-center font-sans text-xs text-text-secondary mt-6">
                Egal ob zu dritt oder viert — alle Formationsmitglieder erhalten mit einem Abo Zugang.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

// ─── Static content data ──────────────────────────────────────────────────────

const steps = [
  { num: '01', title: 'Angebot finden', desc: 'Beantworte drei Fragen und finde dein passendes Abo — oder wähle direkt aus der Übersicht.' },
  { num: '02', title: 'Konto erstellen', desc: 'Melde dich an oder erstelle in Sekunden ein neues LAEMU-Konto — inklusive LAEMU Membership.' },
  { num: '03', title: 'Sofort loslegen', desc: 'Direkt nach dem Abo-Abschluss hast du vollständigen Zugang zu allen gebuchten Inhalten.' },
  { num: '04', title: 'Lernen & wachsen', desc: 'Lerne in deinem Tempo, mit echten Profis aus der Szene — ohne Notenkenntnisse.' },
]

const instrumentShowcase = [
  { emoji: '🪗', name: 'Handorgel', desc: 'Das Herzstück der Ländlermusik', levels: ['Starter', 'Pro'] },
  { emoji: '🎶', name: 'Schwyzerörgeli', desc: 'Diatonisch und voller Seele', levels: ['Starter', 'Pro'] },
  { emoji: '🎹', name: 'Klavier', desc: 'Harmonischer Anker der Kapelle', levels: ['Starter', 'Pro'] },
  { emoji: '🎸', name: 'Bass', desc: 'Das Fundament des Klangs', levels: ['Starter', 'Pro'] },
  { emoji: '🎵', name: 'Klarinette', desc: 'Melodisch und ausdrucksstark', levels: ['Starter', 'Pro'] },
]

const teachers = [
  { name: 'Hansruedi Wenger', instrument: 'Handorgel', bio: 'Über 30 Jahre Bühnenerfahrung und Leidenschaft fürs Lehren.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Maria Kälin', instrument: 'Schwyzerörgeli', bio: 'Preisgekrönte Musikerin und einfühlsame Lehrperson.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'Peter Gasser', instrument: 'Klarinette', bio: 'Konzertklarinettist mit Herz für die Volksmusik.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'Lisa Frei', instrument: 'Piano', bio: 'Klassisch ausgebildet und tief in der Ländlermusik verwurzelt.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
]

const testimonials = [
  { name: 'Sandra B.', location: 'Luzern', rating: 5, text: 'Ich hatte keine Noten­kenntnisse — aber die LAEMU Musikschule hat mich von Anfang an abgeholt. Die Profis aus der Szene machen den Unterschied.' },
  { name: 'Markus H.', location: 'Bern', rating: 5, text: 'Das Starter-Abo für zwei Instrumente war genau das Richtige. Ich lerne Handorgel und Schwyzerörgeli gleichzeitig — im eigenen Tempo.' },
  { name: 'Trio Rüegg', location: 'Schwyz', rating: 5, text: 'Als Formation haben wir das Pro All-in-One gewählt. Wir nutzen es gemeinsam und haben uns enorm verbessert. Super Angebot!' },
]

const faqs = [
  { q: 'Brauche ich Notenkenntnisse?', a: 'Nein! Die LAEMU Musikschule ist so konzipiert, dass du ohne jegliche Notenkenntnisse starten kannst. Unsere Profis zeigen dir alles Schritt für Schritt.' },
  { q: 'Was ist die LAEMU Membership?', a: 'Die LAEMU Membership ist in jedem Abo inklusive und gibt dir Zugang zur gesamten LAEMU Community — Diskussionen, Events, Formationen und mehr.' },
  { q: 'Kann ich das Abo jederzeit kündigen?', a: 'Monatliche Abonnements können jederzeit per Ende Monat gekündigt werden. Jahresabos laufen bis zum Ende der bezahlten Periode.' },
  { q: 'Was ist der Unterschied zwischen Starter und Pro?', a: 'Starter beinhaltet den strukturierten Lehrgang und Starter-Videos in der Lernvideodatenbank. Pro fügt die vollständige Lernvideodatenbank, persönliches Video-Feedback und monatliche Live-Calls hinzu.' },
  { q: 'Kann ich einzelne Stücke kaufen?', a: 'Nein, einzelne Stücke können nicht separat gekauft werden. Der Zugang zur Lernvideodatenbank ist als Abo erhältlich — entweder als eigenständiges Abo oder im Pro-Paket inklusive.' },
  { q: 'Wie funktioniert das Formations-Abo?', a: 'Beim Formations-Abo erhalten alle Mitglieder eurer Formation — egal ob zu dritt oder viert — vollständigen Zugang. Der Preis ist fix pro Jahr und gilt für die gesamte Formation.' },
  { q: 'Gibt es Rabattcodes?', a: 'Ja! Rabattcodes sind ausschliesslich für Jahresabos gültig. Beim Abschluss eines Jahresabos kannst du deinen Code im letzten Schritt eingeben.' },
  { q: 'Sind die Kurse auf Schweizerdeutsch?', a: 'Die meisten Kurse werden auf Schweizerdeutsch gehalten — authentisch, wie es die Ländlermusik verdient. Einzelne Inhalte sind auch auf Hochdeutsch verfügbar.' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MusiksschulePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalInitial, setModalInitial] = useState<ModalConfig | undefined>(undefined)

  function openModal(config?: ModalConfig) {
    setModalInitial(config)
    setModalOpen(true)
  }

  return (
    <>
      <AnimatePresence>
        {modalOpen && (
          <MusiksSchuleModal
            onClose={() => setModalOpen(false)}
            initial={modalInitial}
          />
        )}
      </AnimatePresence>

      <Hero
        title={"Lerne Ländlermusik.\nVon Profis. Ohne Noten."}
        subtitle="Die LAEMU Musikschule — die Online Schweizer Musikschule der Ländlermusik. Einfach, authentisch, für alle."
        primaryCta={{ label: 'Angebot entdecken', href: '#angebote' }}
        imageSrc="https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1920&q=80"
        size="large"
      />

      {/* HOW IT WORKS */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Der Weg</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">So einfach geht's</motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-xl mx-auto">
              In vier Schritten zu deiner musikalischen Meisterschaft in der Ländlermusik.
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

      {/* ONBOARDING QUIZ */}
      <section id="angebote" className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Angebots-Finder</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Welches Angebot passt zu dir?</motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-xl mx-auto mb-12">
              Beantworte drei kurze Fragen — wir empfehlen dir das passende Abo. Oder wähle direkt aus der Übersicht unten.
            </motion.p>
          </Section>
          <motion.div variants={fadeUp}>
            <OnboardingQuiz
              onStartSubscription={(config) =>
                openModal({ purchaserType: config.purchaserType, plan: config.plan, scope: config.scope })
              }
            />
          </motion.div>
        </div>
      </section>

      {/* OFFERING OVERVIEW */}
      <OfferingOverview onSelectPlan={(config) => openModal(config)} />

      {/* INSTRUMENTS */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Instrumente</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Die Instrumente der Ländlermusik.</motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-xl mx-auto">
              Lerne das Instrument deiner Wahl — von Grund auf, mit echten Profis aus der Szene.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {instrumentShowcase.map((inst) => (
              <motion.div key={inst.name} variants={fadeUp}>
                <Card hover padding="md" className="text-center cursor-pointer group" onClick={() => openModal({ purchaserType: 'individual' })}>
                  <span className="text-4xl block mb-3">{inst.emoji}</span>
                  <h4 className="font-heading font-bold text-base mb-1 group-hover:text-accent-gold transition-colors">{inst.name}</h4>
                  <p className="font-sans text-xs text-text-secondary mb-3">{inst.desc}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {inst.levels.map(t => (
                      <span key={t} className="font-sans text-[10px] px-1.5 py-0.5 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">{t}</span>
                    ))}
                  </div>
                </Card>
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
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Lerne von den Besten der Szene.</motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-xl mx-auto">
              Alle Lehrpersonen sind aktive Profis der Schweizer Ländlermusik.
            </motion.p>
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

      {/* TESTIMONIALS */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Stimmen</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-4">Was unsere Schülerinnen und Schüler sagen.</motion.h2>
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
              <motion.span variants={fadeUp} className="label text-accent-gold">Mehr als Online</motion.span>
              <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-6">Online lernen. Live erleben.</motion.h2>
              <motion.p variants={fadeUp} className="body-lg text-text-secondary mb-8">
                Ergänze dein digitales Lernen mit unvergesslichen Live-Erfahrungen — exklusiv für Musikschul-Mitglieder.
              </motion.p>
              <Section className="space-y-6">
                {[
                  { icon: '🏕️', title: 'Lernwochenenden', desc: 'Intensive Wochenenden mit Gleichgesinnten in der Natur der Schweiz.' },
                  { icon: '⛺', title: 'Sommercamps', desc: 'Einwöchige Musiklager für alle Altersgruppen und Niveaus.' },
                  { icon: '📡', title: 'Live-Calls', desc: 'Monatliche Online-Sessions mit deinem Lehrer (im Pro-Abo inklusive).' },
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

      {/* CTA */}
      <section className="py-32 bg-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Section>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mb-6">
              Bereit, Ländlermusik zu lernen?
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/60 mb-10">
              Kein Risiko — starte direkt mit dem passenden Abo und lerne von echten Profis der Szene.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => openModal()} variant="primary" size="lg">Angebot finden</Button>
              <Button href="/contact" variant="outline" size="lg">Frage stellen</Button>
            </motion.div>
          </Section>
        </div>
      </section>
    </>
  )
}
