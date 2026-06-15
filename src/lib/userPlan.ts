'use client'

// ─── Aktueller Abo-Zustand des Nutzers (Demo) ─────────────────────────────────
// In dieser Demo gibt es kein echtes Backend. Damit der Mitgliederbereich den
// bei der Registrierung gewählten Plan widerspiegelt (Free / Starter / Pro …),
// persistieren wir den gewählten Abo-Zustand im localStorage und lesen ihn über
// den Hook `useUserAbo()` in den Mitglieder-Seiten.

import { useEffect, useState } from 'react'
import { mockUserAbo, type UserAbo } from './academy'

const PLAN_KEY = 'laemu-abo'

export function readStoredAbo(): UserAbo {
  if (typeof window === 'undefined') return mockUserAbo
  try {
    const raw = window.localStorage.getItem(PLAN_KEY)
    if (!raw) return mockUserAbo
    const parsed = JSON.parse(raw) as UserAbo
    if (!parsed || typeof parsed.plan !== 'string') return mockUserAbo
    return parsed
  } catch {
    return mockUserAbo
  }
}

export function setStoredAbo(abo: UserAbo) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PLAN_KEY, JSON.stringify(abo))
  } catch {
    // localStorage nicht verfügbar — ignorieren.
  }
}

/**
 * Liefert den aktuellen Abo-Zustand. Beim ersten Render (SSR / vor dem Mount)
 * wird der Standard (`mockUserAbo`) zurückgegeben, nach dem Mount der im
 * localStorage gespeicherte Wert.
 */
export function useUserAbo(): UserAbo {
  const [abo, setAbo] = useState<UserAbo>(mockUserAbo)

  useEffect(() => {
    setAbo(readStoredAbo())
    const onStorage = (e: StorageEvent) => {
      if (e.key === PLAN_KEY) setAbo(readStoredAbo())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return abo
}
