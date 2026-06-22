'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MemberTabs } from '@/components/MemberTabs'
import { MemberTopBar } from '@/components/MemberTopBar'
import { InstrumentTagPicker, PRESET_INSTRUMENTS } from '@/components/InstrumentTagPicker'
import { useUserProfile, readStoredProfile, handleFromName } from '@/lib/userProfile'

// ─── Offizielle LAEMU-Kanäle ──────────────────────────────────────────────────
// Zentrale Stelle für die echten Links — hier eintragen, sobald verfügbar.
const LAEMU_INSTAGRAM_HANDLE = 'laemu.ch'
const LAEMU_INSTAGRAM_URL = `https://www.instagram.com/${LAEMU_INSTAGRAM_HANDLE}`
// Geschlossene WhatsApp-Gruppen — echte Einladungslinks hier eintragen.
const LAEMU_WHATSAPP_INFO_GROUP_URL = 'https://chat.whatsapp.com/'
const LAEMU_WHATSAPP_SHARE_GROUP_URL = 'https://chat.whatsapp.com/'

// ─── SVG Icon Set ─────────────────────────────────────────────────────────────

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
}
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )
}
function IconHomeSimple() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  )
}
function IconHeart({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  )
}
function IconCamera() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}
function IconVideo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  )
}
function IconPlay() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  )
}
function IconUpload() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
}
function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  )
}
function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    </svg>
  )
}
function IconLaptop() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  )
}
function IconBlock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  )
}
function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}
function IconKey() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  )
}
function IconLocation() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function IconBilling() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}
function IconInstagram({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}
function IconWhatsApp({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
    </svg>
  )
}
function IconComment16() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  )
}

// ─── Eigene Profil-Beiträge (nur Foto & Video) ────────────────────────────────
// In der Community ergänzt man sein Profil ausschliesslich mit Foto- und
// Video-Beiträgen. Links, Texte und Events lassen sich nicht teilen.

type ProfilePost = {
  id: number
  type: 'photo' | 'video'
  img: string
  caption: string
  time: string
  likes: number
  comments: number
}

const profilePosts: ProfilePost[] = [
  {
    id: 1,
    type: 'photo',
    img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
    caption: 'Probetag in Luzern 🎶 — wir bereiten uns aufs Frühlingskonzert vor.',
    time: 'vor 2 Stunden',
    likes: 47,
    comments: 12,
  },
  {
    id: 2,
    type: 'video',
    img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80',
    caption: 'Eine kleine Improvisation auf dem Schwyzerörgeli — traditionell mit eigenem Touch.',
    time: 'vor 5 Stunden',
    likes: 89,
    comments: 23,
  },
  {
    id: 3,
    type: 'photo',
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    caption: 'Unvergesslicher Abend mit der Kapelle. Danke an alle, die dabei waren!',
    time: 'vor 3 Tagen',
    likes: 134,
    comments: 41,
  },
]

const navItems = [
  { icon: <IconHomeSimple />, label: 'Start', id: 'start' },
  { icon: <IconUser />, label: 'Mein Profil', id: 'profile' },
  { icon: <IconSearch />, label: 'Entdecken', id: 'discover' },
  { icon: <IconSettings />, label: 'Einstellungen', id: 'settings' },
]

// Andere Mitglieder, die unter «Entdecken» sichtbar sind (im echten Betrieb:
// alle, die ihr Profil nicht verborgen haben). Die strukturierten Felder
// (Instrument, Region, Lehrperson …) speisen die Filter — Personen geben diese
// Infos frei, indem sie sie in ihrem Profil öffentlich teilen.
type DiscoverProfile = {
  name: string
  handle: string
  img: string
  instruments: string[]
  region: string
  isTeacher: boolean
  inFormation: boolean
  openForFormation: boolean
}

