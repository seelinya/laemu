'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

// ─── Data ────────────────────────────────────────────────────────────────────

const instrumentsData: Record<string, { label: string; emoji: string; desc: string; subscribed: boolean; plan: 'starter' | 'pro' | null }> = {
  handorgel: { label: 'Handorgel', emoji: '🪗', desc: 'Das Herzstück der Ländlermusik', subscribed: true, plan: 'starter' },
  schwyzer: { label: 'Schwyzerörgeli', emoji: '🎶', desc: 'Diatonisch und voller Seele', subscribed: true, plan: 'starter' },
  begleit: { label: 'Begleitinstrument', emoji: '🎸', desc: 'Bass · Klarinette · Klavier', subscribed: false, plan: null },
  buehne: { label: 'Bühnenpräsenz', emoji: '🎤', desc: 'Auftreten mit Ausstrahlung', subscribed: false, plan: null },
}

type StarterKurs = {
  id: string
  title: string
  desc: string
  modules: number
  completedModules: number
  duration: string
  level: string
}

type ProKurs = {
  id: string
  title: string
  desc: string
  modules: number
  duration: string
  level: string
}

const handorgelStarterKurse: StarterKurs[] = [
  { id: 'grundlagen', title: 'Grundlagenkurs', desc: 'Der Einstieg in die Welt der Handorgel — von null bis zu deinen ersten Liedern.', modules: 5, completedModules: 3, duration: '8h', level: 'Einsteiger' },
  { id: 'uebungen', title: 'Übungskurse', desc: 'Strukturierte Übungen für Finger, Rhythmus und Klang.', modules: 4, completedModules: 0, duration: '6h', level: 'Einsteiger' },
  { id: 'pflege', title: 'Hege & Pflege', desc: 'Pflege, Stimmung und Wartung deiner Handorgel.', modules: 3, completedModules: 0, duration: '3h', level: 'Einsteiger' },
  { id: 'repertoire', title: 'Erstes Repertoire', desc: 'Deine ersten echten Ländlerstücke Schritt für Schritt erlernt.', modules: 6, completedModules: 0, duration: '10h', level: 'Einsteiger' },
]

const schwyzerStarterKurse: StarterKurs[] = [
  { id: 'grundlagen', title: 'Grundlagenkurs Schwyzerörgeli', desc: 'Der Einstieg in die diatonische Welt des Schwyzerörgeli.', modules: 5, completedModules: 1, duration: '7h', level: 'Einsteiger' },
  { id: 'uebungen', title: 'Übungskurse', desc: 'Strukturierte Übungen für Grifftechnik und Balg.', modules: 4, completedModules: 0, duration: '5h', level: 'Einsteiger' },
  { id: 'stimmung', title: 'Stimmung & Pflege', desc: 'Pflege und Wartung des Schwyzerörgeli.', modules: 3, completedModules: 0, duration: '2h', level: 'Einsteiger' },
  { id: 'repertoire', title: 'Appenzeller Repertoire', desc: 'Klassische Appenzeller Stücke für Einsteiger.', modules: 5, completedModules: 0, duration: '9h', level: 'Einsteiger' },
]

const handorgelProKurse: ProKurs[] = [
  { id: 'harmonielehre', title: 'Harmonielehre', desc: 'Akkorde, Tonarten und Stimmführung für die Handorgel.', modules: 4, duration: '7h', level: 'Fortgeschritten' },
  { id: 'fortgeschritten', title: 'Fortgeschrittene Techniken', desc: 'Läufe, Verzierungen und Dynamik auf höchstem Niveau.', modules: 5, duration: '9h', level: 'Fortgeschritten' },
  { id: 'ensemble', title: 'Ensemble-Spiel', desc: 'Zusammenspiel und Arrangement in der Formation.', modules: 3, duration: '5h', level: 'Fortgeschritten' },
  { id: 'improvisation', title: 'Improvisation', desc: 'Frei spielen im Ländlerstil — Variationen erfinden.', modules: 4, duration: '6h', level: 'Profi' },
]

