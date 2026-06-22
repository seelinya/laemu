// ─── LAEMU Musikschule: Instrument-Lehrgänge ──────────────────────────────────
// Gemeinsame Datenquelle für die Instrument-Übersichtsseiten UND die integrierte
// Lehrgang-Ansicht auf der Musikschule-Startseite. So sehen beide Stellen
// garantiert identisch aus.

export type InstrumentId = 'handorgel' | 'schwyzer'

export type StarterKurs = {
  id: string
  title: string
  desc: string
  modules: number
  completedModules: number
  duration: string
  level: string
}

export type ProKurs = {
  id: string
  title: string
  desc: string
  modules: number
  duration: string
  level: string
}

export type InstrumentOverview = {
  id: InstrumentId
  label: string
  emoji: string
  desc: string
  plan: 'starter' | 'pro'
  overallProgress: number
  starterKurse: StarterKurs[]
  proKurse: ProKurs[]
}

const handorgelStarterKurse: StarterKurs[] = [
  { id: 'grundlagen', title: 'Grundlagenkurs', desc: 'Der Einstieg in die Welt der Handorgel — von null bis zu deinen ersten Liedern.', modules: 5, completedModules: 3, duration: '8h', level: 'Einsteiger' },
  { id: 'uebungen', title: 'Übungskurse', desc: 'Strukturierte Übungen für Finger, Rhythmus und Klang.', modules: 4, completedModules: 0, duration: '6h', level: 'Einsteiger' },
  { id: 'pflege', title: 'Hege & Pflege', desc: 'Pflege, Stimmung und Wartung deiner Handorgel.', modules: 3, completedModules: 0, duration: '3h', level: 'Einsteiger' },
  { id: 'repertoire', title: 'Erstes Repertoire', desc: 'Deine ersten echten Ländlerstücke Schritt für Schritt erlernt.', modules: 6, completedModules: 0, duration: '10h', level: 'Einsteiger' },
]

const schwyzerStarterKurse: StarterKurs[] = [
  { id: 'grundlagen', title: 'Grundlagenkurs Schwyzerörgeli', desc: 'Der Einstieg in die diatonische Welt des Schwyzerörgeli.', modules: 5, completedModules: 1, duration: '7h', level: 'Einsteiger' },
  { id: 'uebungen', title: 'Übungskurse', desc: 'Strukturierte Übungen für Grifftechnik und Balg.', modules: 4, completedModules: 0, duration: '5h', level: 'Einsteiger' },
  { id: 'stimmung', title: 'Stimmung & Pflege', desc: 'Pflege und Wartung des Schwyzerörgeli.', modules: 3, completedModules: 0, duration: '2h', level: 'Einsteiger' },
  { id: 'repertoire', title: 'Appenzeller Repertoire', desc: 'Klassische Appenzeller Stücke für Einsteiger.', modules: 5, completedModules: 0, duration: '9h', level: 'Einsteiger' },
]

const handorgelProKurse: ProKurs[] = [
  { id: 'harmonielehre', title: 'Harmonielehre', desc: 'Akkorde, Tonarten und Stimmführung für die Handorgel.', modules: 4, duration: '7h', level: 'Fortgeschritten' },
  { id: 'fortgeschritten', title: 'Fortgeschrittene Techniken', desc: 'Läufe, Verzierungen und Dynamik auf höchstem Niveau.', modules: 5, duration: '9h', level: 'Fortgeschritten' },
  { id: 'ensemble', title: 'Ensemble-Spiel', desc: 'Zusammenspiel und Arrangement in der Formation.', modules: 3, duration: '5h', level: 'Fortgeschritten' },
  { id: 'improvisation', title: 'Improvisation', desc: 'Frei spielen im Ländlerstil — Variationen erfinden.', modules: 4, duration: '6h', level: 'Profi' },
]

const schwyzerProKurse: ProKurs[] = [
  { id: 'harmonielehre', title: 'Harmonielehre', desc: 'Tonarten, Akkorde und Stimmführung für das Schwyzerörgeli.', modules: 4, duration: '6h', level: 'Fortgeschritten' },
  { id: 'fortgeschritten', title: 'Fortgeschrittene Grifftechnik', desc: 'Verzierungen, schnelle Läufe und präzise Balgführung.', modules: 5, duration: '8h', level: 'Fortgeschritten' },
  { id: 'ensemble', title: 'Ensemble-Spiel', desc: 'Zusammenspiel in Appenzeller Formation.', modules: 3, duration: '4h', level: 'Fortgeschritten' },
  { id: 'improvisation', title: 'Improvisation & Zäuerli', desc: 'Freies Spiel und Zäuerli-Stilistik.', modules: 4, duration: '5h', level: 'Profi' },
]

export const INSTRUMENT_OVERVIEWS: Record<InstrumentId, InstrumentOverview> = {
  handorgel: {
    id: 'handorgel', label: 'Handorgel', emoji: '🪗', desc: 'Das Herzstück der Ländlermusik',
    plan: 'starter', overallProgress: 42, starterKurse: handorgelStarterKurse, proKurse: handorgelProKurse,
  },
  schwyzer: {
    id: 'schwyzer', label: 'Schwyzerörgeli', emoji: '🎵', desc: 'Diatonisch und voller Seele',
    plan: 'starter', overallProgress: 18, starterKurse: schwyzerStarterKurse, proKurse: schwyzerProKurse,
  },
}

// Instrumente, zu denen der/die Lernende einen Lehrgang abonniert hat.
export const SUBSCRIBED_INSTRUMENTS: InstrumentId[] = ['handorgel', 'schwyzer']

export function getInstrumentOverview(id: string): InstrumentOverview | undefined {
  return INSTRUMENT_OVERVIEWS[id as InstrumentId]
}

// Abo-/Profil-Instrumentlabel → Overview-Id (nur Instrumente mit Lehrgang-Inhalt).
const LABEL_TO_ID: Record<string, InstrumentId> = {
  Handorgel: 'handorgel',
  Schwyzerörgeli: 'schwyzer',
}

export function instrumentIdFromLabel(label: string): InstrumentId | undefined {
  return LABEL_TO_ID[label.trim()]
}

// Aus einer Liste von Instrument-Labels die Overview-Ids ableiten (Reihenfolge
// wie in INSTRUMENT_OVERVIEWS, ohne Duplikate).
export function overviewIdsFromLabels(labels: string[]): InstrumentId[] {
  const ids = new Set(labels.map(instrumentIdFromLabel).filter(Boolean) as InstrumentId[])
  return SUBSCRIBED_INSTRUMENTS.filter(id => ids.has(id))
}

export function kursProgress(kurs: StarterKurs): number {
  if (kurs.modules === 0) return 0
  return Math.round((kurs.completedModules / kurs.modules) * 100)
}
