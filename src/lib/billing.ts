'use client'

// ─── Abrechnung & Zugriff: Vorauskasse per Banküberweisung (Demo) ─────────────
// US-01.012 ergänzt den bestehenden Zahlungsflow (Karte / TWINT) um die
// Zahlungsart «Vorauskasse per Banküberweisung». In dieser Demo gibt es kein
// echtes Backend — Stripe und Supabase werden clientseitig simuliert:
//
//   • Stripe        → Rechnungsnummer / Referenzen & Beträge werden hier erzeugt
//                     (in der echten Umsetzung: Stripe Invoice auf bestehende
//                      Products/Prices/Coupons).
//   • Supabase      → dieser Zustand im localStorage ist die «Source of Truth»
//                     für die Frage «Hat dieser User/diese Formation Zugriff?».
//
// Anders als Karte/TWINT wird bei Vorauskasse das gebuchte Abo NICHT sofort
// freigeschaltet. Der Zugriff hängt an ZWEI unabhängigen Bedingungen:
//   1. E-Mail-Adresse bestätigt (bestehende Logik aus US-01.005), UND
//   2. Rechnung als bezahlt bestätigt (manuell durch LAEMU nach Bankeingang).
// Erst wenn beide erfüllt sind, übernimmt die zentrale Aktivierungslogik
// (`activateSubscriptionIfEligible`) und schaltet das Abo frei — dieselbe
// Freischaltung, die Karte/TWINT nach erfolgreicher Zahlung auslösen.

import { useEffect, useState } from 'react'
import { readStoredAbo, setStoredAbo } from './userPlan'
import { readStoredFormation, setStoredFormation } from './formation'
import { type UserAbo } from './academy'

// ── Zentrale Bankverbindung von LAEMU ────────────────────────────────────────
// Zentral gepflegt, damit die Kontodaten nicht an mehreren Stellen hartcodiert
// werden. Die Banküberweisung erfolgt direkt auf dieses Schweizer Geschäftskonto
// (NICHT über Stripe Bank Transfer).
export const LAEMU_BANK = {
  company: 'LAEMU GmbH',
  addressLines: ['Schilfweg 7', '6402 Merlischachen', 'Schweiz'],
  iban: 'CH93 0077 7009 8617 1460 8',
} as const

// Zahlungsfrist für Vorauskasse-Rechnungen (Tage ab Rechnungsstellung).
export const BANK_TRANSFER_DUE_DAYS = 30

export type PaymentMethodId = 'card' | 'twint' | 'bank_transfer'
export type InvoiceStatus = 'open' | 'paid'
// Solange die Vorauskasse-Zahlung nicht bestätigt (und die E-Mail nicht
// verifiziert) ist, bleibt das Abo «zahlung ausstehend» — kein Paid-Zugriff.
export type SubscriptionStatus = 'active' | 'pending_payment'

// Anlass der Rechnung — Erstregistrierung, Verlängerung oder eine
// zahlungsrelevante Abo-Änderung (Upgrade). Die bestehende Abo-, Renewal- und
// Upgrade-Logik bleibt führend; Vorauskasse hängt sich nur an.
export type BillingReason = 'registration' | 'renewal' | 'change'

// Der zentrale Abrechnungs-/Zugriffs-Zustand einer Vorauskasse-Bestellung.
// In der echten Architektur entspricht das den Supabase-Zeilen für Subscription
// + Invoice inkl. der Stripe-Referenzen.
export type BillingState = {
  method: PaymentMethodId
  invoiceStatus: InvoiceStatus
  subscriptionStatus: SubscriptionStatus
  reason: BillingReason

  // Stripe-Referenzen (in der echten Umsetzung von Stripe zurückgegeben und in
  // Supabase gespeichert — hier simuliert).
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripeInvoiceId: string

  // Eindeutige Rechnungs-/Zahlungsreferenz — dient der eindeutigen Zuordnung des
  // Bankeingangs zur Rechnung (auf dem Zahlungsauftrag als Referenz angeben).
  invoiceNumber: string
  invoicePdfUrl: string

  amount: number
  currency: string
  periodLabel: string
  dueDate: string // ISO-Datum (YYYY-MM-DD)
  createdAt: string // ISO-Datum (YYYY-MM-DD)

  // Zuordnung zu User bzw. Formation.
  ownerType: 'individual' | 'formation'
  ownerName: string
  ownerEmail: string
  formationName?: string
  voucher?: string

  // Das nach bestätigter Zahlung UND bestätigter E-Mail freizuschaltende Abo.
  pendingAbo: UserAbo
}

