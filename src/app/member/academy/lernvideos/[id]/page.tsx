'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const videoData = {
  id: 1,
  title: 'Dr Alperose',
  artist: 'Willi Valotti',
  composer: 'Willi Valotti',
  year: 1978,
  instrument: 'Handorgel',
  formation: 'Trio',
  meter: '3/4',
  difficulty: 3,
  level: 2,
  img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
  teacher: {
    name: 'Hansruedi Wenger',
    handle: '@hansruedi_wenger',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    instrument: 'Handorgel & Akkordeon',
    bio: 'Über 20 Jahre Unterrichtserfahrung. Mitglied der Ländlerkapelle Hess.',
    courses: 3,
    students: 156,
  },
  intro: 'Dr Alperose ist ein klassischer Ländlerwalzer im 3/4-Takt, komponiert von Willi Valotti im Jahr 1978. Das Stück gehört zum Standardrepertoire jeder Schweizer Ländlerkapelle und zeichnet sich durch seine eingängige Melodielinie und charakteristischen Begleitfiguren aus. Besondere Aufmerksamkeit verdient der harmonische Übergang von Teil A nach Teil B.',
  lyrics: `Teil A (1. Strophe)
Wo d'Alperose blüeht im Abedsunneschii,
Dört isch mis Herz, dört mueß i immer sii.
D'Vögu singe hell, dr Wind rauscht dür ds Tal,
S'isch niemes so schö wie dänk einisch amol.

Teil B (Refrain)
Alperose, du roti Blueme,
Du schaffsch mir Freud und nimmsch mini Grubme.
Im Herz bisch du tiif, wie s'Felse im See,
Und ohni di mag i niemer meh.`,
  voices: [
    { id: 'v1_ho', label: '1. Stimme Handorgel', volume: 80, muted: false, color: '#C4973A' },
    { id: 'v2_ho', label: '2. Stimme Handorgel', volume: 70, muted: false, color: '#C4973A' },
    { id: 'begl_ho', label: 'Begl. Handorgel', volume: 60, muted: true, color: '#C4973A' },
    { id: 'v1_oe', label: '1. Stimme Schwyzerörgeli', volume: 80, muted: false, color: '#5A8A6A' },
    { id: 'v2_oe', label: '2. Stimme Schwyzerörgeli', volume: 70, muted: false, color: '#5A8A6A' },
    { id: 'begl_oe', label: 'Begl. Schwyzerörgeli', volume: 60, muted: true, color: '#5A8A6A' },
    { id: 'bass', label: 'Begleitvorschlag Bass', volume: 75, muted: false, color: '#7A6A9A' },
    { id: 'klavier', label: 'Klavier + Bass', volume: 70, muted: true, color: '#7A6A9A' },
  ],
  stimmenVideos: [
    { id: 'sv1', label: '1. Stimme Handorgel', duration: '8 Min.', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', instrument: 'Handorgel' },
    { id: 'sv2', label: '2. Stimme Handorgel', duration: '7 Min.', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80', instrument: 'Handorgel' },
    { id: 'sv3', label: '1. Stimme Schwyzerörgeli', duration: '9 Min.', img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&q=80', instrument: 'Schwyzerörgeli' },
    { id: 'sv4', label: '2. Stimme Schwyzerörgeli', duration: '8 Min.', img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&q=80', instrument: 'Schwyzerörgeli' },
    { id: 'sv5', label: 'Bassbegleitung', duration: '6 Min.', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80', instrument: 'Bass' },
    { id: 'sv6', label: 'Klavierbegleitung', duration: '7 Min.', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80', instrument: 'Klavier' },
  ],
  learningVideos: [
    { id: 'lv1', label: '1. Stimme Handorgel – Teil 1', duration: '12 Min.', done: true },
    { id: 'lv2', label: '1. Stimme Handorgel – Teil 2', duration: '14 Min.', done: true },
    { id: 'lv3', label: '1. Stimme Handorgel – Teil 3', duration: '11 Min.', done: false },
    { id: 'lv4', label: '1. Stimme Schwyzerörgeli – Teil 1', duration: '13 Min.', done: false },
    { id: 'lv5', label: '2. Stimme Schwyzerörgeli – Teil 1', duration: '10 Min.', done: false },
    { id: 'lv6', label: 'Begleitversion Bass – Teil 1', duration: '9 Min.', done: false },
  ],
  sheets: [
    { label: 'Violinschlüssel', key: 'violin' },
    { label: 'Vl. Einfachtonart', key: 'violin-simple' },
    { label: 'Vl. Originaltonart', key: 'violin-orig' },
    { label: 'LAEMU-Notation', key: 'laemu' },
    { label: 'Griffschrift', key: 'griff' },
  ],
  originalRecordings: [
    { label: 'Originalaufnahme 1978 (Ur-Formation)', type: 'audio', artist: 'Willi Valotti' },
    { label: 'Hess-Rusch-Hegner Trio', type: 'youtube', artist: 'Live-Aufnahme 2019', url: '#' },
    { label: 'Bodästänix', type: 'youtube', artist: 'Konzert Luzern 2022', url: '#' },
    { label: 'Ländlerkapelle Schwyz', type: 'audio', artist: 'Studio 2015' },
  ],
}

const comments = [
  { user: 'maria_oergeli', name: 'Maria Kälin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', text: 'Wunderschönes Stück! Die Übergänge zwischen den Teilen sind super erklärt.', time: 'vor 3 Tagen', likes: 7 },
  { user: 'peter_bass', name: 'Peter Gasser', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', text: 'Für die Bassbegleitung: Achtet auf den Schlag auf die 2. Zählzeit im 2. Teil!', time: 'vor 1 Woche', likes: 12 },
  { user: 'lisa_piano', name: 'Lisa Frei', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', text: 'Die LAEMU-Notation macht es so viel einfacher zum Einstieg. Danke Hansruedi!', time: 'vor 2 Wochen', likes: 5 },
]

type Voice = { id: string; label: string; volume: number; muted: boolean; color: string }

function IconPlay() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> }
function IconPause() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> }
function IconVolume({ muted }: { muted: boolean }) {
  if (muted) return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
}
function IconStar({ filled }: { filled: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function IconPlus() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
function IconDownload() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }
function IconShare() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> }
function IconRepeat() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg> }
function IconMusic() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> }
function IconHeart({ filled }: { filled: boolean }) { return <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> }

function VoiceMixer({ voices }: { voices: Voice[] }) {
  const [state, setState] = useState<Voice[]>(voices)

  const toggleMute = (id: string) =>
    setState(prev => prev.map(v => v.id === id ? { ...v, muted: !v.muted } : v))
  const setVolume = (id: string, vol: number) =>
    setState(prev => prev.map(v => v.id === id ? { ...v, volume: vol } : v))
  const soloVoice = (id: string) =>
    setState(prev => {
      const isAlreadySolo = prev.filter(v => !v.muted).length === 1 && !prev.find(v => v.id === id)?.muted
      return isAlreadySolo
        ? prev.map(v => ({ ...v, muted: false }))
        : prev.map(v => ({ ...v, muted: v.id !== id }))
    })

  return (
    <div className="space-y-2">
      {state.map(voice => (
        <div key={voice.id} className={`flex items-center gap-3 py-1.5 px-2 transition-opacity ${voice.muted ? 'opacity-40' : ''}`}>
          <button
            onClick={() => soloVoice(voice.id)}
            className="font-sans text-[10px] uppercase tracking-wide w-6 h-5 flex items-center justify-center border border-border text-text-secondary hover:border-accent-gold hover:text-accent-gold transition-colors flex-shrink-0"
            title="Solo"
          >
            S
          </button>
          <button
            onClick={() => toggleMute(voice.id)}
            className={`flex items-center justify-center w-7 h-7 transition-colors flex-shrink-0 ${voice.muted ? 'text-text-secondary' : 'text-dark'}`}
            title={voice.muted ? 'Unmute' : 'Mute'}
          >
            <IconVolume muted={voice.muted} />
          </button>
          <span className="font-sans text-xs text-text-secondary w-44 flex-shrink-0 truncate">{voice.label}</span>
          <div className="flex-1 relative h-1 bg-border">
            <div
              className="absolute left-0 top-0 h-full transition-all"
              style={{ width: `${voice.muted ? 0 : voice.volume}%`, backgroundColor: voice.color }}
            />
            <input
              type="range" min={0} max={100}
              value={voice.muted ? 0 : voice.volume}
              onChange={e => setVolume(voice.id, parseInt(e.target.value))}
              disabled={voice.muted}
              className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-default"
              style={{ height: '100%' }}
            />
          </div>
          <span className="font-sans text-xs text-text-secondary w-8 text-right flex-shrink-0">
            {voice.muted ? '—' : `${voice.volume}%`}
          </span>
        </div>
      ))}
    </div>
  )
}

function VideoPlayer({ img, label, showMixer = false, voices }: { img: string; label: string; showMixer?: boolean; voices?: Voice[] }) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(100)
  const [loopEnabled, setLoopEnabled] = useState(false)
  const [loopA, setLoopA] = useState(20)
  const [loopB, setLoopB] = useState(70)
  const [progress] = useState(35)
  const [dragging, setDragging] = useState<null | 'A' | 'B'>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const speedOptions = [25, 50, 75, 100, 125, 150, 175, 200]

  const handleBarClick = (e: React.MouseEvent) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    if (loopEnabled && dragging === 'A') setLoopA(Math.min(pct, loopB - 5))
    if (loopEnabled && dragging === 'B') setLoopB(Math.max(pct, loopA + 5))
  }

  return (
    <div className="bg-dark">
      <div className="relative aspect-video overflow-hidden">
        <Image src={img} alt={label} fill className="object-cover opacity-60" unoptimized />
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => setPlaying(!playing)}
            className="w-20 h-20 bg-accent-gold hover:bg-accent-warm flex items-center justify-center transition-colors"
          >
            <span className={`text-white ${playing ? '' : 'ml-1'}`}>
              {playing ? <IconPause /> : <IconPlay />}
            </span>
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className="font-sans text-xs text-white/70 bg-black/50 px-2 py-1">{label}</span>
        </div>
        {loopEnabled && (
          <div className="absolute top-3 right-3">
            <span className="font-sans text-xs text-blue-300 bg-blue-900/60 px-2 py-1">Loop A–B</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 py-3 space-y-3">
        {/* Progress bar */}
        <div
          ref={barRef}
          className="relative h-2 bg-white/15 cursor-pointer"
          onClick={handleBarClick}
        >
          <div className="h-full bg-accent-gold/80" style={{ width: `${progress}%` }} />
          {loopEnabled && (
            <>
              <div
                className="absolute top-0 h-full bg-blue-400/25"
                style={{ left: `${loopA}%`, width: `${loopB - loopA}%` }}
              />
              <button
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full cursor-ew-resize hover:scale-125 transition-transform"
                style={{ left: `${loopA}%` }}
                onMouseDown={() => setDragging('A')}
                onMouseUp={() => setDragging(null)}
              />
              <button
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full cursor-ew-resize hover:scale-125 transition-transform"
                style={{ left: `${loopB}%` }}
                onMouseDown={() => setDragging('B')}
                onMouseUp={() => setDragging(null)}
              />
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="font-sans text-white/50 text-xs">3:42 / 12:15</span>

          {/* Speed */}
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs text-white/50">Tempo</span>
            <div className="flex gap-1">
              {speedOptions.map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`font-sans text-[10px] px-1.5 py-0.5 transition-colors ${speed === s ? 'bg-accent-gold text-white' : 'text-white/40 hover:text-white/80'}`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>

          {/* Loop toggle */}
          <button
            onClick={() => setLoopEnabled(!loopEnabled)}
            className={`flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 border transition-colors ${loopEnabled ? 'border-blue-400 text-blue-400 bg-blue-400/10' : 'border-white/20 text-white/50 hover:border-white/50'}`}
          >
            <IconRepeat />
            Loop A–B {loopEnabled ? 'AN' : 'AUS'}
          </button>
        </div>

        {loopEnabled && (
          <div className="flex items-center gap-4 text-xs font-sans text-white/50">
            <span>A: {loopA}%</span>
            <div className="flex-1 relative h-px bg-white/10">
              <div className="absolute top-1/2 -translate-y-1/2 h-2 bg-blue-400/30" style={{ left: `${loopA}%`, width: `${loopB - loopA}%` }} />
            </div>
            <span>B: {loopB}%</span>
          </div>
        )}
      </div>

      {showMixer && voices && (
        <div className="border-t border-white/10 px-4 py-4 bg-dark">
          <p className="font-sans text-xs uppercase tracking-widest text-white/40 mb-3">Stimmen-Mix</p>
          <VoiceMixer voices={voices} />
        </div>
      )}
    </div>
  )
}

export default function LernvideoDetailPage() {
  const v = videoData
  const [activeVideoTab, setActiveVideoTab] = useState<'master' | 'stimmen' | 'learn'>('master')
  const [activeLesson, setActiveLesson] = useState(v.learningVideos[0])
  const [activeStimme, setActiveStimme] = useState(v.stimmenVideos[0])
  const [favorited, setFavorited] = useState(false)
  const [showMixer, setShowMixer] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [comment, setComment] = useState('')
  const [transposeInst, setTransposeInst] = useState('Handorgel')
  const [activeSheet, setActiveSheet] = useState(v.sheets[0].label)
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({})

  return (
    <div className="min-h-screen bg-background">
      {/* TOP BAR */}
      <div className="bg-dark text-white px-6 py-3 flex items-center justify-between mt-20">
        <div className="flex items-center gap-4">
          <Link href="/member/academy/lernvideos" className="font-sans text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Datenbank
          </Link>
          <span className="text-white/20">/</span>
          <div>
            <h1 className="font-heading font-bold text-base leading-tight">{v.title}</h1>
            <p className="font-sans text-xs text-white/40">{v.artist} · {v.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFavorited(!favorited)}
            className={`flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 border transition-colors ${favorited ? 'border-accent-gold text-accent-gold' : 'border-white/20 text-white/50 hover:border-white/60'}`}
          >
            <span className={favorited ? 'text-accent-gold' : ''}><IconStar filled={favorited} /></span>
            {favorited ? 'Gespeichert' : 'Merken'}
          </button>
          <button className="flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 border border-white/20 text-white/50 hover:border-white/60 transition-colors">
            <IconPlus /> Playlist
          </button>
          <button className="flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 border border-white/20 text-white/50 hover:border-white/60 transition-colors">
            <IconShare /> Teilen
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* INTRO */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3">
                  <h2 className="font-heading text-2xl font-bold mb-1">{v.title}</h2>
                  <p className="font-sans text-accent-gold text-sm mb-3">{v.artist} · {v.year} · {v.composer !== v.artist ? `Komp.: ${v.composer}` : ''}</p>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4">{v.intro}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-sans text-xs px-2 py-1 bg-background border border-border flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                      {v.meter}
                    </span>
                    <span className="font-sans text-xs px-2 py-1 bg-background border border-border">{v.instrument}</span>
                    <span className="font-sans text-xs px-2 py-1 bg-background border border-border">{v.formation}</span>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <p className="font-sans text-xs text-text-secondary uppercase tracking-widest mb-2">Schwierigkeit</p>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={`flex-1 h-2 ${i < v.difficulty ? 'bg-accent-gold' : 'bg-border'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between font-sans text-sm py-2 border-b border-border">
                    <span className="text-text-secondary">Harmonielehre-Stufe</span>
                    <span className="font-medium">Stufe {v.level}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm py-2 border-b border-border">
                    <span className="text-text-secondary">Takt</span>
                    <span className="font-medium">{v.meter}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm py-2">
                    <span className="text-text-secondary">Instrumente</span>
                    <span className="font-medium">{v.instrument}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* VIDEO TABS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="flex border-b border-border mb-0">
                {[
                  { id: 'master', label: 'Master-Aufnahme' },
                  { id: 'stimmen', label: 'Einzelstimmen' },
                  { id: 'learn', label: 'Lernvideos' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveVideoTab(tab.id as typeof activeVideoTab)}
                    className={`px-5 py-3 font-sans text-sm font-medium transition-colors border-b-2 -mb-px ${activeVideoTab === tab.id ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* MASTER TAB */}
              {activeVideoTab === 'master' && (
                <div className="space-y-0">
                  <VideoPlayer img={v.img} label={`Master: ${v.title}`} showMixer={showMixer} voices={v.voices} />
                  <button
                    onClick={() => setShowMixer(!showMixer)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-t-0 border-border font-sans text-sm hover:bg-background transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
                      Stimmen-Mixer
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showMixer ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                </div>
              )}

              {/* STIMMEN TAB */}
              {activeVideoTab === 'stimmen' && (
                <div>
                  <VideoPlayer img={activeStimme.img} label={activeStimme.label} />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {v.stimmenVideos.map(sv => (
                      <button
                        key={sv.id}
                        onClick={() => setActiveStimme(sv)}
                        className={`group flex items-center gap-3 p-3 border text-left transition-all ${activeStimme.id === sv.id ? 'border-dark bg-dark text-white' : 'border-border bg-surface hover:border-dark'}`}
                      >
                        <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 ${activeStimme.id === sv.id ? 'bg-accent-gold text-white' : 'bg-border text-text-secondary group-hover:bg-dark group-hover:text-white'}`}>
                          <IconPlay />
                        </div>
                        <div className="min-w-0">
                          <p className={`font-sans text-xs font-medium truncate ${activeStimme.id === sv.id ? 'text-white' : ''}`}>{sv.label}</p>
                          <p className={`font-sans text-[10px] ${activeStimme.id === sv.id ? 'text-white/50' : 'text-text-secondary'}`}>{sv.duration}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* LEARN TAB */}
              {activeVideoTab === 'learn' && (
                <div>
                  <VideoPlayer img={v.img} label={activeLesson.label} />
                  <div className="mt-2 space-y-px bg-border">
                    {v.learningVideos.map(lv => (
                      <button
                        key={lv.id}
                        onClick={() => setActiveLesson(lv)}
                        className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${activeLesson.id === lv.id ? 'bg-dark text-white' : 'bg-surface hover:bg-background'}`}
                      >
                        <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs ${lv.done ? 'bg-accent-gold text-white' : activeLesson.id === lv.id ? 'bg-white/20 text-white' : 'bg-border text-text-secondary'}`}>
                          {lv.done
                            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            : <IconPlay />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-sans text-xs font-medium truncate ${activeLesson.id === lv.id ? 'text-white' : ''}`}>{lv.label}</p>
                        </div>
                        <span className={`font-sans text-xs whitespace-nowrap ${activeLesson.id === lv.id ? 'text-white/50' : 'text-text-secondary'}`}>{lv.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* NOTENBLÄTTER */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-surface border border-border p-6">
              <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                <IconMusic />
                Notenblätter
              </h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {v.sheets.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setActiveSheet(s.label)}
                    className={`font-sans text-xs px-3 py-2 border transition-colors ${activeSheet === s.label ? 'border-dark bg-dark text-white' : 'border-border hover:border-dark text-text-secondary'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="bg-background border border-border p-10 text-center mb-5">
                <div className="w-16 h-16 border-2 border-border flex items-center justify-center mx-auto mb-4 text-text-secondary">
                  <IconMusic />
                </div>
                <p className="font-heading font-bold text-base mb-1">{activeSheet}</p>
                <p className="font-sans text-sm text-text-secondary">{v.title} — {v.artist}</p>
                <p className="font-sans text-xs text-text-secondary mt-1">PDF-Vorschau</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button className="flex items-center gap-2 font-sans text-sm px-4 py-2.5 bg-dark text-white hover:bg-accent-gold transition-colors">
                  <IconDownload />
                  Noten herunterladen
                </button>
                <div className="flex items-center gap-2">
                  <select
                    value={transposeInst}
                    onChange={e => setTransposeInst(e.target.value)}
                    className="border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                  >
                    {['Handorgel', 'Schwyzerörgeli', 'Klarinette (B)', 'Trompete (B)', 'Altsaxofon', 'Violine'].map(i => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                  <button className="font-sans text-sm px-4 py-2.5 border border-border hover:border-dark text-text-secondary hover:text-dark transition-colors flex items-center gap-2">
                    <IconDownload />
                    Transponiert laden
                  </button>
                </div>
              </div>
            </motion.div>

            {/* LYRICS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface border border-border p-6">
              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className="w-full flex items-center justify-between font-heading font-bold text-lg hover:text-accent-gold transition-colors"
              >
                Liedtext
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showLyrics ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <AnimatePresence>
                {showLyrics && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <pre className="mt-4 font-sans text-sm text-text-secondary leading-loose whitespace-pre-wrap">{v.lyrics}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* LAEMU PLAYER */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-surface border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="font-heading font-bold text-lg mb-1">LAEMU Player</h3>
                <p className="font-sans text-sm text-text-secondary">Volle Kontrolle: Tempo von 25% bis 200%, jede Stimme einzeln regulierbar.</p>
              </div>
              <VideoPlayer img={v.img} label="LAEMU Player" showMixer voices={v.voices} />
            </motion.div>

            {/* ORIGINAL RECORDINGS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="bg-surface border border-border p-6">
              <h3 className="font-heading font-bold text-lg mb-5">Originalaufnahmen & Versionen</h3>
              <div className="space-y-2">
                {v.originalRecordings.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border hover:border-dark group transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-background border border-border flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
                        {r.type === 'youtube'
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
                        }
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium">{r.label}</p>
                        <p className="font-sans text-xs text-text-secondary">{r.artist} · {r.type === 'youtube' ? 'YouTube' : 'Audio'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="font-sans text-xs text-dark border border-border px-3 py-1.5 hover:bg-dark hover:text-white hover:border-dark transition-colors">
                        Abspielen
                      </button>
                      <button className="font-sans text-xs text-text-secondary border border-border px-3 py-1.5 hover:border-dark hover:text-dark transition-colors flex items-center gap-1">
                        <IconPlus /> Playlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* LEHRPERSON */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="bg-surface border border-border p-6">
              <h3 className="font-heading font-bold text-lg mb-4">Lehrperson</h3>
              <div className="flex items-start gap-5">
                <div className="relative w-20 h-20 overflow-hidden flex-shrink-0">
                  <Image src={v.teacher.img} alt={v.teacher.name} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" unoptimized />
                </div>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-lg">{v.teacher.name}</h4>
                  <p className="font-sans text-sm text-accent-gold mb-1">{v.teacher.instrument}</p>
                  <p className="font-sans text-sm text-text-secondary mb-3">{v.teacher.bio}</p>
                  <div className="flex items-center gap-5 text-sm font-sans mb-4">
                    <span><strong className="font-heading">{v.teacher.courses}</strong> <span className="text-text-secondary">Kurse</span></span>
                    <span><strong className="font-heading">{v.teacher.students}</strong> <span className="text-text-secondary">Schüler</span></span>
                  </div>
                  <Link
                    href="/member/community"
                    className="inline-flex items-center gap-2 font-sans text-sm px-4 py-2 border border-dark hover:bg-dark hover:text-white transition-colors"
                  >
                    Profil auf LAEMU ansehen
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* COMMUNITY COMMENTS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="bg-surface border border-border p-6">
              <h3 className="font-heading font-bold text-lg mb-5">Community-Kommentare ({comments.length})</h3>
              <div className="space-y-4 mb-6">
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="relative w-9 h-9 overflow-hidden flex-shrink-0">
                      <Image src={c.avatar} alt={c.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 bg-background p-4 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-sans font-semibold text-xs">{c.name}</p>
                        <span className="font-sans text-[10px] text-text-secondary">{c.time}</span>
                      </div>
                      <p className="font-sans text-sm text-text-secondary leading-relaxed mb-3">{c.text}</p>
                      <button
                        onClick={() => setCommentLikes(prev => ({ ...prev, [c.user]: !prev[c.user] }))}
                        className={`flex items-center gap-1.5 font-sans text-xs transition-colors ${commentLikes[c.user] ? 'text-accent-gold' : 'text-text-secondary hover:text-dark'}`}
                      >
                        <IconHeart filled={!!commentLikes[c.user]} />
                        {c.likes + (commentLikes[c.user] ? 1 : 0)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="relative w-9 h-9 overflow-hidden flex-shrink-0 bg-background border border-border flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    type="text"
                    placeholder="Kommentar schreiben..."
                    className="flex-1 border border-border px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                    onKeyDown={e => e.key === 'Enter' && setComment('')}
                  />
                  <button
                    onClick={() => setComment('')}
                    className="bg-dark text-white px-5 py-2.5 font-sans text-sm hover:bg-accent-gold transition-colors"
                  >
                    Senden
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div className="sticky top-8 space-y-4">
              {/* Learning videos list */}
              <div className="bg-surface border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-dark text-white">
                  <h3 className="font-heading font-bold text-sm">Lernvideos zu diesem Stück</h3>
                  <p className="font-sans text-xs text-white/40 mt-0.5">{v.learningVideos.filter(l => l.done).length} / {v.learningVideos.length} abgeschlossen</p>
                </div>
                <div>
                  {v.learningVideos.map(lv => (
                    <button
                      key={lv.id}
                      onClick={() => { setActiveLesson(lv); setActiveVideoTab('learn') }}
                      className={`w-full flex items-center gap-3 p-4 border-b border-border last:border-0 text-left transition-colors ${activeLesson.id === lv.id && activeVideoTab === 'learn' ? 'bg-dark text-white' : 'hover:bg-background'}`}
                    >
                      <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 ${lv.done ? 'bg-accent-gold text-white' : activeLesson.id === lv.id && activeVideoTab === 'learn' ? 'bg-white/20 text-white' : 'bg-border text-text-secondary'}`}>
                        {lv.done
                          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : <IconPlay />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-sans text-xs font-medium truncate ${activeLesson.id === lv.id && activeVideoTab === 'learn' ? 'text-white' : ''}`}>{lv.label}</p>
                        <span className={`font-sans text-[10px] ${activeLesson.id === lv.id && activeVideoTab === 'learn' ? 'text-white/40' : 'text-text-secondary'}`}>{lv.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stimmen quick nav */}
              <div className="bg-surface border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-heading font-bold text-sm">Einzelstimmen</h3>
                </div>
                <div>
                  {v.stimmenVideos.map(sv => (
                    <button
                      key={sv.id}
                      onClick={() => { setActiveStimme(sv); setActiveVideoTab('stimmen') }}
                      className={`w-full flex items-center gap-3 p-3 border-b border-border last:border-0 text-left transition-colors ${activeStimme.id === sv.id && activeVideoTab === 'stimmen' ? 'bg-dark text-white' : 'hover:bg-background'}`}
                    >
                      <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${activeStimme.id === sv.id && activeVideoTab === 'stimmen' ? 'text-accent-gold' : 'text-text-secondary'}`}>
                        <IconPlay />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-sans text-xs truncate ${activeStimme.id === sv.id && activeVideoTab === 'stimmen' ? 'text-white font-medium' : ''}`}>{sv.label}</p>
                      </div>
                      <span className={`font-sans text-[10px] ${activeStimme.id === sv.id && activeVideoTab === 'stimmen' ? 'text-white/40' : 'text-text-secondary'}`}>{sv.duration}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-surface border border-border p-4 space-y-2">
                <h4 className="font-heading font-bold text-sm mb-3">Aktionen</h4>
                <button
                  onClick={() => setFavorited(!favorited)}
                  className={`w-full flex items-center gap-2 font-sans text-sm px-3 py-2.5 border transition-colors ${favorited ? 'border-accent-gold text-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark text-text-secondary'}`}
                >
                  <IconStar filled={favorited} />
                  {favorited ? 'Als Favorit gespeichert' : 'Als Favorit merken'}
                </button>
                <button className="w-full flex items-center gap-2 font-sans text-sm px-3 py-2.5 border border-border hover:border-dark text-text-secondary transition-colors">
                  <IconPlus /> Zur Playlist hinzufügen
                </button>
                <button className="w-full flex items-center gap-2 font-sans text-sm px-3 py-2.5 border border-border hover:border-dark text-text-secondary transition-colors">
                  <IconShare /> Teilen
                </button>
                <button className="w-full flex items-center gap-2 font-sans text-sm px-3 py-2.5 border border-border hover:border-dark text-text-secondary transition-colors">
                  <IconDownload /> Noten herunterladen
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
