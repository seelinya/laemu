'use client'

import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PasswordInput } from '@/components/PasswordInput'
import { type Instrument, type UserAbo, type FormationPlanId } from '@/lib/academy'
import { setStoredAbo } from '@/lib/userPlan'
import { setStoredProfile } from '@/lib/userProfile'
import { setStoredFormation } from '@/lib/formation'

// Alle in der Musikschule verfügbaren Instrumente — Formationsmitglieder haben
// vollen Zugriff auf alle Instrumente.
const ALL_INSTRUMENTS = ['Schwyzerörgeli', 'Handorgel', 'Bassgeige'] as const

// ── Geburtsdatum: ein direkt eintippbares Feld «TT.MM.JJJJ» (wie in der
// regulären Registrierung). ────────────────────────────────────────────────
const GEBURT_AKTUELLES_JAHR = new Date().getFullYear()
const GEBURT_MIN_JAHR = GEBURT_AKTUELLES_JAHR - 120

const formatGeburtstag = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 8)
  const tag = digits.slice(0, 2)
  const monat = digits.slice(2, 4)
  const jahr = digits.slice(4, 8)
  let out = tag
  if (digits.length > 2) out += '.' + monat
  if (digits.length > 4) out += '.' + jahr
  return out
}

const parseGeburtstag = (val: string): string => {
  const m = val.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (!m) return ''
  const tag = Number(m[1])
  const monat = Number(m[2])
  const jahr = Number(m[3])
  if (jahr < GEBURT_MIN_JAHR || jahr > GEBURT_AKTUELLES_JAHR) return ''
  const d = new Date(jahr, monat - 1, tag)
  const exists = d.getFullYear() === jahr && d.getMonth() === monat - 1 && d.getDate() === tag
  if (!exists) return ''
  return `${m[3]}-${m[2]}-${m[1]}`
}

