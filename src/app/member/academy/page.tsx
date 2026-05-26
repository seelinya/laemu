'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'

// ─── Data ────────────────────────────────────────────────────────────────────

const journeys = [
  {
    id: 1,
    instrument: 'Handorgel',
    title: 'Weg zum Handorgel-Profi',
    emoji: '🪗',
    instructor: 'Hansruedi Wenger',
    instructorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    coverImg: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
    totalLessons: 48,
    completedLessons: 19,
    currentStage: 2,
    stages: [
      {
        id: 1,
        title: 'Erste Töne',
        subtitle: 'Grundlagen & Haltung',
        lessons: 8,
        completed: 8,
        locked: false,
        milestone: 'Erste Melodie gespielt',
      },
      {
        id: 2,
        title: 'Rhythmus & Grundgriffe',
        subtitle: 'Ländler-Basics',
        lessons: 12,
        completed: 11,
        locked: false,
        milestone: 'Erster Ländler gespielt',
        current: true,
      },
      {
        id: 3,
        title: 'Melodieführung',
        subtitle: 'Phrasierung & Stil',
        lessons: 10,
        completed: 0,
        locked: false,
        milestone: 'Auftritt bereit',
      },
      {
        id: 4,
        title: 'Fortgeschrittene Technik',
        subtitle: 'Verzierungen & Dynamik',
        lessons: 12,
        completed: 0,
        locked: true,
        milestone: 'Profi-Level erreicht',
      },
      {
        id: 5,
        title: 'Meisterklasse',
        subtitle: 'Stil & Eigenpersönlichkeit',
        lessons: 6,
        completed: 0,
        locked: true,
        milestone: 'Journey abgeschlossen 🏆',
      },
    ],
  },
  {
    id: 2,
    instrument: 'Schwyzerörgeli',
    title: 'Schwyzerörgeli Meisterschaft',
    emoji: '🎶',
    instructor: 'Maria Kälin',
    instructorImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    coverImg: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80',
    totalLessons: 36,
    completedLessons: 7,
    currentStage: 1,
    stages: [
      {
        id: 1,
        title: 'Kennenlernen',
        subtitle: 'Instrument & Haltung',
        lessons: 6,
        completed: 6,
        locked: false,
        milestone: 'Basis sitzt',
      },
      {
        id: 2,
        title: 'Erste Melodien',
        subtitle: 'Einfache Stücke',
        lessons: 10,
        completed: 1,
        locked: false,
        milestone: 'Erstes Stück gespielt',
        current: true,
      },
      {
        id: 3,
        title: 'Rhythmik & Stil',
        subtitle: 'Appenzeller Stil',
        lessons: 12,
        completed: 0,
        locked: true,
        milestone: 'Stilsicher unterwegs',
      },
      {
        id: 4,
        title: 'Meisterklasse',
        subtitle: 'Virtuosität & Ausdruck',
        lessons: 8,
        completed: 0,
        locked: true,
        milestone: 'Journey abgeschlossen 🏆',
      },
    ],
  },
]

const achievements = [
  { icon: '🔥', label: '7-Tage Streak', earned: true },
  { icon: '🎓', label: 'Erste Lektion', earned: true },
  { icon: '⭐', label: '10 Lektionen', earned: true },
  { icon: '🏆', label: 'Kurs abgeschlossen', earned: false },
  { icon: '🎵', label: 'Meisterklasse', earned: false },
  { icon: '🌟', label: 'Profi Level', earned: false },
]

const plans = {
  current: {
    id: 'starter',
    name: 'Starterkurs',
    price: 'CHF 79',
    period: '/Monat',
    features: ['Unbegrenzte Lehrvideos', 'Community Zugang', 'Monatliche Live-Calls'],
  },
  upgrade: {
    id: 'pro',
    name: 'Pro-Kurs',
    price: 'CHF 149',
    period: '/Monat',
    features: [
      'Alles aus dem Starterkurs',
      'Persönliches Lehrerfeedback',
      'Lern-Camps & Wochenenden',
      'Exklusiver Pro-Content',
      'Direkt-Nachrichten an Lehrpersonen',
    ],
  },
}

