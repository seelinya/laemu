// ─── Instrument-Badge-Styling (Design System Kap. 1 & 5) ─────────────────────
// Drei Hauptinstrumente → gefüllte Badges in den drei markenkonformen
// Tonalitäten Gold / Silber / Steingrau. Zwei Begleitkurse (Klavier, Klarinette)
// → Outline-Badge + Suffix-Label „· Begleitung", nie gefüllt, zur klaren
// Unterscheidung von den Hauptinstrumenten. Übrige (Profil-)Instrumente bleiben
// neutral, da das Farbschema nur das Kursangebot der Musikschule abbildet.

export type InstrumentBadge = {
  className: string   // Tailwind-Klassen für den Badge selbst
  begleitung: boolean // true → Suffix „· Begleitung" daneben anzeigen
}

const BASE = 'font-sans text-xs font-bold uppercase tracking-widest px-2 py-0.5'

export function instrumentBadge(name: string): InstrumentBadge {
  const key = name.trim().toLowerCase()

  // Hauptinstrumente — gefüllte Badges.
  if (key.includes('handorgel')) {
    return { className: `${BASE} bg-accent-gold text-on-gold`, begleitung: false }
  }
  if (key.includes('schwyzer') || key.includes('örgeli') || key.includes('oergeli')) {
    // Silbergrau-Akzent: heller Grund → schwarzer Text (besser lesbar als auf Gold).
    return { className: `${BASE} bg-accent-silver text-text-primary`, begleitung: false }
  }
  if (key.includes('bassgeige')) {
    // Steingrau-Akzent.
    return { className: `${BASE} bg-[#787878] text-white`, begleitung: false }
  }

  // Begleitkurse — Outline + Label, nie gefüllt.
  if (key.includes('klavier')) {
    return { className: `${BASE} border border-accent-gold text-accent-gold`, begleitung: true }
  }
  if (key.includes('klarinette')) {
    // Silbergrau wird nicht als Text genutzt (zu wenig Kontrast) → text-secondary.
    return { className: `${BASE} border border-accent-silver text-text-secondary`, begleitung: true }
  }

  // Übrige Instrumente (Geige, Hackbrett, eigene Einträge) — neutral.
  return {
    className: 'font-sans text-xs px-2 py-1 bg-surface-muted border border-border text-text-secondary',
    begleitung: false,
  }
}
