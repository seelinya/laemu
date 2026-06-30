'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { isDbVideoUnlocked } from '@/lib/academy'
import { useUserAbo } from '@/lib/userPlan'
import { useUserProfile } from '@/lib/userProfile'
import { MemberTabs } from '@/components/MemberTabs'
import { MemberTopBar } from '@/components/MemberTopBar'

// ─── Data ────────────────────────────────────────────────────────────────────

const videos = [
  {
    id: 1, title: 'Dr Alperose', artist: 'Willi Valotti', instrument: 'Handorgel', formation: 'Trio',
    composer: 'Valotti', year: 1978, difficultyNum: 3, level: 2, taktart: 'Walzer',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'starter' as const,
    styleTags: ['Urchig', 'Innerschwyzer Stil'], melodieTags: [] as string[],
    autoTags: ['Handorgel', 'Schwyzerörgeli', 'Starter', 'Grundlagenkurs'],
    notesAvailable: { violinschluessel: true, griffschrift: true },
    img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80',
    price: 18, purchased: true,
  },
  {
    id: 2, title: 'Ländler im Dreivierteltakt', artist: 'Kapelle Hess-Ruedi-Hegner', instrument: 'Schwyzerörgeli',
    formation: 'Kapelle', composer: 'Hess', year: 1995, difficultyNum: 2, level: 1, taktart: 'Ländler',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'starter' as const,
    styleTags: ['Modern', 'Konzertant'], melodieTags: [] as string[],
    autoTags: ['Schwyzerörgeli', 'Starter'],
    notesAvailable: { violinschluessel: true, griffschrift: false },
    img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&q=80',
    price: 18, purchased: true,
  },
  {
    id: 3, title: 'Abendstern-Polka', artist: 'Bodästänix', instrument: 'Handorgel', formation: 'Quartett',
    composer: 'Unbekannt', year: 2003, difficultyNum: 4, level: 3, taktart: 'Polka',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'pro' as const,
    styleTags: ['Urchig', 'Berner Stil'], melodieTags: [] as string[],
    autoTags: ['Handorgel', 'Pro'],
    notesAvailable: { violinschluessel: false, griffschrift: true },
    img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=400&q=80',
    price: 18, purchased: true,
  },
  {
    id: 4, title: 'Innerschwizer Schottisch', artist: 'Trio Rigi', instrument: 'Klarinette', formation: 'Trio',
    composer: 'Müller', year: 1988, difficultyNum: 3, level: 2, taktart: 'Schottisch',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'starter' as const,
    styleTags: ['Innerschwyzer Stil'], melodieTags: [] as string[],
    autoTags: ['Klarinette', 'Starter'],
    notesAvailable: { violinschluessel: false, griffschrift: false },
    img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80',
    price: 18, purchased: true,
  },
  {
    id: 5, title: 'Walzer am See', artist: 'Lisa Frei', instrument: 'Klavierbegleitung', formation: 'Solo',
    composer: 'Frei', year: 2015, difficultyNum: 2, level: 2, taktart: 'Walzer',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'free' as const,
    styleTags: ['Modern'], melodieTags: [] as string[],
    autoTags: ['Klavierbegleitung', 'Free'],
    notesAvailable: { violinschluessel: true, griffschrift: false },
    img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80',
    price: 0, purchased: true,
  },
  {
    id: 6, title: 'Bergbach-Mazurka', artist: 'Hess-Rusch-Hegner', instrument: 'Bassgeige', formation: 'Kapelle',
    composer: 'Rusch', year: 1972, difficultyNum: 5, level: 4, taktart: 'Mazurka',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'pro' as const,
    styleTags: ['Konzertant', 'Bündner Stil'], melodieTags: [] as string[],
    autoTags: ['Bassgeige', 'Pro'],
    notesAvailable: { violinschluessel: true, griffschrift: true },
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80',
    price: 18, purchased: true,
  },
  {
    id: 7, title: 'Stille Nacht', artist: 'Verschiedene Kapellen', instrument: 'Handorgel', formation: 'Trio',
    composer: 'Franz Xaver Gruber', year: 1818, difficultyNum: 1, level: 1, taktart: null,
    artDesStückes: 'bekannte_melodie' as const, difficultyPlan: 'free' as const,
    styleTags: [], melodieTags: ['Weihnachtslied'],
    autoTags: ['Handorgel', 'Free', 'Bekannte Melodie'],
    notesAvailable: { violinschluessel: true, griffschrift: false },
    img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80',
    price: 0, purchased: true,
  },
]

type Wish = { id: number; title: string; composer?: string; votes: Record<string, number>; available: string[] }

const initialWishes: Wish[] = [
  { id: 1, title: 'S Röseli', composer: 'Trad.', votes: { 'Handorgel (1. Stimme)': 14, 'Schwyzerörgeli (1. Stimme)': 9, 'Bassgeige': 4, 'Handorgel (2. Stimme)': 6 }, available: ['Schwyzerörgeli (1. Stimme)'] },
  { id: 2, title: 'Märzenschnee-Ländler', votes: { 'Schwyzerörgeli (1. Stimme)': 17, 'Handorgel (2. Stimme)': 5 }, available: [] },
  { id: 3, title: 'Luzerner Polka', composer: 'R. Suter', votes: { 'Handorgel (1. Stimme)': 28, 'Schwyzerörgeli (1. Stimme)': 13, 'Bassgeige': 7 }, available: [] },
]

