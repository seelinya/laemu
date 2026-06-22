'use client'

import Link from 'next/link'
import { CourseCover } from '@/components/CourseCover'

// ─── Starter-Kurs-Karte ───────────────────────────────────────────────────────
// Horizontale Karte: Instrument-Cover + Titel, Level, Module/Dauer, Beschreibung
// und entweder Fortschritt (begonnen) oder «Kurs öffnen». Einheitlich für die
// Instrument-Übersicht und die Startseite.

export function StarterCourseCard({
  href,
  title,
  level,
  modules,
  duration,
  desc,
  completedModules,
  emoji,
  variant,
  locked = false,
  lockLabel = 'Gesperrt',
  comingSoon = false,
}: {
  href: string
  title: string
  level: string
  modules: number
  duration: string
  desc: string
  completedModules: number
  emoji: string
  variant: string
  locked?: boolean
  lockLabel?: string
  comingSoon?: boolean
}) {
  const progress = modules === 0 ? 0 : Math.round((completedModules / modules) * 100)
  return (
    <Link
      href={href}
      className="bg-surface border border-border overflow-hidden group hover:border-accent-gold transition-colors flex h-full"
    >
      <div className="relative w-24 sm:w-28 flex-shrink-0 self-stretch overflow-hidden">
        <CourseCover emoji={emoji} variant={variant} size="sm" />
        {!comingSoon && locked && (
          <span className="absolute inset-0 bg-dark/45 flex items-center justify-center z-10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
          </span>
        )}
        {!comingSoon && !locked && progress > 0 && (
          <span className="absolute top-2 left-2 bg-accent-gold text-white text-[10px] font-sans font-medium px-1.5 py-0.5 z-10">
            {progress}%
          </span>
        )}
      </div>
      <div className="flex-1 p-4 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-heading font-bold text-base leading-snug group-hover:text-accent-gold transition-colors">{title}</h3>
          {comingSoon ? (
            <span className="font-sans text-[10px] uppercase tracking-wide bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 flex-shrink-0 whitespace-nowrap">In Aufbau</span>
          ) : (
            <span className="font-sans text-[10px] uppercase tracking-wide bg-background border border-border text-text-secondary px-2 py-0.5 flex-shrink-0">{level}</span>
          )}
        </div>
        <p className="font-sans text-xs text-text-secondary mb-2">{modules} Module · {duration}</p>
        <p className="font-sans text-sm text-text-secondary leading-relaxed line-clamp-2 flex-1">{desc}</p>
        {comingSoon ? (
          <span className="mt-3 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-text-secondary group-hover:text-dark transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            In Vorbereitung
          </span>
        ) : locked ? (
          <span className="mt-3 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-text-secondary group-hover:text-dark transition-colors">
            {lockLabel} · Vorschau ansehen
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </span>
        ) : progress > 0 ? (
          <div className="mt-3">
            <div className="flex justify-between text-xs font-sans mb-1">
              <span className="text-text-secondary">{completedModules}/{modules} Module</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-1 bg-border overflow-hidden"><div className="h-full bg-accent-gold" style={{ width: `${progress}%` }} /></div>
            <span className="mt-2.5 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-dark group-hover:text-accent-gold transition-colors">
              Weiterfahren
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </span>
          </div>
        ) : (
          <span className="mt-3 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-dark group-hover:text-accent-gold transition-colors">
            Kurs öffnen
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </span>
        )}
      </div>
    </Link>
  )
}

// ─── Gesperrte Pro-Kurs-Zeile ─────────────────────────────────────────────────

export function ProCourseRow({ title, level, modules, duration }: { title: string; level: string; modules: number; duration: string }) {
  return (
    <div className="bg-surface border border-border p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-background border border-border flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-bold text-base text-text-secondary truncate">{title}</h3>
          <span className="font-sans text-[10px] uppercase tracking-wide bg-background border border-border text-text-secondary px-2 py-0.5 flex-shrink-0 hidden sm:inline">{level}</span>
        </div>
        <p className="font-sans text-xs text-text-secondary mt-0.5">{modules} Module · {duration}</p>
      </div>
      <span className="font-sans text-[11px] text-text-secondary bg-border px-2 py-1 flex items-center gap-1 flex-shrink-0">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
        Pro
      </span>
    </div>
  )
}

// ─── Pro-Upgrade-Banner ───────────────────────────────────────────────────────
// onUpgrade öffnet das Upgrade-Modal (Startseite); ohne Handler wird zur
// Abo-Verwaltung verlinkt (Instrument-Übersicht).

export function ProUpgradeBanner({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div className="mt-6 bg-dark text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="font-sans text-sm font-medium text-accent-gold">Schalte den Pro-Lehrgang frei</span>
        </div>
        <p className="font-sans text-white/60 text-sm">Persönliches Feedback, Live-Calls, Erweiterungskurse und Profi-Techniken</p>
      </div>
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="text-right">
          <p className="font-heading font-bold text-2xl text-accent-gold">CHF 119<span className="text-base font-sans font-normal text-white/50">/Mt.</span></p>
          <p className="font-sans text-xs text-white/40">oder CHF 1&apos;199/Jahr</p>
        </div>
        {onUpgrade ? (
          <button onClick={onUpgrade} className="bg-accent-gold text-white px-4 py-2.5 font-sans text-sm font-medium hover:bg-accent-earth transition-colors whitespace-nowrap">
            Auf Pro upgraden →
          </button>
        ) : (
          <Link href="/member/account?tab=abo" className="bg-accent-gold text-white px-4 py-2.5 font-sans text-sm font-medium hover:bg-accent-earth transition-colors whitespace-nowrap">
            Auf Pro upgraden →
          </Link>
        )}
      </div>
    </div>
  )
}
