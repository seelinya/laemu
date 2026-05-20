'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'

// ─── Data ────────────────────────────────────────────────────────────────────

type Lesson = {
  id: string
  title: string
  duration: string
  type: 'video' | 'text' | 'video+text'
  completed: boolean
}

type Module = {
  id: string
  title: string
  lessons: Lesson[]
  status: 'completed' | 'in-progress' | 'not-started' | 'locked'
}

const grundlagenModules: Module[] = [
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

const courseData: Record<string, { title: string; instrument: string; emoji: string; totalLessons: number; completedLessons: number; modules: Module[]; nextModuleId: string; nextLessonId: string; nextLessonTitle: string; nextModuleTitle: string }> = {
  grundlagen: {
    title: 'Grundlagenkurs',
    instrument: 'Handorgel',
    emoji: '🪗',
    totalLessons: 20,
    completedLessons: 6,
    modules: grundlagenModules,
    nextModuleId: 'erste-schritte',
    nextLessonId: 'diskantseite',
    nextLessonTitle: 'Die Diskantseite',
    nextModuleTitle: 'Erste Schritte mit der Handorgel',
  },
}

const defaultCourse = {
  title: 'Kurs',
  instrument: 'Handorgel',
  emoji: '🪗',
  totalLessons: 0,
  completedLessons: 0,
  modules: [],
  nextModuleId: '',
  nextLessonId: '',
  nextLessonTitle: '',
  nextModuleTitle: '',
}

// ─── Helper components ────────────────────────────────────────────────────────

function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 bg-border overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-accent-gold"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  )
}

type StatusConfig = { label: string; color: string; dot: string }

const statusConfig: Record<string, StatusConfig> = {
  completed: { label: 'Abgeschlossen', color: 'text-green-600', dot: 'bg-green-500' },
  'in-progress': { label: 'In Bearbeitung', color: 'text-accent-gold', dot: 'bg-accent-gold' },
  'not-started': { label: 'Noch nicht gestartet', color: 'text-text-secondary', dot: 'bg-border' },
  locked: { label: 'Gesperrt', color: 'text-text-secondary', dot: 'bg-border' },
}