const BILLING_KEY = 'laemu-billing'
const BILLING_EVENT = 'laemu-billing-change'
// E-Mail-Verifikationsstatus (bestehende US-01.005-Logik) — für die zentrale
// Aktivierung muss der Zahlungsflow wissen, ob die E-Mail bestätigt ist.
const EMAIL_VERIFIED_KEY = 'laemu-email-verified'

const chf = (n: number) => `CHF ${n.toLocaleString('de-CH')}`

// ── Persistenz-Helfer ────────────────────────────────────────────────────────

export function readBilling(): BillingState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(BILLING_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as BillingState
    if (!parsed || typeof parsed.invoiceNumber !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

function writeBilling(state: BillingState | null) {
  if (typeof window === 'undefined') return
  try {
    if (state === null) window.localStorage.removeItem(BILLING_KEY)
    else window.localStorage.setItem(BILLING_KEY, JSON.stringify(state))
    window.dispatchEvent(new Event(BILLING_EVENT))
  } catch {
    // localStorage nicht verfügbar — ignorieren.
  }
}

export function setBilling(state: BillingState) {
  writeBilling(state)
}

export function clearBilling() {
  writeBilling(null)
}

// ── E-Mail-Verifikationsstatus (unabhängig vom Zahlungsstatus) ───────────────

export function isEmailVerified(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(EMAIL_VERIFIED_KEY) === 'true'
  } catch {
    return false
  }
}

export function setEmailVerified(verified: boolean) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(EMAIL_VERIFIED_KEY, verified ? 'true' : 'false')
    window.dispatchEvent(new Event(BILLING_EVENT))
  } catch {
    // ignorieren
  }
}

// ── Datums-/Referenz-Helfer ──────────────────────────────────────────────────

const toISODate = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Menschlich lesbares Datum (de-CH), z. B. «26. Juni 2027».
export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatAmount(amount: number, currency = 'CHF'): string {
  return currency === 'CHF' ? chf(amount) : `${currency} ${amount.toLocaleString('de-CH')}`
}

// Eindeutige Rechnungs-/Zahlungsreferenz — dient LAEMU zur Zuordnung des
// Bankeingangs. Format: «LAEMU-JJJJ-XXXXXX».
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 900000 + 100000)
  return `LAEMU-${year}-${rand}`
}

// ── Rechnungserstellung (Vorauskasse) ────────────────────────────────────────
// Simuliert die Erstellung einer Stripe-Rechnung: erzeugt Referenzen, Betrag
// und Zahlungsfrist und persistiert den Zustand. In der echten Umsetzung würde
// hier eine Stripe Invoice über die bestehenden Products/Prices/Coupons erstellt
// und die Referenzen in Supabase gespeichert.
export type CreateInvoiceInput = {
  amount: number
  currency?: string
  periodLabel: string
  ownerType: 'individual' | 'formation'
  ownerName: string
  ownerEmail: string
  formationName?: string
  voucher?: string
  pendingAbo: UserAbo
  reason?: BillingReason
}

export function createBankTransferInvoice(input: CreateInvoiceInput): BillingState {
  const now = new Date()
  const due = new Date(now)
  due.setDate(due.getDate() + BANK_TRANSFER_DUE_DAYS)

  const invoiceNumber = generateInvoiceNumber()
  // Simulierte Stripe-Referenzen (in der echten Umsetzung von Stripe erzeugt).
  const rand = Math.random().toString(36).slice(2, 12)

  const state: BillingState = {
    method: 'bank_transfer',
    invoiceStatus: 'open',
    subscriptionStatus: 'pending_payment',
    reason: input.reason ?? 'registration',
    stripeCustomerId: `cus_${rand}`,
    stripeSubscriptionId: `sub_${rand}`,
    stripeInvoiceId: `in_${rand}`,
    invoiceNumber,
    // Demo-«PDF»-Link — in der echten Umsetzung die von Stripe gehostete
    // Rechnung (hosted_invoice_url) bzw. das PDF (invoice_pdf).
    invoicePdfUrl: `#rechnung-${invoiceNumber}`,
    amount: input.amount,
    currency: input.currency ?? 'CHF',
    periodLabel: input.periodLabel,
    dueDate: toISODate(due),
    createdAt: toISODate(now),
    ownerType: input.ownerType,
    ownerName: input.ownerName,
    ownerEmail: input.ownerEmail,
    ...(input.formationName ? { formationName: input.formationName } : {}),
    ...(input.voucher ? { voucher: input.voucher } : {}),
    pendingAbo: input.pendingAbo,
  }
  writeBilling(state)
  return state
}

