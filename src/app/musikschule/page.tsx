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

type QuizAnswers = {
  experience: 'none' | 'childhood' | 'adult' | 'longtime' | null
  experienceType: string | null
  musicStyle: string | null
  learnerType: string | null
  isFormation: boolean | null
  instrument: string | null
  probeLektion: 'yes' | 'consultation' | null
}

type QuizResult = {
  label: string
  plan: IndividualPlan | FormationPlan
  scope?: Scope
  isFormation: boolean
  monthly?: number
  yearly: number
  tag: string
}

function deriveQuizRecommendation(answers: QuizAnswers): QuizResult | null {
  if (answers.isFormation === true) {
    if (answers.experience === 'longtime') {
      return { label: 'Lernvideodatenbank', plan: 'formation_lernvideo', isFormation: true, yearly: 1999, tag: 'Für Profis' }
    }
    return { label: 'Pro All-in-One', plan: 'pro_all', isFormation: true, yearly: 2499, tag: 'Für Aufsteiger' }
  }

  if (answers.experience === 'longtime') {
    return { label: 'Lernvideodatenbank', plan: 'lernvideo', isFormation: false, monthly: 99, yearly: 999, tag: 'Für Könner' }
  }

  const scope: Scope = answers.instrument === 'handorgel' || answers.instrument === 'schwyzer'
    ? '1'
    : answers.instrument === 'unsure'
    ? 'all'
    : '1'

  if (answers.experience === 'none' || answers.experience === 'childhood') {
    const pricing = individualPricing.starter[scope]
    return {
      label: `Starter — ${scopeLabels[scope]}`,
      plan: 'starter',
      scope,
      isFormation: false,
      monthly: pricing.monthly,
      yearly: pricing.yearly,
      tag: 'Für Einsteiger',
    }
  }

  if (answers.experience === 'adult') {
    const pricing = individualPricing.pro[scope]
    return {
      label: `Pro — ${scopeLabels[scope]}`,
      plan: 'pro',
      scope,
      isFormation: false,
      monthly: pricing.monthly,
      yearly: pricing.yearly,
      tag: 'Für Fortgeschrittene',
    }
  }

  return null
}

type OnboardingQuizProps = {
  onStartSubscription: (config: { purchaserType: 'individual' | 'formation'; plan?: IndividualPlan | FormationPlan; scope?: Scope }) => void
  onScrollToPricing: () => void
}

// Total quiz steps (0 = intro, 1..7 = questions, 8 = result)
// Step logic: some steps are conditional

function getVisibleStep(step: number, answers: QuizAnswers): number {
  // This maps logical step index accounting for conditionals
  return step
}