// ─── Constants ───────────────────────────────────────────────────────────────

const INSTRUMENTS = ['Alle', 'Schwyzerörgeli', 'Handorgel', 'Bassgeige']
const TAKTARTEN_FILTER = ['Schottisch', 'Ländler', 'Walzer', 'Mazurka', 'Polka', 'Schnellpolka', 'Stümpäli', 'Marsch', 'Lied']
const BEKANNTE_TAGS = ['Schlager', 'Kinderlied', 'Weihnachtslied', 'Pop', 'Rock']

// Optionen für Stimmen bei Stückwünschen — gruppiert nach 1. Stimme, 2. Stimme
// und Begleitstimmvorschlägen.
const WISH_VOTE_GROUPS: { label: string; options: string[] }[] = [
  { label: '1. Stimme', options: ['Handorgel (1. Stimme)', 'Schwyzerörgeli (1. Stimme)'] },
  { label: '2. Stimme', options: ['Handorgel (2. Stimme)', 'Schwyzerörgeli (2. Stimme)'] },
  { label: 'Begleitstimmvorschläge', options: ['Handorgel (Begleitung)', 'Schwyzerörgeli (Begleitung)', 'Bassgeige'] },
]
const WISH_VOTE_OPTIONS = WISH_VOTE_GROUPS.flatMap(g => g.options)

const planColors: Record<string, string> = {
  free: 'bg-border/60 text-text-secondary',
  starter: 'bg-accent-gold/10 text-accent-gold border border-accent-gold/30',
  pro: 'bg-dark/10 text-text-primary border border-dark/20',
}
const planLabels: Record<string, string> = { free: 'Free', starter: 'Starter', pro: 'Pro' }

// ─── Types ───────────────────────────────────────────────────────────────────

