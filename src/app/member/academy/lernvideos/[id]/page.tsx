'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { pieceCatalog, isPieceUnlocked, type CatalogEntry } from '@/lib/academy'

// ─── Types ───────────────────────────────────────────────────────────────────

type Voice = { id: string; label: string; volume: number; muted: boolean; color: string }
type JamMusician = { id: string; name: string; voice: string; instrument: string; singing?: string; volume: number; muted: boolean; color: string }
type StimmeSection = {
  id: string; label: string; instrument: string; color: string
  lernvideos: { id: string; label: string; duration: string; done: boolean }[]
  noten: { label: string; key: string; price?: number }[]
  audioSamples: { id: string; label: string; duration: string; type: 'audio' | 'youtube' }[]
  hasLaemuPlayer: boolean
}
type BegleitvorschlagVideo = { id: string; instrument: string; color: string; label: string; teacher: string; duration: string; done: boolean }

// ─── Data ────────────────────────────────────────────────────────────────────

const videoData = {
  id: 1,
  title: 'Dr Alperose',
  artist: 'Willi Valotti',
  composer: 'Willi Valotti',
  year: 1978,
  instrument: 'Handorgel',
  formation: 'Trio',
  meter: '3/4',
  difficulty: 'starter' as const,
  level: 2,
  stufen: 3,
  artDesStückes: 'volkstuemlich' as const,
  styleTags: ['Urchig', 'Innerschwyzer Stil', 'Zweistimmig'],
  taktart: 'Walzer' as const,
  autoTags: ['Handorgel', 'Schwyzerörgeli', 'Starter', 'Grundlagenkurs'],
  formations: ['Hess-Rusch-Hegner Trio', 'Kapelle Schwyz', 'Bodästänix'],
  img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
  intro: 'Dr Alperose ist ein klassischer Ländlerwalzer im 3/4-Takt, komponiert von Willi Valotti im Jahr 1978. Das Stück gehört zum Standardrepertoire jeder Schweizer Ländlerkapelle und zeichnet sich durch seine eingängige Melodielinie und charakteristischen Begleitfiguren aus. Besondere Aufmerksamkeit verdient der harmonische Übergang von Teil A nach Teil B — ein Merkmal, das viele Ländler der 1970er-Jahre kennzeichnet und den Stücken eine besondere Tiefe verleiht.',
  masterVideo: { type: 'laemu' as const },
  hasJamPlayer: true,
  introVideo: { label: 'Einführungsvideo — Überblick & Aufbau des Stückes', duration: '4:32' },
  jamMusicians: [
    { id: 'j1', name: 'Seebi Diener', voice: '1. Stimme', instrument: 'Handorgel', volume: 85, muted: false, color: '#C4973A' },
    { id: 'j2', name: 'Cyrill Rusch', voice: '2. Stimme', instrument: 'Schwyzerörgeli', volume: 75, muted: false, color: '#5A8A6A' },
    { id: 'j3', name: 'Franz Hess', voice: 'Begleitung', instrument: 'Klavier', volume: 70, muted: false, color: '#7A6A9A' },
    { id: 'j4', name: 'Simon Rusch', voice: 'Bassbegleitung', instrument: 'Bass', volume: 68, muted: true, color: '#8A5A4A' },
  ] as JamMusician[],
  voices: [
    { id: 'v1_ho', label: '1. Stimme Handorgel', volume: 80, muted: false, color: '#C4973A' },
    { id: 'v2_ho', label: '2. Stimme Handorgel', volume: 70, muted: false, color: '#C4973A' },
    { id: 'v1_oe', label: '1. Stimme Schwyzerörgeli', volume: 80, muted: false, color: '#5A8A6A' },
    { id: 'v2_oe', label: '2. Stimme Schwyzerörgeli', volume: 70, muted: false, color: '#5A8A6A' },
    { id: 'bass', label: 'Bassbegleitung', volume: 75, muted: false, color: '#8A5A4A' },
    { id: 'klavier', label: 'Klavierbegleitung', volume: 65, muted: true, color: '#7A6A9A' },
  ] as Voice[],
  stimmenSections: [
    {
      id: 's1', label: '1. Stimme Handorgel', instrument: 'Handorgel', color: '#C4973A',
      lernvideos: [
        { id: 'lv1', label: '1. Stimme — Einführung & Takt 1–8', duration: '12 Min.', done: true },
        { id: 'lv2', label: '1. Stimme — Takt 9–16 mit Übergängen', duration: '14 Min.', done: true },
        { id: 'lv3', label: '1. Stimme — Teil B & Zusammenfassung', duration: '11 Min.', done: false },
      ],
      noten: [
        { label: 'Violinschlüssel', key: 'violin', price: 5 },
        { label: 'Griffschrift', key: 'griff', price: 5 },
        { label: 'LAEMU-Notation', key: 'laemu', price: 5 },
      ],
      audioSamples: [
        { id: 'a1', label: 'Vorspielen — ganzes Stück', duration: '3:42', type: 'audio' as const },
        { id: 'a2', label: 'Slow-Version 50%', duration: '7:24', type: 'audio' as const },
        { id: 'a3', label: 'Zusammenspiel Trio', duration: '3:42', type: 'youtube' as const },
      ],
      hasLaemuPlayer: true,
    },
    {
      id: 's2', label: '2. Stimme Handorgel', instrument: 'Handorgel', color: '#C4973A',
      lernvideos: [
        { id: 'lv4', label: '2. Stimme — Einführung & Begleitfiguren', duration: '10 Min.', done: false },
        { id: 'lv5', label: '2. Stimme — Rhythmus & Zusammenspiel', duration: '12 Min.', done: false },
      ],
      noten: [
        { label: 'Violinschlüssel', key: 'violin', price: 5 },
        { label: 'LAEMU-Notation', key: 'laemu', price: 5 },
      ],
      audioSamples: [
        { id: 'a4', label: 'Vorspielen — 2. Stimme solo', duration: '3:42', type: 'audio' as const },
      ],
      hasLaemuPlayer: true,
    },
    {
      id: 's3', label: '1. Stimme Schwyzerörgeli', instrument: 'Schwyzerörgeli', color: '#5A8A6A',
      lernvideos: [
        { id: 'lv6', label: '1. Stimme SÖ — Einführung & Grifftechnik', duration: '13 Min.', done: false },
        { id: 'lv7', label: '1. Stimme SÖ — Teil A komplett', duration: '11 Min.', done: false },
      ],
      noten: [
        { label: 'Griffschrift Schwyzerörgeli', key: 'griff-soe', price: 5 },
        { label: 'Violinschlüssel', key: 'violin', price: 5 },
      ],
      audioSamples: [
        { id: 'a5', label: 'Vorspielen — Schwyzerörgeli', duration: '3:42', type: 'audio' as const },
      ],
      hasLaemuPlayer: false,
    },
    {
      id: 's4', label: '2. Stimme Schwyzerörgeli', instrument: 'Schwyzerörgeli', color: '#5A8A6A',
      lernvideos: [
        { id: 'lv8', label: '2. Stimme SÖ — Einführung', duration: '10 Min.', done: false },
      ],
      noten: [
        { label: 'Griffschrift Schwyzerörgeli', key: 'griff-soe', price: 5 },
      ],
      audioSamples: [],
      hasLaemuPlayer: false,
    },
    {
      id: 's5', label: 'Bassbegleitung', instrument: 'Bass', color: '#8A5A4A',
      lernvideos: [
        { id: 'lv9', label: 'Bass — Grundrhythmus im 3/4-Takt', duration: '9 Min.', done: false },
        { id: 'lv10', label: 'Bass — Variationen & Fills', duration: '8 Min.', done: false },
      ],
      noten: [
        { label: 'Bassbegleitung (Notation)', key: 'bass', price: 5 },
      ],
      audioSamples: [
        { id: 'a6', label: 'Bassbegleitung solo', duration: '3:42', type: 'audio' as const },
      ],
      hasLaemuPlayer: true,
    },
    {
      id: 's6', label: 'Klavierbegleitung', instrument: 'Klavier', color: '#7A6A9A',
      lernvideos: [
        { id: 'lv11', label: 'Klavier — Begleitpattern Walzer', duration: '11 Min.', done: false },
      ],
      noten: [
        { label: 'Klavierpartitur', key: 'klavier', price: 5 },
      ],
      audioSamples: [],
      hasLaemuPlayer: false,
    },
  ] as StimmeSection[],
  begleitvorschlaege: [
    { id: 'bv1', instrument: 'Klavier', color: '#7A6A9A', label: 'Klavierbegleitung — Walzer-Pattern', teacher: 'Franz Hess', duration: '11 Min.', done: false },
    { id: 'bv2', instrument: 'Bass', color: '#8A5A4A', label: 'Bassbegleitung — 3-Schlag Basis', teacher: 'Seebi Diener', duration: '9 Min.', done: false },
    { id: 'bv3', instrument: 'Handorgel', color: '#C4973A', label: 'Handorgel-Begleitung — Harmonie-Griffe', teacher: 'Cécile Schmidig', duration: '10 Min.', done: false },
    { id: 'bv4', instrument: 'Schwyzerörgeli', color: '#5A8A6A', label: 'Schwyzerörgeli-Begleitung — 2. Stimme', teacher: 'Cyrill Rusch', duration: '9 Min.', done: false },
  ] as BegleitvorschlagVideo[],
  notenheftUrl: '#',
  sheets: [
    { label: 'Violinschlüssel', key: 'violin', price: 5 },
    { label: 'Vl. Einfachtonart', key: 'violin-simple', price: 5 },
    { label: 'LAEMU-Notation', key: 'laemu', price: 5 },
    { label: 'Griffschrift', key: 'griff', price: 5 },
    { label: 'Bassbegleitung', key: 'bass', price: 5 },
  ],
  spotify: 'https://open.spotify.com/',
  lyrics: `Teil A\nWo d'Alperose blüeht im Abedsunneschii,\nDört isch mis Herz, dört mueß i immer sii.\nD'Vögu singe hell, dr Wind rauscht dür ds Tal,\nS'isch niemes so schö wie dänk einisch amol.\n\nRefrain\nAlperose, du roti Blueme,\nDu schaffsch mir Freud und nimmsch mini Grubme.\nIm Herz bisch du tiif, wie s'Felse im See,\nUnd ohni di mag i niemer meh.`,
  tontraeger: [
    { label: 'LAEMU – Best of Ländlermusik Vol. 3', year: 2022, artist: 'Verschiedene Künstler', url: '#' },
    { label: 'Willi Valotti – Original-Aufnahmen', year: 1978, artist: 'Willi Valotti', url: '#' },
  ],
  originalRecordings: [
    { label: 'Originalaufnahme 1978 (Ur-Formation)', type: 'audio' as const, artist: 'Willi Valotti' },
    { label: 'Hess-Rusch-Hegner Trio', type: 'youtube' as const, artist: 'Live-Aufnahme 2019', url: '#' },
    { label: 'Bodästänix', type: 'youtube' as const, artist: 'Konzert Luzern 2022', url: '#' },
    { label: 'Ländlerkapelle Schwyz', type: 'audio' as const, artist: 'Studio 2015' },
  ],
  composerInfo: {
    name: 'Willi Valotti',
    years: '1932–2001',
    bio: 'Willi Valotti war einer der bedeutendsten Schweizer Volksmusikkomponisten des 20. Jahrhunderts. Seine Melodien zeichnen sich durch eine unverwechselbare lyrische Qualität aus und sind tief in der Innerschweizer Volksmusiktradition verwurzelt.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  performerInfo: {
    name: 'Kapelle Valotti',
    bio: 'Die Originalbesetzung der Kapelle Valotti gilt als Musterbeispiel für authentische Schweizer Ländlermusik. Willi Valotti spielte selbst Handorgel und leitete seine Formation mit grossem Gefühl für die natürliche Energie seiner Stücke.',
    img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80',
  },
  teacher: {
    name: 'Hansruedi Wenger',
    handle: '@hansruedi_wenger',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    instrument: 'Handorgel & Akkordeon',
    bio: 'Über 20 Jahre Unterrichtserfahrung. Mitglied der Ländlerkapelle Hess.',
    courses: 3,
    students: 156,
  },
}

