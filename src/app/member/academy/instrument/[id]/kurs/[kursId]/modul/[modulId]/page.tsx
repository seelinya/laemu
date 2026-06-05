'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'

// ─── Data ────────────────────────────────────────────────────────────────────

type LessonType = 'video' | 'text' | 'video+text'

type Lesson = {
  id: string
  title: string
  duration: string
  type: LessonType
  completed: boolean
}

type ModuleData = {
  id: string
  title: string
  lessons: Lesson[]
  status: 'completed' | 'in-progress' | 'not-started' | 'locked'
}

const allModules: ModuleData[] = [
  {
    id: 'einfuehrung',
    title: 'Einführung',
    status: 'completed',
    lessons: [
      { id: 'auspacken', title: 'Auspacken des Instrumentes', duration: '5 min', type: 'video', completed: true },
      { id: 'saitenstimmen', title: 'Stimmen & Intonation', duration: '8 min', type: 'video', completed: true },
      { id: 'haltung', title: 'Die richtige Haltung', duration: '10 min', type: 'video', completed: true },
      { id: 'knoepfe', title: 'Die Knöpfe kennenlernen', duration: '12 min', type: 'video', completed: true },
      { id: 'ersterklang', title: 'Dein erster Klang', duration: '7 min', type: 'video', completed: true },
    ],
  },
  {
    id: 'erste-schritte',
    title: 'Erste Schritte mit der Handorgel',
    status: 'in-progress',
    lessons: [
      { id: 'bassseite', title: 'Die Bassseite verstehen', duration: '10 min', type: 'video', completed: true },
      { id: 'diskantseite', title: 'Die Diskantseite', duration: '12 min', type: 'video', completed: false },
      { id: 'koordination', title: 'Koordination beider Hände', duration: '15 min', type: 'video+text', completed: false },
      { id: 'erstesuebung', title: 'Erste Übung: Polka-Rhythmus', duration: '18 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'system',
    title: 'System der Handorgel',
    status: 'not-started',
    lessons: [
      { id: 'tonleiter', title: 'Die Tonleiter', duration: '8 min', type: 'video+text', completed: false },
      { id: 'akkorde', title: 'Grundakkorde', duration: '12 min', type: 'video', completed: false },
      { id: 'bassbegleitung', title: 'Bassbegleitung', duration: '15 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'erste-lieder',
    title: 'Erste Lieder',
    status: 'locked',
    lessons: [
      { id: 'polka1', title: 'Einfache Polka — Schritt 1', duration: '20 min', type: 'video', completed: false },
      { id: 'polka2', title: 'Einfache Polka — Schritt 2', duration: '20 min', type: 'video', completed: false },
      { id: 'mazurka', title: 'Erste Mazurka', duration: '25 min', type: 'video', completed: false },
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback & Weiterentwicklung',
    status: 'locked',
    lessons: [
      { id: 'selbstbewertung', title: 'Selbstbewertung — wo stehst du?', duration: '10 min', type: 'text', completed: false },
      { id: 'tipps', title: 'Tipps vom Lehrer', duration: '15 min', type: 'video', completed: false },
    ],
  },
]

type CommentData = {
  id: string
  name: string
  initials: string
  color: string
  text: string
  time: string
  likes: number
  liked: boolean
}

const mockComments: CommentData[] = [
  { id: 'c1', name: 'Hansruedi Wenger', initials: 'HW', color: 'bg-accent-gold', text: 'Sehr gut gemacht! Achte beim Auspacken besonders auf die Balg-Schutzkappe — sie lässt sich leicht verlieren. Wenn du Fragen hast, kannst du sie direkt hier stellen.', time: 'vor 2 Tagen', likes: 12, liked: false },
  { id: 'c2', name: 'Lena Müller', initials: 'LM', color: 'bg-dark', text: 'Danke für die tolle Lektion! Ich hatte zunächst Mühe mit dem richtigen Griff, aber nach mehrmaligem Anschauen hat es geklappt.', time: 'vor 5 Tagen', likes: 4, liked: true },
  { id: 'c3', name: 'Peter S.', initials: 'PS', color: 'bg-border', text: 'Wo genau befindet sich die Seriennummer auf der Handorgel? Ich kann sie im Video nicht erkennen.', time: 'vor 1 Woche', likes: 1, liked: false },
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

function PlayIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
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
  const activeModuleData = allModules.find((m) => m.id === params.modulId) ?? allModules[0]
  const defaultLessonId = searchParams.lektion ?? activeModuleData.lessons[0]?.id ?? ''
  const [activeLessonId, setActiveLessonId] = useState(defaultLessonId)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(new Set([params.modulId]))
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<CommentData[]>(mockComments)

  const activeLesson = activeModuleData.lessons.find((l) => l.id === activeLessonId) ?? activeModuleData.lessons[0]
  const activeLessonIndex = activeModuleData.lessons.findIndex((l) => l.id === activeLessonId)
  const prevLesson = activeLessonIndex > 0 ? activeModuleData.lessons[activeLessonIndex - 1] : null
  const nextLesson = activeLessonIndex < activeModuleData.lessons.length - 1 ? activeModuleData.lessons[activeLessonIndex + 1] : null

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
      name: 'Niklaus Hess',
      initials: 'NH',
      color: 'bg-accent-gold',
      text: newComment.trim(),
      time: 'gerade eben',
      likes: 0,
      liked: false,
    }
    setComments((prev) => [...prev, newC])
    setNewComment('')
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
        <Link href={`/member/academy/instrument/${params.id}`} className="font-sans text-sm text-white/60 hover:text-white transition-colors hidden md:block">
          Handorgel
        </Link>
        <span className="text-white/30 hidden md:block">/</span>
        <Link href={kursPath} className="font-sans text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5 md:gap-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:hidden">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Grundlagenkurs
        </Link>
        <span className="text-white/30">/</span>
        <span className="font-sans text-sm font-medium truncate">{activeModuleData.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8 items-start">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24">
            <div className="bg-surface border border-border overflow-hidden">
              {/* Course progress */}
              <div className="p-4 border-b border-border">
                <Link href={kursPath} className="font-heading font-bold text-sm hover:text-accent-gold transition-colors">
                  Grundlagenkurs
                </Link>
                <div className="flex justify-between text-xs font-sans mt-2 mb-1">
                  <span className="text-text-secondary">Fortschritt</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="h-1 bg-border overflow-hidden">
                  <motion.div className="h-full bg-accent-gold" initial={{ width: 0 }} animate={{ width: '30%' }} transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }} />
                </div>
              </div>

              {/* Module + lesson list */}
              <div className="overflow-y-auto max-h-[calc(100vh-240px)]">
                {allModules.map((mod) => {
                  const isCurrentModule = mod.id === params.modulId
                  const isExpanded = expandedModuleIds.has(mod.id)
                  const isLocked = mod.status === 'locked'

                  return (
                    <div key={mod.id} className="border-b border-border last:border-0">
                      <button
                        onClick={() => !isLocked && toggleModule(mod.id)}
                        disabled={isLocked}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isCurrentModule ? 'bg-dark text-white' : 'hover:bg-background'} ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${mod.status === 'completed' ? 'bg-accent-gold' : 'bg-border'}`}>
                          {mod.status === 'completed' ? (
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
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => {
                                    if (mod.id === params.modulId) {
                                      setActiveLessonId(lesson.id)
                                    }
                                  }}
                                  className={`w-full flex items-center gap-2.5 pl-8 pr-4 py-2.5 text-left transition-colors ${isActiveLesson ? 'bg-accent-gold/10 border-l-2 border-accent-gold' : 'hover:bg-background border-l-2 border-transparent'}`}
                                >
                                  <div className={`w-4 h-4 flex items-center justify-center flex-shrink-0 border ${lesson.completed ? 'border-accent-gold bg-accent-gold' : 'border-border'}`}>
                                    {lesson.completed && (
                                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className={`font-sans text-xs truncate ${isActiveLesson ? 'text-accent-gold font-medium' : lesson.completed ? 'text-text-secondary' : ''}`}>
                                    {lesson.title}
                                  </span>
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
                    onClick={() => setIsCompleted(!isCompleted)}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center gap-1.5 px-3 py-2 border font-sans text-sm transition-colors ${isCompleted ? 'border-green-500 bg-green-50 text-green-600' : 'border-border hover:border-dark text-text-secondary hover:text-dark'}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isCompleted ? 3 : 2} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {isCompleted ? 'Erledigt' : 'Als erledigt markieren'}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* ── Content blocks ── */}
            <motion.div key={activeLessonId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">

              {/* Video block */}
              <div className="aspect-video bg-dark flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C89B3C 0%, transparent 60%)' }} />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 bg-accent-gold flex items-center justify-center z-10"
                >
                  <PlayIcon size={22} />
                </motion.button>
                <p className="font-sans text-sm text-white/60 z-10">
                  Video: {activeLesson?.title} ({activeLesson?.duration})
                </p>
              </div>

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

              {/* Second content block (short video placeholder) */}
              <div className="aspect-video bg-dark/5 border border-border flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 bg-dark/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-dark/40">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p className="font-sans text-xs text-text-secondary">Zusätzliches Übungsvideo (2 min)</p>
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
                    onClick={() => {
                      setActiveLessonId(nextLesson.id)
                      setIsCompleted(false)
                    }}
                    className="flex items-center gap-2 font-sans text-sm font-medium bg-dark text-white px-4 py-2.5 hover:bg-accent-gold transition-colors"
                  >
                    <span className="hidden sm:inline">{nextLesson.title}</span>
                    <span className="sm:hidden">Weiter</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                ) : (
                  <Button variant="primary" size="sm" href={`/member/academy/instrument/${params.id}/kurs/${params.kursId}`}>
                    Zurück zum Kurs ✓
                  </Button>
                )}
              </div>
            </motion.div>

            {/* ── Comments section ── */}
            <section className="border-t border-border pt-8 space-y-6">
              <h2 className="font-heading text-xl font-bold">Fragen &amp; Kommentare</h2>

              {/* Comment input */}
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-accent-gold flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-sm">
                  NH
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Schreibe einen Kommentar oder stelle eine Frage..."
                    rows={3}
                    className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark resize-none"
                  />
                  <div className="flex justify-end mt-2">
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
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className={`w-9 h-9 ${comment.color} flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-xs`}>
                      {comment.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-sans text-sm font-medium">{comment.name}</span>
                        {comment.name === 'Hansruedi Wenger' && (
                          <span className="font-sans text-[10px] bg-accent-gold text-white px-1.5 py-0.5">Lehrer</span>
                        )}
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
                        <button className="font-sans text-xs text-text-secondary hover:text-dark transition-colors">
                          Antworten
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}
