'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { courses, ALLGEMEIN_COURSES } from '@/lib/courses'

// ─── Data ────────────────────────────────────────────────────────────────────

const instrumentsData: Record<string, { label: string; emoji: string; desc: string; subscribed: boolean; plan: 'starter' | 'pro' | null }> = {
  handorgel: { label: 'Handorgel', emoji: '🪗', desc: 'Das Herzstück der Ländlermusik', subscribed: true, plan: 'starter' },
  schwyzer: { label: 'Schwyzerörgeli', emoji: '🎶', desc: 'Diatonisch und voller Seele', subscribed: true, plan: 'starter' },
  begleit: { label: 'Begleitinstrument', emoji: '🎸', desc: 'Bass · Klarinette · Klavier', subscribed: false, plan: null },
  buehne: { label: 'Bühnenpräsenz', emoji: '🎤', desc: 'Auftreten mit Ausstrahlung', subscribed: false, plan: null },
  allgemein: { label: 'Allgemeiner Lehrgang', emoji: '🎼', desc: 'Grundlagen für alle — Harmonielehre, Taktarten & Bühnenpräsenz. Für jedes Mitglied freigeschaltet.', subscribed: true, plan: 'starter' },
}

const heroBgImages: Record<string, string> = {
  handorgel: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80',
  schwyzer: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=1200&q=80',
  allgemein: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&q=80',
}

