'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'

// ─── Data ───────────────────────────────────────────────────────────────────

const instrumentsData = [
  { id: 'handorgel', label: 'Handorgel', emoji: '🪗', desc: 'Das Herzstück der Ländlermusik', subscribed: true, plan: 'starter' as const },
  { id: 'schwyzer', label: 'Schwyzerörgeli', emoji: '🎶', desc: 'Diatonisch und voller Seele', subscribed: true, plan: 'starter' as const },
  { id: 'begleit', label: 'Begleitinstrument', emoji: '🎸', desc: 'Bass · Klarinette · Klavier', subscribed: false, plan: null },
  { id: 'buehne', label: 'Bühnenpräsenz', emoji: '🎤', desc: 'Auftreten mit Ausstrahlung', subscribed: false, plan: null },
]

const activeCourses = [
  {
    id: 'handorgel-grundlagen',
    instrumentId: 'handorgel',
    kursId: 'grundlagen',
    emoji: '🪗',
    instrument: 'Handorgel',
    title: 'Grundlagenkurs',
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
    progress: 10,
    completedLessons: 2,
    totalLessons: 18,
    lastActivity: 'vor 3 Tagen',
    href: '/member/academy/instrument/handorgel/kurs/uebungen',
  },
]

const recentLessons = [
  {
    id: 'rl1',
    title: 'Koordination beider Hände',
    course: 'Grundlagenkurs',
    instrument: 'Handorgel',
    duration: '15 min',
    href: '/member/academy/instrument/handorgel/kurs/grundlagen/modul/erste-schritte?lektion=koordination',
  },
  {
    id: 'rl2',
    title: 'Die Diskantseite',
    course: 'Grundlagenkurs',
    instrument: 'Handorgel',
    duration: '12 min',
    href: '/member/academy/instrument/handorgel/kurs/grundlagen/modul/erste-schritte?lektion=diskantseite',
  },
  {
    id: 'rl3',
    title: 'Stimmen & Intonation',
    course: 'Grundlagenkurs',
    instrument: 'Handorgel',
    duration: '8 min',
    href: '/member/academy/instrument/handorgel/kurs/grundlagen/modul/einfuehrung?lektion=saitenstimmen',
  },
  {
    id: 'rl4',
    title: 'Erste Melodieläufe',
    course: 'Grundlagenkurs Schwyzerörgeli',
    instrument: 'Schwyzerörgeli',
    duration: '10 min',
    href: '/member/academy/instrument/schwyzer/kurs/grundlagen/modul/einfuehrung?lektion=erste',
  },
]

const teachers = [
  { id: 'seebi', name: 'Seebi Diener', specialty: 'Bass / Schwyzerörgeli', img: '/images/seebi-diener.jpg', bio: 'Multitalent und Stilpräger der modernen Ländlermusik — unterrichtet Bass und Schwyzerörgeli.', courses: 3, students: 142, rating: 4.9, instruments: ['Bass', 'Schwyzerörgeli'], location: 'Bern', profileHref: '/member/profile' },
  { id: 'cyrill', name: 'Cyrill Rusch', specialty: 'Schwyzerörgeli', img: '/images/cyrill-rusch.jpg', bio: 'Preisgekrönter Örgelist mit tiefer Verwurzelung in der Tradition — seine Kurse sind ausserordentlich.', courses: 2, students: 98, rating: 4.9, instruments: ['Schwyzerörgeli'], location: 'Schwyz', profileHref: '/member/profile' },
  { id: 'cecile', name: 'Cécile Schmidig', specialty: 'Handorgel', img: '/images/cecile-schmidig.jpg', bio: 'Ausdrucksstarke Handorgelistin mit einer einzigartigen Kombination aus Technik und Musikalität.', courses: 2, students: 86, rating: 4.8, instruments: ['Handorgel'], location: 'Luzern', profileHref: '/member/profile' },
  { id: 'franz', name: 'Franz Hess', specialty: 'Klavier', img: '/images/franz-hess.jpg', bio: 'Harmonischer Anker vieler Schweizer Kapellen — Franz vermittelt das klavieristische Fundament der Ländlermusik.', courses: 2, students: 74, rating: 4.9, instruments: ['Klavier'], location: 'Zürich', profileHref: '/member/profile' },
]

