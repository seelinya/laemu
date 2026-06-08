// ─── LAEMU Academy: Instrumente, Preise & Freischalt-Logik ────────────────────
// Zentrale Definitionen für das Academy-Angebot (Registrierung) und die
// Freischalt-Logik in der Lernvideo-Datenbank.

// Instrumente bzw. STARTER-/PRO-Kurse — in fester Reihenfolge.
export const ACADEMY_INSTRUMENTS = [
  'Schwyzerörgeli',
  'Handorgel',
  'Bassgeige',
  'Klavierbegleitung',
  'Klarinette',
] as const

export type Instrument = (typeof ACADEMY_INSTRUMENTS)[number]
export type Plan = 'free' | 'starter' | 'pro'

// ─── Preise ───────────────────────────────────────────────────────────────────
// Einzelpersonen: Starter & Pro nach Umfang (1 / 2 / 3 Instrumente / All-in-One),
// Lernvideodatenbank als eigenständiges Abo.

export type Scope = '1' | '2' | '3' | 'all'

export const scopeLabels: Record<Scope, string> = {
  '1': '1 Instrument',
  '2': '2 Instrumente',
  '3': '3 Instrumente',
  all: 'All-in-One',
}

type Price = { monthly: number; yearly: number }

export const individualPricing: {
  starter: Record<Scope, Price>
  pro: Record<Scope, Price>
  lernvideo: Price
} = {
  starter: {
    '1': { monthly: 69, yearly: 699 },
    '2': { monthly: 99, yearly: 999 },
    '3': { monthly: 119, yearly: 1199 },
    all: { monthly: 139, yearly: 1399 },
  },
  pro: {
    '1': { monthly: 99, yearly: 999 },
    '2': { monthly: 129, yearly: 1299 },
    '3': { monthly: 149, yearly: 1499 },
    all: { monthly: 169, yearly: 1699 },
  },
  lernvideo: { monthly: 69, yearly: 699 },
}

// Reihenfolge der Einzel-Angebote: Starter, Pro, Lernvideodatenbank.
export type IndividualPlanId = 'starter' | 'pro' | 'lernvideo'

export const individualPlanMeta: Record<
  IndividualPlanId,
  { label: string; emoji: string; badge: string | null; audience: string; desc: string; features: string[]; notIncluded?: string[]; hasScope: boolean }
> = {
  starter: {
    label: 'Starter',
    emoji: '🎓',
    badge: null,
    audience: 'Für Einsteiger',
    desc: 'Strukturierter Lehrgang mit Grundkursen — wähle 1, 2, 3 oder alle Instrumente.',
    features: [
      'Strukturierter Online-Lehrgang (Grundkurse)',
      'Generelle Grundkurse (Harmonielehre, Taktarten …)',
      'Starter-Stücke der gewählten Instrumente in der Lernvideo-Datenbank',
      'Persönlicher Support durch zertifizierte LAEMU-Musiklehrpersonen',
      'Kurs-Chat & Community',
      'LAEMU Membership inklusive',
    ],
    hasScope: true,
  },
  pro: {
    label: 'Pro',
    emoji: '⭐',
    badge: 'Empfohlen',
    audience: 'Für Aufsteiger',
    desc: 'Voller Zugang: Grund- & Erweiterungskurse plus die komplette Lernvideo-Datenbank.',
    features: [
      'Alles aus Starter',
      'Grund- und Erweiterungskurse',
      'Komplette Lernvideo-Datenbank — alle Instrumente',
      'Persönlicher Support durch zertifizierte LAEMU-Musiklehrpersonen',
      'Persönliches Video-Feedback & monatliche Live-Calls',
      'LAEMU Membership inklusive',
    ],
    hasScope: true,
  },
  lernvideo: {
    label: 'Lernvideodatenbank',
    emoji: '📹',
    badge: null,
    audience: 'Für Profis',
    desc: 'Zugang zur gesamten Lernvideo-Datenbank für alle Instrumente der Ländlermusik.',
    features: [
      'Lernvideo-Datenbank (alle Instrumente)',
      'Ständig wachsendes Angebot',
      'LAEMU Membership inklusive',
    ],
    notIncluded: ['Keine Grundkurse', 'Keine Erweiterungskurse', 'Kein persönlicher Support'],
    hasScope: false,
  },
}

export const INDIVIDUAL_PLAN_ORDER: IndividualPlanId[] = ['starter', 'pro', 'lernvideo']

// ─── Formationen ────────────────────────────────────────────────────────────
// Gilt für bis zu 4 Mitglieder. Ab dem 5. Mitglied: +10 % Zuschlag pro Mitglied.

export const FORMATION_INCLUDED_MEMBERS = 4
export const FORMATION_SURCHARGE_PER_MEMBER = 0.1

export type FormationPlanId = 'pro' | 'lernvideo'

