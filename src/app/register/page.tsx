'use client'

import { Fragment, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { PasswordInput } from '@/components/PasswordInput'
import {
  individualPricing,
  individualPlanMeta,
  INDIVIDUAL_PLAN_ORDER,
  scopeLabels,
  formationPlanMeta,
  formationYearlyPrice,
  FORMATION_INCLUDED_MEMBERS,
  FORMATION_MAX_MEMBERS,
  type Scope,
  type IndividualPlanId,
  type FormationPlanId,
  type Instrument,
  type UserAbo,
} from '@/lib/academy'
import { setStoredAbo } from '@/lib/userPlan'
import { setStoredProfile } from '@/lib/userProfile'

// In der Mitgliedschaft (Musikschule) wählbare Instrumente.
const ABO_INSTRUMENTS = ['Schwyzerörgeli', 'Handorgel', 'Bassgeige'] as const

const steps = [
  { number: 1, label: 'Mitgliedschaft' },
  { number: 2, label: 'Angaben' },
  { number: 3, label: 'Zahlung' },
]

const chf = (n: number) => `CHF ${n.toLocaleString('de-CH')}`

// Geburtsdatum-Eingabe — jedes der drei Felder (Tag/Monat/Jahr) lässt sich
// sowohl direkt eintippen als auch per Antippen aus einer Liste wählen
// (combobox via <input list> + <datalist>). Gerade für ältere Personen
// angenehm: Sie tippen ihren Jahrgang einfach ein (z. B. «1945») und müssen
// nicht durch eine lange Liste von über hundert Jahren scrollen — oder sie
// tippen das Feld an und wählen aus der Liste; das Eintippen der ersten Ziffern
// filtert die Liste sofort.
const GEBURT_MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]
const GEBURT_TAGE = Array.from({ length: 31 }, (_, i) => i + 1)
const GEBURT_AKTUELLES_JAHR = new Date().getFullYear()
// Plausibler Jahresbereich (ältester Jahrgang ~120 Jahre zurück).
const GEBURT_MIN_JAHR = GEBURT_AKTUELLES_JAHR - 120
// Jahrgänge als Liste, neueste zuerst. Wer einen alten Jahrgang sucht, tippt
// ihn direkt ein (kein Scrollen nötig); die Liste dient nur als Komfort-Auswahl.
const GEBURT_JAHRE = Array.from(
  { length: GEBURT_AKTUELLES_JAHR - GEBURT_MIN_JAHR + 1 },
  (_, i) => GEBURT_AKTUELLES_JAHR - i,
)

