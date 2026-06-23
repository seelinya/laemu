'use client'

// ─── Zuletzt angeschaute Kurse (Demo, localStorage) ───────────────────────────
// In dieser Demo gibt es kein Backend. Damit «Zuletzt angeschaut» in der
// Musikschule erst dann Kurse zeigt, wenn man sie tatsächlich geöffnet hat (und
// bei einem frisch gekauften Lehrgang noch leer ist), merken wir die geöffneten
// Kurse im localStorage.

import { useEffect, useState } from 'react'

const KEY = 'laemu-recent-courses'
const MAX = 12

export type RecentCourseRef = { instrumentId: string; kursId: string }

export function readRecentCourses(): RecentCourseRef[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is RecentCourseRef =>
        !!x && typeof x.instrumentId === 'string' && typeof x.kursId === 'string',
    )
  } catch {
    return []
  }
}

// Öffnet man einen Kurs, rückt er an die Spitze der Liste (jüngste zuerst).
export function addRecentCourse(ref: RecentCourseRef) {
  if (typeof window === 'undefined') return
  try {
    const rest = readRecentCourses().filter(
      (x) => !(x.instrumentId === ref.instrumentId && x.kursId === ref.kursId),
    )
    const next = [ref, ...rest].slice(0, MAX)
    window.localStorage.setItem(KEY, JSON.stringify(next))
    // Gleiche-Tab-Updates anstossen (storage-Event feuert nur tab-übergreifend).
    window.dispatchEvent(new Event('laemu-recent-courses'))
  } catch {
    // localStorage nicht verfügbar — ignorieren.
  }
}

export function useRecentCourses(): RecentCourseRef[] {
  const [list, setList] = useState<RecentCourseRef[]>([])
  useEffect(() => {
    const refresh = () => setList(readRecentCourses())
    refresh()
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('laemu-recent-courses', refresh)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('laemu-recent-courses', refresh)
    }
  }, [])
  return list
}