const allAchievements = [
  { id: 1, icon: '🔥', label: '7-Tage Streak', desc: '7 Tage in Folge eine Lektion absolviert', earned: true, earnedDate: '10. Jan 2025', points: 50, category: 'Streak' },
  { id: 2, icon: '🎓', label: 'Erste Lektion', desc: 'Deine allererste Lektion abgeschlossen', earned: true, earnedDate: '5. Jan 2025', points: 10, category: 'Meilenstein' },
  { id: 3, icon: '⭐', label: '10 Lektionen', desc: '10 Lektionen insgesamt abgeschlossen', earned: true, earnedDate: '8. Jan 2025', points: 100, category: 'Meilenstein' },
  { id: 4, icon: '📚', label: '3 Kurse', desc: 'In 3 verschiedenen Kursen eingeschrieben', earned: true, earnedDate: '6. Jan 2025', points: 30, category: 'Engagement' },
  { id: 5, icon: '⚡', label: 'Schnellstarter', desc: '5 Lektionen in einer Woche abgeschlossen', earned: true, earnedDate: '9. Jan 2025', points: 75, category: 'Engagement' },
  { id: 6, icon: '🏆', label: 'Kurs abgeschlossen', desc: 'Einen Kurs vollständig abgeschlossen', earned: false, earnedDate: null, points: 200, category: 'Meilenstein' },
  { id: 7, icon: '🌟', label: '30-Tage Streak', desc: '30 Tage in Folge gelernt', earned: false, earnedDate: null, points: 300, category: 'Streak' },
  { id: 8, icon: '🎵', label: 'Meisterklasse', desc: 'Eine Meisterklasse-Lektion freigeschaltet', earned: false, earnedDate: null, points: 150, category: 'Engagement' },
  { id: 9, icon: '🏅', label: 'Top Schüler', desc: 'Unter den 10% aktivsten Lernenden', earned: false, earnedDate: null, points: 250, category: 'Rang' },
  { id: 10, icon: '🎯', label: 'Zielorientiert', desc: 'Wöchentliches Lernziel 4x erreicht', earned: false, earnedDate: null, points: 120, category: 'Engagement' },
]

const weeklyActivity = [
  { day: 'Mo', minutes: 35 },
  { day: 'Di', minutes: 0 },
  { day: 'Mi', minutes: 52 },
  { day: 'Do', minutes: 45 },
  { day: 'Fr', minutes: 20 },
  { day: 'Sa', minutes: 60 },
  { day: 'So', minutes: 38 },
]

const courseChats = [
  { id: 'ho', name: 'Handorgel-Lehrgang', icon: '🪗', members: 48, last: 'Hansruedi: Übungsaufgabe bis Freitag!', time: '10:30', unread: 3 },
  { id: 'oe', name: 'Schwyzerörgeli-Lehrgang', icon: '🎶', members: 34, last: 'Maria: Sehr gut gemacht alle!', time: 'Gestern', unread: 0 },
  { id: 'kl', name: 'Klavier-Lehrgang', icon: '🎹', members: 29, last: 'Lisa: Nächster Live-Call am Dienstag', time: 'Mo', unread: 1 },
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
  { id: 'sr3', title: 'Heimetli-Polka', subtitle: 'H. Wenger · Schwierigkeit 2', category: 'Lernvideos', href: '/member/academy/lernvideos/1' },
  { id: 'sr4', title: 'Erstes Repertoire', subtitle: 'Handorgel Starter · 6 Module', category: 'Kurse', href: '/member/academy/instrument/handorgel/kurs/repertoire' },
]

const navItems = [
  { label: 'Meine Kurse', id: 'kurse' },
  { label: 'Lernvideo-Datenbank', id: 'lernvideos', href: '/member/academy/lernvideos' },
  { label: 'Kurs-Chats', id: 'chats', badge: 4 },
  { label: 'Lehrpersonen', id: 'lehrer' },
  { label: 'Fortschritt', id: 'fortschritt' },
  { label: 'Achievements', id: 'achievements' },
]

// ─── Mock user access ────────────────────────────────────────────────────────
// Simulates which areas the logged-in user has access to.
// In production this would come from session/auth context.
const mockUserAccess = { community: true, academy: true }


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

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= Math.floor(value) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="text-accent-gold">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="font-sans text-xs text-text-secondary ml-1">{value}</span>
    </div>
  )
}

