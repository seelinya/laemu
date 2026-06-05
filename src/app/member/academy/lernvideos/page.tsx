'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { mockUserAbo, isPieceUnlocked, individualPlanMeta } from '@/lib/academy'

// ─── Data ────────────────────────────────────────────────────────────────────

const videos = [
  {
    id: 1, title: 'Dr Alperose', artist: 'Willi Valotti', instrument: 'Handorgel', formation: 'Trio',
    composer: 'Valotti', year: 1978, difficultyNum: 3, level: 2, taktart: 'Walzer',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'starter' as const,
    styleTags: ['Urchig', 'Innerschwyzer Stil', 'Zweistimmig'], melodieTags: [] as string[],
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
    styleTags: ['Konzertant', 'Büntner Stil'], melodieTags: [] as string[],
    autoTags: ['Bassgeige', 'Pro'],
    notesAvailable: { violinschluessel: true, griffschrift: true },
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80',
    price: 18, purchased: true,
  },
  {
    id: 7, title: 'Stille Nacht', artist: 'Verschiedene Kapellen', instrument: 'Handorgel', formation: 'Trio',
    composer: 'Franz Xaver Gruber', year: 1818, difficultyNum: 1, level: 1, taktart: null,
    artDesStückes: 'bekannte_melodie' as const, difficultyPlan: 'free' as const,
    styleTags: [], melodieTags: ['Weihnachtslied', 'Zweistimmig'],
    autoTags: ['Handorgel', 'Free', 'Bekannte Melodie'],
    notesAvailable: { violinschluessel: true, griffschrift: false },
    img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&q=80',
    price: 0, purchased: true,
  },
]

const savedVideoIds = new Set([1, 5, 7])

const mockPlaylist = [
  { id: 'p1', title: '1. Stimme — Einführung & Takt 1–8', piece: 'Dr Alperose', duration: '12 Min.' },
  { id: 'p2', title: '1. Stimme — Takt 9–16 mit Übergängen', piece: 'Dr Alperose', duration: '14 Min.' },
  { id: 'p3', title: '1. Stimme SÖ — Einführung', piece: 'Ländler im Dreivierteltakt', duration: '13 Min.' },
  { id: 'p4', title: 'Bassbegleitung — Grundrhythmus', piece: 'Walzer am See', duration: '9 Min.' },
  { id: 'p5', title: 'Vorspielen — ganzes Stück', piece: 'Stille Nacht', duration: '3:42' },
]

type Wish = { id: number; title: string; composer?: string; instruments: string[]; votesByInstrument: Record<string, number>; status: string }

const initialWishes: Wish[] = [
  { id: 1, title: 'S Röseli', composer: 'Trad.', instruments: ['Handorgel', 'Schwyzerörgeli'], votesByInstrument: { Handorgel: 14, Schwyzerörgeli: 9 }, status: 'offen' },
  { id: 2, title: 'Märzenschnee-Ländler', instruments: ['Schwyzerörgeli'], votesByInstrument: { Schwyzerörgeli: 17 }, status: 'offen' },
  { id: 3, title: 'Luzerner Polka', composer: 'R. Suter', instruments: ['Klarinette', 'Handorgel'], votesByInstrument: { Klarinette: 28, Handorgel: 13 }, status: 'in Produktion' },
]

// ─── Constants ───────────────────────────────────────────────────────────────

const INSTRUMENTS = ['Alle', 'Schwyzerörgeli', 'Handorgel', 'Bassgeige', 'Klavierbegleitung', 'Klarinette']
const TAKTARTEN_FILTER = ['Schottisch', 'Ländler', 'Walzer', 'Mazurka', 'Polka', 'Schnellpolka', 'Stümpäli', 'Lead', 'Marsch']
const VOLKSTUEMLICH_TAGS = ['Urchig', 'Modern', 'Konzertant', 'Illgauer Stil', 'Innerschwyzer Stil', 'Berner Stil', 'Büntner Stil', 'Zweistimmig']
const BEKANNTE_TAGS = ['Schlager', 'Kinderlied', 'Weihnachtslied', 'Zweistimmig', 'Pop', 'Rock']
const PLANS = ['Alle', 'Free', 'Starter', 'Pro']