type Comment = { user: string; name: string; avatar: string; text: string; time: string; likes: number }

const commentsPerLesson: Record<string, Comment[]> = {
  intro: [
    { user: 'maria', name: 'Maria Kälin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', text: 'Super Einführung! Die Struktur des Stücks ist jetzt viel klarer für mich.', time: 'vor 2 Tagen', likes: 9 },
    { user: 'hansruedi', name: 'Hansruedi Wenger', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', text: 'Schaut euch besonders die Aufbaustruktur bei 2:15 nochmals an — das hilft enorm beim Lernen!', time: 'vor 4 Tagen', likes: 21 },
  ],
  lv1: [
    { user: 'peter', name: 'Peter Gasser', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', text: 'Takt 5–6 war für mich knifflig. Hat jemand einen Tipp für die linke Hand?', time: 'vor 1 Woche', likes: 4 },
    { user: 'lisa', name: 'Lisa Frei', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', text: 'Ich habe diesen Teil mit 40% Tempo geübt — nach einer Woche klappt es auf 80%!', time: 'vor 5 Tagen', likes: 11 },
    { user: 'anna', name: 'Anna Steiner', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', text: 'Die LAEMU-Griffschrift hilft mir wirklich beim Einstieg. Danke für die Notation!', time: 'vor 3 Tagen', likes: 7 },
  ],
  lv2: [
    { user: 'maria', name: 'Maria Kälin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', text: 'Der Übergang bei Takt 12 auf 13 — da hakt es bei mir noch. Irgendwelche Übungstipps?', time: 'vor 2 Tagen', likes: 6 },
    { user: 'hansruedi', name: 'Hansruedi Wenger', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', text: 'Übt den Übergang isoliert: Takt 11–14, dreimal langsam, dann im Tempo. Gerne im nächsten Live-Call zeigen!', time: 'vor 1 Tag', likes: 18 },
  ],
  lv3: [
    { user: 'peter', name: 'Peter Gasser', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', text: 'Teil B ist mein Lieblingsteil — die Zusammenfassung macht sehr Sinn. Danke!', time: 'vor 3 Tagen', likes: 8 },
    { user: 'lisa', name: 'Lisa Frei', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', text: 'Für die Bassbegleitung: Achtet auf den Schlag auf die 2. Zählzeit im 2. Teil!', time: 'vor 1 Woche', likes: 12 },
  ],
}

// Eine einzige Kommentarliste pro Lernvideo (nicht nach Stimmen/Lektionen filterbar).
type VideoReply = { id: string; user: string; name: string; avatar: string; isTeam?: boolean; role?: string; text: string; time: string }
type VideoComment = Comment & { id: string; isTeam?: boolean; role?: string; replies: VideoReply[] }

const TEAM_USERS: Record<string, string> = { hansruedi: 'Lehrer', cecile: 'LAEMU Team' }

const initialVideoComments: VideoComment[] = Object.values(commentsPerLesson).flat().map((c, i) => ({
  ...c,
  id: `vc${i}`,
  isTeam: c.user in TEAM_USERS,
  role: TEAM_USERS[c.user],
  replies: [],
}))

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconPlay() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> }
function IconPause() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> }
function IconRepeat() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg> }
function IconDownload() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }
function IconShare() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> }
function IconCheck() { return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function IconHeart({ filled }: { filled: boolean }) { return <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> }
function IconMusic() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> }
function IconVolOff() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> }
function IconVolOn() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg> }
function IconMixer() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg> }
function IconDisc() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg> }
function IconChevron({ up }: { up: boolean }) { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${up ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg> }
function IconBack() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> }
function IconHeadphones() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg> }

