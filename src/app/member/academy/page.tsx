'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MemberTabs } from '@/components/MemberTabs'
import { courses, ALLGEMEIN_COURSES, courseStats } from '@/lib/courses'

// Allgemeiner Lehrgang — für alle Mitglieder freigeschaltet.
const allgemeinCardMeta: Record<string, string> = {
  harmonielehre: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80',
  taktarten: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
  buehnenpraesenz: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
}

// ─── Data ───────────────────────────────────────────────────────────────────

const activeCourses = [
  {
    id: 'handorgel-grundlagen',
    instrumentId: 'handorgel',
    kursId: 'grundlagen',
    emoji: '🪗',
    instrument: 'Handorgel',
    title: 'Grundlagenkurs',
    instructor: 'Cécile Schmidig',
    instructorImg: '/images/cecile-schmidig.jpg',
    coverImg: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
    progress: 65,
    completedLessons: 13,
    totalLessons: 20,
    lastActivity: 'Heute',
    href: '/member/academy/instrument/handorgel/kurs/grundlagen',
  },
  {
    id: 'schwyzer-grundlagen',
    instrumentId: 'schwyzer',
    kursId: 'grundlagen',
    emoji: '🎶',
    instrument: 'Schwyzerörgeli',
    title: 'Grundlagenkurs Schwyzerörgeli',
    instructor: 'Cyrill Rusch',
    instructorImg: '/images/cyrill-rusch.jpg',
    coverImg: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80',
    progress: 30,
    completedLessons: 6,
    totalLessons: 20,
    lastActivity: 'Gestern',
    href: '/member/academy/instrument/schwyzer/kurs/grundlagen',
  },
  {
    id: 'handorgel-uebungen',
    instrumentId: 'handorgel',
    kursId: 'uebungen',
    emoji: '🪗',
    instrument: 'Handorgel',
    title: 'Übungskurse',
    instructor: 'Seebi Diener',
    instructorImg: '/images/seebi-diener.jpg',
    coverImg: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=800&q=80',
    progress: 10,
    completedLessons: 2,
    totalLessons: 18,
    lastActivity: 'vor 3 Tagen',
    href: '/member/academy/instrument/handorgel/kurs/uebungen',
  },
]

