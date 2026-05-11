'use client'

import React, { useState } from 'react'
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
  teacher: { name: 'Hansruedi Wenger', handle: '@hansruedi_akkordeon', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', instrument: 'Handorgel' },
  intro: 'Dr Alperose ist ein klassischer Ländlerwalzer im 3/4-Takt, komponiert von Willi Valotti im Jahr 1978. Das Stück gehört zum Standardrepertoire jeder Schweizer Ländlerkapelle und zeichnet sich durch seine eingängige Melodielinie und charakteristischen Begleitfiguren aus.',
  voices: [
    { id: 'v1_ho', label: '1. Stimme Handorgel', volume: 80, muted: false },
    { id: 'v2_ho', label: '2. Stimme Handorgel', volume: 70, muted: false },
    { id: 'begl_ho', label: 'Begleitvorschlag Handorgel', volume: 60, muted: true },
    { id: 'v1_oe', label: '1. Stimme Schwyzerörgeli', volume: 80, muted: false },
    { id: 'v2_oe', label: '2. Stimme Schwyzerörgeli', volume: 70, muted: false },
    { id: 'begl_oe', label: 'Begleitvorschlag Schwyzerörgeli', volume: 60, muted: true },
    { id: 'bass', label: 'Begleitvorschlag Bass', volume: 75, muted: false },
    { id: 'klavier', label: 'Begleitvorschlag Klavier + Bass', volume: 70, muted: true },
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
    { label: 'Violinschlüssel', icon: '🎼' },
    { label: 'Violinschlüssel Einfachtonart', icon: '🎼' },
    { label: 'Violinschlüssel Originaltonart', icon: '🎼' },
    { label: 'LAEMU-Tonart', icon: '🎵' },
    { label: 'Griffschrift', icon: '✋' },
  ],
  originalRecordings: [
    { label: 'Originalaufnahme 1978 (Ur-Formation)', type: 'audio' },
    { label: 'Hess-Rusch-Hegner (YouTube)', type: 'youtube', url: 'https://youtube.com' },
    { label: 'Bodästänix (YouTube)', type: 'youtube', url: 'https://youtube.com' },
  ],
}

const comments = [
  { user: 'maria_oergeli', name: 'Maria Kälin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', text: 'Wunderschönes Stück! Die Übergänge zwischen den Teilen sind super erklärt.', time: 'vor 3 Tagen' },
  { user: 'peter_bass', name: 'Peter Gasser', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', text: 'Für die Bassbegleitung: Achtet auf den Schlag auf die 2. Zählzeit im 2. Teil!', time: 'vor 1 Woche' },
]

type Voice = { id: string; label: string; volume: number; muted: boolean }

function VoiceMixer({ voices }: { voices: Voice[] }) {
  const [state, setState] = useState<Voice[]>(voices)

  const toggleMute = (id: string) => setState((prev: Voice[]) => prev.map((v: Voice) => v.id === id ? { ...v, muted: !v.muted } : v))
  const setVolume = (id: string, vol: number) => setState((prev: Voice[]) => prev.map((v: Voice) => v.id === id ? { ...v, volume: vol } : v))

  return (
    <div className="space-y-3">
      {state.map(voice => (
        <div key={voice.id} className="flex items-center gap-3">
          <button onClick={() => toggleMute(voice.id)} className={`w-7 h-7 flex items-center justify-center rounded transition-colors flex-shrink-0 ${voice.muted ? 'bg-red-100 text-red-500' : 'bg-accent-gold/10 text-accent-gold'}`}>
            {voice.muted ? '🔇' : '🔊'}
          </button>
          <span className="font-sans text-xs text-text-secondary w-44 flex-shrink-0 truncate">{voice.label}</span>
          <input
            type="range" min={0} max={100} value={voice.muted ? 0 : voice.volume}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume(voice.id, parseInt(e.target.value))}
            disabled={voice.muted}
            className="flex-1 accent-accent-gold disabled:opacity-30"
          />
          <span className="font-sans text-xs text-text-secondary w-8 text-right flex-shrink-0">{voice.muted ? 0 : voice.volume}%</span>
        </div>
      ))}
    </div>
  )
}