// ─── Jam Faders (Vertical, for master video) ─────────────────────────────────

function JamFaders({ musicians }: { musicians: JamMusician[] }) {
  const [state, setState] = useState(musicians)

  const toggleMute = (id: string) =>
    setState(prev => prev.map(m => m.id === id ? { ...m, muted: !m.muted } : m))
  const setVolume = (id: string, vol: number) =>
    setState(prev => prev.map(m => m.id === id ? { ...m, volume: vol } : m))
  const soloMusician = (id: string) =>
    setState(prev => {
      const isAlreadySolo = prev.filter(m => !m.muted).length === 1 && !prev.find(m => m.id === id)?.muted
      return isAlreadySolo
        ? prev.map(m => ({ ...m, muted: false }))
        : prev.map(m => ({ ...m, muted: m.id !== id }))
    })
  const resetAll = () => setState(musicians)

  return (
    <div className="bg-[#111] border-t border-white/10">
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-accent-gold"><IconMixer /></span>
          <span className="font-sans text-xs uppercase tracking-widest text-white/50">Jam-Player</span>
          <span className="font-sans text-[10px] text-white/25 hidden sm:inline">— Stimmen individuell steuern</span>
        </div>
        <button onClick={resetAll} className="font-sans text-[10px] text-white/30 hover:text-white/60 transition-colors">
          Zurücksetzen
        </button>
      </div>
      <div className="px-6 py-6 overflow-x-auto">
        <div className="flex items-end gap-10 min-w-max">
          {state.map(m => {
            const vol = m.muted ? 0 : m.volume
            return (
              <div key={m.id} className={`flex flex-col items-center gap-2 transition-opacity duration-200 ${m.muted ? 'opacity-40' : ''}`}>
                {/* Solo */}
                <button
                  onClick={() => soloMusician(m.id)}
                  title="Solo"
                  className="font-sans text-[10px] font-bold tracking-widest w-8 h-6 border transition-colors border-white/20 text-white/40 hover:border-accent-gold hover:text-accent-gold"
                >
                  S
                </button>
                {/* Mute */}
                <button
                  onClick={() => toggleMute(m.id)}
                  title={m.muted ? 'Unmute' : 'Mute'}
                  className={`font-sans text-[10px] font-bold tracking-widest w-8 h-6 border transition-colors ${m.muted ? 'border-red-400/70 text-red-400' : 'border-white/20 text-white/40 hover:border-red-400/60 hover:text-red-400/60'}`}
                >
                  M
                </button>
                {/* Vertical fader */}
                <div className="relative" style={{ width: 36, height: 110 }}>
                  {/* Track bg */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/10" />
                  {/* Fill */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1 transition-none"
                    style={{ height: `${vol}%`, backgroundColor: m.color }}
                  />
                  {/* Thumb */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white shadow-lg pointer-events-none border-2"
                    style={{ bottom: `calc(${vol}% - 8px)`, borderColor: m.color }}
                  />
                  {/* Invisible rotated input */}
                  <input
                    type="range" min={0} max={100}
                    value={vol}
                    onChange={e => setVolume(m.id, parseInt(e.target.value))}
                    disabled={m.muted}
                    className="absolute opacity-0 cursor-pointer disabled:cursor-default"
                    style={{
                      width: 110,
                      height: 36,
                      top: (110 - 36) / 2,
                      left: (36 - 110) / 2,
                      transform: 'rotate(-90deg)',
                    }}
                  />
                </div>
                {/* Volume readout */}
                <span className="font-mono text-[10px] text-white/30 w-8 text-center">{m.muted ? '—' : `${m.volume}`}</span>
                {/* Divider */}
                <div className="w-8 h-px bg-white/10 my-0.5" />
                {/* Musician info */}
                <div className="text-center" style={{ maxWidth: 80 }}>
                  <p className="font-heading font-bold text-[11px] text-white leading-tight truncate">{m.name}</p>
                  <p className="font-sans text-[9px] text-white/40 leading-tight mt-0.5">{m.voice}</p>
                  <p className="font-sans text-[9px] leading-tight mt-0.5" style={{ color: m.color }}>{m.instrument}</p>
                  {m.singing && <p className="font-sans text-[9px] text-white/30 leading-tight mt-0.5">{m.singing}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── VoiceMixer (horizontal, for LAEMU Player) ───────────────────────────────

function VoiceMixer({ voices }: { voices: Voice[] }) {
  const [state, setState] = useState(voices)
  const toggleMute = (id: string) => setState(prev => prev.map(v => v.id === id ? { ...v, muted: !v.muted } : v))
  const setVol = (id: string, vol: number) => setState(prev => prev.map(v => v.id === id ? { ...v, volume: vol } : v))
  const solo = (id: string) => setState(prev => {
    const isSolo = prev.filter(v => !v.muted).length === 1 && !prev.find(v => v.id === id)?.muted
    return isSolo ? prev.map(v => ({ ...v, muted: false })) : prev.map(v => ({ ...v, muted: v.id !== id }))
  })
  return (
    <div className="space-y-1.5">
      {state.map(voice => (
        <div key={voice.id} className={`flex items-center gap-3 py-1 px-1 transition-opacity ${voice.muted ? 'opacity-40' : ''}`}>
          <button onClick={() => solo(voice.id)} className="font-sans text-[9px] uppercase tracking-wide w-6 h-5 border border-border text-text-secondary hover:border-accent-gold hover:text-accent-gold transition-colors flex-shrink-0">S</button>
          <button onClick={() => toggleMute(voice.id)} className={`flex items-center justify-center w-6 h-6 transition-colors flex-shrink-0 ${voice.muted ? 'text-text-secondary' : 'text-dark'}`}>
            {voice.muted ? <IconVolOff /> : <IconVolOn />}
          </button>
          <span className="font-sans text-xs text-text-secondary w-44 flex-shrink-0 truncate">{voice.label}</span>
          <div className="flex-1 relative h-1 bg-border">
            <div className="absolute left-0 top-0 h-full transition-all" style={{ width: `${voice.muted ? 0 : voice.volume}%`, backgroundColor: voice.color }} />
            <input type="range" min={0} max={100} value={voice.muted ? 0 : voice.volume} onChange={e => setVol(voice.id, parseInt(e.target.value))} disabled={voice.muted} className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-default" />
          </div>
          <span className="font-sans text-xs text-text-secondary w-8 text-right flex-shrink-0">{voice.muted ? '—' : `${voice.volume}%`}</span>
        </div>
      ))}
    </div>
  )
}

// ─── VideoPlayer ─────────────────────────────────────────────────────────────

function IconExpand() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg> }
function IconGear() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> }
function IconClose() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }

function VideoPlayer({ img, label, hidePitch }: { img: string; label: string; hidePitch?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(100)
  const [pitch, setPitch] = useState(0)
  const [loopEnabled, setLoopEnabled] = useState(false)
  const [loopA, setLoopA] = useState(20)
  const [loopB, setLoopB] = useState(70)
  const [progress] = useState(35)
  const [dragging, setDragging] = useState<null | 'A' | 'B'>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [enlarged, setEnlarged] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const pitchLabel = pitch === 0 ? '±0' : pitch > 0 ? `+${pitch}` : `${pitch}`

  const handleBarClick = (e: React.MouseEvent) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    if (loopEnabled && dragging === 'A') setLoopA(Math.min(pct, loopB - 5))
    if (loopEnabled && dragging === 'B') setLoopB(Math.max(pct, loopA + 5))
  }

  const player = (
    <div className="bg-dark w-full">
      <div className="relative aspect-video overflow-hidden">
        <Image src={img} alt={label} fill className="object-cover opacity-50" unoptimized />
        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={() => setPlaying(!playing)} className="w-16 h-16 bg-accent-gold hover:bg-accent-warm flex items-center justify-center transition-colors">
            <span className={`text-white ${playing ? '' : 'ml-1'}`}>{playing ? <IconPause /> : <IconPlay />}</span>
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className="font-sans text-xs text-white/60 bg-black/50 px-2 py-1">{label}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {loopEnabled && (
            <span className="font-sans text-xs text-blue-300 bg-blue-900/60 px-2 py-1">Loop A–B</span>
          )}
          <button
            onClick={() => setEnlarged(e => !e)}
            title={enlarged ? 'Verkleinern' : 'Vergrössern'}
            className="text-white/70 hover:text-white bg-black/50 hover:bg-black/70 p-1.5 transition-colors"
          >
            {enlarged ? <IconClose /> : <IconExpand />}
          </button>
        </div>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div ref={barRef} className="relative h-2 bg-white/15 cursor-pointer" onClick={handleBarClick}>
          <div className="h-full bg-accent-gold/80" style={{ width: `${progress}%` }} />
          {loopEnabled && (
            <>
              <div className="absolute top-0 h-full bg-blue-400/25" style={{ left: `${loopA}%`, width: `${loopB - loopA}%` }} />
              <button className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-blue-400 cursor-ew-resize" style={{ left: `${loopA}%` }} onMouseDown={() => setDragging('A')} onMouseUp={() => setDragging(null)} />
              <button className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-blue-400 cursor-ew-resize" style={{ left: `${loopB}%` }} onMouseDown={() => setDragging('B')} onMouseUp={() => setDragging(null)} />
            </>
          )}
        </div>
        <div className="space-y-2">
          {/* Time + Loop + Settings */}
          <div className="flex items-center justify-between">
            <span className="font-sans text-white/50 text-xs tabular-nums">3:42 / 12:15</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setLoopEnabled(!loopEnabled)} title="Loop" className={`flex items-center gap-1.5 font-sans text-xs px-2.5 py-1 border transition-colors ${loopEnabled ? 'border-blue-400 text-blue-400 bg-blue-400/10' : 'border-white/20 text-white/40 hover:border-white/50'}`}>
                <IconRepeat /> Loop {loopEnabled ? 'AN' : 'AUS'}
              </button>
              <button onClick={() => setShowSettings(s => !s)} title="Einstellungen" className={`flex items-center gap-1.5 font-sans text-xs px-2.5 py-1 border transition-colors ${showSettings ? 'border-accent-gold text-accent-gold bg-accent-gold/10' : 'border-white/20 text-white/40 hover:border-white/50'}`}>
                <IconGear />
              </button>
            </div>
          </div>
          {/* Collapsible settings (Tempo + optional Tonhöhe) */}
          <AnimatePresence initial={false}>
            {showSettings && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="space-y-2 pt-1">
                  {/* Tempo slider */}
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-white/30 w-16 flex-shrink-0">Tempo</span>
                    <input
                      type="range" min={25} max={200} step={1} value={speed}
                      onChange={e => setSpeed(Number(e.target.value))}
                      className="flex-1 cursor-pointer"
                      style={{ accentColor: '#C4973A' }}
                    />
                    <span className={`font-sans text-xs font-semibold w-10 text-right flex-shrink-0 tabular-nums ${speed !== 100 ? 'text-accent-gold' : 'text-white/40'}`}>{speed}%</span>
                    {speed !== 100 && (
                      <button onClick={() => setSpeed(100)} className="font-sans text-[10px] text-white/25 hover:text-white/50 transition-colors flex-shrink-0">↺</button>
                    )}
                  </div>
                  {/* Tonhöhe slider */}
                  {!hidePitch && (
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-[10px] uppercase tracking-widest text-white/30 w-16 flex-shrink-0">Tonhöhe</span>
                      <div className="flex-1 relative">
                        <input
                          type="range" min={-4} max={4} step={0.5} value={pitch}
                          onChange={e => setPitch(Number(e.target.value))}
                          className="w-full cursor-pointer"
                          style={{ accentColor: pitch !== 0 ? '#7BA8D8' : '#555' }}
                        />
                        {/* Centre tick */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-px h-2 bg-white/20 pointer-events-none" style={{ marginTop: -4 }} />
                      </div>
                      <span className={`font-sans text-xs font-semibold w-10 text-right flex-shrink-0 tabular-nums ${pitch !== 0 ? 'text-blue-300' : 'text-white/40'}`}>{pitchLabel}</span>
                      {pitch !== 0 && (
                        <button onClick={() => setPitch(0)} className="font-sans text-[10px] text-white/25 hover:text-white/50 transition-colors flex-shrink-0">↺</button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  if (enlarged) {
    return (
      <>
        {player}
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4">
          <button onClick={() => setEnlarged(false)} title="Schliessen" className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10">
            <IconClose />
          </button>
          <div className="w-full max-w-5xl">
            {player}
          </div>
        </div>
      </>
    )
  }

  return player
}

// ─── Locked view (Stück nicht im Abo enthalten) ──────────────────────────────

function LockedDetailView({ piece }: { piece: CatalogEntry }) {
  const planLabel: Record<string, string> = { free: 'Free', starter: 'Starter', pro: 'Pro' }
  return (
    <div className="min-h-screen bg-background">
      {/* TOP BAR */}
      <div className="bg-dark text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/member/academy/lernvideos" className="font-sans text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1">
            <IconBack /> Datenbank
          </Link>
          <span className="text-white/20">/</span>
          <div>
            <h1 className="font-heading font-bold text-base leading-tight">{piece.title}</h1>
            <p className="font-sans text-xs text-white/40">{piece.artist} · {piece.year}</p>
          </div>
        </div>
        <span className="font-sans text-xs px-3 py-1.5 border border-white/20 text-white/60 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          Gesperrt
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Master video — Standard-Player, ohne JamPlayer */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <VideoPlayer img={piece.img} label={`${piece.title} — Masteraufnahme`} />
          <p className="font-sans text-xs text-text-secondary mt-2">
            Die Masteraufnahme ist frei verfügbar. Der JamPlayer sowie die Lern- und Stimmen-Videos
            sind in deinem aktuellen Abo nicht enthalten.
          </p>
        </motion.div>

        {/* Piece info */}
        <div className="bg-surface border border-border p-6">
          <h2 className="font-heading font-bold text-2xl mb-1">{piece.title}</h2>
          <p className="font-sans text-sm text-accent-gold mb-4">{piece.artist} · {piece.year}</p>
          <div className="flex flex-wrap gap-2">
            <span className={`font-sans text-xs px-2.5 py-1 font-medium ${piece.plan === 'starter' ? 'bg-accent-gold text-white' : piece.plan === 'pro' ? 'bg-dark text-white' : 'bg-background border border-border text-text-secondary'}`}>
              {planLabel[piece.plan]}
            </span>
            <span className="font-sans text-xs px-2.5 py-1 bg-background border border-border">{piece.instrument}</span>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-dark p-6">
          <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-1">Mehr freischalten</p>
          <h3 className="font-heading text-xl font-bold text-white mb-2">Voller Zugang mit dem passenden Abo</h3>
          <p className="font-sans text-sm text-white/60 mb-5">
            Schalte alle Lern- und Stimmen-Videos, den JamPlayer und die komplette Lernvideo-Datenbank
            für {piece.instrument} frei.
          </p>
          <div className="space-y-2 mb-5">
            {['Alle Lern- & Stimmen-Videos', 'JamPlayer mit Einzelstimmen-Mischpult', 'Tempo & Tonhöhe anpassen', 'Noten zu jeder Stimme'].map((f) => (
              <div key={f} className="flex items-center gap-2 font-sans text-sm text-white/80">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <Link href="/member/academy" className="inline-block bg-accent-gold text-white font-sans text-sm font-medium px-6 py-3 hover:bg-accent-warm transition-colors">
            Abo erweitern →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LernvideoDetailPage() {
  const params = useParams()
  const idNum = Number(Array.isArray(params?.id) ? params.id[0] : params?.id)
  const catalogEntry = pieceCatalog[idNum]
  const unlocked = catalogEntry ? isPieceUnlocked({ plan: catalogEntry.plan, instrument: catalogEntry.instrument }) : true

  const v = videoData
  const [mainTab, setMainTab] = useState<'ueberblick' | 'stimme1' | 'stimme2' | 'begleit' | 'mitspielen'>('ueberblick')
  const [showLyrics, setShowLyrics] = useState(false)
  const [expandedVideos, setExpandedVideos] = useState<Set<string>>(new Set())
  const toggleVideo = (id: string) => setExpandedVideos(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const [comment, setComment] = useState('')
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({})
  const [videoComments, setVideoComments] = useState<VideoComment[]>(initialVideoComments)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [audioFavs, setAudioFavs] = useState<Set<string>>(new Set())
  const [audioPlaylist, setAudioPlaylist] = useState<Set<string>>(new Set())

  const toggleAudioFav = (id: string) => setAudioFavs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAudioPlaylist = (id: string) => setAudioPlaylist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  // Stimmen nach Tab: 1./2. Stimme = Melodie-Instrumente, Begleitung = Klavier/Bass
  const MELODIC = ['Handorgel', 'Schwyzerörgeli', 'Klarinette']
  const ACCOMP = ['Klavier', 'Bass']
  const stimme1Sections = v.stimmenSections.filter(s => s.label.startsWith('1. Stimme') && MELODIC.includes(s.instrument))
  const stimme2Sections = v.stimmenSections.filter(s => s.label.startsWith('2. Stimme') && MELODIC.includes(s.instrument))
  const begleitSections = v.stimmenSections.filter(s => ACCOMP.includes(s.instrument))

  const renderStimmeSection = (stimme: StimmeSection) => (
    <div key={stimme.id} className="bg-surface border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-background flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: stimme.color }} />
          <span className="font-heading font-bold text-sm">{stimme.label}</span>
        </div>
        <span className="font-sans text-xs text-text-secondary">({stimme.lernvideos.length} Teile)</span>
      </div>
      {stimme.lernvideos.length > 0 && (
        <div className="divide-y divide-border">
          {stimme.lernvideos.map((lv, partIdx) => {
            const open = expandedVideos.has(lv.id)
            return (
              <div key={lv.id}>
                <div
                  onClick={() => toggleVideo(lv.id)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-background transition-colors cursor-pointer"
                >
                  <span className="font-sans text-xs text-text-secondary w-12 flex-shrink-0">Teil {partIdx + 1}</span>
                  <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 ${lv.done ? 'bg-accent-gold text-white' : 'bg-background border border-border text-text-secondary'}`}>
                    {lv.done ? <IconCheck /> : <IconPlay />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium truncate">{lv.label}</p>
                    <p className="font-sans text-xs text-text-secondary">{lv.duration}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleAudioFav(lv.id)} className={`border px-2 py-1 text-xs transition-colors ${audioFavs.has(lv.id) ? 'border-accent-gold text-accent-gold' : 'border-border text-text-secondary hover:border-dark'}`} title="Favorit">♡</button>
                    <button onClick={() => toggleAudioPlaylist(lv.id)} className={`border px-2 py-1 text-xs flex items-center gap-1 transition-colors ${audioPlaylist.has(lv.id) ? 'border-dark text-dark' : 'border-border text-text-secondary hover:border-dark'}`} title="Zur Audio-Playlist"><IconHeadphones /> Playlist</button>
                    <button onClick={() => toggleVideo(lv.id)} className="font-sans text-xs px-3 py-1.5 bg-dark text-white hover:bg-accent-gold transition-colors flex items-center gap-1.5">
                      {open ? <IconPause /> : <IconPlay />} {open ? 'Schliessen' : 'Ansehen'}
                      <IconChevron up={open} />
                    </button>
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-5 pb-4 pt-1">
                        <VideoPlayer img={v.img} label={lv.label} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}
      {stimme.noten.length > 0 && (
        <div className="px-5 py-3 border-t border-border bg-background flex items-center gap-3 flex-wrap">
          <span className="font-sans text-xs text-text-secondary">Noten:</span>
          {stimme.noten.map(n => (
            <button key={n.key} className="font-sans text-xs px-2.5 py-1 border border-border hover:border-dark text-text-secondary hover:text-dark transition-colors">{n.label}{n.price ? ` CHF ${n.price}` : ''}</button>
          ))}
        </div>
      )}
    </div>
  )

  const planLabel: Record<string, string> = { free: 'Free', starter: 'Starter', pro: 'Pro' }
  const artLabel: Record<string, string> = { volkstuemlich: 'Volkstümlich', bekannte_melodie: 'Bekannte Melodie' }

  // Gesperrte Stücke: nur Masteraufnahme (Standard-Player, ohne JamPlayer).
  if (catalogEntry && !unlocked) {
    return <LockedDetailView piece={catalogEntry} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* TOP BAR */}
      <div className="bg-dark text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/member/academy/lernvideos" className="font-sans text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1">
            <IconBack /> Datenbank
          </Link>
          <span className="text-white/20">/</span>
          <div>
            <h1 className="font-heading font-bold text-base leading-tight">{v.title}</h1>
            <p className="font-sans text-xs text-white/40">{v.artist} · {v.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 border border-white/20 text-white/50 hover:border-white/60 transition-colors">
            <IconShare /> Teilen
          </button>
        </div>
      </div>

      {/* MAIN TABS */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            {([
              { id: 'ueberblick', label: 'Überblick' },
              { id: 'stimme1', label: '1. Stimme' },
              { id: 'stimme2', label: '2. Stimme' },
              { id: 'begleit', label: 'Begleitvorschläge' },
              { id: 'mitspielen', label: 'Mitspielen' },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={`px-6 py-4 font-sans text-sm font-medium border-b-2 -mb-px transition-colors ${mainTab === tab.id ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── ÜBERBLICK TAB ── */}
            {mainTab === 'ueberblick' && (
              <>
                {/* 0 — INTRO VIDEO */}
                {'introVideo' in v && v.introVideo && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-surface border border-accent-gold/30 overflow-hidden">
                      <div className="px-5 py-3 border-b border-accent-gold/20 bg-accent-gold/5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 bg-accent-gold flex items-center justify-center flex-shrink-0">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          </div>
                          <div>
                            <p className="font-heading font-bold text-sm">Einführungsvideo</p>
                            <p className="font-sans text-xs text-text-secondary">{v.introVideo.duration} · Empfohlen zum Einstieg</p>
                          </div>
                        </div>
                        <span className="font-sans text-[10px] text-accent-gold border border-accent-gold/30 px-2 py-0.5 bg-accent-gold/10">Neu hier? Zuerst ansehen</span>
                      </div>
                      <VideoPlayer img={v.img} label={v.introVideo.label} hidePitch />
                    </div>
                  </motion.div>
                )}

                {/* 2 — STÜCK-INFORMATION */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="bg-surface border border-border p-6">
                  <h2 className="font-heading font-bold text-2xl mb-1">{v.title}</h2>
                  <p className="font-sans text-sm text-accent-gold mb-4">
                    {v.artist} · {v.year}{v.composer !== v.artist ? ` · Komp.: ${v.composer}` : ''}
                  </p>

                  <p className="font-sans text-sm text-text-secondary leading-relaxed mb-5">{v.intro}</p>

                  {/* Formations */}
                  {v.formations && v.formations.length > 0 && (
                    <div className="mb-4">
                      <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-2">Formationen</p>
                      <div className="flex flex-wrap gap-1.5">
                        {v.formations.map(f => (
                          <span key={f} className="font-sans text-xs px-2.5 py-1 bg-background border border-border">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Plan / Art / Taktart row */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`font-sans text-xs px-2.5 py-1 font-medium ${v.difficulty === 'starter' ? 'bg-accent-gold text-white' : v.difficulty === 'pro' ? 'bg-dark text-white' : 'bg-background border border-border text-text-secondary'}`}>
                      {planLabel[v.difficulty] ?? v.difficulty}
                    </span>
                    <span className="font-sans text-xs px-2.5 py-1 bg-background border border-border">{artLabel[v.artDesStückes] ?? v.artDesStückes}</span>
                    <span className="font-sans text-xs px-2.5 py-1 bg-background border border-border">{v.taktart}</span>
                  </div>

                  {/* Style tags */}
                  {v.styleTags && v.styleTags.length > 0 && (
                    <div className="mb-4">
                      <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-2">Stil</p>
                      <div className="flex flex-wrap gap-1.5">
                        {v.styleTags.map(tag => (
                          <span key={tag} className="font-sans text-xs px-2.5 py-1 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Auto-tags */}
                  {v.autoTags && v.autoTags.length > 0 && (
                    <div>
                      <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-2">Automatische Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {v.autoTags.map(tag => (
                          <span key={tag} className="font-sans text-xs px-2.5 py-1 bg-background border border-border text-text-secondary">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* 3 — NOTEN */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} className="bg-surface border border-border p-6">
                  <h3 className="font-heading font-bold text-lg mb-1 flex items-center gap-2"><IconMusic /> Noten</h3>
                  <p className="font-sans text-sm text-text-secondary mb-4">Einzelne Notenblätter à CHF 5 — für alle Instrumente und Notationsarten.</p>

                  {/* Available notation types summary */}
                  {(() => {
                    const hasViolin = v.sheets.some(s => s.key === 'violin' || s.key === 'violin-simple')
                    const hasGriff = v.sheets.some(s => s.key === 'griff' || s.key === 'griff-soe')
                    return (
                      <div className="flex flex-wrap gap-2 mb-5 p-3 bg-background border border-border">
                        <span className="font-sans text-xs text-text-secondary self-center">Verfügbare Notationsarten:</span>
                        {hasViolin ? (
                          <span className="font-sans text-xs px-2.5 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold flex items-center gap-1.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Violinschlüssel
                          </span>
                        ) : (
                          <span className="font-sans text-xs px-2.5 py-1 bg-border/40 border border-border text-text-secondary/50 flex items-center gap-1.5 line-through">
                            Violinschlüssel
                          </span>
                        )}
                        {hasGriff ? (
                          <span className="font-sans text-xs px-2.5 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold flex items-center gap-1.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Griffschrift
                          </span>
                        ) : (
                          <span className="font-sans text-xs px-2.5 py-1 bg-border/40 border border-border text-text-secondary/50 flex items-center gap-1.5 line-through">
                            Griffschrift
                          </span>
                        )}
                      </div>
                    )
                  })()}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
                    {v.sheets.map(s => (
                      <div key={s.key} className="border border-border p-3 flex flex-col gap-3 hover:border-dark transition-colors group">
                        <div>
                          <p className="font-heading font-bold text-sm">{s.label}</p>
                          <p className="font-sans text-xs text-text-secondary">{v.title}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-sans text-sm font-semibold text-accent-gold">CHF {s.price}</span>
                          <button className="font-sans text-xs px-2.5 py-1.5 bg-dark text-white hover:bg-accent-gold transition-colors flex items-center gap-1.5">
                            <IconDownload /> Kaufen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {v.notenheftUrl && (
                    <div className="border border-accent-gold/30 bg-accent-gold/5 p-4 flex items-center justify-between">
                      <div>
                        <p className="font-heading font-bold text-sm">Komplettes Notenheft</p>
                        <p className="font-sans text-xs text-text-secondary">Alle Stimmen · alle Notationsarten · inkl. Transpositionsvarianten</p>
                      </div>
                      <Link href={v.notenheftUrl} className="font-sans text-sm px-4 py-2 bg-accent-gold text-white hover:bg-accent-warm transition-colors whitespace-nowrap">
                        Alle Noten herunterladen →
                      </Link>
                    </div>
                  )}
                </motion.div>

                {/* 5 — VERWEISE */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-surface border border-border p-6 space-y-6">
                  <h3 className="font-heading font-bold text-lg">Verweise & Entdecken</h3>

                  {/* Spotify */}
                  {v.spotify && (
                    <div className="flex items-center justify-between p-3 border border-border hover:border-dark transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#1DB954] flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                        </div>
                        <div>
                          <p className="font-sans text-sm font-medium">Auf Spotify anhören</p>
                          <p className="font-sans text-xs text-text-secondary">{v.title} — {v.artist}</p>
                        </div>
                      </div>
                      <a href={v.spotify} target="_blank" rel="noopener noreferrer" className="font-sans text-xs px-3 py-1.5 border border-border hover:border-dark text-text-secondary hover:text-dark transition-colors">Öffnen →</a>
                    </div>
                  )}

                  {/* Originalaufnahmen */}
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Originalaufnahmen & Versionen</p>
                    <div className="space-y-2">
                      {v.originalRecordings.map((r, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border border-border hover:border-dark group transition-colors">
                          <div className="w-8 h-8 bg-background border border-border flex items-center justify-center group-hover:bg-dark group-hover:border-dark group-hover:text-white transition-colors flex-shrink-0">
                            {r.type === 'youtube' ? <IconPlay /> : <IconVolOn />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-sm font-medium truncate">{r.label}</p>
                            <p className="font-sans text-xs text-text-secondary">{r.artist} · {r.type === 'youtube' ? 'YouTube' : 'Audio'}</p>
                          </div>
                          <button className="font-sans text-xs px-2.5 py-1.5 border border-border hover:border-dark text-text-secondary hover:text-dark transition-colors flex-shrink-0">Abspielen</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Liedtext */}
                  {v.lyrics && (
                    <div className="border border-border">
                      <button onClick={() => setShowLyrics(!showLyrics)} className="w-full flex items-center justify-between px-4 py-3 font-heading font-bold text-sm hover:bg-background transition-colors">
                        Liedtext
                        <IconChevron up={showLyrics} />
                      </button>
                      <AnimatePresence>
                        {showLyrics && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <pre className="px-4 pb-4 font-sans text-sm text-text-secondary leading-loose whitespace-pre-wrap">{v.lyrics}</pre>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Tonträger */}
                  {v.tontraeger && v.tontraeger.length > 0 && (
                    <div>
                      <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Auf diesen Tonträgern erhältlich</p>
                      <div className="space-y-2">
                        {v.tontraeger.map((t, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 border border-border hover:border-dark transition-colors">
                            <div className="w-8 h-8 bg-background border border-border flex items-center justify-center text-text-secondary flex-shrink-0">
                              <IconDisc />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-sm font-medium truncate">{t.label}</p>
                              <p className="font-sans text-xs text-text-secondary">{t.artist} · {t.year}</p>
                            </div>
                            {t.url && <a href={t.url} className="font-sans text-xs px-2.5 py-1.5 border border-border hover:border-dark text-text-secondary hover:text-dark transition-colors flex-shrink-0">Info →</a>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* 6 — KOMPONIST & MUSIKER */}
                {(v.composerInfo || v.performerInfo) && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="bg-surface border border-border p-6 space-y-5">
                    <h3 className="font-heading font-bold text-lg">Komponist & Musiker:in</h3>
                    {v.composerInfo && (
                      <div className="flex items-start gap-4">
                        {v.composerInfo.img && (
                          <div className="relative w-16 h-16 overflow-hidden flex-shrink-0">
                            <Image src={v.composerInfo.img} alt={v.composerInfo.name} fill className="object-cover grayscale" unoptimized />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-heading font-bold text-base">{v.composerInfo.name}</p>
                          {v.composerInfo.years && <p className="font-sans text-xs text-accent-gold mb-2">{v.composerInfo.years}</p>}
                          <p className="font-sans text-sm text-text-secondary leading-relaxed">{v.composerInfo.bio}</p>
                        </div>
                      </div>
                    )}
                    {v.performerInfo && (
                      <>
                        {v.composerInfo && <div className="border-t border-border" />}
                        <div className="flex items-start gap-4">
                          {v.performerInfo.img && (
                            <div className="relative w-16 h-16 overflow-hidden flex-shrink-0">
                              <Image src={v.performerInfo.img} alt={v.performerInfo.name} fill className="object-cover" unoptimized />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-heading font-bold text-base">{v.performerInfo.name}</p>
                            <p className="font-sans text-sm text-text-secondary leading-relaxed">{v.performerInfo.bio}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* 7 — KOMMENTARE (eine Leiste pro Lernvideo) */}
                {(() => {
                  const MY = { user: 'ich', name: 'Niklaus Hess', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' }
                  const profileHrefFor = (user: string) => (user === 'ich' ? '/member/profile' : `/member/u/${user}`)
                  const totalCount = videoComments.reduce((s, c) => s + 1 + c.replies.length, 0)

                  const handleSend = () => {
                    if (!comment.trim()) return
                    setVideoComments(prev => [
                      { ...MY, id: `vc-${Date.now()}`, text: comment.trim(), time: 'Gerade eben', likes: 0, replies: [] },
                      ...prev,
                    ])
                    setComment('')
                  }

                  const handleReply = (commentId: string) => {
                    if (!replyText.trim()) return
                    setVideoComments(prev => prev.map(c => c.id === commentId
                      ? { ...c, replies: [...c.replies, { id: `r-${Date.now()}`, ...MY, text: replyText.trim(), time: 'Gerade eben' }] }
                      : c))
                    setReplyText(''); setReplyTo(null)
                  }

                  const Avatar = ({ user, name, avatar, small = false }: { user: string; name: string; avatar: string; small?: boolean }) => (
                    <Link href={profileHrefFor(user)} className={`relative overflow-hidden flex-shrink-0 bg-background border border-border hover:border-accent-gold transition-colors ${small ? 'w-7 h-7' : 'w-9 h-9'}`}>
                      {avatar ? (
                        <Image src={avatar} alt={name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-secondary">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                      )}
                    </Link>
                  )

                  return (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="bg-surface border border-border p-6">
                      {/* Header */}
                      <div className="mb-5">
                        <h3 className="font-heading font-bold text-lg">Kommentare ({totalCount})</h3>
                        <p className="font-sans text-xs text-text-secondary mt-0.5 leading-snug">
                          zu: <span className="text-dark font-medium">{v.title}</span>
                        </p>
                      </div>

                      {/* Comment list */}
                      <div className="space-y-4 mb-6">
                        {videoComments.length === 0 ? (
                          <p className="font-sans text-sm text-text-secondary py-4 text-center">Noch keine Kommentare zu diesem Stück. Sei der Erste!</p>
                        ) : (
                          videoComments.map((c) => (
                            <div key={c.id} className="flex gap-3">
                              <Avatar user={c.user} name={c.name} avatar={c.avatar} />
                              <div className="flex-1 min-w-0">
                                <div className="bg-background p-4 border border-border">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <Link href={profileHrefFor(c.user)} className="font-sans font-semibold text-xs hover:text-accent-gold transition-colors">{c.name}</Link>
                                    {c.isTeam && (
                                      <span className="font-sans text-[10px] bg-accent-gold text-white px-1.5 py-0.5 inline-flex items-center gap-1 font-medium">
                                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                        {c.role ?? 'LAEMU Team'}
                                      </span>
                                    )}
                                    <span className="font-sans text-[10px] text-text-secondary">{c.time}</span>
                                  </div>
                                  <p className="font-sans text-sm text-text-secondary leading-relaxed mb-3">{c.text}</p>
                                  <div className="flex items-center gap-4">
                                    <button
                                      onClick={() => setCommentLikes(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                                      className={`flex items-center gap-1.5 font-sans text-xs transition-colors ${commentLikes[c.id] ? 'text-accent-gold' : 'text-text-secondary hover:text-dark'}`}
                                    >
                                      <IconHeart filled={!!commentLikes[c.id]} />
                                      {c.likes + (commentLikes[c.id] ? 1 : 0)}
                                    </button>
                                    <button
                                      onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyText('') }}
                                      className="font-sans text-xs text-text-secondary hover:text-dark transition-colors"
                                    >
                                      Beantworten
                                    </button>
                                  </div>
                                </div>

                                {/* Replies */}
                                {c.replies.length > 0 && (
                                  <div className="mt-3 space-y-3 border-l-2 border-border pl-4">
                                    {c.replies.map(r => (
                                      <div key={r.id} className="flex gap-2.5">
                                        <Avatar user={r.user} name={r.name} avatar={r.avatar} small />
                                        <div className="flex-1 min-w-0 bg-background p-3 border border-border">
                                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <Link href={profileHrefFor(r.user)} className="font-sans font-semibold text-xs hover:text-accent-gold transition-colors">{r.name}</Link>
                                            {r.isTeam && <span className="font-sans text-[10px] bg-accent-gold text-white px-1.5 py-0.5 font-medium">{r.role ?? 'LAEMU Team'}</span>}
                                            <span className="font-sans text-[10px] text-text-secondary">{r.time}</span>
                                          </div>
                                          <p className="font-sans text-sm text-text-secondary leading-relaxed">{r.text}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Reply input */}
                                {replyTo === c.id && (
                                  <div className="mt-3 flex gap-2.5">
                                    <div className="w-7 h-7 bg-background border border-border flex items-center justify-center flex-shrink-0 text-text-secondary">
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                    <div className="flex-1 flex gap-2">
                                      <input
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleReply(c.id)}
                                        type="text"
                                        placeholder={`Antwort an ${c.name}…`}
                                        className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark"
                                      />
                                      <button onClick={() => handleReply(c.id)} disabled={!replyText.trim()} className="bg-dark text-white px-3 py-2 font-sans text-xs hover:bg-accent-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Antwort senden</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Input */}
                      <div className="flex gap-3">
                        <div className="w-9 h-9 bg-background border border-border flex items-center justify-center flex-shrink-0 text-text-secondary">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            type="text"
                            placeholder={`Kommentar zu "${v.title}"…`}
                            className="flex-1 border border-border px-4 py-2.5 font-sans text-sm focus:outline-none focus:border-dark"
                          />
                          <button onClick={handleSend} className="bg-dark text-white px-4 py-2.5 font-sans text-sm hover:bg-accent-gold transition-colors">Senden</button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })()}
              </>
            )}

            {/* ── 1. STIMME ── */}
            {mainTab === 'stimme1' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div>
                  <h2 className="font-heading font-bold text-xl">1. Stimme</h2>
                  <p className="font-sans text-sm text-text-secondary mt-0.5">Pro Stimme ein Lernvideo — für Handorgel, Schwyzerörgeli & Klarinette.</p>
                </div>
                {stimme1Sections.length > 0
                  ? stimme1Sections.map(renderStimmeSection)
                  : <p className="font-sans text-sm text-text-secondary py-8 text-center bg-surface border border-border">Für dieses Stück gibt es kein 1.-Stimme-Video.</p>}
              </motion.div>
            )}

            {/* ── 2. STIMME ── */}
            {mainTab === 'stimme2' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div>
                  <h2 className="font-heading font-bold text-xl">2. Stimme</h2>
                  <p className="font-sans text-sm text-text-secondary mt-0.5">Pro Stimme ein Lernvideo — für Handorgel, Schwyzerörgeli & Klarinette.</p>
                </div>
                {stimme2Sections.length > 0
                  ? stimme2Sections.map(renderStimmeSection)
                  : <p className="font-sans text-sm text-text-secondary py-8 text-center bg-surface border border-border">Für dieses Stück gibt es kein 2.-Stimme-Video.</p>}
              </motion.div>
            )}

            {/* ── BEGLEITVORSCHLÄGE ── */}
            {mainTab === 'begleit' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div>
                  <h2 className="font-heading font-bold text-xl">Begleitvorschläge</h2>
                  <p className="font-sans text-sm text-text-secondary mt-0.5">Pro Stimme ein Lernvideo — Klavier- & Bassbegleitung.</p>
                </div>
                {begleitSections.length > 0
                  ? begleitSections.map(renderStimmeSection)
                  : <p className="font-sans text-sm text-text-secondary py-8 text-center bg-surface border border-border">Für dieses Stück gibt es keine Begleitvideos.</p>}
              </motion.div>
            )}

            {/* ── MITSPIELEN ── */}
            {mainTab === 'mitspielen' && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h2 className="font-heading font-bold text-xl">Mitspielen</h2>
                  <p className="font-sans text-sm text-text-secondary mt-0.5">Spiel zur Masteraufnahme mit — Tempo, Tonhöhe & einzelne Stimmen steuerbar.</p>
                </div>

                {/* Master-/Mitspielvideo mit Player-Funktionen */}
                <div>
                  <VideoPlayer img={v.img} label={`${v.title} — Masteraufnahme`} />
                  {v.hasJamPlayer && <JamFaders musicians={v.jamMusicians} />}
                </div>

                {/* LAEMU-Player: Stimmen-Mix */}
                <div className="bg-surface border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                    <span className="text-text-secondary"><IconMixer /></span>
                    <div>
                      <p className="font-heading font-bold text-base">LAEMU-Player</p>
                      <p className="font-sans text-xs text-text-secondary">Tempo 25–200% · Tonhöhe · Stimmen individuell steuerbar</p>
                    </div>
                  </div>
                  <div className="px-5 py-4 bg-background">
                    <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Stimmen-Mix</p>
                    <VoiceMixer voices={v.voices} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div className="sticky top-8 space-y-4">
              {/* Metadata */}
              <div className="bg-surface border border-border p-5">
                <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-4">Stück-Info</p>
                <div className="space-y-0">
                  {([
                    { label: 'Komponist', value: v.composer },
                    { label: 'Takt', value: v.meter },
                    { label: 'Harmoniestufen', value: `Stufe ${v.level}` },
                  ]).map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2.5 border-b border-border last:border-0 last:pb-0">
                      <span className="font-sans text-xs text-text-secondary">{item.label}</span>
                      <span className="font-sans text-xs font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-surface border border-border p-4">
                <button className="w-full flex items-center gap-2 font-sans text-sm px-3 py-2.5 border border-border hover:border-dark text-text-secondary transition-colors">
                  <IconShare /> Teilen
                </button>
              </div>

              {/* Teacher */}
              <div className="bg-surface border border-border p-5">
                <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-4">Lehrperson</p>
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 overflow-hidden flex-shrink-0">
                    <Image src={v.teacher.img} alt={v.teacher.name} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" unoptimized />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">{v.teacher.name}</p>
                    <p className="font-sans text-xs text-accent-gold mb-2">{v.teacher.instrument}</p>
                    <p className="font-sans text-xs text-text-secondary leading-relaxed mb-3">{v.teacher.bio}</p>
                    <Link href="/member/community" className="font-sans text-xs border border-border px-3 py-1.5 hover:bg-dark hover:text-white hover:border-dark transition-colors">
                      Profil ansehen
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FLOATING AUDIO PLAYLIST BAR */}
      {audioPlaylist.size > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-dark text-white px-4 py-3 shadow-2xl flex items-center gap-3">
          <IconHeadphones />
          <span className="font-sans text-sm">{audioPlaylist.size} Videos in Audio-Playlist</span>
          <button className="font-sans text-xs px-3 py-1.5 bg-accent-gold hover:bg-accent-warm transition-colors">
            Abspielen →
          </button>
        </div>
      )}
    </div>
  )
}