const planColors: Record<string, string> = {
  free: 'bg-border/60 text-text-secondary',
  starter: 'bg-accent-gold/10 text-accent-gold border border-accent-gold/30',
  pro: 'bg-dark/10 text-dark border border-dark/20',
}
const planLabels: Record<string, string> = { free: 'Free', starter: 'Starter', pro: 'Pro' }

// ─── Types ───────────────────────────────────────────────────────────────────

type ArtFilter = 'volkstuemlich' | 'bekannte_melodie'

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LernvideosPage() {
  const [search, setSearch] = useState('')
  const [filterInst, setFilterInst] = useState('Alle')
  const [filterArt, setFilterArt] = useState<ArtFilter[]>([])
  const [filterTakt, setFilterTakt] = useState<string | null>(null)
  const [filterStyleTag, setFilterStyleTag] = useState<string | null>(null)
  const [filterGenreTag, setFilterGenreTag] = useState<string | null>(null)
  const [filterPlan, setFilterPlan] = useState('Alle')
  const [filterNotenV, setFilterNotenV] = useState(false)
  const [filterNotenG, setFilterNotenG] = useState(false)
  const [filterSaved, setFilterSaved] = useState(false)
  const [tab, setTab] = useState<'datenbank' | 'wuensche'>('datenbank')
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showAdvancedDesktop, setShowAdvancedDesktop] = useState(true)
  const [showWishForm, setShowWishForm] = useState(false)
  const [wishes, setWishes] = useState<Wish[]>(initialWishes)
  // Eigene Stimmen pro Stück & Instrument, Schlüssel `${wishId}:${instrument}`.
  const [wishVotes, setWishVotes] = useState<Record<string, boolean>>({})
  const [wishTitle, setWishTitle] = useState('')
  const [wishComposer, setWishComposer] = useState('')
  const [wishInstruments, setWishInstruments] = useState<string[]>(['Handorgel'])
  const [wishSearch, setWishSearch] = useState('')
  const [wishFilterInst, setWishFilterInst] = useState('Alle')

  const voteKey = (id: number, inst: string) => `${id}:${inst}`
  const wishInstVotes = (w: Wish, inst: string) => (w.votesByInstrument[inst] ?? 0) + (wishVotes[voteKey(w.id, inst)] ? 1 : 0)
  const toggleWishVote = (id: number, inst: string) =>
    setWishVotes(prev => ({ ...prev, [voteKey(id, inst)]: !prev[voteKey(id, inst)] }))

  const toggleWishInstrument = (inst: string) =>
    setWishInstruments(prev => prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst])

  const submitWish = () => {
    if (!wishTitle.trim() || wishInstruments.length === 0) return
    const id = Date.now()
    const votesByInstrument: Record<string, number> = {}
    wishInstruments.forEach(i => { votesByInstrument[i] = 1 })
    const newWish: Wish = {
      id,
      title: wishTitle.trim(),
      composer: wishComposer.trim() || undefined,
      instruments: [...wishInstruments],
      votesByInstrument,
      status: 'offen',
    }
    setWishes(prev => [newWish, ...prev])
    setWishVotes(prev => { const n = { ...prev }; wishInstruments.forEach(i => { n[voteKey(id, i)] = true }); return n })
    setWishTitle(''); setWishComposer(''); setWishInstruments(['Handorgel']); setShowWishForm(false)
  }

  // Relevanz: nach Instrumentenfilter die Stimmen für dieses Instrument, sonst
  // das Instrument mit den meisten Likes (= meiste Likes pro Instrument).
  const wishRelevance = (w: Wish) =>
    wishFilterInst === 'Alle'
      ? Math.max(0, ...w.instruments.map(i => wishInstVotes(w, i)))
      : wishInstVotes(w, wishFilterInst)

  const filteredWishes = wishes
    .filter(w => {
      const q = wishSearch.trim().toLowerCase()
      const matchesSearch = !q || w.title.toLowerCase().includes(q) || (w.composer ?? '').toLowerCase().includes(q)
      const matchesInst = wishFilterInst === 'Alle' || w.instruments.includes(wishFilterInst)
      return matchesSearch && matchesInst
    })
    .sort((a, b) => wishRelevance(b) - wishRelevance(a))

  const toggleArt = (val: ArtFilter) => {
    setFilterArt(prev => {
      const next = prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
      if (!next.includes('volkstuemlich')) { setFilterStyleTag(null); setFilterTakt(null) }
      if (!next.includes('bekannte_melodie')) { setFilterGenreTag(null) }
      return next
    })
  }

  const resetAll = () => {
    setSearch(''); setFilterInst('Alle'); setFilterArt([]); setFilterTakt(null)
    setFilterStyleTag(null); setFilterGenreTag(null); setFilterPlan('Alle')
    setFilterNotenV(false); setFilterNotenG(false); setFilterSaved(false)
  }

  const filtered = videos.filter(v => {
    if (filterSaved && !savedVideoIds.has(v.id)) return false
    const q = search.toLowerCase()
    if (q && !v.title.toLowerCase().includes(q) && !v.artist.toLowerCase().includes(q) && !v.composer.toLowerCase().includes(q) && !v.autoTags.some(t => t.toLowerCase().includes(q))) return false
    if (filterInst !== 'Alle' && v.instrument !== filterInst) return false
    if (filterArt.length === 1 && v.artDesStückes !== filterArt[0]) return false
    if (filterTakt && v.taktart !== filterTakt) return false
    if (filterStyleTag && !(v.styleTags as string[]).includes(filterStyleTag)) return false
    if (filterGenreTag && !v.melodieTags.includes(filterGenreTag)) return false
    if (filterPlan !== 'Alle' && v.difficultyPlan !== filterPlan.toLowerCase()) return false
    if (filterNotenV && !v.notesAvailable.violinschluessel) return false
    if (filterNotenG && !v.notesAvailable.griffschrift) return false
    return true
  })

  // Bereits gewünschte Stücke, zu denen es noch kein Video gibt: bei der Suche
  // ausgegraut mit Tag "In Bearbeitung" anzeigen.
  const wishMatches = (() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return wishes.filter(w =>
      (w.title.toLowerCase().includes(q) || (w.composer ?? '').toLowerCase().includes(q)) &&
      (filterInst === 'Alle' || w.instruments.includes(filterInst)) &&
      !videos.some(v => v.title.toLowerCase() === w.title.toLowerCase()),
    )
  })()

  const activeFilterCount = [
    filterInst !== 'Alle', filterArt.length > 0, filterTakt !== null,
    filterStyleTag !== null, filterGenreTag !== null,
    filterPlan !== 'Alle', filterNotenV, filterNotenG, filterSaved,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/member/academy" className="font-sans text-sm text-text-secondary hover:text-dark transition-colors">← Musikschule</Link>
          <h1 className="font-heading font-bold text-lg">Lernvideo-Datenbank</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterSaved(!filterSaved)}
            className={`font-sans text-xs px-3 py-1.5 border transition-colors flex items-center gap-1.5 ${filterSaved ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill={filterSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Gespeichert ({savedVideoIds.size})
          </button>
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`font-sans text-xs px-3 py-1.5 border transition-colors flex items-center gap-1.5 ${showPlaylist ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>
            Meine Playlist ({mockPlaylist.length})
          </button>
          <Link href="/member/academy/lernvideos/upload" className="font-sans text-xs px-3 py-1.5 border border-border hover:border-dark text-text-secondary hover:text-dark transition-colors flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Stück hochladen
          </Link>
        </div>
      </div>

      {/* Playlist panel */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-dark text-white"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <p className="font-sans text-xs uppercase tracking-widest text-white/40">Meine Playlist</p>
                  <button className="font-sans text-xs px-3 py-1 bg-accent-gold text-white hover:bg-accent-warm transition-colors flex items-center gap-1.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Alle abspielen
                  </button>
                </div>
                <button onClick={() => setShowPlaylist(false)} className="text-white/30 hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {mockPlaylist.map((item, i) => (
                  <div key={item.id} className="flex-shrink-0 bg-white/5 border border-white/10 p-3 w-52 hover:border-accent-gold/40 transition-colors group cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-sans text-[10px] text-white/30 tabular-nums">{i + 1}</span>
                      <span className="font-sans text-[10px] text-white/30">{item.duration}</span>
                    </div>
                    <p className="font-sans text-xs text-white leading-snug mb-0.5 group-hover:text-accent-gold transition-colors">{item.title}</p>
                    <p className="font-sans text-[10px] text-white/40">{item.piece}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          <button onClick={() => setTab('datenbank')} className={`px-6 py-3 font-sans text-sm font-medium transition-colors border-b-2 -mb-px ${tab === 'datenbank' ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}>
            Lernvideos durchsuchen
          </button>
          <button onClick={() => setTab('wuensche')} className={`px-6 py-3 font-sans text-sm font-medium transition-colors border-b-2 -mb-px ${tab === 'wuensche' ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}>
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
                  Erweiterte Suche
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
                            const active = filterArt.includes(val)
                            return (
                              <div key={val}>
                                <button onClick={() => toggleArt(val)} className={`w-full p-3 border text-left transition-colors flex items-start justify-between gap-2 ${active ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
                                  <div>
                                    <p className={`font-sans text-sm font-medium ${active ? 'text-accent-gold' : ''}`}>{label}</p>
                                    <p className="font-sans text-xs text-text-secondary leading-snug">{desc}</p>
                                  </div>
                                  <div className={`w-4 h-4 border flex-shrink-0 mt-0.5 flex items-center justify-center ${active ? 'bg-accent-gold border-accent-gold' : 'border-border'}`}>
                                    {active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                  </div>
                                </button>
                                <AnimatePresence>
                                  {active && val === 'volkstuemlich' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                      <div className="border border-t-0 border-accent-gold/20 bg-background px-3 py-3 space-y-3">
                                        <div>
                                          <p className="font-sans text-[10px] uppercase tracking-widest text-accent-gold mb-2">Stil</p>
                                          <div className="flex flex-wrap gap-1">
                                            {VOLKSTUEMLICH_TAGS.map(t => (
                                              <button key={t} onClick={() => setFilterStyleTag(prev => prev === t ? null : t)} className={`font-sans text-[10px] px-2 py-1 border transition-colors ${filterStyleTag === t ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-border text-text-secondary hover:border-dark'}`}>{t}</button>
                                            ))}
                                          </div>
                                        </div>
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
                      {/* Abonnementstufe */}
                      <div>
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Abonnementstufe</label>
                        <div className="flex gap-1">
                          {PLANS.map(p => (
                            <button key={p} onClick={() => setFilterPlan(p)} className={`flex-1 py-2 font-sans text-xs border transition-colors ${filterPlan === p ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark'}`}>{p}</button>
                          ))}
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
                className="w-full flex items-center justify-between font-sans text-xs text-text-secondary hover:text-dark transition-colors border-b border-border pb-2"
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
                    const active = filterArt.includes(val)
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
                                  <p className="font-sans text-[10px] uppercase tracking-widest text-accent-gold mb-2">Stil</p>
                                  <div className="flex flex-wrap gap-1">
                                    {VOLKSTUEMLICH_TAGS.map(t => (
                                      <button
                                        key={t}
                                        onClick={() => setFilterStyleTag(prev => prev === t ? null : t)}
                                        className={`font-sans text-[10px] px-2 py-1 border transition-colors ${filterStyleTag === t ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-border text-text-secondary hover:border-dark'}`}
                                      >
                                        {t}
                                      </button>
                                    ))}
                                  </div>
                                </div>
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

              {/* Abonnementstufe */}
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Abonnementstufe</label>
                <div className="flex gap-1">
                  {PLANS.map(p => (
                    <button
                      key={p}
                      onClick={() => setFilterPlan(p)}
                      className={`flex-1 py-2 font-sans text-xs border transition-colors ${filterPlan === p ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark'}`}
                    >
                      {p}
                    </button>
                  ))}
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Results ── */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <p className="font-sans text-sm text-text-secondary">
                  {filtered.length} Lernvideo{filtered.length !== 1 ? 's' : ''}
                  {filterSaved && <span className="ml-1.5 font-sans text-xs px-2 py-0.5 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">Gespeichert</span>}
                </p>
                {activeFilterCount > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {filterInst !== 'Alle' && <span className="font-sans text-xs px-2 py-0.5 bg-dark text-white">{filterInst}</span>}
                    {filterArt.map(a => (
                      <span key={a} className="font-sans text-xs px-2 py-0.5 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                        {a === 'volkstuemlich' ? 'Volkstümlich' : 'Bekannte Melodie'}
                      </span>
                    ))}
                    {filterStyleTag && <span className="font-sans text-xs px-2 py-0.5 bg-accent-gold text-white">{filterStyleTag}</span>}
                    {filterTakt && <span className="font-sans text-xs px-2 py-0.5 bg-dark text-white">{filterTakt}</span>}
                    {filterGenreTag && <span className="font-sans text-xs px-2 py-0.5 bg-dark text-white">{filterGenreTag}</span>}
                    {filterPlan !== 'Alle' && <span className="font-sans text-xs px-2 py-0.5 bg-dark text-white">{filterPlan}</span>}
                    {filterNotenV && <span className="font-sans text-xs px-2 py-0.5 bg-border text-text-secondary">Violinschlüssel</span>}
                    {filterNotenG && <span className="font-sans text-xs px-2 py-0.5 bg-border text-text-secondary">Griffschrift</span>}
                  </div>
                )}
              </div>

              {/* Abo / Freischalt-Hinweis */}
              <div className="mb-4 bg-accent-gold/5 border border-accent-gold/30 px-4 py-3 flex items-start gap-3">
                {mockUserAbo.plan !== 'none' ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
                    <p className="font-sans text-xs text-text-secondary leading-relaxed">
                      Dein Abo: <strong className="text-dark font-semibold">{individualPlanMeta[mockUserAbo.plan].label}{mockUserAbo.instruments.length > 0 ? ` · ${mockUserAbo.instruments.join(', ')}` : ''}</strong>. Die komplette Lernvideo-Datenbank ist freigeschaltet — alle Stücke inkl. JamPlayer und Stimmen-Videos, da du Zugang zu einem Lehrgang hast.
                    </p>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    <p className="font-sans text-xs text-text-secondary leading-relaxed">
                      Aktuell sind nur Free-Stücke verfügbar. Sobald du Zugang zu einem Lehrgang hast, ist die <strong className="text-dark font-semibold">komplette Lernvideo-Datenbank</strong> freigeschaltet.{' '}
                      <Link href="/member/academy" className="text-accent-gold font-medium hover:underline">Lehrgang freischalten →</Link>
                    </p>
                  </>
                )}
              </div>

              {/* Horizontal list */}
              <div className="flex flex-col gap-3">
                {filtered.map((v, i) => {
                  const unlocked = isPieceUnlocked({ plan: v.difficultyPlan, instrument: v.instrument })
                  return (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-surface border border-border overflow-hidden group hover:border-dark transition-colors flex"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-40 sm:w-52 flex-shrink-0 self-stretch">
                      <Image src={v.img} alt={v.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-9 h-9 bg-accent-gold flex items-center justify-center">
                          <span className="text-white ml-0.5 text-sm">▶</span>
                        </div>
                      </div>
                      {/* Instrument tag */}
                      <div className="absolute bottom-2 left-2">
                        <span className="font-sans text-[10px] bg-black/60 text-white px-1.5 py-0.5">{v.instrument}</span>
                      </div>
                      {savedVideoIds.has(v.id) && (
                        <div className="absolute top-2 left-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#C4973A" stroke="#C4973A" strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
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
                    <div className="flex-1 p-4 flex gap-4 min-w-0">
                      <div className="flex-1 min-w-0">
                        {/* Title row */}
                        <div className="flex items-start gap-2 mb-1">
                          <h4 className="font-heading font-bold text-sm group-hover:text-accent-gold transition-colors leading-snug">{v.title}</h4>
                          {v.taktart && (
                            <span className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary flex-shrink-0 mt-0.5">{v.taktart}</span>
                          )}
                        </div>
                        <p className="font-sans text-xs text-text-secondary mb-2">{v.artist} · {v.year}</p>

                        {/* Difficulty */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 6 }).map((_, j) => (
                              <div key={j} className={`w-2 h-1.5 ${j < v.difficultyNum ? 'bg-accent-gold' : 'bg-border'}`} />
                            ))}
                          </div>
                          <span className="font-sans text-[10px] text-text-secondary">Stufe {v.level}</span>
                        </div>

                        {/* Tags row */}
                        <div className="flex flex-wrap gap-1">
                          {v.styleTags.slice(0, 3).map(t => (
                            <span key={t} className="font-sans text-[10px] px-1.5 py-0.5 bg-accent-gold/8 border border-accent-gold/20 text-accent-gold">{t}</span>
                          ))}
                          {v.melodieTags.slice(0, 2).map(t => (
                            <span key={t} className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">{t}</span>
                          ))}
                          {/* Notes badges */}
                          {v.notesAvailable.violinschluessel && (
                            <span className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">♩ Violin</span>
                          )}
                          {v.notesAvailable.griffschrift && (
                            <span className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">♩ Griff</span>
                          )}
                        </div>
                      </div>

                      {/* Right: plan badge + action */}
                      <div className="flex flex-col items-end justify-between flex-shrink-0">
                        <div className="flex flex-col items-end gap-1">
                          <span className={`font-sans text-[10px] px-1.5 py-0.5 font-semibold ${planColors[v.difficultyPlan]}`}>
                            {planLabels[v.difficultyPlan]}
                          </span>
                          {!unlocked && (
                            <span className="font-sans text-[10px] px-1.5 py-0.5 bg-dark/10 text-text-secondary flex items-center gap-1">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                              Gesperrt
                            </span>
                          )}
                        </div>
                        <div className="mt-auto">
                          <Link href={`/member/academy/lernvideos/${v.id}`} className={`block font-sans text-xs px-3 py-1.5 transition-colors whitespace-nowrap ${unlocked ? 'bg-dark text-white hover:bg-accent-gold' : 'border border-border text-text-secondary hover:border-dark'}`}>
                            {unlocked ? 'Öffnen →' : 'Master-Video →'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  )
                })}

                {/* Bereits gewünschte Stücke (noch kein Video) — In Bearbeitung */}
                {wishMatches.map((w, i) => (
                  <motion.div
                    key={`wish-${w.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 0.6, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-surface border border-dashed border-border overflow-hidden flex select-none"
                  >
                    <div className="relative w-40 sm:w-52 flex-shrink-0 self-stretch bg-dark/5 flex items-center justify-center min-h-[96px]">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <div className="flex-1 p-4 flex gap-4 min-w-0">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-sm leading-snug text-text-secondary">{w.title}</h4>
                        {w.composer && <p className="font-sans text-xs text-text-secondary mb-2">Komponist: {w.composer}</p>}
                        <div className="flex flex-wrap gap-1">
                          {w.instruments.map(inst => (
                            <span key={inst} className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">{inst}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between flex-shrink-0">
                        <span className="font-sans text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 whitespace-nowrap">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                          In Bearbeitung
                        </span>
                        <span className="mt-auto font-sans text-xs text-text-secondary">Bald verfügbar</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filtered.length === 0 && wishMatches.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-heading font-bold text-lg mb-2">Keine Lernvideos gefunden</p>
                  <p className="font-sans text-sm text-text-secondary mb-4">Versuche andere Filtereinstellungen oder durchsuche die gesamte Datenbank.</p>
                  <button onClick={resetAll} className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors">
                    Alle Filter zurücksetzen
                  </button>
                </div>
              )}
            </div>
          </div>
          </>
        )}

        {tab === 'wuensche' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading font-bold text-xl">Stückwünsche</h2>
                <p className="font-sans text-sm text-text-secondary mt-1">Stimme für Stücke, die du als Lernvideo wünschst. Sobald ein Stück produziert wird, erhältst du eine Benachrichtigung.</p>
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
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Komponist <span className="normal-case tracking-normal text-text-secondary/70">(optional)</span></label>
                        <input value={wishComposer} onChange={e => setWishComposer(e.target.value)} placeholder="z.B. Willi Valotti" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark" />
                      </div>
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Instrumente * <span className="normal-case tracking-normal text-text-secondary/70">(mehrere möglich)</span></label>
                      <div className="flex flex-wrap gap-2">
                        {INSTRUMENTS.filter(i => i !== 'Alle').map(i => {
                          const active = wishInstruments.includes(i)
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => toggleWishInstrument(i)}
                              className={`font-sans text-xs px-3 py-1.5 border transition-colors ${active ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
                            >
                              {active ? '✓ ' : ''}{i}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={submitWish} disabled={!wishTitle.trim() || wishInstruments.length === 0} className="bg-accent-gold text-white font-sans text-sm px-5 py-2 hover:bg-accent-warm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Wunsch einreichen</button>
                      <button onClick={() => setShowWishForm(false)} className="border border-border font-sans text-sm px-4 py-2 hover:border-dark transition-colors">Abbrechen</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suche & Instrumentenfilter */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input
                  value={wishSearch}
                  onChange={e => setWishSearch(e.target.value)}
                  type="text"
                  placeholder="Stückwünsche durchsuchen (Titel, Komponist)…"
                  className="w-full border border-border pl-9 pr-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                />
              </div>
              <select
                value={wishFilterInst}
                onChange={e => setWishFilterInst(e.target.value)}
                className="border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
              >
                {INSTRUMENTS.map(i => <option key={i} value={i}>{i === 'Alle' ? 'Alle Instrumente' : i}</option>)}
              </select>
            </div>

            <p className="font-sans text-xs text-text-secondary mb-3">
              Sortiert nach Relevanz — {wishFilterInst === 'Alle' ? 'die meisten Stimmen pro Instrument' : `Stimmen für ${wishFilterInst}`}.
            </p>
            <div className="space-y-3">
              {filteredWishes.map(w => (
                <div key={w.id} className="bg-surface border border-border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-sm">{w.title}</h4>
                      {w.composer && <p className="font-sans text-xs text-text-secondary">Komponist: {w.composer}</p>}
                    </div>
                    <span className={`font-sans text-xs px-2 py-1 border flex-shrink-0 ${w.status === 'in Produktion' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-border/50 text-text-secondary border-border'}`}>
                      {w.status === 'in Produktion' ? '🎬 In Produktion' : '📋 Offen'}
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="font-sans text-[10px] uppercase tracking-wider text-text-secondary mb-1.5">Stimme abgeben — für welches Instrument?</p>
                    <div className="flex flex-wrap gap-2">
                      {w.instruments.map(inst => {
                        const voted = !!wishVotes[voteKey(w.id, inst)]
                        const count = wishInstVotes(w, inst)
                        return (
                          <button
                            key={inst}
                            onClick={() => toggleWishVote(w.id, inst)}
                            className={`flex items-center gap-1.5 font-sans text-xs px-2.5 py-1.5 border transition-colors ${voted ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill={voted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                            {inst}
                            <span className="font-bold tabular-nums">{count}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
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
