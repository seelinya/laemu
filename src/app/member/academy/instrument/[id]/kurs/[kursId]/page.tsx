'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getCourse, courseStats, freeTrialLessonKeys, type Lesson } from '@/lib/courses'
import { isCourseUnlocked } from '@/lib/academy'
import { useUserAbo } from '@/lib/userPlan'
import { addRecentCourse } from '@/lib/recentCourses'

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
    text: { label: 'Text', bg: 'bg-dark/10 text-text-primary' },
    'video+text': { label: 'Video+Text', bg: 'bg-blue-50 text-blue-700' },
  }
  const c = config[type]
  return <span className={`font-sans text-[10px] px-1.5 py-0.5 ${c.bg}`}>{c.label}</span>
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function KursPage({ params }: { params: { id: string; kursId: string } }) {
  const course = getCourse(params.id, params.kursId)
  const userAbo = useUserAbo()
  // Voller Zugang hängt von Level + gewählten Instrumenten ab. Sonst nur
  // Schnupper-Lektionen (Vorschau) — egal welches Abo.
  const fullyUnlocked = course ? isCourseUnlocked(course.level, course.instrumentLabel, userAbo) : false
  // Free-Einblick: In jedem (noch nicht voll freigeschalteten) Kurs sind die
  // ersten Lektionen zum Reinschnuppern frei.
  const previewOnly = !fullyUnlocked
  const trialKeys = previewOnly && course ? freeTrialLessonKeys(course) : new Set<string>()
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(course ? course.modules.slice(0, 2).map((m) => m.id) : []))

  // Geöffneten (freigeschalteten) Kurs als «zuletzt angeschaut» merken — so
  // füllt sich der Tab erst, wenn man Kurse tatsächlich antippt.
  useEffect(() => {
    if (course && fullyUnlocked) {
      addRecentCourse({ instrumentId: course.instrumentId, kursId: course.id })
    }
  }, [course, fullyUnlocked])

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

  const getTotalMinutes = (lessons: Lesson[]): number =>
    lessons.reduce((sum, l) => {
      const match = l.duration.match(/(\d+)/)
      return sum + (match ? parseInt(match[1], 10) : 0)
    }, 0)

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-dark text-white px-6 py-3 flex items-center gap-3">
          <Link href="/member/academy" className="font-sans text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Musikschule
          </Link>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h1 className="font-heading text-2xl font-bold mb-2">Kurs in Vorbereitung</h1>
          <p className="font-sans text-text-secondary">Dieser Kurs wird gerade aufgebaut. Schau bald wieder vorbei!</p>
        </div>
      </div>
    )
  }

  const stats = courseStats(course)
  const progress = stats.percent
  // Ein Kurs gilt automatisch als abgeschlossen, sobald alle Lektionen erledigt sind.
  const courseCompleted = stats.total > 0 && stats.completed === stats.total
  const instrumentLabel = course.instrumentLabel

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <div className="bg-dark text-white px-6 py-3 flex items-center gap-3">
        <Link href="/member/academy" className="font-sans text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Musikschule
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
                <span className="font-sans text-xs bg-accent-gold text-white px-2 py-0.5">{course.level}</span>
                {courseCompleted && (
                  <span className="font-sans text-xs bg-green-600 text-white px-2 py-0.5 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    Abgeschlossen
                  </span>
                )}
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
                <span>{course.teacher}</span>
              </div>
            </div>
            <div className="md:w-56">
              <div className="flex justify-between text-xs font-sans mb-2">
                <span className="text-text-secondary">{stats.completed} von {stats.total} Lektionen</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <ProgressBar value={progress} />
              <p className="font-sans text-xs text-text-secondary mt-1">{course.modules.length} Module</p>
              {courseCompleted && (
                <div className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 border border-green-500 text-green-600 font-sans text-xs">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Kurs abgeschlossen
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Schnupper-Hinweis (Kurs nicht im Abo / Instrument freigeschaltet) ── */}
        {previewOnly && (
          <div className="bg-accent-gold/5 border border-accent-gold/30 px-4 py-3 flex items-start gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
            <p className="font-sans text-xs text-text-secondary leading-relaxed">
              <strong className="text-text-primary font-semibold">Vorschau.</strong> Die ersten Lektionen dieses Kurses sind zum Reinschnuppern frei. Für den ganzen Kurs schaltest du mit dem passenden Abo {course.level === 'Pro' ? 'Pro' : `Starter für ${course.instrumentLabel}`} frei.{' '}
              <Link href="/member/academy" className="text-accent-gold font-medium hover:underline">Zur Übersicht →</Link>
            </p>
          </div>
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
                          {mod.lessons.map((lesson) => {
                            const lessonLocked = previewOnly && !trialKeys.has(`${mod.id}:${lesson.id}`)
                            if (lessonLocked) {
                              return (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-4 px-5 py-3 bg-background opacity-70 cursor-not-allowed"
                                  title="Im Free-Account gesperrt — Plan upgraden"
                                >
                                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 border border-border text-text-secondary">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-sans text-sm text-text-secondary">{lesson.title}</p>
                                  </div>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="font-sans text-[10px] px-1.5 py-0.5 bg-border text-text-secondary uppercase tracking-wide">Upgrade</span>
                                    <span className="font-sans text-xs text-text-secondary">{lesson.duration}</span>
                                  </div>
                                </div>
                              )
                            }
                            return (
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
                            )
                          })}
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