const discoverProfiles: DiscoverProfile[] = [
  { name: 'Maria Kälin', handle: 'maria', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', instruments: ['Schwyzerörgeli'], region: 'Schwyz', isTeacher: false, inFormation: true, openForFormation: false },
  { name: 'Hansruedi Wenger', handle: 'hansruedi', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', instruments: ['Handorgel'], region: 'Luzern', isTeacher: true, inFormation: true, openForFormation: false },
  { name: 'Peter Gasser', handle: 'peter', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', instruments: ['Klarinette'], region: 'Nidwalden', isTeacher: false, inFormation: false, openForFormation: true },
  { name: 'Lisa Frei', handle: 'lisa', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', instruments: ['Klavierbegleitung'], region: 'Zug', isTeacher: true, inFormation: false, openForFormation: true },
  { name: 'Anna Steiner', handle: 'anna', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', instruments: ['Handorgel', 'Schwyzerörgeli'], region: 'Appenzell', isTeacher: false, inFormation: true, openForFormation: true },
]

// Anzeigetext (Instrument · Region) für eine Karte.
const profileRole = (p: DiscoverProfile) => `${p.instruments.join(', ')} · ${p.region}`

// Instrument-Filter: dieselben Instrumente wie im Profil-Editor (ohne «Sonstiges»,
// das wird nur im Profil angezeigt, nicht gefiltert).
const ALL_INSTRUMENTS = PRESET_INSTRUMENTS
// Regionen weiterhin aus den Profilen abgeleitet (alphabetisch).
const ALL_REGIONS = Array.from(new Set(discoverProfiles.map(p => p.region))).sort()

function DiscoverView() {
  const [query, setQuery] = useState('')
  // Filter (nur sichtbar für Personen, die ihre Infos öffentlich teilen).
  // Formations-Status ist eine Einfachauswahl: entweder «offen», «spielt in
  // einer Formation» oder keines von beiden.
  const [formationFilter, setFormationFilter] = useState<'' | 'open' | 'inFormation'>('')
  const [instrument, setInstrument] = useState('')
  const [region, setRegion] = useState('')

  const pickFormation = (val: 'open' | 'inFormation') =>
    setFormationFilter(prev => (prev === val ? '' : val))

  const activeFilters =
    Number(Boolean(formationFilter)) + Number(Boolean(instrument)) + Number(Boolean(region))

  const resetFilters = () => {
    setFormationFilter('')
    setInstrument('')
    setRegion('')
  }

  const q = query.trim().toLowerCase()
  const results = discoverProfiles.filter(p => {
    if (q && !p.name.toLowerCase().includes(q) && !profileRole(p).toLowerCase().includes(q)) return false
    if (formationFilter === 'open' && !p.openForFormation) return false
    if (formationFilter === 'inFormation' && !p.inFormation) return false
    if (instrument && !p.instruments.includes(instrument)) return false
    if (region && p.region !== region) return false
    return true
  })

  const chip = (active: boolean) =>
    `font-sans text-xs font-medium px-3 py-1.5 border transition-colors ${
      active ? 'border-dark bg-dark text-white' : 'border-border bg-surface text-text-secondary hover:border-dark'
    }`

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-bold text-lg mb-1">Entdecken</h3>
        <p className="font-sans text-sm font-light text-text-secondary leading-relaxed">
          Finde andere Mitglieder der LAEMU-Szene. Hier erscheinen nur Personen, die ihr Profil
          nicht verborgen haben. Filtern kannst du nach Angaben, die diese Personen in ihrem Profil
          öffentlich teilen.
        </p>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mitglieder suchen — Name oder Instrument…"
          className="w-full border border-border pl-10 pr-9 py-3 font-sans text-sm font-light focus:outline-none focus:border-dark bg-surface"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-dark transition-colors"
            aria-label="Suche zurücksetzen"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {/* Filter — basierend auf öffentlich geteilten Profilangaben */}
      <div className="bg-surface border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-sans text-xs uppercase tracking-[0.15em] text-text-secondary">Filtern nach</p>
          {activeFilters > 0 && (
            <button onClick={resetFilters} className="font-sans text-xs text-accent-gold hover:text-dark transition-colors">
              Filter zurücksetzen ({activeFilters})
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => pickFormation('open')} className={chip(formationFilter === 'open')}>Offen für Formation</button>
          <button onClick={() => pickFormation('inFormation')} className={chip(formationFilter === 'inFormation')}>Spielt in einer Formation</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-sans text-xs text-text-secondary block mb-1">Instrument</label>
            <select
              value={instrument}
              onChange={e => setInstrument(e.target.value)}
              className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
            >
              <option value="">Alle Instrumente</option>
              {ALL_INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="font-sans text-xs text-text-secondary block mb-1">Region</label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
            >
              <option value="">Alle Regionen</option>
              {ALL_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {results.map((p) => (
          <div key={p.handle} className="bg-surface border border-border flex items-center gap-3 p-4 hover:border-dark transition-colors group">
            <Link href={`/member/u/${p.handle}`} className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
              <Image src={p.img} alt={p.name} fill className="object-cover" unoptimized />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/member/u/${p.handle}`} className="font-sans font-semibold text-sm group-hover:text-accent-gold transition-colors">{p.name}</Link>
              <p className="font-sans text-xs font-light text-text-secondary">{profileRole(p)}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {p.isTeacher && <span className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">Musiklehrer</span>}
                {p.inFormation && <span className="font-sans text-[10px] px-1.5 py-0.5 bg-background border border-border text-text-secondary">In Formation</span>}
                {p.openForFormation && <span className="font-sans text-[10px] px-1.5 py-0.5 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">Offen für Formation</span>}
              </div>
            </div>
            <Link
              href={`/member/u/${p.handle}`}
              className="font-sans text-xs font-medium px-3 py-1.5 border border-dark text-dark hover:bg-dark hover:text-white transition-colors whitespace-nowrap self-start"
            >
              Profil ansehen →
            </Link>
          </div>
        ))}
        {results.length === 0 && (
          <div className="bg-surface border border-border p-8 text-center">
            <p className="font-sans text-sm text-text-secondary">Keine Profile gefunden.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Start: schlanke Community-Landingpage ────────────────────────────────────
// Verlinkt die offiziellen LAEMU-Kanäle (Instagram für Eindrücke, geschlossene
// WhatsApp-Gruppe für News). Bewusst ohne Feed, Gruppen oder Chats.

function StartView() {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6 sm:p-8">
        <h2 className="font-heading font-black text-2xl mb-2">Willkommen in der LAEMU-Community</h2>
        <p className="font-sans text-sm font-light text-text-secondary leading-relaxed">
          Hier bleibst du mit der LAEMU-Szene verbunden — ganz schlank gehalten. Folge uns auf
          Instagram für Eindrücke und tritt der geschlossenen WhatsApp-Gruppe bei, um keine News
          zu verpassen. Dein eigenes Profil kannst du jederzeit mit Foto- und Video-Beiträgen ergänzen.
        </p>
      </div>

      {/* Instagram */}
      <a
        href={LAEMU_INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-surface border border-border p-6 hover:border-dark transition-colors group"
      >
        <div className="flex items-center gap-4">
          <span className="w-12 h-12 flex items-center justify-center bg-dark text-white flex-shrink-0 group-hover:bg-accent-gold transition-colors">
            <IconInstagram />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-base">LAEMU auf Instagram</h3>
            <p className="font-sans text-sm font-light text-text-secondary leading-snug">
              Folge <span className="text-accent-gold">@{LAEMU_INSTAGRAM_HANDLE}</span> für Einblicke,
              Stücke und Eindrücke aus der Szene.
            </p>
          </div>
          <span className="font-sans text-sm text-text-secondary group-hover:text-accent-gold transition-colors flex-shrink-0">→</span>
        </div>
      </a>

      {/* Geschlossene WhatsApp-Gruppen */}
      <div>
        <h3 className="font-heading font-bold text-lg mb-1">WhatsApp-Gruppen</h3>
        <p className="font-sans text-sm font-light text-text-secondary leading-relaxed mb-4">
          Tritt unseren geschlossenen WhatsApp-Gruppen bei. Da du dort deine Telefonnummer freigibst,
          behandle sie bitte vertraulich. Für Fragen zu Lernvideos nutzt du am besten die{' '}
          <Link href="/member/academy/lernvideos" className="text-accent-gold hover:text-dark transition-colors font-medium">
            Kommentarfunktion unterhalb der Videos
          </Link>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Info-Gruppe */}
          <div className="bg-surface border border-border p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-11 h-11 flex items-center justify-center bg-dark text-white flex-shrink-0">
                <IconWhatsApp />
              </span>
              <div className="min-w-0">
                <h4 className="font-heading font-bold text-base leading-tight">Info-Gruppe</h4>
                <p className="font-sans text-xs text-text-secondary">Nur News vom LAEMU-Team</p>
              </div>
            </div>
            <p className="font-sans text-sm font-light text-text-secondary leading-snug flex-1 mb-4">
              In dieser geschlossenen Gruppe postet nur das LAEMU-Team wichtige Ankündigungen, Termine
              und Neuigkeiten rund um LAEMU — kompakt und ohne Geplauder.
            </p>
            <a
              href={LAEMU_WHATSAPP_INFO_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-dark text-white font-sans text-sm font-medium px-5 py-2.5 hover:bg-accent-gold transition-colors"
            >
              <IconWhatsApp size={16} /> Info-Gruppe beitreten
            </a>
          </div>

          {/* Austausch-Gruppe */}
          <div className="bg-surface border border-border p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-11 h-11 flex items-center justify-center bg-accent-gold text-white flex-shrink-0">
                <IconWhatsApp />
              </span>
              <div className="min-w-0">
                <h4 className="font-heading font-bold text-base leading-tight">Austausch-Gruppe</h4>
                <p className="font-sans text-xs text-text-secondary">Inspiration &amp; Teilen</p>
              </div>
            </div>
            <p className="font-sans text-sm font-light text-text-secondary leading-snug flex-1 mb-4">
              In dieser geschlossenen Gruppe inspiriert ihr euch gegenseitig: Teilt Videos, Bilder und
              Stücke aus dem LAEMU-Leben — von Auftritten, Musikhöcks und spontanen Momenten.
            </p>
            <a
              href={LAEMU_WHATSAPP_SHARE_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-dark text-dark font-sans text-sm font-medium px-5 py-2.5 hover:bg-dark hover:text-white transition-colors"
            >
              <IconWhatsApp size={16} /> Austausch-Gruppe beitreten
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Composer: nur Foto- & Video-Beiträge fürs eigene Profil ──────────────────

function PostComposerModal({ initialType, onClose }: { initialType: 'photo' | 'video'; onClose: () => void }) {
  const [type, setType] = useState<'photo' | 'video'>(initialType)
  const [caption, setCaption] = useState('')
  const profile = useUserProfile()
  const avatarSrc = profile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'

  const types = [
    { id: 'photo' as const, label: 'Foto', icon: <IconCamera /> },
    { id: 'video' as const, label: 'Video', icon: <IconVideo /> },
  ]

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-surface w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image src={avatarSrc} alt="You" fill className="object-cover" unoptimized />
            </div>
            <div>
              <p className="font-heading font-bold text-sm">{profile.name}</p>
              <p className="font-sans text-xs text-accent-gold">@{handleFromName(profile.name)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors text-text-secondary hover:text-dark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Type tabs — nur Foto & Video */}
        <div className="flex border-b border-border">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 font-sans text-xs font-medium transition-colors border-b-2 ${type === t.id ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="border-2 border-dashed border-border hover:border-dark transition-colors p-8 text-center cursor-pointer group">
            <div className="flex justify-center mb-2 text-text-secondary group-hover:text-dark transition-colors">
              {type === 'photo' ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              )}
            </div>
            <p className="font-sans text-sm text-text-secondary">{type === 'photo' ? 'Foto auswählen' : 'Video hochladen'}</p>
            <p className="font-sans text-xs text-text-secondary/60 mt-1">{type === 'photo' ? 'PNG, JPG bis 10 MB' : 'MP4, MOV bis 500 MB'}</p>
          </div>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Beschreibung hinzufügen…"
            rows={3}
            className="mt-4 w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark resize-none bg-background placeholder:text-border"
          />
          <p className="font-sans text-[11px] text-text-secondary mt-2 leading-relaxed">
            Der Beitrag erscheint auf deinem Profil und ist für Profilbesucher sichtbar.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-4 border-t border-border gap-2">
          <button onClick={onClose} className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors">
            Abbrechen
          </button>
          <button
            onClick={onClose}
            className="font-sans text-sm px-5 py-2 bg-dark text-white hover:bg-accent-gold transition-colors"
          >
            Auf Profil veröffentlichen
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function ProfileView() {
  const [editMode, setEditMode] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerType, setComposerType] = useState<'photo' | 'video'>('photo')

  // Committed profile values
  const [name, setName] = useState('Niklaus Hess')
  const [avatar, setAvatar] = useState<string>('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80')
  const [bio, setBio] = useState('Handorgelist aus Luzern. Leidenschaft für Ländlermusik seit 20 Jahren.')
  const [wohnort, setWohnort] = useState('Luzern')
  const [hideWohnort, setHideWohnort] = useState(false)
  const [instruments, setInstruments] = useState('Handorgel, Schwyzerörgeli')
  const [vorbilder, setVorbilder] = useState('Ruedi Rymann, Kapelle Hess-Ruedi-Hegner')
  const [openForFormation, setOpenForFormation] = useState(false)
  const [hiddenFromDiscover, setHiddenFromDiscover] = useState(false)
  const [instagram, setInstagram] = useState('niklaus.hess')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [facebook, setFacebook] = useState('')
  const [tiktok, setTiktok] = useState('')

  // Bei der Registrierung eingegebene Angaben ins Profil übernehmen, sobald die
  // Komponente im Browser eingehängt ist (vermeidet SSR-Hydration-Mismatch).
  useEffect(() => {
    const stored = readStoredProfile()
    setName(stored.name)
    setAvatar(stored.avatar)
    setBio(stored.bio)
    setWohnort(stored.wohnort)
    setInstruments(stored.instruments)
    setOpenForFormation(stored.openForFormation)
    setEmail(stored.email)
  }, [])

  // @handle aus dem Namen ableiten, damit er zum übernommenen Namen passt.
  const handle = handleFromName(name)

  // Eigene Beiträge (löschbar) + Vergrösserungs-Ansicht (Lightbox)
  const [posts, setPosts] = useState<ProfilePost[]>(profilePosts)
  const [lightbox, setLightbox] = useState<ProfilePost | null>(null)
  const deletePost = (id: number) => setPosts(prev => prev.filter(p => p.id !== id))

  // Draft values (live while editing)
  const [draftName, setDraftName] = useState('')
  const [draftAvatar, setDraftAvatar] = useState<string>('')
  const [draftBio, setDraftBio] = useState('')
  const [draftWohnort, setDraftWohnort] = useState('')
  const [draftHideWohnort, setDraftHideWohnort] = useState(false)
  const [draftInstruments, setDraftInstruments] = useState('')
  const [draftVorbilder, setDraftVorbilder] = useState('')
  const [draftOpenForFormation, setDraftOpenForFormation] = useState(false)
  const [draftHiddenFromDiscover, setDraftHiddenFromDiscover] = useState(false)
  const [draftInstagram, setDraftInstagram] = useState('')
  const [draftWhatsapp, setDraftWhatsapp] = useState('')
  const [draftEmail, setDraftEmail] = useState('')
  const [draftFacebook, setDraftFacebook] = useState('')
  const [draftTiktok, setDraftTiktok] = useState('')

  const openComposer = (type: 'photo' | 'video') => {
    setComposerType(type)
    setComposerOpen(true)
  }

  const startEdit = () => {
    setDraftName(name)
    setDraftAvatar(avatar)
    setDraftBio(bio)
    setDraftWohnort(wohnort)
    setDraftHideWohnort(hideWohnort)
    setDraftInstruments(instruments)
    setDraftVorbilder(vorbilder)
    setDraftOpenForFormation(openForFormation)
    setDraftHiddenFromDiscover(hiddenFromDiscover)
    setDraftInstagram(instagram)
    setDraftWhatsapp(whatsapp)
    setDraftEmail(email)
    setDraftFacebook(facebook)
    setDraftTiktok(tiktok)
    setEditMode(true)
  }

  const saveEdit = () => {
    setName(draftName.trim() || name)
    setAvatar(draftAvatar)
    setBio(draftBio)
    setWohnort(draftWohnort.trim())
    setHideWohnort(draftHideWohnort)
    setInstruments(draftInstruments)
    setVorbilder(draftVorbilder)
    setOpenForFormation(draftOpenForFormation)
    setHiddenFromDiscover(draftHiddenFromDiscover)
    setInstagram(draftInstagram.trim())
    setWhatsapp(draftWhatsapp.trim())
    setEmail(draftEmail.trim())
    setFacebook(draftFacebook.trim())
    setTiktok(draftTiktok.trim())
    setEditMode(false)
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {composerOpen && (
          <PostComposerModal key="profile-composer" initialType={composerType} onClose={() => setComposerOpen(false)} />
        )}
      </AnimatePresence>

      {/* Lightbox — Beitrag vergrössert anzeigen */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" aria-label="Schliessen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-video bg-black overflow-hidden">
                <Image src={lightbox.img} alt={lightbox.caption} fill className="object-contain" unoptimized />
                {lightbox.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"><IconPlay /></div>
                  </div>
                )}
              </div>
              {lightbox.caption && <p className="font-sans text-sm text-white/80 mt-3 text-center">{lightbox.caption}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile header — ohne Titelbild, Profilbild optional */}
      <div className="bg-surface border border-border overflow-hidden">
        <div className="p-6">
          <div className="flex items-end justify-between mb-5">
            <div className="flex flex-col gap-1.5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-border bg-background flex items-center justify-center text-text-secondary">
                {(editMode ? draftAvatar : avatar) ? (
                  <Image src={editMode ? draftAvatar : avatar} alt="Profile" fill className="object-cover" unoptimized />
                ) : (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                )}
                {editMode && (
                  <button
                    onClick={() => setDraftAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80')}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                    title="Profilbild auswählen"
                  >
                    <span className="text-white"><IconEdit /></span>
                  </button>
                )}
              </div>
              {editMode && (
                draftAvatar
                  ? <button onClick={() => setDraftAvatar('')} className="font-sans text-[11px] text-text-secondary hover:text-red-500 transition-colors w-20 text-center">Bild entfernen</button>
                  : <span className="font-sans text-[11px] text-text-secondary w-20 text-center">optional</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={saveEdit}
                    className="font-sans text-sm font-semibold px-4 py-2 bg-accent-gold text-white hover:bg-dark transition-colors"
                  >
                    Speichern ✓
                  </button>
                </>
              ) : (
                <button
                  onClick={startEdit}
                  className="font-sans text-sm font-medium px-4 py-2 border border-border hover:border-dark transition-colors"
                >
                  Profil bearbeiten
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {editMode ? (
              <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] block mb-1">Profilname *</label>
                  <input value={draftName} onChange={e => setDraftName(e.target.value)} className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                </div>
                <div>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] block mb-1">Bio</label>
                  <textarea value={draftBio} onChange={e => setDraftBio(e.target.value)} rows={3} className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark resize-none" />
                  <p className="font-sans text-[11px] text-text-secondary mt-1">Tipp: Links zu deinen Kanälen kannst du hier in der Bio integrieren.</p>
                </div>
                <div>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] block mb-1">Wohnort</label>
                  <input value={draftWohnort} onChange={e => setDraftWohnort(e.target.value)} placeholder="z.B. Luzern" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="font-sans text-sm font-medium">Wohnort auf dem Profil verbergen</p>
                      <p className="font-sans text-xs text-text-secondary mt-0.5">
                        {draftHideWohnort ? 'Dein Wohnort ist für andere nicht sichtbar.' : 'Dein Wohnort wird auf deinem Profil angezeigt.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setDraftHideWohnort(v => !v)}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${draftHideWohnort ? 'bg-accent-gold' : 'bg-border'}`}
                      aria-label="Wohnort auf dem Profil verbergen"
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${draftHideWohnort ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] block mb-1">Instrumente</label>
                  <p className="font-sans text-[11px] text-text-secondary mb-2">Wähle deine Instrumente — sie erscheinen nur auf deinem Profil. Eigene über «Sonstiges» ergänzen.</p>
                  <InstrumentTagPicker value={draftInstruments} onChange={setDraftInstruments} />
                </div>
                <div>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] block mb-1">Musikalische Vorbilder</label>
                  <input value={draftVorbilder} onChange={e => setDraftVorbilder(e.target.value)} className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                </div>

                {/* Social-media links (managed outside the post stream) */}
                <div className="pt-4 border-t border-border">
                  <p className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] mb-3">Social Media</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">Instagram</label>
                      <input value={draftInstagram} onChange={e => setDraftInstagram(e.target.value)} placeholder="benutzername" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">WhatsApp</label>
                      <input value={draftWhatsapp} onChange={e => setDraftWhatsapp(e.target.value)} placeholder="+41 79 …" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">E-Mail</label>
                      <input value={draftEmail} onChange={e => setDraftEmail(e.target.value)} type="email" placeholder="name@email.ch" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">Facebook</label>
                      <input value={draftFacebook} onChange={e => setDraftFacebook(e.target.value)} placeholder="profil-name" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">TikTok</label>
                      <input value={draftTiktok} onChange={e => setDraftTiktok(e.target.value)} placeholder="@benutzername" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                    </div>
                  </div>
                </div>

                {/* Offen für eine Formation */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-sans text-sm font-medium">Offen für eine Formation</p>
                    <p className="font-sans text-xs text-text-secondary mt-0.5">
                      {draftOpenForFormation ? 'Andere sehen, dass du eine Formation suchst.' : 'Zeige, dass du für eine Formation offen bist.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setDraftOpenForFormation(v => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${draftOpenForFormation ? 'bg-accent-gold' : 'bg-border'}`}
                    aria-label="Offen für eine Formation"
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${draftOpenForFormation ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Mein Profil unter «Entdecken» verbergen */}
                <div className="flex items-start justify-between gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="font-sans text-sm font-medium">Mein Profil unter der Seite Entdecken verbergen</p>
                    <p className="font-sans text-xs text-text-secondary mt-0.5 leading-relaxed">
                      {draftHiddenFromDiscover
                        ? 'Dein Profil erscheint nicht unter «Entdecken». Du bist anonym und wirst nur gefunden, wenn du aktiv unter Lernvideos kommentierst — was du nicht musst. Bei Fragen kannst du dich auch direkt ans LAEMU-Team wenden.'
                        : 'Dein Profil ist unter «Entdecken» für andere Mitglieder sichtbar.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setDraftHiddenFromDiscover(v => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${draftHiddenFromDiscover ? 'bg-accent-gold' : 'bg-border'}`}
                    aria-label="Mein Profil unter der Seite Entdecken verbergen"
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${draftHiddenFromDiscover ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-heading text-2xl font-black">{name}</h2>
                  {openForFormation && (
                    <span className="font-sans text-[10px] font-semibold px-2 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold uppercase tracking-wide">Offen für Formationen</span>
                  )}
                  {hiddenFromDiscover && (
                    <span className="font-sans text-[10px] font-semibold px-2 py-1 bg-background border border-border text-text-secondary uppercase tracking-wide inline-flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      In Entdecken verborgen
                    </span>
                  )}
                </div>
                <p className="font-sans text-sm text-accent-gold mb-2">@{handle}</p>
                {!hideWohnort && wohnort && (
                  <p className="flex items-center gap-1 font-sans text-xs text-text-secondary mb-2">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {wohnort}
                  </p>
                )}
                <p className="font-sans text-sm font-light text-text-secondary mb-4 leading-relaxed">{bio}</p>

                {/* Social-media links */}
                {(instagram || whatsapp || email || facebook || tiktok) && (
                  <div className="flex items-center gap-2 mb-4">
                    {instagram && (
                      <a href={`https://instagram.com/${instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" title={`Instagram: ${instagram}`} className="w-8 h-8 flex items-center justify-center border border-border hover:border-dark hover:text-accent-gold text-text-secondary transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                      </a>
                    )}
                    {email && (
                      <a href={`mailto:${email}`} title={`E-Mail: ${email}`} className="w-8 h-8 flex items-center justify-center border border-border hover:border-dark hover:text-accent-gold text-text-secondary transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
                      </a>
                    )}
                    {whatsapp && (
                      <a href={`https://wa.me/${whatsapp.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer" title={`WhatsApp: ${whatsapp}`} className="w-8 h-8 flex items-center justify-center border border-border hover:border-dark hover:text-accent-gold text-text-secondary transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                      </a>
                    )}
                    {facebook && (
                      <a href={`https://facebook.com/${facebook.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" title={`Facebook: ${facebook}`} className="w-8 h-8 flex items-center justify-center border border-border hover:border-dark hover:text-accent-gold text-text-secondary transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                      </a>
                    )}
                    {tiktok && (
                      <a href={`https://tiktok.com/@${tiktok.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" title={`TikTok: ${tiktok}`} className="w-8 h-8 flex items-center justify-center border border-border hover:border-dark hover:text-accent-gold text-text-secondary transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>
                      </a>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {instruments.split(',').map(i => (
                    <span key={i} className="font-sans text-xs px-2 py-1 bg-background border border-border">{i.trim()}</span>
                  ))}
                </div>
                {vorbilder && (
                  <p className="font-sans text-xs text-text-secondary">
                    <span className="font-medium text-dark">Vorbilder:</span> {vorbilder}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Klarer Upload-Button — direkt unter dem Profil */}
      <div className="bg-surface border border-border p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="w-10 h-10 flex items-center justify-center bg-accent-gold/10 text-accent-gold flex-shrink-0">
              <IconUpload />
            </span>
            <div className="min-w-0">
              <p className="font-sans text-sm font-semibold text-dark">Foto oder Video hochladen</p>
              <p className="font-sans text-xs text-text-secondary leading-snug">Ergänze dein Profil mit einem neuen Beitrag.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openComposer('photo')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-dark text-white font-sans text-sm font-medium px-4 py-2.5 hover:bg-accent-gold transition-colors"
            >
              <IconCamera /> Foto
            </button>
            <button
              onClick={() => openComposer('video')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-dark text-dark font-sans text-sm font-medium px-4 py-2.5 hover:bg-dark hover:text-white transition-colors"
            >
              <IconVideo /> Video
            </button>
          </div>
        </div>
      </div>

      {/* Profile content — nur eigene Foto- & Video-Beiträge */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg">Beiträge</h3>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) => (
              <div key={post.id} className="relative aspect-square overflow-hidden group bg-background">
                <button onClick={() => setLightbox(post)} className="absolute inset-0 w-full h-full cursor-zoom-in" aria-label="Beitrag vergrössern">
                  <Image src={post.img} alt={post.caption} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                </button>
                {post.type === 'video' && (
                  <div className="absolute top-2 left-2 text-white drop-shadow pointer-events-none"><IconVideo /></div>
                )}
                {/* Eigenen Beitrag löschen */}
                <button
                  onClick={() => deletePost(post.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  title="Beitrag löschen"
                  aria-label="Beitrag löschen"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                </button>
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-white text-xs flex items-center gap-1"><IconHeart filled /> {post.likes}</span>
                  <span className="text-white text-xs flex items-center gap-1"><IconComment16 /> {post.comments}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border p-10 text-center">
            <p className="font-sans text-sm text-text-secondary">Noch keine Beiträge. Ergänze dein Profil mit einem Foto oder Video.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsView() {
  const [activeSection, setActiveSection] = useState('billing')

  const sections = [
    { id: 'billing', label: 'Rechnungen', icon: <IconBilling /> },
    { id: 'payment', label: 'Zahlungsmittel', icon: <IconCard /> },
    { id: 'address', label: 'Adresse', icon: <IconLocation /> },
    { id: 'password', label: 'Passwort', icon: <IconKey /> },
    { id: 'devices', label: 'Geräte', icon: <IconPhone /> },
    { id: 'blocked', label: 'Blockiert', icon: <IconBlock /> },
  ]

  return (
    <div className="bg-surface border border-border overflow-hidden">
      <div className="flex border-b border-border overflow-x-auto">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-4 py-3 font-sans text-sm whitespace-nowrap transition-colors border-b-2 ${activeSection === s.id ? 'border-dark text-dark font-medium' : 'border-transparent text-text-secondary hover:text-dark'}`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {activeSection === 'billing' && (
          <div>
            {/* Active subscriptions */}
            <div className="mb-6">
              <h3 className="font-heading font-bold text-lg mb-3">Aktive Abonnements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-accent-gold/40 bg-accent-gold/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🪗</span>
                    <div>
                      <p className="font-sans text-sm font-semibold">LAEMU Musikschule – Handorgel-Lehrgang</p>
                      <p className="font-sans text-xs text-text-secondary">Jahresabo · nächste Verlängerung 1. Feb 2027</p>
                      <span className="font-sans text-[10px] text-accent-gold font-medium">Formation-Rabatt aktiv (Kapelle Hess-Ruedi)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm font-semibold text-accent-gold">CHF 222.40 / Jahr</p>
                    <span className="font-sans text-[10px] text-text-secondary line-through">CHF 278.00</span>
                    <div className="mt-1">
                      <button className="font-sans text-xs text-red-500 hover:text-red-700 transition-colors">Kündigen</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Invoice history */}
            <h3 className="font-heading font-bold text-lg mb-3">Rechnungsverlauf</h3>
            <div className="space-y-3">
              {[
                { date: 'Feb 2026', desc: 'LAEMU Musikschule – Handorgel-Lehrgang (Jahresabo)', amount: 'CHF 222.40' },
                { date: 'Feb 2025', desc: 'LAEMU Musikschule – Handorgel-Lehrgang (Jahresabo)', amount: 'CHF 222.40' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border hover:border-dark transition-colors">
                  <div>
                    <p className="font-sans text-sm font-medium">{r.desc}</p>
                    <p className="font-sans text-xs font-light text-text-secondary">{r.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm font-semibold">{r.amount}</p>
                    <span className="font-sans text-xs text-green-600 font-medium">Bezahlt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeSection === 'payment' && (
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Zahlungsmittel</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-4 border-2 border-dark bg-dark text-white">
                <div className="flex items-center gap-3">
                  <IconCard />
                  <div>
                    <p className="font-sans text-sm font-medium">Visa •••• 4242</p>
                    <p className="font-sans text-xs text-white/60">Läuft ab 12/2027</p>
                  </div>
                </div>
                <span className="font-sans text-xs text-accent-yellow border border-accent-yellow px-2 py-0.5">Favorit</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-border hover:border-dark transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <IconCard />
                  <div>
                    <p className="font-sans text-sm font-medium">PostFinance •••• 8891</p>
                    <p className="font-sans text-xs font-light text-text-secondary">Läuft ab 03/2026</p>
                  </div>
                </div>
                <button className="font-sans text-xs text-text-secondary hover:text-dark transition-colors">Als Favorit</button>
              </div>
            </div>
            <button className="font-sans text-sm text-accent-gold hover:text-dark transition-colors">+ Zahlungsmittel hinzufügen</button>
          </div>
        )}
        {activeSection === 'address' && (
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Wohnadresse</h3>
            <div className="grid grid-cols-2 gap-4">
              {[['Vorname', 'Niklaus'], ['Nachname', 'Hess'], ['Strasse & Nr.', 'Musterstrasse 12'], ['PLZ', '6000'], ['Ort', 'Luzern'], ['Land', 'Schweiz']].map(([label, val]) => (
                <div key={label}>
                  <label className="font-sans text-xs font-light text-text-secondary uppercase tracking-[0.15em] block mb-1">{label}</label>
                  <input defaultValue={val} className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                </div>
              ))}
            </div>
            <button className="mt-4 bg-dark text-white font-sans text-sm px-6 py-2.5 hover:bg-accent-gold transition-colors">Speichern</button>
          </div>
        )}
        {activeSection === 'password' && (
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Passwort ändern</h3>
            <div className="space-y-4 max-w-sm">
              {['Aktuelles Passwort', 'Neues Passwort', 'Passwort bestätigen'].map(label => (
                <div key={label}>
                  <label className="font-sans text-xs font-light text-text-secondary uppercase tracking-[0.15em] block mb-1">{label}</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                </div>
              ))}
              <button className="bg-dark text-white font-sans text-sm px-6 py-2.5 hover:bg-accent-gold transition-colors">Passwort aktualisieren</button>
            </div>
          </div>
        )}
        {activeSection === 'devices' && (
          <div>
            <h3 className="font-heading font-bold text-lg mb-2">Geräte-Verwaltung</h3>
            <p className="font-sans text-sm font-light text-text-secondary mb-4 leading-relaxed">
              Du kannst maximal 2 Geräte (Laptop und Smartphone) für den Zugriff hinterlegen.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border-2 border-dark bg-dark text-white">
                <div className="flex items-center gap-3">
                  <IconLaptop />
                  <div>
                    <p className="font-sans text-sm font-medium">MacBook Pro · Safari</p>
                    <p className="font-sans text-xs text-accent-yellow">Aktuelles Gerät · Luzern, CH</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-border hover:border-dark transition-colors">
                <div className="flex items-center gap-3">
                  <IconPhone />
                  <div>
                    <p className="font-sans text-sm font-medium">iPhone 15 · Safari</p>
                    <p className="font-sans text-xs font-light text-text-secondary">Letzter Zugriff: heute, 08:32</p>
                  </div>
                </div>
                <button className="font-sans text-xs text-red-500 border border-red-200 px-2 py-1 hover:bg-red-50 transition-colors">Entfernen</button>
              </div>
            </div>
            <p className="font-sans text-xs font-light text-text-secondary mt-4">
              Möchtest du ein drittes Gerät hinzufügen? Entferne zuerst ein bestehendes.
            </p>
          </div>
        )}
        {activeSection === 'blocked' && (
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Blockierte Profile</h3>
            <p className="font-sans text-sm font-light text-text-secondary mb-4 leading-relaxed">
              Blockierte Profile sehen deine Beiträge nicht.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-text-secondary">
                    <IconUser />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium">Gesperrtes Profil</p>
                    <p className="font-sans text-xs font-light text-text-secondary">@gesperrtes_profil</p>
                  </div>
                </div>
                <button className="font-sans text-xs text-text-secondary border border-border px-2 py-1 hover:border-dark hover:text-dark transition-colors">Entsperren</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MemberCommunityPage() {
  const [activeNav, setActiveNav] = useState('start')
  const profile = useUserProfile()
  const avatarSrc = profile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
  const firstName = profile.name.trim().split(/\s+/)[0] || 'zusammen'

  return (
    <div className="min-h-screen bg-background">
      {/* TOP BAR */}
      <MemberTopBar title={`Hallo ${firstName}`} />

      {/* ── AREA TABS ── */}
      <MemberTabs active="community" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-4">
              {/* Own profile quick-card */}
              <button onClick={() => setActiveNav('profile')} className="w-full bg-surface border border-border p-5 hover:border-dark transition-colors text-left block">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src={avatarSrc} alt="Profile" fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">{profile.name}</p>
                    <p className="font-sans text-xs text-accent-gold">@{handleFromName(profile.name)}</p>
                  </div>
                </div>
              </button>

              <nav className="bg-surface border border-border overflow-hidden">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 text-left ${
                      activeNav === item.id
                        ? 'bg-dark text-white font-medium'
                        : 'text-text-secondary hover:bg-background hover:text-dark'
                    }`}
                  >
                    <span className={activeNav === item.id ? 'text-accent-yellow' : ''}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mobile nav */}
            <div className="lg:hidden flex items-center gap-1 bg-surface border border-border overflow-x-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-sans text-sm whitespace-nowrap transition-colors border-b-2 ${
                    activeNav === item.id ? 'border-dark text-dark font-medium' : 'border-transparent text-text-secondary'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            {activeNav === 'start' && <StartView />}
            {activeNav === 'profile' && <ProfileView />}
            {activeNav === 'discover' && <DiscoverView />}
            {activeNav === 'settings' && <SettingsView />}
          </div>

        </div>
      </div>
    </div>
  )
}
