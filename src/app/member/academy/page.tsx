'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MemberTabs } from '@/components/MemberTabs'
import { MemberTopBar } from '@/components/MemberTopBar'
import { courses, ALLGEMEIN_COURSES, getCourse } from '@/lib/courses'
import { isCourseUnlocked, individualPricing, aboScope, type Scope, type UserAbo } from '@/lib/academy'
import { useUserAbo } from '@/lib/userPlan'
import { useUserProfile } from '@/lib/userProfile'
import { useRecentCourses } from '@/lib/recentCourses'
import { INSTRUMENT_OVERVIEWS, SUBSCRIBED_INSTRUMENTS, overviewIdsFromLabels, type InstrumentId, type InstrumentOverview, type StarterKurs } from '@/lib/instruments'
import { StarterCourseCard, ProUpgradeBanner } from '@/components/CourseCards'
import { UpgradeDialog } from '@/components/UpgradeDialog'

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

const chf = (n: number) => `CHF ${n.toLocaleString('de-CH')}`

// Pro-Preis (mtl. & jährl.) passend zum Umfang des aktuellen Abos.
// Free-Konten (ohne Instrument) gehen vom kleinsten Umfang (1 Instrument) aus.
function proPriceFor(abo: UserAbo): { monthly: number; yearly: number } {
  const scope: Scope = abo.plan === 'none' ? '1' : aboScope(abo)
  return individualPricing.pro[scope]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Lektionen: 'bg-accent-gold/10 text-accent-gold',
  Module: 'bg-dark/10 text-dark',
  Lernvideos: 'bg-blue-50 text-blue-700',
  Kurse: 'bg-green-50 text-green-700',
}