function TypeBadge({ type }: { type: Lesson['type'] }) {
  const config: Record<Lesson['type'], { label: string; bg: string }> = {
    video: { label: 'Video', bg: 'bg-accent-gold/10 text-accent-gold' },
    text: { label: 'Text', bg: 'bg-dark/10 text-dark' },
    'video+text': { label: 'Video+Text', bg: 'bg-blue-50 text-blue-700' },
  }
  const c = config[type]
  return <span className={`font-sans text-[10px] px-1.5 py-0.5 ${c.bg}`}>{c.label}</span>
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function KursPage({ params }: { params: { id: string; kursId: string } }) {
  const course = courseData[params.kursId] ?? { ...defaultCourse, title: params.kursId, instrument: params.id }
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['einfuehrung', 'erste-schritte']))

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const progress = course.totalLessons > 0 ? Math.round((course.completedLessons / course.totalLessons) * 100) : 0
  const instrumentLabel = course.instrument.charAt(0).toUpperCase() + course.instrument.slice(1)

  const getTotalMinutes = (lessons: Lesson[]): number =>
    lessons.reduce((sum, l) => {
      const match = l.duration.match(/(\d+)/)
      return sum + (match ? parseInt(match[1], 10) : 0)
    }, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <div className="bg-dark text-white px-6 py-3 flex items-center gap-3 mt-20">
        <Link href="/member/academy" className="font-sans text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Musikschule
        </Link>
        <span className="text-white/30">/</span>
        <Link href={`/member/academy/instrument/${params.id}`} className="font-sans text-sm text-white/60 hover:text-white transition-colors">
          {instrumentLabel}
        </Link>
        <span className="text-white/30">/</span>
        <span className="font-sans text-sm font-medium">{course.title}</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* ── Course header ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-sans text-sm">{course.emoji}</span>
                <span className="font-sans text-xs text-accent-gold uppercase tracking-wide">{instrumentLabel}</span>
                <span className="font-sans text-xs text-text-secondary">·</span>
                <span className="font-sans text-xs bg-accent-gold text-white px-2 py-0.5">Starter</span>
              </div>
              <h1 className="font-heading text-3xl font-bold mb-2">{course.title}</h1>
              <div className="flex items-center gap-3 text-sm font-sans text-text-secondary">
                <div className="relative w-8 h-8 overflow-hidden rounded-full flex-shrink-0">
                  {/* Avatar placeholder */}
                  <div className="w-8 h-8 bg-border flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
                <span>Hansruedi Wenger</span>
              </div>
            </div>
            <div className="md:w-56">
              <div className="flex justify-between text-xs font-sans mb-2">
                <span className="text-text-secondary">{course.completedLessons} von {course.totalLessons} Lektionen</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <ProgressBar value={progress} />
              <p className="font-sans text-xs text-text-secondary mt-1">{course.modules.length} Module abgeschlossen</p>
            </div>
          </div>
        </motion.div>

        {/* ── Weiter lernen CTA ── */}
        {course.nextModuleId && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark text-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <p className="font-sans text-xs text-accent-gold uppercase tracking-wide mb-1">Weiter lernen</p>
              <p className="font-sans font-medium">{course.nextModuleTitle} — {course.nextLessonTitle}</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              href={`/member/academy/instrument/${params.id}/kurs/${params.kursId}/modul/${course.nextModuleId}?lektion=${course.nextLessonId}`}
            >
              Jetzt lernen →
            </Button>
          </motion.div>
        )}

        {/* ── Module list ── */}
        <section>
          <h2 className="font-heading text-xl font-bold mb-4">Kursinhalt</h2>
          <div className="space-y-2">
            {course.modules.map((mod, i) => {
              const isExpanded = expandedModules.has(mod.id)
              const isLocked = mod.status === 'locked'
              const sc = statusConfig[mod.status] ?? statusConfig['not-started']
              const totalMinutes = getTotalMinutes(mod.lessons)
              const completedCount = mod.lessons.filter((l) => l.completed).length

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`border ${isLocked ? 'border-border opacity-60' : 'border-border hover:border-dark'} transition-colors bg-surface overflow-hidden`}
                >
                  {/* Module header */}
                  <button
                    onClick={() => !isLocked && toggleModule(mod.id)}
                    disabled={isLocked}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-left ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {/* Module number */}
                    <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 font-heading font-bold text-sm ${mod.status === 'completed' ? 'bg-accent-gold text-white' : 'bg-background border border-border text-text-secondary'}`}>
                      {mod.status === 'completed' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : String(i + 1).padStart(2, '0')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-sans font-medium text-sm">{mod.title}</h3>
                        {isLocked && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary flex-shrink-0">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="font-sans text-xs text-text-secondary">{mod.lessons.length} Lektionen · {totalMinutes} Minuten</span>
                        {mod.status !== 'not-started' && mod.status !== 'locked' && (
                          <>
                            <span className="text-text-secondary">·</span>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              <span className={`font-sans text-xs ${sc.color}`}>
                                {mod.status === 'in-progress' ? `${completedCount}/${mod.lessons.length} Lektionen` : sc.label}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {!isLocked && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </motion.div>
                    )}
                  </button>

                  {/* Expanded lesson list */}
                  <AnimatePresence initial={false}>
                    {isExpanded && !isLocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border divide-y divide-border">
                          {mod.lessons.map((lesson) => (
                            <Link
                              key={lesson.id}
                              href={`/member/academy/instrument/${params.id}/kurs/${params.kursId}/modul/${mod.id}?lektion=${lesson.id}`}
                              className="flex items-center gap-4 px-5 py-3 bg-background hover:bg-surface transition-colors group"
                            >
                              {/* Completion indicator */}
                              <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 border ${lesson.completed ? 'border-accent-gold bg-accent-gold' : 'border-border'}`}>
                                {lesson.completed && (
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className={`font-sans text-sm ${lesson.completed ? 'text-text-secondary' : 'group-hover:text-accent-gold transition-colors'}`}>
                                  {lesson.title}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 flex-shrink-0">
                                <TypeBadge type={lesson.type} />
                                <span className="font-sans text-xs text-text-secondary">{lesson.duration}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary group-hover:text-accent-gold transition-colors">
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