type ArtFilter = 'volkstuemlich' | 'bekannte_melodie'

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LernvideosPage() {
  const router = useRouter()
  const userAbo = useUserAbo()
  const greetingName = useUserProfile().name.trim() || 'zusammen'
  const [search, setSearch] = useState('')
  const [filterInst, setFilterInst] = useState('Alle')
  const [filterArt, setFilterArt] = useState<ArtFilter | null>(null)
  const [filterTakt, setFilterTakt] = useState<string | null>(null)
  const [filterStyleTag, setFilterStyleTag] = useState<string | null>(null)
  const [filterGenreTag, setFilterGenreTag] = useState<string | null>(null)
  const [filterNotenV, setFilterNotenV] = useState(false)
  const [filterNotenG, setFilterNotenG] = useState(false)
  const [filterLearned, setFilterLearned] = useState<'all' | 'learned' | 'unlearned'>('all')
  const [filterLevel, setFilterLevel] = useState<'free' | 'starter' | 'pro' | null>(null)
  const [saved, setSaved] = useState<Set<number>>(new Set([1, 5, 7]))
  // Welche Stücke man bereits gelernt hat — markierbar & filterbar.
  const [learned, setLearned] = useState<Set<number>>(new Set([1, 2]))

  // Frisch erstellter Free-Account: noch keine Stücke gelernt oder gemerkt.
  useEffect(() => {
    if (userAbo.plan === 'none') {
      setLearned(new Set())
      setSaved(new Set())
    }
  }, [userAbo.plan])
  const [tab, setTab] = useState<'datenbank' | 'merkliste' | 'wuensche'>('datenbank')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showAdvancedDesktop, setShowAdvancedDesktop] = useState(true)
  const [showWishForm, setShowWishForm] = useState(false)
  const [wishes, setWishes] = useState<Wish[]>(initialWishes)
  // Eigene Stimmen pro Stück & Option, Schlüssel `${wishId}:${option}`.
  const [wishVotes, setWishVotes] = useState<Record<string, boolean>>({})
  const [wishTitle, setWishTitle] = useState('')
  const [wishComposer, setWishComposer] = useState('')
  const [wishVoteSel, setWishVoteSel] = useState<string[]>([])
  const [wishSearch, setWishSearch] = useState('')
  // Aufgeklappte Stückwünsche (einklappbar) — mehrere gleichzeitig möglich.
  const [expandedWishes, setExpandedWishes] = useState<Set<number>>(new Set())
  const toggleWishExpand = (id: number) =>
    setExpandedWishes(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const toggleSaved = (id: number) => setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleLearned = (id: number) => setLearned(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  // ── Stückwünsche: Stimmen pro Option ──
  const voteKey = (id: number, opt: string) => `${id}:${opt}`
  const wishOptVotes = (w: Wish, opt: string) => (w.votes[opt] ?? 0) + (wishVotes[voteKey(w.id, opt)] ? 1 : 0)
  const toggleWishVote = (id: number, opt: string) =>
    setWishVotes(prev => ({ ...prev, [voteKey(id, opt)]: !prev[voteKey(id, opt)] }))
  // Gesamttotal aller Optionen (bereits vorhandene zählen nicht mit).
  const wishTotal = (w: Wish) => WISH_VOTE_OPTIONS.reduce((s, opt) => s + (w.available.includes(opt) ? 0 : wishOptVotes(w, opt)), 0)
  const toggleWishVoteSel = (opt: string) =>
    setWishVoteSel(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt])

  const submitWish = () => {
    if (!wishTitle.trim() || wishVoteSel.length === 0) return
    const id = Date.now()
    // Kein Basis-Wert: das eigene Like (wishVotes) zählt als die eine Stimme,
    // damit ein selbst gelikter Wunsch nicht doppelt zählt.
    const newWish: Wish = { id, title: wishTitle.trim(), composer: wishComposer.trim() || undefined, votes: {}, available: [] }
    setWishes(prev => [newWish, ...prev])
    setWishVotes(prev => { const n = { ...prev }; wishVoteSel.forEach(o => { n[voteKey(id, o)] = true }); return n })
    setExpandedWishes(prev => { const n = new Set(prev); n.add(id); return n })
    setWishTitle(''); setWishComposer(''); setWishVoteSel([]); setShowWishForm(false)
  }

  const filteredWishes = wishes
    .filter(w => {
      const q = wishSearch.trim().toLowerCase()
      return !q || w.title.toLowerCase().includes(q) || (w.composer ?? '').toLowerCase().includes(q)
    })
    .sort((a, b) => wishTotal(b) - wishTotal(a))

  const toggleArt = (val: ArtFilter) => {
    setFilterArt(prev => {
      const next = prev === val ? null : val
      if (next !== 'volkstuemlich') { setFilterStyleTag(null); setFilterTakt(null) }
      if (next !== 'bekannte_melodie') { setFilterGenreTag(null) }
      return next
    })
  }

  const resetAll = () => {
    setSearch(''); setFilterInst('Alle'); setFilterArt(null); setFilterTakt(null)
    setFilterStyleTag(null); setFilterGenreTag(null)
    setFilterNotenV(false); setFilterNotenG(false); setFilterLearned('all')
    setFilterLevel(null)
  }

  const filtered = videos.filter(v => {
    const q = search.toLowerCase()
    if (q && !v.title.toLowerCase().includes(q) && !v.artist.toLowerCase().includes(q) && !v.composer.toLowerCase().includes(q) && !v.autoTags.some(t => t.toLowerCase().includes(q))) return false
    if (filterInst !== 'Alle' && v.instrument !== filterInst) return false
    if (filterArt && v.artDesStückes !== filterArt) return false
    if (filterTakt && v.taktart !== filterTakt) return false
    if (filterStyleTag && !(v.styleTags as string[]).includes(filterStyleTag)) return false
    if (filterGenreTag && !v.melodieTags.includes(filterGenreTag)) return false
    if (filterNotenV && !v.notesAvailable.violinschluessel) return false
    if (filterNotenG && !v.notesAvailable.griffschrift) return false
    if (filterLearned === 'learned' && !learned.has(v.id)) return false
    if (filterLearned === 'unlearned' && learned.has(v.id)) return false
    if (filterLevel && v.difficultyPlan !== filterLevel) return false
    return true
  })

  const savedVideos = videos.filter(v => saved.has(v.id))

  // Bereits gewünschte Stücke, zu denen es noch kein Video gibt: bei der Suche
  // ausgegraut mit Tag "In Bearbeitung" anzeigen.
  const wishMatches = (() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return wishes.filter(w =>
      (w.title.toLowerCase().includes(q) || (w.composer ?? '').toLowerCase().includes(q)) &&
      !videos.some(v => v.title.toLowerCase() === w.title.toLowerCase()),
    )
  })()

  const activeFilterCount = [
    filterInst !== 'Alle', filterArt !== null, filterTakt !== null,
    filterStyleTag !== null, filterGenreTag !== null,
    filterNotenV, filterNotenG, filterLearned !== 'all', filterLevel !== null,
  ].filter(Boolean).length

  // Ergebnis-Karte (Stück) — geteilt von Datenbank- und Merkliste-Tab.
  const renderResultCard = (v: typeof videos[0], i: number) => {
    const unlocked = isDbVideoUnlocked({ id: v.id, plan: v.difficultyPlan, instrument: v.instrument }, userAbo)
    const isSaved = saved.has(v.id)
    const isLearned = learned.has(v.id)
    const href = `/member/academy/lernvideos/${v.id}`
    return (
      <motion.div
        key={v.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.03 }}
        {...(unlocked
          ? {
              role: 'link',
              tabIndex: 0,
              onClick: () => router.push(href),
              onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') router.push(href) },
            }
          : {})}
        className={`bg-surface border border-border overflow-hidden group hover:border-dark transition-colors flex flex-col sm:flex-row ${unlocked ? 'cursor-pointer' : ''}`}
      >
        {/* Thumbnail — auf Mobile oben über dem Text, auf Desktop links */}
        <div className="relative w-full h-44 sm:h-auto sm:w-52 flex-shrink-0 sm:self-stretch">
          <Image src={v.img} alt={v.title} fill className={`object-cover transition-transform duration-500 ${unlocked ? 'group-hover:scale-105' : 'grayscale'}`} unoptimized />
          {unlocked && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-9 h-9 bg-accent-gold flex items-center justify-center"><span className="text-white ml-0.5 text-sm">▶</span></div>
            </div>
          )}
          <div className="absolute bottom-2 left-2">
            <span className="font-sans text-[10px] bg-black/60 text-white px-1.5 py-0.5">{v.instrument}</span>
          </div>
          {isLearned && (
            <div className="absolute top-2 left-2">
              <span className="font-sans text-[10px] bg-green-600 text-white px-1.5 py-0.5 flex items-center gap-1">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Gelernt
              </span>
            </div>
          )}
          {!unlocked && (
            <div className="absolute inset-0 bg-dark/55 flex flex-col items-center justify-center gap-1 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span className="font-sans text-[10px] uppercase tracking-wide">Gesperrt</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <h4 className="font-heading font-bold text-sm group-hover:text-accent-gold transition-colors leading-snug">{v.title}</h4>
              {v.taktart && (
                <span className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary flex-shrink-0 mt-0.5">{v.taktart}</span>
              )}
            </div>
            <p className="font-sans text-xs text-text-secondary mb-2">{v.artist}</p>
            <div className="flex flex-wrap gap-1">
              {v.styleTags.slice(0, 3).map(t => (
                <span key={t} className="font-sans text-[10px] px-1.5 py-0.5 bg-accent-gold/8 border border-accent-gold/20 text-accent-gold">{t}</span>
              ))}
              {v.melodieTags.slice(0, 2).map(t => (
                <span key={t} className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">{t}</span>
              ))}
              {v.notesAvailable.violinschluessel && (
                <span className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">♩ Violin</span>
              )}
              {v.notesAvailable.griffschrift && (
                <span className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">♩ Griff</span>
              )}
            </div>
          </div>

          {/* Aktionen — auf Mobile als Reihe unter dem Text, auf Desktop als Spalte rechts */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0 border-t sm:border-t-0 border-border pt-3 sm:pt-0 mt-1 sm:mt-0">
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); toggleLearned(v.id) }}
                title={isLearned ? 'Als nicht gelernt markieren' : 'Als gelernt markieren'}
                aria-label={isLearned ? 'Als nicht gelernt markieren' : 'Als gelernt markieren'}
                className={`p-1.5 border transition-colors flex-shrink-0 ${isLearned ? 'border-green-600 bg-green-600 text-white' : 'border-border text-text-secondary hover:border-green-600 hover:text-green-600'}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleSaved(v.id) }}
                title={isSaved ? 'Aus Merkliste entfernen' : 'Zur Merkliste hinzufügen'}
                className={`p-1.5 border transition-colors flex-shrink-0 ${isSaved ? 'border-accent-gold text-accent-gold' : 'border-border text-text-secondary hover:border-dark hover:text-text-primary'}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </button>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-1 sm:my-2">
              <span className={`font-sans text-[10px] px-1.5 py-0.5 font-semibold ${planColors[v.difficultyPlan]}`}>{planLabels[v.difficultyPlan]}</span>
              {unlocked ? (
                <span className="font-sans text-[10px] px-1.5 py-0.5 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold flex items-center gap-1 whitespace-nowrap">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Freigeschaltet
                </span>
              ) : (
                <span className="font-sans text-[10px] px-1.5 py-0.5 bg-dark/10 text-text-secondary flex items-center gap-1 whitespace-nowrap">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Gesperrt
                </span>
              )}
            </div>
            {unlocked && (
              <Link href={`/member/academy/lernvideos/${v.id}`} className="block font-sans text-xs px-3 py-1.5 transition-colors whitespace-nowrap text-center bg-dark text-white hover:bg-accent-gold">
                Öffnen →
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* TOP BAR (schwarz) — konsistent mit Musikschule & Community */}
      <MemberTopBar
        title={`Hallo ${greetingName}`}
        right={
          userAbo.plan === 'none' ? (
            <Link
              href="/member/academy?upgrade=1"
              className="flex items-center gap-2 bg-accent-gold text-white border border-accent-gold px-3 sm:px-4 py-1.5 font-sans font-semibold text-sm hover:bg-accent-earth transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              Jetzt upgraden
            </Link>
          ) : (
            <button
              onClick={() => setTab('merkliste')}
              title={`Merkliste (${saved.size})`}
              aria-label={`Merkliste (${saved.size})`}
              className={`font-sans text-xs px-2.5 sm:px-3 py-1.5 border transition-colors flex items-center gap-1.5 ${tab === 'merkliste' ? 'border-accent-gold bg-accent-gold/15 text-accent-gold' : 'border-white/20 text-white/70 hover:border-white hover:text-white'}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={tab === 'merkliste' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              <span className="hidden sm:inline">Merkliste </span>
              <span className="tabular-nums">({saved.size})</span>
            </button>
          )
        }
      />

      {/* AREA TABS */}
      <MemberTabs active="lerndatenbank" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs — gerahmt, einzeilig, horizontal scrollbar auf Mobile */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button onClick={() => setTab('datenbank')} className={`flex-shrink-0 px-4 py-2.5 font-sans text-sm font-medium border transition-colors whitespace-nowrap ${tab === 'datenbank' ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-text-primary'}`}>
            Lernvideos durchsuchen
          </button>
          <button onClick={() => setTab('merkliste')} className={`flex-shrink-0 px-4 py-2.5 font-sans text-sm font-medium border transition-colors whitespace-nowrap ${tab === 'merkliste' ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-text-primary'}`}>
            Merkliste ({saved.size})
          </button>
          <button onClick={() => setTab('wuensche')} className={`flex-shrink-0 px-4 py-2.5 font-sans text-sm font-medium border transition-colors whitespace-nowrap ${tab === 'wuensche' ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-text-primary'}`}>
            Stückwünsche ({wishes.length})
          </button>
        </div>

        {tab === 'datenbank' && (
          <>
            {/* ── Mobile: Search + collapsible advanced filters ── */}
            <div className="lg:hidden mb-6 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  placeholder="Titel, Interpret, Komponist, Tags…"
                  className="flex-1 border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                />
                <button
                  onClick={() => setShowMobileFilters(p => !p)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 font-sans text-xs border transition-colors ${showMobileFilters ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark'}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
                  <span className="hidden sm:inline">Erweiterte Suche</span>
                  <span className="sm:hidden">Filter</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {activeFilterCount > 0 && (
                  <button onClick={resetAll} className="font-sans text-xs text-accent-gold hover:underline flex-shrink-0">
                    ✕ {activeFilterCount}
                  </button>
                )}
              </div>
              <AnimatePresence>
                {showMobileFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-border bg-surface p-4 space-y-5">
                      {/* Instrument */}
                      <div>
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Instrument</label>
                        <select value={filterInst} onChange={e => setFilterInst(e.target.value)} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface">
                          {INSTRUMENTS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      {/* Art des Stückes */}
                      <div>
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Art des Stückes</label>
                        <div className="space-y-2">
                          {([
                            ['volkstuemlich', 'Volkstümlich', 'Ländler, Schottisch, Walzer …'],
                            ['bekannte_melodie', 'Bekannte Melodie', 'Schlager, Pop, Weihnachtslieder …'],
                          ] as const).map(([val, label, desc]) => {
                            const active = filterArt === val
                            return (
                              <div key={val}>
                                <button onClick={() => toggleArt(val)} className={`w-full p-3 border text-left transition-colors flex items-start justify-between gap-2 ${active ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
                                  <div>
                                    <p className={`font-sans text-sm font-medium ${active ? 'text-accent-gold' : ''}`}>{label}</p>
                                    <p className="font-sans text-xs text-text-secondary leading-snug">{desc}</p>
                                  </div>
                                  <div className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center ${active ? 'border-accent-gold' : 'border-border'}`}>
                                    {active && <span className="w-2 h-2 rounded-full bg-accent-gold" />}
                                  </div>
                                </button>
                                <AnimatePresence>
                                  {active && val === 'volkstuemlich' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                      <div className="border border-t-0 border-accent-gold/20 bg-background px-3 py-3 space-y-3">
                                        <div>
                                          <p className="font-sans text-[10px] uppercase tracking-widest text-accent-gold mb-2">Taktart</p>
                                          <div className="flex flex-wrap gap-1">
                                            {TAKTARTEN_FILTER.map(t => (
                                              <button key={t} onClick={() => setFilterTakt(prev => prev === t ? null : t)} className={`font-sans text-[10px] px-2 py-1 border transition-colors ${filterTakt === t ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark'}`}>{t}</button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                <AnimatePresence>
                                  {active && val === 'bekannte_melodie' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                      <div className="border border-t-0 border-border bg-background px-3 py-3">
                                        <p className="font-sans text-[10px] uppercase tracking-widest text-text-secondary mb-2">Genre</p>
                                        <div className="flex flex-wrap gap-1">
                                          {BEKANNTE_TAGS.map(t => (
                                            <button key={t} onClick={() => setFilterGenreTag(prev => prev === t ? null : t)} className={`font-sans text-[10px] px-2 py-1 border transition-colors ${filterGenreTag === t ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark'}`}>{t}</button>
                                          ))}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      {/* Noten */}
                      <div>
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Noten</label>
                        <div className="space-y-1.5">
                          <label className={`flex items-center gap-2.5 px-3 py-2 border cursor-pointer transition-colors ${filterNotenV ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
                            <input type="checkbox" checked={filterNotenV} onChange={e => setFilterNotenV(e.target.checked)} className="accent-[#C4973A]" />
                            <span className={`font-sans text-sm ${filterNotenV ? 'text-accent-gold' : 'text-text-secondary'}`}>Violinschlüssel</span>
                          </label>
                          <label className={`flex items-center gap-2.5 px-3 py-2 border cursor-pointer transition-colors ${filterNotenG ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
                            <input type="checkbox" checked={filterNotenG} onChange={e => setFilterNotenG(e.target.checked)} className="accent-[#C4973A]" />
                            <span className={`font-sans text-sm ${filterNotenG ? 'text-accent-gold' : 'text-text-secondary'}`}>Griffschrift</span>
                          </label>
                        </div>
                      </div>
                      {/* Lernstatus */}
                      <div>
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Lernstatus</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {([['all', 'Alle'], ['learned', 'Gelernt'], ['unlearned', 'Offen']] as const).map(([val, lbl]) => (
                            <button key={val} onClick={() => setFilterLearned(val)} className={`font-sans text-xs px-2 py-2 border transition-colors ${filterLearned === val ? (val === 'learned' ? 'border-green-600 bg-green-600 text-white' : 'border-dark bg-dark text-white') : 'border-border text-text-secondary hover:border-dark'}`}>{lbl}</button>
                          ))}
                        </div>
                      </div>
                      {/* Level */}
                      <div>
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Level</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(['free', 'starter', 'pro'] as const).map(lvl => (
                            <button key={lvl} onClick={() => setFilterLevel(prev => prev === lvl ? null : lvl)} className={`font-sans text-xs px-2 py-2 border transition-colors ${filterLevel === lvl ? 'border-accent-gold bg-accent-gold text-white' : 'border-border text-text-secondary hover:border-dark'}`}>{planLabels[lvl]}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ── Left sidebar: Suche + Filter (desktop only) ── */}
            <div className="hidden lg:block space-y-6">
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs uppercase tracking-widest text-text-secondary">Filter & Suche</p>
                {activeFilterCount > 0 && (
                  <button onClick={resetAll} className="font-sans text-xs text-accent-gold hover:underline">
                    Zurücksetzen ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Search */}
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Titel, Interpret, Komponist, Tags…"
                className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
              />

              {/* Instrument */}
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Instrument</label>
                <select
                  value={filterInst}
                  onChange={e => setFilterInst(e.target.value)}
                  className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                >
                  {INSTRUMENTS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Advanced filter toggle */}
              <button
                onClick={() => setShowAdvancedDesktop(p => !p)}
                className="w-full flex items-center justify-between font-sans text-xs text-text-secondary hover:text-text-primary transition-colors border-b border-border pb-2"
              >
                <span className="uppercase tracking-widest">Erweiterte Filter</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showAdvancedDesktop ? '' : '-rotate-90'}`}><polyline points="6 9 12 15 18 9"/></svg>
              </button>

              <AnimatePresence initial={false}>
                {showAdvancedDesktop && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="space-y-6">
              {/* Art des Stückes — multi-select like upload form */}
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Art des Stückes</label>
                <div className="space-y-2">
                  {([
                    ['volkstuemlich', 'Volkstümlich', 'Ländler, Schottisch, Walzer …'],
                    ['bekannte_melodie', 'Bekannte Melodie', 'Schlager, Pop, Weihnachtslieder …'],
                  ] as const).map(([val, label, desc]) => {
                    const active = filterArt === val
                    return (
                      <div key={val}>
                        <button
                          onClick={() => toggleArt(val)}
                          className={`w-full p-3 border text-left transition-colors flex items-start justify-between gap-2 ${active ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                        >
                          <div>
                            <p className={`font-sans text-sm font-medium ${active ? 'text-accent-gold' : ''}`}>{label}</p>
                            <p className="font-sans text-xs text-text-secondary leading-snug">{desc}</p>
                          </div>
                          <div className={`w-4 h-4 border flex-shrink-0 mt-0.5 flex items-center justify-center ${active ? 'bg-accent-gold border-accent-gold' : 'border-border'}`}>
                            {active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                        </button>

                        {/* Volkstümlich sub-filters */}
                        <AnimatePresence>
                          {active && val === 'volkstuemlich' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="border border-t-0 border-accent-gold/20 bg-background px-3 py-3 space-y-3">
                                <div>
                                  <p className="font-sans text-[10px] uppercase tracking-widest text-accent-gold mb-2">Taktart</p>
                                  <div className="flex flex-wrap gap-1">
                                    {TAKTARTEN_FILTER.map(t => (
                                      <button
                                        key={t}
                                        onClick={() => setFilterTakt(prev => prev === t ? null : t)}
                                        className={`font-sans text-[10px] px-2 py-1 border transition-colors ${filterTakt === t ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark'}`}
                                      >
                                        {t}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Bekannte Melodie sub-filters */}
                        <AnimatePresence>
                          {active && val === 'bekannte_melodie' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="border border-t-0 border-border bg-background px-3 py-3">
                                <p className="font-sans text-[10px] uppercase tracking-widest text-text-secondary mb-2">Genre</p>
                                <div className="flex flex-wrap gap-1">
                                  {BEKANNTE_TAGS.map(t => (
                                    <button
                                      key={t}
                                      onClick={() => setFilterGenreTag(prev => prev === t ? null : t)}
                                      className={`font-sans text-[10px] px-2 py-1 border transition-colors ${filterGenreTag === t ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark'}`}
                                    >
                                      {t}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Noten */}
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Noten</label>
                <div className="space-y-1.5">
                  <label className={`flex items-center gap-2.5 px-3 py-2 border cursor-pointer transition-colors ${filterNotenV ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
                    <input type="checkbox" checked={filterNotenV} onChange={e => setFilterNotenV(e.target.checked)} className="accent-[#C4973A]" />
                    <span className={`font-sans text-sm ${filterNotenV ? 'text-accent-gold' : 'text-text-secondary'}`}>Violinschlüssel</span>
                  </label>
                  <label className={`flex items-center gap-2.5 px-3 py-2 border cursor-pointer transition-colors ${filterNotenG ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
                    <input type="checkbox" checked={filterNotenG} onChange={e => setFilterNotenG(e.target.checked)} className="accent-[#C4973A]" />
                    <span className={`font-sans text-sm ${filterNotenG ? 'text-accent-gold' : 'text-text-secondary'}`}>Griffschrift</span>
                  </label>
                </div>
              </div>

              {/* Lernstatus */}
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Lernstatus</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {([['all', 'Alle'], ['learned', 'Gelernt'], ['unlearned', 'Offen']] as const).map(([val, lbl]) => (
                    <button key={val} onClick={() => setFilterLearned(val)} className={`font-sans text-xs px-2 py-2 border transition-colors ${filterLearned === val ? (val === 'learned' ? 'border-green-600 bg-green-600 text-white' : 'border-dark bg-dark text-white') : 'border-border text-text-secondary hover:border-dark'}`}>{lbl}</button>
                  ))}
                </div>
              </div>
              {/* Level */}
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Level</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['free', 'starter', 'pro'] as const).map(lvl => (
                    <button key={lvl} onClick={() => setFilterLevel(prev => prev === lvl ? null : lvl)} className={`font-sans text-xs px-2 py-2 border transition-colors ${filterLevel === lvl ? 'border-accent-gold bg-accent-gold text-white' : 'border-border text-text-secondary hover:border-dark'}`}>{planLabels[lvl]}</button>
                  ))}
                </div>
              </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Results ── */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <p className="font-sans text-sm text-text-secondary">
                  {filtered.length} Ergebnis{filtered.length !== 1 ? 'se' : ''}
                </p>
                {activeFilterCount > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {filterInst !== 'Alle' && <span className="font-sans text-xs px-2 py-0.5 bg-dark text-white">{filterInst}</span>}
                    {filterArt && (
                      <span className="font-sans text-xs px-2 py-0.5 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                        {filterArt === 'volkstuemlich' ? 'Volkstümlich' : 'Bekannte Melodie'}
                      </span>
                    )}
                    {filterStyleTag && <span className="font-sans text-xs px-2 py-0.5 bg-accent-gold text-white">{filterStyleTag}</span>}
                    {filterTakt && <span className="font-sans text-xs px-2 py-0.5 bg-dark text-white">{filterTakt}</span>}
                    {filterGenreTag && <span className="font-sans text-xs px-2 py-0.5 bg-dark text-white">{filterGenreTag}</span>}
                    {filterNotenV && <span className="font-sans text-xs px-2 py-0.5 bg-border text-text-secondary">Violinschlüssel</span>}
                    {filterNotenG && <span className="font-sans text-xs px-2 py-0.5 bg-border text-text-secondary">Griffschrift</span>}
                    {filterLearned !== 'all' && <span className={`font-sans text-xs px-2 py-0.5 ${filterLearned === 'learned' ? 'bg-green-600 text-white' : 'bg-dark text-white'}`}>{filterLearned === 'learned' ? 'Gelernt' : 'Offen'}</span>}
                    {filterLevel && <span className="font-sans text-xs px-2 py-0.5 bg-accent-gold text-white">{planLabels[filterLevel]}</span>}
                  </div>
                )}
              </div>

              {/* Horizontal list */}
              <div className="flex flex-col gap-3">
                {filtered.map((v, i) => renderResultCard(v, i))}

                {/* Bereits gewünschte Stücke (noch kein Video) — In Bearbeitung */}
                {wishMatches.map((w, i) => (
                  <motion.div
                    key={`wish-${w.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 0.6, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-surface border border-dashed border-border overflow-hidden flex flex-col sm:flex-row select-none"
                  >
                    <div className="relative w-full h-32 sm:h-auto sm:w-52 flex-shrink-0 sm:self-stretch bg-dark/5 flex items-center justify-center sm:min-h-[96px]">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <div className="flex-1 p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 min-w-0">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-sm leading-snug text-text-secondary">{w.title}</h4>
                        {w.composer && <p className="font-sans text-xs text-text-secondary mb-2">Komponist / Interpret: {w.composer}</p>}
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(w.votes).map(opt => (
                            <span key={opt} className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">{opt}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0 border-t sm:border-t-0 border-border pt-3 sm:pt-0">
                        <span className="font-sans text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 whitespace-nowrap">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                          In Bearbeitung
                        </span>
                        <span className="sm:mt-auto font-sans text-xs text-text-secondary">Bald verfügbar</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filtered.length === 0 && wishMatches.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-heading font-bold text-lg mb-2">Keine Ergebnisse gefunden</p>
                  <p className="font-sans text-sm text-text-secondary mb-4">Versuche andere Filtereinstellungen oder durchsuche alle Stücke.</p>
                  <button onClick={resetAll} className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors">
                    Alle Filter zurücksetzen
                  </button>
                </div>
              )}
            </div>
          </div>
          </>
        )}

        {tab === 'merkliste' && (
          <div>
            <div className="mb-4">
              <h2 className="font-heading font-bold text-xl">Merkliste</h2>
              <p className="font-sans text-sm text-text-secondary mt-0.5">Deine gemerkten Stücke ({savedVideos.length}).</p>
            </div>
            {savedVideos.length > 0 ? (
              <div className="flex flex-col gap-3">
                {savedVideos.map((v, i) => renderResultCard(v, i))}
              </div>
            ) : (
              <div className="text-center py-16 bg-surface border border-border">
                <p className="font-heading font-bold text-lg mb-2">Noch keine Stücke gemerkt</p>
                <p className="font-sans text-sm text-text-secondary mb-4">Tippe bei einem Stück auf das Herz, um es zur Merkliste hinzuzufügen.</p>
                <button onClick={() => setTab('datenbank')} className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors">Stücke durchsuchen</button>
              </div>
            )}
          </div>
        )}

        {tab === 'wuensche' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-bold text-xl">Stückwünsche</h2>
                <p className="font-sans text-sm text-text-secondary mt-1">Like Stücke, die du dir als Lernvideo wünschst. Sobald ein Stück produziert wird, erhältst du eine Benachrichtigung.</p>
              </div>
              <button onClick={() => setShowWishForm(!showWishForm)} className="bg-accent-gold text-white font-sans text-sm px-4 py-2 hover:bg-accent-warm transition-colors flex-shrink-0">
                + Neuer Wunsch
              </button>
            </div>

            <AnimatePresence>
              {showWishForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                  <div className="bg-surface border border-accent-gold/30 p-6 space-y-4">
                    <h3 className="font-heading font-bold text-sm">Stückwunsch erfassen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Titel des Stückes *</label>
                        <input value={wishTitle} onChange={e => setWishTitle(e.target.value)} placeholder="z.B. Dr Alperose" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark" />
                      </div>
                      <div>
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Komponist / Interpret <span className="normal-case tracking-normal text-text-secondary/70">(optional)</span></label>
                        <input value={wishComposer} onChange={e => setWishComposer(e.target.value)} placeholder="z.B. Willi Valotti" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark" />
                      </div>
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Dein Like für * <span className="normal-case tracking-normal text-text-secondary/70">(mehrere möglich)</span></label>
                      <div className="space-y-3">
                        {WISH_VOTE_GROUPS.map(group => (
                          <div key={group.label}>
                            <p className="font-sans text-[10px] uppercase tracking-widest text-accent-gold mb-1.5">{group.label}</p>
                            <div className="flex flex-wrap gap-2">
                              {group.options.map(opt => {
                                const active = wishVoteSel.includes(opt)
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => toggleWishVoteSel(opt)}
                                    className={`font-sans text-xs px-3 py-1.5 border transition-colors ${active ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-text-primary'}`}
                                  >
                                    {active ? '✓ ' : ''}{opt}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={submitWish} disabled={!wishTitle.trim() || wishVoteSel.length === 0} className="bg-accent-gold text-white font-sans text-sm px-5 py-2 hover:bg-accent-warm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Wunsch einreichen</button>
                      <button onClick={() => setShowWishForm(false)} className="border border-border font-sans text-sm px-4 py-2 hover:border-dark transition-colors">Abbrechen</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suche */}
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                value={wishSearch}
                onChange={e => setWishSearch(e.target.value)}
                type="text"
                placeholder="Stückwünsche durchsuchen (Titel, Komponist / Interpret)…"
                className="w-full border border-border pl-9 pr-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
              />
            </div>

            <p className="font-sans text-xs text-text-secondary mb-3">Sortiert nach Anzahl Likes pro Stück (Gesamttotal aller Optionen).</p>
            <div className="space-y-3">
              {filteredWishes.map(w => {
                const isOpen = expandedWishes.has(w.id)
                return (
                <div key={w.id} className="bg-surface border border-border">
                  {/* Kopfzeile — klappt per Klick (Abstimmen / Chevron) die Liste auf */}
                  <button
                    onClick={() => toggleWishExpand(w.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-sm">{w.title}</h4>
                      {w.composer && <p className="font-sans text-xs text-text-secondary">Komponist / Interpret: {w.composer}</p>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="flex items-center gap-1.5 font-sans text-xs px-2.5 py-1 border border-border bg-background text-text-secondary whitespace-nowrap">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-accent-gold"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                        <span className="font-bold tabular-nums">{wishTotal(w)}</span>
                      </span>
                      <span className="flex items-center gap-1 font-sans text-xs font-medium text-accent-gold">
                        Abstimmen
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
                      </span>
                    </div>
                  </button>

                  {/* Like vergeben — gruppiert nach Stimmen, Mehrfachauswahl */}
                  <AnimatePresence initial={false}>
                  {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="px-5 pb-5 pt-3 border-t border-border">
                    <p className="font-sans text-[10px] uppercase tracking-wider text-text-secondary mb-2.5">Like vergeben — Mehrfachauswahl möglich</p>
                    <div className="space-y-3">
                      {WISH_VOTE_GROUPS.map(group => {
                        // Reihenfolge: abgeschlossene Wünsche (bereits vorhanden) zuerst,
                        // danach nach Anzahl Stimmen (Likes) absteigend.
                        const sortedOptions = [...group.options].sort((a, b) => {
                          const aDone = w.available.includes(a)
                          const bDone = w.available.includes(b)
                          if (aDone !== bDone) return aDone ? -1 : 1
                          return wishOptVotes(w, b) - wishOptVotes(w, a)
                        })
                        return (
                        <div key={group.label}>
                          <p className="font-sans text-[10px] uppercase tracking-widest text-accent-gold mb-1.5">{group.label}</p>
                          <div className="flex flex-wrap gap-2">
                            {sortedOptions.map(opt => {
                              if (w.available.includes(opt)) {
                                return (
                                  <span key={opt} className="flex items-center gap-1.5 font-sans text-xs px-2.5 py-1.5 border border-green-200 bg-green-50 text-green-700">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    {opt} · bereits vorhanden
                                  </span>
                                )
                              }
                              const voted = !!wishVotes[voteKey(w.id, opt)]
                              return (
                                <button
                                  key={opt}
                                  onClick={() => toggleWishVote(w.id, opt)}
                                  className={`flex items-center gap-1.5 font-sans text-xs px-2.5 py-1.5 border transition-colors ${voted ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-border text-text-secondary hover:border-dark hover:text-text-primary'}`}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill={voted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                                  {opt}
                                  <span className="font-bold tabular-nums">{wishOptVotes(w, opt)}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        )
                      })}
                    </div>
                  </div>
                  </motion.div>
                  )}
                  </AnimatePresence>
                </div>
                )
              })}
              {filteredWishes.length === 0 && (
                <p className="font-sans text-sm text-text-secondary text-center py-10">Keine Stückwünsche gefunden.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