function VideoPlayer({ img, label }: { img: string; label: string }) {
  const [speed, setSpeed] = useState(100)
  const [loopA, setLoopA] = useState(20)
  const [loopB, setLoopB] = useState(70)
  const [loopEnabled, setLoopEnabled] = useState(false)

  return (
    <div className="bg-dark">
      <div className="relative aspect-video overflow-hidden">
        <Image src={img} alt={label} fill className="object-cover opacity-70" unoptimized />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-20 h-20 rounded-full bg-accent-gold flex items-center justify-center hover:bg-accent-earth transition-colors">
            <span className="text-white text-3xl ml-2">▶</span>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-white/20 h-1.5 rounded-full relative">
              <div className="bg-accent-gold h-1.5 rounded-full" style={{ width: '35%' }} />
              {loopEnabled && (
                <>
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full cursor-ew-resize" style={{ left: `${loopA}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full cursor-ew-resize" style={{ left: `${loopB}%` }} />
                  <div className="absolute top-0 h-1.5 bg-blue-400/30" style={{ left: `${loopA}%`, width: `${loopB - loopA}%` }} />
                </>
              )}
            </div>
            <span className="font-sans text-white/60 text-xs whitespace-nowrap">3:42 / 12:15</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs text-white/60">Tempo:</span>
              <input type="range" min={25} max={200} value={speed} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpeed(parseInt(e.target.value))} className="w-24 accent-accent-gold" />
              <span className="font-sans text-xs text-accent-gold font-medium w-10">{speed}%</span>
            </div>
            <button onClick={() => setLoopEnabled(!loopEnabled)} className={`flex items-center gap-1 font-sans text-xs px-2 py-1 border transition-colors ${loopEnabled ? 'border-blue-400 text-blue-400' : 'border-white/30 text-white/60 hover:border-white/60'}`}>
              🔁 Loop {loopEnabled ? 'AN' : 'AUS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LernvideoDetailPage() {
  const v = videoData
  const [activeVideoTab, setActiveVideoTab] = useState<'master' | 'learn'>('master')
  const [activeLesson, setActiveLesson] = useState(v.learningVideos[0])
  const [favorited, setFavorited] = useState(false)
  const [showMixer, setShowMixer] = useState(false)
  const [comment, setComment] = useState('')
  const [transposeInst, setTransposeInst] = useState('Handorgel')
  const [activeSheet, setActiveSheet] = useState(v.sheets[0].label)

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between sticky top-20 z-20">
        <div className="flex items-center gap-4">
          <Link href="/member/academy/lernvideos" className="font-sans text-sm text-text-secondary hover:text-text-primary transition-colors">← Datenbank</Link>
          <div>
            <h1 className="font-serif font-bold text-lg">{v.title}</h1>
            <p className="font-sans text-xs text-text-secondary">{v.artist} · {v.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFavorited(!favorited)} className={`p-2 rounded transition-colors ${favorited ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold'}`}>
            {favorited ? '⭐' : '☆'}
          </button>
          <span className="font-sans text-xs text-text-secondary border border-border px-2 py-1">CHF 18.–</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Videos + content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Intro */}
            <div className="bg-surface border border-border p-6">
              <h2 className="font-serif font-bold text-xl mb-3">Über das Stück</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4">{v.intro}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-sans text-xs px-2 py-1 bg-background border border-border">🎵 {v.meter}</span>
                    <span className="font-sans text-xs px-2 py-1 bg-background border border-border">🪗 {v.instrument}</span>
                    <span className="font-sans text-xs px-2 py-1 bg-background border border-border">👫 {v.formation}</span>
                    <span className="font-sans text-xs px-2 py-1 bg-background border border-border">📅 {v.year}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Schwierigkeit</span>
                    <div className="flex gap-1">{Array.from({ length: 6 }).map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-sm ${i < v.difficulty ? 'bg-accent-gold' : 'bg-border'}`} />)}</div>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Harmonielehre-Stufe</span>
                    <span className="font-medium">Stufe {v.level}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Komponist</span>
                    <span className="font-medium">{v.composer}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video tabs */}
            <div>
              <div className="flex border-b border-border mb-4">
                <button onClick={() => setActiveVideoTab('master')} className={`px-5 py-3 font-sans text-sm font-medium transition-colors border-b-2 ${activeVideoTab === 'master' ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
                  🎬 Master-Aufnahme
                </button>
                <button onClick={() => setActiveVideoTab('learn')} className={`px-5 py-3 font-sans text-sm font-medium transition-colors border-b-2 ${activeVideoTab === 'learn' ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
                  🎓 Lernvideos
                </button>
              </div>

              {activeVideoTab === 'master' && (
                <div className="space-y-4">
                  <VideoPlayer img={v.img} label={`Master: ${v.title}`} />
                  <div className="bg-surface border border-border p-4">
                    <button onClick={() => setShowMixer(!showMixer)} className="flex items-center justify-between w-full font-sans text-sm font-medium hover:text-accent-gold transition-colors">
                      <span>🎚️ Stimmen-Mixer</span>
                      <span className="text-text-secondary">{showMixer ? '▲' : '▼'}</span>
                    </button>
                    <AnimatePresence>
                      {showMixer && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="mt-4">
                            <VoiceMixer voices={v.voices} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {activeVideoTab === 'learn' && (
                <div>
                  <VideoPlayer img={v.img} label={activeLesson.label} />
                  <div className="mt-4 bg-surface border border-border p-4">
                    <h4 className="font-serif font-bold text-sm mb-3">Aktiv: {activeLesson.label}</h4>
                  </div>
                </div>
              )}
            </div>

            {/* Sheet music */}
            <div className="bg-surface border border-border p-6">
              <h3 className="font-serif font-bold text-lg mb-4">Notenblätter</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {v.sheets.map(s => (
                  <button key={s.label} onClick={() => setActiveSheet(s.label)} className={`flex items-center gap-1.5 font-sans text-xs px-3 py-2 border transition-colors ${activeSheet === s.label ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-border hover:border-accent-gold text-text-secondary'}`}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
              <div className="bg-background border border-border p-8 text-center mb-4">
                <span className="text-4xl block mb-2">🎼</span>
                <p className="font-sans text-sm text-text-secondary">{activeSheet} – Dr Alperose</p>
                <p className="font-sans text-xs text-text-secondary mt-1">Notenvorschau wird hier dargestellt</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button className="flex items-center gap-2 font-sans text-sm text-accent-gold border border-accent-gold px-4 py-2 hover:bg-accent-gold hover:text-white transition-colors">
                  ⬇️ Noten herunterladen
                </button>
                <div className="flex items-center gap-2">
                  <select value={transposeInst} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTransposeInst(e.target.value)} className="border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold bg-surface">
                    {['Handorgel', 'Schwyzerörgeli', 'Klarinette (B)', 'Trompete (B)', 'Altsaxofon', 'Violine'].map(i => <option key={i}>{i}</option>)}
                  </select>
                  <button className="font-sans text-sm bg-accent-gold text-white px-3 py-2 hover:bg-accent-earth transition-colors">Transponieren & laden</button>
                </div>
              </div>
            </div>

            {/* LAEMU Player */}
            <div className="bg-surface border border-border p-6">
              <h3 className="font-serif font-bold text-lg mb-4">LAEMU-Player</h3>
              <p className="font-sans text-sm text-text-secondary mb-4">Stelle den Mix selbst zusammen, passe die Geschwindigkeit an und mute einzelne Stimmen.</p>
              <VideoPlayer img={v.img} label="LAEMU-Player" />
              <div className="mt-4">
                <VoiceMixer voices={v.voices} />
              </div>
            </div>

            {/* Original recordings */}
            <div className="bg-surface border border-border p-6">
              <h3 className="font-serif font-bold text-lg mb-4">Originalaufnahmen & weitere Versionen</h3>
              <div className="space-y-3">
                {v.originalRecordings.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border hover:border-accent-gold transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{r.type === 'youtube' ? '▶️' : '🎵'}</span>
                      <div>
                        <p className="font-sans text-sm font-medium">{r.label}</p>
                        <span className="font-sans text-xs text-text-secondary">{r.type === 'youtube' ? 'YouTube' : 'Audio'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="font-sans text-xs text-accent-gold hover:text-accent-earth transition-colors">Abspielen</button>
                      <button className="font-sans text-xs text-text-secondary hover:text-accent-gold transition-colors">+ Playlist</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher */}
            <div className="bg-surface border border-border p-6">
              <h3 className="font-serif font-bold text-lg mb-4">Lehrperson</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={v.teacher.img} alt={v.teacher.name} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h4 className="font-serif font-bold">{v.teacher.name}</h4>
                  <p className="font-sans text-sm text-text-secondary">{v.teacher.instrument}</p>
                  <Link href="/member/community" className="font-sans text-xs text-accent-gold hover:text-accent-earth transition-colors">Profil anzeigen {v.teacher.handle} →</Link>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-surface border border-border p-6">
              <h3 className="font-serif font-bold text-lg mb-4">Community-Kommentare ({comments.length})</h3>
              <div className="space-y-4 mb-6">
                {comments.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={c.avatar} alt={c.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 bg-background p-3 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-sans font-semibold text-xs">{c.name}</p>
                        <span className="font-sans text-[10px] text-text-secondary">{c.time}</span>
                      </div>
                      <p className="font-sans text-sm text-text-secondary">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={comment} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)} type="text" placeholder="Kommentar schreiben..." className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
                <button className="bg-accent-gold text-white px-4 py-2 font-sans text-sm hover:bg-accent-earth transition-colors">Senden</button>
              </div>
            </div>
          </div>

          {/* RIGHT: lesson list */}
          <div>
            <div className="sticky top-36 space-y-6">
              <div className="bg-surface border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-serif font-bold text-sm">Lernvideos zu diesem Stück</h3>
                </div>
                <div>
                  {v.learningVideos.map((lv) => (
                    <button key={lv.id} onClick={() => { setActiveLesson(lv); setActiveVideoTab('learn') }} className={`w-full flex items-center gap-3 p-4 border-b border-border last:border-0 text-left transition-colors ${activeLesson.id === lv.id && activeVideoTab === 'learn' ? 'bg-accent-gold/5' : 'hover:bg-background'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${lv.done ? 'bg-muted-green text-white' : 'bg-border text-text-secondary'}`}>
                        {lv.done ? '✓' : '▶'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs font-medium truncate">{lv.label}</p>
                        <span className="font-sans text-[10px] text-text-secondary">{lv.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-surface border border-border p-4 space-y-2">
                <h4 className="font-serif font-bold text-sm mb-3">Aktionen</h4>
                <button onClick={() => setFavorited(!favorited)} className={`w-full flex items-center gap-2 font-sans text-sm px-3 py-2.5 border transition-colors ${favorited ? 'border-accent-gold text-accent-gold bg-accent-gold/5' : 'border-border hover:border-accent-gold text-text-secondary'}`}>
                  {favorited ? '⭐' : '☆'} {favorited ? 'Als Favorit gespeichert' : 'Als Favorit markieren'}
                </button>
                <button className="w-full flex items-center gap-2 font-sans text-sm px-3 py-2.5 border border-border hover:border-accent-gold text-text-secondary transition-colors">
                  🎵 Zur Playlist hinzufügen
                </button>
                <button className="w-full flex items-center gap-2 font-sans text-sm px-3 py-2.5 border border-border hover:border-accent-gold text-text-secondary transition-colors">
                  ↗ Teilen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
