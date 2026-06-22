'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getCourse, freeTrialLessonKeys, FREE_TRIAL_LESSON_COUNT, type LessonType } from '@/lib/courses'
import { isCourseUnlocked } from '@/lib/academy'
import { isFreePreviewCourse } from '@/lib/instruments'
import { useUserAbo } from '@/lib/userPlan'

// ─── Data ────────────────────────────────────────────────────────────────────

type Reply = {
  id: string
  name: string
  handle?: string
  isTeam: boolean
  role?: string
  text: string
  time: string
}

type CommentData = {
  id: string
  name: string
  handle?: string
  initials: string
  color: string
  isTeam: boolean
  role?: string
  isAuthor?: boolean
  text: string
  time: string
  likes: number
  liked: boolean
  replies: Reply[]
}

// Link zum öffentlichen Profil eines Kommentar-Autors (eigene → eigenes Profil).
function profileHref(isAuthor: boolean | undefined, handle: string | undefined): string {
  if (isAuthor) return '/member/profile'
  return handle ? `/member/u/${handle}` : '#'
}

// Aktuell eingeloggter Nutzer — Kommentare erscheinen mit dem echten Namen.
const CURRENT_USER = { name: 'Niklaus Hess', initials: 'NH' }

const mockComments: CommentData[] = [
  { id: 'c1', name: 'Hansruedi Wenger', handle: 'hansruedi', initials: 'HW', color: 'bg-accent-gold', isTeam: true, role: 'Lehrer', text: 'Sehr gut gemacht! Achte beim Auspacken besonders auf die Balg-Schutzkappe — sie lässt sich leicht verlieren. Wenn du Fragen hast, kannst du sie direkt hier stellen.', time: 'vor 2 Tagen', likes: 12, liked: false, replies: [] },
  { id: 'c2', name: 'Niklaus Hess', initials: 'NH', color: 'bg-dark', isTeam: false, isAuthor: true, text: 'Wie halte ich die Hand bei schnellen Läufen möglichst entspannt? Bei mir verkrampft sie schnell.', time: 'vor 3 Tagen', likes: 2, liked: false, replies: [
    { id: 'r1', name: 'Cécile Schmidig', handle: 'cecile', isTeam: true, role: 'LAEMU Team', text: 'Gute Frage, Niklaus! Lass das Handgelenk locker und spiele die Bewegung mehr aus dem Arm. Ich habe dir in der nächsten Lektion eine Übung dazu markiert.', time: 'vor 2 Tagen' },
  ] },
  { id: 'c3', name: 'Peter S.', handle: 'peter', initials: 'PS', color: 'bg-border', isTeam: false, text: 'Wo genau befindet sich die Seriennummer auf der Handorgel? Ich kann sie im Video nicht erkennen.', time: 'vor 1 Woche', likes: 1, liked: false, replies: [] },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: LessonType }) {
  const config: Record<LessonType, { label: string; cls: string }> = {
    video: { label: 'Video', cls: 'bg-accent-gold/10 text-accent-gold' },
    text: { label: 'Text', cls: 'bg-dark/10 text-dark' },
    'video+text': { label: 'Video+Text', cls: 'bg-blue-50 text-blue-700' },
  }
  const c = config[type]
  return <span className={`font-sans text-[10px] px-1.5 py-0.5 ${c.cls}`}>{c.label}</span>
}

// Markierung für Team-Mitglieder (Lehrpersonen / LAEMU Team).
function TeamBadge({ role }: { role?: string }) {
  return (
    <span className="font-sans text-[10px] bg-accent-gold text-white px-1.5 py-0.5 inline-flex items-center gap-1 font-medium">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      {role ?? 'LAEMU Team'}
    </span>
  )
}

// ─── Lektions-Video-Player im Vimeo-Stil (Qualität, Geschwindigkeit, Lautstärke) ─
// Übernimmt die Vimeo-Darstellung aus der Lernvideodatenbank: Overlay-Steuerung am
// unteren Videorand mit Play, Zeit, Lautstärke (Slider beim Hover), Einstellungen
// (Qualität + Geschwindigkeit) und Vollbild.

