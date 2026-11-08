'use client'

// ─── E-Mail-Benachrichtigungen (Demo) ─────────────────────────────────────────
// Steuert, worüber ein Mitglied per E-Mail informiert wird. Persistiert im
// localStorage; verwaltet wird dies unter «Konto → Benachrichtigungen».

import { useEffect, useState } from 'react'

const KEY = 'laemu-notifications'
const EVENT = 'laemu-notifications-change'

export type NotificationSettings = {
  // E-Mail, wenn jemand direkt auf einen eigenen Kommentar antwortet.
  emailOnReply: boolean
  // E-Mail über Neuigkeiten/News vom LAEMU-Team.
  emailOnNews: boolean
  // E-Mail, wenn ein gewünschtes Stück (Stückwunsch) veröffentlicht wird.
  emailOnWish: boolean
}

export const defaultNotificationSettings: NotificationSettings = {
  emailOnReply: true,
  emailOnNews: true,
  emailOnWish: true,
}

export function readNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return defaultNotificationSettings
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return defaultNotificationSettings
    const parsed = JSON.parse(raw) as Partial<NotificationSettings>
    return { ...defaultNotificationSettings, ...parsed }
  } catch {
    return defaultNotificationSettings
  }
}

export function setNotificationSettings(patch: Partial<NotificationSettings>) {
  if (typeof window === 'undefined') return
  try {
    const current = readNotificationSettings()
    window.localStorage.setItem(KEY, JSON.stringify({ ...current, ...patch }))
    window.dispatchEvent(new Event(EVENT))
  } catch {
    /* localStorage nicht verfügbar — ignorieren */
  }
}

export function useNotificationSettings(): [NotificationSettings, (patch: Partial<NotificationSettings>) => void] {
  const [settings, setSettings] = useState<NotificationSettings>(defaultNotificationSettings)

  useEffect(() => {
    setSettings(readNotificationSettings())
    const refresh = () => setSettings(readNotificationSettings())
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) refresh() }
    window.addEventListener('storage', onStorage)
    window.addEventListener(EVENT, refresh)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(EVENT, refresh)
    }
  }, [])

  return [settings, setNotificationSettings]
}
