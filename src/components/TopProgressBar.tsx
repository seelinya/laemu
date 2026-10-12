'use client'

// ─── Seiten-Ladebalken (oben, über dem Header) ────────────────────────────────
// Dünner Fortschrittsbalken am oberen Bildschirmrand, der bei jeder internen
// Navigation erscheint — so sieht man auch bei langsamer Verbindung, dass der
// nächste Inhalt (z. B. ein Kurs oder Lernvideo der Musikschule) geladen wird.
//
// Der Next.js App Router bietet keine Router-Events, deshalb:
//   • Start:  beim Klick auf einen internen Link (mit kleiner Verzögerung, damit
//             sehr schnelle Navigationen nicht kurz aufblitzen).
//   • Fertig: sobald sich der Pfad (`usePathname`) tatsächlich geändert hat, also
//             die Zielseite gerendert wurde.
// Bewusst ohne externe Abhängigkeit und ohne `useSearchParams` (das würde eine
// Suspense-Grenze erzwingen) umgesetzt.

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

// Verzögerung, bevor der Balken sichtbar wird (ms). Navigationen, die schneller
// abgeschlossen sind, zeigen gar keinen Balken — kein störendes Flackern.
const SHOW_DELAY = 120
// Nachlaufzeit, bis der volle Balken (100 %) wieder ausgeblendet wird (ms).
const HIDE_DELAY = 320

export function TopProgressBar() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const [progress, setProgress] = useState(0)

  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rampTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearAll = useCallback(() => {
    if (showTimer.current) { clearTimeout(showTimer.current); showTimer.current = null }
    if (rampTimer.current) { clearInterval(rampTimer.current); rampTimer.current = null }
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null }
  }, [])

  const start = useCallback(() => {
    clearAll()
    // Verzögert einblenden — läuft die Navigation schneller, wird nichts gezeigt.
    showTimer.current = setTimeout(() => {
      setActive(true)
      setProgress(8)
      // Bis ~90 % hochlaufen; die letzten Prozent kommen erst beim Abschluss.
      rampTimer.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p
          const inc = p < 40 ? 9 : p < 70 ? 4 : 1.5
          return Math.min(90, p + inc)
        })
      }, 300)
    }, SHOW_DELAY)
  }, [clearAll])

  const finish = useCallback(() => {
    // Läuft der Abschluss noch vor dem Einblenden (sehr schnelle Navigation),
    // wird der Balken gar nicht erst gezeigt.
    if (!active && !rampTimer.current) {
      clearAll()
      return
    }
    clearAll()
    setActive(true)
    setProgress(100)
    hideTimer.current = setTimeout(() => {
      setActive(false)
      setProgress(0)
    }, HIDE_DELAY)
  }, [active, clearAll])

  // Navigation abgeschlossen: der Pfad hat sich geändert.
  const isFirst = useRef(true)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Klicks auf interne Links erkennen und den Balken starten.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as HTMLElement | null)?.closest?.('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return
      // Externe Links, neue Tabs, Downloads, Anker- und Protokoll-Links: ignorieren.
      if (
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        /^[a-z]+:\/\//i.test(href)
      ) {
        return
      }
      let destPath = href
      try {
        destPath = new URL(href, window.location.href).pathname
      } catch {
        return
      }
      // Gleiche Seite → keine Navigation, kein Balken.
      if (destPath === pathname) return
      start()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [pathname, start])

  // Aufräumen beim Unmount.
  useEffect(() => () => clearAll(), [clearAll])

  if (!active) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[200] h-[3px] pointer-events-none"
    >
      <div
        className="h-full bg-accent-gold transition-[width,opacity] duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1,
          boxShadow: '0 0 8px rgba(188,140,51,0.7), 0 0 4px rgba(188,140,51,0.5)',
        }}
      />
    </div>
  )
}
