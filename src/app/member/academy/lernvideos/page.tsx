'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Data ────────────────────────────────────────────────────────────────────

const videos = [
  {
    id: 1, title: 'Dr Alperose', artist: 'Willi Valotti', instrument: 'Handorgel', formation: 'Trio',
    composer: 'Valotti', year: 1978, difficultyNum: 3, level: 2, taktart: 'Walzer',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'starter' as const,
    styleTags: ['Urchig', 'Innerschwyzer Stil', 'Zweistimmig'],
    autoTags: ['Handorgel', 'Schwyzerörgeli', 'Starter', 'Grundlagenkurs'],
    notesAvailable: { violinschluessel: true, griffschrift: true },
    img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80',
    price: 18, purchased: true,
  },
  {
    id: 2, title: 'Ländler im Dreivierteltakt', artist: 'Kapelle Hess-Ruedi-Hegner', instrument: 'Schwyzerörgeli',
    formation: 'Kapelle', composer: 'Hess', year: 1995, difficultyNum: 2, level: 1, taktart: 'Ländler',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'starter' as const,
    styleTags: ['Modern', 'Konzertant'],
    autoTags: ['Schwyzerörgeli', 'Starter'],
    notesAvailable: { violinschluessel: true, griffschrift: false },
    img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&q=80',
    price: 18, purchased: false,
  },
  {
    id: 3, title: 'Abendstern-Polka', artist: 'Bodästänix', instrument: 'Handorgel', formation: 'Quartett',
    composer: 'Unbekannt', year: 2003, difficultyNum: 4, level: 3, taktart: 'Polka',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'pro' as const,
    styleTags: ['Urchig', 'Berner Stil'],
    autoTags: ['Handorgel', 'Pro'],
    notesAvailable: { violinschluessel: false, griffschrift: true },
    img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=400&q=80',
    price: 18, purchased: false,
  },
  {
    id: 4, title: 'Innerschwizer Schottisch', artist: 'Trio Rigi', instrument: 'Klarinette', formation: 'Trio',
    composer: 'Müller', year: 1988, difficultyNum: 3, level: 2, taktart: 'Schottisch',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'starter' as const,
    styleTags: ['Innerschwyzer Stil'],
    autoTags: ['Klarinette', 'Starter'],
    notesAvailable: { violinschluessel: false, griffschrift: false },
    img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80',
    price: 18, purchased: false,
  },
  {
    id: 5, title: 'Walzer am See', artist: 'Lisa Frei', instrument: 'Klavier', formation: 'Solo',
    composer: 'Frei', year: 2015, difficultyNum: 2, level: 2, taktart: 'Walzer',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'free' as const,
    styleTags: ['Modern'],
    autoTags: ['Klavier', 'Free'],
    notesAvailable: { violinschluessel: true, griffschrift: false },
    img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80',
    price: 0, purchased: true,
  },
  {
    id: 6, title: 'Bergbach-Mazurka', artist: 'Hess-Rusch-Hegner', instrument: 'Bass', formation: 'Kapelle',
    composer: 'Rusch', year: 1972, difficultyNum: 5, level: 4, taktart: 'Mazurka',
    artDesStückes: 'volkstuemlich' as const, difficultyPlan: 'pro' as const,
    styleTags: ['Konzertant', 'Büntner Stil'],
    autoTags: ['Bass', 'Pro'],
    notesAvailable: { violinschluessel: true, griffschrift: true },
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80',
    price: 18, purchased: false,
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

const wishes = [
  { id: 1, title: 'S Röseli', artist: 'Kapelle Alpstein', instrument: 'Handorgel', votes: 23, voted: false, status: 'offen' },
  { id: 2, title: 'Märzenschnee-Ländler', artist: 'Unbekannt', instrument: 'Schwyzerörgeli', votes: 17, voted: true, status: 'offen' },
  { id: 3, title: 'Luzerner Polka', artist: 'Trio Rigi', instrument: 'Klarinette', votes: 41, voted: false, status: 'in Produktion' },
]

const INSTRUMENTS = ['Alle', 'Handorgel', 'Schwyzerörgeli', 'Klavier', 'Bass', 'Klarinette']
const TAKTARTEN = ['Alle', 'Schottisch', 'Ländler', 'Walzer', 'Mazurka', 'Polka', 'Schnellpolka', 'Stümpäli', 'Lead', 'Marsch']
const PLANS = ['Alle', 'Free', 'Starter', 'Pro']
const ART_OPTIONS = ['Alle', 'Volkstümlich', 'Bekannte Melodie']
const STYLE_TAGS = ['Urchig', 'Modern', 'Konzertant', 'Illgauer Stil', 'Innerschwyzer Stil', 'Berner Stil', 'Büntner Stil', 'Zweistimmig']
const NOTEN_OPTIONS = ['Alle', 'Noten vorhanden', 'Violinschlüssel', 'Griffschrift'] as const
type NotenFilter = typeof NOTEN_OPTIONS[number]

const planColors: Record<string, string> = {
  free: 'bg-border/60 text-text-secondary',
  starter: 'bg-accent-gold/10 text-accent-gold border border-accent-gold/30',
  pro: 'bg-dark/10 text-dark border border-dark/20',
}
const planLabels: Record<string, string> = { free: 'Free', starter: 'Starter', pro: 'Pro' }

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LernvideosPage() {
  const [search, setSearch] = useState('')
  const [filterInst, setFilterInst] = useState('Alle')
  const [filterTakt, setFilterTakt] = useState('Alle')
  const [filterPlan, setFilterPlan] = useState('Alle')
  const [filterArt, setFilterArt] = useState('Alle')
  const [filterStyleTag, setFilterStyleTag] = useState<string | null>(null)
  const [filterNoten, setFilterNoten] = useState<NotenFilter>('Alle')
  const [tab, setTab] = useState<'datenbank' | 'wuensche'>('datenbank')
  const [showWishForm, setShowWishForm] = useState(false)
  const [wishVotes, setWishVotes] = useState<Record<number, boolean>>(
    Object.fromEntries(wishes.map(w => [w.id, w.voted]))
  )
  const [wishTitle, setWishTitle] = useState('')
  const [wishArtist, setWishArtist] = useState('')
  const [wishInst, setWishInst] = useState('Handorgel')

  const filtered = videos.filter(v => {
    const q = search.toLowerCase()
    if (q && !v.title.toLowerCase().includes(q) && !v.artist.toLowerCase().includes(q) && !v.composer.toLowerCase().includes(q) && !v.autoTags.some(t => t.toLowerCase().includes(q))) return false
    if (filterInst !== 'Alle' && v.instrument !== filterInst) return false
    if (filterTakt !== 'Alle' && v.taktart !== filterTakt) return false
    if (filterPlan !== 'Alle' && v.difficultyPlan !== filterPlan.toLowerCase()) return false
    if (filterArt !== 'Alle') {
      if (filterArt === 'Volkstümlich' && v.artDesStückes !== 'volkstuemlich') return false
      if (filterArt === 'Bekannte Melodie' && v.artDesStückes !== 'bekannte_melodie') return false
    }
    if (filterStyleTag) {
      const mel = ('melodieTags' in v ? (v as { melodieTags?: string[] }).melodieTags : undefined) ?? []
      if (!(v.styleTags as string[]).includes(filterStyleTag) && !mel.includes(filterStyleTag)) return false
    }
    if (filterNoten === 'Noten vorhanden' && !v.notesAvailable.violinschluessel && !v.notesAvailable.griffschrift) return false
    if (filterNoten === 'Violinschlüssel' && !v.notesAvailable.violinschluessel) return false
    if (filterNoten === 'Griffschrift' && !v.notesAvailable.griffschrift) return false
    return true
  })

  const activeFilterCount = [
    filterInst !== 'Alle', filterTakt !== 'Alle',
    filterPlan !== 'Alle', filterArt !== 'Alle', filterStyleTag !== null, filterNoten !== 'Alle',
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between sticky top-20 z-20">
        <div className="flex items-center gap-4">
          <Link href="/member/academy" className="font-sans text-sm text-text-secondary hover:text-dark transition-colors">← Musikschule</Link>
          <h1 className="font-heading font-bold text-lg">Lernvideo-Datenbank</h1>
        </div>
        <Link href="/member/academy/lernvideos/upload" className="font-sans text-xs px-3 py-1.5 border border-border hover:border-dark text-text-secondary hover:text-dark transition-colors flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Stück hochladen
        </Link>
      </div>

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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters sidebar */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs uppercase tracking-widest text-text-secondary">Filter</p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setSearch(''); setFilterInst('Alle'); setFilterTakt('Alle'); setFilterPlan('Alle'); setFilterArt('Alle'); setFilterStyleTag(null); setFilterNoten('Alle') }}
                    className="font-sans text-xs text-accent-gold hover:underline"
                  >
                    Zurücksetzen ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Search */}
              <div>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  placeholder="Titel, Interpret, Komponist, Tags..."
                  className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                />
              </div>

              {/* Dropdowns */}
              {([
                { label: 'Instrument', value: filterInst, set: setFilterInst, opts: INSTRUMENTS },
                { label: 'Taktart', value: filterTakt, set: setFilterTakt, opts: TAKTARTEN },
              ]).map(f => (
                <div key={f.label}>
                  <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">{f.label}</label>
                  <select
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                  >
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}

              {/* Plan */}
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Abonnementstufe</label>
                <div className="flex gap-1.5">
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

              {/* Art des Stückes */}
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Art des Stückes</label>
                <div className="space-y-1">
                  {ART_OPTIONS.map(a => (
                    <button
                      key={a}
                      onClick={() => setFilterArt(a)}
                      className={`w-full text-left px-3 py-2 font-sans text-sm border transition-colors ${filterArt === a ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style tags */}
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Stil</label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_TAGS.map(t => (
                    <button
                      key={t}
                      onClick={() => setFilterStyleTag(prev => prev === t ? null : t)}
                      className={`font-sans text-xs px-2.5 py-1 border transition-colors ${filterStyleTag === t ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-border text-text-secondary hover:border-dark'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Noten */}
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Noten</label>
                <div className="space-y-1">
                  {NOTEN_OPTIONS.map(n => (
                    <button
                      key={n}
                      onClick={() => setFilterNoten(n)}
                      className={`w-full text-left px-3 py-2 font-sans text-sm border transition-colors flex items-center justify-between ${filterNoten === n ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
                    >
                      <span>{n}</span>
                      {n === 'Violinschlüssel' && <span className={`font-sans text-[10px] px-1.5 py-0.5 border ${filterNoten === n ? 'border-white/30 text-white/60' : 'border-border text-text-secondary'}`}>♩</span>}
                      {n === 'Griffschrift' && <span className={`font-sans text-[10px] px-1.5 py-0.5 border ${filterNoten === n ? 'border-white/30 text-white/60' : 'border-border text-text-secondary'}`}>𝄞</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <p className="font-sans text-sm text-text-secondary">{filtered.length} Lernvideo{filtered.length !== 1 ? 's' : ''} gefunden</p>
                {activeFilterCount > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {filterInst !== 'Alle' && <span className="font-sans text-xs px-2 py-1 bg-dark text-white">{filterInst}</span>}
                    {filterTakt !== 'Alle' && <span className="font-sans text-xs px-2 py-1 bg-dark text-white">{filterTakt}</span>}

                    {filterPlan !== 'Alle' && <span className="font-sans text-xs px-2 py-1 bg-dark text-white">{filterPlan}</span>}
                    {filterArt !== 'Alle' && <span className="font-sans text-xs px-2 py-1 bg-dark text-white">{filterArt}</span>}
                    {filterStyleTag && <span className="font-sans text-xs px-2 py-1 bg-accent-gold text-white">{filterStyleTag}</span>}
                    {filterNoten !== 'Alle' && <span className="font-sans text-xs px-2 py-1 bg-dark text-white">{filterNoten}</span>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-surface border border-border overflow-hidden group hover:border-dark transition-colors flex flex-col"
                  >
                    <div className="relative aspect-video overflow-hidden flex-shrink-0">
                      <Image src={v.img} alt={v.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-accent-gold flex items-center justify-center">
                          <span className="text-white ml-0.5">▶</span>
                        </div>
                      </div>
                      {/* Overlay tags */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="font-sans text-[10px] bg-black/60 text-white px-1.5 py-0.5">{v.instrument}</span>
                        {v.taktart && <span className="font-sans text-[10px] bg-black/60 text-white px-1.5 py-0.5">{v.taktart}</span>}
                      </div>
                      {/* Plan badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`font-sans text-[10px] px-1.5 py-0.5 font-semibold ${planColors[v.difficultyPlan]}`}>
                          {planLabels[v.difficultyPlan]}
                        </span>
                      </div>
                      {v.purchased && (
                        <div className="absolute bottom-2 right-2 bg-accent-gold text-white text-[10px] px-1.5 py-0.5">✓ Zugänglich</div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-heading font-bold text-sm mb-0.5 group-hover:text-accent-gold transition-colors">{v.title}</h4>
                      <p className="font-sans text-xs text-text-secondary mb-3">{v.artist} · {v.year}</p>

                      {/* Difficulty bar */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 6 }).map((_, j) => (
                            <div key={j} className={`w-2.5 h-1.5 ${j < v.difficultyNum ? 'bg-accent-gold' : 'bg-border'}`} />
                          ))}
                        </div>
                        <span className="font-sans text-[10px] text-text-secondary">Stufe {v.level}</span>
                      </div>

                      {/* Style tags */}
                      {v.styleTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {v.styleTags.slice(0, 3).map(t => (
                            <span key={t} className="font-sans text-[10px] px-1.5 py-0.5 bg-accent-gold/8 border border-accent-gold/20 text-accent-gold">{t}</span>
                          ))}
                          {'melodieTags' in v && (v as { melodieTags?: string[] }).melodieTags?.slice(0, 2).map(t => (
                            <span key={t} className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">{t}</span>
                          ))}
                        </div>
                      )}

                      {/* Notes badges */}
                      {(v.notesAvailable.violinschluessel || v.notesAvailable.griffschrift) && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {v.notesAvailable.violinschluessel && (
                            <span className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary flex items-center gap-1">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                              Violinschlüssel
                            </span>
                          )}
                          {v.notesAvailable.griffschrift && (
                            <span className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary flex items-center gap-1">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                              Griffschrift
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto">
                        {v.purchased ? (
                          <Link href={`/member/academy/lernvideos/${v.id}`} className="block text-center font-sans text-xs bg-dark text-white py-2 hover:bg-accent-gold transition-colors">
                            Lernvideo öffnen →
                          </Link>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-sm font-semibold">{v.price > 0 ? `CHF ${v.price}.–` : 'Kostenlos'}</span>
                            <button className="bg-accent-gold text-white font-sans text-xs px-3 py-1.5 hover:bg-accent-warm transition-colors">
                              {v.price > 0 ? 'Kaufen' : 'Öffnen'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-heading font-bold text-lg mb-2">Keine Lernvideos gefunden</p>
                  <p className="font-sans text-sm text-text-secondary mb-4">Versuche andere Filtereinstellungen oder durchsuche die gesamte Datenbank.</p>
                  <button onClick={() => { setSearch(''); setFilterInst('Alle'); setFilterTakt('Alle'); setFilterPlan('Alle'); setFilterArt('Alle'); setFilterStyleTag(null); setFilterNoten('Alle') }} className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors">
                    Alle Filter zurücksetzen
                  </button>
                </div>
              )}
            </div>
          </div>
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
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Interpret *</label>
                        <input value={wishArtist} onChange={e => setWishArtist(e.target.value)} placeholder="z.B. Kapelle Hess-Ruedi" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark" />
                      </div>
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Instrument *</label>
                      <select value={wishInst} onChange={e => setWishInst(e.target.value)} className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark bg-surface">
                        {INSTRUMENTS.filter(i => i !== 'Alle').map(i => <option key={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-accent-gold text-white font-sans text-sm px-5 py-2 hover:bg-accent-warm transition-colors">Wunsch einreichen</button>
                      <button onClick={() => setShowWishForm(false)} className="border border-border font-sans text-sm px-4 py-2 hover:border-dark transition-colors">Abbrechen</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {wishes.map(w => (
                <div key={w.id} className="bg-surface border border-border p-5 flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1 w-12 flex-shrink-0">
                    <button
                      onClick={() => setWishVotes(prev => ({ ...prev, [w.id]: !prev[w.id] }))}
                      className={`text-lg transition-colors ${wishVotes[w.id] ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold'}`}
                    >
                      {wishVotes[w.id] ? '❤️' : '🤍'}
                    </button>
                    <span className="font-sans font-bold text-sm">{w.votes + (wishVotes[w.id] ? 1 : 0) - (w.voted ? 1 : 0)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-bold text-sm">{w.title}</h4>
                    <p className="font-sans text-xs text-text-secondary">{w.artist} · {w.instrument}</p>
                  </div>
                  <span className={`font-sans text-xs px-2 py-1 border flex-shrink-0 ${w.status === 'in Produktion' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-border/50 text-text-secondary border-border'}`}>
                    {w.status === 'in Produktion' ? '🎬 In Produktion' : '📋 Offen'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
