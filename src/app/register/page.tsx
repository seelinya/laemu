'use client'

import { useRef, useState } from 'react'
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
  type Scope,
  type IndividualPlanId,
  type FormationPlanId,
  type Instrument,
  type UserAbo,
} from '@/lib/academy'
import { setStoredAbo } from '@/lib/userPlan'
import { setStoredProfile } from '@/lib/userProfile'

// Im Profil wählbare Instrumente (inkl. Klavier & Klarinette).
const PROFILE_INSTRUMENTS = ['Schwyzerörgeli', 'Handorgel', 'Bassgeige', 'Klavier', 'Klarinette']

// In der Mitgliedschaft (Musikschule) wählbare Instrumente.
const ABO_INSTRUMENTS = ['Schwyzerörgeli', 'Handorgel', 'Bassgeige'] as const

const steps = [
  { number: 1, label: 'Angaben' },
  { number: 2, label: 'Mitgliedschaft' },
  { number: 3, label: 'Profil' },
]

const chf = (n: number) => `CHF ${n.toLocaleString('de-CH')}`

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])
  const [instrumentFreetext, setInstrumentFreetext] = useState('')
  const [formationChoice, setFormationChoice] = useState<'yes' | 'no' | 'open' | null>(null)
  const [formationName, setFormationName] = useState('')
  const [ort, setOrt] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [done, setDone] = useState(false)

  // ── Angaben (Step 1) für die Übernahme ins Profil ────────────────────────────
  const [vorname, setVorname] = useState('')
  const [nachname, setNachname] = useState('')
  const [email, setEmail] = useState('')

  // ── Profil (Step 3) ──────────────────────────────────────────────────────────
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(typeof reader.result === 'string' ? reader.result : '')
    reader.readAsDataURL(file)
  }

  // ── Mitgliedschaft (Step 2) ──────────────────────────────────────────────
  const [accountType, setAccountType] = useState<'individual' | 'formation'>('individual')
  const [billing, setBilling] = useState<'yearly' | 'monthly' | 'free'>('yearly')
  const [individualPlan, setIndividualPlan] = useState<IndividualPlanId>('starter')
  const [scope, setScope] = useState<Scope>('1')
  const [aboInstruments, setAboInstruments] = useState<string[]>(['Handorgel'])
  const [formationPlan, setFormationPlan] = useState<FormationPlanId>('pro')
  const [memberCount, setMemberCount] = useState(3)

  const toggleInstrument = (inst: string) => {
    setSelectedInstruments(prev =>
      prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]
    )
  }

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

  // Anzahl einzuladender Mitglieder (alle ausser der anmeldenden Person selbst).
  const inviteCount = Math.max(0, memberCount - 1)

  // Formationen: Pflichtschritt — für jedes weitere Mitglied muss eine E-Mail-
  // Adresse hinterlegt werden, damit sie zur Selbst-Registrierung eingeladen
  // werden können. Erst dann lässt sich die Registrierung abschliessen.
  const formationReady =
    accountType !== 'formation' ||
    Array.from({ length: inviteCount }).every((_, i) => (memberEmails[i + 1] ?? '').trim().length > 0)

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
    // Mitgliederbereich gleich stimmen. Bei einer Formation legt die anmeldende
    // Person (Mitglied 1) hier ihr eigenes Profil an; die weiteren Mitglieder
    // registrieren sich später selbst.
    const fullName = [vorname.trim(), nachname.trim()].filter(Boolean).join(' ')
    const instrumentList = [...selectedInstruments, instrumentFreetext.trim()]
      .filter(Boolean)
      .join(', ')
    const isFormation = accountType === 'formation'
    setStoredProfile({
      ...(fullName ? { name: fullName } : {}),
      email: email.trim(),
      wohnort: ort.trim(),
      bio: bio.trim(),
      ...(instrumentList ? { instruments: instrumentList } : {}),
      avatar,
      openForFormation: isFormation ? false : formationChoice === 'open',
      inFormation: isFormation ? true : formationChoice === 'yes',
      formationName: isFormation
        ? formationName.trim()
        : formationChoice === 'yes'
          ? formationName.trim()
          : '',
    })

    setDone(true)
  }

  // Gemeinsame Profil-Felder (Bild, Bio, Wohnort, Instrumente) — werden im
  // letzten Schritt sowohl von Einzelpersonen als auch von der anmeldenden
  // Person einer Formation ausgefüllt.
  const profileFieldsBlock = (
    <>
      {/* Profile photo */}
      <div>
        <label className="label text-text-secondary block mb-3">Profilbild</label>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-border flex items-center justify-center flex-shrink-0 overflow-hidden">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Profilbild" className="w-full h-full object-cover" />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {/* Datei-Upload vom Computer oder Handy */}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="font-sans text-sm border border-border px-4 py-2.5 hover:border-dark transition-colors inline-flex items-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {avatar ? 'Anderes Bild wählen' : 'Bild hochladen'}
            </button>
            {avatar ? (
              <button
                type="button"
                onClick={() => { setAvatar(''); if (avatarInputRef.current) avatarInputRef.current.value = '' }}
                className="font-sans text-xs text-text-secondary hover:text-red-500 transition-colors text-left"
              >
                Bild entfernen
              </button>
            ) : (
              <p className="font-sans text-xs text-text-secondary">Vom Computer oder Handy · JPG, PNG</p>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="label text-text-secondary block mb-1.5">Bio</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
          className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface resize-none"
          placeholder="Erzähl der Community etwas über dich — deine Musik, deine Heimat, deine Geschichte."
        />
      </div>

      {/* Wohnort (automatisch aus den Angaben) */}
      <div>
        <label className="label text-text-secondary block mb-1.5">Wohnort</label>
        <input
          value={ort}
          onChange={e => setOrt(e.target.value)}
          type="text"
          placeholder="Luzern"
          className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
        />
        <p className="font-sans text-xs text-text-secondary mt-1.5">Automatisch aus deinen Angaben übernommen — du kannst ihn hier anpassen.</p>
      </div>

      {/* Instruments */}
      <div>
        <label className="label text-text-secondary block mb-3">Instrumente</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {PROFILE_INSTRUMENTS.map((inst) => (
            <button
              key={inst}
              onClick={() => toggleInstrument(inst)}
              className={`font-sans text-sm px-3 py-2 border transition-all ${
                selectedInstruments.includes(inst)
                  ? 'border-dark bg-dark text-white'
                  : 'border-border bg-surface text-text-secondary hover:border-dark'
              }`}
            >
              {inst}
            </button>
          ))}
        </div>
        <input
          value={instrumentFreetext}
          onChange={e => setInstrumentFreetext(e.target.value)}
          type="text"
          placeholder="Weiteres Instrument (freitext)"
          className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
        />
      </div>
    </>
  )

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
                  oder die vollständige Lernvideo-Datenbank verwenden, upgradest du jederzeit in deinem Konto auf einen
                  passenden Plan.
                </p>
              </div>
            </div>
          )}

          {accountType === 'formation' && (
            <div className="bg-accent-gold/5 border border-accent-gold/30 p-4 mb-8 text-left flex gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
              <div>
                <p className="font-sans text-sm font-semibold mb-1">Die weiteren Mitglieder sind eingeladen</p>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">
                  Da dein Abo bezahlt wurde, haben die anderen Mitglieder deiner Formation eine
                  Einladung per E-Mail erhalten. Über den Link darin registriert sich jedes Mitglied
                  selbst und legt sein eigenes Login und Profil an — mit vollem Zugriff auf alle
                  Pro-Lehrgänge und die komplette Lernvideo-Datenbank für alle Instrumente.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/member/academy"
              className="block w-full bg-dark text-white text-center font-sans font-semibold py-4 hover:bg-accent-gold transition-colors"
            >
              Zur Musikschule →
            </Link>
            <Link
              href="/member/academy"
              className="flex items-center justify-center gap-2 w-full bg-surface border border-border text-center font-sans text-sm py-3 hover:border-dark transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Einführungsvideo anschauen
            </Link>
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

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 flex items-center justify-center font-heading font-bold text-sm transition-all ${
                  step > s.number ? 'bg-accent-gold text-white' :
                  step === s.number ? 'bg-dark text-white' :
                  'bg-border text-text-secondary'
                }`}>
                  {step > s.number ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : s.number}
                </div>
                <span className={`font-sans text-xs mt-2 ${step === s.number ? 'text-dark font-medium' : 'text-text-secondary'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 mb-5 transition-colors ${step > s.number ? 'bg-accent-gold' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="font-heading text-3xl font-bold mb-2">Konto erstellen</h1>
              <p className="font-sans text-text-secondary text-sm mb-8">
                Nur für natürliche Personen — keine Firmen oder Organisationen.
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
                  <PasswordInput className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Mindestens 8 Zeichen" />
                </div>
                <div>
                  <label className="label text-text-secondary block mb-1.5">Geburtsdatum *</label>
                  <input type="date" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface text-text-secondary" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="label text-text-secondary block mb-1.5">Strasse *</label>
                    <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Musterstrasse" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-1.5">Hausnummer *</label>
                    <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="12" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label text-text-secondary block mb-1.5">PLZ *</label>
                    <input type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="6000" />
                  </div>
                  <div className="col-span-2">
                    <label className="label text-text-secondary block mb-1.5">Ort *</label>
                    <input value={ort} onChange={e => setOrt(e.target.value)} type="text" className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface" placeholder="Luzern" />
                  </div>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer"
                    style={{ accentColor: '#C4973A' }}
                  />
                  <span className="font-sans text-xs text-text-secondary leading-relaxed">
                    Ich habe die{' '}
                    <Link href="/agb" className="text-accent-gold hover:underline">Nutzungsbedingungen</Link>{' '}
                    und die{' '}
                    <Link href="/datenschutz" className="text-accent-gold hover:underline">Datenschutzerklärung</Link>{' '}
                    von LAEMU gelesen und stimme ihnen zu. *
                  </span>
                </label>
                <button
                  onClick={() => setStep(2)}
                  disabled={!acceptedTerms}
                  className={`w-full font-sans font-semibold py-4 transition-colors ${acceptedTerms ? 'bg-dark text-white hover:bg-accent-gold' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Weiter →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
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
                <div className="flex items-center justify-center gap-1 mb-6 bg-surface border border-border p-1 w-fit mx-auto">
                  {([
                    { id: 'yearly', label: 'Jährlich', hint: '−16 %' },
                    { id: 'monthly', label: 'Monatlich', hint: null },
                    { id: 'free', label: 'Free', hint: 'Gratis' },
                  ] as const).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setBilling(opt.id)}
                      className={`px-4 py-2 font-sans text-sm transition-colors flex items-center gap-2 ${billing === opt.id ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
                    >
                      {opt.label}
                      {opt.hint && <span className={`font-sans text-[10px] px-1.5 py-0.5 ${billing === opt.id ? 'bg-accent-gold text-white' : 'bg-accent-gold/15 text-accent-gold'}`}>{opt.hint}</span>}
                    </button>
                  ))}
                </div>
              )}

              {/* ── INDIVIDUAL OFFERING ── */}
              {accountType === 'individual' && (
                <>
                  {isFree && (
                    <div className="bg-accent-gold border border-accent-gold p-5 mb-6 flex gap-3 shadow-lg shadow-accent-gold/20">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white flex-shrink-0 mt-0.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      <div>
                        <p className="font-heading text-base font-bold mb-1 text-white">Free-Account — ohne Zahlung starten</p>
                        <p className="font-sans text-xs text-white/90 leading-relaxed">
                          Als interessierte:r Lernende:r erkundest du die ganze Musikschule kostenlos: Du siehst alle
                          Kurse, Instrumente und Lernvideos und kannst die Gratis-Stücke direkt nutzen. Zum Freischalten
                          der Lehrgänge und der vollständigen Lernvideo-Datenbank upgradest du jederzeit auf einen
                          kostenpflichtigen Plan — ganz ohne Eile.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-3 mb-6">
                    {isFree && (
                      <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-1">Das schaltest du mit einem Upgrade frei</p>
                    )}
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
                            <div className="text-right flex-shrink-0">
                              <span className="font-heading font-bold text-xl text-accent-gold">{chf(planCardPrice(planId))}</span>
                              <span className="font-sans text-xs text-text-secondary block">{periodLabel}</span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

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

                      <p className="font-sans text-xs text-text-secondary mb-2">
                        Wähle {scopeCount(scope)} {scopeCount(scope) === 1 ? 'Instrument' : 'Instrumente'} ({aboInstruments.length}/{scopeCount(scope)})
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
                    <div className="bg-background border border-border p-5 mb-8">
                      <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Dein Free-Account</p>
                      <div className="space-y-2">
                        {[
                          'Vollständiger Einblick in alle Kurse, Instrumente & Lernvideos',
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
                          'Vollständige Lernvideo-Datenbank',
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

                  {/* Feature list of selected plan */}
                  {!isFree && (
                  <div className="bg-background border border-border p-5 mb-8">
                    <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Enthalten</p>
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
                      wird ein Zuschlag von 10 % pro zusätzlichem Mitglied verrechnet.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setMemberCount(m => Math.max(1, m - 1))}
                        className="w-10 h-10 border border-border font-heading font-bold hover:border-dark transition-colors"
                      >−</button>
                      <span className="font-heading font-bold text-xl w-12 text-center tabular-nums">{memberCount}</span>
                      <button
                        onClick={() => setMemberCount(m => m + 1)}
                        className="w-10 h-10 border border-border font-heading font-bold hover:border-dark transition-colors"
                      >+</button>
                      {formationExtra > 0 && (
                        <span className="font-sans text-xs text-accent-gold ml-2">+{formationExtra} × 10 % Zuschlag</span>
                      )}
                    </div>
                    {memberCount > 1 && (
                      <p className="font-sans text-xs text-text-secondary mt-3 flex items-start gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        Du selbst bist bereits als 1. Mitglied erfasst. Die weiteren {inviteCount} {inviteCount === 1 ? 'Mitglied lädst du' : 'Mitglieder lädst du'} im nächsten Schritt per E-Mail ein.
                      </p>
                    )}
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

                  {/* Enthalten (Formation) */}
                  <div className="bg-background border border-border p-5 mb-8">
                    <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Enthalten — Formation {formationPlanMeta[formationPlan].label}</p>
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
                    <p className="font-sans text-xs text-text-secondary border-t border-border mt-4 pt-4">Gilt für bis zu {FORMATION_INCLUDED_MEMBERS} Mitglieder · {memberCount} Mitglied{memberCount !== 1 ? 'er' : ''} gewählt</p>
                  </div>
                </>
              )}

              {/* Payment — im Free-Account nicht nötig */}
              {isFree ? (
                <div className="bg-surface border border-border p-5 mb-8 flex gap-3">
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
              <div className="mb-8">
                <h3 className="font-heading font-bold text-lg mb-1">Zahlungsmittel</h3>
                <p className="font-sans text-xs text-text-secondary mb-4">
                  Im nächsten Schritt verbindest du dein Zahlungsmittel sicher mit Stripe.
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
                {/* Stripe — sichere Abwicklung der Zahlung */}
                <div className="mt-4 flex items-center gap-2.5 bg-surface border border-border px-4 py-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <p className="font-sans text-xs text-text-secondary leading-relaxed">
                    Sichere Zahlung über <span className="font-semibold text-dark">Stripe</span> — dein Zahlungsmittel
                    wird im Anschluss verschlüsselt mit Stripe verbunden. LAEMU speichert keine vollständigen Kartendaten.
                  </p>
                </div>
              </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors"
                >
                  ← Zurück
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-dark text-white font-sans font-semibold py-4 hover:bg-accent-gold transition-colors"
                >
                  Weiter →
                </button>
              </div>
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
              {accountType === 'formation' ? (
                <>
                  <h1 className="font-heading text-3xl font-bold mb-2">Dein Profil &amp; Formation einrichten</h1>
                  <p className="font-sans text-text-secondary text-sm mb-6">
                    Richte zuerst dein eigenes Profil ein — du bist als 1. Mitglied bereits erfasst. Anschliessend
                    lädst du die weiteren Mitglieder deiner Formation per E-Mail ein.
                  </p>

                  {/* Info: Selbst-Registrierung der weiteren Mitglieder + voller Zugang */}
                  <div className="bg-accent-gold/5 border border-accent-gold/30 p-4 mb-8 flex gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
                    <div>
                      <p className="font-sans text-sm font-semibold mb-1">So erhalten die weiteren Mitglieder Zugang</p>
                      <p className="font-sans text-xs text-text-secondary leading-relaxed">
                        Sobald du die Registrierung abgeschlossen und das Abo bezahlt hast, erhält jedes weitere Mitglied
                        an die unten hinterlegte E-Mail-Adresse eine Einladung. Über den Link darin registriert sich
                        jedes Mitglied selbst und legt sein eigenes Login und Profil an.
                      </p>
                      <p className="font-sans text-xs text-text-secondary leading-relaxed mt-2">
                        Alle Mitglieder erhalten vollen Zugriff auf sämtliche Pro-Lehrgänge und die komplette
                        Lernvideo-Datenbank — für alle Instrumente.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-7">
                    {profileFieldsBlock}

                    {/* Name der Formation */}
                    <div>
                      <label className="label text-text-secondary block mb-1.5">Name der Formation</label>
                      <input
                        value={formationName}
                        onChange={e => setFormationName(e.target.value)}
                        type="text"
                        placeholder="z.B. Kapelle Bergblick"
                        className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                      />
                    </div>

                    {/* Weitere Mitglieder einladen */}
                    <div className="pt-2 border-t border-border">
                      <label className="label text-text-secondary block mb-1.5">Weitere Mitglieder einladen</label>
                      <p className="font-sans text-xs text-text-secondary mb-3 leading-relaxed">
                        Mitglied 1 bist du selbst. Hinterlege für die weiteren Mitglieder je eine E-Mail-Adresse — sie
                        erhalten eine Einladung und registrieren sich anschliessend selbst.
                      </p>
                      {inviteCount === 0 ? (
                        <p className="font-sans text-sm text-text-secondary bg-surface border border-border px-4 py-3">
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
                                  className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                                />
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="font-heading text-3xl font-bold mb-2">Profil einrichten</h1>
                  <p className="font-sans text-text-secondary text-sm mb-8">
                    Alle Angaben hier sind optional — du kannst sie jederzeit in deinem Profil ergänzen.
                  </p>

                  <div className="space-y-7">
                    {profileFieldsBlock}

                    {/* Formation */}
                    <div>
                      <label className="label text-text-secondary block mb-3">Formation</label>
                      <div className="flex gap-2 mb-4">
                        {[
                          { id: 'yes', label: 'Ja, ich spiele in einer Formation' },
                          { id: 'no', label: 'Nein' },
                          { id: 'open', label: 'Offen für Formationen' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setFormationChoice(opt.id as 'yes' | 'no' | 'open')}
                            className={`font-sans text-sm px-4 py-2.5 border transition-all ${
                              formationChoice === opt.id ? 'border-dark bg-dark text-white' : 'border-border bg-surface text-text-secondary hover:border-dark'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {formationChoice === 'yes' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <input
                            value={formationName}
                            onChange={e => setFormationName(e.target.value)}
                            type="text"
                            placeholder="Name der Formation"
                            className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors"
                >
                  ← Zurück
                </button>
                <button
                  onClick={finishRegistration}
                  disabled={!formationReady}
                  className={`flex-1 font-sans font-semibold py-4 transition-colors ${formationReady ? 'bg-accent-gold text-white hover:bg-dark' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Registrierung abschliessen ✓
                </button>
              </div>
              {accountType === 'formation' ? (
                !formationReady && (
                  <p className="font-sans text-xs text-text-secondary text-center mt-3">
                    Hinterlege für jedes weitere Mitglied eine E-Mail-Adresse, um die Einladungen zu versenden und die Registrierung abzuschliessen.
                  </p>
                )
              ) : (
                <button
                  onClick={finishRegistration}
                  className="w-full mt-3 font-sans text-sm text-text-secondary hover:text-dark transition-colors py-2"
                >
                  Überspringen — später im Profil ergänzen
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
