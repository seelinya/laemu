'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Track = {
  id: number
  title: string
  artist: string
  instrument: string
  taktart: string | null
  duration: string
  img: string
  plan: 'free' | 'starter' | 'pro'
}

type Playlist = {
  id: string
  name: string
  trackIds: number[]
  createdAt: string
}

// ─── All available tracks (audio only — no video learning content) ────────────

const allTracks: Track[] = [
  { id: 1, title: 'Dr Alperose', artist: 'Willi Valotti', instrument: 'Handorgel', taktart: 'Walzer', duration: '3:42', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80', plan: 'starter' },
  { id: 2, title: 'Ländler im Dreivierteltakt', artist: 'Kapelle Hess-Ruedi-Hegner', instrument: 'Schwyzerörgeli', taktart: 'Ländler', duration: '4:15', img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=200&q=80', plan: 'starter' },
  { id: 3, title: 'Abendstern-Polka', artist: 'Bodästänix', instrument: 'Handorgel', taktart: 'Polka', duration: '2:58', img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=200&q=80', plan: 'pro' },
  { id: 4, title: 'Innerschwizer Schottisch', artist: 'Trio Rigi', instrument: 'Klarinette', taktart: 'Schottisch', duration: '3:21', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&q=80', plan: 'starter' },
  { id: 5, title: 'Walzer am See', artist: 'Lisa Frei', instrument: 'Klavier', taktart: 'Walzer', duration: '4:02', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=200&q=80', plan: 'free' },
  { id: 6, title: 'Bergbach-Mazurka', artist: 'Hess-Rusch-Hegner', instrument: 'Bass', taktart: 'Mazurka', duration: '3:33', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=200&q=80', plan: 'pro' },
  { id: 7, title: 'Stille Nacht', artist: 'Verschiedene Kapellen', instrument: 'Handorgel', taktart: null, duration: '2:47', img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=200&q=80', plan: 'free' },
  { id: 8, title: 'Heimetli-Polka', artist: 'Hansruedi Wenger', instrument: 'Handorgel', taktart: 'Polka', duration: '2:31', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80', plan: 'starter' },
  { id: 9, title: 'Muotathaler Ländler', artist: 'Kapelle Birchbach', instrument: 'Schwyzerörgeli', taktart: 'Ländler', duration: '3:55', img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=200&q=80', plan: 'starter' },
  { id: 10, title: 'Sonntagswalzer', artist: 'Franz Hess', instrument: 'Klavier', taktart: 'Walzer', duration: '4:18', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&q=80', plan: 'free' },
]

// Liked tracks (simulated)
const initialLikedIds = [1, 2, 3, 5, 8]

// Initial playlists
const initialPlaylists: Playlist[] = [
  { id: 'liked', name: 'Gelikte Stücke', trackIds: initialLikedIds, createdAt: '2025-01-01' },
  { id: 'auto', name: 'Im Auto', trackIds: [1, 4, 8], createdAt: '2025-01-05' },
  { id: 'uebung', name: 'Übungsstücke', trackIds: [2, 3], createdAt: '2025-01-08' },
]

const planColors: Record<string, string> = {
  free: 'text-text-secondary',
  starter: 'text-accent-gold',
  pro: 'text-dark font-semibold',
}

// ─── Toast notification ───────────────────────────────────────────────────────

type ToastData = {
  trackId: number
  targetPlaylistId: string
  key: number
}

function Toast({
  toast,
  playlists,
  onChangePlaylist,
  onDismiss,
}: {
  toast: ToastData
  playlists: Playlist[]
  onChangePlaylist: (trackId: number, fromPlaylistId: string) => void
  onDismiss: () => void
}) {
  const track = allTracks.find((t) => t.id === toast.trackId)
  const playlist = playlists.find((p) => p.id === toast.targetPlaylistId)

  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  if (!track || !playlist) return null
  return (
    <motion.div
      key={toast.key}
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-dark text-white px-5 py-3 shadow-2xl border border-white/10 min-w-[300px]"
    >
      <div className="relative w-8 h-8 flex-shrink-0 overflow-hidden">
        <Image src={track.img} alt={track.title} fill className="object-cover" unoptimized />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm truncate">
          <span className="font-medium">{track.title}</span>
          <span className="text-white/50"> → </span>
          <span className="text-accent-gold">{playlist.name}</span>
        </p>
      </div>
      <button
        onClick={() => onChangePlaylist(toast.trackId, toast.targetPlaylistId)}
        className="font-sans text-xs font-medium text-accent-gold hover:underline flex-shrink-0 ml-2"
      >
        Ändern
      </button>
      <button onClick={onDismiss} className="text-white/30 hover:text-white transition-colors ml-1 text-lg leading-none">×</button>
    </motion.div>
  )
}

// ─── Playlist selector modal ──────────────────────────────────────────────────

function PlaylistSelectorModal({
  trackId,
  playlists,
  onConfirm,
  onCancel,
  onNewPlaylist,
}: {
  trackId: number
  playlists: Playlist[]
  onConfirm: (selectedIds: string[]) => void
  onCancel: () => void
  onNewPlaylist: (name: string) => void
}) {
  const track = allTracks.find((t) => t.id === trackId)
  const [selected, setSelected] = useState<string[]>([])
  const [newName, setNewName] = useState('')
  const [showNew, setShowNew] = useState(false)

  function toggle(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  function handleNew() {
    if (newName.trim()) {
      onNewPlaylist(newName.trim())
      setNewName('')
      setShowNew(false)
    }
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        className="relative bg-surface border border-border w-full max-w-sm shadow-2xl"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="p-5 border-b border-border flex items-center gap-3">
          {track && (
            <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden">
              <Image src={track.img} alt={track.title} fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-sm truncate">{track?.title}</p>
            <p className="font-sans text-xs text-text-secondary">Playlist wählen</p>
          </div>
          <button onClick={onCancel} className="text-text-secondary hover:text-text-primary transition-colors text-xl leading-none">×</button>
        </div>

        <div className="p-3 max-h-64 overflow-y-auto">
          {playlists.map((pl) => {
            const isIn = pl.trackIds.includes(trackId)
            const isSel = selected.includes(pl.id)
            return (
              <button
                key={pl.id}
                onClick={() => toggle(pl.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-background transition-colors text-left ${isSel ? 'bg-accent-gold/5' : ''}`}
              >
                <div className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${isSel ? 'bg-accent-gold border-accent-gold' : 'border-border'}`}>
                  {isSel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium truncate">{pl.name}</p>
                  <p className="font-sans text-xs text-text-secondary">{pl.trackIds.length} Stücke{isIn ? ' · bereits drin' : ''}</p>
                </div>
                {pl.id === 'liked' && <span className="text-accent-gold text-sm">♥</span>}
              </button>
            )
          })}
        </div>

        {/* New playlist */}
        <div className="border-t border-border p-3">
          {showNew ? (
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNew()}
                autoFocus
                placeholder="Playlist-Name…"
                className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold"
              />
              <button onClick={handleNew} disabled={!newName.trim()} className="bg-accent-gold text-white px-3 py-2 font-sans text-xs font-medium hover:bg-accent-earth transition-colors disabled:opacity-40">
                Erstellen
              </button>
              <button onClick={() => setShowNew(false)} className="text-text-secondary hover:text-text-primary px-2 text-lg leading-none">×</button>
            </div>
          ) : (
            <button onClick={() => setShowNew(true)} className="w-full flex items-center gap-2 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors py-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Neue Playlist erstellen
            </button>
          )}
        </div>

        <div className="px-4 pb-4 flex gap-2">
          <button onClick={onCancel} className="flex-1 border border-border py-2.5 font-sans text-sm hover:bg-background transition-colors">Abbrechen</button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={selected.length === 0}
            className="flex-1 bg-accent-gold text-white py-2.5 font-sans text-sm font-medium hover:bg-accent-earth transition-colors disabled:opacity-40"
          >
            Hinzufügen ({selected.length})
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Audio player bar ─────────────────────────────────────────────────────────

function PlayerBar({ track, isPlaying, onToggle }: { track: Track | null; isPlaying: boolean; onToggle: () => void }) {
  if (!track) return null
  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-dark border-t border-white/10 px-6 py-3 flex items-center gap-4"
    >
      <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden">
        <Image src={track.img} alt={track.title} fill className="object-cover" unoptimized />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-bold text-sm text-white truncate">{track.title}</p>
        <p className="font-sans text-xs text-white/50 truncate">{track.artist}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-white/50 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2"/></svg>
        </button>
        <button onClick={onToggle} className="w-10 h-10 bg-accent-gold hover:bg-accent-earth transition-colors flex items-center justify-center flex-shrink-0">
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
        </button>
        <button className="text-white/50 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2"/></svg>
        </button>
      </div>
      {/* Progress bar (static for prototype) */}
      <div className="flex-1 max-w-xs hidden md:flex items-center gap-2">
        <span className="font-sans text-xs text-white/40">1:24</span>
        <div className="flex-1 h-1 bg-white/20 overflow-hidden">
          <div className="h-full bg-accent-gold" style={{ width: '38%' }} />
        </div>
        <span className="font-sans text-xs text-white/40">{track.duration}</span>
      </div>
      <button className="text-white/40 hover:text-white transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
      </button>
    </motion.div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists)
  const [activePlaylistId, setActivePlaylistId] = useState('liked')
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)
  const [selectorTrackId, setSelectorTrackId] = useState<number | null>(null)
  const [selectorFromPlaylistId, setSelectorFromPlaylistId] = useState<string | null>(null)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false)
  const toastKeyRef = useRef(0)

  const activePlaylist = playlists.find((p) => p.id === activePlaylistId) ?? playlists[0]
  const activeTracks = allTracks.filter((t) => activePlaylist?.trackIds.includes(t.id))
  const playingTrack = allTracks.find((t) => t.id === playingTrackId) ?? null

  function handlePlay(trackId: number) {
    if (playingTrackId === trackId) {
      setIsPlaying((v) => !v)
    } else {
      setPlayingTrackId(trackId)
      setIsPlaying(true)
    }
  }

  // Remove track from active playlist
  function handleRemove(trackId: number) {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === activePlaylistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p
      )
    )
    if (playingTrackId === trackId) { setPlayingTrackId(null); setIsPlaying(false) }
  }

  // Add track to liked playlist (default) and show toast
  function handleAddToPlaylist(trackId: number) {
    const likedId = 'liked'
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === likedId && !p.trackIds.includes(trackId)
          ? { ...p, trackIds: [...p.trackIds, trackId] }
          : p
      )
    )
    toastKeyRef.current += 1
    setToast({ trackId, targetPlaylistId: likedId, key: toastKeyRef.current })
  }

  // "Ändern" from toast: open playlist selector
  function handleChangeFromToast(trackId: number, fromPlaylistId: string) {
    // Remove from the default-added playlist first (undo the auto-add)
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === fromPlaylistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p
      )
    )
    setToast(null)
    setSelectorTrackId(trackId)
    setSelectorFromPlaylistId(fromPlaylistId)
  }

  // Confirm selection from modal
  function handleSelectorConfirm(selectedPlaylistIds: string[]) {
    if (selectorTrackId == null) return
    setPlaylists((prev) =>
      prev.map((p) =>
        selectedPlaylistIds.includes(p.id) && !p.trackIds.includes(selectorTrackId)
          ? { ...p, trackIds: [...p.trackIds, selectorTrackId] }
          : p
      )
    )
    setSelectorTrackId(null)
    setSelectorFromPlaylistId(null)
  }

  // Create new playlist from modal
  function handleNewPlaylist(name: string) {
    const id = `playlist-${Date.now()}`
    setPlaylists((prev) => [...prev, { id, name, trackIds: [], createdAt: new Date().toISOString().slice(0, 10) }])
  }

  // Create new playlist from sidebar
  function handleCreatePlaylist() {
    if (!newPlaylistName.trim()) return
    const id = `playlist-${Date.now()}`
    setPlaylists((prev) => [...prev, { id, name: newPlaylistName.trim(), trackIds: [], createdAt: new Date().toISOString().slice(0, 10) }])
    setNewPlaylistName('')
    setShowNewPlaylistInput(false)
    setActivePlaylistId(id)
  }

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* Modals */}
      <AnimatePresence>
        {selectorTrackId != null && (
          <PlaylistSelectorModal
            trackId={selectorTrackId}
            playlists={playlists}
            onConfirm={handleSelectorConfirm}
            onCancel={() => { setSelectorTrackId(null); setSelectorFromPlaylistId(null) }}
            onNewPlaylist={handleNewPlaylist}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            toast={toast}
            playlists={playlists}
            onChangePlaylist={handleChangeFromToast}
            onDismiss={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Audio player bar */}
      <AnimatePresence>
        {playingTrack && <PlayerBar track={playingTrack} isPlaying={isPlaying} onToggle={() => setIsPlaying((v) => !v)} />}
      </AnimatePresence>

      {/* TOP BAR */}
      <div className="bg-dark text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/member/academy" className="flex items-center gap-1.5 font-sans text-sm text-white/60 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Musikschule
          </Link>
          <span className="text-white/20">/</span>
          <h1 className="font-heading font-bold">Meine Playlists</h1>
        </div>
        <div className="flex items-center gap-1.5 text-white/50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          <span className="font-sans text-xs">Nur Audio</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* ── SIDEBAR: Playlist list ── */}
          <aside>
            <div className="sticky top-32 space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-base">Playlists</h2>
                <button
                  onClick={() => setShowNewPlaylistInput((v) => !v)}
                  className="w-7 h-7 border border-border flex items-center justify-center text-text-secondary hover:border-dark hover:text-dark transition-colors"
                  title="Neue Playlist"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              <AnimatePresence>
                {showNewPlaylistInput && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-2">
                    <div className="flex gap-2 pb-2">
                      <input
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                        autoFocus
                        placeholder="Playlist-Name…"
                        className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold bg-surface"
                      />
                      <button
                        onClick={handleCreatePlaylist}
                        disabled={!newPlaylistName.trim()}
                        className="bg-accent-gold text-white px-3 font-sans text-xs font-medium hover:bg-accent-earth transition-colors disabled:opacity-40"
                      >
                        OK
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {playlists.map((pl) => {
                const isActive = pl.id === activePlaylistId
                return (
                  <button
                    key={pl.id}
                    onClick={() => setActivePlaylistId(pl.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border ${isActive ? 'border-accent-gold bg-accent-gold/5' : 'border-transparent hover:border-border hover:bg-surface'}`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-accent-gold' : 'bg-border'}`}>
                      {pl.id === 'liked' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={isActive ? 'white' : 'none'} stroke={isActive ? 'white' : 'currentColor'} strokeWidth="2" className={isActive ? '' : 'text-text-secondary'}>
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? 'white' : 'currentColor'} strokeWidth="2" className={isActive ? '' : 'text-text-secondary'}>
                          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-sans text-sm font-medium truncate ${isActive ? 'text-accent-gold' : ''}`}>{pl.name}</p>
                      <p className="font-sans text-xs text-text-secondary">{pl.trackIds.length} Stücke</p>
                    </div>
                  </button>
                )
              })}

              {/* Add from all tracks section */}
              <div className="pt-4 border-t border-border mt-4">
                <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Stück hinzufügen</p>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">
                  Klicke bei einem Stück auf ♥ um es zur Playlist hinzuzufügen. Es landet zuerst in &ldquo;Gelikte Stücke&rdquo; — du kannst dann die Playlist ändern.
                </p>
              </div>
            </div>
          </aside>

          {/* ── MAIN: Active playlist tracks ── */}
          <main>
            {activePlaylist && (
              <>
                {/* Playlist header */}
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-24 h-24 bg-dark flex items-center justify-center flex-shrink-0">
                    {activePlaylist.id === 'liked' ? (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-accent-gold">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    ) : activeTracks[0] ? (
                      <div className="relative w-full h-full overflow-hidden">
                        <Image src={activeTracks[0].img} alt={activePlaylist.name} fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
                        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-1">Playlist</p>
                    <h2 className="font-heading text-3xl font-bold mb-1">{activePlaylist.name}</h2>
                    <p className="font-sans text-sm text-text-secondary">{activePlaylist.trackIds.length} Stücke · Nur Audio</p>
                    {activeTracks.length > 0 && (
                      <button
                        onClick={() => { setPlayingTrackId(activeTracks[0].id); setIsPlaying(true) }}
                        className="mt-3 flex items-center gap-2 bg-accent-gold text-white px-5 py-2.5 font-sans text-sm font-medium hover:bg-accent-earth transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        Abspielen
                      </button>
                    )}
                  </div>
                </div>

                {/* Tracks */}
                {activeTracks.length === 0 ? (
                  <div className="bg-surface border border-border p-12 text-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-border mx-auto mb-3"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                    <p className="font-heading font-bold text-lg mb-1">Noch keine Stücke</p>
                    <p className="font-sans text-sm text-text-secondary">Füge Stücke über die Datenbank hinzu.</p>
                  </div>
                ) : (
                  <div>
                    {/* Table header */}
                    <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 border-b border-border mb-1">
                      <span className="font-sans text-xs text-text-secondary w-6 text-center">#</span>
                      <span className="font-sans text-xs text-text-secondary uppercase tracking-wider">Titel</span>
                      <span className="font-sans text-xs text-text-secondary uppercase tracking-wider hidden sm:block">Instrument</span>
                      <span className="font-sans text-xs text-text-secondary w-8 text-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <AnimatePresence initial={false}>
                        {activeTracks.map((track, i) => {
                          const playing = playingTrackId === track.id && isPlaying
                          return (
                            <motion.div
                              key={track.id}
                              layout
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 8, height: 0 }}
                              transition={{ duration: 0.18 }}
                              className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-4 py-3 hover:bg-surface group cursor-pointer transition-colors ${playing ? 'bg-accent-gold/5' : ''}`}
                              onClick={() => handlePlay(track.id)}
                            >
                              {/* Index / play indicator */}
                              <div className="w-6 text-center flex-shrink-0">
                                {playing ? (
                                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent-gold mx-auto"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                                  </motion.div>
                                ) : (
                                  <>
                                    <span className="font-sans text-sm text-text-secondary group-hover:hidden">{i + 1}</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-text-primary mx-auto hidden group-hover:block"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                  </>
                                )}
                              </div>

                              {/* Title + artist */}
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden">
                                  <Image src={track.img} alt={track.title} fill className="object-cover" unoptimized />
                                </div>
                                <div className="min-w-0">
                                  <p className={`font-sans text-sm font-medium truncate ${playing ? 'text-accent-gold' : 'group-hover:text-accent-gold'} transition-colors`}>{track.title}</p>
                                  <p className="font-sans text-xs text-text-secondary truncate">{track.artist}{track.taktart && ` · ${track.taktart}`}</p>
                                </div>
                              </div>

                              {/* Instrument */}
                              <span className="font-sans text-sm text-text-secondary hidden sm:block whitespace-nowrap">{track.instrument}</span>

                              {/* Duration + remove */}
                              <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                <span className="font-sans text-xs text-text-secondary">{track.duration}</span>
                                <button
                                  onClick={() => handleRemove(track.id)}
                                  title="Aus Playlist entfernen"
                                  className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-text-secondary hover:text-red-500 transition-colors"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                              </div>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