// Poster für das Einführungsvideo. «allgemein» ist das allgemeine Poster für die
// Einführung in die gesamte LAEMU-Musikschule.
const INTRO_POSTERS: Record<string, string> = {
  allgemein: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
  handorgel: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80',
  schwyzer: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=1200&q=80',
  bassgeige: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&q=80',
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
  const [isUpgraded, setIsUpgraded] = useState(false)
  const [courseFilter, setCourseFilter] = useState('aktive')

  // Zugänge je nach gewähltem Abo:
  // - Free: kein Lehrgang, nur Schnupper-Inhalte.
  // - Lernvideo: nur die Lernvideo-Datenbank; in der Musikschule wie Free.
  // - Starter/Pro: voller Musikschul-Zugang.
  const userAbo = useUserAbo()
  const isLernvideoOnly = userAbo.plan === 'lernvideo' && !isUpgraded
  const hasCourseAccess = userAbo.plan === 'starter' || userAbo.plan === 'pro' || isUpgraded

  // Korrekte Pro-Preise (Banner) — abgeleitet aus dem tatsächlichen Abo & Umfang.
  const proPrice = proPriceFor(userAbo)
  const proPriceLabel = chf(proPrice.monthly)

  // Bei der Registrierung gewählter Name & Instrumente.
  const profile = useUserProfile()
  const greetingName = profile.name.trim() || 'zusammen'

  // Gleicher Grundrahmen für ALLE: jede:r sieht alle Instrumente und Kurse.
  // Was freigeschaltet ist, hängt vom Abo + den gewählten Instrumenten ab.
  const courseUnlocked = (level: string, instrumentLabel: string) =>
    isUpgraded || isCourseUnlocked(level, instrumentLabel, userAbo)

  // Nur die tatsächlich gekauften Instrument-Lehrgänge anzeigen — alles andere
  // verwirrt die Lernenden nur. All-in-One zeigt alle; wer (noch) keinen
  // Lehrgang gekauft hat (Free/Lernvideo), bekommt einen Einblick in alle.
  const ownedInstrumentIds = userAbo.allInstruments
    ? SUBSCRIBED_INSTRUMENTS
    : overviewIdsFromLabels(userAbo.instruments)
  const displayedInstruments = ownedInstrumentIds.length > 0 ? ownedInstrumentIds : SUBSCRIBED_INSTRUMENTS

  // Zuletzt angeschaut: nur Kurse, die man tatsächlich geöffnet hat. Frisch
  // gekaufte Lehrgänge sind hier noch leer und füllen sich erst beim Antippen.
  type ActiveCourse = { key: string; href: string; title: string; level: string; modules: number; duration: string; desc: string; completedModules: number; instrument: string; variant: string }
  const recentCourses = useRecentCourses()
  const courseLookup = new Map<string, ActiveCourse>()
  displayedInstruments.forEach((iid) => {
    const ov = INSTRUMENT_OVERVIEWS[iid]
    if (courseUnlocked('Starter', ov.label)) {
      ov.starterKurse.forEach((k) => {
        if (!getCourse(ov.id, k.id)) return
        courseLookup.set(`${ov.id}-${k.id}`, { key: `${ov.id}-${k.id}`, href: `/member/academy/instrument/${ov.id}/kurs/${k.id}`, title: k.title, level: k.level, modules: k.modules, duration: k.duration, desc: k.desc, completedModules: k.completedModules, instrument: ov.label, variant: ov.id as string })
      })
    }
    if (courseUnlocked('Pro', ov.label)) {
      ov.proKurse.forEach((k) => {
        if (!getCourse(ov.id, k.id)) return
        courseLookup.set(`${ov.id}-${k.id}`, { key: `${ov.id}-${k.id}`, href: `/member/academy/instrument/${ov.id}/kurs/${k.id}`, title: k.title, level: k.level, modules: k.modules, duration: k.duration, desc: k.desc, completedModules: 0, instrument: ov.label, variant: ov.id as string })
      })
    }
  })
  allgemeinKurse.forEach((k) => {
    if (!getCourse('allgemein', k.id)) return
    courseLookup.set(`allgemein-${k.id}`, { key: `allgemein-${k.id}`, href: `/member/academy/instrument/allgemein/kurs/${k.id}`, title: k.title, level: k.level, modules: k.modules, duration: k.duration, desc: k.desc, completedModules: k.completedModules, instrument: 'Allgemein', variant: 'allgemein' })
  })
  const activeCourses: ActiveCourse[] = recentCourses
    .map((r) => courseLookup.get(`${r.instrumentId}-${r.kursId}`))
    .filter((c): c is ActiveCourse => Boolean(c))
  const hasActive = activeCourses.length > 0

  // Das Instrument, dessen Lehrgang im Einführungsvideo vorgestellt wird.
  const introInstrument = INSTRUMENT_OVERVIEWS[displayedInstruments[0]]

  // Filter-Tabs: «Einführung» (Intro-Video) + «Zuletzt angeschaut» (begonnene
  // Kurse) + gekaufte Instrumente + Allgemein.
  const instrumentTabs = displayedInstruments.map((iid) => ({ id: iid as string, label: INSTRUMENT_OVERVIEWS[iid].label, instrument: iid }))
  const kursTabs: { id: string; label: string; instrument?: InstrumentId }[] = [
    { id: 'einfuehrung', label: 'Einführung' },
    { id: 'aktive', label: 'Zuletzt angeschaut' },
    ...instrumentTabs,
    { id: 'allgemein', label: 'Allgemeine Grundlagen' },
  ]
  // Vor dem ersten Lernvideo ist das Einführungsvideo die Startansicht; sobald
  // Kurse begonnen wurden, ist «Zuletzt angeschaut» der Default.
  const fallbackTab = hasActive ? 'aktive' : 'einfuehrung'
  const wanted = courseFilter === 'aktive' && !hasActive ? fallbackTab : courseFilter
  const activeCourseTab = kursTabs.some((t) => t.id === wanted) ? wanted : fallbackTab

  const showSearchDropdown = searchFocused && searchQuery.length >= 2
  const filteredResults = searchQuery.length >= 2
    ? mockSearchResults.filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchQuery.toLowerCase().includes('polka') ? mockSearchResults : mockSearchResults.slice(0, 3)

  function openUpgrade() { setShowUpgradeModal(true) }

  // Wird die Seite mit ?upgrade=1 geöffnet (z. B. aus der Lernvideo-Datenbank),
  // direkt den Upgrade-Dialog anzeigen — damit ein Upgrade wirklich möglich ist.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('upgrade') === '1') {
      setShowUpgradeModal(true)
    }
  }, [])

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
              desc={kurs.desc} completedModules={kurs.completedModules} instrument="Allgemein" variant="allgemein"
            />
          </motion.div>
        ))}
      </div>
    </section>
  )

  // Einführung — das erste, was Neueinsteiger:innen sehen: ein Video, das den
  // Lehrgang vorstellt (der Kurs ist bereits aufs Dashboard gelegt), plus der
  // direkte Einstieg in die erste Lektion.
  const renderEinfuehrung = () => {
    const introKurs = introInstrument.starterKurse.find((k) => getCourse(introInstrument.id, k.id)) ?? introInstrument.starterKurse[0]
    // Allgemeines Poster — die Einführung gilt der ganzen LAEMU-Musikschule.
    const poster = INTRO_POSTERS.allgemein
    return (
      <div className="space-y-6">
        <button className="relative aspect-video w-full overflow-hidden bg-dark group text-left block">
          <Image src={poster} alt="Einführung in die LAEMU-Musikschule" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 1000px" unoptimized />
          <span className="absolute inset-0 bg-dark/45 group-hover:bg-dark/35 transition-colors" />
          <span className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white" className="ml-1"><polygon points="6 4 20 12 6 20 6 4" /></svg>
            </span>
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-white/80 mb-1">Einführungsvideo</span>
            <span className="font-heading font-black text-2xl sm:text-3xl text-white">Willkommen in der LAEMU-Musikschule</span>
          </span>
        </button>
        <p className="font-sans text-sm text-text-secondary leading-relaxed">
          Schau dir zuerst die kurze Einführung an — sie zeigt dir, wie die LAEMU-Musikschule aufgebaut
          ist und wie du am besten startest. Danach geht&rsquo;s direkt mit deiner ersten Lektion los.
        </p>
        <div>
          <h4 className="font-heading font-bold text-lg mb-3">Hier startest du</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StarterCourseCard
              href={`/member/academy/instrument/${introInstrument.id}/kurs/${introKurs.id}`}
              title={introKurs.title} level={introKurs.level} modules={introKurs.modules} duration={introKurs.duration}
              desc={introKurs.desc} completedModules={introKurs.completedModules} instrument={introInstrument.label} variant={introInstrument.id}
              locked={!courseUnlocked('Starter', introInstrument.label)} lockLabel="Starter"
              previewable={!!getCourse(introInstrument.id, introKurs.id)}
            />
          </div>
        </div>
      </div>
    )
  }

  // Instrument-Lehrgang: alle sehen Starter- & Pro-Kurse; je nach Abo sind sie
  // freigeschaltet oder nur als Vorschau (Schnupper-Lektionen) zugänglich.
  const renderLehrgang = (ov: InstrumentOverview) => {
    const starterUnlocked = courseUnlocked('Starter', ov.label)
    const proUnlocked = courseUnlocked('Pro', ov.label)
    // Höhere/gesperrte Kurse werden als Vorschau mit Schloss gezeigt — auch wenn
    // ihr Inhalt noch im Aufbau ist (Free sieht Starter + Pro, Starter sieht Pro).
    // Nur bereits freigeschaltete Kurse ohne Inhalt bleiben ausgeblendet.
    const starterKurse = ov.starterKurse.filter((k) => !starterUnlocked || getCourse(ov.id, k.id))
    const proKurse = ov.proKurse.filter((k) => !proUnlocked || getCourse(ov.id, k.id))
    return (
      <div className="space-y-10">
        {starterKurse.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans text-xs bg-accent-gold text-white px-2 py-0.5 uppercase tracking-wide">Starter</span>
              <h3 className="font-heading text-xl font-bold">{ov.label} — Starter-Lehrgang</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {starterKurse.map((kurs, i) => (
                <motion.div key={kurs.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <StarterCourseCard
                    href={`/member/academy/instrument/${ov.id}/kurs/${kurs.id}`}
                    title={kurs.title} level={kurs.level} modules={kurs.modules} duration={kurs.duration}
                    desc={kurs.desc} completedModules={kurs.completedModules} instrument={ov.label} variant={ov.id}
                    locked={!starterUnlocked} lockLabel="Starter"
                    previewable={!!getCourse(ov.id, kurs.id)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {(proKurse.length > 0 || !proUnlocked) && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans text-xs bg-dark text-white px-2 py-0.5 uppercase tracking-wide">Pro</span>
              <h3 className="font-heading text-xl font-bold">{ov.label} — Pro-Lehrgang</h3>
            </div>
            {proKurse.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proKurse.map((kurs, i) => (
                  <motion.div key={kurs.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <StarterCourseCard
                      href={`/member/academy/instrument/${ov.id}/kurs/${kurs.id}`}
                      title={kurs.title} level={kurs.level} modules={kurs.modules} duration={kurs.duration}
                      desc={kurs.desc} completedModules={0} instrument={ov.label} variant={ov.id}
                      locked={!proUnlocked} lockLabel="Pro"
                      previewable={!!getCourse(ov.id, kurs.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
            {!proUnlocked && (
              <ProUpgradeBanner
                onUpgrade={openUpgrade}
                monthlyLabel={proPriceLabel}
                yearlyLabel={chf(proPrice.yearly)}
              />
            )}
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {showUpgradeModal && (
        <UpgradeDialog
          abo={userAbo}
          onClose={() => setShowUpgradeModal(false)}
          onUpgraded={() => setIsUpgraded(true)}
        />
      )}

      {/* TOP BAR */}
      <MemberTopBar
        title={`Hallo ${greetingName}`}
        right={
          hasCourseAccess ? (
            <div className="hidden sm:flex items-center gap-2 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-4 py-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              <span className="font-sans font-bold text-sm">7 Wochen Streak!</span>
            </div>
          ) : (
            <button
              onClick={openUpgrade}
              className="flex items-center gap-2 bg-accent-gold text-white border border-accent-gold px-4 py-1.5 font-sans font-semibold text-sm hover:bg-accent-earth transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              {isLernvideoOnly ? 'Auf Pro upgraden' : 'Jetzt upgraden'}
            </button>
          )
        }
      />

      {/* AREA TABS */}
      <MemberTabs active="academy" />

      <div className="max-w-5xl mx-auto px-4 py-8">

          {/* MAIN CONTENT */}
          <div className="space-y-10">

            {/* ── KURSE ── */}
            {(
              <>
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

                {/* Kurse / Lehrgänge — mit Tabs; integriert die Instrument-Lehrgänge.
                    Bezahlt: «Meine Kurse» (gewählte Instrumente).
                    Free/Lernvideo: «Einblick in die Lehrgänge» (alle Instrumente). */}
                <section>
                  <h3 className="font-heading font-bold text-xl mb-1">Kurse</h3>
                  <p className="font-sans text-sm text-text-secondary mb-3">
                    Tippe auf die Tabs, um dein Instrument
                    {instrumentTabs.length > 0 ? <> ({instrumentTabs.map((t) => t.label).join(', ')})</> : null}
                    {' '}oder eine andere Ansicht zu wählen.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {kursTabs.map((f) => {
                      const disabled = f.id === 'aktive' && !hasActive
                      return (
                        <button
                          key={f.id}
                          onClick={() => { if (!disabled) setCourseFilter(f.id) }}
                          disabled={disabled}
                          title={disabled ? 'Noch keinen Kurs gestartet' : undefined}
                          className={`font-sans text-sm px-4 py-2 border transition-colors ${activeCourseTab === f.id ? 'border-dark bg-dark text-white' : disabled ? 'border-border bg-surface text-text-secondary/40 cursor-not-allowed' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
                        >
                          {f.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Einführung: Intro-Video — Startansicht vor dem ersten Lernvideo */}
                  {activeCourseTab === 'einfuehrung' && renderEinfuehrung()}

                  {/* Zuletzt angeschaut: bereits begonnene Kurse */}
                  {activeCourseTab === 'aktive' && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h4 className="font-heading font-bold text-lg">Zuletzt angeschaut</h4>
                        <span className="font-sans text-xs text-text-secondary">— da bist du stehengeblieben</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeCourses.map((kurs, i) => (
                          <motion.div key={kurs.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                            <StarterCourseCard
                              href={kurs.href}
                              title={kurs.title} level={kurs.level} modules={kurs.modules} duration={kurs.duration}
                              desc={kurs.desc} completedModules={kurs.completedModules} instrument={kurs.instrument} variant={kurs.variant}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instrument-Lehrgänge (gewählte bzw. alle bei Free) */}
                  {instrumentTabs.map((t) =>
                    activeCourseTab === t.id ? (
                      <div key={t.id}>{renderLehrgang(INSTRUMENT_OVERVIEWS[t.instrument as InstrumentId])}</div>
                    ) : null,
                  )}

                  {/* Allgemeine Grundlagen */}
                  {activeCourseTab === 'allgemein' && renderAllgemein()}
                </section>
              </>
            )}

          </div>
      </div>

      {/* Persönlicher Support / Live-Chat */}
      <SupportWidget />
    </div>
  )
}