const VIDEO_QUALITIES = ['Auto', '1080p', '720p', '480p']
const SPEED_OPTIONS: { value: number; label: string }[] = [
  { value: 50, label: '0.5×' },
  { value: 75, label: '0.75×' },
  { value: 100, label: 'Normal' },
  { value: 125, label: '1.25×' },
  { value: 150, label: '1.5×' },
  { value: 175, label: '1.75×' },
  { value: 200, label: '2×' },
]

function VPIconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> }
function VPIconFullscreen() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3"/></svg> }
function VPIconChevronRight() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg> }
function VPIconPlay() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> }
function VPIconPause() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> }
function VPIconVolOff() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> }
function VPIconVolOn() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg> }

function LessonVideoPlayer({ title, duration }: { title: string; duration: string }) {
  const [playing, setPlaying] = useState(false)
  const [progress] = useState(35)
  const [volume, setVolume] = useState(80)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeed] = useState(100)
  const [quality, setQuality] = useState('Auto')
  const [showSettings, setShowSettings] = useState(false)
  const [settingsView, setSettingsView] = useState<'main' | 'quality' | 'speed'>('main')
  const containerRef = useRef<HTMLDivElement>(null)

  const effVolume = muted ? 0 : volume
  const speedLabel = SPEED_OPTIONS.find(o => o.value === speed)?.label ?? `${speed}%`

  const toggleSettings = () => { setShowSettings(s => !s); setSettingsView('main') }
  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (typeof document !== 'undefined' && document.fullscreenElement) document.exitFullscreen?.()
    else el.requestFullscreen?.()
  }

  const Check = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold"><polyline points="20 6 9 17 4 12"/></svg>

  return (
    <div ref={containerRef} className="bg-black">
      <div className="group relative aspect-video overflow-hidden select-none">
        {/* Video-Oberfläche (Platzhalter) — dunkel mit Akzent-Verlauf */}
        <div className="absolute inset-0 bg-dark" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C89B3C 0%, transparent 60%)' }} />
        {/* Platzhalter-Markierung */}
        <div className="absolute top-3 right-3 pointer-events-none">
          <span className="font-sans text-[10px] uppercase tracking-widest text-white/40 bg-black/30 px-2 py-1 inline-flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
            Video-Platzhalter
          </span>
        </div>

        {/* Zentraler Play-Button, solange pausiert */}
        {!playing && (
          <button onClick={() => setPlaying(true)} aria-label="Abspielen" className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
            <span className="w-16 h-16 bg-accent-gold/90 hover:bg-accent-gold flex items-center justify-center transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="6 4 20 12 6 20 6 4"/></svg>
            </span>
          </button>
        )}

        {/* Titel oben links */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="font-sans text-xs text-white/80 bg-black/40 px-2 py-1">{title} · {duration}</span>
        </div>

        {/* Klick-Fänger, schliesst das Einstellungsmenü */}
        {showSettings && <button aria-hidden className="absolute inset-0 z-10 cursor-default" onClick={() => setShowSettings(false)} />}

        {/* Einstellungsmenü (Vimeo): Qualität & Geschwindigkeit */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.12 }}
              className="absolute bottom-14 right-3 z-20 w-60 bg-[#1a1a1a]/95 backdrop-blur text-white shadow-2xl overflow-hidden"
            >
              {settingsView === 'main' && (
                <div className="py-1">
                  <button onClick={() => setSettingsView('quality')} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors">
                    <span className="font-sans text-sm">Qualität</span>
                    <span className="flex items-center gap-1.5 font-sans text-sm text-white/50">{quality === 'Auto' ? 'Automatisch' : quality}<VPIconChevronRight /></span>
                  </button>
                  <button onClick={() => setSettingsView('speed')} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors">
                    <span className="font-sans text-sm">Geschwindigkeit</span>
                    <span className="flex items-center gap-1.5 font-sans text-sm text-white/50">{speed === 100 ? 'Normal' : speedLabel}<VPIconChevronRight /></span>
                  </button>
                </div>
              )}
              {settingsView === 'quality' && (
                <div className="py-1">
                  <button onClick={() => setSettingsView('main')} className="w-full flex items-center gap-2 px-4 py-2.5 border-b border-white/10 hover:bg-white/10 transition-colors">
                    <span className="rotate-180"><VPIconChevronRight /></span>
                    <span className="font-sans text-sm font-medium">Qualität</span>
                  </button>
                  {VIDEO_QUALITIES.map(q => (
                    <button key={q} onClick={() => { setQuality(q); setSettingsView('main') }} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors">
                      <span className="font-sans text-sm">{q === 'Auto' ? 'Automatisch' : q}</span>
                      {quality === q && <Check />}
                    </button>
                  ))}
                </div>
              )}
              {settingsView === 'speed' && (
                <div className="py-1">
                  <button onClick={() => setSettingsView('main')} className="w-full flex items-center gap-2 px-4 py-2.5 border-b border-white/10 hover:bg-white/10 transition-colors">
                    <span className="rotate-180"><VPIconChevronRight /></span>
                    <span className="font-sans text-sm font-medium">Geschwindigkeit</span>
                  </button>
                  {SPEED_OPTIONS.map(o => (
                    <button key={o.value} onClick={() => { setSpeed(o.value); setSettingsView('main') }} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors">
                      <span className="font-sans text-sm">{o.label}</span>
                      {speed === o.value && <Check />}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Untere Steuerleiste */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-2 pt-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
          {/* Fortschrittsleiste */}
          <div className="relative h-1 bg-white/30 cursor-pointer mb-2 group/bar">
            <div className="h-full bg-accent-gold" style={{ width: `${progress}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent-gold opacity-0 group-hover/bar:opacity-100 transition-opacity" style={{ left: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPlaying(p => !p)} className="text-white hover:text-accent-gold transition-colors" aria-label={playing ? 'Pause' : 'Abspielen'}>
              {playing ? <VPIconPause /> : <VPIconPlay />}
            </button>
            <span className="font-sans text-xs text-white/80 tabular-nums">0:00 / {duration}</span>

            <div className="ml-auto flex items-center gap-3">
              {/* Lautstärke — Slider klappt beim Hover auf (Vimeo-Stil) */}
              <div className="flex items-center group/vol">
                <button onClick={() => setMuted(m => !m)} className="text-white hover:text-accent-gold transition-colors" aria-label="Stummschalten">
                  {effVolume === 0 ? <VPIconVolOff /> : <VPIconVolOn />}
                </button>
                <input
                  type="range" min={0} max={100} value={effVolume}
                  onChange={e => { setVolume(Number(e.target.value)); setMuted(false) }}
                  aria-label="Lautstärke"
                  className="w-0 group-hover/vol:w-16 ml-0 group-hover/vol:ml-2 opacity-0 group-hover/vol:opacity-100 transition-all duration-200 cursor-pointer"
                  style={{ accentColor: '#C4973A' }}
                />
              </div>
              {/* Einstellungen (Qualität + Geschwindigkeit) */}
              <button onClick={toggleSettings} className={`transition-colors ${showSettings ? 'text-accent-gold' : 'text-white hover:text-accent-gold'}`} aria-label="Einstellungen">
                <VPIconSettings />
              </button>
              {/* Vollbild */}
              <button onClick={toggleFullscreen} className="text-white hover:text-accent-gold transition-colors" aria-label="Vollbild">
                <VPIconFullscreen />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ModulPage({
  params,
  searchParams,
}: {
  params: { id: string; kursId: string; modulId: string }
  searchParams: { lektion?: string }
}) {
  const router = useRouter()
  const course = getCourse(params.id, params.kursId)
  const userAbo = useUserAbo()
  // Voller Zugang nach Level + gewählten Instrumenten; sonst Schnupper-Vorschau —
  // aber nur im jeweils ersten Starter-/Pro-Kurs des Instruments. Alle übrigen
  // gesperrten Kurse bleiben komplett gesperrt (keine Schnupper-Lektionen).
  const fullyUnlocked = course ? isCourseUnlocked(course.level, course.instrumentLabel, userAbo) : false
  const isPreviewCourse = course ? isFreePreviewCourse(course.instrumentId, course.id, course.level) : false
  const previewOnly = !fullyUnlocked && isPreviewCourse
  const fullyLocked = !fullyUnlocked && !isPreviewCourse
  const trialKeys = previewOnly && course ? freeTrialLessonKeys(course) : new Set<string>()
  const modules = course?.modules ?? []
  const courseTitle = course?.title ?? params.kursId

  const activeModuleData = modules.find((m) => m.id === params.modulId) ?? modules[0]
  const defaultLessonId = searchParams.lektion ?? activeModuleData?.lessons[0]?.id ?? ''
  const [activeLessonId, setActiveLessonId] = useState(defaultLessonId)
  const [isFavorite, setIsFavorite] = useState(false)
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(new Set([params.modulId]))
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<CommentData[]>(mockComments)
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  // Manuell abgeschlossene Lektionen ("moduleId:lessonId") — initial aus den Daten.
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const s = new Set<string>()
    modules.forEach((m) => m.lessons.forEach((l) => { if (l.completed) s.add(`${m.id}:${l.id}`) }))
    return s
  })
  const lessonKey = (moduleId: string, lessonId: string) => `${moduleId}:${lessonId}`
  const isLessonDone = (moduleId: string, lessonId: string) => completedLessons.has(lessonKey(moduleId, lessonId))
  const moduleDone = (m: { id: string; lessons: { id: string }[] }) => m.lessons.length > 0 && m.lessons.every((l) => isLessonDone(m.id, l.id))

  const activeLesson = activeModuleData?.lessons.find((l) => l.id === activeLessonId) ?? activeModuleData?.lessons[0]
  const activeLessonIndex = activeModuleData ? activeModuleData.lessons.findIndex((l) => l.id === activeLessonId) : -1
  const prevLesson = activeModuleData && activeLessonIndex > 0 ? activeModuleData.lessons[activeLessonIndex - 1] : null
  const nextLesson = activeModuleData && activeLessonIndex < activeModuleData.lessons.length - 1 ? activeModuleData.lessons[activeLessonIndex + 1] : null
  const activeLessonDone = !!(activeModuleData && activeLesson && isLessonDone(activeModuleData.id, activeLesson.id))
  // Free- & Lernvideo-Abo: Lektion ausserhalb der Schnupper-Freischaltung gesperrt.
  const activeLessonLocked = !!activeModuleData && !!activeLesson && (fullyLocked || (previewOnly && !trialKeys.has(`${activeModuleData.id}:${activeLesson.id}`)))

  const totalLessons = modules.flatMap((m) => m.lessons).length
  const courseProgress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0

  // Nächstes nicht gesperrtes Modul (für modulübergreifende Navigation).
  const currentModuleIndex = modules.findIndex((m) => m.id === activeModuleData?.id)
  const nextModule = currentModuleIndex >= 0 ? modules.slice(currentModuleIndex + 1).find((m) => m.status !== 'locked') ?? null : null

  const toggleActiveLessonDone = () => {
    if (!activeModuleData || !activeLesson) return
    setCompletedLessons((prev) => {
      const next = new Set(prev)
      const k = lessonKey(activeModuleData.id, activeLesson.id)
      if (next.has(k)) next.delete(k); else next.add(k)
      return next
    })
  }

  const goToNext = () => {
    if (activeModuleData && activeLesson) {
      setCompletedLessons((prev) => new Set(prev).add(lessonKey(activeModuleData.id, activeLesson.id)))
    }
    if (nextLesson) {
      setActiveLessonId(nextLesson.id)
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (nextModule) {
      router.push(`/member/academy/instrument/${params.id}/kurs/${params.kursId}/modul/${nextModule.id}?lektion=${nextModule.lessons[0].id}`)
    }
  }

  // Letzte Lektion abschliessen: als erledigt markieren und zurück zum Kurs.
  // Ein Kurs gilt automatisch als abgeschlossen, sobald alle Lektionen erledigt sind.
  const finishLastLesson = () => {
    if (activeModuleData && activeLesson) {
      setCompletedLessons((prev) => new Set(prev).add(lessonKey(activeModuleData.id, activeLesson.id)))
    }
    router.push(kursPath)
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModuleIds((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c,
      ),
    )
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    const newC: CommentData = {
      id: `c${Date.now()}`,
      name: CURRENT_USER.name,
      initials: CURRENT_USER.initials,
      color: 'bg-accent-gold',
      isTeam: false,
      isAuthor: true,
      text: newComment.trim(),
      time: 'gerade eben',
      likes: 0,
      liked: false,
      replies: [],
    }
    setComments((prev) => [...prev, newC])
    setNewComment('')
  }

  const handleSubmitReply = (commentId: string) => {
    if (!replyText.trim()) return
    const reply: Reply = {
      id: `r${Date.now()}`,
      name: CURRENT_USER.name,
      isTeam: false,
      text: replyText.trim(),
      time: 'gerade eben',
    }
    setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c)))
    setReplyText('')
    setReplyTo(null)
  }

  const kursPath = `/member/academy/instrument/${params.id}/kurs/${params.kursId}`

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <div className="bg-dark text-white px-6 py-3 flex items-center gap-3">
        <Link href="/member/academy" className="font-sans text-sm text-white/60 hover:text-white transition-colors hidden md:flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Musikschule
        </Link>
        <span className="text-white/30 hidden md:block">/</span>
        <Link href={kursPath} className="font-sans text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5 md:gap-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:hidden">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {courseTitle}
        </Link>
        <span className="text-white/30">/</span>
        <span className="font-sans text-sm font-medium truncate">{activeModuleData?.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8 items-start">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24">
            <div className="bg-surface border border-border overflow-hidden">
              {/* Course progress */}
              <div className="p-4 border-b border-border">
                <Link href={kursPath} className="font-heading font-bold text-sm hover:text-accent-gold transition-colors">
                  {courseTitle}
                </Link>
                <div className="flex justify-between text-xs font-sans mt-2 mb-1">
                  <span className="text-text-secondary">Fortschritt</span>
                  <span className="font-medium">{courseProgress}%</span>
                </div>
                <div className="h-1 bg-border overflow-hidden">
                  <motion.div className="h-full bg-accent-gold" initial={{ width: 0 }} animate={{ width: `${courseProgress}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }} />
                </div>
              </div>

              {/* Module + lesson list */}
              <div className="overflow-y-auto max-h-[calc(100vh-240px)]">
                {modules.map((mod) => {
                  const isCurrentModule = mod.id === params.modulId
                  const isExpanded = expandedModuleIds.has(mod.id)
                  const isLocked = mod.status === 'locked'
                  const isDone = moduleDone(mod)

                  return (
                    <div key={mod.id} className="border-b border-border last:border-0">
                      <button
                        onClick={() => !isLocked && toggleModule(mod.id)}
                        disabled={isLocked}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isCurrentModule ? 'bg-dark text-white' : 'hover:bg-background'} ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-accent-gold' : 'bg-border'}`}>
                          {isDone ? (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : isLocked ? (
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                          ) : null}
                        </div>
                        <span className={`font-sans text-xs font-medium flex-1 truncate ${isCurrentModule ? 'text-white' : ''}`}>{mod.title}</span>
                        {!isLocked && (
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isCurrentModule ? 'text-white/60' : 'text-text-secondary'}>
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </motion.div>
                        )}
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && !isLocked && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {mod.lessons.map((lesson) => {
                              const isActiveLesson = mod.id === params.modulId && lesson.id === activeLessonId
                              const lessonDone = isLessonDone(mod.id, lesson.id)
                              const lessonLocked = fullyLocked || (previewOnly && !trialKeys.has(`${mod.id}:${lesson.id}`))
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => {
                                    if (mod.id === params.modulId) {
                                      setActiveLessonId(lesson.id)
                                    } else {
                                      router.push(`/member/academy/instrument/${params.id}/kurs/${params.kursId}/modul/${mod.id}?lektion=${lesson.id}`)
                                    }
                                  }}
                                  className={`w-full flex items-center gap-2.5 pl-8 pr-4 py-2.5 text-left transition-colors ${isActiveLesson ? 'bg-accent-gold/10 border-l-2 border-accent-gold' : 'hover:bg-background border-l-2 border-transparent'} ${lessonLocked ? 'opacity-60' : ''}`}
                                >
                                  <div className={`w-4 h-4 flex items-center justify-center flex-shrink-0 border ${lessonDone ? 'border-accent-gold bg-accent-gold' : 'border-border'}`}>
                                    {lessonDone && (
                                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className={`font-sans text-xs truncate flex-1 ${isActiveLesson ? 'text-accent-gold font-medium' : lessonDone ? 'text-text-secondary' : ''}`}>
                                    {lesson.title}
                                  </span>
                                  {lessonLocked && (
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary flex-shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                  )}
                                </button>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0 space-y-8">

            {/* Lesson header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-sans text-xs text-text-secondary">{activeModuleData.title}</span>
                <span className="text-text-secondary">·</span>
                <span className="font-sans text-xs text-text-secondary">
                  Lektion {activeLessonIndex + 1} von {activeModuleData.lessons.length}
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <h1 className="font-heading text-2xl md:text-3xl font-bold">{activeLesson?.title}</h1>
                {/* Action bar */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.button
                    onClick={() => setIsFavorite(!isFavorite)}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center gap-1.5 px-3 py-2 border font-sans text-sm transition-colors ${isFavorite ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-border hover:border-dark text-text-secondary hover:text-dark'}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    Merken
                  </motion.button>
                  <motion.button
                    onClick={toggleActiveLessonDone}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center gap-1.5 px-3 py-2 border font-sans text-sm transition-colors ${activeLessonDone ? 'border-green-500 bg-green-50 text-green-600' : 'border-border hover:border-dark text-text-secondary hover:text-dark'}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeLessonDone ? 3 : 2} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {activeLessonDone ? 'Erledigt ✓' : 'Als erledigt markieren'}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* ── Lektion gesperrt (nur Schnupper-Vorschau) ── */}
            {activeLessonLocked ? (
              <motion.div key={`${activeLessonId}-locked`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="aspect-video bg-dark flex flex-col items-center justify-center text-center px-6 gap-4">
                  <div className="w-14 h-14 bg-accent-gold/15 flex items-center justify-center">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-lg mb-1">Diese Lektion ist gesperrt</p>
                    <p className="font-sans text-sm text-white/60 max-w-md">
                      Die ersten {FREE_TRIAL_LESSON_COUNT} Lektionen dieses Kurses sind zum Reinschnuppern frei. Für diese Lektion und den ganzen Kurs schaltest du den Kurs mit dem passenden Abo frei.
                    </p>
                  </div>
                  <Link href="/member/academy" className="bg-accent-gold text-white font-sans text-sm font-semibold px-6 py-3 hover:bg-accent-warm transition-colors">
                    Zur Übersicht →
                  </Link>
                </div>
              </motion.div>
            ) : (
            <>
            {/* ── Content blocks ── */}
            <motion.div key={activeLessonId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">

              {/* Video block */}
              <LessonVideoPlayer title={activeLesson?.title ?? ''} duration={activeLesson?.duration ?? ''} />

              {/* Text content */}
              <div className="bg-surface border border-border p-6 prose-sm max-w-none">
                <p className="font-sans text-sm text-dark leading-relaxed">
                  Willkommen zu deiner Lektion <strong>{activeLesson?.title}</strong> in der LAEMU Musikschule! In dieser Lektion lernst du Schritt für Schritt, wie du sicher mit deiner Handorgel umgehst und die wichtigsten Teile kennenlernst. Hansruedi zeigt dir, worauf du besonders achten musst.
                </p>
                <p className="font-sans text-sm text-text-secondary leading-relaxed mt-3">
                  Nimm dir die Zeit, jede Geste im Video sorgfältig nachzuvollziehen. Bei Fragen kannst du den Lehrer direkt im Kommentarbereich unten ansprechen — er antwortet in der Regel innerhalb von 24 Stunden.
                </p>
                {activeLesson?.type === 'video+text' && (
                  <div className="mt-4 p-4 bg-accent-gold/5 border-l-4 border-accent-gold">
                    <p className="font-sans text-sm font-medium text-dark mb-1">Wichtiger Hinweis</p>
                    <p className="font-sans text-sm text-text-secondary">Übe die Bewegungsabläufe immer langsam — Geschwindigkeit kommt mit der Zeit. Qualität vor Quantität!</p>
                  </div>
                )}
              </div>

              {/* Second content block (kurzes Übungsvideo) */}
              <div>
                <p className="font-sans text-xs text-text-secondary mb-2">Zusätzliches Übungsvideo</p>
                <LessonVideoPlayer title="Zusätzliches Übungsvideo" duration="2 min" />
              </div>

              {/* Download section */}
              <div className="bg-surface border border-border p-5">
                <h3 className="font-heading font-bold text-sm mb-3">Materialien zur Lektion</h3>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-sans text-sm font-medium">Übungsblatt zur Lektion (PDF)</p>
                    <p className="font-sans text-xs text-text-secondary">Grifftabelle + Übungshinweise · 2 Seiten</p>
                  </div>
                  <button className="font-sans text-xs border border-border px-3 py-1.5 hover:border-dark hover:text-dark transition-colors text-text-secondary">
                    Herunterladen
                  </button>
                </div>
              </div>

              {/* Lesson navigation */}
              <div className="flex items-center justify-between pt-2">
                {prevLesson ? (
                  <button
                    onClick={() => setActiveLessonId(prevLesson.id)}
                    className="flex items-center gap-2 font-sans text-sm text-text-secondary hover:text-dark transition-colors border border-border px-4 py-2.5 hover:border-dark"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span className="hidden sm:inline">{prevLesson.title}</span>
                    <span className="sm:hidden">Zurück</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <button
                    onClick={goToNext}
                    className="flex items-center gap-2 font-sans text-sm font-medium bg-dark text-white px-4 py-2.5 hover:bg-accent-gold transition-colors"
                  >
                    <span className="hidden sm:inline">Weiter: {nextLesson.title}</span>
                    <span className="sm:hidden">Weiter</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ) : nextModule ? (
                  <button
                    onClick={goToNext}
                    className="flex items-center gap-2 font-sans text-sm font-medium bg-dark text-white px-4 py-2.5 hover:bg-accent-gold transition-colors"
                  >
                    <span className="hidden sm:inline">Nächstes Modul: {nextModule.title}</span>
                    <span className="sm:hidden">Nächstes Modul</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={finishLastLesson}
                    className="flex items-center gap-2 font-sans text-sm font-medium bg-dark text-white px-5 py-2.5 hover:bg-accent-gold transition-colors"
                  >
                    Lektion abschliessen &amp; zurück zum Kurs
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
            </>
            )}

            {/* ── Comments section ── */}
            <section className="border-t border-border pt-8 space-y-6">
              <h2 className="font-heading text-xl font-bold">Fragen &amp; Kommentare</h2>

              {/* Hinweis: echter Name & Team-Antworten */}
              <div className="bg-accent-gold/5 border border-accent-gold/20 px-4 py-3 flex items-start gap-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">
                  Kommentare erscheinen mit deinem echten Namen (<strong className="text-dark">{CURRENT_USER.name}</strong>). Antworten kommen direkt von einer Person aus dem LAEMU Team — du wirst benachrichtigt, sobald jemand antwortet. Für persönliches oder vertrauliches Feedback melde dich bitte direkt beim Team.
                </p>
              </div>

              {/* Comment input */}
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-accent-gold flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-sm">
                  {CURRENT_USER.initials}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Schreibe einen Kommentar oder stelle eine Frage..."
                    rows={3}
                    className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-sans text-xs text-text-secondary">Sichtbar als <strong className="text-dark font-medium">{CURRENT_USER.name}</strong></span>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      className="font-sans text-sm bg-dark text-white px-4 py-2 hover:bg-accent-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Kommentar senden
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment list */}
              <div className="space-y-5">
                {comments.map((comment) => {
                  const teamAnswered = comment.replies.some((r) => r.isTeam)
                  return (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Link href={profileHref(comment.isAuthor, comment.handle)} className={`w-9 h-9 ${comment.isTeam ? 'bg-accent-gold' : comment.color} flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-xs hover:opacity-80 transition-opacity`}>
                      {comment.initials}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link href={profileHref(comment.isAuthor, comment.handle)} className="font-sans text-sm font-medium hover:text-accent-gold transition-colors">{comment.name}</Link>
                        {comment.isTeam && <TeamBadge role={comment.role} />}
                        {comment.isAuthor && !comment.isTeam && <span className="font-sans text-[10px] border border-border text-text-secondary px-1.5 py-0.5">Du</span>}
                        <span className="font-sans text-xs text-text-secondary">{comment.time}</span>
                      </div>
                      <p className="font-sans text-sm text-dark leading-relaxed">{comment.text}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1.5 font-sans text-xs transition-colors ${comment.liked ? 'text-accent-gold' : 'text-text-secondary hover:text-dark'}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill={comment.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                            <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                          </svg>
                          {comment.likes}
                        </button>
                        <button
                          onClick={() => { setReplyTo(replyTo === comment.id ? null : comment.id); setReplyText('') }}
                          className="font-sans text-xs text-text-secondary hover:text-dark transition-colors"
                        >
                          Beantworten
                        </button>
                      </div>

                      {/* Benachrichtigung bei Team-Antwort */}
                      {teamAnswered && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-accent-gold/10 text-accent-gold px-2 py-1 font-sans text-[11px]">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
                          {comment.isAuthor ? 'Du wurdest über die Antwort benachrichtigt' : `${comment.name} wurde über die Antwort benachrichtigt`}
                        </div>
                      )}

                      {/* Antworten */}
                      {comment.replies.length > 0 && (
                        <div className="mt-3 space-y-3 border-l-2 border-border pl-4">
                          {comment.replies.map((r) => {
                            const ini = r.name.split(' ').map((w) => w[0]).join('').slice(0, 2)
                            return (
                              <div key={r.id} className="flex gap-2.5">
                                <Link href={profileHref(r.name === CURRENT_USER.name, r.handle)} className={`w-7 h-7 ${r.isTeam ? 'bg-accent-gold' : 'bg-dark'} flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-[10px] hover:opacity-80 transition-opacity`}>{ini}</Link>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <Link href={profileHref(r.name === CURRENT_USER.name, r.handle)} className="font-sans text-sm font-medium hover:text-accent-gold transition-colors">{r.name}</Link>
                                    {r.isTeam && <TeamBadge role={r.role} />}
                                    <span className="font-sans text-xs text-text-secondary">{r.time}</span>
                                  </div>
                                  <p className="font-sans text-sm text-dark leading-relaxed">{r.text}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Antwort-Eingabe */}
                      {replyTo === comment.id && (
                        <div className="mt-3 flex gap-2.5">
                          <div className="w-7 h-7 bg-accent-gold flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-[10px]">{CURRENT_USER.initials}</div>
                          <div className="flex-1">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Antwort an ${comment.name}…`}
                              rows={2}
                              className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark resize-none"
                            />
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => handleSubmitReply(comment.id)}
                                disabled={!replyText.trim()}
                                className="font-sans text-xs bg-dark text-white px-3 py-1.5 hover:bg-accent-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Antwort senden
                              </button>
                              <button
                                onClick={() => { setReplyTo(null); setReplyText('') }}
                                className="font-sans text-xs text-text-secondary hover:text-dark transition-colors px-2 py-1.5"
                              >
                                Abbrechen
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  )
                })}
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}