export const formationPlanMeta: Record<
  FormationPlanId,
  { label: string; emoji: string; basePrice: number; audience: string; desc: string; features: string[] }
> = {
  pro: {
    label: 'Pro',
    emoji: '🏆',
    basePrice: 1999,
    audience: 'Für Aufsteiger',
    desc: 'Ein Pro-Lehrgang zu einem Instrument pro Mitglied — mit Grund- & Erweiterungskursen.',
    features: [
      'Pro-Lehrgang (ein Instrument pro Mitglied)',
      'Grund- und Erweiterungskurse',
      'Komplette Lernvideo-Datenbank — alle Instrumente',
      'Persönlicher Support durch zertifizierte LAEMU-Musiklehrpersonen',
    ],
  },
  lernvideo: {
    label: 'Lernvideodatenbank',
    emoji: '📹',
    basePrice: 1499,
    audience: 'Für Profis',
    desc: 'Zugang zur gesamten Lernvideo-Datenbank für alle Mitglieder.',
    features: [
      'Lernvideo-Datenbank (alle Instrumente) für alle Mitglieder',
      'Ständig wachsendes Angebot',
    ],
  },
}

// Jahrespreis einer Formation inkl. 10 %-Zuschlag pro Mitglied über 4.
export function formationYearlyPrice(plan: FormationPlanId, members: number): number {
  const base = formationPlanMeta[plan].basePrice
  const extra = Math.max(0, members - FORMATION_INCLUDED_MEMBERS)
  return Math.round(base * (1 + extra * FORMATION_SURCHARGE_PER_MEMBER))
}

// ─── Freischalt-Logik (Lernvideo-Datenbank) ──────────────────────────────────

export type UserAbo = {
  plan: IndividualPlanId | 'none'
  instruments: Instrument[]
  allInstruments?: boolean
}

// Mock: aktuell eingeloggter Nutzer — STARTER-Abo für Handorgel.
export const mockUserAbo: UserAbo = {
  plan: 'starter',
  instruments: ['Handorgel'],
}

/**
 * Ist ein Stück freigeschaltet (Lern-/Stimmen-Videos + Mixer)?
 *
 * Freischalt-Stufen nach Abo:
 * - Free-Stücke sind für alle frei.
 * - Pro- & Lernvideodatenbank-Abo: komplette Datenbank inkl. aller Stimmen-Videos.
 * - Starter-Abo: nur Free- & Starter-Stücke. Pro-Stücke bleiben gesperrt — dort
 *   ist nur das Master-Video verfügbar; für die einzelnen Stimmen-Videos ist ein
 *   Upgrade nötig.
 * - Ohne Abo (kein Lehrgang) bleiben alle kostenpflichtigen Stücke gesperrt.
 */
export function isPieceUnlocked(
  piece: { plan: Plan; instrument: string },
  abo: UserAbo = mockUserAbo,
): boolean {
  if (piece.plan === 'free') return true
  if (abo.plan === 'none') return false
  if (abo.plan === 'pro' || abo.plan === 'lernvideo') return true
  // Starter: Free- & Starter-Stücke; Pro-Stücke erfordern ein Upgrade.
  if (abo.plan === 'starter') return piece.plan !== 'pro'
  return false
}

// ─── Katalog (für die Detailseite, um Titel/Plan/Instrument je ID zu kennen) ──

export type CatalogEntry = {
  id: number
  title: string
  artist: string
  year: number
  instrument: Instrument
  plan: Plan
  img: string
}

export const pieceCatalog: Record<number, CatalogEntry> = {
  1: { id: 1, title: 'Dr Alperose', artist: 'Willi Valotti', year: 1978, instrument: 'Handorgel', plan: 'starter', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80' },
  2: { id: 2, title: 'Ländler im Dreivierteltakt', artist: 'Kapelle Hess-Ruedi-Hegner', year: 1995, instrument: 'Schwyzerörgeli', plan: 'starter', img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80' },
  3: { id: 3, title: 'Abendstern-Polka', artist: 'Bodästänix', year: 2003, instrument: 'Handorgel', plan: 'pro', img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=800&q=80' },
  4: { id: 4, title: 'Innerschwizer Schottisch', artist: 'Trio Rigi', year: 1988, instrument: 'Klarinette', plan: 'starter', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80' },
  5: { id: 5, title: 'Walzer am See', artist: 'Lisa Frei', year: 2015, instrument: 'Klavierbegleitung', plan: 'free', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80' },
  6: { id: 6, title: 'Bergbach-Mazurka', artist: 'Hess-Rusch-Hegner', year: 1972, instrument: 'Bassgeige', plan: 'pro', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80' },
  7: { id: 7, title: 'Stille Nacht', artist: 'Verschiedene Kapellen', year: 1818, instrument: 'Handorgel', plan: 'free', img: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80' },
}
