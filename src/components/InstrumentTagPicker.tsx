'use client'

import { useState } from 'react'

// Instrument-Tags fürs Profil. Reine Profilangabe — wird NICHT unter «Entdecken»
// als Filter genutzt, sondern nur im Profil der jeweiligen Person angezeigt.
// Gespeichert wird wie bisher als kommaseparierter String.
export const PRESET_INSTRUMENTS = [
  'Schwyzerörgeli',
  'Handorgel',
  'Bassgeige',
  'Klavier',
  'Klarinette',
  'Geige',
  'Hackbrett',
]

export function InstrumentTagPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const selected = value.split(',').map(s => s.trim()).filter(Boolean)
  const [showCustom, setShowCustom] = useState(false)
  const [custom, setCustom] = useState('')

  const has = (name: string) => selected.some(s => s.toLowerCase() === name.toLowerCase())
  const commit = (arr: string[]) => onChange(arr.join(', '))
  const toggle = (name: string) => {
    if (has(name)) commit(selected.filter(s => s.toLowerCase() !== name.toLowerCase()))
    else commit([...selected, name])
  }
  const addCustom = () => {
    const v = custom.trim()
    if (v && !has(v)) commit([...selected, v])
    setCustom('')
    setShowCustom(false)
  }

  // Eigene Einträge = ausgewählte, die nicht in der Vorgabeliste stehen.
  const customTags = selected.filter(s => !PRESET_INSTRUMENTS.some(p => p.toLowerCase() === s.toLowerCase()))

  const chip = (active: boolean) =>
    `font-sans text-xs font-medium px-3 py-1.5 border transition-colors ${
      active ? 'border-dark bg-dark text-white' : 'border-border bg-surface text-text-secondary hover:border-dark'
    }`

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {PRESET_INSTRUMENTS.map(name => (
          <button key={name} type="button" onClick={() => toggle(name)} className={chip(has(name))}>
            {has(name) ? '✓ ' : ''}{name}
          </button>
        ))}
        {customTags.map(name => (
          <button key={name} type="button" onClick={() => toggle(name)} className={`${chip(true)} inline-flex items-center gap-1.5`} title="Entfernen">
            {name}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustom(s => !s)}
          className="font-sans text-xs font-medium px-3 py-1.5 border border-dashed border-border text-text-secondary hover:border-dark hover:text-text-primary transition-colors"
        >
          + Sonstiges
        </button>
      </div>

      {showCustom && (
        <div className="flex gap-2">
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
            placeholder="Instrument eingeben…"
            autoFocus
            className="flex-1 border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark bg-surface"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!custom.trim()}
            className="font-sans text-sm px-4 py-2 bg-dark text-white hover:bg-accent-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Hinzufügen
          </button>
        </div>
      )}
    </div>
  )
}
