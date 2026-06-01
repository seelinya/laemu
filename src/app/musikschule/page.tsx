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
  { id: 'schwyzer', label: 'Schwyzerörgeli', emoji: '🎶', subtitle: 'Diatonisch und voller Seele' },
  { id: 'handorgel', label: 'Handorgel', emoji: '🪗', subtitle: 'Das Herzstück der Ländlermusik' },
  { id: 'begleit', label: 'Begleitinstrument', emoji: '🎸', subtitle: 'Bass · Klavier · Klarinette' },
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

type QuizState = {
  path: 'anfaenger' | 'erfahren' | null
  instruments: string[]
  depth: 'grundlagen' | 'vertieft' | 'schnuppern' | null
  hasInstrument: 'yes' | 'no' | null
  isFormation: 'yes' | 'no' | null
  soloInterest: 'vertiefen' | 'neue_stuecke' | null
  formationInterest: 'solo_vertiefen' | 'formation_vertiefen' | 'neue_stuecke' | null
}

type StepId = 'intro' | 'experience' | 'instruments' | 'depth' | 'has_instrument' | 'is_formation' | 'solo_interest' | 'formation_interest' | 'result'

type QuizResultType =
  | 'starter'
  | 'pro'
  | 'schnuppern_mit_instrument'
  | 'schnuppern_ohne_instrument'
  | 'lernvideo'
  | 'formation_pro'
  | 'formation_lernvideo'

function getQuizSequence(state: QuizState): StepId[] {
  const seq: StepId[] = ['intro', 'experience']
  if (state.path === 'anfaenger') {
    seq.push('instruments', 'depth')
    if (state.depth === 'schnuppern') seq.push('has_instrument')
  } else if (state.path === 'erfahren') {
    seq.push('is_formation')
    if (state.isFormation === 'no') {
      seq.push('solo_interest')
      if (state.soloInterest === 'vertiefen') seq.push('instruments')
    } else if (state.isFormation === 'yes') {
      seq.push('formation_interest')
      if (state.formationInterest === 'solo_vertiefen') seq.push('instruments')
    }
  }
  seq.push('result')
  return seq
}

function deriveQuizResult(state: QuizState): QuizResultType | null {
  const scope: Scope = state.instruments.length === 0 || state.instruments.length === 1
    ? '1'
    : state.instruments.length === 2
    ? '2'
    : 'all'

  if (state.path === 'anfaenger') {
    if (state.depth === 'grundlagen') return 'starter'
    if (state.depth === 'vertieft') return 'pro'
    if (state.depth === 'schnuppern') {
      if (state.hasInstrument === 'yes') return 'schnuppern_mit_instrument'
      if (state.hasInstrument === 'no') return 'schnuppern_ohne_instrument'
    }
    return null
  }

  if (state.path === 'erfahren') {
    if (state.isFormation === 'no') {
      if (state.soloInterest === 'vertiefen') return 'pro'
      if (state.soloInterest === 'neue_stuecke') return 'lernvideo'
    }
    if (state.isFormation === 'yes') {
      if (state.formationInterest === 'solo_vertiefen') return 'pro'
      if (state.formationInterest === 'formation_vertiefen') return 'formation_pro'
      if (state.formationInterest === 'neue_stuecke') return 'formation_lernvideo'
    }
  }

  void scope
  return null
}

const quizInstruments = [
  { id: 'schwyzer', label: 'Schwyzerörgeli', emoji: '🎶', subtitle: 'Diatonisch und voller Seele' },
  { id: 'handorgel', label: 'Handorgel', emoji: '🪗', subtitle: 'Das Herzstück der Ländlermusik' },
  { id: 'bass', label: 'Bass', emoji: '🎸', subtitle: 'Das Fundament des Klangs' },
  { id: 'klavier', label: 'Klavier', emoji: '🎹', subtitle: 'Harmonischer Anker der Kapelle' },
  { id: 'klarinette', label: 'Klarinette', emoji: '🎵', subtitle: 'Melodisch und ausdrucksstark' },
]

type OnboardingQuizProps = {
  onStartSubscription: (config: { purchaserType: 'individual' | 'formation'; plan?: IndividualPlan | FormationPlan; scope?: Scope }) => void
  onScrollToPricing: () => void
}

