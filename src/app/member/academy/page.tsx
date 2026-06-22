'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MemberTabs } from '@/components/MemberTabs'
import { courses, ALLGEMEIN_COURSES, FREE_TRIAL_LESSON_COUNT } from '@/lib/courses'
import { FREE_TRIAL_DB_COUNT } from '@/lib/academy'
import { useUserAbo } from '@/lib/userPlan'
import { INSTRUMENT_OVERVIEWS, SUBSCRIBED_INSTRUMENTS, type InstrumentId, type InstrumentOverview, type StarterKurs } from '@/lib/instruments'
import { StarterCourseCard, ProCourseRow, ProUpgradeBanner } from '@/components/CourseCards'

// Allgemeine Grundlagen-Kurse (für alle Abos) — aus den geteilten Kursdaten.
const allgemeinKurse: (StarterKurs & { emoji: string })[] = ALLGEMEIN_COURSES.map((cid) => {
  const c = courses[cid]
  const completedModules = c.modules.filter((m) => m.lessons.length > 0 && m.lessons.every((l) => l.completed)).length
  const minutes = c.modules.flatMap((m) => m.lessons).reduce((s, l) => s + (parseInt(l.duration, 10) || 0), 0)
  return {
    id: c.id, title: c.title, desc: `Lehrgang mit ${c.teacher}`,
    modules: c.modules.length, completedModules,
    duration: minutes >= 60 ? `${Math.round(minutes / 60)}h` : `${minutes} min`,
    level: 'Für alle', emoji: c.emoji,
  }
})

// Begonnene Kurse über alle abonnierten Instrumente (für «Weiterlernen»).
const startedCourses = SUBSCRIBED_INSTRUMENTS.flatMap((iid) => {
  const ov = INSTRUMENT_OVERVIEWS[iid]
  return ov.starterKurse
    .filter((k) => k.completedModules > 0)
    .map((k) => ({ ...k, instrumentId: ov.id, instrumentLabel: ov.label, emoji: ov.emoji }))
})

// Filter-Tabs der Startseite.
const KURS_FILTERS: { id: string; label: string; instrument?: InstrumentId }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'handorgel', label: 'Handorgel', instrument: 'handorgel' },
  { id: 'schwyzer', label: 'Schwyzerörgeli', instrument: 'schwyzer' },
  { id: 'allgemein', label: 'Allgemeine Grundlagen' },
]

type MockSearchResult = {
  id: string
  title: string
  subtitle: string
  category: 'Lektionen' | 'Module' | 'Lernvideos' | 'Kurse'
  href: string
}

const mockSearchResults: MockSearchResult[] = [
  { id: 'sr1', title: 'Einfache Polka — Schritt 1', subtitle: 'Grundlagenkurs · Handorgel', category: 'Lektionen', href: '/member/academy/instrument/handorgel/kurs/grundlagen/modul/erste-lieder?lektion=polka1' },
  { id: 'sr2', title: 'Erste Lieder', subtitle: 'Grundlagenkurs · Modul 4', category: 'Module', href: '/member/academy/instrument/handorgel/kurs/grundlagen/modul/erste-lieder' },
  { id: 'sr4', title: 'Erstes Repertoire', subtitle: 'Handorgel Starter · 6 Module', category: 'Kurse', href: '/member/academy/instrument/handorgel/kurs/repertoire' },
  // Lernvideos aus der Lernvideodatenbank — ebenfalls über die Suche auffindbar.
  { id: 'lv1', title: 'Dr Alperose', subtitle: 'Willi Valotti · Handorgel · Walzer', category: 'Lernvideos', href: '/member/academy/lernvideos/1' },
  { id: 'lv2', title: 'Ländler im Dreivierteltakt', subtitle: 'Kapelle Hess-Ruedi-Hegner · Schwyzerörgeli', category: 'Lernvideos', href: '/member/academy/lernvideos/2' },
  { id: 'lv3', title: 'Abendstern-Polka', subtitle: 'Bodästänix · Handorgel · Polka', category: 'Lernvideos', href: '/member/academy/lernvideos/3' },
  { id: 'lv4', title: 'Innerschwizer Schottisch', subtitle: 'Trio Rigi · Klarinette · Schottisch', category: 'Lernvideos', href: '/member/academy/lernvideos/4' },
  { id: 'lv5', title: 'Walzer am See', subtitle: 'Lisa Frei · Klavierbegleitung · Walzer', category: 'Lernvideos', href: '/member/academy/lernvideos/5' },
  { id: 'lv6', title: 'Bergbach-Mazurka', subtitle: 'Hess-Rusch-Hegner · Bassgeige · Mazurka', category: 'Lernvideos', href: '/member/academy/lernvideos/6' },
  { id: 'lv7', title: 'Stille Nacht', subtitle: 'Verschiedene Kapellen · Handorgel', category: 'Lernvideos', href: '/member/academy/lernvideos/7' },
]


