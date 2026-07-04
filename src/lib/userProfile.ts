'use client'

// ─── Profil-Angaben des Nutzers (Demo) ────────────────────────────────────────
// Damit der Mitgliederbereich die bei der Registrierung eingegebenen Angaben
// (Name, Wohnort, Bio, Instrumente …) widerspiegelt, persistieren wir sie im
// localStorage und lesen sie über `useUserProfile()` im Profil aus.

import { useEffect, useState } from 'react'

const PROFILE_KEY = 'laemu-profile'
// Gleicher-Tab-Benachrichtigung: das `storage`-Event feuert nur über Tabs
// hinweg. Damit Header, Community-Sidebar und Profil im selben Tab sofort auf
// Profiländerungen reagieren, lösen wir zusätzlich ein eigenes Event aus.
const PROFILE_EVENT = 'laemu-profile-change'

export type UserProfile = {
  name: string
  email: string
  wohnort: string
  bio: string
  instruments: string
  avatar: string
  openForFormation: boolean
  inFormation: boolean
  formationName: string
  // Ist diese Person in ihrer Formation zahlungspflichtig? Die Person, die die
  // Formation registriert und das Abo bezahlt, ist zahlungspflichtig; per
  // Einladung beigetretene Mitglieder sind es nicht.
  formationPayer: boolean
}

// Standardprofil (Demo-Nutzer), falls noch keine Registrierungsdaten vorliegen.
export const defaultProfile: UserProfile = {
  name: 'Niklaus Hess',
  email: '',
  wohnort: 'Luzern',
  bio: 'Handorgelist aus Luzern. Leidenschaft für Ländlermusik seit 20 Jahren.',
  instruments: 'Handorgel, Schwyzerörgeli',
  // Kein Standard-Profilbild: Solange der/die Nutzer:in keines hochlädt, zeigen
  // wir überall einen Initialen-Platzhalter statt eines fremden Stockfotos.
  avatar: '',
  openForFormation: false,
  inFormation: false,
  formationName: '',
  formationPayer: false,
}

// Initialen aus dem Namen ableiten (z. B. «Niklaus Hess» → «NH») — als
// Platzhalter, wenn (noch) kein Profilbild hochgeladen wurde.
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Aus dem Namen ein @handle ableiten (z. B. «Niklaus Hess» → «niklaus_hess»).
export function handleFromName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return slug || 'mitglied'
}

export function readStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return defaultProfile
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY)
    if (!raw) return defaultProfile
    const parsed = JSON.parse(raw) as Partial<UserProfile>
    if (!parsed || typeof parsed.name !== 'string') return defaultProfile
    return { ...defaultProfile, ...parsed }
  } catch {
    return defaultProfile
  }
}

export function setStoredProfile(profile: Partial<UserProfile>) {
  if (typeof window === 'undefined') return
  try {
    const current = readStoredProfile()
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...current, ...profile }))
    // Gleicher-Tab-Konsumenten (Header, Sidebar …) sofort benachrichtigen.
    window.dispatchEvent(new Event(PROFILE_EVENT))
  } catch {
    // localStorage nicht verfügbar — ignorieren.
  }
}

/**
 * Liefert die Profil-Angaben. Beim ersten Render (SSR / vor dem Mount) wird das
 * Standardprofil zurückgegeben, nach dem Mount der im localStorage gespeicherte
 * Wert.
 */
export function useUserProfile(): UserProfile {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)

  useEffect(() => {
    setProfile(readStoredProfile())
    const refresh = () => setProfile(readStoredProfile())
    const onStorage = (e: StorageEvent) => {
      if (e.key === PROFILE_KEY) refresh()
    }
    // `storage` für andere Tabs, das eigene Event für denselben Tab.
    window.addEventListener('storage', onStorage)
    window.addEventListener(PROFILE_EVENT, refresh)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(PROFILE_EVENT, refresh)
    }
  }, [])

  return profile
}