function OnboardingQuiz({ onStartSubscription, onScrollToPricing }: OnboardingQuizProps) {
  const [currentStep, setCurrentStep] = useState<StepId>('intro')
  const [state, setState] = useState<QuizState>({
    path: null,
    instruments: [],
    depth: null,
    hasInstrument: null,
    isFormation: null,
    soloInterest: null,
    formationInterest: null,
  })

  // Booking sub-flow state
  type ResultAction = null | 'booking' | 'video'
  const [resultAction, setResultAction] = useState<ResultAction>(null)
  const [bookingSlot, setBookingSlot] = useState<string | null>(null)
  const [bookingName, setBookingName] = useState('')
  const [bookingEmail, setBookingEmail] = useState('')
  const [bookingFormat, setBookingFormat] = useState<'online' | 'phone' | null>(null)
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

  function navigate(newState: QuizState, targetStep?: StepId) {
    setState(newState)
    if (targetStep) {
      setCurrentStep(targetStep)
    } else {
      const seq = getQuizSequence(newState)
      const idx = seq.indexOf(currentStep)
      if (idx !== -1 && idx < seq.length - 1) {
        setCurrentStep(seq[idx + 1])
      }
    }
  }

  function goBack() {
    const seq = getQuizSequence(state)
    const idx = seq.indexOf(currentStep)
    if (idx > 0) setCurrentStep(seq[idx - 1])
  }

  function reset() {
    setCurrentStep('intro')
    setState({ path: null, instruments: [], depth: null, hasInstrument: null, isFormation: null, soloInterest: null, formationInterest: null })
    setResultAction(null)
  }

  const sequence = getQuizSequence(state)
  const questionSteps = sequence.filter((s): s is Exclude<StepId, 'intro' | 'result'> => s !== 'intro' && s !== 'result')
  const currentQIndex = (questionSteps as StepId[]).indexOf(currentStep)
  const isQuestionStep = currentQIndex >= 0

  const quizResult = currentStep === 'result' ? deriveQuizResult(state) : null
  const resultScope: Scope = state.instruments.length === 0 || state.instruments.length === 1
    ? '1'
    : state.instruments.length === 2
    ? '2'
    : 'all'

  function toggleInstrument(id: string) {
    setState(prev => {
      const already = prev.instruments.includes(id)
      const updated = already ? prev.instruments.filter(x => x !== id) : [...prev.instruments, id]
      return { ...prev, instruments: updated }
    })
  }

  return (
    <div className="bg-surface border border-border max-w-2xl mx-auto">
      {/* Progress bar — only show on question steps */}
      {isQuestionStep && (
        <div className="px-8 pt-6">
          <div className="flex items-center gap-1.5">
            {questionSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 transition-all duration-300 ${
                  i <= currentQIndex ? 'bg-accent-gold' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="font-sans text-[10px] text-text-secondary mt-1.5">
            Frage {currentQIndex + 1} von {questionSteps.length}
          </p>
        </div>
      )}

      <div className="p-8">
        <AnimatePresence mode="wait">

          {/* ── Intro ── */}
          {currentStep === 'intro' && (
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
                  onClick={() => setCurrentStep('experience')}
                  className="flex-1 py-3 px-4 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors"
                >
                  Meinen Einstieg finden →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── experience ── */}
          {currentStep === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Dein Hintergrund</p>
              <h3 className="font-heading text-xl font-bold mb-2">Hast du bereits Erfahrung mit Instrumenten der Ländlermusik?</h3>
              <p className="font-sans text-xs text-text-secondary mb-6">Sei ehrlich — es gibt keine falsche Antwort.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate({ ...state, path: 'anfaenger' })}
                  className="p-5 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <span className="text-2xl block mb-2">🌱</span>
                  <p className="font-heading font-bold text-sm mb-1">Nein, ich bin Anfänger</p>
                  <p className="font-sans text-xs text-text-secondary">Ich habe noch kaum Erfahrung mit Instrumenten der Ländlermusik.</p>
                </button>
                <button
                  onClick={() => navigate({ ...state, path: 'erfahren' })}
                  className="p-5 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <span className="text-2xl block mb-2">🎵</span>
                  <p className="font-heading font-bold text-sm mb-1">Ja, ich habe Erfahrung</p>
                  <p className="font-sans text-xs text-text-secondary">Ich spiele bereits und möchte mich weiterentwickeln.</p>
                </button>
              </div>
              <button onClick={goBack} className="mt-5 font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── instruments (multi-select) ── */}
          {currentStep === 'instruments' && (
            <motion.div
              key="instruments"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Deine Instrumente</p>
              <h3 className="font-heading text-xl font-bold mb-2">Welche Instrumente interessieren dich?</h3>
              <p className="font-sans text-xs text-text-secondary mb-6">Du kannst mehrere wählen.</p>
              <div className="space-y-2 mb-5">
                {quizInstruments.map(inst => {
                  const sel = state.instruments.includes(inst.id)
                  return (
                    <button
                      key={inst.id}
                      onClick={() => toggleInstrument(inst.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 border text-left transition-all ${sel ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{inst.emoji}</span>
                        <div>
                          <p className="font-sans text-sm font-medium">{inst.label}</p>
                          <p className="font-sans text-xs text-text-secondary">{inst.subtitle}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 border-2 flex-shrink-0 flex items-center justify-center transition-colors ${sel ? 'border-accent-gold bg-accent-gold' : 'border-border'}`}>
                        {sel && <span className="text-white text-[10px] font-bold">✓</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
              <button
                disabled={state.instruments.length === 0}
                onClick={() => navigate(state)}
                className={`w-full py-3 font-sans font-medium text-sm transition-colors mb-3 ${state.instruments.length > 0 ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
              >
                {state.instruments.length === 0
                  ? 'Bitte mindestens ein Instrument wählen'
                  : state.instruments.length === 1
                  ? 'Weiter (1 Instrument)'
                  : `Weiter (${state.instruments.length} Instrumente)`}
              </button>
              <button onClick={goBack} className="font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── depth (Anfänger only) ── */}
          {currentStep === 'depth' && (
            <motion.div
              key="depth"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Dein Ziel</p>
              <h3 className="font-heading text-xl font-bold mb-2">Wie tief willst du einsteigen?</h3>
              <p className="font-sans text-xs text-text-secondary mb-6">Das hilft uns, das passende Angebot zu finden.</p>
              <div className="space-y-3">
                {[
                  { val: 'grundlagen' as const, emoji: '📖', label: 'Grundlagen & ein paar einfache Stücke', desc: 'Ich möchte das Fundament legen und erste Lieder spielen.' },
                  { val: 'vertieft' as const, emoji: '🚀', label: 'Ich will mich wirklich vertieft auseinandersetzen', desc: 'Ich nehme es ernst und möchte möglichst viel lernen.' },
                  { val: 'schnuppern' as const, emoji: '👀', label: 'Ich will einfach mal reinschnuppern', desc: 'Erst schauen, ob es mir gefällt — unverbindlich.' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => navigate({ ...state, depth: opt.val })}
                    className={`w-full p-4 border text-left transition-all hover:border-accent-gold ${state.depth === opt.val ? 'border-accent-gold bg-accent-gold/5' : 'border-border'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{opt.emoji}</span>
                      <div>
                        <p className="font-sans text-sm font-medium mb-0.5">{opt.label}</p>
                        <p className="font-sans text-xs text-text-secondary">{opt.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={goBack} className="mt-5 font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── has_instrument ── */}
          {currentStep === 'has_instrument' && (
            <motion.div
              key="has_instrument"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Dein Instrument</p>
              <h3 className="font-heading text-xl font-bold mb-2">Hast du bereits ein Instrument?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <button
                  onClick={() => navigate({ ...state, hasInstrument: 'yes' })}
                  className="p-5 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <span className="text-2xl block mb-2">✅</span>
                  <p className="font-heading font-bold text-sm mb-1">Ja, ich habe bereits ein Instrument</p>
                  <p className="font-sans text-xs text-text-secondary">Ich kann sofort loslegen.</p>
                </button>
                <button
                  onClick={() => navigate({ ...state, hasInstrument: 'no' })}
                  className="p-5 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <span className="text-2xl block mb-2">🔍</span>
                  <p className="font-heading font-bold text-sm mb-1">Nein, ich habe noch keins</p>
                  <p className="font-sans text-xs text-text-secondary">Ich bin noch auf der Suche.</p>
                </button>
              </div>
              <button onClick={goBack} className="font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── is_formation ── */}
          {currentStep === 'is_formation' && (
            <motion.div
              key="is_formation"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Solo oder Formation</p>
              <h3 className="font-heading text-xl font-bold mb-2">Lernst du solo oder in einer Formation?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <button
                  onClick={() => navigate({ ...state, isFormation: 'no', formationInterest: null })}
                  className="p-5 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <span className="text-2xl block mb-2">👤</span>
                  <p className="font-heading font-bold text-sm mb-1">Nein, ich lerne solo</p>
                  <p className="font-sans text-xs text-text-secondary">Ich möchte mich als Einzelperson weiterentwickeln.</p>
                </button>
                <button
                  onClick={() => navigate({ ...state, isFormation: 'yes', soloInterest: null })}
                  className="p-5 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <span className="text-2xl block mb-2">👥</span>
                  <p className="font-heading font-bold text-sm mb-1">Ja, ich bin Teil einer Formation</p>
                  <p className="font-sans text-xs text-text-secondary">Wir sind 2–5 Musikerinnen und Musiker.</p>
                </button>
              </div>
              <button onClick={goBack} className="font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── solo_interest ── */}
          {currentStep === 'solo_interest' && (
            <motion.div
              key="solo_interest"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Dein Ziel</p>
              <h3 className="font-heading text-xl font-bold mb-2">Was interessiert dich am meisten?</h3>
              <div className="space-y-3 mb-5">
                <button
                  onClick={() => navigate({ ...state, soloInterest: 'vertiefen' })}
                  className="w-full p-4 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🎓</span>
                    <div>
                      <p className="font-sans text-sm font-medium mb-0.5">Ein oder mehrere Instrumente weiter vertiefen</p>
                      <p className="font-sans text-xs text-text-secondary">Strukturiert besser werden — mit Lehrgang und Feedback.</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => navigate({ ...state, soloInterest: 'neue_stuecke' })}
                  className="w-full p-4 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🎵</span>
                    <div>
                      <p className="font-sans text-sm font-medium mb-0.5">Neue Stücke und Lieder lernen</p>
                      <p className="font-sans text-xs text-text-secondary">Meinen Fundus erweitern — die Lernvideodatenbank reicht mir.</p>
                    </div>
                  </div>
                </button>
              </div>
              <button onClick={goBack} className="font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── formation_interest ── */}
          {currentStep === 'formation_interest' && (
            <motion.div
              key="formation_interest"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs text-text-secondary mb-1">Euer Ziel</p>
              <h3 className="font-heading text-xl font-bold mb-2">Was wollt ihr als Formation erreichen?</h3>
              <div className="space-y-3 mb-5">
                <button
                  onClick={() => navigate({ ...state, formationInterest: 'solo_vertiefen' })}
                  className="w-full p-4 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🎓</span>
                    <div>
                      <p className="font-sans text-sm font-medium mb-0.5">Ich persönlich möchte mich in Instrument(en) vertiefen</p>
                      <p className="font-sans text-xs text-text-secondary">Individuell besser werden, als Mitglied einer Formation.</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => navigate({ ...state, formationInterest: 'formation_vertiefen' })}
                  className="w-full p-4 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">👥</span>
                    <div>
                      <p className="font-sans text-sm font-medium mb-0.5">Wir möchten uns als Formation gemeinsam vertiefen</p>
                      <p className="font-sans text-xs text-text-secondary">Alle Mitglieder sollen vom gleichen Abo profitieren.</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => navigate({ ...state, formationInterest: 'neue_stuecke' })}
                  className="w-full p-4 border border-border text-left hover:border-accent-gold transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🎵</span>
                    <div>
                      <p className="font-sans text-sm font-medium mb-0.5">Wir möchten neue Lieder und Stücke lernen</p>
                      <p className="font-sans text-xs text-text-secondary">Zugang zur Lernvideodatenbank — Spezialpreis für Formationen.</p>
                    </div>
                  </div>
                </button>
              </div>
              <button onClick={goBack} className="font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                ← Zurück
              </button>
            </motion.div>
          )}

          {/* ── Result ── */}
          {currentStep === 'result' && (
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
                      <p className="font-sans text-xs text-accent-gold uppercase tracking-widest mb-2">Beratungsgespräch buchen</p>
                      <h3 className="font-heading text-xl font-bold mb-1">Kostenlose 30-Minuten Beratung</h3>
                      <p className="font-sans text-xs text-text-secondary mb-5">Unverbindlich — das LAEMU-Team hilft dir, das richtige Angebot zu finden.</p>

                      {/* Slots */}
                      <p className="font-sans text-[10px] uppercase tracking-widest text-text-secondary mb-2">Freie Termine</p>
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {bookingSlots.map(slot => (
                          <button key={slot} onClick={() => setBookingSlot(slot)}
                            className={`py-2.5 px-3 border text-left font-sans text-xs transition-all ${bookingSlot === slot ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border hover:border-dark'}`}>
                            {slot}
                          </button>
                        ))}
                      </div>

                      {/* Format selection */}
                      {bookingSlot && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                          <p className="font-sans text-[10px] uppercase tracking-widest text-text-secondary mb-2">Gesprächsformat</p>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <button onClick={() => setBookingFormat('online')}
                              className={`p-4 border text-left transition-all ${bookingFormat === 'online' ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
                              <span className="block text-xl mb-1.5">💻</span>
                              <p className="font-heading font-bold text-sm">Online</p>
                              <p className="font-sans text-xs text-text-secondary mt-0.5">Video-Link per E-Mail</p>
                            </button>
                            <button onClick={() => setBookingFormat('phone')}
                              className={`p-4 border text-left transition-all ${bookingFormat === 'phone' ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
                              <span className="block text-xl mb-1.5">📞</span>
                              <p className="font-heading font-bold text-sm">Telefon</p>
                              <p className="font-sans text-xs text-text-secondary mt-0.5">Rückruf von LAEMU</p>
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Contact details */}
                      {bookingSlot && bookingFormat && (
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
                        disabled={!bookingSlot || !bookingFormat || !bookingName.trim() || !bookingEmail.trim()}
                        onClick={() => setBookingConfirmed(true)}
                        className={`w-full py-3 font-sans font-medium text-sm transition-colors ${bookingSlot && bookingFormat && bookingName.trim() && bookingEmail.trim() ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                      >
                        Termin bestätigen →
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="booking-confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-accent-gold/10 border-2 border-accent-gold flex items-center justify-center mx-auto mb-5">
                        <span className="text-2xl">{bookingFormat === 'online' ? '💻' : '📞'}</span>
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-2">Termin bestätigt!</h3>
                      <p className="font-sans text-sm font-medium text-dark mb-1">{bookingSlot}</p>
                      <p className="font-sans text-xs text-text-secondary mb-3">
                        {bookingFormat === 'online'
                          ? 'Du erhältst deinen Meeting-Link per E-Mail.'
                          : 'Das LAEMU-Team ruft dich zum vereinbarten Termin an.'}
                      </p>
                      <p className="font-sans text-xs text-text-secondary mb-6">Bestätigung an <span className="text-dark">{bookingEmail}</span> gesendet.</p>
                      <button onClick={reset} className="font-sans text-xs text-text-secondary hover:text-dark underline">Zum Anfang</button>
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

                  {/* formation_pro */}
                  {quizResult === 'formation_pro' && (
                    <>
                      <h3 className="font-heading text-xl font-bold mb-1">Formation Pro All-in-One</h3>
                      <div className="border border-border p-4 mb-4">
                        <p className="font-heading font-bold text-2xl mb-0.5">{chf(2499)}<span className="font-sans text-sm text-text-secondary font-normal">/Jahr</span></p>
                        <p className="font-sans text-xs text-text-secondary">Pro-Zugang für alle Mitglieder — alle Instrumente, volle Lernvideodatenbank.</p>
                      </div>
                      <Link href="/musikschule/formation" className="inline-block w-full text-center py-3 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors mb-3">
                        Formation-Vorteile entdecken →
                      </Link>
                    </>
                  )}

                  {/* formation_lernvideo */}
                  {quizResult === 'formation_lernvideo' && (
                    <>
                      <h3 className="font-heading text-xl font-bold mb-1">Formation Lernvideodatenbank</h3>
                      <div className="border border-border p-4 mb-4">
                        <p className="font-heading font-bold text-2xl mb-0.5">{chf(1999)}<span className="font-sans text-sm text-text-secondary font-normal">/Jahr</span></p>
                        <p className="font-sans text-xs text-text-secondary">Lernvideodatenbank für alle Mitglieder — alle Instrumente inklusive.</p>
                      </div>
                      <Link href="/musikschule/formation" className="inline-block w-full text-center py-3 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors mb-3">
                        Formation-Vorteile entdecken →
                      </Link>
                    </>
                  )}

                  {/* schnuppern_ohne_instrument */}
                  {quizResult === 'schnuppern_ohne_instrument' && (
                    <>
                      <h3 className="font-heading text-xl font-bold mb-1">3-Monate Schnupperabo + Instrument mieten</h3>
                      <div className="border border-border p-4 mb-4">
                        <ul className="space-y-1.5">
                          {[
                            '3 Monate Starter-Abo (monatlich kündbar)',
                            'LAEMU Instrument-Jahresmiete (20% Rabatt)',
                            'Kein Risiko — einfach reinschnuppern',
                            'LAEMU Membership inklusive',
                          ].map(f => (
                            <li key={f} className="font-sans text-xs flex items-start gap-2">
                              <span className="text-accent-gold mt-0.5">✓</span>{f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="font-sans text-xs text-text-secondary mb-4">
                        Schreib uns: <a href="mailto:info@laemu.ch" className="text-dark hover:underline font-medium">info@laemu.ch</a>
                      </p>
                    </>
                  )}

                  {/* schnuppern_mit_instrument */}
                  {quizResult === 'schnuppern_mit_instrument' && (
                    <>
                      <h3 className="font-heading text-xl font-bold mb-1">Monatliches Starter-Abo</h3>
                      <div className="border border-border p-4 mb-4">
                        <p className="font-heading font-bold text-2xl mb-0.5">
                          {chf(individualPricing.starter[resultScope].monthly)}<span className="font-sans text-sm text-text-secondary font-normal">/Mt.</span>
                        </p>
                        <p className="font-sans text-xs text-text-secondary mt-1">Strukturierter Lehrgang — monatlich kündbar, jederzeit auf Jahresabo wechseln.</p>
                      </div>
                      <p className="font-sans text-xs text-text-secondary bg-accent-gold/5 border border-accent-gold/20 px-3 py-2 mb-4">
                        🎸 Jahresabo? 20% Rabatt auf die LAEMU Instrument-Jahresmiete inklusive.
                      </p>
                    </>
                  )}

                  {/* starter */}
                  {quizResult === 'starter' && (
                    <>
                      <h3 className="font-heading text-xl font-bold mb-1">Starter — {scopeLabels[resultScope]}</h3>
                      <div className="flex items-center gap-4 border border-border p-4 mb-4">
                        <div>
                          <p className="font-sans text-xs text-text-secondary mb-0.5">Monatlich</p>
                          <p className="font-heading font-bold">{chf(individualPricing.starter[resultScope].monthly)}<span className="font-sans text-xs text-text-secondary font-normal">/Mt.</span></p>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div>
                          <p className="font-sans text-xs text-text-secondary mb-0.5">Jährlich <span className="text-accent-gold">(empfohlen)</span></p>
                          <p className="font-heading font-bold text-accent-gold">{chf(individualPricing.starter[resultScope].yearly)}<span className="font-sans text-xs text-text-secondary font-normal">/Jahr</span></p>
                        </div>
                      </div>
                      <p className="font-sans text-xs text-text-secondary bg-accent-gold/5 border border-accent-gold/20 px-3 py-2 mb-4">
                        🎸 Jahresabo? 20% Rabatt auf die LAEMU Instrument-Jahresmiete inklusive.
                      </p>
                    </>
                  )}

                  {/* pro */}
                  {quizResult === 'pro' && (
                    <>
                      <h3 className="font-heading text-xl font-bold mb-1">Pro — {scopeLabels[resultScope]}</h3>
                      <div className="flex items-center gap-4 border border-border p-4 mb-4">
                        <div>
                          <p className="font-sans text-xs text-text-secondary mb-0.5">Monatlich</p>
                          <p className="font-heading font-bold">{chf(individualPricing.pro[resultScope].monthly)}<span className="font-sans text-xs text-text-secondary font-normal">/Mt.</span></p>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div>
                          <p className="font-sans text-xs text-text-secondary mb-0.5">Jährlich <span className="text-accent-gold">(empfohlen)</span></p>
                          <p className="font-heading font-bold text-accent-gold">{chf(individualPricing.pro[resultScope].yearly)}<span className="font-sans text-xs text-text-secondary font-normal">/Jahr</span></p>
                        </div>
                      </div>
                      <p className="font-sans text-xs text-text-secondary bg-accent-gold/5 border border-accent-gold/20 px-3 py-2 mb-4">
                        🎸 Jahresabo? 20% Rabatt auf die LAEMU Instrument-Jahresmiete inklusive.
                      </p>
                    </>
                  )}

                  {/* lernvideo */}
                  {quizResult === 'lernvideo' && (
                    <>
                      <h3 className="font-heading text-xl font-bold mb-1">Lernvideodatenbank</h3>
                      <div className="flex items-center gap-4 border border-border p-4 mb-4">
                        <div>
                          <p className="font-sans text-xs text-text-secondary mb-0.5">Monatlich</p>
                          <p className="font-heading font-bold">{chf(99)}<span className="font-sans text-xs text-text-secondary font-normal">/Mt.</span></p>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div>
                          <p className="font-sans text-xs text-text-secondary mb-0.5">Jährlich <span className="text-accent-gold">(empfohlen)</span></p>
                          <p className="font-heading font-bold text-accent-gold">{chf(999)}<span className="font-sans text-xs text-text-secondary font-normal">/Jahr</span></p>
                        </div>
                      </div>
                      <p className="font-sans text-xs text-text-secondary bg-accent-gold/5 border border-accent-gold/20 px-3 py-2 mb-4">
                        🎸 Jahresabo? 20% Rabatt auf die LAEMU Instrument-Jahresmiete inklusive.
                      </p>
                    </>
                  )}

                  {quizResult === null && (
                    <p className="font-sans text-text-secondary text-sm mb-6">Wir konnten keine passende Empfehlung ermitteln. Schau dir unsere Angebote direkt an.</p>
                  )}

                  {/* Primary CTA: buy — not for formation, schnuppern_ohne_instrument, or null */}
                  {quizResult !== 'formation_pro' && quizResult !== 'formation_lernvideo' && quizResult !== 'schnuppern_ohne_instrument' && quizResult !== null && (
                    <button
                      onClick={() => {
                        const planMap: Record<string, { plan: IndividualPlan; scope?: Scope }> = {
                          starter: { plan: 'starter', scope: resultScope },
                          pro: { plan: 'pro', scope: resultScope },
                          lernvideo: { plan: 'lernvideo' },
                          schnuppern_mit_instrument: { plan: 'starter', scope: '1' },
                        }
                        const cfg = planMap[quizResult] ?? { plan: 'starter' as IndividualPlan }
                        onStartSubscription({ purchaserType: 'individual', ...cfg })
                      }}
                      className="w-full py-3 bg-accent-gold text-white font-sans font-semibold text-sm hover:bg-accent-gold/90 transition-colors mb-3"
                    >
                      Jetzt abonnieren →
                    </button>
                  )}

                  {/* Secondary CTAs — not for formation results */}
                  {quizResult !== 'formation_pro' && quizResult !== 'formation_lernvideo' && quizResult !== null && (
                    <div className="space-y-2 mb-5">
                      <button
                        onClick={() => { setResultAction('booking'); setBookingConfirmed(false); setBookingSlot(null); setBookingName(''); setBookingEmail(''); setBookingFormat(null) }}
                        className="w-full flex items-center gap-3 p-3.5 border border-border hover:border-accent-gold transition-all text-left group"
                      >
                        <span className="text-xl flex-shrink-0">📅</span>
                        <div>
                          <p className="font-heading font-bold text-sm group-hover:text-accent-gold transition-colors">Kostenlose Beratung buchen</p>
                          <p className="font-sans text-xs text-text-secondary">30 Min. mit dem LAEMU-Team — online oder telefonisch.</p>
                        </div>
                      </button>
                      <button
                        onClick={() => { setResultAction('video'); setVideoSent(false); setVideoEmail('') }}
                        className="w-full flex items-center gap-3 p-3.5 border border-border hover:border-accent-gold transition-all text-left group"
                      >
                        <span className="text-xl flex-shrink-0">📹</span>
                        <div>
                          <p className="font-heading font-bold text-sm group-hover:text-accent-gold transition-colors">Kostenlose Probelektion erhalten</p>
                          <p className="font-sans text-xs text-text-secondary">Wir schicken dir ein Video direkt per E-Mail — kein Abo nötig.</p>
                        </div>
                      </button>
                      <button onClick={onScrollToPricing} className="w-full py-2 font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                        Alle Angebote ansehen →
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3 mt-2">
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

type ModalStepId = 'who' | 'ind_plan' | 'ind_scope' | 'ind_instruments' | 'ind_billing' | 'form_plan' | 'form_details' | 'account' | 'confirm'

function getModalSequence(
  purchaserType: 'individual' | 'formation' | '',
  indPlan: IndividualPlan | '',
  scope: Scope | '',
): ModalStepId[] {
  if (purchaserType === 'formation') {
    return ['who', 'form_plan', 'form_details', 'account', 'confirm']
  }
  if (purchaserType === 'individual') {
    const seq: ModalStepId[] = ['who', 'ind_plan']
    if (indPlan === 'starter' || indPlan === 'pro') {
      seq.push('ind_scope')
      if (scope === '1' || scope === '2') seq.push('ind_instruments')
    }
    seq.push('ind_billing', 'account', 'confirm')
    return seq
  }
  return ['who']
}

function MusiksSchuleModal({ onClose, initial }: ModalProps) {
  const [purchaserType, setPurchaserType] = useState<'individual' | 'formation' | ''>(initial?.purchaserType ?? '')
  const [indPlan, setIndPlan] = useState<IndividualPlan | ''>(
    (initial?.plan && ['lernvideo', 'starter', 'pro'].includes(initial.plan as string)) ? (initial.plan as IndividualPlan) : ''
  )
  const [scope, setScope] = useState<Scope | ''>(initial?.scope ?? '')
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')
  const [formPlan, setFormPlan] = useState<FormationPlan | ''>(
    (initial?.plan && ['pro_all', 'formation_lernvideo'].includes(initial.plan as string)) ? (initial.plan as FormationPlan) : ''
  )
  const [formationName, setFormationName] = useState('')
  const [memberCount, setMemberCount] = useState(3)
  const [accountMode, setAccountMode] = useState<'existing' | 'new' | ''>('')
  const [email, setEmail] = useState('niklaus@laemu.ch')
  const [password, setPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const sequence = getModalSequence(purchaserType, indPlan, scope)

  // Determine starting step
  function getInitialStep(): ModalStepId {
    if (initial?.purchaserType === 'formation') return 'form_plan'
    if (initial?.purchaserType === 'individual') {
      if (initial.plan && ['lernvideo', 'starter', 'pro'].includes(initial.plan as string)) {
        const p = initial.plan as IndividualPlan
        if (p === 'lernvideo') return 'ind_billing'
        if ((p === 'starter' || p === 'pro') && initial.scope) {
          // Skip to instrument selection if scope is 1 or 2; otherwise straight to billing
          return (initial.scope === '1' || initial.scope === '2') ? 'ind_instruments' : 'ind_billing'
        }
        return 'ind_plan'
      }
      return 'ind_plan'
    }
    return 'who'
  }

  const [currentStep, setCurrentStep] = useState<ModalStepId>(getInitialStep)

  function goNext() {
    const seq = getModalSequence(purchaserType, indPlan, scope)
    const idx = seq.indexOf(currentStep)
    if (idx !== -1 && idx < seq.length - 1) setCurrentStep(seq[idx + 1])
  }

  function goBack() {
    const seq = getModalSequence(purchaserType, indPlan, scope)
    const idx = seq.indexOf(currentStep)
    if (idx > 0) setCurrentStep(seq[idx - 1])
  }

  const isFormation = purchaserType === 'formation'
  const numInstruments = scope === '2' ? 2 : 1

  function getPrice(): number {
    if (isFormation && formPlan) return formationPricingData[formPlan]
    if (!indPlan) return 0
    if (indPlan === 'lernvideo') return billing === 'monthly' ? 99 : 999
    if (scope) {
      const p = individualPricing[indPlan][scope]
      return billing === 'monthly' ? p.monthly : p.yearly
    }
    return 0
  }

  const price = getPrice()
  const billingLabel = isFormation ? '/Jahr' : billing === 'monthly' ? '/Mt.' : '/Jahr'

  function toggleInstrument(id: string) {
    setSelectedInstruments(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= numInstruments) return [...prev.slice(-(numInstruments - 1)), id]
      return [...prev, id]
    })
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  // Progress display
  const totalSteps = sequence.length
  const currentStepIndex = sequence.indexOf(currentStep)
  const progressPct = totalSteps > 1 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0

  // Step titles
  const stepTitleMap: Record<ModalStepId, { title: string; subtitle: string }> = {
    who: { title: 'Wer bist du?', subtitle: 'Einzelperson oder Formation?' },
    ind_plan: { title: 'Welches Paket?', subtitle: 'Wähle dein Abonnement.' },
    ind_scope: { title: 'Wie viele Instrumente?', subtitle: 'Wähle den Umfang deines Abos.' },
    ind_instruments: { title: 'Welche Instrumente?', subtitle: 'Wähle deine Instrumente.' },
    ind_billing: { title: 'Monatlich oder jährlich?', subtitle: 'Wähle deinen Abrechnungszyklus.' },
    form_plan: { title: 'Welches Paket?', subtitle: 'Das passende Angebot für eure Formation.' },
    form_details: { title: 'Eure Formation', subtitle: 'Name und Mitgliederzahl eurer Formation.' },
    account: { title: 'Konto', subtitle: 'Melde dich an oder erstelle ein neues Konto.' },
    confirm: { title: 'Bestätigung', subtitle: 'Überprüfe dein Abonnement und schliesse ab.' },
  }

  const { title, subtitle } = stepTitleMap[currentStep]

  const canProceedIndPlan = indPlan !== ''
  const canProceedIndScope = scope !== ''
  const canProceedIndInstruments = selectedInstruments.length === numInstruments
  const canProceedAccount = accountMode !== '' && (
    accountMode === 'existing' ? (email.trim() !== '' && password !== '') :
    (newName.trim() !== '' && newEmail.trim() !== '' && newPassword.length >= 8)
  )
  const canProceedFormPlan = formPlan !== ''
  const canProceedFormDetails = formationName.trim().length > 0

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
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div>
            <p className="font-sans text-xs text-text-secondary mb-0.5">Schritt {currentStepIndex + 1} von {totalSteps}</p>
            <h2 className="font-heading text-xl font-bold">{title}</h2>
            <p className="font-sans text-sm text-text-secondary">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            {currentStepIndex > 0 && (
              <button
                onClick={goBack}
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

            {/* ── who ── */}
            {currentStep === 'who' && (
              <motion.div key="who" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setPurchaserType('individual'); setFormPlan(''); setCurrentStep('ind_plan') }}
                    className="group p-6 border border-border hover:border-accent-gold text-center transition-all hover:bg-accent-gold/5"
                  >
                    <span className="text-4xl block mb-3">👤</span>
                    <p className="font-heading font-bold text-base mb-1 group-hover:text-accent-gold transition-colors">Einzelperson</p>
                    <p className="font-sans text-xs text-text-secondary">Ich lerne für mich</p>
                  </button>
                  <button
                    onClick={() => { setPurchaserType('formation'); setIndPlan(''); setScope(''); setCurrentStep('form_plan') }}
                    className="group p-6 border border-border hover:border-accent-gold text-center transition-all hover:bg-accent-gold/5"
                  >
                    <span className="text-4xl block mb-3">👥</span>
                    <p className="font-heading font-bold text-base mb-1 group-hover:text-accent-gold transition-colors">Formation</p>
                    <p className="font-sans text-xs text-text-secondary">Wir lernen gemeinsam</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── ind_plan ── */}
            {currentStep === 'ind_plan' && (
              <motion.div key="ind_plan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="space-y-3 mb-5">
                  {([
                    { id: 'lernvideo' as IndividualPlan, emoji: '📹', name: 'Lernvideodatenbank', desc: 'Voller Zugang zur Lernvideo-Datenbank für alle Instrumente.', price: 999 },
                    { id: 'starter' as IndividualPlan, emoji: '🎓', name: 'Starter', desc: 'Strukturierter Lehrgang mit Starter-Videos — für 1, 2 oder alle Instrumente.', price: 699 },
                    { id: 'pro' as IndividualPlan, emoji: '⭐', name: 'Pro', desc: 'Alles aus Starter + vollständige Lernvideodatenbank — empfohlen.', price: 1199 },
                  ]).map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => {
                        setIndPlan(plan.id)
                        setScope('')
                        setSelectedInstruments([])
                      }}
                      className={`w-full text-left p-5 border transition-all ${indPlan === plan.id ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{plan.emoji}</span>
                          <div>
                            <p className="font-heading font-bold text-sm mb-0.5">{plan.name}</p>
                            <p className="font-sans text-xs text-text-secondary">{plan.desc}</p>
                          </div>
                        </div>
                        <p className="font-sans text-xs text-text-secondary flex-shrink-0 ml-3">ab {chf(plan.price)}/J.</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  disabled={!canProceedIndPlan}
                  onClick={goNext}
                  className={`w-full py-3 font-sans font-medium text-sm transition-colors ${canProceedIndPlan ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Weiter →
                </button>
              </motion.div>
            )}

            {/* ── ind_scope ── */}
            {currentStep === 'ind_scope' && (
              <motion.div key="ind_scope" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="space-y-3 mb-5">
                  {(['1', '2', 'all'] as Scope[]).map(s => {
                    const p = indPlan ? individualPricing[indPlan][s] : null
                    return (
                      <button
                        key={s}
                        onClick={() => { setScope(s); setSelectedInstruments([]) }}
                        className={`w-full p-5 border text-left transition-all ${scope === s ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-heading font-bold text-sm">{scopeLabels[s]}</p>
                          {p && (
                            <div className="text-right">
                              <p className="font-sans text-xs text-text-secondary">{chf(p.monthly)}/Mt.</p>
                              <p className="font-heading font-bold text-sm text-accent-gold">{chf(p.yearly)}/J.</p>
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <button
                  disabled={!canProceedIndScope}
                  onClick={goNext}
                  className={`w-full py-3 font-sans font-medium text-sm transition-colors ${canProceedIndScope ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Weiter →
                </button>
              </motion.div>
            )}

            {/* ── ind_instruments ── */}
            {currentStep === 'ind_instruments' && (
              <motion.div key="ind_instruments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <p className="font-sans text-xs text-text-secondary mb-4">
                  {scope === '1' ? 'Wähle dein Instrument' : 'Wähle deine 2 Instrumente'}
                </p>
                <div className="space-y-2 mb-5">
                  {instruments.map(inst => {
                    const sel = selectedInstruments.includes(inst.id)
                    return (
                      <button
                        key={inst.id}
                        onClick={() => toggleInstrument(inst.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 border text-left transition-all ${sel ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{inst.emoji}</span>
                          <div>
                            <p className="font-sans text-sm font-medium">{inst.label}</p>
                            <p className="font-sans text-xs text-text-secondary">{inst.subtitle}</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 border-2 flex-shrink-0 flex items-center justify-center transition-colors ${sel ? 'border-accent-gold bg-accent-gold' : 'border-border'}`}>
                          {sel && <span className="text-white text-[10px] font-bold">✓</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <button
                  disabled={!canProceedIndInstruments}
                  onClick={goNext}
                  className={`w-full py-3 font-sans font-medium text-sm transition-colors ${canProceedIndInstruments ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Weiter →
                </button>
              </motion.div>
            )}

            {/* ── ind_billing ── */}
            {currentStep === 'ind_billing' && (
              <motion.div key="ind_billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="space-y-3 mb-5">
                  {([
                    { val: 'monthly' as const, label: 'Monatlich', badge: null },
                    { val: 'yearly' as const, label: 'Jährlich', badge: '–14%' },
                  ]).map(opt => {
                    const priceVal = indPlan === 'lernvideo'
                      ? (opt.val === 'monthly' ? 99 : 999)
                      : (indPlan && scope) ? individualPricing[indPlan][scope][opt.val] : null
                    return (
                      <button
                        key={opt.val}
                        onClick={() => setBilling(opt.val)}
                        className={`w-full p-5 border text-left transition-all ${billing === opt.val ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-heading font-bold text-sm">{opt.label}</p>
                              {opt.badge && <span className="font-sans text-[10px] bg-accent-gold text-white px-1.5 py-0.5">{opt.badge}</span>}
                            </div>
                            {opt.val === 'yearly' && (
                              <p className="font-sans text-xs text-accent-gold">🎸 20% auf LAEMU Instrument-Jahresmiete inklusive</p>
                            )}
                          </div>
                          {priceVal && (
                            <p className="font-heading font-bold text-sm flex-shrink-0 ml-3">
                              {chf(priceVal)}<span className="font-sans text-xs text-text-secondary font-normal">{opt.val === 'monthly' ? '/Mt.' : '/Jahr'}</span>
                            </p>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <button onClick={goNext} className="w-full py-3 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors">
                  Weiter →
                </button>
              </motion.div>
            )}

            {/* ── form_plan ── */}
            {currentStep === 'form_plan' && (
              <motion.div key="form_plan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="space-y-3 mb-5">
                  {([
                    { id: 'pro_all' as FormationPlan, emoji: '🏆', label: 'Pro All-in-One', price: 2499, desc: 'Pro-Zugang für alle Mitglieder — alle Instrumente, volle Lernvideodatenbank.' },
                    { id: 'formation_lernvideo' as FormationPlan, emoji: '📹', label: 'Lernvideodatenbank', price: 1999, desc: 'Zugang zur gesamten Lernvideo-Datenbank für alle Mitglieder.' },
                  ]).map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => setFormPlan(plan.id)}
                      className={`w-full text-left p-5 border transition-all ${formPlan === plan.id ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{plan.emoji}</span>
                          <div>
                            <p className="font-heading font-bold text-sm mb-0.5">{plan.label}</p>
                            <p className="font-sans text-xs text-text-secondary">{plan.desc}</p>
                          </div>
                        </div>
                        <p className="font-heading font-bold text-sm flex-shrink-0 ml-3">{chf(plan.price)}<span className="font-sans text-xs text-text-secondary font-normal">/Jahr</span></p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  disabled={!canProceedFormPlan}
                  onClick={goNext}
                  className={`w-full py-3 font-sans font-medium text-sm transition-colors ${canProceedFormPlan ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Weiter →
                </button>
              </motion.div>
            )}

            {/* ── form_details ── */}
            {currentStep === 'form_details' && (
              <motion.div key="form_details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="font-sans text-xs text-text-secondary block mb-1.5">Name eurer Formation</label>
                    <input
                      type="text"
                      value={formationName}
                      onChange={e => setFormationName(e.target.value)}
                      placeholder="z. B. Trio Alpstein"
                      className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-text-secondary block mb-1.5">Anzahl Mitglieder</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => setMemberCount(n)}
                          className={`py-2.5 border text-center font-sans text-sm transition-all ${memberCount === n ? 'border-accent-gold bg-accent-gold/5 font-medium' : 'border-border hover:border-dark'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="font-sans text-[10px] text-text-secondary mt-1">Alle Mitglieder erhalten mit diesem Abo Zugang.</p>
                  </div>
                </div>
                <button
                  disabled={!canProceedFormDetails}
                  onClick={goNext}
                  className={`w-full py-3 font-sans font-medium text-sm transition-colors ${canProceedFormDetails ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Weiter →
                </button>
              </motion.div>
            )}

            {/* ── account ── */}
            {currentStep === 'account' && (
              <motion.div key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
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
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
                      </div>
                      <div>
                        <label className="font-sans text-xs text-text-secondary block mb-1">Passwort</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Dein Passwort" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
                      </div>
                    </motion.div>
                  )}
                  {accountMode === 'new' && (
                    <motion.div key="new" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mb-5">
                      <div>
                        <label className="font-sans text-xs text-text-secondary block mb-1">Name</label>
                        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Dein vollständiger Name" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
                      </div>
                      <div>
                        <label className="font-sans text-xs text-text-secondary block mb-1">E-Mail</label>
                        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="deine@email.ch" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
                      </div>
                      <div>
                        <label className="font-sans text-xs text-text-secondary block mb-1">Passwort</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mindestens 8 Zeichen" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!accountMode && (
                  <p className="font-sans text-sm text-text-secondary text-center py-4 mb-5">Wähle eine Option oben, um fortzufahren.</p>
                )}
                <button
                  disabled={!canProceedAccount}
                  onClick={goNext}
                  className={`w-full py-3 font-sans font-medium text-sm transition-colors ${canProceedAccount ? 'bg-accent-gold text-white hover:bg-accent-gold/90' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Weiter →
                </button>
              </motion.div>
            )}

            {/* ── confirm ── */}
            {currentStep === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <AnimatePresence mode="wait">
                  {!success ? (
                    <motion.div key="confirm-form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="border border-border p-5 mb-6 space-y-3">
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
                        {isFormation && formationName && (
                          <div>
                            <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-0.5">Formation</p>
                            <p className="font-sans text-sm">{formationName} ({memberCount} Mitglieder)</p>
                          </div>
                        )}
                        {!isFormation && (
                          <div>
                            <p className="font-sans text-xs text-text-secondary uppercase tracking-wide mb-0.5">Abrechnung</p>
                            <p className="font-sans text-sm">{billing === 'monthly' ? 'Monatlich' : 'Jährlich'}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 py-1">
                          <span className="text-accent-gold text-xs">✓</span>
                          <span className="font-sans text-xs text-text-secondary">LAEMU Membership inklusive</span>
                        </div>
                        <div className="border-t border-border pt-3 flex justify-between items-center">
                          <span className="font-sans text-sm text-text-secondary uppercase tracking-wide">Total</span>
                          <span className="font-heading font-bold text-xl">
                            {chf(price)}
                            <span className="font-sans text-sm text-text-secondary font-normal ml-0.5">{billingLabel}</span>
                          </span>
                        </div>
                      </div>
                      {!isFormation && billing === 'yearly' && (
                        <div className="mb-4">
                          <label className="font-sans text-xs text-text-secondary block mb-1.5">Rabattcode (optional)</label>
                          <div className="flex gap-2">
                            <input type="text" placeholder="z. B. LAEMU2026" className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark" />
                            <button className="px-4 py-2 border border-border font-sans text-sm text-text-secondary hover:border-dark transition-colors">Anwenden</button>
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
                      <p className="font-sans text-text-secondary text-sm mb-2">Dein Abonnement ist aktiv — viel Freude beim Lernen!</p>
                      <p className="font-sans text-xs text-text-secondary mb-8">Deine LAEMU Membership ist ab sofort ebenfalls aktiv.</p>
                      <Link href="/member/academy" className="inline-block px-8 py-3 bg-accent-gold text-white font-sans font-medium text-sm hover:bg-accent-gold/90 transition-colors">
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
