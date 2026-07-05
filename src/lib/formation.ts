'use client'

// ─── Formations-Zustand des Nutzers (Demo) ────────────────────────────────────
// Formationen registrieren sich mit einem Namen und laden ihre weiteren
// Mitglieder per E-Mail ein. Da die anmeldende Person zum Zeitpunkt der
// Registrierung noch nicht alle E-Mails kennen muss, sind diese optional und
// lassen sich später im Konto («Formationsübersicht») ergänzen, einladen oder
// wieder entfernen. Wir persistieren den Zustand im localStorage und lesen ihn
// über `useFormation()` aus.

import { useEffect, useState } from 'react'

const FORMATION_KEY = 'laemu-formation'
// Gleicher-Tab-Benachrichtigung: das `storage`-Event feuert nur über Tabs
// hinweg. Damit Konto & Übersicht im selben Tab sofort reagieren, lösen wir
// zusätzlich ein eigenes Event aus.
const FORMATION_EVENT = 'laemu-formation-change'

// Ein Platz für ein weiteres Formationsmitglied (nicht die anmeldende Person
// selbst). Solange `email` leer ist, ist der Platz frei; `invited` markiert, ob
// die Einladung bereits verschickt wurde.
export type FormationMemberSlot = {
  id: string
  email: string
  invited: boolean
}

export type FormationState = {
  // Name der Formation, mit der man sich registriert hat.
  name: string
  // Name der zahlungspflichtigen Person (die die Formation registriert & das Abo
  // bezahlt hat). Bei der zahlenden Person ist das der eigene Name.
  payerName: string
  // Die weiteren Mitglieder (ohne die eigene Person).
  members: FormationMemberSlot[]
  // Anzahl der bei der Registrierung bezahlten Mitglieder INKL. der eigenen
  // (zahlungspflichtigen) Person. Bestimmt, wie viele weitere Mitglieder in der
  // Formationsübersicht hinzugefügt werden können — es lassen sich nur so viele
  // Plätze belegen, wie auch eingeladen und bezahlt wurden.
  paidMemberCount: number
}

export const emptyFormation: FormationState = { name: '', payerName: '', members: [], paidMemberCount: 0 }

// Eindeutige Slot-ID (nur clientseitig verwendet, für React-Keys & Updates).
let slotCounter = 0
export function makeSlotId(): string {
  slotCounter += 1
  return `slot-${Date.now().toString(36)}-${slotCounter}`
}

// Erzeugt `count` Mitglieder-Plätze und übernimmt – falls vorhanden – bereits
// erfasste E-Mail-Adressen (aus der Registrierung). Plätze mit E-Mail gelten
// direkt als eingeladen, leere Plätze bleiben offen.
export function buildMemberSlots(count: number, emails: string[] = []): FormationMemberSlot[] {
  return Array.from({ length: Math.max(0, count) }).map((_, i) => {
    const email = (emails[i] ?? '').trim()
    return { id: makeSlotId(), email, invited: email.length > 0 }
  })
}

export function readStoredFormation(): FormationState {
  if (typeof window === 'undefined') return emptyFormation
  try {
    const raw = window.localStorage.getItem(FORMATION_KEY)
    if (!raw) return emptyFormation
    const parsed = JSON.parse(raw) as Partial<FormationState>
    if (!parsed || typeof parsed.name !== 'string') return emptyFormation
    const members = Array.isArray(parsed.members)
      ? parsed.members
          .filter((m): m is FormationMemberSlot => !!m && typeof m.email === 'string')
          .map((m) => ({ id: m.id || makeSlotId(), email: m.email, invited: !!m.invited }))
      : []
    // Bezahlte Mitgliederzahl (inkl. der eigenen Person). Für ältere Formationen
    // ohne dieses Feld leiten wir sie aus den vorhandenen Plätzen ab.
    const paidMemberCount =
      typeof parsed.paidMemberCount === 'number' && parsed.paidMemberCount > 0
        ? parsed.paidMemberCount
        : members.length + 1
    return {
      name: parsed.name,
      payerName: typeof parsed.payerName === 'string' ? parsed.payerName : '',
      members,
      paidMemberCount,
    }
  } catch {
    return emptyFormation
  }
}

export function setStoredFormation(state: FormationState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(FORMATION_KEY, JSON.stringify(state))
    window.dispatchEvent(new Event(FORMATION_EVENT))
  } catch {
    // localStorage nicht verfügbar — ignorieren.
  }
}

/**
 * Liefert den Formations-Zustand. Beim ersten Render (SSR / vor dem Mount) wird
 * ein leerer Zustand zurückgegeben, nach dem Mount der im localStorage
 * gespeicherte Wert. Änderungen im selben Tab werden sofort übernommen.
 */
export function useFormation(): FormationState {
  const [state, setState] = useState<FormationState>(emptyFormation)

  useEffect(() => {
    setState(readStoredFormation())
    const refresh = () => setState(readStoredFormation())
    const onStorage = (e: StorageEvent) => {
      if (e.key === FORMATION_KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(FORMATION_EVENT, refresh)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(FORMATION_EVENT, refresh)
    }
  }, [])

  return state
}