// ── Zentrale Aktivierung nach bestätigter Zahlung + E-Mail ───────────────────
// Einziger Ort, an dem ein Vorauskasse-Abo freigeschaltet wird. Wird sowohl nach
// der E-Mail-Bestätigung (US-01.005) als auch nach der manuellen Zahlungs-
// bestätigung durch LAEMU aufgerufen. Nur wenn BEIDE Bedingungen erfüllt sind,
// wird das gebuchte Abo aktiv — dieselbe Freischaltung wie bei Karte/TWINT.
// Teilzahlungen oder nicht bestätigte Zahlungen lösen keinen Zugriff aus.
export function activateSubscriptionIfEligible(): boolean {
  const b = readBilling()
  if (!b) return false
  if (b.method !== 'bank_transfer') return false
  if (b.subscriptionStatus === 'active') return false
  if (b.invoiceStatus !== 'paid') return false
  // Die E-Mail-Bestätigung ist nur bei der Erstregistrierung eine zusätzliche
  // Bedingung. Bei Verlängerung/Abo-Änderung existiert das Konto bereits (E-Mail
  // längst bestätigt) — dort genügt der bestätigte Zahlungseingang.
  if (b.reason === 'registration' && !isEmailVerified()) return false

  // Zentrale Freischaltung: gebuchtes Abo aktivieren (Supabase = führend).
  setStoredAbo(b.pendingAbo)
  writeBilling({ ...b, subscriptionStatus: 'active' })

  // Formation: erst jetzt — nach tatsächlicher Aktivierung — dürfen die bereits
  // erfassten Mitglieder eingeladen werden (US-01.012 §13).
  if (b.ownerType === 'formation') {
    const f = readStoredFormation()
    if (f.members.length > 0) {
      setStoredFormation({
        ...f,
        members: f.members.map((m) =>
          m.email.trim().length > 0 ? { ...m, invited: true } : m,
        ),
      })
    }
  }
  return true
}

// Markiert die offene Vorauskasse-Rechnung als bezahlt (manuelle Bestätigung
// durch LAEMU nach Bankeingang) und stösst die zentrale Aktivierung an.
export function confirmBankTransferPaid(): boolean {
  const b = readBilling()
  if (!b || b.method !== 'bank_transfer') return false
  writeBilling({ ...b, invoiceStatus: 'paid' })
  activateSubscriptionIfEligible()
  return true
}

// Hat der aktuelle User/die Formation aktuell bezahlten Zugriff? Supabase
// (dieser Zustand) ist führend. Ohne Vorauskasse-Zustand gilt die bestehende
// Abo-Logik (Karte/TWINT/Free) unverändert.
export function hasPaidAccess(): boolean {
  const b = readBilling()
  if (b && b.method === 'bank_transfer') {
    return b.subscriptionStatus === 'active'
  }
  // Kein Vorauskasse-Zustand → bestehende Logik: Paid-Zugriff, wenn ein Abo
  // gebucht ist (Karte/TWINT aktivieren sofort).
  return readStoredAbo().plan !== 'none'
}

// ── Reaktive Hooks ───────────────────────────────────────────────────────────

export function useBilling(): BillingState | null {
  const [state, setState] = useState<BillingState | null>(null)
  useEffect(() => {
    const refresh = () => setState(readBilling())
    refresh()
    const onStorage = (e: StorageEvent) => {
      if (e.key === BILLING_KEY || e.key === EMAIL_VERIFIED_KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(BILLING_EVENT, refresh)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(BILLING_EVENT, refresh)
    }
  }, [])
  return state
}