const navItems = [
  { icon: '🗺️', label: 'Meine Journeys' },
  { icon: '📚', label: 'Meine Kurse' },
  { icon: '📈', label: 'Fortschritt' },
  { icon: '🏆', label: 'Achievements' },
  { icon: '💳', label: 'Mein Abo' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 bg-border rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-accent-gold rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  )
}

function UpgradeModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-surface border border-border w-full max-w-lg shadow-2xl"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="bg-dark p-6 relative">
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl leading-none"
            >
              ×
            </button>
            <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-1">Abo-Upgrade</p>
            <h3 className="font-serif text-2xl font-bold text-white">Wechsel zum Pro-Kurs</h3>
            <p className="font-sans text-sm text-white/60 mt-1">Bitte bestätige dein Upgrade</p>
          </div>

          {/* Plan comparison */}
          <div className="p-6 space-y-4">
            {/* Current */}
            <div className="flex items-start gap-3 bg-background border border-border p-4">
              <div className="w-2 h-2 rounded-full bg-text-secondary mt-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-sans text-xs text-text-secondary uppercase tracking-wider mb-1">Aktuell</p>
                  <span className="font-sans text-xs text-text-secondary line-through">
                    {plans.current.price}<span className="text-text-secondary/60">{plans.current.period}</span>
                  </span>
                </div>
                <p className="font-serif font-bold">{plans.current.name}</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center text-accent-gold text-xl">↓</div>

            {/* New */}
            <div className="flex items-start gap-3 bg-accent-gold/5 border border-accent-gold/40 p-4">
              <div className="w-2 h-2 rounded-full bg-accent-gold mt-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-sans text-xs text-accent-gold uppercase tracking-wider mb-1">Neu</p>
                  <span className="font-serif font-bold text-accent-gold">
                    {plans.upgrade.price}
                    <span className="font-sans text-sm font-normal text-text-secondary">{plans.upgrade.period}</span>
                  </span>
                </div>
                <p className="font-serif font-bold">{plans.upgrade.name}</p>
              </div>
            </div>

            {/* New features */}
            <div className="space-y-2 pt-1">
              <p className="font-sans text-xs text-text-secondary uppercase tracking-wider">Neu für dich enthalten</p>
              {plans.upgrade.features.slice(1).map((f, i) => (
                <div key={i} className="flex items-center gap-2 font-sans text-sm">
                  <span className="text-accent-gold">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Fine print */}
            <p className="font-sans text-xs text-text-secondary border-t border-border pt-4">
              Das Upgrade wird sofort aktiv. Du wirst ab dem nächsten Abrechnungsdatum mit CHF 149/Monat belastet. Jederzeit kündbar.
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 border border-border py-3 font-sans text-sm font-medium hover:bg-background transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-accent-gold text-white py-3 font-sans text-sm font-medium hover:bg-accent-earth transition-colors"
            >
              Jetzt upgraden
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function UpgradeSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative bg-surface border border-border w-full max-w-md shadow-2xl text-center p-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="text-5xl mb-4">🎉</div>
          <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-2">Upgrade erfolgreich</p>
          <h3 className="font-serif text-2xl font-bold mb-3">Willkommen im Pro-Kurs!</h3>
          <p className="font-sans text-sm text-text-secondary mb-6">
            Dein Zugang wurde sofort aktiviert. Viel Spass beim Lernen auf dem nächsten Level.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-accent-gold text-white py-3 font-sans text-sm font-medium hover:bg-accent-earth transition-colors"
          >
            Los geht's
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Journey Card ─────────────────────────────────────────────────────────────

function JourneyCard({ journey, onClick }: { journey: typeof journeys[0]; onClick: () => void }) {
  const progress = Math.round((journey.completedLessons / journey.totalLessons) * 100)
  const currentStage = journey.stages.find((s) => s.current)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border overflow-hidden group cursor-pointer hover:border-accent-gold transition-colors"
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={journey.coverImg}
          alt={journey.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{journey.emoji}</span>
            <span className="font-sans text-xs text-white/70 uppercase tracking-wider">{journey.instrument}</span>
          </div>
          <h4 className="font-serif text-lg font-bold text-white">{journey.title}</h4>
        </div>
        <div className="absolute top-3 right-3 bg-accent-gold/90 text-white text-xs px-2 py-1 font-sans font-medium">
          Stufe {journey.currentStage}/{journey.stages.length}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
            <Image src={journey.instructorImg} alt={journey.instructor} fill className="object-cover" unoptimized />
          </div>
          <p className="font-sans text-xs text-text-secondary">mit {journey.instructor}</p>
        </div>

        {currentStage && (
          <div className="bg-accent-gold/5 border border-accent-gold/20 px-3 py-2 mb-3">
            <p className="font-sans text-xs text-accent-gold font-medium">Aktuell: {currentStage.title}</p>
            <p className="font-sans text-xs text-text-secondary">{currentStage.subtitle}</p>
          </div>
        )}

        <div className="flex justify-between text-xs font-sans mb-1.5">
          <span className="text-text-secondary">{journey.completedLessons}/{journey.totalLessons} Lektionen</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>
    </motion.div>
  )
}

// ─── Journey Detail View ─────────────────────────────────────────────────────

function JourneyDetail({ journey, onBack }: { journey: typeof journeys[0]; onBack: () => void }) {
  const progress = Math.round((journey.completedLessons / journey.totalLessons) * 100)

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <button
        onClick={onBack}
        className="flex items-center gap-2 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        ← Zurück zu Journeys
      </button>

      {/* Journey Hero */}
      <div className="relative h-48 overflow-hidden mb-6">
        <Image src={journey.coverImg} alt={journey.title} fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-5 left-6 right-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{journey.emoji}</span>
            <span className="font-sans text-xs text-white/60 uppercase tracking-wider">{journey.instrument}</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">{journey.title}</h2>
          <p className="font-sans text-sm text-white/60">mit {journey.instructor}</p>
        </div>
      </div>

      {/* Overall progress */}
      <div className="bg-surface border border-border p-5 mb-6">
        <div className="flex justify-between text-sm font-sans mb-2">
          <span className="text-text-secondary">Gesamtfortschritt</span>
          <span className="font-medium">{journey.completedLessons} / {journey.totalLessons} Lektionen ({progress}%)</span>
        </div>
        <ProgressBar value={progress} className="mb-3" />
        <p className="font-sans text-xs text-text-secondary">
          Stufe {journey.currentStage} von {journey.stages.length} — du bist auf dem richtigen Weg!
        </p>
      </div>

      {/* Stages */}
      <h3 className="font-serif font-bold text-lg mb-4">Dein Lernweg</h3>
      <div className="space-y-3">
        {journey.stages.map((stage, i) => {
          const stageProgress = stage.lessons > 0 ? Math.round((stage.completed / stage.lessons) * 100) : 0
          const isDone = stage.completed === stage.lessons
          const isCurrent = stage.current
          const isLocked = stage.locked

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`border overflow-hidden transition-colors ${
                isLocked
                  ? 'border-border bg-surface opacity-50'
                  : isCurrent
                  ? 'border-accent-gold bg-accent-gold/5'
                  : isDone
                  ? 'border-muted-green/40 bg-muted-green/5'
                  : 'border-border bg-surface'
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Stage icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-serif font-bold text-sm ${
                    isLocked
                      ? 'bg-border text-text-secondary'
                      : isDone
                      ? 'bg-muted-green text-white'
                      : isCurrent
                      ? 'bg-accent-gold text-white'
                      : 'bg-background border border-border text-text-primary'
                  }`}
                >
                  {isLocked ? '🔒' : isDone ? '✓' : stage.id}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif font-bold text-sm">{stage.title}</h4>
                    {isCurrent && (
                      <span className="bg-accent-gold/20 text-accent-gold font-sans text-xs px-2 py-0.5">
                        Aktuell
                      </span>
                    )}
                    {isDone && !isCurrent && (
                      <span className="bg-muted-green/20 text-muted-green font-sans text-xs px-2 py-0.5">
                        Abgeschlossen
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-text-secondary">{stage.subtitle}</p>

                  {!isLocked && stage.lessons > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs font-sans mb-1">
                        <span className="text-text-secondary">{stage.completed}/{stage.lessons} Lektionen</span>
                        <span className="font-medium">{stageProgress}%</span>
                      </div>
                      <ProgressBar value={stageProgress} />
                    </div>
                  )}

                  {/* Milestone */}
                  <p className="font-sans text-xs text-text-secondary mt-2 flex items-center gap-1">
                    <span>🎯</span>
                    {stage.milestone}
                  </p>
                </div>

                {!isLocked && (
                  <button
                    className={`flex-shrink-0 px-4 py-2 font-sans text-xs font-medium transition-colors ${
                      isCurrent
                        ? 'bg-accent-gold text-white hover:bg-accent-earth'
                        : isDone
                        ? 'border border-border text-text-secondary hover:bg-background'
                        : 'border border-border text-text-secondary hover:bg-background'
                    }`}
                  >
                    {isCurrent ? 'Weitermachen' : isDone ? 'Wiederholen' : 'Starten'}
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Abo View ─────────────────────────────────────────────────────────────────

function AboView({
  onUpgradeClick,
  isUpgraded,
}: {
  onUpgradeClick: () => void
  isUpgraded: boolean
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className="font-serif font-bold text-xl mb-6">Mein Abo</h3>

      {/* Current plan */}
      <div className="bg-surface border border-border p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-1">Aktiver Plan</p>
            <h4 className="font-serif text-xl font-bold">{isUpgraded ? plans.upgrade.name : plans.current.name}</h4>
          </div>
          <div className="text-right">
            <p className="font-serif text-2xl font-bold text-accent-gold">
              {isUpgraded ? plans.upgrade.price : plans.current.price}
            </p>
            <p className="font-sans text-xs text-text-secondary">{plans.current.period}</p>
          </div>
        </div>
        <div className="space-y-2 border-t border-border pt-4">
          {(isUpgraded ? plans.upgrade.features : plans.current.features).map((f, i) => (
            <div key={i} className="flex items-center gap-2 font-sans text-sm">
              <span className="text-accent-gold">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <p className="font-sans text-xs text-text-secondary">Nächste Abrechnung: 26. Juni 2026</p>
          <button className="font-sans text-xs text-text-secondary underline hover:text-text-primary transition-colors">
            Abo kündigen
          </button>
        </div>
      </div>

      {/* Upgrade prompt (only shown if not yet upgraded) */}
      {!isUpgraded && (
        <div className="bg-dark p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-accent-gold mb-1">Upgrade verfügbar</p>
              <h4 className="font-serif text-xl font-bold text-white">Pro-Kurs</h4>
              <p className="font-sans text-sm text-white/60 mt-1">Hol dir persönliches Lehrerfeedback und exklusive Inhalte.</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-2xl font-bold text-accent-gold">{plans.upgrade.price}</p>
              <p className="font-sans text-xs text-white/50">{plans.upgrade.period}</p>
            </div>
          </div>
          <div className="space-y-2 mb-5">
            {plans.upgrade.features.slice(1).map((f, i) => (
              <div key={i} className="flex items-center gap-2 font-sans text-sm text-white/80">
                <span className="text-accent-gold">+</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onUpgradeClick}
            className="w-full bg-accent-gold text-white py-3 font-sans text-sm font-medium hover:bg-accent-earth transition-colors"
          >
            Jetzt auf Pro upgraden →
          </button>
        </div>
      )}

      {isUpgraded && (
        <div className="bg-muted-green/5 border border-muted-green/20 p-5 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-serif font-bold text-sm">Du bist im Pro-Kurs!</p>
            <p className="font-sans text-xs text-text-secondary">Alle Funktionen sind für dich freigeschaltet.</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MemberAcademyPage() {
  const [activeNav, setActiveNav] = useState('Meine Journeys')
  const [selectedJourney, setSelectedJourney] = useState<typeof journeys[0] | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isUpgraded, setIsUpgraded] = useState(false)

  function handleUpgradeConfirm() {
    setShowUpgradeModal(false)
    setIsUpgraded(true)
    setShowSuccessModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modals */}
      {showUpgradeModal && (
        <UpgradeModal
          onConfirm={handleUpgradeConfirm}
          onCancel={() => setShowUpgradeModal(false)}
        />
      )}
      {showSuccessModal && (
        <UpgradeSuccessModal onClose={() => setShowSuccessModal(false)} />
      )}

      {/* TOP BAR */}
      <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between sticky top-20 z-20">
        <div className="flex items-center gap-6">
          <h1 className="font-serif font-bold text-lg">LAEMU Academy</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent-gold/10 text-accent-gold border border-accent-gold/20 px-4 py-2">
            <span>🔥</span>
            <span className="font-sans font-bold text-sm">7 Tage Streak!</span>
          </div>
          <button className="p-2 hover:bg-background rounded-full transition-colors">
            <span>🔔</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-36 space-y-6">
              {/* Profile */}
              <div className="bg-surface border border-border p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-sm">Niklaus Hess</p>
                    <p className="font-sans text-xs text-accent-gold">
                      {isUpgraded ? 'Pro-Kurs Mitglied' : 'Starterkurs Mitglied'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-sans mb-1">
                    <span className="text-text-secondary">Gesamtfortschritt</span>
                    <span className="font-medium">59%</span>
                  </div>
                  <ProgressBar value={59} />
                  <p className="font-sans text-xs text-text-secondary">32 von 54 Lektionen</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-surface border border-border overflow-hidden">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveNav(item.label)
                      setSelectedJourney(null)
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 text-left ${
                      activeNav === item.label
                        ? 'bg-accent-gold/5 text-accent-gold font-medium'
                        : 'text-text-secondary hover:bg-background hover:text-text-primary'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Quick stats */}
              <div className="bg-surface border border-border p-5">
                <h3 className="font-serif font-bold text-sm mb-4">Diese Woche</h3>
                <div className="space-y-3">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Lektionen</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Lernzeit</span>
                    <span className="font-medium">2h 15 Min.</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Streak</span>
                    <span className="font-medium text-accent-gold">🔥 7 Tage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 space-y-8">

            {/* Greeting header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-2">Willkommen zurück</p>
                  <h2 className="font-serif text-3xl font-bold text-white mb-2">Guten Tag, Niklaus 👋</h2>
                  <p className="font-sans text-white/60">Du hast diese Woche bereits 5 Lektionen abgeschlossen. Weiter so!</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="bg-accent-gold/20 border border-accent-gold/30 px-4 py-3 text-center">
                    <p className="font-sans text-4xl mb-1">🔥</p>
                    <p className="font-serif font-bold text-accent-gold text-2xl">7</p>
                    <p className="font-sans text-xs text-white/50">Tage Streak</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Meine Journeys ─────────────────────────────────────── */}
            {activeNav === 'Meine Journeys' && (
              <AnimatePresence mode="wait">
                {selectedJourney ? (
                  <JourneyDetail
                    key="detail"
                    journey={selectedJourney}
                    onBack={() => setSelectedJourney(null)}
                  />
                ) : (
                  <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="font-serif font-bold text-xl mb-4">Meine Journeys</h3>
                    <p className="font-sans text-sm text-text-secondary mb-6">
                      Dein strukturierter Lernweg — von den ersten Tönen bis zur Meisterschaft.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {journeys.map((j, i) => (
                        <motion.div
                          key={j.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <JourneyCard journey={j} onClick={() => setSelectedJourney(j)} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* ── Meine Kurse ─────────────────────────────────────────── */}
            {activeNav === 'Meine Kurse' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="font-serif font-bold text-xl mb-4">Meine Kurse</h3>
                <div className="space-y-4">
                  {journeys.map((j) => {
                    const progress = Math.round((j.completedLessons / j.totalLessons) * 100)
                    const currentStage = j.stages.find((s) => s.current)
                    return (
                      <div
                        key={j.id}
                        className="bg-surface border border-border overflow-hidden flex cursor-pointer hover:border-accent-gold transition-colors group"
                        onClick={() => { setActiveNav('Meine Journeys'); setSelectedJourney(j) }}
                      >
                        <div className="relative w-36 flex-shrink-0 overflow-hidden">
                          <Image src={j.coverImg} alt={j.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="text-white text-2xl">▶</span>
                          </div>
                        </div>
                        <div className="p-5 flex-1">
                          <span className="font-sans text-xs text-accent-gold uppercase tracking-wider">{j.instrument}</span>
                          <h4 className="font-serif font-bold mt-1 mb-1 group-hover:text-accent-gold transition-colors">{j.title}</h4>
                          <p className="font-sans text-xs text-text-secondary mb-3">mit {j.instructor}</p>
                          {currentStage && (
                            <p className="font-sans text-xs text-text-secondary mb-3">▶ {currentStage.title}: {currentStage.subtitle}</p>
                          )}
                          <div className="flex justify-between text-xs font-sans mb-1.5">
                            <span className="text-text-secondary">{j.completedLessons}/{j.totalLessons} Lektionen</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <ProgressBar value={progress} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Fortschritt ─────────────────────────────────────────── */}
            {activeNav === 'Fortschritt' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="font-serif font-bold text-xl mb-6">Mein Fortschritt</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Lektionen', value: '32', sub: 'abgeschlossen' },
                    { label: 'Lernzeit', value: '14h', sub: 'gesamt' },
                    { label: 'Streak', value: '7', sub: 'Tage aktuell' },
                    { label: 'Journeys', value: '2', sub: 'aktiv' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface border border-border p-5 text-center">
                      <p className="font-serif text-3xl font-bold text-accent-gold">{stat.value}</p>
                      <p className="font-sans text-xs text-text-secondary mt-1">{stat.label}</p>
                      <p className="font-sans text-xs text-text-secondary">{stat.sub}</p>
                    </div>
                  ))}
                </div>
                <h4 className="font-serif font-bold text-lg mb-4">Fortschritt pro Journey</h4>
                <div className="space-y-4">
                  {journeys.map((j) => {
                    const progress = Math.round((j.completedLessons / j.totalLessons) * 100)
                    return (
                      <div key={j.id} className="bg-surface border border-border p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl">{j.emoji}</span>
                          <div>
                            <h5 className="font-serif font-bold text-sm">{j.title}</h5>
                            <p className="font-sans text-xs text-text-secondary">Stufe {j.currentStage} / {j.stages.length}</p>
                          </div>
                          <span className="ml-auto font-sans font-bold text-sm">{progress}%</span>
                        </div>
                        <ProgressBar value={progress} />
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Achievements ─────────────────────────────────────────── */}
            {activeNav === 'Achievements' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="font-serif font-bold text-xl mb-4">Meine Achievements</h3>
                <p className="font-sans text-sm text-text-secondary mb-6">Verdiene Abzeichen, indem du lernst, Streaks hältst und Meilensteine erreichst.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {achievements.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07 }}
                      className={`flex flex-col items-center gap-3 p-6 border text-center ${
                        a.earned
                          ? 'border-accent-gold/30 bg-accent-gold/5'
                          : 'border-border bg-surface opacity-40'
                      }`}
                    >
                      <span className="text-4xl">{a.icon}</span>
                      <span className="font-serif font-bold text-sm">{a.label}</span>
                      <span className="font-sans text-xs text-text-secondary">
                        {a.earned ? 'Verdient ✓' : 'Noch nicht verdient'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Mein Abo ─────────────────────────────────────────────── */}
            {activeNav === 'Mein Abo' && (
              <AboView
                onUpgradeClick={() => setShowUpgradeModal(true)}
                isUpgraded={isUpgraded}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