const recentLessons = [
  { id: 'rl1', title: 'Koordination beider Hände', course: 'Grundlagenkurs', instrument: 'Handorgel', duration: '15 min', href: '/member/academy/instrument/handorgel/kurs/grundlagen/modul/erste-schritte?lektion=koordination' },
  { id: 'rl2', title: 'Die Diskantseite', course: 'Grundlagenkurs', instrument: 'Handorgel', duration: '12 min', href: '/member/academy/instrument/handorgel/kurs/grundlagen/modul/erste-schritte?lektion=diskantseite' },
  { id: 'rl3', title: 'Stimmen & Intonation', course: 'Grundlagenkurs', instrument: 'Handorgel', duration: '8 min', href: '/member/academy/instrument/handorgel/kurs/grundlagen/modul/einfuehrung?lektion=saitenstimmen' },
  { id: 'rl4', title: 'Erste Melodieläufe', course: 'Grundlagenkurs Schwyzerörgeli', instrument: 'Schwyzerörgeli', duration: '10 min', href: '/member/academy/instrument/schwyzer/kurs/grundlagen/modul/einfuehrung?lektion=erste' },
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

function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 bg-border overflow-hidden ${className}`}>
      <motion.div className="h-full bg-accent-gold" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} />
    </div>
  )
}

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

// ─── Course card (Journey-Design) ─────────────────────────────────────────────

function CourseCard({ course }: { course: typeof activeCourses[0] }) {
  return (
    <Link href={course.href} className="block bg-surface border border-border overflow-hidden group hover:border-accent-gold transition-colors">
      <div className="relative h-36 overflow-hidden">
        <Image src={course.coverImg} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl">{course.emoji}</span>
            <span className="font-sans text-xs text-white/60 uppercase tracking-wider">{course.instrument}</span>
          </div>
          <h4 className="font-heading text-base font-bold text-white">{course.title}</h4>
        </div>
        <div className="absolute top-2.5 right-2.5 bg-accent-gold/90 text-white text-xs px-2 py-0.5 font-sans font-medium">{course.progress}%</div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
            <Image src={course.instructorImg} alt={course.instructor} fill className="object-cover" unoptimized />
          </div>
          <p className="font-sans text-xs text-text-secondary">mit {course.instructor}</p>
        </div>
        <div className="bg-accent-gold/5 border border-accent-gold/20 px-3 py-1.5 mb-3">
          <p className="font-sans text-xs text-accent-gold font-medium">Zuletzt aktiv: {course.lastActivity}</p>
        </div>
        <div className="flex justify-between text-xs font-sans mb-1.5">
          <span className="text-text-secondary">{course.completedLessons}/{course.totalLessons} Lektionen</span>
          <span className="font-medium">{course.progress}%</span>
        </div>
        <ProgressBar value={course.progress} />
        <div className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-dark group-hover:text-accent-gold transition-colors">
          Weiterfahren
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </div>
      </div>
    </Link>
  )
}

// ─── Persönlicher Support / Live-Chat (floating) ──────────────────────────────

function SupportWidget() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-surface border border-border shadow-2xl overflow-hidden"
          >
            <div className="bg-dark p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent-gold flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6" /><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" /></svg>
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-white">Persönlicher Support</p>
                  <p className="font-sans text-[10px] text-white/50 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-gold inline-block" /> Antwort meist in wenigen Minuten
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors text-xl leading-none">×</button>
            </div>
            <div className="p-4 bg-background">
              <div className="bg-surface border border-border px-3 py-2.5">
                <p className="font-sans text-[10px] uppercase tracking-wider text-accent-gold mb-0.5">LAEMU Team</p>
                <p className="font-sans text-sm text-text-primary">Hallo Niklaus! 👋 Wie können wir dir mit deinen Kursen helfen? Schreib uns — wir antworten persönlich.</p>
              </div>
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input placeholder="Nachricht schreiben…" className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark" />
              <button className="bg-accent-gold text-white px-3 py-2 font-sans text-sm font-medium hover:bg-accent-warm transition-colors">Senden</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-accent-gold text-white pl-4 pr-5 py-3.5 shadow-lg hover:bg-accent-warm transition-colors"
        aria-label="Persönlicher Support"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
        )}
        <span className="font-sans text-sm font-semibold">{open ? 'Schliessen' : 'Persönlicher Support'}</span>
      </button>
    </>
  )
}


// ─── Page ────────────────────────────────────────────────────────────────────

export default function MemberAcademyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isUpgraded, setIsUpgraded] = useState(false)
  const [courseFilter, setCourseFilter] = useState('Alle')

  // Instrumente, zu denen der/die Lernende Kurse hat — als Filter-Tabs.
  const courseInstruments = Array.from(new Set(activeCourses.map((c) => c.instrument)))
  const courseTabs = courseInstruments.length > 1 ? ['Alle', ...courseInstruments] : courseInstruments
  const filteredCourses = courseFilter === 'Alle' ? activeCourses : activeCourses.filter((c) => c.instrument === courseFilter)
  const filterInstrumentId = courseFilter === 'Alle' ? null : activeCourses.find((c) => c.instrument === courseFilter)?.instrumentId ?? null

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
          <div className="hidden sm:flex items-center gap-2 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-4 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            <span className="font-sans font-bold text-sm">7 Tage Streak!</span>
          </div>
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
                      <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-2">Willkommen zurück</p>
                      <h2 className="font-heading text-3xl font-bold text-white mb-2">Guten Tag, Niklaus</h2>
                      <p className="font-sans text-white/60">Du hast diese Woche bereits 5 Lektionen abgeschlossen. Weiter so!</p>
                    </div>
                    <div className="bg-accent-gold/20 border border-accent-gold/30 px-4 py-3 text-center">
                      <p className="font-heading font-bold text-accent-gold text-2xl">7</p>
                      <p className="font-sans text-xs text-white/50">Tage Streak</p>
                    </div>
                  </div>
                </motion.div>

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

                {/* Meine Kurse — Journey-Design, filterbar nach Instrument */}
                <section>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3 className="font-heading font-bold text-xl">Meine Kurse</h3>
                    {courseTabs.length > 1 && (
                      <div className="flex flex-wrap gap-2">
                        {courseTabs.map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setCourseFilter(tab)}
                            className={`font-sans text-xs px-3 py-1.5 border transition-colors ${courseFilter === tab ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filteredCourses.map((course, i) => (
                      <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <CourseCard course={course} />
                      </motion.div>
                    ))}
                  </div>
                  {filterInstrumentId && (
                    <Link href={`/member/academy/instrument/${filterInstrumentId}`} className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-accent-gold hover:text-dark transition-colors">
                      Ganzen {courseFilter}-Lehrgang ansehen
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </Link>
                  )}
                </section>

                {/* Allgemeine Grundlagen — für alle freigeschaltet */}
                <section>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-xl">Allgemeine Grundlagen</h3>
                    <span className="font-sans text-[10px] bg-accent-gold/15 text-accent-gold border border-accent-gold/30 px-2 py-0.5 uppercase tracking-wide">Für alle</span>
                  </div>
                  <p className="font-sans text-sm text-text-secondary mb-4">Instrumentenübergreifende Grundlagen — für jedes Mitglied freigeschaltet.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {ALLGEMEIN_COURSES.map((cid, i) => {
                      const c = courses[cid]
                      const pct = courseStats(c).percent
                      return (
                        <motion.div key={cid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                          <Link href={`/member/academy/instrument/allgemein/kurs/${cid}`} className="block bg-surface border border-border overflow-hidden group hover:border-accent-gold transition-colors h-full">
                            <div className="relative h-28 overflow-hidden">
                              <Image src={allgemeinCardMeta[cid]} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                                <span className="text-lg">{c.emoji}</span>
                                <h4 className="font-heading text-sm font-bold text-white leading-tight">{c.title}</h4>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="font-sans text-xs text-text-secondary mb-2">mit {c.teacher}</p>
                              <div className="flex justify-between text-xs font-sans mb-1.5">
                                <span className="text-text-secondary">Fortschritt</span>
                                <span className="font-medium">{pct}%</span>
                              </div>
                              <ProgressBar value={pct} />
                              <div className="mt-3 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-dark group-hover:text-accent-gold transition-colors">
                                {pct > 0 ? 'Weiterfahren' : 'Kurs öffnen'}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </section>

                {/* Recently viewed */}
                <section>
                  <h3 className="font-heading font-bold text-xl mb-4">Zuletzt angesehen</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recentLessons.map((lesson, i) => (
                      <motion.div key={lesson.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 + 0.1 }}>
                        <Link href={lesson.href} className="flex items-center gap-3 bg-surface border border-border p-4 hover:border-dark transition-colors group">
                          <div className="w-9 h-9 bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-gold"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" /></svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-sm font-medium group-hover:text-accent-gold transition-colors truncate">{lesson.title}</p>
                            <p className="font-sans text-xs text-text-secondary truncate">{lesson.instrument} · {lesson.course}</p>
                          </div>
                          <span className="font-sans text-xs text-text-secondary flex-shrink-0">{lesson.duration}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {!isUpgraded && (
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