function EinladungInner() {
  const params = useSearchParams()
  // Name der einladenden Formation aus dem Einladungslink; Fallback neutral.
  const formationName = (params.get('formation') ?? '').trim()
  const formationLabel = formationName || 'deine Formation'
  // Formationsplan aus dem Link (bestimmt den Zugang) — standardmässig «pro».
  const planParam = params.get('plan')
  const formationPlan: FormationPlanId = planParam === 'lernvideo' ? 'lernvideo' : 'pro'
  // Name der zahlungspflichtigen Person (aus dem Einladungslink), damit
  // eingeladene Mitglieder sehen, wer das Abo bezahlt.
  const payerName = (params.get('payer') ?? '').trim()

  const [done, setDone] = useState(false)
  // Bestätigungs-E-Mail erneut senden (Demo — nur Rückmeldung).
  const [confirmResent, setConfirmResent] = useState(false)

  // Persönliche Angaben (Pflichtfelder) — identisch zur regulären Registrierung.
  const [vorname, setVorname] = useState('')
  const [nachname, setNachname] = useState('')
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [geburtstag, setGeburtstag] = useState('')
  const geburtsdatum = parseGeburtstag(geburtstag)
  const [strasse, setStrasse] = useState('')
  const [hausnummer, setHausnummer] = useState('')
  const [plz, setPlz] = useState('')
  const [ort, setOrt] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

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

  const finishRegistration = () => {
    // Formationsmitglied: voller Zugang zu allen Instrumenten (Plan aus dem Link).
    // Weder Abo-Auswahl noch Zahlung — das übernimmt die Formation.
    const abo: UserAbo = {
      plan: formationPlan,
      instruments: [...ALL_INSTRUMENTS] as Instrument[],
      allInstruments: true,
    }
    setStoredAbo(abo)

    const fullName = [vorname.trim(), nachname.trim()].filter(Boolean).join(' ')
    setStoredProfile({
      ...(fullName ? { name: fullName } : {}),
      email: email.trim(),
      wohnort: ort.trim(),
      inFormation: true,
      // Eingeladene Mitglieder sind nicht zahlungspflichtig — das Abo zahlt die
      // Person, die die Formation registriert hat.
      formationPayer: false,
      ...(formationName ? { formationName } : {}),
      instruments: [...ALL_INSTRUMENTS].join(', '),
    })

    // Formations-Zustand anlegen, damit auch dieses Mitglied die «Formations-
    // übersicht» erhält (Name der Formation, zahlungspflichtige Person und
    // Verwaltung der weiteren E-Mails).
    // Eingeladene Mitglieder sind nicht zahlungspflichtig und verwalten die
    // Formation nicht — die bezahlte Mitgliederzahl kennen sie nicht (0).
    setStoredFormation({ name: formationName, payerName, members: [], paidMemberCount: 0 })

    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-accent-gold flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">Willkommen in der LAEMU-Musikschule</h1>
          <p className="font-sans text-text-secondary leading-relaxed mb-6">
            Dein Konto wurde erstellt und du bist Teil {formationName ? <>der Formation <span className="font-semibold text-dark">{formationName}</span></> : 'deiner Formation'}.
            Du hast direkten Zugang zu allen Pro-Lehrgängen und allen Stücken — ohne eigenes Abo und ohne Zahlung.
          </p>

          {/* E-Mail-Bestätigung / Kontoaktivierung */}
          <div className="bg-surface border border-border p-4 mb-4 text-left flex gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg>
            <div>
              <p className="font-sans text-sm font-semibold mb-1">Bestätige deine E-Mail-Adresse</p>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                Wir haben dir einen Bestätigungslink an{' '}
                {email.trim() ? <span className="text-dark font-medium">{email.trim()}</span> : 'deine E-Mail-Adresse'}{' '}
                geschickt. Bestätige deine Adresse, um dein Konto vollständig zu aktivieren.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <Link
                  href={`/e-mail-bestaetigen${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ''}`}
                  className="font-sans text-xs text-accent-gold hover:underline"
                >
                  Demo: Link öffnen →
                </Link>
                {confirmResent ? (
                  <span className="font-sans text-xs text-text-secondary">Erneut gesendet ✓</span>
                ) : (
                  <button
                    onClick={() => setConfirmResent(true)}
                    className="font-sans text-xs text-text-secondary hover:text-dark transition-colors"
                  >
                    E-Mail erneut senden
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-accent-gold/10 border border-accent-gold/40 p-4 mb-8 text-left flex gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
            <div>
              <p className="font-sans text-sm font-semibold mb-1">Deine Formationsübersicht</p>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                In deinem Konto findest du unter «Formationsübersicht» den Namen deiner Formation und kannst die
                E-Mail-Adressen der weiteren Mitglieder verwalten und einladen.
              </p>
            </div>
          </div>

          <Link
            href="/member/academy"
            className="block w-full bg-dark text-white text-center font-sans font-semibold py-4 hover:bg-accent-gold hover:text-white transition-colors"
          >
            Zur Musikschule →
          </Link>
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
        <div className="flex items-start gap-2 flex-wrap mb-2">
          <h1 className="font-heading text-3xl font-bold">Deiner Formation beitreten</h1>
          <span className="font-sans text-[11px] font-semibold px-2 py-1 bg-accent-gold/15 border border-accent-gold/40 text-accent-gold mt-1.5">
            Einladung
          </span>
        </div>
        <p className="font-sans text-text-secondary text-sm mb-6">
          Du wurdest von <span className="font-semibold text-dark">{formationLabel}</span> zur LAEMU-Musikschule
          eingeladen. Gib nur noch deine persönlichen Daten an — die Auswahl eines Abos und die Zahlung entfallen,
          das übernimmt deine Formation.
        </p>

        {/* Golden hint: voller Zugang ohne Abo/Zahlung */}
        <div className="bg-accent-gold/10 border border-accent-gold/40 p-4 mb-8 flex gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" /><polyline points="9 12 11 14 15 10" /></svg>
          <div>
            <p className="font-sans text-sm font-semibold mb-1">Voller Zugang ohne eigenes Abo</p>
            <p className="font-sans text-xs text-text-secondary leading-relaxed">
              Über deine Formation erhältst du direkten Zugang zu allen Pro-Lehrgängen und allen Stücken für alle
              Instrumente. Nach der Registrierung landest du direkt in der Musikschule.
            </p>
          </div>
        </div>

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
            <input
              value={geburtstag}
              onChange={e => setGeburtstag(formatGeburtstag(e.target.value))}
              type="text"
              inputMode="numeric"
              aria-label="Geburtsdatum (TT.MM.JJJJ)"
              placeholder="TT.MM.JJJJ"
              className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
            />
            <p className="font-sans text-xs text-text-secondary mt-1.5">Tippe dein Geburtsdatum ein — z. B. 07.04.1985.</p>
            {geburtstag.length === 10 && geburtsdatum === '' && (
              <p className="font-sans text-xs text-accent-gold mt-1">
                Bitte gib ein gültiges Datum im Format TT.MM.JJJJ ein (Jahrgang zwischen {GEBURT_MIN_JAHR} und {GEBURT_AKTUELLES_JAHR}).
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

          <button
            onClick={() => { if (angabenComplete) finishRegistration() }}
            disabled={!angabenComplete}
            className={`w-full font-sans font-semibold py-4 transition-colors ${angabenComplete ? 'bg-dark text-white hover:bg-accent-gold hover:text-white' : 'bg-border text-text-secondary cursor-not-allowed'}`}
          >
            Registrierung abschliessen →
          </button>
          {!angabenComplete && (
            <p className="font-sans text-xs text-text-secondary text-center">
              Bitte fülle alle Pflichtfelder (*) aus und akzeptiere die Nutzungsbedingungen, um fortzufahren.
            </p>
          )}
          <p className="font-sans text-xs text-text-secondary text-center">
            Dein persönliches Profil (Bild, Bio, Instrumente …) ergänzt du jederzeit später im Mitgliederbereich.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EinladungRegisterPage() {
  return (
    <Suspense fallback={null}>
      <EinladungInner />
    </Suspense>
  )
}