function OnboardingQuiz({ onStartSubscription, onScrollToPricing }: OnboardingQuizProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({
    experience: null,
    experienceType: null,
    musicStyle: null,
    learnerType: null,
    isFormation: null,
    instrument: null,
    probeLektion: null,
  })

  // Booking sub-flow state
  type ResultAction = null | 'booking' | 'video'
  const [resultAction, setResultAction] = useState<ResultAction>(null)
  const [bookingSlot, setBookingSlot] = useState<string | null>(null)
  const [bookingName, setBookingName] = useState('')
  const [bookingEmail, setBookingEmail] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [videoEmail, setVideoEmail] = useState('')
  const [videoSent, setVideoSent] = useState(false)

  const bookingSlots = [
    'Di, 27. Mai · 10:00 Uhr',
    'Di, 27. Mai · 14:00 Uhr',
    'Mi, 28. Mai · 09:00 Uhr',
    'Do, 29. Mai · 11:00 Uhr',
    'Fr, 30. Mai · 10:00 Uhr',
    'Fr, 30. Mai · 15:00 Uhr',
  ]

  // Compute which step numbers are active given current answers
  function getStepSequence(): number[] {
    const seq = [0, 1]
    if (answers.experience !== 'none') seq.push(2)
    seq.push(3, 4, 5)
    if (answers.isFormation === false) {
      seq.push(6)
      if (answers.instrument !== null && answers.instrument !== 'unsure') {
        seq.push(7)
      }
    }
    seq.push(8) // result
    return seq
  }

  const sequence = getStepSequence()
  const currentIndex = sequence.indexOf(step)
  // Total steps for progress (excluding intro 0 and result 8)
  const progressSteps = sequence.filter(s => s > 0 && s < 8)
  const currentProgressIndex = progressSteps.indexOf(step)

  function goNext(newAnswers?: Partial<QuizAnswers>) {
    const updated = newAnswers ? { ...answers, ...newAnswers } : answers
    setAnswers(updated)

    // Recompute sequence with updated answers
    const seq: number[] = [0, 1]
    if (updated.experience !== 'none') seq.push(2)
    seq.push(3, 4, 5)
    if (updated.isFormation === false) {
      seq.push(6)
      if (updated.instrument !== null && updated.instrument !== 'unsure') {
        seq.push(7)
      }
    }
    seq.push(8)

    const idx = seq.indexOf(step)
    if (idx !== -1 && idx < seq.length - 1) {
      setStep(seq[idx + 1])
    }
  }

  function goBack() {
    const idx = sequence.indexOf(step)
    if (idx > 0) setStep(sequence[idx - 1])
  }

  function reset() {
    setStep(0)
    setAnswers({
      experience: null,
      experienceType: null,
      musicStyle: null,
      learnerType: null,
      isFormation: null,
      instrument: null,
      probeLektion: null,
    })
  }

  const result = step === 8 ? deriveQuizRecommendation(answers) : null

  return (
    <div className="bg-surface border border-border max-w-2xl mx-auto">
      {/* Progress bar — only show on question steps */}
      {step > 0 && step < 8 && (
        <div className="px-8 pt-6">
          <div className="flex items-center gap-1.5">
            {progressSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 transition-all duration-300 ${
                  i <= currentProgressIndex ? 'bg-accent-gold' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="font-sans text-[10px] text-text-secondary mt-1.5">
            Frage {currentProgressIndex + 1} von {progressSteps.length}
          </p>
        </div>
      )}

      <div className="p-8">
        <AnimatePresence mode="wait">

          {/* ── Step 0: Intro ── */}
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-accent-gold uppercase tracking-widest mb-3">Angebots-Finder</p>
              <h3 className="font-heading text-2xl font-bold mb-3">Du weisst nicht, was zu dir passt?</h3>
              <p className="font-sans text-text-secondary text-sm leading-relaxed mb-8">
                Finde deinen perfekten Einstieg in die Ländlermusik. Beantworte ein paar kurze Fragen — wir empfehlen dir das passende Angebot.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onScrollToPricing}
                  className="flex-1 py-3 px-4 border border-border font-sans text-sm text-text-secondary hover:border-dark transition-colors"
                >
                  Angebote direkt anschauen
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors"
                >
                  Meinen Einstieg finden →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 1: Vorkenntnisse ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Dein Hintergrund</p>
              <h3 className="font-heading text-xl font-bold mb-2">Hast du bereits Vorkenntnisse in der Ländlermusik oder einem verwandten Instrument?</h3>
              <p className="font-sans text-xs text-text-secondary mb-6">Sei ehrlich — es gibt keine falsche Antwort.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { val: 'none' as const, emoji: '🌱', label: 'Nein, ich bin ein blutiger Anfänger' },
                  { val: 'childhood' as const, emoji: '🎵', label: 'Ja, früher in der Kindheit mal gespielt' },
                  { val: 'adult' as const, emoji: '🎶', label: 'Ja, etwas Erfahrung als Erwachsener' },
                  { val: 'longtime' as const, emoji: '🏆', label: 'Ja, ich spiele schon länger' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => goNext({ experience: opt.val, experienceType: null })}
                    className={`p-4 border text-left font-sans text-sm transition-all hover:border-accent-gold ${
                      answers.experience === opt.val ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border'
                    }`}
                  >
                    <span className="mr-2">{opt.emoji}</span>{opt.label}
                  </button>
                ))}
              </div>
              <button onClick={goBack} className="mt-5 font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── Step 2: Art der Vorkenntnisse (only if experience !== 'none') ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Deine Erfahrung</p>
              <h3 className="font-heading text-xl font-bold mb-2">Welche Art von Vorkenntnissen hast du?</h3>
              <p className="font-sans text-xs text-text-secondary mb-6">Das hilft uns, den richtigen Lernweg für dich zu finden.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { val: 'einzelunterricht', emoji: '🎹', label: '1-zu-1 Unterricht (Klavier, Gitarre, etc.)' },
                  { val: 'app', emoji: '📱', label: 'Lern-App (z. B. Klavier-App)' },
                  { val: 'selbst', emoji: '🎸', label: 'Selbst beigebracht' },
                  { val: 'musikschule', emoji: '🏫', label: 'Musikschule oder Gruppenunterricht' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => goNext({ experienceType: opt.val })}
                    className={`p-4 border text-left font-sans text-sm transition-all hover:border-accent-gold ${
                      answers.experienceType === opt.val ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border'
                    }`}
                  >
                    <span className="mr-2">{opt.emoji}</span>{opt.label}
                  </button>
                ))}
              </div>
              <button onClick={goBack} className="mt-5 font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── Step 3: Musikstil ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Dein Geschmack</p>
              <h3 className="font-heading text-xl font-bold mb-2">Welche Art von Musik gefällt dir?</h3>
              <p className="font-sans text-xs text-text-secondary mb-6">Alle Stile sind Teil unseres Angebots — wir sind nur neugierig.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { val: 'traditional', emoji: '🎵', label: 'Traditionelle Volksmusik (Polkas, Mazurkas)' },
                  { val: 'modern', emoji: '🎶', label: 'Moderne Ländlermusik' },
                  { val: 'alpin', emoji: '🌄', label: 'Alpinmusik & Jodeln' },
                  { val: 'neue', emoji: '🎸', label: 'Neue Volksmusik (mit Jazz-Einflüssen)' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => goNext({ musicStyle: opt.val })}
                    className={`p-4 border text-left font-sans text-sm transition-all hover:border-accent-gold ${
                      answers.musicStyle === opt.val ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border'
                    }`}
                  >
                    <span className="mr-2">{opt.emoji}</span>{opt.label}
                  </button>
                ))}
              </div>
              <button onClick={goBack} className="mt-5 font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── Step 4: Lerntyp ── */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Dein Lernstil</p>
              <h3 className="font-heading text-xl font-bold mb-2">Wie würdest du dich als Lernende*r beschreiben?</h3>
              <p className="font-sans text-xs text-text-secondary mb-6">Kein Richtig oder Falsch — jeder Lerntyp hat seinen Platz.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { val: 'calm', emoji: '🐢', label: 'Immer mit der Ruhe — ich lerne in meinem Tempo' },
                  { val: 'driven', emoji: '💪', label: 'Ohne Fleiss kein Preis — ich will Fortschritte sehen' },
                  { val: 'creative', emoji: '🎨', label: 'Kreativer Künstler — ich folge meiner Intuition' },
                  { val: 'curious', emoji: '📚', label: 'Lebenslanger Lerner — ich liebe es, Neues zu entdecken' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => goNext({ learnerType: opt.val })}
                    className={`p-4 border text-left font-sans text-sm transition-all hover:border-accent-gold ${
                      answers.learnerType === opt.val ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border'
                    }`}
                  >
                    <span className="mr-2">{opt.emoji}</span>{opt.label}
                  </button>
                ))}
              </div>
              <button onClick={goBack} className="mt-5 font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── Step 5: Formation? ── */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Solo oder Formation</p>
              <h3 className="font-heading text-xl font-bold mb-2">Spielst du in einer Formation?</h3>
              <p className="font-sans text-xs text-text-secondary mb-6">Für Formationen haben wir spezielle Kombiangebote.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { val: false, emoji: '👤', label: 'Nein, ich lerne solo' },
                  { val: true, emoji: '👥', label: 'Ja, ich bin Teil einer Formation' },
                ].map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => goNext({ isFormation: opt.val, instrument: null, probeLektion: null })}
                    className={`p-5 border text-left font-sans text-sm transition-all hover:border-accent-gold ${
                      answers.isFormation === opt.val ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border'
                    }`}
                  >
                    <span className="text-2xl block mb-2">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
              <button onClick={goBack} className="mt-5 font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── Step 6: Instrument (only if solo) ── */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Dein Instrument</p>
              <h3 className="font-heading text-xl font-bold mb-2">Welches Instrument interessiert dich?</h3>
              <p className="font-sans text-xs text-text-secondary mb-6">Du kannst später jederzeit wechseln oder weitere hinzufügen.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { val: 'handorgel', emoji: '🪗', label: 'Handorgel' },
                  { val: 'schwyzer', emoji: '🎶', label: 'Schwyzerörgeli' },
                  { val: 'begleit', emoji: '🎸', label: 'Begleitinstrument (Bass, Klarinette, Klavier)' },
                  { val: 'buehne', emoji: '🎤', label: 'Bühnenpräsenz' },
                  { val: 'unsure', emoji: '🤔', label: 'Noch nicht sicher' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => goNext({ instrument: opt.val, probeLektion: null })}
                    className={`p-4 border text-left font-sans text-sm transition-all hover:border-accent-gold ${
                      answers.instrument === opt.val ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border'
                    }`}
                  >
                    <span className="mr-2">{opt.emoji}</span>{opt.label}
                  </button>
                ))}
              </div>
              <button onClick={goBack} className="mt-5 font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── Step 7: Probelektion (only if solo & instrument !== unsure) ── */}
          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Fast geschafft!</p>
              <h3 className="font-heading text-xl font-bold mb-2">Dürfen wir dir eine kostenlose Probelektion zusenden?</h3>
              <p className="font-sans text-xs text-text-secondary mb-6">Kein Abo, kein Risiko — nur ein kleiner Vorgeschmack.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { val: 'yes' as const, emoji: '✉️', label: 'Ja, sende mir eine Probelektion!' },
                  { val: 'consultation' as const, emoji: '💬', label: 'Nein, ich hätte lieber ein persönliches Beratungsgespräch' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => goNext({ probeLektion: opt.val })}
                    className={`p-5 border text-left font-sans text-sm transition-all hover:border-accent-gold ${
                      answers.probeLektion === opt.val ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border'
                    }`}
                  >
                    <span className="text-2xl block mb-2">{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
              <button onClick={goBack} className="mt-5 font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── Step 8: Result ── */}
          {step === 8 && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* ── Booking sub-flow ── */}
              {resultAction === 'booking' && (
                <AnimatePresence mode="wait">
                  {!bookingConfirmed ? (
                    <motion.div key="booking-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <button onClick={() => setResultAction(null)} className="font-sans text-xs text-text-secondary hover:text-dark mb-4 block">← Zurück</button>
                      <p className="font-sans text-xs text-accent-gold uppercase tracking-widest mb-2">Kostenloser Termin</p>
                      <h3 className="font-heading text-xl font-bold mb-1">Wähle einen freien Termin</h3>
                      <p className="font-sans text-xs text-text-secondary mb-5">Gratis, unverbindlich — lerne LAEMU kennen.</p>
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {bookingSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setBookingSlot(slot)}
                            className={`py-2.5 px-3 border text-left font-sans text-xs transition-all ${bookingSlot === slot ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border hover:border-dark'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      {bookingSlot && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 mb-5 overflow-hidden">
                          <div>
                            <label className="font-sans text-xs text-text-secondary block mb-1">Dein Name</label>
                            <input type="text" value={bookingName} onChange={e => setBookingName(e.target.value)} placeholder="Vorname Nachname" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
                          </div>
                          <div>
                            <label className="font-sans text-xs text-text-secondary block mb-1">E-Mail</label>
                            <input type="email" value={bookingEmail} onChange={e => setBookingEmail(e.target.value)} placeholder="deine@email.ch" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
                          </div>
                        </motion.div>
                      )}
                      <button
                        disabled={!bookingSlot || !bookingName.trim() || !bookingEmail.trim()}
                        onClick={() => setBookingConfirmed(true)}
                        className={`w-full py-3 font-sans font-medium text-sm transition-colors ${bookingSlot && bookingName.trim() && bookingEmail.trim() ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                      >
                        Termin bestätigen →
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="booking-confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-accent-gold/10 border-2 border-accent-gold flex items-center justify-center mx-auto mb-5">
                        <span className="text-2xl">📅</span>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Termin bestätigt!</h3>
                      <p className="font-sans text-sm text-text-secondary mb-1">
                        <span className="font-medium text-dark">{bookingSlot}</span>
                      </p>
                      <p className="font-sans text-xs text-text-secondary mb-6">Eine Bestätigung wurde an <span className="text-dark">{bookingEmail}</span> gesendet.</p>
                      <button onClick={reset} className="font-sans text-xs text-text-secondary hover:text-dark transition-colors underline underline-offset-2">
                        Zum Anfang
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* ── Video request sub-flow ── */}
              {resultAction === 'video' && (
                <AnimatePresence mode="wait">
                  {!videoSent ? (
                    <motion.div key="video-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <button onClick={() => setResultAction(null)} className="font-sans text-xs text-text-secondary hover:text-dark mb-4 block">← Zurück</button>
                      <p className="font-sans text-xs text-accent-gold uppercase tracking-widest mb-2">Kostenloses Video</p>
                      <h3 className="font-heading text-xl font-bold mb-1">Schick mir eine Probelektion</h3>
                      <p className="font-sans text-xs text-text-secondary mb-5">Trag deine E-Mail ein — wir schicken dir eine kostenlose Probelektion direkt ins Postfach.</p>
                      <input
                        type="email"
                        value={videoEmail}
                        onChange={e => setVideoEmail(e.target.value)}
                        placeholder="deine@email.ch"
                        className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark mb-3"
                      />
                      <button
                        disabled={!videoEmail.trim()}
                        onClick={() => setVideoSent(true)}
                        className={`w-full py-3 font-sans font-medium text-sm transition-colors ${videoEmail.trim() ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                      >
                        Video anfordern →
                      </button>
                      <p className="font-sans text-[10px] text-text-secondary mt-2 text-center">
                        Oder schreib uns direkt: <a href="mailto:info@laemu.ch" className="text-dark hover:underline">info@laemu.ch</a>
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="video-sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-accent-gold/10 border-2 border-accent-gold flex items-center justify-center mx-auto mb-5">
                        <span className="text-2xl">📹</span>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Video unterwegs!</h3>
                      <p className="font-sans text-sm text-text-secondary mb-6">
                        Wir haben die Probelektion an <span className="text-dark font-medium">{videoEmail}</span> geschickt.
                      </p>
                      <button onClick={reset} className="font-sans text-xs text-text-secondary hover:text-dark transition-colors underline underline-offset-2">
                        Zum Anfang
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* ── Main result (no sub-flow selected yet) ── */}
              {resultAction === null && (
                <>
                  <p className="font-sans text-xs text-accent-gold uppercase tracking-widest mb-3">Deine Empfehlung</p>

                  {answers.isFormation === true ? (
                    <>
                      <h3 className="font-heading text-xl font-bold mb-2">Du spielst in einer Formation — top!</h3>
                      <p className="font-sans text-sm text-text-secondary mb-6 leading-relaxed">
                        Für Formationen haben wir spezielle Kombiangebote, bei denen alle Mitglieder gemeinsam profitieren.
                      </p>
                      <Link
                        href="/musikschule/formation"
                        className="inline-block w-full text-center py-3 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors mb-3"
                      >
                        Formation-Vorteile entdecken →
                      </Link>
                    </>
                  ) : result ? (
                    <>
                      <h3 className="font-heading text-xl font-bold mb-1">{result.label}</h3>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-sans text-xs text-accent-gold border border-accent-gold/30 px-2 py-1">{result.tag}</span>
                        {result.monthly && (
                          <span className="font-sans text-sm text-text-secondary">{chf(result.monthly)}<span className="text-xs">/Mt.</span></span>
                        )}
                        <span className="font-heading font-bold">{chf(result.yearly)}<span className="font-sans text-sm text-text-secondary font-normal">/Jahr</span></span>
                      </div>
                      <p className="font-sans text-xs text-text-secondary mb-6 leading-relaxed">
                        Noch unsicher? Kein Problem — buch einen kostenlosen Termin oder schick dir eine Probelektion zu.
                      </p>
                    </>
                  ) : (
                    <p className="font-sans text-text-secondary text-sm mb-6">Wir konnten keine passende Empfehlung ermitteln. Schau dir unsere Angebote direkt an.</p>
                  )}

                  {/* CTA options */}
                  <div className="space-y-3 mb-5">
                    <button
                      onClick={() => { setResultAction('booking'); setBookingConfirmed(false); setBookingSlot(null); setBookingName(''); setBookingEmail('') }}
                      className="w-full flex items-center gap-3 p-4 border border-border hover:border-accent-gold transition-all text-left group"
                    >
                      <span className="text-2xl flex-shrink-0">📅</span>
                      <div>
                        <p className="font-heading font-bold text-sm group-hover:text-accent-gold transition-colors">Kostenlosen Termin buchen</p>
                        <p className="font-sans text-xs text-text-secondary">Gratis Beratungsgespräch — wähle einen freien Slot im Kalender.</p>
                      </div>
                    </button>
                    <button
                      onClick={() => { setResultAction('video'); setVideoSent(false); setVideoEmail('') }}
                      className="w-full flex items-center gap-3 p-4 border border-border hover:border-accent-gold transition-all text-left group"
                    >
                      <span className="text-2xl flex-shrink-0">📹</span>
                      <div>
                        <p className="font-heading font-bold text-sm group-hover:text-accent-gold transition-colors">Kostenlose Probelektion erhalten</p>
                        <p className="font-sans text-xs text-text-secondary">Wir schicken dir ein Video direkt per E-Mail — kein Abo nötig.</p>
                      </div>
                    </button>
                    <button
                      onClick={onScrollToPricing}
                      className="w-full py-2.5 border border-border font-sans text-sm text-text-secondary hover:border-dark hover:text-dark transition-colors"
                    >
                      Angebote direkt ansehen →
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={goBack}
                      className="px-4 py-2.5 border border-border font-sans text-sm text-text-secondary hover:border-dark transition-colors"
                    >
                      ← Zurück
                    </button>
                    <button
                      onClick={reset}
                      className="px-4 py-2.5 border border-border font-sans text-sm text-text-secondary hover:border-dark transition-colors"
                    >
                      Quiz neu starten
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Formation CTA ────────────────────────────────────────────────────────────

function FormationCTA() {
  return (
    <section className="py-20 bg-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <span className="font-sans text-xs text-accent-gold uppercase tracking-widest mb-3 block">Für Formationen</span>
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-3">
              Spielst du in einer Formation?
            </h2>
            <p className="font-sans text-white/60 text-sm leading-relaxed max-w-lg">
              Erfahre mehr über die Kombiangebote und Vorteile für Formationen, die bei LAEMU registriert sind.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link
              href="/musikschule/formation"
              className="inline-block px-8 py-3.5 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors text-center whitespace-nowrap"
            >
              Formation-Vorteile entdecken →
            </Link>
            <p className="font-sans text-[11px] text-white/40 text-center">
              Egal ob zu dritt oder viert — alle Formationsmitglieder profitieren gemeinsam.
            </p>
          </div>
        </div>
      </div>
    </section>
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

  // Suppress unused variable warning
  void meta
  void needsScope

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
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')
  const [starterScope, setStarterScope] = useState<Scope>('1')
  const [proScope, setProScope] = useState<Scope>('1')

  return (
    <section className="py-32 bg-surface" id="preise">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="label text-accent-gold">Angebote</span>
          <h2 className="heading-lg mt-3 mb-4">Das richtige Angebot für dich.</h2>
          <p className="body-lg text-text-secondary max-w-xl mx-auto mb-8">
            Lerne in deinem Tempo — von echten Profis der Schweizer Ländlermusik.
          </p>
        </div>

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
  { name: 'Seebi Diener', instrument: 'Bass / Schwyzerörgeli', bio: 'Multitalent und Stilpräger der modernen Ländlermusik.', img: '/images/seebi-diener.jpg' },
  { name: 'Cyrill Rusch', instrument: 'Schwyzerörgeli', bio: 'Preisgekrönter Örgelist und einfühlsamer Lehrperson.', img: '/images/cyrill-rusch.jpg' },
  { name: 'Cécile Schmidig', instrument: 'Handorgel', bio: 'Ausdrucksstarke Handorgelistin mit Liebe für das Volksmusik-Erbe.', img: '/images/cecile-schmidig.jpg' },
  { name: 'Franz Hess', instrument: 'Klavier', bio: 'Harmonischer Anker vieler Schweizer Kapellen und Lehrperson.', img: '/images/franz-hess.jpg' },
  { name: 'Simon Rusch', instrument: 'Handorgel', bio: 'Charismatischer Handorgelist und begnadeter Entertainer.', img: '/images/simon-rusch.jpg' },
  { name: 'Simon Lüthi', instrument: 'Handorgel / Schwyzerörgeli', bio: 'Vielseitiger Profi mit tiefer Verwurzelung in der Szene.', img: '/images/simon-luethi.jpg' },
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
  const pricingSectionRef = useRef<HTMLElement>(null)

  function openModal(config?: ModalConfig) {
    setModalInitial(config)
    setModalOpen(true)
  }

  function scrollToPricing() {
    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
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

      {/* LOGIN BANNER */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <p className="font-sans text-sm text-text-secondary">
            Bereits Mitglied der LAEMU Musikschule?
          </p>
          <Link
            href="/member/academy"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-dark border border-dark px-4 py-1.5 hover:bg-dark hover:text-white transition-colors flex-shrink-0"
          >
            Einloggen →
          </Link>
        </div>
      </div>

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
              Beantworte ein paar kurze Fragen — wir empfehlen dir den perfekten Einstieg. Oder wähle direkt aus der Übersicht unten.
            </motion.p>
          </Section>
          <motion.div variants={fadeUp}>
            <OnboardingQuiz
              onStartSubscription={(config) =>
                openModal({ purchaserType: config.purchaserType, plan: config.plan, scope: config.scope })
              }
              onScrollToPricing={scrollToPricing}
            />
          </motion.div>
        </div>
      </section>

      {/* OFFERING OVERVIEW */}
      <span ref={pricingSectionRef as React.RefObject<HTMLSpanElement>} />
      <OfferingOverview onSelectPlan={(config) => openModal(config)} />

      {/* FORMATION CTA */}
      <FormationCTA />

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
          <Section className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="group">
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-surface">
                  <Image src={t.img} alt={t.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
