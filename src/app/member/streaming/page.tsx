'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MemberTabs } from '@/components/MemberTabs'

// ─── Data ────────────────────────────────────────────────────────────────────

const genres = ['Alle', 'Ländler', 'Walzer', 'Polka', 'Mazurka', 'Schottisch', 'Marsch', 'Volkslied']

const featured = {
  title: 'Urchige Klänge',
  subtitle: 'Die schönsten Ländler-Aufnahmen aus dem LAEMU Archiv',
  tracks: 124,
  hours: '8 Std',
  img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
}

const playlists = [
  { id: 'p1', title: 'Innerschwyzer Perlen', desc: 'Traditionelle Stücke aus der Zentralschweiz', tracks: 42, img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80' },
  { id: 'p2', title: 'Schwyzerörgeli pur', desc: 'Diatonisch und voller Seele', tracks: 38, img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&q=80' },
  { id: 'p3', title: 'Tanzabend', desc: 'Walzer, Polka & Mazurka zum Tanzen', tracks: 56, img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=600&q=80' },
  { id: 'p4', title: 'Neue Generation', desc: 'Moderne Ländlermusik von heute', tracks: 29, img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80' },
]

type Track = {
  id: number
  title: string
  artist: string
  album: string
  genre: string
  duration: string
  img: string
}

const tracks: Track[] = [
  { id: 1, title: 'Dr Alperose', artist: 'Willi Valotti', album: 'Bärgblueme', genre: 'Walzer', duration: '3:24', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80' },
  { id: 2, title: 'Heimetli-Polka', artist: 'Kapelle Hess-Ruedi-Hegner', album: 'Stubete', genre: 'Polka', duration: '2:58', img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=200&q=80' },
  { id: 3, title: 'Abendstern', artist: 'Bodästänix', album: 'Live im Tellspielhaus', genre: 'Ländler', duration: '4:12', img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=200&q=80' },
  { id: 4, title: 'Innerschwizer Schottisch', artist: 'Trio Rigi', album: 'Vom Rigi bis zum See', genre: 'Schottisch', duration: '3:05', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&q=80' },
  { id: 5, title: 'Walzer am See', artist: 'Lisa Frei', album: 'Stille Wasser', genre: 'Walzer', duration: '3:47', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=200&q=80' },
  { id: 6, title: 'Bergbach-Mazurka', artist: 'Hess-Rusch-Hegner', album: 'Quellwasser', genre: 'Mazurka', duration: '2:41', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=200&q=80' },
  { id: 7, title: 'Alphüttä-Marsch', artist: 'Ländlerkapelle Hess', album: 'Bärgfahrt', genre: 'Marsch', duration: '3:18', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80' },
  { id: 8, title: 'Mis Dahei', artist: 'Cécile Schmidig', album: 'Handorgel-Träume', genre: 'Volkslied', duration: '4:33', img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=200&q=80' },
  { id: 9, title: 'Schwyzer Ländler Nr. 4', artist: 'Cyrill Rusch', album: 'Tradition', genre: 'Ländler', duration: '3:51', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
  { id: 10, title: 'Frühligstanz', artist: 'Quartett Rigi', album: 'Jahreszeiten', genre: 'Polka', duration: '2:49', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StreamingPage() {
  const [genre, setGenre] = useState('Alle')
  const [search, setSearch] = useState('')
  const [current, setCurrent] = useState<Track | null>(null)
  const [playing, setPlaying] = useState(false)
  const [liked, setLiked] = useState<Record<number, boolean>>({})

  const filtered = tracks.filter((t) => {
    const matchesGenre = genre === 'Alle' || t.genre === genre
    const q = search.trim().toLowerCase()
    const matchesSearch = q === '' || t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.album.toLowerCase().includes(q)
    return matchesGenre && matchesSearch
  })

  function playTrack(t: Track) {
    if (current?.id === t.id) {
      setPlaying((p) => !p)
    } else {
      setCurrent(t)
      setPlaying(true)
    }
  }

  function toggleLike(id: number) {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* TOP BAR */}
      <div className="bg-dark text-white px-6 py-3 flex items-center justify-between gap-4">
        <h1 className="font-heading font-bold text-lg flex items-center gap-2">
          <span>🔊</span> LAEMU Streaming
        </h1>
        <div className="flex items-center bg-white/10 border border-white/10 max-w-xs w-full">
          <svg className="ml-3 flex-shrink-0 text-white/50" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Lieder, Künstler, Alben…"
            className="flex-1 px-3 py-2 font-sans text-sm bg-transparent text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>
      </div>

      {/* AREA TABS */}
      <MemberTabs active="streaming" />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

        {/* FEATURED */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden">
          <div className="relative h-56 md:h-64">
            <Image src={featured.img} alt={featured.title} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-2">Empfohlenes Archiv</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">{featured.title}</h2>
              <p className="font-sans text-white/70 text-sm max-w-md mb-4">{featured.subtitle}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => playTrack(tracks[0])}
                  className="flex items-center gap-2 bg-accent-gold text-white px-6 py-3 font-sans text-sm font-semibold hover:bg-accent-warm transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  Abspielen
                </button>
                <span className="font-sans text-xs text-white/60">{featured.tracks} Lieder · {featured.hours}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* PLAYLISTS */}
        <section>
          <h3 className="font-heading font-bold text-xl mb-4">Playlists & Sammlungen</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playlists.map((pl, i) => (
              <motion.div
                key={pl.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-surface border border-border p-4 group hover:border-accent-gold transition-colors cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden mb-3">
                  <Image src={pl.img} alt={pl.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-accent-gold flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                </div>
                <h4 className="font-heading font-bold text-sm mb-0.5">{pl.title}</h4>
                <p className="font-sans text-xs text-text-secondary leading-snug mb-1">{pl.desc}</p>
                <p className="font-sans text-[10px] text-accent-gold uppercase tracking-wider">{pl.tracks} Lieder</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TRACKS */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <h3 className="font-heading font-bold text-xl">Alle Lieder</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`font-sans text-xs px-3 py-1.5 border transition-colors ${
                    genre === g ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-dark'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border">
            {/* Header row */}
            <div className="hidden md:grid grid-cols-[2rem_1fr_1fr_8rem_4rem_3rem] gap-4 px-4 py-3 border-b border-border font-sans text-[10px] uppercase tracking-widest text-text-secondary">
              <span>#</span>
              <span>Titel</span>
              <span>Album</span>
              <span>Genre</span>
              <span className="text-right">Dauer</span>
              <span></span>
            </div>

            {filtered.length === 0 && (
              <p className="px-4 py-8 text-center font-sans text-sm text-text-secondary">Keine Lieder gefunden.</p>
            )}

            {filtered.map((t, i) => {
              const isCurrent = current?.id === t.id
              return (
                <div
                  key={t.id}
                  className={`grid grid-cols-[2rem_1fr_3rem] md:grid-cols-[2rem_1fr_1fr_8rem_4rem_3rem] gap-4 px-4 py-2.5 items-center border-b border-border last:border-0 group transition-colors ${isCurrent ? 'bg-accent-gold/5' : 'hover:bg-background'}`}
                >
                  {/* index / play */}
                  <button onClick={() => playTrack(t)} className="flex items-center justify-center text-text-secondary">
                    <span className={`font-sans text-xs tabular-nums ${isCurrent ? 'hidden' : 'group-hover:hidden'}`}>{i + 1}</span>
                    <span className={`${isCurrent ? 'block' : 'hidden group-hover:block'} text-dark`}>
                      {isCurrent && playing ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      )}
                    </span>
                  </button>

                  {/* title + artist */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden">
                      <Image src={t.img} alt={t.title} fill className="object-cover" unoptimized />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-sans text-sm font-medium truncate ${isCurrent ? 'text-accent-gold' : ''}`}>{t.title}</p>
                      <p className="font-sans text-xs text-text-secondary truncate">{t.artist}</p>
                    </div>
                  </div>

                  {/* album */}
                  <p className="hidden md:block font-sans text-sm text-text-secondary truncate">{t.album}</p>

                  {/* genre */}
                  <span className="hidden md:inline-block font-sans text-[10px] px-2 py-0.5 bg-background border border-border text-text-secondary w-fit">{t.genre}</span>

                  {/* duration */}
                  <span className="hidden md:block font-sans text-xs text-text-secondary text-right tabular-nums">{t.duration}</span>

                  {/* like */}
                  <button onClick={() => toggleLike(t.id)} className="flex items-center justify-center text-text-secondary hover:text-accent-gold transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={liked[t.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={liked[t.id] ? 'text-accent-gold' : ''}>
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* NOW PLAYING BAR */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-dark border-t border-dark-secondary text-white"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden">
                  <Image src={current.img} alt={current.title} fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-sm font-medium truncate">{current.title}</p>
                  <p className="font-sans text-xs text-white/50 truncate">{current.artist}</p>
                </div>
                <button onClick={() => toggleLike(current.id)} className="ml-2 text-white/50 hover:text-accent-gold transition-colors flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={liked[current.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={liked[current.id] ? 'text-accent-gold' : ''}>
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="w-10 h-10 rounded-full bg-accent-gold flex items-center justify-center hover:bg-accent-warm transition-colors"
                  aria-label={playing ? 'Pause' : 'Abspielen'}
                >
                  {playing ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  )}
                </button>
              </div>

              <div className="hidden md:flex items-center gap-3 flex-1 max-w-sm">
                <span className="font-sans text-[10px] text-white/40 tabular-nums">0:00</span>
                <div className="flex-1 h-1 bg-white/15 overflow-hidden">
                  <motion.div
                    key={`${current.id}-${playing}`}
                    className="h-full bg-accent-gold"
                    initial={{ width: '0%' }}
                    animate={{ width: playing ? '100%' : '0%' }}
                    transition={{ duration: 30, ease: 'linear' }}
                  />
                </div>
                <span className="font-sans text-[10px] text-white/40 tabular-nums">{current.duration}</span>
              </div>

              <button onClick={() => { setCurrent(null); setPlaying(false) }} className="text-white/40 hover:text-white transition-colors flex-shrink-0" aria-label="Schliessen">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