// ─── Abo data ────────────────────────────────────────────────────────────────

const currentPlan = {
  name: 'Starterkurs',
  price: 'CHF 79',
  period: '/Monat',
  features: ['Unbegrenzte Lehrvideos', 'Community Zugang', 'Monatliche Live-Calls'],
}

const proPlan = {
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
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Lektionen: 'bg-accent-gold/10 text-accent-gold',
  Module: 'bg-dark/10 text-dark',
  Lernvideos: 'bg-blue-50 text-blue-700',
  Kurse: 'bg-green-50 text-green-700',
}

// ─── Upgrade modals ───────────────────────────────────────────────────────────

function UpgradeModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        className="relative bg-surface border border-border w-full max-w-lg shadow-2xl"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="bg-dark p-6 relative">
          <button onClick={onCancel} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-2xl leading-none">×</button>
          <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-1">Abo-Upgrade</p>
          <h3 className="font-heading text-2xl font-bold text-white">Wechsel zum Pro-Kurs</h3>
          <p className="font-sans text-sm text-white/60 mt-1">Bitte bestätige dein Upgrade</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 bg-background border border-border p-4">
            <div className="w-2 h-2 rounded-full bg-text-secondary mt-2 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs text-text-secondary uppercase tracking-wider mb-1">Aktuell</p>
                <span className="font-sans text-xs text-text-secondary line-through">{currentPlan.price}<span className="text-text-secondary/60">{currentPlan.period}</span></span>
              </div>
              <p className="font-heading font-bold">{currentPlan.name}</p>
            </div>
          </div>
          <div className="flex justify-center text-accent-gold text-xl">↓</div>
          <div className="flex items-start gap-3 bg-accent-gold/5 border border-accent-gold/40 p-4">
            <div className="w-2 h-2 rounded-full bg-accent-gold mt-2 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs text-accent-gold uppercase tracking-wider mb-1">Neu</p>
                <span className="font-heading font-bold text-accent-gold">{proPlan.price}<span className="font-sans text-sm font-normal text-text-secondary">{proPlan.period}</span></span>
              </div>
              <p className="font-heading font-bold">{proPlan.name}</p>
            </div>
          </div>
          <div className="space-y-2 pt-1">
            <p className="font-sans text-xs text-text-secondary uppercase tracking-wider">Neu für dich enthalten</p>
            {proPlan.features.slice(1).map((f, i) => (
              <div key={i} className="flex items-center gap-2 font-sans text-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <p className="font-sans text-xs text-text-secondary border-t border-border pt-4">
            Das Upgrade wird sofort aktiv. Du wirst ab dem nächsten Abrechnungsdatum mit CHF 149/Monat belastet. Jederzeit kündbar.
          </p>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-border py-3 font-sans text-sm font-medium hover:bg-background transition-colors">Abbrechen</button>
          <button onClick={onConfirm} className="flex-1 bg-accent-gold text-white py-3 font-sans text-sm font-medium hover:bg-accent-earth transition-colors">Jetzt upgraden</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function UpgradeSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative bg-surface border border-border w-full max-w-md shadow-2xl text-center p-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
        <div className="text-5xl mb-4">🎉</div>
        <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-2">Upgrade erfolgreich</p>
        <h3 className="font-heading text-2xl font-bold mb-3">Willkommen im Pro-Kurs!</h3>
        <p className="font-sans text-sm text-text-secondary mb-6">Dein Zugang wurde sofort aktiviert. Viel Spass beim Lernen auf dem nächsten Level.</p>
        <button onClick={onClose} className="w-full bg-accent-gold text-white py-3 font-sans text-sm font-medium hover:bg-accent-earth transition-colors">Los geht's</button>
      </motion.div>
    </motion.div>
  )
}

// ─── Persönlicher Support — Verweis auf das LAEMU WhatsApp (floating) ──────────

function SupportWidget() {
  return (
    <a
      href="https://wa.me/41774083057"
      target="_blank"
      rel="noopener noreferrer"
      title="Persönlicher Support via WhatsApp: +41 77 408 30 57"
      aria-label="Persönlicher Support via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-accent-gold text-white pl-4 pr-5 py-3.5 shadow-lg hover:bg-accent-warm transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
      <span className="font-sans text-sm font-semibold">Support via WhatsApp</span>
    </a>
  )
}


// ─── Page ────────────────────────────────────────────────────────────────────

export default function MemberAcademyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isUpgraded, setIsUpgraded] = useState(false)
  const [courseFilter, setCourseFilter] = useState('alle')

  // Zugänge je nach gewähltem Abo:
  // - Free: kein Lehrgang, nur Schnupper-Inhalte.
  // - Lernvideo: nur die Lernvideo-Datenbank; in der Musikschule wie Free.
  // - Starter/Pro: voller Musikschul-Zugang.
  const userAbo = useUserAbo()
  const isFreeTier = userAbo.plan === 'none'
  const isLernvideoOnly = userAbo.plan === 'lernvideo' && !isUpgraded
  const hasCourseAccess = userAbo.plan === 'starter' || userAbo.plan === 'pro' || isUpgraded
  const isProTier = userAbo.plan === 'pro' || isUpgraded

  const showSearchDropdown = searchFocused && searchQuery.length >= 2
  const filteredResults = searchQuery.length >= 2
    ? mockSearchResults.filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchQuery.toLowerCase().includes('polka') ? mockSearchResults : mockSearchResults.slice(0, 3)

  function handleUpgradeConfirm() {
    setShowUpgradeModal(false)
    setIsUpgraded(true)
    setShowSuccessModal(true)
  }

  function openUpgrade() { setShowUpgradeModal(true) }

  // Allgemeine Grundlagen — für alle Abos freigeschaltet.
  const renderAllgemein = () => (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-heading font-bold text-xl">Allgemeine Grundlagen</h3>
        <span className="font-sans text-[10px] bg-accent-gold/15 text-accent-gold border border-accent-gold/30 px-2 py-0.5 uppercase tracking-wide">Für alle</span>
      </div>
      <p className="font-sans text-sm text-text-secondary mb-4">Instrumentenübergreifende Grundlagen — für jedes Mitglied freigeschaltet.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allgemeinKurse.map((kurs, i) => (
          <motion.div key={kurs.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StarterCourseCard
              href={`/member/academy/instrument/allgemein/kurs/${kurs.id}`}
              title={kurs.title} level={kurs.level} modules={kurs.modules} duration={kurs.duration}
              desc={kurs.desc} completedModules={kurs.completedModules} emoji={kurs.emoji} variant="allgemein"
            />
          </motion.div>
        ))}
      </div>
    </section>
  )

  // Integrierter Instrument-Lehrgang (Starter + gesperrter Pro) auf der Startseite.
  const renderLehrgang = (ov: InstrumentOverview) => (
    <div className="space-y-10">
      <section>
        <div className="flex items-center gap-3 mb-1">
          <span className="font-sans text-xs bg-accent-gold text-white px-2 py-0.5 uppercase tracking-wide">Starter</span>
          <h3 className="font-heading text-xl font-bold">{ov.label} — dein Starter-Lehrgang</h3>
        </div>
        <p className="font-sans text-sm text-text-secondary mb-4">Strukturierter Einstieg in die {ov.label} — von den Basics bis zu deinen ersten Stücken.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ov.starterKurse.map((kurs, i) => (
            <motion.div key={kurs.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <StarterCourseCard
                href={`/member/academy/instrument/${ov.id}/kurs/${kurs.id}`}
                title={kurs.title} level={kurs.level} modules={kurs.modules} duration={kurs.duration}
                desc={kurs.desc} completedModules={kurs.completedModules} emoji={ov.emoji} variant={ov.id}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {!isProTier && (
        <section>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-sans text-xs bg-border text-text-secondary px-2 py-0.5 uppercase tracking-wide flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              Pro
            </span>
            <h3 className="font-heading text-xl font-bold text-text-secondary">Pro-Lehrgang</h3>
          </div>
          <p className="font-sans text-sm text-text-secondary mb-4">Volle Techniken, Harmonielehre, Improvisation und Ensemble-Spiel. Upgrade erforderlich.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ov.proKurse.map((kurs, i) => (
              <motion.div key={kurs.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <ProCourseRow title={kurs.title} level={kurs.level} modules={kurs.modules} duration={kurs.duration} />
              </motion.div>
            ))}
          </div>
          <ProUpgradeBanner onUpgrade={openUpgrade} />
        </section>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">

      <AnimatePresence>
        {showUpgradeModal && <UpgradeModal onConfirm={handleUpgradeConfirm} onCancel={() => setShowUpgradeModal(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showSuccessModal && <UpgradeSuccessModal onClose={() => setShowSuccessModal(false)} />}
      </AnimatePresence>

      {/* TOP BAR */}
      <div className="bg-dark text-white px-6 py-3 flex items-center justify-between">
        <h1 className="font-heading font-bold text-lg">LAEMU Musikschule</h1>
        <div className="flex items-center gap-4">
          {hasCourseAccess && (
            <div className="hidden sm:flex items-center gap-2 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-4 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              <span className="font-sans font-bold text-sm">7 Wochen Streak!</span>
            </div>
          )}
          {!hasCourseAccess && (
            <button
              onClick={openUpgrade}
              className="flex items-center gap-2 bg-accent-gold text-white border border-accent-gold px-4 py-2 font-sans font-semibold text-sm hover:bg-accent-earth transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              {isLernvideoOnly ? 'Auf Pro upgraden' : 'Jetzt upgraden'}
            </button>
          )}
        </div>
      </div>

      {/* AREA TABS */}
      <MemberTabs active="academy" />

      <div className="max-w-5xl mx-auto px-4 py-8">

          {/* MAIN CONTENT */}
          <div className="space-y-10">

            {/* ── MEINE KURSE ── */}
            {(
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-dark p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-2">Willkommen{hasCourseAccess ? ' zurück' : ''}</p>
                      <h2 className="font-heading text-3xl font-bold text-white mb-2">Guten Tag, Niklaus</h2>
                      <p className="font-sans text-white/60">
                        {hasCourseAccess
                          ? 'Du hast diese Woche bereits 5 Lektionen abgeschlossen. Weiter so!'
                          : isLernvideoOnly
                            ? 'Dein Lernvideo-Abo gibt dir die komplette Datenbank. Für die Lehrgänge der Musikschule kannst du jederzeit auf Pro upgraden.'
                            : 'Schön, dass du da bist! Entdecke die ganze Musikschule — für vollen Zugang einfach upgraden.'}
                      </p>
                    </div>
                    {hasCourseAccess && (
                      <div className="bg-accent-gold/20 border border-accent-gold/30 px-4 py-3 text-center">
                        <p className="font-heading font-bold text-accent-gold text-2xl">7</p>
                        <p className="font-sans text-xs text-white/50">Wochen Streak</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Zugangs-Hinweis je nach Abo */}
                <div className={`border px-4 py-3 flex items-start gap-3 ${isProTier ? 'bg-accent-gold/5 border-accent-gold/30' : 'bg-surface border-border'}`}>
                  {isProTier ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  )}
                  <p className="font-sans text-xs text-text-secondary leading-relaxed">
                    {isLernvideoOnly ? (
                      <>
                        <strong className="text-dark font-semibold">Lernvideo-Abo.</strong> Du hast Zugang zur kompletten Lernvideo-Datenbank. Die Lehrgänge der Musikschule sind nicht enthalten — hier siehst du dieselben Schnupper-Inhalte wie im Free-Account. Für vollen Musikschul-Zugang upgrade auf Pro.{' '}
                        <button onClick={openUpgrade} className="text-accent-gold font-medium hover:underline">Auf Pro upgraden →</button>
                      </>
                    ) : isFreeTier ? (
                      <>
                        <strong className="text-dark font-semibold">Free-Account.</strong> Du siehst die ganze Musikschule und kannst kostenlos reinschnuppern — die ersten {FREE_TRIAL_LESSON_COUNT} Lektionen jedes Kurses und {FREE_TRIAL_DB_COUNT} Videos der Lernvideo-Datenbank sind frei. Für vollen Zugang brauchst du einen kostenpflichtigen Plan.{' '}
                        <button onClick={openUpgrade} className="text-accent-gold font-medium hover:underline">Jetzt upgraden →</button>
                      </>
                    ) : isProTier ? (
                      <>
                        <strong className="text-dark font-semibold">Pro-Zugang.</strong> Alle Grund- und Erweiterungskurse sowie die komplette Lernvideo-Datenbank sind freigeschaltet.
                      </>
                    ) : (
                      <>
                        <strong className="text-dark font-semibold">Starter-Zugang.</strong> Grundkurse und Starter-Lernvideos sind freigeschaltet. Pro-Inhalte (Erweiterungskurse, gesperrte Stücke) erfordern ein Upgrade.{' '}
                        <button onClick={openUpgrade} className="text-accent-gold font-medium hover:underline">Auf Pro upgraden →</button>
                      </>
                    )}
                  </p>
                </div>

                {/* Search */}
                <div className="relative">
                  <div className={`flex items-center border transition-colors ${searchFocused ? 'border-accent-gold' : 'border-border'} bg-surface`}>
                    <svg className="ml-4 flex-shrink-0 text-text-secondary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                      placeholder="Suche nach Stücken, Komponisten, Techniken, Kursen..."
                      className="flex-1 px-4 py-3.5 font-sans text-sm bg-transparent focus:outline-none placeholder:text-text-secondary" />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="mr-4 text-text-secondary hover:text-dark transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    )}
                  </div>
                  <AnimatePresence>
                    {showSearchDropdown && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 z-50 bg-surface border border-border shadow-lg mt-1">
                        {filteredResults.length === 0 ? (
                          <p className="px-4 py-4 font-sans text-sm text-text-secondary">Keine Ergebnisse für &ldquo;{searchQuery}&rdquo;</p>
                        ) : (
                          (() => {
                            const grouped = filteredResults.reduce<Record<string, MockSearchResult[]>>((acc, r) => { if (!acc[r.category]) acc[r.category] = []; acc[r.category].push(r); return acc }, {})
                            return Object.entries(grouped).map(([cat, items]) => (
                              <div key={cat}>
                                <div className="px-4 py-2 bg-background border-b border-border"><span className="font-sans text-[10px] uppercase tracking-widest text-text-secondary">{cat}</span></div>
                                {items.map((item) => (
                                  <Link key={item.id} href={item.href} className="flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors border-b border-border last:border-0">
                                    <span className={`text-[10px] font-sans px-2 py-0.5 ${categoryColors[item.category] ?? 'bg-border text-text-secondary'}`}>{item.category}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-sans text-sm font-medium truncate">{item.title}</p>
                                      <p className="font-sans text-xs text-text-secondary truncate">{item.subtitle}</p>
                                    </div>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary flex-shrink-0"><polyline points="9 18 15 12 9 6" /></svg>
                                  </Link>
                                ))}
                              </div>
                            ))
                          })()
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Free & Lernvideo: kostenlos reinschnuppern (kein Musikschul-Zugang) */}
                {!hasCourseAccess && (
                  <section>
                    <div className="bg-surface border border-border p-8 sm:p-10 text-center">
                      <div className="w-14 h-14 bg-accent-gold/10 flex items-center justify-center mx-auto mb-5">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      </div>
                      <h3 className="font-heading font-bold text-xl mb-2">Kostenlos reinschnuppern</h3>
                      <p className="font-sans text-sm text-text-secondary leading-relaxed max-w-md mx-auto mb-6">
                        {isLernvideoOnly
                          ? `In der Musikschule kannst du die ersten ${FREE_TRIAL_LESSON_COUNT} Lektionen jedes Kurses ansehen. Deine Lernvideo-Datenbank ist vollständig freigeschaltet — für die kompletten Lehrgänge upgrade auf Pro.`
                          : `Mit dem Free-Account sind die ersten ${FREE_TRIAL_LESSON_COUNT} Lektionen jedes Kurses und ${FREE_TRIAL_DB_COUNT} Videos der Lernvideo-Datenbank frei. Probier es aus — für den vollen Zugang upgradest du jederzeit.`}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/member/academy/instrument/handorgel/kurs/grundlagen" className="bg-dark text-white font-sans text-sm font-semibold px-6 py-3 hover:bg-accent-gold transition-colors">
                          Schnupperkurs starten →
                        </Link>
                        <button onClick={openUpgrade} className="bg-accent-gold text-white font-sans text-sm font-semibold px-6 py-3 hover:bg-accent-earth transition-colors">
                          {isLernvideoOnly ? 'Auf Pro upgraden' : 'Plan upgraden'}
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* Kurse — mit Filter-Tabs; integriert die Instrument-Lehrgänge */}
                {hasCourseAccess && (
                <section>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <h3 className="font-heading font-bold text-xl">Meine Kurse</h3>
                    <div className="flex flex-wrap gap-2">
                      {KURS_FILTERS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setCourseFilter(f.id)}
                          className={`font-sans text-xs px-3 py-1.5 border transition-colors ${courseFilter === f.id ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Alle: Weiterlernen + Allgemeine Grundlagen */}
                  {courseFilter === 'alle' && (
                    <div className="space-y-10">
                      {startedCourses.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <h4 className="font-heading font-bold text-lg">Weiterlernen</h4>
                            <span className="font-sans text-xs text-text-secondary">— da bist du stehengeblieben</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {startedCourses.map((kurs, i) => (
                              <motion.div key={`${kurs.instrumentId}-${kurs.id}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                                <StarterCourseCard
                                  href={`/member/academy/instrument/${kurs.instrumentId}/kurs/${kurs.id}`}
                                  title={kurs.title} level={kurs.instrumentLabel} modules={kurs.modules} duration={kurs.duration}
                                  desc={kurs.desc} completedModules={kurs.completedModules} emoji={kurs.emoji} variant={kurs.instrumentId}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                      {renderAllgemein()}
                    </div>
                  )}

                  {/* Instrument-Lehrgänge */}
                  {courseFilter === 'handorgel' && renderLehrgang(INSTRUMENT_OVERVIEWS.handorgel)}
                  {courseFilter === 'schwyzer' && renderLehrgang(INSTRUMENT_OVERVIEWS.schwyzer)}

                  {/* Allgemeine Grundlagen */}
                  {courseFilter === 'allgemein' && renderAllgemein()}
                </section>
                )}

                {!isProTier && (
                  <section>
                    <h3 className="font-heading font-bold text-xl mb-4">Weitere Angebote</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-dark text-white p-6 flex flex-col gap-4">
                        <div>
                          <span className="font-sans text-[10px] uppercase tracking-widest text-accent-gold">Pro-Lehrgang</span>
                          <h4 className="font-heading font-bold text-lg mt-1 mb-2">Schalte den Pro-Kurs frei</h4>
                          <ul className="space-y-1.5">
                            {['Persönliches Feedback vom Lehrer', 'Monatliche Live-Calls', 'Volle Lernvideodatenbank', 'Fortgeschrittene Techniken & Improvisation'].map((item) => (
                              <li key={item} className="flex items-center gap-2 font-sans text-sm text-white/70">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-end justify-between mt-auto">
                          <div>
                            <span className="font-sans text-xs text-white/40">ab</span>
                            <p className="font-heading font-bold text-2xl text-accent-gold">CHF 149<span className="text-base font-sans font-normal text-white/50">/Mt.</span></p>
                          </div>
                          <button onClick={openUpgrade} className="bg-accent-gold text-white px-4 py-2 font-sans text-sm font-medium hover:bg-accent-earth transition-colors">
                            Auf Pro upgraden
                          </button>
                        </div>
                      </motion.div>
                      {!isLernvideoOnly && (
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="bg-surface border border-border p-6 flex flex-col gap-4">
                        <div>
                          <span className="font-sans text-[10px] uppercase tracking-widest text-accent-gold">Lernvideo-Datenbank</span>
                          <h4 className="font-heading font-bold text-lg mt-1 mb-2">Entdecke die Lernvideo-Datenbank</h4>
                          <ul className="space-y-1.5">
                            {['200+ Stücke für alle Instrumente', 'Noten, Tabs & Playalongs', 'Täglich neue Inhalte', 'Suchbar nach Schwierigkeit & Stil'].map((item) => (
                              <li key={item} className="flex items-center gap-2 font-sans text-sm text-text-secondary">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-end justify-between mt-auto">
                          <div>
                            <span className="font-sans text-xs text-text-secondary">inklusive im</span>
                            <p className="font-heading font-bold text-2xl">Pro-Kurs</p>
                          </div>
                          <button onClick={openUpgrade} className="bg-dark text-white px-4 py-2 font-sans text-sm font-medium hover:bg-accent-gold transition-colors">
                            Jetzt freischalten
                          </button>
                        </div>
                      </motion.div>
                      )}
                    </div>
                  </section>
                )}
              </>
            )}

          </div>
      </div>

      {/* Persönlicher Support / Live-Chat */}
      <SupportWidget />
    </div>
  )
}