const categoryColors: Record<string, string> = {
  Lektionen: 'bg-accent-gold/10 text-accent-gold',
  Module: 'bg-dark/10 text-dark',
  Lernvideos: 'bg-blue-50 text-blue-700',
  Kurse: 'bg-green-50 text-green-700',
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MemberAcademyPage() {
  const [activeNav, setActiveNav] = useState('kurse')
  const [activeChatId, setActiveChatId] = useState<string | null>('ho')
  const [chatMsg, setChatMsg] = useState('')
  const [achievementFilter, setAchievementFilter] = useState('Alle')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const earnedCount = allAchievements.filter((a) => a.earned).length
  const totalPoints = allAchievements.filter((a) => a.earned).reduce((s, a) => s + a.points, 0)
  const maxBarMinutes = Math.max(...weeklyActivity.map((d) => d.minutes))
  const achievementCategories = ['Alle', ...Array.from(new Set(allAchievements.map((a) => a.category)))]
  const filteredAchievements = achievementFilter === 'Alle' ? allAchievements : allAchievements.filter((a) => a.category === achievementFilter)

  const showSearchDropdown = searchFocused && searchQuery.length >= 2
  const filteredResults = searchQuery.length >= 2
    ? mockSearchResults.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : searchQuery.toLowerCase().includes('polka')
    ? mockSearchResults
    : mockSearchResults.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* TOP BAR */}
      <div className="bg-dark text-white px-6 py-3 flex items-center justify-between mt-20">
        <div className="flex items-center gap-6">
          <h1 className="font-heading font-bold text-lg">LAEMU Musikschule</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-4 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="font-sans font-bold text-sm">7 Tage Streak!</span>
          </div>
          <button className="p-2 hover:bg-white/10 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── AREA TABS ── */}
      <div className="bg-surface border-b border-border" style={{ borderTop: '2px solid rgba(196,151,58,0.25)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center">

            {/* Exclusive area badge */}
            <div className="flex items-center gap-1.5 pr-5 border-r border-border flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-accent-gold flex-shrink-0">
                <path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z"/>
              </svg>
              <span className="font-sans text-xs font-semibold text-accent-gold whitespace-nowrap">Mitgliederbereich</span>
            </div>

            {/* Community tab */}
            <Link
              href="/member/community"
              className="flex items-center gap-2 px-5 py-4 font-sans text-sm font-medium border-b-2 border-transparent text-text-secondary hover:text-dark transition-colors"
            >
              <span>💬</span> Community
            </Link>

            {/* Akademie tab */}
            <button
              className={`flex items-center gap-2 px-5 py-4 font-sans text-sm font-medium border-b-2 transition-colors ${
                !mockUserAccess.academy
                  ? 'border-transparent text-text-secondary/40 cursor-not-allowed'
                  : 'border-accent-gold text-dark'
              }`}
            >
              <span>🎓</span> Akademie
              {!mockUserAccess.academy && (
                <span className="ml-1 text-[10px] border border-border px-1.5 py-0.5 text-text-secondary/60 font-normal">
                  🔒 Abo erforderlich
                </span>
              )}
            </button>

            {/* Right: membership info + public area link */}
            <div className="ml-auto flex items-center gap-4 py-4 flex-shrink-0">
              {mockUserAccess.academy && (
                <span className="font-sans text-xs text-text-secondary hidden sm:block">
                  Starter · 2 Instrumente
                </span>
              )}
              <div className="h-4 w-px bg-border" />
              <Link
                href="/musikschule"
                className="flex items-center gap-1.5 font-sans text-xs text-text-secondary hover:text-dark transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Öffentliche Seite
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── ACADEMY AREA ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-36 space-y-6">
              {/* Profile */}
              <div className="bg-surface border border-border p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Profile" fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">Niklaus Hess</p>
                    <p className="font-sans text-xs text-accent-gold">Starter Mitglied</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-sans mb-1">
                    <span className="text-text-secondary">Gesamtfortschritt</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <ProgressBar value={42} />
                  <p className="font-sans text-xs text-text-secondary">21 von 50 Lektionen</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-surface border border-border overflow-hidden">
                {navItems.map((item) =>
                  item.href ? (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="w-full flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 text-left text-text-secondary hover:bg-background hover:text-dark"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 text-left ${
                        activeNav === item.id ? 'bg-dark text-white font-medium' : 'text-text-secondary hover:bg-background hover:text-dark'
                      }`}
                    >
                      {item.label}
                      {item.badge != null && (
                        <span className="ml-auto bg-accent-gold text-white text-[10px] px-1.5 py-0.5">{item.badge}</span>
                      )}
                    </button>
                  ),
                )}
              </nav>

              {/* Quick stats */}
              <div className="bg-surface border border-border p-5">
                <h3 className="font-heading font-bold text-sm mb-4">Diese Woche</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Lektionen', value: '5' },
                    { label: 'Lernzeit', value: '3h 50min' },
                    { label: 'Streak', value: '7 Tage', gold: true },
                    { label: 'Punkte', value: `${totalPoints} XP` },
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between font-sans text-sm">
                      <span className="text-text-secondary">{stat.label}</span>
                      <span className={`font-medium ${stat.gold ? 'text-accent-gold' : ''}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── MEINE KURSE ── */}
            {activeNav === 'kurse' && (
              <>
                {/* Welcome banner */}
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

                {/* ── Quick Access ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Schnellzugriff</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Link href="/member/academy/lernvideos?playlist=open" className="bg-surface border border-border p-4 hover:border-dark transition-colors group flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary group-hover:text-accent-gold transition-colors"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>
                        <span className="font-sans text-xs font-semibold text-accent-gold">5</span>
                      </div>
                      <p className="font-sans text-xs font-medium">Meine Playlist</p>
                      <p className="font-sans text-[10px] text-text-secondary leading-snug">Im Auto oder unterwegs abspielen</p>
                    </Link>
                    <Link href="/member/academy/lernvideos?saved=1" className="bg-surface border border-border p-4 hover:border-dark transition-colors group flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary group-hover:text-accent-gold transition-colors"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                        <span className="font-sans text-xs font-semibold text-accent-gold">3</span>
                      </div>
                      <p className="font-sans text-xs font-medium">Gespeicherte Videos</p>
                      <p className="font-sans text-[10px] text-text-secondary leading-snug">Gemerkte Lernvideos auf einen Blick</p>
                    </Link>
                    <Link href="/member/academy/lernvideos" className="bg-surface border border-border p-4 hover:border-dark transition-colors group flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary group-hover:text-dark transition-colors"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                        <span className="font-sans text-xs text-text-secondary">→</span>
                      </div>
                      <p className="font-sans text-xs font-medium">Lernvideo-Datenbank</p>
                      <p className="font-sans text-[10px] text-text-secondary leading-snug">Alle Stücke durchsuchen & filtern</p>
                    </Link>
                    <Link href="/member/academy/lernvideos/upload" className="bg-surface border border-border p-4 hover:border-dark transition-colors group flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary group-hover:text-dark transition-colors"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        <span className="font-sans text-xs text-text-secondary">→</span>
                      </div>
                      <p className="font-sans text-xs font-medium">Stück hochladen</p>
                      <p className="font-sans text-[10px] text-text-secondary leading-snug">Neues Lernvideo erfassen</p>
                    </Link>
                  </div>
                </motion.div>

                {/* ── Search bar ── */}
                <div className="relative">
                  <div className={`flex items-center border transition-colors ${searchFocused ? 'border-accent-gold' : 'border-border'} bg-surface`}>
                    <svg className="ml-4 flex-shrink-0 text-text-secondary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                      placeholder="Suche nach Stücken, Komponisten, Techniken, Kursen..."
                      className="flex-1 px-4 py-3.5 font-sans text-sm bg-transparent focus:outline-none placeholder:text-text-secondary"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="mr-4 text-text-secondary hover:text-dark transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {showSearchDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 z-50 bg-surface border border-border shadow-lg mt-1"
                      >
                        {filteredResults.length === 0 ? (
                          <p className="px-4 py-4 font-sans text-sm text-text-secondary">Keine Ergebnisse für &ldquo;{searchQuery}&rdquo;</p>
                        ) : (
                          (() => {
                            const grouped = filteredResults.reduce<Record<string, MockSearchResult[]>>((acc, r) => {
                              if (!acc[r.category]) acc[r.category] = []
                              acc[r.category].push(r)
                              return acc
                            }, {})
                            return Object.entries(grouped).map(([cat, items]) => (
                              <div key={cat}>
                                <div className="px-4 py-2 bg-background border-b border-border">
                                  <span className="font-sans text-[10px] uppercase tracking-widest text-text-secondary">{cat}</span>
                                </div>
                                {items.map((item) => (
                                  <Link
                                    key={item.id}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors border-b border-border last:border-0"
                                  >
                                    <span className={`text-[10px] font-sans px-2 py-0.5 ${categoryColors[item.category] ?? 'bg-border text-text-secondary'}`}>
                                      {item.category}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-sans text-sm font-medium truncate">{item.title}</p>
                                      <p className="font-sans text-xs text-text-secondary truncate">{item.subtitle}</p>
                                    </div>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary flex-shrink-0">
                                      <polyline points="9 18 15 12 9 6" />
                                    </svg>
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

                {/* ── Meine aktiven Kurse ── */}
                <section>
                  <h3 className="font-heading font-bold text-xl mb-4">Meine aktiven Kurse</h3>
                  <div className="space-y-4">
                    {activeCourses.map((course, i) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-surface border border-border p-5 flex flex-col md:flex-row md:items-center gap-5 group hover:border-dark transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="text-3xl flex-shrink-0">{course.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-xs text-accent-gold uppercase tracking-wide mb-0.5">{course.instrument}</p>
                            <h4 className="font-heading font-bold text-base mb-1">{course.title}</h4>
                            <div className="flex justify-between text-xs font-sans mb-1.5">
                              <span className="text-text-secondary">{course.completedLessons} von {course.totalLessons} Lektionen abgeschlossen</span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <ProgressBar value={course.progress} />
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
                          <p className="font-sans text-xs text-text-secondary">Zuletzt: {course.lastActivity}</p>
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/member/academy/instrument/${course.instrumentId}`}
                              className="font-sans text-sm text-text-secondary hover:text-dark transition-colors hover:underline underline-offset-2"
                            >
                              Zur Übersicht
                            </Link>
                            <Link
                              href={course.href}
                              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-dark border border-dark px-4 py-2 hover:bg-dark hover:text-white transition-colors"
                            >
                              Weiterfahren
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* ── Zuletzt angesehen ── */}
                <section>
                  <h3 className="font-heading font-bold text-xl mb-4">Zuletzt angesehen</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recentLessons.map((lesson, i) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 + 0.1 }}
                      >
                        <Link
                          href={lesson.href}
                          className="flex items-center gap-3 bg-surface border border-border p-4 hover:border-dark transition-colors group"
                        >
                          <div className="w-9 h-9 bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-gold">
                              <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                            </svg>
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

                {/* ── Deine Instrumente ── */}
                <section>
                  <h3 className="font-heading font-bold text-xl mb-4">Deine Instrumente</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {instrumentsData.map((inst, i) => (
                      <motion.div
                        key={inst.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        {inst.subscribed ? (
                          <Link
                            href={`/member/academy/instrument/${inst.id}`}
                            className="flex items-center gap-4 bg-surface border border-border p-5 hover:border-accent-gold transition-colors group"
                          >
                            <div className="text-3xl">{inst.emoji}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-heading font-bold text-base group-hover:text-accent-gold transition-colors">{inst.label}</h4>
                                <span className="font-sans text-[10px] bg-accent-gold text-white px-1.5 py-0.5 uppercase tracking-wide">Starter ✓</span>
                              </div>
                              <p className="font-sans text-xs text-text-secondary mb-2">{inst.desc}</p>
                              {/* Progress ring placeholder */}
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-border overflow-hidden">
                                  <div className="h-full bg-accent-gold" style={{ width: inst.id === 'handorgel' ? '42%' : '18%' }} />
                                </div>
                                <span className="font-sans text-xs text-text-secondary">{inst.id === 'handorgel' ? '42%' : '18%'}</span>
                              </div>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary group-hover:text-accent-gold transition-colors flex-shrink-0">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-4 bg-surface border border-border p-5 opacity-70">
                            <div className="text-3xl">{inst.emoji}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-heading font-bold text-base text-text-secondary">{inst.label}</h4>
                                <span className="font-sans text-[10px] bg-border text-text-secondary px-1.5 py-0.5 uppercase tracking-wide flex items-center gap-1">
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                  </svg>
                                  Gesperrt
                                </span>
                              </div>
                              <p className="font-sans text-xs text-text-secondary">{inst.desc}</p>
                            </div>
                            <button className="font-sans text-xs border border-accent-gold text-accent-gold px-3 py-1.5 hover:bg-accent-gold hover:text-white transition-colors flex-shrink-0">
                              Abo erweitern
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* ── Weitere Angebote ── */}
                <section>
                  <h3 className="font-heading font-bold text-xl mb-4">Weitere Angebote</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pro Upgrade */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-dark text-white p-6 flex flex-col gap-4"
                    >
                      <div>
                        <span className="font-sans text-[10px] uppercase tracking-widest text-accent-gold">Pro-Lehrgang</span>
                        <h4 className="font-heading font-bold text-lg mt-1 mb-2">Schalte den Pro-Kurs frei</h4>
                        <ul className="space-y-1.5">
                          {['Persönliches Feedback vom Lehrer', 'Monatliche Live-Calls', 'Volle Lernvideodatenbank', 'Fortgeschrittene Techniken & Improvisation'].map((item) => (
                            <li key={item} className="flex items-center gap-2 font-sans text-sm text-white/70">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-end justify-between mt-auto">
                        <div>
                          <span className="font-sans text-xs text-white/40">ab</span>
                          <p className="font-heading font-bold text-2xl text-accent-gold">CHF 119<span className="text-base font-sans font-normal text-white/50">/Mt.</span></p>
                        </div>
                        <Button variant="primary" size="sm" href="/member/upgrade">Auf Pro upgraden</Button>
                      </div>
                    </motion.div>

                    {/* Lernvideodatenbank */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18 }}
                      className="bg-surface border border-border p-6 flex flex-col gap-4"
                    >
                      <div>
                        <span className="font-sans text-[10px] uppercase tracking-widest text-accent-gold">Lernvideo-Datenbank</span>
                        <h4 className="font-heading font-bold text-lg mt-1 mb-2">Entdecke die Lernvideo-Datenbank</h4>
                        <ul className="space-y-1.5">
                          {['200+ Stücke für alle Instrumente', 'Noten, Tabs & Playalongs', 'Täglich neue Inhalte', 'Suchbar nach Schwierigkeit & Stil'].map((item) => (
                            <li key={item} className="flex items-center gap-2 font-sans text-sm text-text-secondary">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-end justify-between mt-auto">
                        <div>
                          <span className="font-sans text-xs text-text-secondary">ab</span>
                          <p className="font-heading font-bold text-2xl">CHF 99<span className="text-base font-sans font-normal text-text-secondary">/Mt.</span></p>
                        </div>
                        <Button variant="dark" size="sm" href="/member/upgrade">Jetzt freischalten</Button>
                      </div>
                    </motion.div>
                  </div>
                </section>
              </>
            )}

            {/* ── CHATS ── */}
            {activeNav === 'chats' && (
              <div className="bg-surface border border-border overflow-hidden" style={{ minHeight: '500px' }}>
                <div className="flex h-full" style={{ minHeight: '500px' }}>
                  <div className="w-64 border-r border-border flex-shrink-0">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-heading font-bold text-sm">Kurs-Chats</h3>
                      <p className="font-sans text-xs text-text-secondary mt-1">Nur für eingeschriebene Kursteilnehmer</p>
                    </div>
                    {courseChats.map((c) => (
                      <button key={c.id} onClick={() => setActiveChatId(c.id)} className={`w-full flex items-center gap-3 p-4 border-b border-border text-left transition-colors ${activeChatId === c.id ? 'bg-dark text-white' : 'hover:bg-background'}`}>
                        <span className="text-lg">{c.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-sans text-xs font-semibold truncate ${activeChatId === c.id ? 'text-white' : ''}`}>{c.name}</p>
                          <p className={`font-sans text-[10px] truncate ${activeChatId === c.id ? 'text-white/50' : 'text-text-secondary'}`}>{c.last}</p>
                        </div>
                        {c.unread > 0 && <span className="bg-accent-gold text-white text-[10px] px-1.5 py-0.5 flex-shrink-0">{c.unread}</span>}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 flex flex-col">
                    {activeChatId ? (() => {
                      const chat = courseChats.find((c) => c.id === activeChatId)!
                      return (
                        <>
                          <div className="p-4 border-b border-border flex items-center gap-3">
                            <div>
                              <p className="font-sans font-semibold text-sm">{chat.name}</p>
                              <p className="font-sans text-xs text-text-secondary">{chat.members} Mitglieder</p>
                            </div>
                          </div>
                          <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ minHeight: '280px' }}>
                            <div className="flex justify-start"><div className="bg-background border border-border px-3 py-2 max-w-xs"><p className="font-sans text-xs font-semibold text-accent-gold mb-0.5">Hansruedi Wenger (Lehrer)</p><p className="font-sans text-sm">Willkommen im Kurs-Chat! Hier können wir Fragen besprechen.</p></div></div>
                            <div className="flex justify-start"><div className="bg-background border border-border px-3 py-2 max-w-xs"><p className="font-sans text-xs font-semibold mb-0.5">Maria Kälin</p><p className="font-sans text-sm">Super, ich freue mich auf den Austausch!</p></div></div>
                            <div className="flex justify-end"><div className="bg-dark text-white px-3 py-2 max-w-xs"><p className="font-sans text-sm">Ich auch! Frage zur Lektion 3…</p></div></div>
                          </div>
                          <div className="p-4 border-t border-border flex gap-2">
                            <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} placeholder="Nachricht schreiben..." className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark" />
                            <button className="bg-dark text-white px-4 py-2 font-sans text-sm hover:bg-accent-gold transition-colors">Senden</button>
                          </div>
                        </>
                      )
                    })() : (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="font-sans text-text-secondary text-sm">Wähle einen Kurs-Chat</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── LEHRPERSONEN ── */}
            {activeNav === 'lehrer' && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-heading text-2xl font-bold mb-2">Lehrpersonen</h2>
                  <p className="font-sans text-text-secondary text-sm">Die Besten der Szene — erfahrene Musikerinnen und Musiker, die ihr Wissen weitergeben.</p>
                </motion.div>
                <div className="space-y-6">
                  {teachers.map((teacher, i) => (
                    <motion.div key={teacher.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-surface border border-border overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="relative aspect-square md:aspect-auto overflow-hidden">
                          <Image src={teacher.img} alt={teacher.name} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" unoptimized />
                        </div>
                        <div className="md:col-span-3 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h3 className="font-heading text-xl font-bold">{teacher.name}</h3>
                                <p className="font-sans text-sm text-accent-gold">{teacher.specialty}</p>
                              </div>
                              <StarRating value={teacher.rating} />
                            </div>
                            <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4 mt-2">{teacher.bio}</p>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {teacher.instruments.map((inst) => (
                                <span key={inst} className="font-sans text-xs px-2 py-1 bg-background border border-border text-text-secondary">{inst}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex gap-6 text-sm font-sans">
                              <div><span className="font-heading font-bold text-lg">{teacher.courses}</span><span className="text-text-secondary ml-1">Kurse</span></div>
                              <div><span className="font-heading font-bold text-lg">{teacher.students}</span><span className="text-text-secondary ml-1">Schüler</span></div>
                              <div className="flex items-center gap-1 text-text-secondary">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                <span>{teacher.location}</span>
                              </div>
                            </div>
                            <Link href={teacher.profileHref} className="font-sans text-sm text-dark font-medium border border-dark px-4 py-2 hover:bg-dark hover:text-white transition-colors">
                              Profil ansehen
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* ── FORTSCHRITT ── */}
            {activeNav === 'fortschritt' && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-heading text-2xl font-bold mb-2">Mein Fortschritt</h2>
                  <p className="font-sans text-text-secondary text-sm">Übersicht deiner Lernaktivität und deines Wachstums.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                  {[
                    { label: 'Lektionen', value: '21', sub: 'abgeschlossen' },
                    { label: 'Lernzeit', value: '18h', sub: 'insgesamt' },
                    { label: 'Streak', value: '7', sub: 'Tage in Folge' },
                    { label: 'XP-Punkte', value: String(totalPoints), sub: 'verdient' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-surface p-6 text-center">
                      <p className="font-heading text-3xl font-bold text-accent-gold">{stat.value}</p>
                      <p className="font-sans text-sm font-medium mt-1">{stat.label}</p>
                      <p className="font-sans text-xs text-text-secondary">{stat.sub}</p>
                    </div>
                  ))}
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface border border-border p-6">
                  <h3 className="font-heading font-bold text-lg mb-6">Aktivität diese Woche</h3>
                  <div className="flex items-end gap-3 h-36">
                    {weeklyActivity.map((day, i) => (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                        <span className="font-sans text-xs text-text-secondary">{day.minutes > 0 ? `${day.minutes}m` : ''}</span>
                        <motion.div
                          className={`w-full ${day.minutes > 0 ? 'bg-accent-gold' : 'bg-border'}`}
                          initial={{ height: 0 }}
                          animate={{ height: day.minutes > 0 ? `${(day.minutes / maxBarMinutes) * 100}px` : '4px' }}
                          transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                        />
                        <span className="font-sans text-xs text-text-secondary">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-surface border border-border p-6">
                  <h3 className="font-heading font-bold text-lg mb-6">Kurs-Fortschritt</h3>
                  <div className="space-y-6">
                    {activeCourses.map((course) => (
                      <div key={course.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{course.emoji}</span>
                            <div>
                              <h4 className="font-sans font-medium text-sm">{course.title}</h4>
                              <p className="font-sans text-xs text-text-secondary">{course.completedLessons} / {course.totalLessons} Lektionen · Zuletzt: {course.lastActivity}</p>
                            </div>
                          </div>
                          <span className="font-heading font-bold text-sm">{course.progress}%</span>
                        </div>
                        <ProgressBar value={course.progress} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* ── ACHIEVEMENTS ── */}
            {activeNav === 'achievements' && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-heading text-2xl font-bold mb-2">Achievements</h2>
                  <p className="font-sans text-text-secondary text-sm">Sammle Abzeichen für deine Lernfortschritte und Meilensteine.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-dark p-6 flex items-center gap-8">
                  <div className="text-center">
                    <p className="font-heading text-4xl font-bold text-accent-gold">{earnedCount}</p>
                    <p className="font-sans text-xs text-white/50 mt-1">Errungen</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center">
                    <p className="font-heading text-4xl font-bold text-white">{allAchievements.length}</p>
                    <p className="font-sans text-xs text-white/50 mt-1">Total</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center">
                    <p className="font-heading text-4xl font-bold text-accent-gold">{totalPoints}</p>
                    <p className="font-sans text-xs text-white/50 mt-1">XP-Punkte</p>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between text-xs font-sans mb-2">
                      <span className="text-white/50">Fortschritt</span>
                      <span className="text-white/70">{Math.round((earnedCount / allAchievements.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 overflow-hidden">
                      <motion.div className="h-full bg-accent-gold" initial={{ width: 0 }} animate={{ width: `${(earnedCount / allAchievements.length) * 100}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }} />
                    </div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2">
                  {achievementCategories.map((cat) => (
                    <button key={cat} onClick={() => setAchievementFilter(cat)} className={`font-sans text-xs px-3 py-1.5 transition-all ${achievementFilter === cat ? 'bg-dark text-white' : 'bg-surface border border-border text-text-secondary hover:border-dark'}`}>
                      {cat}
                    </button>
                  ))}
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredAchievements.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className={`p-5 border flex flex-col gap-3 ${a.earned ? 'border-accent-gold/40 bg-surface' : 'border-border bg-surface opacity-45'}`}>
                      <div className="flex items-start justify-between">
                        <span className="text-3xl">{a.icon}</span>
                        <span className={`font-sans text-xs px-2 py-0.5 ${a.earned ? 'bg-accent-gold text-white' : 'bg-border text-text-secondary'}`}>+{a.points} XP</span>
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm">{a.label}</h4>
                        <p className="font-sans text-xs text-text-secondary mt-1 leading-relaxed">{a.desc}</p>
                      </div>
                      <div className="mt-auto">
                        {a.earned ? <p className="font-sans text-xs text-accent-gold">{a.earnedDate}</p> : <p className="font-sans text-xs text-text-secondary">Noch nicht errungen</p>}
                        <span className="font-sans text-[10px] uppercase tracking-wider text-text-secondary">{a.category}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