const allgemeinCourseMeta: Record<string, { desc: string; img: string }> = {
  harmonielehre: { desc: 'Intervalle, Akkorde und Kadenzen — das harmonische Fundament der Ländlermusik.', img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80' },
  taktarten: { desc: 'Walzer, Polka, Mazurka & Co. — Taktarten sicher erkennen und spielen.', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80' },
  buehnenpraesenz: { desc: 'Sicher auftreten, Lampenfieber meistern und das Publikum begeistern.', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80' },
}
const defaultHeroBg = 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&q=80'

type StarterKurs = {
  id: string
  title: string
  desc: string
  modules: number
  completedModules: number
  duration: string
  level: string
  img: string
}

type ProKurs = {
  id: string
  title: string
  desc: string
  modules: number
  duration: string
  level: string
  img: string
}

const handorgelStarterKurse: StarterKurs[] = [
  { id: 'grundlagen', title: 'Grundlagenkurs', desc: 'Der Einstieg in die Welt der Handorgel — von null bis zu deinen ersten Liedern.', modules: 5, completedModules: 3, duration: '8h', level: 'Einsteiger', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80' },
  { id: 'uebungen', title: 'Übungskurse', desc: 'Strukturierte Übungen für Finger, Rhythmus und Klang.', modules: 4, completedModules: 0, duration: '6h', level: 'Einsteiger', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80' },
  { id: 'pflege', title: 'Hege & Pflege', desc: 'Pflege, Stimmung und Wartung deiner Handorgel.', modules: 3, completedModules: 0, duration: '3h', level: 'Einsteiger', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80' },
  { id: 'repertoire', title: 'Erstes Repertoire', desc: 'Deine ersten echten Ländlerstücke Schritt für Schritt erlernt.', modules: 6, completedModules: 0, duration: '10h', level: 'Einsteiger', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&q=80' },
]

const schwyzerStarterKurse: StarterKurs[] = [
  { id: 'grundlagen', title: 'Grundlagenkurs Schwyzerörgeli', desc: 'Der Einstieg in die diatonische Welt des Schwyzerörgeli.', modules: 5, completedModules: 1, duration: '7h', level: 'Einsteiger', img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&q=80' },
  { id: 'uebungen', title: 'Übungskurse', desc: 'Strukturierte Übungen für Grifftechnik und Balg.', modules: 4, completedModules: 0, duration: '5h', level: 'Einsteiger', img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=600&q=80' },
  { id: 'stimmung', title: 'Stimmung & Pflege', desc: 'Pflege und Wartung des Schwyzerörgeli.', modules: 3, completedModules: 0, duration: '2h', level: 'Einsteiger', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80' },
  { id: 'repertoire', title: 'Appenzeller Repertoire', desc: 'Klassische Appenzeller Stücke für Einsteiger.', modules: 5, completedModules: 0, duration: '9h', level: 'Einsteiger', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&q=80' },
]

const handorgelProKurse: ProKurs[] = [
  { id: 'harmonielehre', title: 'Harmonielehre', desc: 'Akkorde, Tonarten und Stimmführung für die Handorgel.', modules: 4, duration: '7h', level: 'Fortgeschritten', img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80' },
  { id: 'fortgeschritten', title: 'Fortgeschrittene Techniken', desc: 'Läufe, Verzierungen und Dynamik auf höchstem Niveau.', modules: 5, duration: '9h', level: 'Fortgeschritten', img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=600&q=80' },
  { id: 'ensemble', title: 'Ensemble-Spiel', desc: 'Zusammenspiel und Arrangement in der Formation.', modules: 3, duration: '5h', level: 'Fortgeschritten', img: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80' },
  { id: 'improvisation', title: 'Improvisation', desc: 'Frei spielen im Ländlerstil — Variationen erfinden.', modules: 4, duration: '6h', level: 'Profi', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80' },
]

const schwyzerProKurse: ProKurs[] = [
  { id: 'harmonielehre', title: 'Harmonielehre', desc: 'Tonarten, Akkorde und Stimmführung für das Schwyzerörgeli.', modules: 4, duration: '6h', level: 'Fortgeschritten', img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80' },
  { id: 'fortgeschritten', title: 'Fortgeschrittene Grifftechnik', desc: 'Verzierungen, schnelle Läufe und präziser Balgführung.', modules: 5, duration: '8h', level: 'Fortgeschritten', img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=600&q=80' },
  { id: 'ensemble', title: 'Ensemble-Spiel', desc: 'Zusammenspiel in Appenzeller Formation.', modules: 3, duration: '4h', level: 'Fortgeschritten', img: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80' },
  { id: 'improvisation', title: 'Improvisation & Zäuerli', desc: 'Freies Spiel und Zäuerli-Stilistik.', modules: 4, duration: '5h', level: 'Profi', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80' },
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

const thumbBgs = ['#C4973A22', '#1a1a1a15', '#2563eb15', '#C4973A11']

export default function InstrumentPage({ params }: { params: { id: string } }) {
  const [showAllVideos, setShowAllVideos] = useState(false)
  const isAllgemein = params.id === 'allgemein'
  const inst = instrumentsData[params.id] ?? instrumentsData['handorgel']

  // Allgemeiner Lehrgang: Kurse aus den geteilten Kursdaten ableiten.
  const allgemeinKurse: StarterKurs[] = ALLGEMEIN_COURSES.map((cid) => {
    const c = courses[cid]
    const completedModules = c.modules.filter((m) => m.lessons.length > 0 && m.lessons.every((l) => l.completed)).length
    const minutes = c.modules.flatMap((m) => m.lessons).reduce((s, l) => s + (parseInt(l.duration, 10) || 0), 0)
    return {
      id: c.id, title: c.title, desc: allgemeinCourseMeta[cid]?.desc ?? `Lehrgang mit ${c.teacher}`,
      modules: c.modules.length, completedModules,
      duration: minutes >= 60 ? `${Math.round(minutes / 60)}h` : `${minutes} min`,
      level: 'Für alle', img: allgemeinCourseMeta[cid]?.img ?? defaultHeroBg,
    }
  })

  const starterKurse = isAllgemein ? allgemeinKurse : params.id === 'schwyzer' ? schwyzerStarterKurse : handorgelStarterKurse
  const proKurse = params.id === 'schwyzer' ? schwyzerProKurse : handorgelProKurse
  const lernvideos = params.id === 'schwyzer' ? schwyzerLernvideos : handorgelLernvideos

  const completedStarterKurse = starterKurse.filter((k) => k.completedModules > 0).length
  const overallProgress = isAllgemein ? 38 : params.id === 'schwyzer' ? 18 : 42
  const visibleVideos = showAllVideos ? lernvideos : lernvideos.slice(0, 6)

  const heroBg = heroBgImages[params.id] ?? defaultHeroBg

  const getKursProgress = (kurs: StarterKurs): number => {
    if (kurs.modules === 0) return 0
    return Math.round((kurs.completedModules / kurs.modules) * 100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <div className="bg-dark text-white px-6 py-3 flex items-center gap-3">
        <Link href="/member/academy" className="font-sans text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Musikschule
        </Link>
        <span className="text-white/30">/</span>
        <span className="font-sans text-sm font-medium">{inst.label}</span>
      </div>

      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full overflow-hidden" style={{ minHeight: 280 }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={heroBg}
            alt={inst.label}
            fill
            className="object-cover opacity-[0.17]"
            unoptimized
          />
        </div>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/60 to-dark/90" />
        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4 py-14 flex flex-col gap-5">
          {/* Plan badge */}
          {inst.plan && (
            <div>
              <span className="font-sans text-xs bg-accent-gold text-white px-3 py-1 uppercase tracking-wide">
                {isAllgemein ? 'Für alle ✓' : inst.plan === 'starter' ? 'Starter ✓' : 'Pro ✓'}
              </span>
            </div>
          )}
          {/* Instrument name */}
          <h1 className="font-heading text-5xl font-bold text-white leading-tight">{inst.label}</h1>
          <p className="font-sans text-white/60 text-lg">{inst.desc}</p>
          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-xs uppercase tracking-widest text-white/40">Gesamtfortschritt</span>
              <span className="font-heading font-bold text-2xl text-accent-gold">{overallProgress}%</span>
            </div>
            <div className="w-px h-8 bg-white/15 hidden sm:block" />
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-xs uppercase tracking-widest text-white/40">Kurse gestartet</span>
              <span className="font-heading font-bold text-2xl text-white">{completedStarterKurse} <span className="text-white/40 font-sans font-normal text-base">/ {starterKurse.length}</span></span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">

        {/* ── Starter Kurs ── */}
        <section>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-sans text-xs bg-accent-gold text-white px-2 py-0.5 uppercase tracking-wide">{isAllgemein ? 'Für alle' : 'Starter'}</span>
            <h2 className="font-heading text-2xl font-bold">{isAllgemein ? 'Allgemeiner Lehrgang' : 'Dein Starter-Lehrgang'}</h2>
          </div>
          <p className="font-sans text-text-secondary mb-6">
            {isAllgemein
              ? 'Übergreifende Grundlagen für alle Mitglieder — unabhängig vom Instrument. Diese Kurse sind für jedes Abo freigeschaltet.'
              : `Strukturierter Einstieg in ${inst.plan === 'starter' ? `die ${inst.label}` : 'dein Instrument'} — von den Basics bis zu deinen ersten Stücken.`}
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
                  className="bg-surface border border-border overflow-hidden group hover:border-accent-gold transition-colors flex flex-col"
                >
                  {/* Image area with title overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
                    <Image src={kurs.img} alt={kurs.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    {/* Level badge top-left */}
                    <div className="absolute top-3 left-3">
                      <span className="font-sans text-[10px] uppercase tracking-widest bg-black/50 text-white/70 px-2 py-0.5">{kurs.level}</span>
                    </div>
                    {/* Progress bar along bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15">
                      <div className="h-full bg-accent-gold transition-none" style={{ width: `${progress}%` }} />
                    </div>
                    {/* Title + metadata on image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-heading font-bold text-white text-base leading-snug group-hover:text-accent-gold transition-colors">{kurs.title}</h3>
                      <p className="font-sans text-xs text-white/50 mt-0.5">{kurs.modules} Module · {kurs.duration}</p>
                    </div>
                  </div>
                  {/* Card body */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="font-sans text-sm text-text-secondary leading-relaxed flex-1">{kurs.desc}</p>
                    {progress > 0 && (
                      <p className="font-sans text-xs text-accent-gold mt-2">{kurs.completedModules} von {kurs.modules} Modulen</p>
                    )}
                    <div className="mt-3">
                      <Link href={`/member/academy/instrument/${params.id}/kurs/${kurs.id}`} className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-dark border border-dark px-4 py-2 hover:bg-dark hover:text-white transition-colors w-full justify-center">
                        {progress > 0 ? 'Weiterfahren' : 'Kurs öffnen'}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {!isAllgemein && (
        <>
        {/* ── Pro Kurs (locked) ── */}
        <section>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-sans text-xs bg-border text-text-secondary px-2 py-0.5 uppercase tracking-wide flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Pro
            </span>
            <h2 className="font-heading text-2xl font-bold text-text-secondary">Pro-Lehrgang</h2>
          </div>
          <p className="font-sans text-text-secondary mb-6">Volle Techniken, Harmonielehre, Improvisation und Ensemble-Spiel. Upgrade erforderlich.</p>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proKurse.map((kurs, i) => (
                <motion.div
                  key={kurs.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-surface border border-border overflow-hidden flex flex-col relative"
                >
                  {/* Image area */}
                  <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
                    <Image src={kurs.img} alt={kurs.title} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="font-sans text-[10px] uppercase tracking-widest bg-black/50 text-white/70 px-2 py-0.5">{kurs.level}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-heading font-bold text-white/70 text-base leading-snug">{kurs.title}</h3>
                      <p className="font-sans text-xs text-white/40 mt-0.5">{kurs.modules} Module · {kurs.duration}</p>
                    </div>
                  </div>
                  {/* Card body */}
                  <div className="p-4 flex flex-col flex-1 blur-[1px] select-none">
                    <p className="font-sans text-sm text-text-secondary leading-relaxed flex-1">{kurs.desc}</p>
                  </div>
                  {/* Lock overlay — covers whole card */}
                  <div className="absolute inset-0 bg-background/75 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 z-10">
                    <div className="w-10 h-10 bg-border flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </div>
                    <span className="font-sans text-xs text-text-secondary bg-border px-2 py-0.5">Pro erforderlich</span>
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
          <div className="flex items-center gap-3 mb-1">
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
                className="relative bg-surface border border-border overflow-hidden group flex"
              >
                {/* Thumbnail */}
                <div
                  className="relative w-20 flex-shrink-0 self-stretch flex items-center justify-center"
                  style={{ background: thumbBgs[i % 4] }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/40">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                {/* Content */}
                <div className="flex-1 p-3 min-w-0">
                  <h4 className="font-sans font-medium text-sm leading-tight truncate">{video.title}</h4>
                  <p className="font-sans text-xs text-text-secondary mt-0.5">{video.composer}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <DifficultyDots value={video.difficulty} />
                    <span className="font-sans text-xs text-text-secondary">{video.duration}</span>
                  </div>
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col items-center gap-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span className="font-sans text-[10px] text-text-secondary">Freischalten</span>
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
              <p className="font-sans text-xs text-text-secondary mt-0.5">200+ Stücke · Noten, Tabs &amp; Playalongs · täglich neue Inhalte</p>
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
        </>
        )}

      </div>
    </div>
  )
}
