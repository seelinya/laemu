'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const videos = [
  { id: 1, title: 'Dr Alperose', artist: 'Willi Valotti', instrument: 'Handorgel', formation: 'Trio', composer: 'Valotti', year: 1978, difficulty: 3, level: 2, meter: '3/4', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', price: 18, purchased: true },
  { id: 2, title: 'Ländler im Dreivierteltakt', artist: 'Kapelle Hess-Ruedi-Hegner', instrument: 'Schwyzerörgeli', formation: 'Kapelle', composer: 'Hess', year: 1995, difficulty: 2, level: 1, meter: '3/4', img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&q=80', price: 18, purchased: false },
  { id: 3, title: 'Abendstern-Polka', artist: 'Bodästänix', instrument: 'Handorgel', formation: 'Quartett', composer: 'Unbekannt', year: 2003, difficulty: 4, level: 3, meter: '2/4', img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=400&q=80', price: 18, purchased: false },
  { id: 4, title: 'Innerschwizer Schottisch', artist: 'Trio Rigi', instrument: 'Klarinette', formation: 'Trio', composer: 'Müller', year: 1988, difficulty: 3, level: 2, meter: '2/4', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80', price: 18, purchased: false },
  { id: 5, title: 'Walzer am See', artist: 'Lisa Frei', instrument: 'Klavier', formation: 'Solo', composer: 'Frei', year: 2015, difficulty: 2, level: 2, meter: '3/4', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80', price: 18, purchased: true },
  { id: 6, title: 'Bergbach-Mazurka', artist: 'Hess-Rusch-Hegner', instrument: 'Bass', formation: 'Kapelle', composer: 'Rusch', year: 1972, difficulty: 5, level: 4, meter: '3/4', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80', price: 18, purchased: false },
]

const wishes = [
  { id: 1, title: 'S Röseli', artist: 'Kapelle Alpstein', instrument: 'Handorgel', votes: 23, voted: false, status: 'offen' },
  { id: 2, title: 'Märzenschnee-Ländler', artist: 'Unbekannt', instrument: 'Schwyzerörgeli', votes: 17, voted: true, status: 'offen' },
  { id: 3, title: 'Luzerner Polka', artist: 'Trio Rigi', instrument: 'Klarinette', votes: 41, voted: false, status: 'in Produktion' },
]

const instruments = ['Alle', 'Handorgel', 'Schwyzerörgeli', 'Klavier', 'Bass', 'Klarinette']
const formations = ['Alle', 'Solo', 'Duo', 'Trio', 'Quartett', 'Kapelle']
const difficulties = ['Alle', '1 – Sehr leicht', '2 – Leicht', '3 – Mittel', '4 – Schwer', '5 – Sehr schwer', '6 – Virtuos']
const levels = ['Alle', 'Stufe I', 'Stufe II', 'Stufe III', 'Stufe IV', 'Stufe V', 'Stufe VI']
const meters = ['Alle', '2/4', '3/4', '4/4', '6/8']

export default function LernvideosPage() {
  const [search, setSearch] = useState('')
  const [filterInst, setFilterInst] = useState('Alle')
  const [filterForm, setFilterForm] = useState('Alle')
  const [filterDiff, setFilterDiff] = useState('Alle')
  const [filterLevel, setFilterLevel] = useState('Alle')
  const [filterMeter, setFilterMeter] = useState('Alle')
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
    if (q && !v.title.toLowerCase().includes(q) && !v.artist.toLowerCase().includes(q) && !v.composer.toLowerCase().includes(q)) return false
    if (filterInst !== 'Alle' && v.instrument !== filterInst) return false
    if (filterForm !== 'Alle' && v.formation !== filterForm) return false
    if (filterDiff !== 'Alle' && v.difficulty !== parseInt(filterDiff[0])) return false
    if (filterLevel !== 'Alle' && v.level !== parseInt(filterLevel.split(' ')[1])) return false
    if (filterMeter !== 'Alle' && v.meter !== filterMeter) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between sticky top-20 z-20">
        <div className="flex items-center gap-4">
          <Link href="/member/academy" className="font-sans text-sm text-text-secondary hover:text-text-primary transition-colors">← Academy</Link>
          <h1 className="font-serif font-bold text-lg">Lernvideo-Datenbank</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          <button onClick={() => setTab('datenbank')} className={`px-6 py-3 font-sans text-sm font-medium transition-colors border-b-2 ${tab === 'datenbank' ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
            🎬 Lernvideos durchsuchen
          </button>
          <button onClick={() => setTab('wuensche')} className={`px-6 py-3 font-sans text-sm font-medium transition-colors border-b-2 ${tab === 'wuensche' ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
            🎵 Stückwünsche ({wishes.length})
          </button>
        </div>

        {tab === 'datenbank' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="space-y-6">
              <div>
                <label className="font-sans text-xs uppercase tracking-wider text-text-secondary block mb-2">Suche</label>
                <input value={search} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setSearch(e.target.value)} type="text" placeholder="Titel, Interpret, Komponist..." className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-accent-gold" />
              </div>
              {[
                { label: 'Instrument', value: filterInst, set: setFilterInst, opts: instruments },
                { label: 'Formation', value: filterForm, set: setFilterForm, opts: formations },
                { label: 'Schwierigkeit', value: filterDiff, set: setFilterDiff, opts: difficulties },
                { label: 'Harmonielehre-Stufe', value: filterLevel, set: setFilterLevel, opts: levels },
                { label: 'Taktart', value: filterMeter, set: setFilterMeter, opts: meters },
              ].map(f => (
                <div key={f.label}>
                  <label className="font-sans text-xs uppercase tracking-wider text-text-secondary block mb-2">{f.label}</label>
                  <select value={f.value} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => f.set(e.target.value)} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-accent-gold bg-surface">
                    {f.opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <button onClick={() => { setSearch(''); setFilterInst('Alle'); setFilterForm('Alle'); setFilterDiff('Alle'); setFilterLevel('Alle'); setFilterMeter('Alle') }} className="w-full border border-border py-2 font-sans text-sm text-text-secondary hover:border-accent-gold hover:text-accent-gold transition-colors">
                Filter zurücksetzen
              </button>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <p className="font-sans text-sm text-text-secondary mb-4">{filtered.length} Lernvideos gefunden</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((v, i) => (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-surface border border-border overflow-hidden group hover:border-accent-gold transition-colors">
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={v.img} alt={v.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-accent-gold flex items-center justify-center">
                          <span className="text-white text-lg ml-1">▶</span>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="font-sans text-[10px] bg-black/60 text-white px-1.5 py-0.5">{v.instrument}</span>
                        <span className="font-sans text-[10px] bg-black/60 text-white px-1.5 py-0.5">{v.meter}</span>
                      </div>
                      {v.purchased && <div className="absolute top-2 right-2 bg-muted-green text-white text-[10px] px-1.5 py-0.5">✓ Gekauft</div>}
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif font-bold text-sm mb-0.5 group-hover:text-accent-gold transition-colors">{v.title}</h4>
                      <p className="font-sans text-xs text-text-secondary mb-2">{v.artist} · {v.year}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 6 }).map((_, j) => (
                            <div key={j} className={`w-2 h-2 rounded-sm ${j < v.difficulty ? 'bg-accent-gold' : 'bg-border'}`} />
                          ))}
                        </div>
                        <span className="font-sans text-[10px] text-text-secondary">Stufe {v.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        {v.purchased ? (
                          <Link href={`/member/academy/lernvideos/${v.id}`} className="font-sans text-xs text-accent-gold hover:text-accent-earth transition-colors">Lernvideo öffnen →</Link>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <span className="font-sans text-sm font-semibold">CHF 18.–</span>
                            <button className="bg-accent-gold text-white font-sans text-xs px-3 py-1.5 hover:bg-accent-earth transition-colors">Kaufen</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'wuensche' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif font-bold text-xl">Stückwünsche</h2>
                <p className="font-sans text-sm text-text-secondary mt-1">Stimme für Stücke, die du dir als Lernvideo wünschst. Sobald ein Stück produziert wird, erhältst du eine Benachrichtigung.</p>
              </div>
              <button onClick={() => setShowWishForm(!showWishForm)} className="bg-accent-gold text-white font-sans text-sm px-4 py-2 hover:bg-accent-earth transition-colors flex-shrink-0">
                + Neuer Wunsch
              </button>
            </div>

            <AnimatePresence>
              {showWishForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                  <div className="bg-surface border border-accent-gold/30 p-6 space-y-4">
                    <h3 className="font-serif font-bold text-sm">Stückwunsch erfassen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-sans text-xs uppercase tracking-wider text-text-secondary block mb-1">Titel des Stückes *</label>
                        <input value={wishTitle} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setWishTitle(e.target.value)} placeholder="z.B. Dr Alperose" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
                      </div>
                      <div>
                        <label className="font-sans text-xs uppercase tracking-wider text-text-secondary block mb-1">Interpret *</label>
                        <input value={wishArtist} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setWishArtist(e.target.value)} placeholder="z.B. Kapelle Hess-Ruedi" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
                      </div>
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase tracking-wider text-text-secondary block mb-1">Instrument *</label>
                      <select value={wishInst} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setWishInst(e.target.value)} className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold bg-surface">
                        {instruments.filter(i => i !== 'Alle').map(i => <option key={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-accent-gold text-white font-sans text-sm px-5 py-2 hover:bg-accent-earth transition-colors">Wunsch einreichen</button>
                      <button onClick={() => setShowWishForm(false)} className="border border-border font-sans text-sm px-4 py-2 hover:border-accent-gold transition-colors">Abbrechen</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {wishes.map((w) => (
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
                    <h4 className="font-serif font-bold text-sm">{w.title}</h4>
                    <p className="font-sans text-xs text-text-secondary">{w.artist} · {w.instrument}</p>
                  </div>
                  <span className={`font-sans text-xs px-2 py-1 border ${w.status === 'in Produktion' ? 'bg-muted-green/10 text-muted-green border-muted-green/20' : 'bg-border/50 text-text-secondary border-border'}`}>
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
