'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { courses, ALLGEMEIN_COURSES } from '@/lib/courses'
import { getInstrumentOverview, INSTRUMENT_OVERVIEWS, type StarterKurs } from '@/lib/instruments'
import { StarterCourseCard, ProCourseRow, ProUpgradeBanner } from '@/components/CourseCards'

// ─── Data ────────────────────────────────────────────────────────────────────

const instrumentsData: Record<string, { label: string; emoji: string; desc: string; subscribed: boolean; plan: 'starter' | 'pro' | null }> = {
  handorgel: { label: 'Handorgel', emoji: '🪗', desc: 'Das Herzstück der Ländlermusik', subscribed: true, plan: 'starter' },
  schwyzer: { label: 'Schwyzerörgeli', emoji: '🎵', desc: 'Diatonisch und voller Seele', subscribed: true, plan: 'starter' },
  begleit: { label: 'Begleitinstrument', emoji: '🎻', desc: 'Bass · Klarinette · Klavier', subscribed: false, plan: null },
  buehne: { label: 'Bühnenpräsenz', emoji: '🎤', desc: 'Auftreten mit Ausstrahlung', subscribed: false, plan: null },
  allgemein: { label: 'Allgemeine Grundlagen', emoji: '🎼', desc: 'Grundlagen für alle — Harmonielehre, Taktarten & Bühnenpräsenz. Für jedes Mitglied freigeschaltet.', subscribed: true, plan: 'starter' },
}

const allgemeinCourseDesc: Record<string, string> = {
  harmonielehre: 'Intervalle, Akkorde und Kadenzen — das harmonische Fundament der Ländlermusik.',
  taktarten: 'Walzer, Polka, Mazurka & Co. — Taktarten sicher erkennen und spielen.',
  buehnenpraesenz: 'Sicher auftreten, Lampenfieber meistern und das Publikum begeistern.',
}

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

const thumbBgs = ['#C4973A22', '#1a1a1a15', '#2563eb15', '#C4973A11']

// ─── Page component ───────────────────────────────────────────────────────────

export default function InstrumentPage({ params }: { params: { id: string } }) {
  const [showAllVideos, setShowAllVideos] = useState(false)
  const isAllgemein = params.id === 'allgemein'
  const inst = instrumentsData[params.id] ?? instrumentsData['handorgel']
  const overview = getInstrumentOverview(params.id) ?? INSTRUMENT_OVERVIEWS.handorgel
  const coverVariant = isAllgemein ? 'allgemein' : params.id

  // Allgemeiner Lehrgang: Kurse aus den geteilten Kursdaten ableiten.
  const allgemeinKurse: (StarterKurs & { emoji: string })[] = ALLGEMEIN_COURSES.map((cid) => {
    const c = courses[cid]
    const completedModules = c.modules.filter((m) => m.lessons.length > 0 && m.lessons.every((l) => l.completed)).length
    const minutes = c.modules.flatMap((m) => m.lessons).reduce((s, l) => s + (parseInt(l.duration, 10) || 0), 0)
    return {
      id: c.id, title: c.title, desc: allgemeinCourseDesc[cid] ?? `Lehrgang mit ${c.teacher}`,
      modules: c.modules.length, completedModules,
      duration: minutes >= 60 ? `${Math.round(minutes / 60)}h` : `${minutes} min`,
      level: 'Für alle', emoji: c.emoji,
    }
  })

  const starterKurse = overview.starterKurse
  const proKurse = overview.proKurse
  const lernvideos = params.id === 'schwyzer' ? schwyzerLernvideos : handorgelLernvideos

  const visibleStarter = isAllgemein ? allgemeinKurse : starterKurse
  const completedStarterKurse = visibleStarter.filter((k) => k.completedModules > 0).length
  const overallProgress = isAllgemein ? 38 : overview.overallProgress
  const visibleVideos = showAllVideos ? lernvideos : lernvideos.slice(0, 6)

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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full overflow-hidden bg-dark" style={{ minHeight: 280 }}>
        {/* Instrument-Emoji als dezentes Wasserzeichen */}
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[14rem] leading-none opacity-[0.06] select-none pointer-events-none">{inst.emoji}</span>
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/60 to-dark/90" />
        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4 py-14 flex flex-col gap-5">
          {inst.plan && (
            <div>
              <span className="font-sans text-xs bg-accent-gold text-white px-3 py-1 uppercase tracking-wide">
                {isAllgemein ? 'Für alle ✓' : inst.plan === 'starter' ? 'Starter ✓' : 'Pro ✓'}
              </span>
            </div>
          )}
          <h1 className="font-heading text-5xl font-bold text-white leading-tight">{inst.label}</h1>
          <p className="font-sans text-white/60 text-lg">{inst.desc}</p>
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-xs uppercase tracking-widest text-white/40">Gesamtfortschritt</span>
              <span className="font-heading font-bold text-2xl text-accent-gold">{overallProgress}%</span>
            </div>
            <div className="w-px h-8 bg-white/15 hidden sm:block" />
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-xs uppercase tracking-widest text-white/40">Kurse gestartet</span>
              <span className="font-heading font-bold text-2xl text-white">{completedStarterKurse} <span className="text-white/40 font-sans font-normal text-base">/ {visibleStarter.length}</span></span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">

        {/* ── Starter Kurs ── */}
        <section>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-sans text-xs bg-accent-gold text-white px-2 py-0.5 uppercase tracking-wide">{isAllgemein ? 'Für alle' : 'Starter'}</span>
            <h2 className="font-heading text-2xl font-bold">{isAllgemein ? 'Allgemeine Grundlagen' : 'Dein Starter-Lehrgang'}</h2>
          </div>
          <p className="font-sans text-text-secondary mb-6">
            {isAllgemein
              ? 'Übergreifende Grundlagen für alle Mitglieder — unabhängig vom Instrument. Diese Kurse sind für jedes Abo freigeschaltet.'
              : `Strukturierter Einstieg in die ${inst.label} — von den Basics bis zu deinen ersten Stücken.`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleStarter.map((kurs, i) => (
              <motion.div key={kurs.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <StarterCourseCard
                  href={`/member/academy/instrument/${params.id}/kurs/${kurs.id}`}
                  title={kurs.title}
                  level={kurs.level}
                  modules={kurs.modules}
                  duration={kurs.duration}
                  desc={kurs.desc}
                  completedModules={kurs.completedModules}
                  emoji={'emoji' in kurs ? (kurs as { emoji: string }).emoji : inst.emoji}
                  variant={coverVariant}
                />
              </motion.div>
            ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proKurse.map((kurs, i) => (
              <motion.div key={kurs.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <ProCourseRow title={kurs.title} level={kurs.level} modules={kurs.modules} duration={kurs.duration} />
              </motion.div>
            ))}
          </div>
          <ProUpgradeBanner />
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
                <div
                  className="relative w-20 flex-shrink-0 self-stretch flex items-center justify-center"
                  style={{ background: thumbBgs[i % 4] }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/40">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <div className="flex-1 p-3 min-w-0">
                  <h4 className="font-sans font-medium text-sm leading-tight truncate">{video.title}</h4>
                  <p className="font-sans text-xs text-text-secondary mt-0.5">{video.composer}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <DifficultyDots value={video.difficulty} />
                    <span className="font-sans text-xs text-text-secondary">{video.duration}</span>
                  </div>
                </div>
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
        </section>
        </>
        )}

      </div>
    </div>
  )
}