// Tag/Monat können als Zahl oder (beim Monat) als Name eingegeben werden — hier
// zu einer Zahl normalisiert. Gibt null zurück, wenn die Eingabe ungültig ist.
const parseGeburtsTag = (val: string): number | null => {
  const t = val.trim()
  if (!/^\d{1,2}$/.test(t)) return null
  const n = Number(t)
  return n >= 1 && n <= 31 ? n : null
}
const parseGeburtsMonat = (val: string): number | null => {
  const t = val.trim().toLowerCase()
  if (!t) return null
  if (/^\d{1,2}$/.test(t)) {
    const n = Number(t)
    return n >= 1 && n <= 12 ? n : null
  }
  const exact = GEBURT_MONATE.findIndex(m => m.toLowerCase() === t)
  if (exact >= 0) return exact + 1
  // Auch eine eindeutige Abkürzung (z. B. «jan», «dez») akzeptieren.
  const matches = GEBURT_MONATE
    .map((m, i) => (m.toLowerCase().startsWith(t) ? i + 1 : 0))
    .filter(Boolean)
  return matches.length === 1 ? matches[0] : null
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [voucher, setVoucher] = useState('')
  const [voucherApplied, setVoucherApplied] = useState(false)
  const [ort, setOrt] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [done, setDone] = useState(false)

  // ── Angaben (Konto) — Pflichtfelder, auch zur Übernahme ins Profil ───────────
  const [vorname, setVorname] = useState('')
  const [nachname, setNachname] = useState('')
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  // Geburtsdatum als drei separate Felder (Tag/Monat/Jahr) — eingetippt oder aus
  // der Liste gewählt — zusammengesetzt zu einem ISO-Wert (YYYY-MM-DD).
  const [geburtsTag, setGeburtsTag] = useState('')
  const [geburtsMonat, setGeburtsMonat] = useState('')
  const [geburtsJahr, setGeburtsJahr] = useState('')
  const geburtsTagNum = parseGeburtsTag(geburtsTag)
  const geburtsMonatNum = parseGeburtsMonat(geburtsMonat)
  // Das Jahr muss vierstellig und im plausiblen Bereich liegen.
  const geburtsJahrValid =
    /^\d{4}$/.test(geburtsJahr) &&
    Number(geburtsJahr) >= GEBURT_MIN_JAHR &&
    Number(geburtsJahr) <= GEBURT_AKTUELLES_JAHR
  // Nur ein tatsächlich existierendes Datum übernehmen (z. B. kein 31. Februar).
  const geburtsdatum = (() => {
    if (!(geburtsTagNum && geburtsMonatNum && geburtsJahrValid)) return ''
    const jahr = Number(geburtsJahr)
    const d = new Date(jahr, geburtsMonatNum - 1, geburtsTagNum)
    const exists =
      d.getFullYear() === jahr &&
      d.getMonth() === geburtsMonatNum - 1 &&
      d.getDate() === geburtsTagNum
    if (!exists) return ''
    return `${geburtsJahr}-${String(geburtsMonatNum).padStart(2, '0')}-${String(geburtsTagNum).padStart(2, '0')}`
  })()
  const [strasse, setStrasse] = useState('')
  const [hausnummer, setHausnummer] = useState('')
  const [plz, setPlz] = useState('')

  // ── Mitgliedschaft (Step 1) ──────────────────────────────────────────────
  const [accountType, setAccountType] = useState<'individual' | 'formation'>('individual')
  const [billing, setBilling] = useState<'yearly' | 'monthly' | 'free'>('yearly')
  const [individualPlan, setIndividualPlan] = useState<IndividualPlanId>('starter')
  const [scope, setScope] = useState<Scope>('1')
  const [aboInstruments, setAboInstruments] = useState<string[]>(['Handorgel'])
  const [formationPlan, setFormationPlan] = useState<FormationPlanId>('pro')
  const [memberCount, setMemberCount] = useState(3)
  // Name der Formation — Pflichtangabe bei Formations-Registrierung. Die Formation
  // muss bei LAEMU registriert sein.
  const [formationName, setFormationName] = useState('')

  // E-Mail-Adressen der weiteren Formationsmitglieder (Index 1 … N-1; Mitglied 0
  // ist die anmeldende Person selbst). Über diese E-Mails werden die anderen
  // eingeladen — sie registrieren sich anschliessend selbst über den Link.
  const [memberEmails, setMemberEmails] = useState<Record<number, string>>({})
  const setMemberEmail = (idx: number, value: string) => {
    setMemberEmails(prev => ({ ...prev, [idx]: value }))
  }

  const scopeCount = (s: Scope) => (s === 'all' ? ABO_INSTRUMENTS.length : Number(s))

  const toggleAboInstrument = (inst: string) => {
    setAboInstruments(prev => {
      if (prev.includes(inst)) return prev.filter(i => i !== inst)
      const max = scopeCount(scope)
      if (prev.length >= max) return [...prev.slice(1), inst]
      return [...prev, inst]
    })
  }

  const selectScope = (s: Scope) => {
    setScope(s)
    if (s === 'all') {
      setAboInstruments([...ABO_INSTRUMENTS])
    } else {
      setAboInstruments(prev => prev.slice(0, Number(s)))
    }
  }

  // Free-Account: Einzelperson ohne Zahlungsmittel — alle Funktionen sichtbar,
  // aber zur Nutzung ist ein Upgrade auf einen kostenpflichtigen Plan nötig.
  const isFree = accountType === 'individual' && billing === 'free'

  // Free-Account braucht keinen Zahlungsschritt — Stepper ohne «Zahlung».
  const visibleSteps = isFree ? steps.filter((s) => s.number !== 3) : steps

  // Bei Plänen mit Umfang müssen genau so viele Instrumente gewählt sein wie
  // der gewählte Umfang vorgibt — sonst kommt man im Schritt 1 nicht weiter.
  const aboInstrumentsComplete =
    isFree ||
    accountType === 'formation' ||
    !individualPlanMeta[individualPlan].hasScope ||
    aboInstruments.length === scopeCount(scope)

  // Für die Preisanzeige im Free-Modus referenzieren wir den Jahrespreis
  // (zeigt, was ein späteres Upgrade kosten würde).
  const priceBilling: 'yearly' | 'monthly' = billing === 'free' ? 'yearly' : billing

  // Preis des aktuell gewählten Einzel-Abos
  const individualPrice = (() => {
    if (individualPlan === 'lernvideo') return individualPricing.lernvideo[priceBilling]
    return individualPricing[individualPlan][scope][priceBilling]
  })()

  // Preis pro Plan-Karte (für die aktuelle Auswahl)
  const planCardPrice = (plan: IndividualPlanId) => {
    if (plan === 'lernvideo') return individualPricing.lernvideo[priceBilling]
    return individualPricing[plan][scope][priceBilling]
  }

  const formationPrice = formationYearlyPrice(formationPlan, memberCount)
  const formationExtra = Math.max(0, memberCount - FORMATION_INCLUDED_MEMBERS)

  const periodLabel = priceBilling === 'yearly' ? '/ Jahr' : '/ Monat'

  // Gutscheincodes sind nur bei Jahresabos einlösbar. Formationen sind immer
  // Jahresabos, Einzelpersonen nur im «Jährlich»-Modus.
  const isYearlyAbo = accountType === 'formation' || (accountType === 'individual' && billing === 'yearly')

  // Übersicht der getroffenen Auswahl (für die Zusammenfassung im Zahlungsschritt).
  const summary = (() => {
    if (isFree) {
      return { title: 'Free-Account', sub: 'Ohne Zahlung — du kannst jederzeit upgraden.', price: 'Gratis', period: '' }
    }
    if (accountType === 'formation') {
      return {
        title: `Formation ${formationPlanMeta[formationPlan].label}`,
        sub: `${memberCount} Mitglied${memberCount !== 1 ? 'er' : ''}${formationExtra > 0 ? ` · inkl. ${formationExtra} × 10 % Zuschlag` : ''}`,
        price: chf(formationPrice),
        period: '/ Jahr',
      }
    }
    const scopeText = individualPlanMeta[individualPlan].hasScope
      ? `${scopeLabels[scope]} · ${(scope === 'all' ? [...ABO_INSTRUMENTS] : aboInstruments).join(', ')}`
      : 'Alle Instrumente'
    return {
      title: individualPlanMeta[individualPlan].label,
      sub: `${scopeText} · ${billing === 'yearly' ? 'Jährlich' : 'Monatlich'}`,
      price: chf(individualPrice),
      period: periodLabel,
    }
  })()

  // Angaben-Schritt: erst weiter, wenn alle Pflichtfelder ausgefüllt sind und
  // die Nutzungsbedingungen akzeptiert wurden.
  const angabenComplete =
    vorname.trim() !== '' &&
    nachname.trim() !== '' &&
    email.trim() !== '' &&
    passwort.trim() !== '' &&
    geburtsdatum.trim() !== '' &&
    strasse.trim() !== '' &&
    hausnummer.trim() !== '' &&
    plz.trim() !== '' &&
    ort.trim() !== '' &&
    acceptedTerms

  // Anzahl einzuladender Mitglieder (alle ausser der anmeldenden Person selbst).
  const inviteCount = Math.max(0, memberCount - 1)

  // Formationen: Pflichtschritt — der Formationsname muss angegeben sein und für
  // jedes weitere Mitglied muss eine E-Mail-Adresse hinterlegt werden, damit sie
  // zur Selbst-Registrierung eingeladen werden können. Erst dann lässt sich die
  // Registrierung abschliessen.
  const formationReady =
    accountType !== 'formation' ||
    (formationName.trim().length > 0 &&
      Array.from({ length: inviteCount }).every((_, i) => (memberEmails[i + 1] ?? '').trim().length > 0))

  // Den gewählten Plan als Abo-Zustand speichern, damit der Mitgliederbereich
  // die richtigen Zugänge (Free / Starter / Pro) anzeigt, und abschliessen.
  const finishRegistration = () => {
    let abo: UserAbo
    if (isFree) {
      abo = { plan: 'none', instruments: [] }
    } else if (accountType === 'formation') {
      // Beide Formations-Pläne geben allen Mitgliedern Zugriff auf alle
      // Instrumente (Pro: alle Pro-Lehrgänge + ganze Datenbank, Lernvideo: ganze Datenbank).
      abo = {
        plan: formationPlan,
        instruments: [...ABO_INSTRUMENTS] as Instrument[],
        allInstruments: true,
      }
    } else {
      abo = {
        plan: individualPlan,
        instruments: (scope === 'all' ? [...ABO_INSTRUMENTS] : aboInstruments) as Instrument[],
        allInstruments: scope === 'all' || individualPlan === 'lernvideo',
      }
    }
    setStoredAbo(abo)

    // Eingegebene Angaben ins Profil übernehmen, damit Name & Infos im
    // Mitgliederbereich gleich stimmen. Das Profil (Bild, Bio, Instrumente …)
    // kann später jederzeit im Mitgliederbereich ergänzt werden.
    const fullName = [vorname.trim(), nachname.trim()].filter(Boolean).join(' ')
    setStoredProfile({
      ...(fullName ? { name: fullName } : {}),
      email: email.trim(),
      wohnort: ort.trim(),
      inFormation: accountType === 'formation',
      ...(accountType === 'formation' && formationName.trim() ? { formationName: formationName.trim() } : {}),
      // Die bei der Mitgliedschaft gewählten Instrumente ins Profil übernehmen.
      ...(abo.instruments.length > 0 ? { instruments: abo.instruments.join(', ') } : {}),
    })

    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-accent-gold flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">Herzlich Willkommen in der LAEMU-Musikschule</h1>
          <p className="font-sans text-text-secondary leading-relaxed mb-6">
            Dein Konto wurde erfolgreich erstellt. Du bleibst am Puls der Ländlerszene und bist Teil der
            LAEMU-Community.
          </p>

          {isFree && (
            <div className="bg-accent-gold/5 border border-accent-gold/30 p-4 mb-8 text-left flex gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              <div>
                <p className="font-sans text-sm font-semibold mb-1">Dein Free-Account ist bereit</p>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">
                  Du kannst die ganze Musikschule erkunden und alle Gratis-Inhalte nutzen. Möchtest du die Lehrgänge
                  oder alle Stücke verwenden, upgradest du jederzeit in deinem Konto auf einen
                  passenden Plan.
                </p>
              </div>
            </div>
          )}

          {accountType === 'formation' && (
            <div className="bg-accent-gold/10 border border-accent-gold/40 p-4 mb-8 text-left flex gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
              <div>
                <p className="font-sans text-sm font-semibold mb-1">Die weiteren Mitglieder sind eingeladen</p>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">
                  Da dein Abo bezahlt wurde, haben die anderen Mitglieder deiner Formation eine
                  Einladung per E-Mail erhalten. Über den Link darin registriert sich jedes Mitglied
                  selbst und legt sein eigenes Login und Profil an — mit vollem Zugriff auf alle
                  Pro-Lehrgänge und alle Stücke für alle Instrumente.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/member/academy"
              className="block w-full bg-dark text-white text-center font-sans font-semibold py-4 hover:bg-accent-gold hover:text-white transition-colors"
            >
              Zur Musikschule →
            </Link>
            <a
              href="https://www.youtube.com/watch?v=GC2ifQu8bOk&list=PLQT3QakLxJRzL_7g7D6xHSerTYxqRuHO3&index=6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-surface border border-border text-center font-sans text-sm py-3 hover:border-dark transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Einführungsvideo anschauen
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-dark py-5 px-6 flex items-center justify-between">
        <Link href="/login" className="font-heading font-bold text-white text-lg tracking-tight">LAEMU</Link>
        <Link href="/login" className="font-sans text-xs text-white/50 hover:text-white transition-colors">Abbrechen</Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Step indicator — Free-Account hat keinen Zahlungsschritt */}
        <div className="flex items-start mb-10">
          {visibleSteps.map((s, i) => (
            <Fragment key={s.number}>
              <div className="flex flex-col items-center gap-2 w-20 sm:w-24 shrink-0">
                <div className={`w-10 h-10 flex items-center justify-center font-heading font-bold text-sm transition-all ${
                  step > s.number ? 'bg-accent-gold text-white' :
                  step === s.number ? 'bg-dark text-white' :
                  'bg-border text-text-secondary'
                }`}>
                  {step > s.number ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : s.number}
                </div>
                <span className={`font-sans text-xs text-center leading-tight ${step === s.number ? 'text-dark font-medium' : 'text-text-secondary'}`}>{s.label}</span>
              </div>
              {i < visibleSteps.length - 1 && (
                <div className={`flex-1 h-px mt-5 transition-colors ${step > s.number ? 'bg-accent-gold' : 'bg-border'}`} />
              )}
            </Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-2 flex-wrap mb-2">
                <h1 className="font-heading text-3xl font-bold">Konto erstellen</h1>
                {accountType === 'formation' && (
                  <span className="font-sans text-[11px] font-semibold px-2 py-1 bg-accent-gold/15 border border-accent-gold/40 text-accent-gold mt-1.5">
                    Du = 1. Mitglied &amp; zahlende Person
                  </span>
                )}
              </div>
              <p className="font-sans text-text-secondary text-sm mb-8">
                {accountType === 'formation'
                  ? 'Du legst dein eigenes Konto an — du bist damit gleichzeitig das 1. Mitglied der Formation und zahlst das Abonnement. Unterhalb deiner Daten lädst du die weiteren Mitglieder ein.'
                  : 'Nur für natürliche Personen — keine Firmen oder Organisationen.'}
              </p>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-text-secondary block mb-1.5">Vorname *</label>
                    <input value={vorname} onChange={e => setVorname(e.target.value)} type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Niklaus" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-1.5">Nachname *</label>
                    <input value={nachname} onChange={e => setNachname(e.target.value)} type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Hess" />
                  </div>
                </div>
                <div>
                  <label className="label text-text-secondary block mb-1.5">E-Mail-Adresse *</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="deine@email.ch" />
                </div>
                <div>
                  <label className="label text-text-secondary block mb-1.5">Passwort *</label>
                  <PasswordInput value={passwort} onChange={e => setPasswort(e.target.value)} className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Mindestens 8 Zeichen" />
                </div>
                <div>
                  <label className="label text-text-secondary block mb-1.5">Geburtsdatum *</label>
                  {/* Jedes Feld: eintippen oder antippen und aus der Liste wählen. */}
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      list="geburt-tage"
                      value={geburtsTag}
                      onChange={e => setGeburtsTag(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      type="text"
                      inputMode="numeric"
                      aria-label="Geburtstag — Tag"
                      placeholder="Tag"
                      className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                    />
                    <input
                      list="geburt-monate"
                      value={geburtsMonat}
                      onChange={e => setGeburtsMonat(e.target.value)}
                      type="text"
                      aria-label="Geburtstag — Monat"
                      placeholder="Monat"
                      className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                    />
                    <input
                      list="geburt-jahre"
                      value={geburtsJahr}
                      onChange={e => setGeburtsJahr(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      aria-label="Geburtstag — Jahr (Jahrgang)"
                      placeholder="Jahr"
                      className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                    />
                  </div>
                  {/* Auswahllisten zum Antippen — die Felder bleiben frei eintippbar. */}
                  <datalist id="geburt-tage">
                    {GEBURT_TAGE.map(d => <option key={d} value={d} />)}
                  </datalist>
                  <datalist id="geburt-monate">
                    {GEBURT_MONATE.map(m => <option key={m} value={m} />)}
                  </datalist>
                  <datalist id="geburt-jahre">
                    {GEBURT_JAHRE.map(j => <option key={j} value={j} />)}
                  </datalist>
                  <p className="font-sans text-xs text-text-secondary mt-1.5">
                    Tippe Tag, Monat und Jahrgang ein oder wähle sie aus der Liste.
                  </p>
                  {geburtsTag !== '' && geburtsTagNum === null && (
                    <p className="font-sans text-xs text-accent-gold mt-1">
                      Bitte gib einen gültigen Tag zwischen 1 und 31 ein.
                    </p>
                  )}
                  {geburtsMonat !== '' && geburtsMonatNum === null && (
                    <p className="font-sans text-xs text-accent-gold mt-1">
                      Bitte gib einen gültigen Monat ein (Name oder Zahl 1–12).
                    </p>
                  )}
                  {geburtsJahr.length === 4 && !geburtsJahrValid && (
                    <p className="font-sans text-xs text-accent-gold mt-1">
                      Bitte gib einen gültigen Jahrgang zwischen {GEBURT_MIN_JAHR} und {GEBURT_AKTUELLES_JAHR} ein.
                    </p>
                  )}
                  {geburtsTagNum !== null && geburtsMonatNum !== null && geburtsJahrValid && geburtsdatum === '' && (
                    <p className="font-sans text-xs text-accent-gold mt-1">
                      Dieses Datum gibt es nicht — bitte überprüfe Tag und Monat.
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="label text-text-secondary block mb-1.5">Strasse *</label>
                    <input value={strasse} onChange={e => setStrasse(e.target.value)} type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Musterstrasse" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-1.5">Nr. *</label>
                    <input value={hausnummer} onChange={e => setHausnummer(e.target.value)} type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="12" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label text-text-secondary block mb-1.5">PLZ *</label>
                    <input value={plz} onChange={e => setPlz(e.target.value)} type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="6000" />
                  </div>
                  <div className="col-span-2">
                    <label className="label text-text-secondary block mb-1.5">Ort *</label>
                    <input value={ort} onChange={e => setOrt(e.target.value)} type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Luzern" />
                  </div>
                </div>

                {/* ── Weitere Formationsmitglieder (direkt unter den eigenen Kontaktdaten) ── */}
                {accountType === 'formation' && (
                  <div className="space-y-4">
                    {/* Name der Formation — Pflichtangabe */}
                    <div className="bg-surface border-2 border-accent-gold p-5">
                      <label className="label text-text-secondary block mb-1.5">Name der Formation *</label>
                      <input
                        type="text"
                        value={formationName}
                        onChange={e => setFormationName(e.target.value)}
                        placeholder="z. B. Örgeliquartett Seetal"
                        className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-background"
                      />
                      <p className="font-sans text-xs text-text-secondary mt-2 leading-relaxed">
                        Die Formation muss bei LAEMU registriert sein.
                      </p>
                    </div>

                    {/* Golden hint: Selbst-Registrierung & voller Zugang */}
                    <div className="bg-accent-gold/10 border border-accent-gold/40 p-4 flex gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
                      <div>
                        <p className="font-sans text-sm font-semibold mb-1">So erhalten die weiteren Mitglieder Zugang</p>
                        <p className="font-sans text-xs text-text-secondary leading-relaxed">
                          Jedes weitere Mitglied erhält an die unten hinterlegte E-Mail-Adresse eine Einladung. Über den
                          Link darin registriert sich jedes Mitglied selbst und legt sein eigenes Login und Profil an —
                          mit vollem Zugriff auf alle Pro-Lehrgänge und alle Stücke.
                        </p>
                      </div>
                    </div>

                    {/* Wichtige Aktion: weitere Mitglieder erfassen — prominent auf hellem Grund */}
                    <div className="bg-surface border-2 border-accent-gold p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark flex-shrink-0"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                        <h3 className="font-heading font-bold text-base">Weitere Formationsmitglieder einladen</h3>
                      </div>
                      <p className="font-sans text-xs text-text-secondary mb-4 leading-relaxed">
                        Mitglied 1 bist du selbst (oben erfasst). Hinterlege für jedes weitere Mitglied eine E-Mail-Adresse.
                      </p>
                      {inviteCount === 0 ? (
                        <p className="font-sans text-sm text-text-secondary bg-background border border-border px-4 py-3">
                          Du hast nur dich selbst (1 Mitglied) gewählt — es sind keine Einladungen nötig.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {Array.from({ length: inviteCount }).map((_, i) => {
                            const idx = i + 1
                            return (
                              <div key={idx}>
                                <label className="label text-text-secondary block mb-1.5">E-Mail Mitglied {idx + 1} *</label>
                                <input
                                  type="email"
                                  value={memberEmails[idx] ?? ''}
                                  onChange={e => setMemberEmail(idx, e.target.value)}
                                  placeholder="mitglied@email.ch"
                                  className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-background"
                                />
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer"
                    style={{ accentColor: '#BC8C33' }}
                  />
                  <span className="font-sans text-xs text-text-secondary leading-relaxed">
                    Ich habe die{' '}
                    <Link href="/agb" className="text-accent-gold hover:underline">Nutzungsbedingungen</Link>{' '}
                    und die{' '}
                    <Link href="/datenschutz" className="text-accent-gold hover:underline">Datenschutzerklärung</Link>{' '}
                    von LAEMU gelesen und stimme ihnen zu. *
                  </span>
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors"
                  >
                    ← Zurück
                  </button>
                  <button
                    onClick={() => { if (isFree) finishRegistration(); else setStep(3) }}
                    disabled={!(angabenComplete && formationReady)}
                    className={`flex-1 font-sans font-semibold py-4 transition-colors ${angabenComplete && formationReady ? 'bg-dark text-white hover:bg-accent-gold hover:text-white' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                  >
                    {isFree ? 'Registrierung abschliessen →' : 'Weiter zur Zahlung →'}
                  </button>
                </div>
                {!(angabenComplete && formationReady) && (
                  <p className="font-sans text-xs text-text-secondary text-center">
                    {!angabenComplete
                      ? 'Bitte fülle alle Pflichtfelder (*) aus und akzeptiere die Nutzungsbedingungen, um fortzufahren.'
                      : 'Bitte hinterlege für jedes weitere Formationsmitglied eine E-Mail-Adresse, um fortzufahren.'}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Headline */}
              <h1 className="font-heading text-3xl font-bold mb-2 whitespace-pre-line">
                {'Lerne Ländlermusik.\nVon Profis. Für alle.'}
              </h1>
              <p className="font-sans text-text-secondary text-sm mb-8 leading-relaxed">
                Die LAEMU Musikschule — Online-Kurse und originalgetreue Lernvideos zu unzähligen
                Stücken, gezeigt von den Besten der Szene.
              </p>

              {/* Account type toggle */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {([
                  { id: 'individual', label: 'Einzelperson', desc: 'Für dich allein' },
                  { id: 'formation', label: 'Formation', desc: 'Für deine Gruppe' },
                ] as const).map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setAccountType(opt.id)}
                    className={`p-4 border-2 text-left transition-all ${accountType === opt.id ? 'border-dark bg-dark/5' : 'border-border bg-surface hover:border-dark'}`}
                  >
                    <p className="font-sans font-semibold text-sm">{opt.label}</p>
                    <p className="font-sans text-xs text-text-secondary">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {/* Billing toggle (individual only) */}
              {accountType === 'individual' && (
                <div className="flex items-center justify-center gap-1 mb-6 bg-surface border border-border p-1 w-full sm:w-fit mx-auto">
                  {([
                    { id: 'yearly', label: 'Jährlich', hint: null },
                    { id: 'monthly', label: 'Monatlich', hint: null },
                    { id: 'free', label: 'Free', hint: 'Gratis' },
                  ] as const).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setBilling(opt.id)}
                      className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 font-sans text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${billing === opt.id ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
                    >
                      {opt.label}
                      {opt.hint && <span className={`font-sans text-[10px] leading-none px-1.5 py-0.5 shrink-0 ${billing === opt.id ? 'bg-accent-gold text-white' : 'bg-accent-gold/15 text-accent-gold'}`}>{opt.hint}</span>}
                    </button>
                  ))}
                </div>
              )}

              {/* ── INDIVIDUAL OFFERING ── */}
              {accountType === 'individual' && (
                <>
                  {isFree && (
                    <div className="bg-accent-gold/10 border border-accent-gold/40 p-5 mb-6 flex gap-3">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      <div>
                        <p className="font-heading text-base font-bold mb-1 text-dark">Free-Account — ohne Zahlung starten</p>
                        <p className="font-sans text-xs text-text-secondary leading-relaxed">
                          Als interessierte:r Lernende:r erkundest du die ganze Musikschule kostenlos: Du siehst einen
                          Kurseinblick, Instrumente und Lernvideos und kannst die Gratis-Stücke direkt nutzen. Zum
                          Freischalten der Lehrgänge und aller Stücke upgradest du jederzeit auf
                          einen kostenpflichtigen Plan — ganz ohne Eile.
                        </p>
                      </div>
                    </div>
                  )}
                  {!isFree && (
                  <div className="space-y-3 mb-6">
                    {INDIVIDUAL_PLAN_ORDER.map(planId => {
                      const meta = individualPlanMeta[planId]
                      const active = !isFree && individualPlan === planId
                      return (
                        <button
                          key={planId}
                          onClick={() => { if (!isFree) setIndividualPlan(planId) }}
                          className={`w-full text-left p-5 border-2 transition-all ${active ? (planId === 'pro' ? 'border-accent-gold bg-accent-gold/5' : 'border-dark bg-dark/5') : 'border-border bg-surface'} ${isFree ? 'opacity-80 cursor-default' : 'hover:border-dark'}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span>{meta.emoji}</span>
                                <span className="font-sans font-semibold text-sm">{meta.label}</span>
                                <span className="font-sans text-[10px] font-medium px-2 py-0.5 bg-accent-gold/15 text-accent-gold border border-accent-gold/30">{meta.audience}</span>
                                {meta.badge && (
                                  <span className="font-sans text-[10px] font-bold px-2 py-0.5 bg-accent-gold text-white">{meta.badge}</span>
                                )}
                                {isFree && (
                                  <span className="font-sans text-[10px] font-medium px-2 py-0.5 bg-border text-text-secondary inline-flex items-center gap-1">
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    Upgrade
                                  </span>
                                )}
                              </div>
                              <p className="font-sans text-xs text-text-secondary leading-relaxed">{meta.desc}</p>
                            </div>
                            {!isFree && (
                              <div className="text-right flex-shrink-0">
                                <span className="font-heading font-bold text-xl text-accent-gold">{chf(planCardPrice(planId))}</span>
                                <span className="font-sans text-xs text-text-secondary block">{periodLabel}</span>
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  )}

                  {/* Scope + instrument selection */}
                  {!isFree && individualPlanMeta[individualPlan].hasScope && (
                    <div className="bg-surface border border-border p-5 mb-6">
                      <h3 className="font-heading font-bold text-sm mb-3">Umfang wählen</h3>
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        {(['1', '2', '3'] as Scope[]).map(s => (
                          <button
                            key={s}
                            onClick={() => selectScope(s)}
                            className={`py-2.5 px-2 font-sans text-xs border transition-colors ${scope === s ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark'}`}
                          >
                            {scopeLabels[s]}
                          </button>
                        ))}
                      </div>

                      <p className={`font-sans text-xs mb-2 ${aboInstrumentsComplete ? 'text-text-secondary' : 'text-accent-gold font-medium'}`}>
                        Wähle {scopeCount(scope)} {scopeCount(scope) === 1 ? 'Instrument' : 'Instrumente'} ({aboInstruments.length}/{scopeCount(scope)})
                        {!aboInstrumentsComplete && ' — bitte noch auswählen'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ABO_INSTRUMENTS.map(inst => {
                          const selected = aboInstruments.includes(inst)
                          return (
                            <button
                              key={inst}
                              onClick={() => toggleAboInstrument(inst)}
                              className={`font-sans text-sm px-3 py-2 border transition-all ${selected ? 'border-dark bg-dark text-white' : 'border-border bg-surface text-text-secondary hover:border-dark'}`}
                            >
                              {inst}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Free-Account: Zusammenfassung statt Preis-/Umfangsauswahl */}
                  {isFree && (
                    <div className="bg-accent-gold/10 border-2 border-accent-gold/60 shadow-md shadow-accent-gold/15 p-5 mb-8">
                      <p className="font-heading text-sm font-bold text-dark mb-3 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-accent-gold text-white flex-shrink-0"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>
                        Dein Free-Account
                      </p>
                      <div className="space-y-2">
                        {[
                          'Einblick in die Lehrgänge, Instrumente & Lernvideos',
                          'Gratis-Stücke direkt spielbar',
                        ].map((f, i) => (
                          <div key={i} className="flex items-center gap-2 font-sans text-sm">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-border space-y-2">
                        <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-1">Erst mit Upgrade nutzbar</p>
                        {[
                          'Strukturierte Lehrgänge (Grund- & Erweiterungskurse)',
                          'Alle Stücke',
                          'Persönlicher Support & Video-Feedback',
                        ].map((f, i) => (
                          <div key={i} className="flex items-center gap-2 font-sans text-sm text-text-secondary">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary/60 flex-shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-border mt-4 pt-4">
                        <span className="font-sans text-sm text-text-secondary">Dein Preis</span>
                        <span className="font-heading font-bold text-2xl text-accent-gold">Gratis</span>
                      </div>
                    </div>
                  )}

                  {!isFree && individualPlan === 'lernvideo' && (
                    <div className="bg-accent-gold/10 border border-accent-gold/40 p-4 mb-6 flex gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                      <div>
                        <p className="font-sans text-sm font-semibold mb-1">Einfacher Zugang zu allen Stücken</p>
                        <p className="font-sans text-xs text-text-secondary leading-relaxed">
                          Du erhältst direkten Zugang zu allen Stücken — sämtliche Instrumente, ohne
                          Lehrgänge oder einen Umfang auszuwählen.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Feature list of selected plan */}
                  {!isFree && (
                  <div className="bg-accent-gold/10 border-2 border-accent-gold/60 shadow-md shadow-accent-gold/15 p-5 mb-8">
                    <p className="font-heading text-sm font-bold text-dark mb-3 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-accent-gold text-white flex-shrink-0"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>
                      Enthalten
                    </p>
                    <div className="space-y-2">
                      {individualPlanMeta[individualPlan].features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 font-sans text-sm">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                          <span>{f}</span>
                        </div>
                      ))}
                      {billing === 'yearly' && (
                        <div className="flex items-center gap-2 font-sans text-sm text-accent-gold">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                          <span>20 % Rabatt auf Instrumentenmieten (Jahresabo)</span>
                        </div>
                      )}
                    </div>
                    {individualPlanMeta[individualPlan].notIncluded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-2">
                        <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-1">Nicht enthalten</p>
                        {individualPlanMeta[individualPlan].notIncluded!.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 font-sans text-sm text-text-secondary">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-secondary/60 flex-shrink-0"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-border mt-4 pt-4">
                      <span className="font-sans text-sm text-text-secondary">Dein Preis</span>
                      <span className="font-heading font-bold text-2xl text-accent-gold">{chf(individualPrice)}<span className="font-sans text-sm font-normal text-text-secondary">{periodLabel}</span></span>
                    </div>
                  </div>
                  )}
                </>
              )}

              {/* ── FORMATION OFFERING ── */}
              {accountType === 'formation' && (
                <>
                  <div className="bg-surface border border-border p-5 mb-6">
                    <h3 className="font-heading font-bold text-sm mb-1">Anzahl Mitglieder</h3>
                    <p className="font-sans text-xs text-text-secondary mb-4">
                      Das Formationsangebot gilt für bis zu {FORMATION_INCLUDED_MEMBERS} Mitglieder. Bei mehr als {FORMATION_INCLUDED_MEMBERS} Mitgliedern
                      wird ein Zuschlag von 10 % pro zusätzlichem Mitglied verrechnet. Es können sich maximal {FORMATION_MAX_MEMBERS} Mitglieder
                      als Formation registrieren.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setMemberCount(m => Math.max(1, m - 1))}
                        className="w-10 h-10 border border-border font-heading font-bold hover:border-dark transition-colors"
                      >−</button>
                      <span className="font-heading font-bold text-xl w-12 text-center tabular-nums">{memberCount}</span>
                      <button
                        onClick={() => setMemberCount(m => Math.min(FORMATION_MAX_MEMBERS, m + 1))}
                        disabled={memberCount >= FORMATION_MAX_MEMBERS}
                        className="w-10 h-10 border border-border font-heading font-bold hover:border-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border"
                      >+</button>
                      {formationExtra > 0 && (
                        <span className="font-sans text-xs text-accent-gold ml-2">+{formationExtra} × 10 % Zuschlag</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {(['pro', 'lernvideo'] as FormationPlanId[]).map(planId => {
                      const meta = formationPlanMeta[planId]
                      const active = formationPlan === planId
                      const price = formationYearlyPrice(planId, memberCount)
                      return (
                        <button
                          key={planId}
                          onClick={() => setFormationPlan(planId)}
                          className={`w-full text-left p-5 border-2 transition-all ${active ? (planId === 'pro' ? 'border-accent-gold bg-accent-gold/5' : 'border-dark bg-dark/5') : 'border-border hover:border-dark bg-surface'}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span>{meta.emoji}</span>
                                <span className="font-sans font-semibold text-sm">Formation {meta.label}</span>
                                <span className="font-sans text-[10px] font-medium px-2 py-0.5 bg-accent-gold/15 text-accent-gold border border-accent-gold/30">{meta.audience}</span>
                              </div>
                              <p className="font-sans text-xs text-text-secondary leading-relaxed">{meta.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="font-heading font-bold text-xl text-accent-gold">{chf(price)}</span>
                              <span className="font-sans text-xs text-text-secondary block">/ Jahr</span>
                              {formationExtra > 0 && (
                                <span className="font-sans text-[10px] text-text-secondary block">Basis {chf(meta.basePrice)}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {formationPlan === 'lernvideo' && (
                    <div className="bg-accent-gold/10 border border-accent-gold/40 p-4 mb-6 flex gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                      <div>
                        <p className="font-sans text-sm font-semibold mb-1">Einfacher Zugang zu allen Stücken</p>
                        <p className="font-sans text-xs text-text-secondary leading-relaxed">
                          Alle Mitglieder erhalten direkten Zugang zu allen Stücken — sämtliche
                          Instrumente, ohne Lehrgänge oder einen Umfang auszuwählen.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Enthalten (Formation) */}
                  <div className="bg-accent-gold/10 border-2 border-accent-gold/60 shadow-md shadow-accent-gold/15 p-5 mb-8">
                    <p className="font-heading text-sm font-bold text-dark mb-3 flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-accent-gold text-white flex-shrink-0"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></span>
                      Enthalten — Formation {formationPlanMeta[formationPlan].label}
                    </p>
                    <div className="space-y-2">
                      {formationPlanMeta[formationPlan].features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 font-sans text-sm">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent-gold flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                          <span>{f}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 font-sans text-sm text-accent-gold">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                        <span>20 % Rabatt auf Instrumentenmieten (Jahresabo)</span>
                      </div>
                    </div>
                    {formationPlanMeta[formationPlan].notIncluded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-2">
                        <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-1">Nicht enthalten</p>
                        {formationPlanMeta[formationPlan].notIncluded!.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 font-sans text-sm text-text-secondary">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-secondary/60 flex-shrink-0"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <button
                onClick={() => { if (aboInstrumentsComplete) setStep(2) }}
                disabled={!aboInstrumentsComplete}
                className={`w-full font-sans font-semibold py-4 transition-colors ${aboInstrumentsComplete ? 'bg-dark text-white hover:bg-accent-gold hover:text-white' : 'bg-border text-text-secondary cursor-not-allowed'}`}
              >
                Weiter →
              </button>
              {!aboInstrumentsComplete && (
                <p className="font-sans text-xs text-accent-gold text-center mt-2">
                  Bitte wähle {scopeCount(scope)} {scopeCount(scope) === 1 ? 'Instrument' : 'Instrumente'}, um fortzufahren.
                </p>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-heading text-3xl font-bold mb-2">Zahlung</h1>
              <p className="font-sans text-text-secondary text-sm mb-8">
                {isFree
                  ? 'Für deinen Free-Account ist keine Zahlung nötig — überprüfe kurz deine Auswahl und schliess ab.'
                  : 'Überprüfe deine Auswahl und schliesse die Zahlung ab.'}
              </p>

              {/* Übersicht der gewählten Auswahl */}
              <div className="bg-accent-gold/10 border border-accent-gold/40 p-5 mb-6">
                <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Deine Auswahl</p>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans font-semibold text-sm">{summary.title}</p>
                    <p className="font-sans text-xs text-text-secondary">{summary.sub}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-heading font-bold text-2xl text-accent-gold">{summary.price}</span>
                    {summary.period && <span className="font-sans text-xs text-text-secondary block">{summary.period}</span>}
                  </div>
                </div>
              </div>

              {/* ── Zahlungsmittel — im Free-Account nicht nötig ── */}
              {isFree ? (
                <div className="bg-accent-gold/10 border border-accent-gold/40 p-5 flex gap-3 mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <div>
                    <p className="font-sans font-semibold text-sm mb-1">Kein Zahlungsmittel nötig</p>
                    <p className="font-sans text-xs text-text-secondary leading-relaxed">
                      Für den Free-Account hinterlegst du keine Zahlungsdaten. Sobald du eine Funktion nutzen möchtest,
                      kannst du jederzeit in deinem Konto auf einen kostenpflichtigen Plan upgraden.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="font-heading font-bold text-lg mb-1">Zahlungsmittel</h3>
                  <p className="font-sans text-xs text-text-secondary mb-4">
                    Dein Zahlungsmittel wird anschliessend sicher mit Stripe verbunden.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'card', label: 'Kredit- / Debitkarte', sub: 'Visa, Mastercard', icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      )},
                      { id: 'twint', label: 'TWINT', sub: 'Direkte Zahlung per Smartphone', icon: (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                      )},
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`flex items-center gap-4 p-4 border-2 text-left transition-all ${
                          selectedPayment === method.id ? 'border-dark bg-dark/5' : 'border-border bg-surface hover:border-dark'
                        }`}
                      >
                        <span className={selectedPayment === method.id ? 'text-dark' : 'text-text-secondary'}>{method.icon}</span>
                        <div>
                          <p className="font-sans font-semibold text-sm">{method.label}</p>
                          <p className="font-sans text-xs text-text-secondary">{method.sub}</p>
                        </div>
                        <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPayment === method.id ? 'border-dark bg-dark' : 'border-border'}`}>
                          {selectedPayment === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Kreditkarte — Kartendetails eingeben (via Stripe) */}
                  {selectedPayment === 'card' && (
                    <div className="mt-4 border border-border bg-surface p-4 space-y-3">
                      <p className="font-sans text-xs uppercase tracking-widest text-text-secondary">Kartendetails</p>
                      <div>
                        <label className="label text-text-secondary block mb-1.5">Kartennummer</label>
                        <div className="relative">
                          <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" className="w-full border border-border px-4 py-3 pr-12 font-sans text-sm focus:outline-none focus:border-dark bg-background" />
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label text-text-secondary block mb-1.5">Ablaufdatum</label>
                          <input type="text" inputMode="numeric" placeholder="MM / JJ" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-background" />
                        </div>
                        <div>
                          <label className="label text-text-secondary block mb-1.5">CVC</label>
                          <input type="text" inputMode="numeric" placeholder="123" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-background" />
                        </div>
                      </div>
                      <div>
                        <label className="label text-text-secondary block mb-1.5">Karteninhaber:in</label>
                        <input type="text" placeholder="Name auf der Karte" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-background" />
                      </div>
                      <p className="font-sans text-[11px] text-text-secondary leading-relaxed flex items-start gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        Die Kartendaten werden direkt und verschlüsselt von Stripe verarbeitet. LAEMU sieht oder speichert deine vollständigen Kartendaten nie.
                      </p>
                    </div>
                  )}

                  {/* TWINT — Ablauf der Zahlung */}
                  {selectedPayment === 'twint' && (
                    <div className="mt-4 border border-border bg-surface p-4">
                      <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">So bezahlst du mit TWINT</p>
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-background border border-border flex items-center justify-center flex-shrink-0">
                          <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor" className="text-dark"><path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm10-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm10-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2z"/></svg>
                        </div>
                        <ol className="space-y-1.5 font-sans text-sm text-text-secondary">
                          <li><span className="font-semibold text-dark">1.</span> Öffne die TWINT-App auf deinem Smartphone.</li>
                          <li><span className="font-semibold text-dark">2.</span> Scanne den QR-Code oder bestätige die Zahlungsanfrage.</li>
                          <li><span className="font-semibold text-dark">3.</span> Bestätige den Betrag in der App — fertig.</li>
                        </ol>
                      </div>
                      <p className="font-sans text-[11px] text-text-secondary leading-relaxed mt-3 flex items-start gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        Nach dem Abschluss wirst du sicher über Stripe an TWINT übergeben; der QR-Code wird dann mit dem effektiven Betrag erzeugt.
                      </p>
                    </div>
                  )}

                  {/* Gutscheincode — nur bei Jahresabos einlösbar */}
                  <div className="mt-5">
                    <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Gutscheincode</label>
                    {isYearlyAbo ? (
                      voucherApplied ? (
                        <div className="flex items-center justify-between gap-2 border border-accent-gold bg-accent-gold/10 px-4 py-3">
                          <span className="font-sans text-sm text-dark inline-flex items-center gap-2">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                            Code <strong>{voucher.trim().toUpperCase()}</strong> eingelöst
                          </span>
                          <button
                            type="button"
                            onClick={() => { setVoucherApplied(false); setVoucher('') }}
                            className="font-sans text-xs text-text-secondary hover:text-dark transition-colors"
                          >
                            Entfernen
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2">
                            <input
                              value={voucher}
                              onChange={e => setVoucher(e.target.value)}
                              type="text"
                              placeholder="z.B. LAEMU2026"
                              className="flex-1 border border-border px-4 py-3 font-sans text-sm uppercase placeholder:normal-case placeholder:text-text-secondary/60 focus:outline-none focus:border-dark bg-surface"
                            />
                            <button
                              type="button"
                              onClick={() => { if (voucher.trim()) setVoucherApplied(true) }}
                              disabled={!voucher.trim()}
                              className={`px-5 font-sans text-sm font-semibold transition-colors ${voucher.trim() ? 'bg-dark text-white hover:bg-accent-gold hover:text-white' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                            >
                              Einlösen
                            </button>
                          </div>
                          <p className="font-sans text-xs text-text-secondary mt-2">Gutscheincodes sind nur bei Jahresabos einlösbar.</p>
                        </>
                      )
                    ) : (
                      <div className="border border-border bg-surface px-4 py-3">
                        <input
                          type="text"
                          disabled
                          placeholder="Gutscheincode eingeben"
                          className="w-full bg-transparent font-sans text-sm text-text-secondary/60 cursor-not-allowed outline-none"
                        />
                        <p className="font-sans text-xs text-text-secondary mt-2 flex items-start gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                          Gutscheincodes können nur bei Jahresabos eingelöst werden. Wechsle in Schritt 1 zu «Jährlich», um einen Code einzulösen.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Stripe — sichere Abwicklung der Zahlung (golden hint) */}
                  <div className="mt-4 flex items-center gap-2.5 bg-accent-gold/10 border border-accent-gold/40 px-4 py-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <p className="font-sans text-xs text-text-secondary leading-relaxed">
                      Sichere Zahlung über <span className="font-semibold text-dark">Stripe</span> — dein Zahlungsmittel
                      wird im Anschluss verschlüsselt mit Stripe verbunden. LAEMU speichert keine vollständigen Kartendaten.
                    </p>
                  </div>

                  {/* Abo- & Kündigungshinweis */}
                  <div className="mt-4 flex items-start gap-2.5 bg-accent-gold/10 border border-accent-gold/40 px-4 py-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <p className="font-sans text-xs text-text-secondary leading-relaxed">
                      Du löst ein kostenpflichtiges Abonnement zu <span className="font-semibold text-dark">{summary.price} {summary.period}</span> — es ist {isYearlyAbo ? 'jährlich' : 'monatlich'} kündbar.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors"
                >
                  ← Zurück
                </button>
                <button
                  onClick={finishRegistration}
                  className="flex-1 bg-accent-gold text-white font-sans font-semibold py-4 hover:bg-dark transition-colors"
                >
                  {isFree ? 'Kostenlos abschliessen ✓' : 'Zahlungspflichtig abschliessen ✓'}
                </button>
              </div>
              <p className="font-sans text-xs text-text-secondary text-center mt-3">
                Dein persönliches Profil (Bild, Bio, Instrumente …) ergänzt du jederzeit später im Mitgliederbereich.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