const schwyzerProKurse: ProKurs[] = [
  { id: 'harmonielehre', title: 'Harmonielehre', desc: 'Tonarten, Akkorde und Stimmführung für das Schwyzerörgeli.', modules: 4, duration: '6h', level: 'Fortgeschritten' },
  { id: 'fortgeschritten', title: 'Fortgeschrittene Grifftechnik', desc: 'Verzierungen, schnelle Läufe und präziser Balgführung.', modules: 5, duration: '8h', level: 'Fortgeschritten' },
  { id: 'ensemble', title: 'Ensemble-Spiel', desc: 'Zusammenspiel in Appenzeller Formation.', modules: 3, duration: '4h', level: 'Fortgeschritten' },
  { id: 'improvisation', title: 'Improvisation & Zäuerli', desc: 'Freies Spiel und Zäuerli-Stilistik.', modules: 4, duration: '5h', level: 'Profi' },
]

type LernvideoItem = {
  id: number
  title: string
  composer: string
  difficulty: number
  duration: string
}

const handorgelLernvideos: LernvideoItem[] = [
  { id: 1, title: 'Heimetli-Polka', composer: 'H. Wenger', difficulty: 2, duration: '4 min' },
  { id: 2, title: 'Alpenrosen-Mazurka', composer: 'M. Kälin', difficulty: 3, duration: '5 min' },
  { id: 3, title: 'Chilbizüg', composer: 'Trad.', difficulty: 2, duration: '3 min' },
  { id: 4, title: 'Appenzeller Landler', composer: 'Trad.', difficulty: 3, duration: '6 min' },
  { id: 5, title: 'Mondnacht-Walzer', composer: 'P. Gasser', difficulty: 2, duration: '5 min' },
  { id: 6, title: 'Zäuerli-Polka', composer: 'Trad.', difficulty: 1, duration: '3 min' },
  { id: 7, title: 'Urchige Bueb', composer: 'R. Suter', difficulty: 4, duration: '7 min' },
  { id: 8, title: 'Dopplete Arme', composer: 'Trad.', difficulty: 3, duration: '5 min' },
  { id: 9, title: 'Schottisch de Luxe', composer: 'H. Odermatt', difficulty: 4, duration: '8 min' },
  { id: 10, title: 'Ländlerbuebe', composer: 'Trad.', difficulty: 2, duration: '4 min' },
]

const schwyzerLernvideos: LernvideoItem[] = [
  { id: 1, title: 'Appenzeller Landler Nr. 1', composer: 'Trad.', difficulty: 2, duration: '4 min' },
  { id: 2, title: 'Jubiläums-Schottisch', composer: 'M. Kälin', difficulty: 3, duration: '5 min' },
  { id: 3, title: 'Zäuerli-Melodie', composer: 'Trad.', difficulty: 2, duration: '3 min' },
  { id: 4, title: 'Innerrhoder Polka', composer: 'Trad.', difficulty: 1, duration: '3 min' },
  { id: 5, title: 'Bergblümlein-Walzer', composer: 'H. Ulmann', difficulty: 2, duration: '5 min' },
  { id: 6, title: 'Alpenrosenbuebe', composer: 'Trad.', difficulty: 3, duration: '6 min' },
  { id: 7, title: 'Hudigäggeler', composer: 'Trad.', difficulty: 4, duration: '7 min' },
  { id: 8, title: 'Sennenhütten-Schottisch', composer: 'P. Gasser', difficulty: 3, duration: '5 min' },
  { id: 9, title: 'Doppelte Freude', composer: 'R. Suter', difficulty: 4, duration: '8 min' },
  { id: 10, title: 'Frühlingslandler', composer: 'Trad.', difficulty: 2, duration: '4 min' },
]

// ─── Helper components ────────────────────────────────────────────────────────

function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 bg-border overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-accent-gold"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  )
}

function DifficultyDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((d) => (
        <div key={d} className={`w-1.5 h-1.5 rounded-full ${d <= value ? 'bg-accent-gold' : 'bg-border'}`} />
      ))}
    </div>
  )
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function InstrumentPage({ params }: { params: { id: string } }) {
  const [showAllVideos, setShowAllVideos] = useState(false)
  const inst = instrumentsData[params.id] ?? instrumentsData['handorgel']
  const starterKurse = params.id === 'schwyzer' ? schwyzerStarterKurse : handorgelStarterKurse
  const proKurse = params.id === 'schwyzer' ? schwyzerProKurse : handorgelProKurse
  const lernvideos = params.id === 'schwyzer' ? schwyzerLernvideos : handorgelLernvideos

  const completedStarterKurse = starterKurse.filter((k) => k.completedModules > 0).length
  const overallProgress = params.id === 'schwyzer' ? 18 : 42
  const visibleVideos = showAllVideos ? lernvideos : lernvideos.slice(0, 6)

  const getKursProgress = (kurs: StarterKurs): number => {
    if (kurs.modules === 0) return 0
    return Math.round((kurs.completedModules / kurs.modules) * 100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <div className="bg-dark text-white px-6 py-3 flex items-center gap-3 mt-20">
        <Link href="/member/academy" className="font-sans text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Musikschule
        </Link>
        <span className="text-white/30">/</span>
        <span className="font-sans text-sm font-medium">{inst.label}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex items-center gap-5">
            <div className="text-6xl">{inst.emoji}</div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-heading text-4xl font-bold">{inst.label}</h1>
                {inst.plan && (
                  <span className="font-sans text-sm bg-accent-gold text-white px-3 py-1 uppercase tracking-wide">
                    {inst.plan === 'starter' ? 'Starter ✓' : 'Pro ✓'}
                  </span>
                )}
              </div>
              <p className="font-sans text-text-secondary">{inst.desc}</p>
              <p className="font-sans text-sm mt-2">
                <span className="text-accent-gold font-medium">{completedStarterKurse} von {starterKurse.length} Kursen gestartet</span>
                <span className="text-text-secondary"> · {overallProgress}% Gesamtfortschritt</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Starter Kurs ── */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-sans text-xs bg-accent-gold text-white px-2 py-0.5 uppercase tracking-wide">Starter</span>
            <h2 className="font-heading text-2xl font-bold">Dein Starter-Lehrgang</h2>
          </div>
          <p className="font-sans text-text-secondary mb-6">
            Strukturierter Einstieg in {inst.plan === 'starter' ? `die ${inst.label}` : 'dein Instrument'} — von den Basics bis zu deinen ersten Stücken.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {starterKurse.map((kurs, i) => {
              const progress = getKursProgress(kurs)
              return (
                <motion.div
                  key={kurs.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-surface border border-border p-6 flex flex-col gap-4 hover:border-accent-gold transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-sans text-[10px] bg-background border border-border text-text-secondary px-1.5 py-0.5">{kurs.level}</span>
                      </div>
                      <h3 className="font-heading font-bold text-lg group-hover:text-accent-gold transition-colors">{kurs.title}</h3>
                      <p className="font-sans text-sm text-text-secondary mt-1 leading-relaxed">{kurs.desc}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-sans mb-1.5">
                      <span className="text-text-secondary">{kurs.modules} Module · {kurs.duration}</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                    {progress > 0 && (
                      <p className="font-sans text-xs text-accent-gold mt-1">{kurs.completedModules} von {kurs.modules} Modulen abgeschlossen</p>
                    )}
                  </div>
                  <div className="mt-auto">
                    <Link
                      href={`/member/academy/instrument/${params.id}/kurs/${kurs.id}`}
                      className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-dark border border-dark px-4 py-2 hover:bg-dark hover:text-white transition-colors"
                    >
                      Kurs öffnen
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ── Pro Kurs (locked) ── */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-sans text-xs bg-border text-text-secondary px-2 py-0.5 uppercase tracking-wide flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Pro
            </span>
            <h2 className="font-heading text-2xl font-bold text-text-secondary">Pro-Lehrgang — Upgrade erforderlich</h2>
          </div>
          <p className="font-sans text-text-secondary mb-6">Volle Techniken, Harmonielehre, Improvisation und Ensemble-Spiel.</p>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proKurse.map((kurs, i) => (
                <motion.div
                  key={kurs.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-surface border border-border p-6 flex flex-col gap-4 relative overflow-hidden"
                >
                  {/* Lock overlay */}
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-10">
                    <div className="w-10 h-10 bg-border flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </div>
                    <span className="font-sans text-xs text-text-secondary bg-border px-2 py-0.5">Pro erforderlich</span>
                  </div>
                  {/* Blurred content */}
                  <div className="blur-[1px] select-none">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-[10px] bg-background border border-border text-text-secondary px-1.5 py-0.5">{kurs.level}</span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-text-secondary">{kurs.title}</h3>
                    <p className="font-sans text-sm text-text-secondary mt-1">{kurs.desc}</p>
                    <p className="font-sans text-xs text-text-secondary mt-3">{kurs.modules} Module · {kurs.duration}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pro upgrade CTA banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-dark text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span className="font-sans text-sm font-medium text-accent-gold">Schalte den Pro-Kurs frei</span>
              </div>
              <p className="font-sans text-white/60 text-sm">Persönliches Feedback, Live-Calls, alle Lernvideos und Profi-Techniken</p>
            </div>
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="text-right">
                <p className="font-heading font-bold text-2xl text-accent-gold">CHF 119<span className="text-base font-sans font-normal text-white/50">/Mt.</span></p>
                <p className="font-sans text-xs text-white/40">oder CHF 1&apos;199/Jahr</p>
              </div>
              <Button variant="primary" size="sm" href="/member/upgrade">Auf Pro upgraden →</Button>
            </div>
          </motion.div>
        </section>

        {/* ── Lernvideo-Datenbank teaser (locked) ── */}
        <section>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-heading text-2xl font-bold">Lernvideo-Datenbank für {inst.label}</h2>
            <span className="font-sans text-xs bg-border text-text-secondary px-2 py-0.5 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Gesperrt
            </span>
          </div>
          <p className="font-sans text-text-secondary mb-6">Die beliebtesten Stücke — lerne Schritt für Schritt nach Noten und Tabs.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {visibleVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative bg-surface border border-border p-4 overflow-hidden group"
              >
                {/* Lock overlay */}
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col items-center gap-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span className="font-sans text-[10px] text-text-secondary">Freischalten</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-accent-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent-gold">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-medium text-sm leading-tight">{video.title}</h4>
                    <p className="font-sans text-xs text-text-secondary mt-0.5">{video.composer}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <DifficultyDots value={video.difficulty} />
                      <span className="font-sans text-xs text-text-secondary">{video.duration}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {!showAllVideos && (
            <button
              onClick={() => setShowAllVideos(true)}
              className="mt-4 font-sans text-sm text-text-secondary hover:text-dark transition-colors flex items-center gap-1"
            >
              Alle {lernvideos.length} Videos anzeigen
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-surface border border-dashed border-border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <p className="font-sans text-sm font-medium">Alle {inst.label}-Videos entdecken</p>
              <p className="font-sans text-xs text-text-secondary mt-0.5">200+ Stücke · Noten, Tabs & Playalongs · täglich neue Inhalte</p>
            </div>
            <Link
              href="/member/academy/lernvideos"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-text-secondary border border-border px-4 py-2 hover:border-dark hover:text-dark transition-colors flex-shrink-0 opacity-60 cursor-not-allowed"
              onClick={(e) => e.preventDefault()}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-text-secondary">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              Alle {inst.label}-Videos entdecken →
            </Link>
          </motion.div>
        </section>

      </div>
    </div>
  )
}
