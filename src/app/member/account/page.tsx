'use client'

import { Suspense, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  aboPlanLabel,
  aboMonthlyPrice,
  aboInstrumentsLabel,
  formationPlanMeta,
  formationYearlyPrice,
  FORMATION_MAX_MEMBERS,
  type FormationPlanId,
  type UserAbo,
} from '@/lib/academy'
import { useUserAbo } from '@/lib/userPlan'
import { useUserProfile, setStoredProfile } from '@/lib/userProfile'
import {
  readStoredFormation,
  setStoredFormation,
  makeSlotId,
  type FormationMemberSlot,
} from '@/lib/formation'
import { UpgradeDialog } from '@/components/UpgradeDialog'
import { PasswordInput } from '@/components/PasswordInput'

const SECTIONS = [
  { id: 'konto', label: 'Konto & Daten' },
  { id: 'formation', label: 'Formationsübersicht' },
  { id: 'abo', label: 'Mein Abo' },
  { id: 'rechnungen', label: 'Rechnungen & Zahlungen' },
  { id: 'zahlungsmittel', label: 'Zahlungsmittel' },
  { id: 'sicherheit', label: 'Sicherheit & Passkeys' },
  { id: 'geraete', label: 'Geräte' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

// Einfache E-Mail-Prüfung für den Einladungs-Flow.
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

type PaymentMethod = {
  id: string
  type: string
  last4: string
  exp: string
  primary: boolean
}

const SEED_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm1', type: 'Visa', last4: '4242', exp: '08/27', primary: true },
  { id: 'pm2', type: 'TWINT', last4: '67', exp: '+41 79 ••• •• 67', primary: false },
]

type Device = {
  id: string
  name: string
  location: string
  last: string
  current: boolean
}

const SEED_DEVICES: Device[] = [
  { id: 'd1', name: 'iPhone 15 — Safari', location: 'Luzern, CH', last: 'Aktiv jetzt', current: true },
  { id: 'd2', name: 'MacBook Pro — Chrome', location: 'Luzern, CH', last: 'vor 2 Stunden', current: false },
]

type Passkey = {
  id: string
  name: string
  added: string
}

const SEED_PASSKEYS: Passkey[] = [
  { id: 'pk1', name: 'iPhone 15 — Face ID', added: 'Hinzugefügt am 12. Juni 2026' },
]

function Field({ label, value, type = 'text' }: { label: string; value: string; type?: string }) {
  return (
    <div>
      <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">{label}</label>
      <input defaultValue={value} type={type} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface" />
    </div>
  )
}

function SectionCard({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div className="bg-surface border border-border p-6">
      <h2 className="font-heading font-bold text-xl mb-1">{title}</h2>
      {desc && <p className="font-sans text-sm text-text-secondary mb-5">{desc}</p>}
      {children}
    </div>
  )
}

// Frei hinzufügbare „Sonstiges“-Links (z.B. YouTube, Website …) — beliebig viele.
// ---------------------------------------------------------------------------
// Abo Tab
// ---------------------------------------------------------------------------
function AboTab() {
  // Tatsächlich gewähltes Abo (aus der Registrierung) — Quelle der Wahrheit.
  const storedAbo = useUserAbo()
  const [abo, setAbo] = useState<UserAbo>(storedAbo)
  // useUserAbo liefert erst nach dem Mount den gespeicherten Wert — übernehmen.
  useEffect(() => { setAbo(storedAbo) }, [storedAbo])

  const [cancelled, setCancelled] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const isFree = abo.plan === 'none'
  const monthly = aboMonthlyPrice(abo)
  const instrumentsLabel = aboInstrumentsLabel(abo)

  // End of current month (today = 2026-06-05, so end = 30. Juni 2026)
  const cancelDateLabel = '30. Juni 2026'

  function confirmCancel() {
    setCancelled(true)
    setShowCancelModal(false)
  }

  function undoCancel() {
    setCancelled(false)
  }

  // Upgrade/Abo ändern läuft über ein Popup (kein Registrationsprozess).
  const [showUpgrade, setShowUpgrade] = useState(false)

  // Nicht-zahlungspflichtige Formationsmitglieder: Abo läuft über die Formation.
  const profile = useUserProfile()
  const isNonPayingMember = profile.inFormation && !profile.formationPayer

  // Demo-Daten für das über die Formation bezahlte Jahresabo.
  const paidDateLabel = '26. Juni 2026'
  const expiryDateLabel = '26. Juni 2027'

  if (isNonPayingMember) {
    return (
      <SectionCard title="Mein Abo" desc="Dein Zugang läuft über deine Formation.">
        <div className="border border-border p-5 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-1">Aktiver Plan</p>
              <h3 className="font-heading text-xl font-bold">{aboPlanLabel(abo)}</h3>
              {instrumentsLabel && <p className="font-sans text-xs text-text-secondary mt-0.5">{instrumentsLabel}</p>}
            </div>
            <span className="font-sans text-[10px] bg-accent-gold/10 text-accent-gold border border-accent-gold/30 px-2 py-0.5 flex-shrink-0">Über Formation</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-border">
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-1">Bezahlt am</p>
              <p className="font-sans text-sm font-medium">{paidDateLabel}</p>
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-1">Läuft ab am</p>
              <p className="font-sans text-sm font-medium">{expiryDateLabel}</p>
            </div>
          </div>
        </div>

        <div className="bg-accent-gold/5 border border-accent-gold/30 px-4 py-3">
          <p className="font-sans text-sm text-text-secondary">
            Dein Zugang wird über deine Formation bezahlt. Das Abonnement und die Rechnungen verwaltet die
            zahlungspflichtige Person — du musst kein Zahlungsmittel hinterlegen.
          </p>
        </div>
      </SectionCard>
    )
  }

  // Zahlungspflichtige Person einer Formation: Das Abo ist ein Formationsabo und
  // wird als Formation verwaltet. Ein Wechsel auf ein Einzelabo ist hier nicht
  // möglich — es lässt sich nur als Formation kündigen.
  const isFormationPayer = profile.inFormation && profile.formationPayer

  if (isFormationPayer) {
    const formationPlan: FormationPlanId = abo.plan === 'lernvideo' ? 'lernvideo' : 'pro'
    const formation = readStoredFormation()
    // Bezahlte Mitgliederzahl inkl. der eigenen (zahlungspflichtigen) Person;
    // ohne gespeicherten Wert aus den vorhandenen Plätzen abgeleitet.
    const memberCount = formation.paidMemberCount || 1 + formation.members.length
    const yearly = formationYearlyPrice(formationPlan, memberCount)

    return (
      <>
        <SectionCard title="Mein Abo" desc="Übersicht deines Formationsabos.">
          <div className="border border-border p-5 mb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-1">Aktiver Plan</p>
                <h3 className="font-heading text-xl font-bold">Formation {formationPlanMeta[formationPlan].label}</h3>
                <p className="font-sans text-xs text-text-secondary mt-0.5">
                  {memberCount} {memberCount === 1 ? 'Mitglied' : 'Mitglieder'} · Alle Instrumente
                </p>
                {cancelled ? (
                  <p className="font-sans text-xs text-red-600 mt-1 font-medium">Gekündigt — Zugang bis {expiryDateLabel}</p>
                ) : (
                  <p className="font-sans text-xs text-text-secondary mt-1">Nächste Abrechnung: {expiryDateLabel}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-heading text-2xl font-bold text-accent-gold">CHF {yearly.toLocaleString('de-CH')}</p>
                <p className="font-sans text-xs text-text-secondary">/ Jahr</p>
              </div>
            </div>
          </div>

          {cancelled && (
            <div className="bg-red-50 border border-red-200 px-4 py-3 mb-4 flex items-center justify-between">
              <p className="font-sans text-sm text-red-700">Deine Formation wurde gekündigt. Alle Mitglieder haben noch Zugang bis zum {expiryDateLabel}.</p>
              <button onClick={undoCancel} className="font-sans text-xs text-red-700 underline hover:no-underline ml-4 whitespace-nowrap">Kündigung rückgängig machen</button>
            </div>
          )}

          <div className="bg-accent-gold/5 border border-accent-gold/30 px-4 py-3 mb-4">
            <p className="font-sans text-sm text-text-secondary">
              Dein Abo ist ein Formationsabo und wird als Formation verwaltet. Ein Wechsel auf ein
              Einzelabo ist hier nicht möglich — du kannst dein Abo nur als Formation kündigen. Möchtest
              du zu einem Einzelabo wechseln, kündige zuerst die Formation und registriere dich
              anschliessend neu als Einzelperson.
            </p>
          </div>

          {!cancelled && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="border border-border font-sans text-sm px-5 py-2.5 hover:border-dark transition-colors"
            >
              Formation kündigen
            </button>
          )}
        </SectionCard>

        {/* Kündigungsbestätigung — für die gesamte Formation */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-dark/70" onClick={() => setShowCancelModal(false)} />
            <div className="relative bg-surface border border-border w-full max-w-sm mx-4 p-6 shadow-xl">
              <h3 className="font-heading font-bold text-xl mb-2">Formation kündigen?</h3>
              <p className="font-sans text-sm text-text-secondary mb-2">
                Du kündigst das Abo für die gesamte Formation. Die Kündigung wird zum Ende der laufenden
                Abo-Periode wirksam.
              </p>
              <p className="font-sans text-sm font-medium mb-5">
                Alle Mitglieder haben noch Zugang bis zum <span className="text-accent-gold">{expiryDateLabel}</span>.
              </p>
              <div className="flex items-center gap-3 justify-end border-t border-border pt-4">
                <button onClick={() => setShowCancelModal(false)} className="font-sans text-sm text-text-secondary hover:text-dark transition-colors px-4 py-2">Abbrechen</button>
                <button
                  onClick={confirmCancel}
                  className="bg-red-600 text-white font-sans text-sm px-5 py-2.5 hover:bg-red-700 transition-colors"
                >
                  Formation kündigen
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <SectionCard title="Mein Abo" desc="Übersicht deines aktuellen Plans.">
        <div className="border border-border p-5 flex items-start justify-between mb-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-1">Aktiver Plan</p>
            <h3 className="font-heading text-xl font-bold">{aboPlanLabel(abo)}</h3>
            {instrumentsLabel && (
              <p className="font-sans text-xs text-text-secondary mt-0.5">{instrumentsLabel}</p>
            )}
            {isFree ? (
              <p className="font-sans text-xs text-text-secondary mt-1">Kostenloser Zugang — keine Abrechnung.</p>
            ) : cancelled ? (
              <p className="font-sans text-xs text-red-600 mt-1 font-medium">Gekündigt — Zugang bis {cancelDateLabel}</p>
            ) : (
              <p className="font-sans text-xs text-text-secondary mt-1">Nächste Abrechnung: 26. Juni 2026</p>
            )}
          </div>
          <div className="text-right">
            {isFree ? (
              <p className="font-heading text-2xl font-bold text-accent-gold">Gratis</p>
            ) : (
              <>
                <p className="font-heading text-2xl font-bold text-accent-gold">CHF {monthly}</p>
                <p className="font-sans text-xs text-text-secondary">/ Monat</p>
              </>
            )}
          </div>
        </div>

        {isFree && (
          <div className="bg-accent-gold/5 border border-accent-gold/30 px-4 py-3 mb-4">
            <p className="font-sans text-sm text-text-secondary">
              Du nutzt den kostenlosen Free-Account. Schalte mit einem Upgrade die Lehrgänge und
              alle Stücke frei.
            </p>
          </div>
        )}

        {!isFree && cancelled && (
          <div className="bg-red-50 border border-red-200 px-4 py-3 mb-4 flex items-center justify-between">
            <p className="font-sans text-sm text-red-700">Dein Abo wurde gekündigt. Du hast noch Zugang bis zum {cancelDateLabel}.</p>
            <button onClick={undoCancel} className="font-sans text-xs text-red-700 underline hover:no-underline ml-4 whitespace-nowrap">Kündigung rückgängig machen</button>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowUpgrade(true)}
            className="inline-flex items-center bg-accent-gold text-white font-sans text-sm px-5 py-2.5 hover:bg-dark transition-colors"
          >
            {isFree ? 'Auf einen kostenpflichtigen Plan upgraden' : 'Abo ändern'}
          </button>
          {!isFree && !cancelled && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="border border-border font-sans text-sm px-5 py-2.5 hover:border-dark transition-colors"
            >
              Abo kündigen
            </button>
          )}
        </div>
        <p className="font-sans text-xs text-text-secondary mt-3">
          Beim Ändern wählst du — wie bei der Registrierung — Mitgliedschaftsart (Einzelperson oder Formation),
          Plan und Instrument(e).
        </p>
      </SectionCard>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-dark/70" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-surface border border-border w-full max-w-sm mx-4 p-6 shadow-xl">
            <h3 className="font-heading font-bold text-xl mb-2">Abo kündigen?</h3>
            <p className="font-sans text-sm text-text-secondary mb-2">
              Dein Abo wird zum Ende des laufenden Monats gekündigt.
            </p>
            <p className="font-sans text-sm font-medium mb-5">
              Du hast noch Zugang bis zum <span className="text-accent-gold">{cancelDateLabel}</span>.
            </p>
            <div className="flex items-center gap-3 justify-end border-t border-border pt-4">
              <button onClick={() => setShowCancelModal(false)} className="font-sans text-sm text-text-secondary hover:text-dark transition-colors px-4 py-2">Abbrechen</button>
              <button
                onClick={confirmCancel}
                className="bg-red-600 text-white font-sans text-sm px-5 py-2.5 hover:bg-red-700 transition-colors"
              >
                Kündigen zum {cancelDateLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade / Abo ändern — Popup mit Abo-Auswahl & Zahlungsmittel */}
      {showUpgrade && (
        <UpgradeDialog
          abo={abo}
          onClose={() => setShowUpgrade(false)}
          onUpgraded={(next) => { setAbo(next); setCancelled(false) }}
        />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Zahlungsmittel Tab
// ---------------------------------------------------------------------------
function ZahlungsmittelTab() {
  const [methods, setMethods] = useState<PaymentMethod[]>(SEED_PAYMENT_METHODS)
  const [showForm, setShowForm] = useState(false)
  const [methodType, setMethodType] = useState<'kreditkarte' | 'twint'>('kreditkarte')

  // Kreditkarte fields
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvc, setCardCvc] = useState('')

  // TWINT field
  const [twintPhone, setTwintPhone] = useState('+41 ')

  function resetForm() {
    setMethodType('kreditkarte')
    setCardHolder('')
    setCardNumber('')
    setCardExp('')
    setCardCvc('')
    setTwintPhone('+41 ')
  }

  function openForm() {
    resetForm()
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    resetForm()
  }

  function addMethod() {
    const newId = `pm${Date.now()}`
    if (methodType === 'kreditkarte') {
      const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '????'
      setMethods((prev) => [
        ...prev,
        { id: newId, type: 'Kreditkarte', last4, exp: cardExp, primary: false },
      ])
    } else {
      const digits = twintPhone.replace(/\D/g, '').slice(-2) || '??'
      setMethods((prev) => [
        ...prev,
        { id: newId, type: 'TWINT', last4: digits, exp: twintPhone, primary: false },
      ])
    }
    setShowForm(false)
    resetForm()
  }

  function removeMethod(id: string) {
    setMethods((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <SectionCard title="Zahlungsmittel" desc="Verbundene Zahlungsmittel verwalten.">
      <div className="space-y-3 mb-5">
        {methods.map((pm) => (
          <div key={pm.id} className="flex items-center gap-4 border border-border p-4">
            <div className="w-10 h-10 bg-background border border-border flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-medium">{pm.type} · {pm.last4}</p>
              <p className="font-sans text-xs text-text-secondary">{pm.exp}</p>
            </div>
            {pm.primary && <span className="font-sans text-[10px] bg-accent-gold/10 text-accent-gold border border-accent-gold/30 px-2 py-0.5">Standard</span>}
            <button
              onClick={() => removeMethod(pm.id)}
              className="font-sans text-xs text-text-secondary hover:text-red-600 transition-colors"
            >
              Entfernen
            </button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={openForm}
          className="border border-dashed border-border w-full py-3 font-sans text-sm text-text-secondary hover:border-dark hover:text-dark transition-colors"
        >
          + Zahlungsmittel hinzufügen
        </button>
      ) : (
        <div className="border border-border p-5 bg-background">
          <h4 className="font-sans text-sm font-medium uppercase tracking-widest text-text-secondary mb-4">Neues Zahlungsmittel</h4>

          {/* Type switch */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setMethodType('kreditkarte')}
              className={`flex-1 py-2 font-sans text-sm border transition-colors ${methodType === 'kreditkarte' ? 'bg-dark text-white border-dark' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
            >
              Kreditkarte
            </button>
            <button
              onClick={() => setMethodType('twint')}
              className={`flex-1 py-2 font-sans text-sm border transition-colors ${methodType === 'twint' ? 'bg-dark text-white border-dark' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
            >
              TWINT
            </button>
          </div>

          {methodType === 'kreditkarte' ? (
            <div className="space-y-3">
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Karteninhaber</label>
                <input
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Max Mustermann"
                  className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                />
              </div>
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Kartennummer</label>
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Ablaufdatum (MM/JJ)</label>
                  <input
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    placeholder="08/27"
                    maxLength={5}
                    className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                  />
                </div>
                <div>
                  <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">CVC</label>
                  <input
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    type="password"
                    className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Telefonnummer</label>
                <input
                  value={twintPhone}
                  onChange={(e) => setTwintPhone(e.target.value)}
                  placeholder="+41 79 123 45 67"
                  className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                />
              </div>
              <p className="font-sans text-xs text-text-secondary bg-surface border border-border px-3 py-2">
                Nach dem Hinzufügen erhältst du eine TWINT-Anfrage auf deinem Smartphone zur Bestätigung.
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-5 pt-4 border-t border-border">
            <button
              onClick={addMethod}
              className="bg-dark text-white font-sans text-sm px-5 py-2.5 hover:bg-accent-gold hover:text-white transition-colors"
            >
              Hinzufügen
            </button>
            <button
              onClick={cancelForm}
              className="border border-border font-sans text-sm px-5 py-2.5 text-text-secondary hover:border-dark hover:text-dark transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Sicherheit & Passkeys Tab — Passwort ändern und Passkeys (WebAuthn) verwalten
// ---------------------------------------------------------------------------
function SicherheitTab() {
  // ── Passwort ändern ──
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [repeat, setRepeat] = useState('')
  const [pwSaved, setPwSaved] = useState(false)

  const tooShort = next.length > 0 && next.length < 8
  const mismatch = repeat.length > 0 && repeat !== next
  const pwValid = current.length > 0 && next.length >= 8 && next === repeat

  const savePassword = () => {
    if (!pwValid) return
    setCurrent('')
    setNext('')
    setRepeat('')
    setPwSaved(true)
  }

  // ── Passkeys (WebAuthn) ──
  const [passkeys, setPasskeys] = useState<Passkey[]>(SEED_PASSKEYS)
  const [adding, setAdding] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState<Passkey | null>(null)

  // Passkey hinzufügen: öffnet normalerweise den Geräte-Sicherheitsdialog
  // (Fingerabdruck, Gesicht, PIN). Hier simulieren wir den Ablauf.
  const addPasskey = () => {
    setAdding(true)
    setTimeout(() => {
      setPasskeys((prev) => [
        ...prev,
        { id: `pk${prev.length + 1}-${prev.length}`, name: 'Dieses Gerät — Passkey', added: 'Gerade hinzugefügt' },
      ])
      setAdding(false)
    }, 900)
  }

  const removePasskey = (id: string) => {
    setPasskeys((prev) => prev.filter((p) => p.id !== id))
    setConfirmRemove(null)
  }

  return (
    <>
      {/* Passwort ändern */}
      <SectionCard title="Passwort ändern" desc="Wähle ein neues Passwort für dein Konto (mind. 8 Zeichen).">
        <div className="space-y-4 max-w-md">
          <div>
            <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Aktuelles Passwort</label>
            <PasswordInput
              value={current}
              onChange={(e) => { setCurrent(e.target.value); setPwSaved(false) }}
              placeholder="Aktuelles Passwort"
              className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
            />
          </div>
          <div>
            <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Neues Passwort</label>
            <PasswordInput
              value={next}
              onChange={(e) => { setNext(e.target.value); setPwSaved(false) }}
              placeholder="Mindestens 8 Zeichen"
              className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
            />
            {tooShort && <p className="font-sans text-xs text-accent-gold mt-1.5">Das Passwort muss mindestens 8 Zeichen lang sein.</p>}
          </div>
          <div>
            <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Neues Passwort wiederholen</label>
            <PasswordInput
              value={repeat}
              onChange={(e) => { setRepeat(e.target.value); setPwSaved(false) }}
              placeholder="Passwort erneut eingeben"
              className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
            />
            {mismatch && <p className="font-sans text-xs text-accent-gold mt-1.5">Die Passwörter stimmen nicht überein.</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
          <button
            onClick={savePassword}
            disabled={!pwValid}
            className={`font-sans text-sm px-5 py-2.5 transition-colors ${pwValid ? 'bg-dark text-white hover:bg-accent-gold hover:text-white' : 'bg-border text-text-secondary cursor-not-allowed'}`}
          >
            Passwort speichern
          </button>
          {pwSaved && <span className="font-sans text-sm text-status-success">Passwort geändert ✓</span>}
        </div>
      </SectionCard>

      {/* Passkeys (WebAuthn) */}
      <SectionCard title="Passkeys" desc="Melde dich ohne Passwort an — mit Fingerabdruck, Gesichtserkennung oder Geräte-PIN.">
        <div className="space-y-3 mb-4">
          {passkeys.map((pk) => (
            <div key={pk.id} className="flex items-center gap-4 border border-border p-4">
              <div className="w-10 h-10 bg-background border border-border flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"><path d="M12 2a5 5 0 0 0-5 5c0 2.5 1.5 4 1.5 4M12 2a5 5 0 0 1 5 5" /><circle cx="12" cy="9" r="2.5" /><path d="M12 11.5V21M12 21l-2-1.5M12 18l2-1.5" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium truncate">{pk.name}</p>
                <p className="font-sans text-xs text-text-secondary">{pk.added}</p>
              </div>
              <button
                onClick={() => setConfirmRemove(pk)}
                className="font-sans text-xs text-text-secondary hover:text-red-600 transition-colors flex-shrink-0"
              >
                Entfernen
              </button>
            </div>
          ))}
          {passkeys.length === 0 && (
            <p className="font-sans text-sm text-text-secondary border border-dashed border-border px-4 py-6 text-center">
              Noch kein Passkey hinterlegt. Füge einen hinzu, um dich künftig ohne Passwort anzumelden.
            </p>
          )}
        </div>

        <button
          onClick={addPasskey}
          disabled={adding}
          className="border border-dashed border-border w-full py-3 font-sans text-sm text-text-secondary hover:border-dark hover:text-dark transition-colors disabled:opacity-60"
        >
          {adding ? 'Passkey wird erstellt…' : '+ Passkey hinzufügen'}
        </button>
      </SectionCard>

      {/* Bestätigung vor dem Entfernen eines Passkeys */}
      {confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-dark/70" onClick={() => setConfirmRemove(null)} />
          <div className="relative bg-surface border border-border w-full max-w-sm mx-4 p-6 shadow-xl">
            <h3 className="font-heading font-bold text-xl mb-2">Passkey entfernen?</h3>
            <p className="font-sans text-sm text-text-secondary mb-5">
              <span className="font-medium text-dark">{confirmRemove.name}</span> kann danach nicht mehr zur
              Anmeldung verwendet werden. Du kannst jederzeit einen neuen Passkey hinzufügen.
            </p>
            <div className="flex items-center gap-3 justify-end border-t border-border pt-4">
              <button onClick={() => setConfirmRemove(null)} className="font-sans text-sm text-text-secondary hover:text-dark transition-colors px-4 py-2">Abbrechen</button>
              <button onClick={() => removePasskey(confirmRemove.id)} className="bg-red-600 text-white font-sans text-sm px-5 py-2.5 hover:bg-red-700 transition-colors">Ja, entfernen</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Geräte Tab
// ---------------------------------------------------------------------------
function GeraeteTab() {
  const [devices, setDevices] = useState<Device[]>(SEED_DEVICES)
  const MAX_DEVICES = 2

  function removeDevice(id: string) {
    setDevices((prev) => prev.filter((d) => d.id !== id))
  }

  const atMax = devices.length >= MAX_DEVICES

  return (
    <SectionCard title="Geräte" desc="Geräte, die mit deinem Konto verbunden sind.">
      <p className="font-sans text-xs text-text-secondary mb-4">
        Du kannst maximal 2 Geräte mit deinem Konto verbinden (z. B. Smartphone und Laptop).
      </p>
      <div className="space-y-3 mb-4">
        {devices.map((d) => (
          <div key={d.id} className="flex items-center gap-4 border border-border p-4">
            <div className="w-10 h-10 bg-background border border-border flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-sans text-sm font-medium truncate">{d.name}</p>
                {d.current && <span className="font-sans text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5">Dieses Gerät</span>}
              </div>
              <p className="font-sans text-xs text-text-secondary">{d.location} · {d.last}</p>
            </div>
            {!d.current && (
              <button
                onClick={() => removeDevice(d.id)}
                className="font-sans text-xs text-text-secondary hover:text-red-600 transition-colors"
              >
                Abmelden
              </button>
            )}
          </div>
        ))}
      </div>

      {atMax ? (
        <p className="font-sans text-xs text-text-secondary border border-dashed border-border px-4 py-3">
          Maximale Geräteanzahl erreicht. Um ein neues Gerät hinzuzufügen, melde zuerst ein bestehendes Gerät ab.
        </p>
      ) : (
        <p className="font-sans text-xs text-text-secondary border border-dashed border-border px-4 py-3">
          {devices.length === 0
            ? 'Keine weiteren Geräte verbunden. Du kannst noch 2 Geräte hinzufügen.'
            : `Du kannst noch ${MAX_DEVICES - devices.length} weiteres Gerät verbinden.`}
        </p>
      )}
    </SectionCard>
  )
}

// ---------------------------------------------------------------------------
// Formationsübersicht Tab — E-Mails der weiteren Mitglieder verwalten & einladen
// ---------------------------------------------------------------------------
function FormationOverviewTab({ formationName, isPayer, selfName }: { formationName: string; isPayer: boolean; selfName: string }) {
  const [name, setName] = useState('')
  const [payerName, setPayerName] = useState('')
  const [members, setMembers] = useState<FormationMemberSlot[]>([])
  // Anzahl der bei der Registrierung bezahlten Mitglieder (inkl. eigener Person).
  const [paidMemberCount, setPaidMemberCount] = useState(0)
  // Zu entfernende (eingeladene) Adresse — wird vor dem Löschen bestätigt.
  const [confirmRemove, setConfirmRemove] = useState<FormationMemberSlot | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Gespeicherten Formations-Zustand einmalig laden; Name & zahlungspflichtige
  // Person notfalls aus dem Profil ableiten.
  useEffect(() => {
    const s = readStoredFormation()
    setName(s.name || formationName)
    setPayerName(s.payerName || (isPayer ? selfName : ''))
    setMembers(s.members)
    setPaidMemberCount(s.paidMemberCount)
  }, [formationName, isPayer, selfName])

  // Es lassen sich nur so viele weitere Mitglieder erfassen, wie auch eingeladen
  // und bezahlt wurden: bezahlte Mitgliederzahl abzüglich der eigenen Person.
  // Ohne gespeicherten Wert (ältere Formationen) fallen wir auf die bereits
  // vorhandenen Plätze zurück, gedeckelt durch die maximale Formationsgrösse.
  const paidOthers = Math.max(0, (paidMemberCount || members.length + 1) - 1)
  const maxOthers = Math.min(FORMATION_MAX_MEMBERS - 1, paidOthers)

  const persist = (nextMembers: FormationMemberSlot[]) => {
    setMembers(nextMembers)
    setStoredFormation({ name, payerName, members: nextMembers, paidMemberCount })
  }

  const setSlotEmail = (id: string, email: string) =>
    persist(members.map((m) => (m.id === id ? { ...m, email } : m)))

  const sendInvite = (id: string) => {
    const slot = members.find((m) => m.id === id)
    if (!slot || !isValidEmail(slot.email)) return
    persist(members.map((m) => (m.id === id ? { ...m, email: m.email.trim(), invited: true } : m)))
    setNotice(`Einladung an ${slot.email.trim()} gesendet.`)
  }

  const addSlot = () => {
    if (members.length >= maxOthers) return
    persist([...members, { id: makeSlotId(), email: '', invited: false }])
  }

  // Leeren (noch nicht eingeladenen) Platz wieder entfernen.
  const removeSlot = (id: string) =>
    persist(members.filter((m) => m.id !== id))

  // Eingeladene Adresse nach Bestätigung entfernen: Feld wird wieder leer, der
  // Platz bleibt bestehen, damit man eine neue Person einladen kann.
  const clearInvited = (id: string) => {
    persist(members.map((m) => (m.id === id ? { ...m, email: '', invited: false } : m)))
    setConfirmRemove(null)
    setNotice('Die E-Mail-Adresse wurde entfernt. Du kannst nun eine neue Person einladen.')
  }

  // Lese-Übersicht für weitere (nicht zahlungspflichtige) Mitglieder: die
  // zahlungspflichtige Person, man selbst und weitere bekannte Mitglieder.
  const roster: { key: string; label: string; role?: string }[] = [
    { key: 'payer', label: payerName || 'Zahlungspflichtige Person', role: 'Zahlungspflichtig' },
    { key: 'self', label: selfName || 'Du', role: 'Du' },
    ...members
      .filter((m) => m.email.trim().length > 0)
      .map((m) => ({ key: m.id, label: m.email, role: 'Mitglied' })),
  ]

  return (
    <>
      <SectionCard
        title="Formationsübersicht"
        desc={
          isPayer
            ? 'Verwalte die weiteren Mitglieder deiner Formation. Hinterlege E-Mail-Adressen und verschicke die Einladungen — auch nachträglich.'
            : 'Die Mitglieder deiner Formation im Überblick.'
        }
      >
        {/* Name der Formation */}
        <div className="border border-border p-4 mb-5 flex items-center gap-3 bg-background">
          <span className="w-10 h-10 bg-accent-gold/10 text-accent-gold flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
          </span>
          <div className="min-w-0">
            <p className="font-sans text-xs uppercase tracking-widest text-text-secondary">Formation</p>
            <p className="font-heading font-bold text-lg truncate">{name || '—'}</p>
          </div>
        </div>

        {/* Zahlungspflichtige Person der Formation */}
        <div className="border border-border p-4 mb-5 flex items-start gap-3">
          <span className="w-10 h-10 bg-background border border-border text-text-secondary flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
          </span>
          <div className="min-w-0">
            <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-0.5">Zahlungspflichtige Person</p>
            {isPayer ? (
              <>
                <p className="font-sans text-sm font-medium">{selfName ? `${selfName} (du)` : 'Du'}</p>
                <p className="font-sans text-xs text-text-secondary mt-0.5">Du hast die Formation registriert und bezahlst das Abonnement. Die zahlungspflichtige Person änderst du in den Konto-Einstellungen.</p>
              </>
            ) : (
              <>
                <p className="font-sans text-sm font-medium">{payerName || 'Die Person, die die Formation registriert hat'}</p>
                <p className="font-sans text-xs text-text-secondary mt-0.5">Diese Person bezahlt das Abonnement — für dich fallen keine Kosten an.</p>
              </>
            )}
          </div>
        </div>

        {isPayer && notice && (
          <div className="mb-4 flex items-start justify-between gap-3 bg-accent-gold/10 border border-accent-gold/40 px-4 py-3">
            <p className="font-sans text-xs text-text-secondary leading-relaxed">{notice}</p>
            <button onClick={() => setNotice(null)} aria-label="Hinweis schliessen" className="text-text-secondary hover:text-dark transition-colors flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}

        {isPayer ? (
          /* ── Zahlungspflichtige Person: Mitglieder verwalten & einladen ── */
          <>
            <p className="font-sans text-sm text-text-secondary mb-4 leading-relaxed">
              Mitglied 1 bist du selbst. Für jedes weitere Mitglied hinterlegst du eine E-Mail-Adresse und
              verschickst die Einladung. Eingeladene Personen geben nur ihre persönlichen Daten an und
              erhalten direkten Zugang zur Musikschule. Nur du als zahlungspflichtige Person kannst Mitglieder
              ein- und ausladen.
            </p>

            {/* Mitgliederliste */}
            <div className="space-y-3">
              {members.map((slot, i) =>
                slot.invited ? (
                  <div key={slot.id} className="flex items-center gap-3 border border-border p-4">
                    <div className="w-10 h-10 bg-background border border-border flex items-center justify-center flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 6L2 7" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium truncate">{slot.email}</p>
                      <p className="font-sans text-xs text-text-secondary">Mitglied {i + 2} · Einladung gesendet</p>
                    </div>
                    <span className="font-sans text-[10px] bg-accent-gold/10 text-accent-gold border border-accent-gold/30 px-2 py-0.5 flex-shrink-0">Eingeladen</span>
                    <button
                      onClick={() => setConfirmRemove(slot)}
                      className="font-sans text-xs text-text-secondary hover:text-red-600 transition-colors flex-shrink-0"
                    >
                      Entfernen
                    </button>
                  </div>
                ) : (
                  <div key={slot.id} className="border border-border p-4">
                    <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">
                      E-Mail Mitglied {i + 2}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        value={slot.email}
                        onChange={(e) => setSlotEmail(slot.id, e.target.value)}
                        placeholder="mitglied@email.ch"
                        className="flex-1 border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => sendInvite(slot.id)}
                          disabled={!isValidEmail(slot.email)}
                          className={`font-sans text-sm px-4 py-2.5 transition-colors whitespace-nowrap ${isValidEmail(slot.email) ? 'bg-dark text-white hover:bg-accent-gold hover:text-white' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                        >
                          Einladung senden
                        </button>
                        {slot.email.trim() === '' && members.length > 1 && (
                          <button
                            onClick={() => removeSlot(slot.id)}
                            aria-label="Platz entfernen"
                            title="Platz entfernen"
                            className="w-10 border border-border flex items-center justify-center text-text-secondary hover:border-red-500 hover:text-red-600 transition-colors flex-shrink-0"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                    {slot.email.trim().length > 0 && !isValidEmail(slot.email) && (
                      <p className="font-sans text-xs text-accent-gold mt-1.5">Bitte gib eine gültige E-Mail-Adresse ein.</p>
                    )}
                  </div>
                ),
              )}
              {members.length === 0 && (
                <p className="font-sans text-sm text-text-secondary border border-dashed border-border px-4 py-6 text-center">
                  Noch keine weiteren Mitglieder erfasst. Füge unten eine Person hinzu, um sie einzuladen.
                </p>
              )}
            </div>

            {/* Weiteres Mitglied hinzufügen */}
            <div className="mt-4">
              {members.length < maxOthers && (
                <button
                  onClick={addSlot}
                  className="border border-dashed border-border w-full py-3 font-sans text-sm text-text-secondary hover:border-dark hover:text-dark transition-colors"
                >
                  + Weiteres Mitglied hinzufügen
                </button>
              )}
            </div>
          </>
        ) : (
          /* ── Weitere Mitglieder: nur Lese-Übersicht der Formation ── */
          <>
            <p className="font-sans text-sm text-text-secondary mb-4 leading-relaxed">
              Diese Personen sind unter deiner Formation angemeldet. Mitglieder werden ausschliesslich von der
              zahlungspflichtigen Person ein- und ausgeladen.
            </p>
            <div className="space-y-3">
              {roster.map((r) => (
                <div key={r.key} className="flex items-center gap-3 border border-border p-4">
                  <div className="w-10 h-10 bg-background border border-border flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium truncate">{r.label}</p>
                  </div>
                  {r.role && (
                    <span className="font-sans text-[10px] bg-accent-gold/10 text-accent-gold border border-accent-gold/30 px-2 py-0.5 flex-shrink-0">{r.role}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </SectionCard>

      {/* Bestätigung vor dem Entfernen einer eingeladenen Adresse (nur Payer) */}
      {isPayer && confirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-dark/70" onClick={() => setConfirmRemove(null)} />
          <div className="relative bg-surface border border-border w-full max-w-sm mx-4 p-6 shadow-xl">
            <h3 className="font-heading font-bold text-xl mb-2">E-Mail-Adresse entfernen?</h3>
            <p className="font-sans text-sm text-text-secondary mb-2">
              Möchtest du <span className="font-medium text-dark break-all">{confirmRemove.email}</span> wirklich
              aus deiner Formation entfernen?
            </p>
            <p className="font-sans text-sm text-text-secondary mb-5">
              Das Feld wird danach wieder leer und du kannst eine neue Person einladen.
            </p>
            <div className="flex items-center gap-3 justify-end border-t border-border pt-4">
              <button onClick={() => setConfirmRemove(null)} className="font-sans text-sm text-text-secondary hover:text-dark transition-colors px-4 py-2">
                Abbrechen
              </button>
              <button
                onClick={() => clearInvited(confirmRemove.id)}
                className="bg-red-600 text-white font-sans text-sm px-5 py-2.5 hover:bg-red-700 transition-colors"
              >
                Ja, entfernen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Konto-Einstellungen der zahlungspflichtigen Person — Zahlungspflicht ändern
// ---------------------------------------------------------------------------
function PayerFormationSettings() {
  const [members, setMembers] = useState<FormationMemberSlot[]>([])
  const [selected, setSelected] = useState('')
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    setMembers(readStoredFormation().members)
  }, [])

  // Nur bereits eingeladene Mitglieder kommen als neue zahlungspflichtige Person
  // in Frage (identifiziert über ihre E-Mail-Adresse).
  const invited = members.filter((m) => m.invited && m.email.trim().length > 0)

  const transfer = () => {
    if (!selected) return
    const f = readStoredFormation()
    setStoredFormation({ ...f, payerName: selected })
    // Man selbst ist danach nicht mehr zahlungspflichtig.
    setStoredProfile({ formationPayer: false })
    setConfirm(false)
  }

  return (
    <>
      <SectionCard title="Formation — Zahlungspflicht" desc="Lege fest, wer für deine Formation zahlungspflichtig ist.">
        <div className="bg-accent-gold/5 border border-accent-gold/30 px-4 py-3 mb-5">
          <p className="font-sans text-sm text-text-secondary">
            Als zahlungspflichtige Person bezahlst du das Abonnement der Formation. Nur du kannst weitere
            Mitglieder ein- und ausladen — das machst du in der «Formationsübersicht».
          </p>
        </div>

        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">
          Zahlungspflicht übertragen an
        </label>
        {invited.length === 0 ? (
          <p className="font-sans text-sm text-text-secondary border border-dashed border-border px-4 py-3">
            Lade zuerst in der «Formationsübersicht» ein Mitglied ein. Danach kannst du die Zahlungspflicht an
            dieses Mitglied übertragen.
          </p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="flex-1 border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface"
              >
                <option value="">Mitglied auswählen …</option>
                {invited.map((m) => (
                  <option key={m.id} value={m.email}>{m.email}</option>
                ))}
              </select>
              <button
                onClick={() => setConfirm(true)}
                disabled={!selected}
                className={`font-sans text-sm px-5 py-2.5 transition-colors whitespace-nowrap ${selected ? 'bg-dark text-white hover:bg-accent-gold hover:text-white' : 'bg-border text-text-secondary cursor-not-allowed'}`}
              >
                Als zahlungspflichtig festlegen
              </button>
            </div>
            <p className="font-sans text-xs text-text-secondary mt-2">
              Überträgst du die Zahlungspflicht, bist du selbst nicht mehr zahlungspflichtig und kannst keine
              Mitglieder mehr ein- oder ausladen.
            </p>
          </>
        )}
      </SectionCard>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-dark/70" onClick={() => setConfirm(false)} />
          <div className="relative bg-surface border border-border w-full max-w-sm mx-4 p-6 shadow-xl">
            <h3 className="font-heading font-bold text-xl mb-2">Zahlungspflicht übertragen?</h3>
            <p className="font-sans text-sm text-text-secondary mb-2">
              <span className="font-medium text-dark break-all">{selected}</span> wird die zahlungspflichtige
              Person deiner Formation und übernimmt Abonnement und Mitgliederverwaltung.
            </p>
            <p className="font-sans text-sm text-text-secondary mb-5">
              Du bist danach nicht mehr zahlungspflichtig und kannst keine Mitglieder mehr ein- oder ausladen.
            </p>
            <div className="flex items-center gap-3 justify-end border-t border-border pt-4">
              <button onClick={() => setConfirm(false)} className="font-sans text-sm text-text-secondary hover:text-dark transition-colors px-4 py-2">
                Abbrechen
              </button>
              <button onClick={transfer} className="bg-dark text-white font-sans text-sm px-5 py-2.5 hover:bg-accent-gold hover:text-white transition-colors">
                Ja, übertragen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Main inner component
// ---------------------------------------------------------------------------
function AccountInner() {
  const params = useSearchParams()
  const initial = (params.get('tab') as SectionId) ?? 'konto'
  const [tab, setTab] = useState<SectionId>(SECTIONS.some((s) => s.id === initial) ? initial : 'konto')

  // Die «Formationsübersicht» gibt es nur für Mitglieder einer Formation.
  const profile = useUserProfile()
  const inFormation = profile.inFormation
  // Nicht-zahlungspflichtige Formationsmitglieder müssen kein Zahlungsmittel
  // hinterlegen und verwalten keine Rechnungen — für sie blenden wir die Tabs
  // «Zahlungsmittel» und «Rechnungen & Zahlungen» aus.
  const isNonPayingMember = inFormation && !profile.formationPayer
  const visibleSections = SECTIONS.filter((s) => {
    if (s.id === 'formation' && !inFormation) return false
    if ((s.id === 'zahlungsmittel' || s.id === 'rechnungen') && isNonPayingMember) return false
    return true
  })

  // Ist der gewünschte Tab (noch) nicht sichtbar — z. B. ?tab=formation, während
  // `inFormation` erst nach dem Mount aus dem Profil geladen wird — zeigen wir
  // «Konto & Daten». Sobald die Formationsübersicht verfügbar ist, greift der
  // gewünschte Tab automatisch wieder. So gibt es keinen destruktiven Reset.
  const activeTab: SectionId = visibleSections.some((s) => s.id === tab) ? tab : 'konto'

  // Rechnungen aus dem tatsächlich gewählten Abo ableiten (Free hat keine).
  const abo = useUserAbo()
  const monthlyLabel = `CHF ${aboMonthlyPrice(abo).toFixed(2)}`
  const invoiceDesc = `${aboPlanLabel(abo)} — Monatsabo`
  const invoices = abo.plan === 'none'
    ? []
    : [
        { date: '26. Mai 2026', desc: invoiceDesc, amount: monthlyLabel, status: 'Bezahlt' },
        { date: '26. Apr 2026', desc: invoiceDesc, amount: monthlyLabel, status: 'Bezahlt' },
        { date: '26. Mär 2026', desc: invoiceDesc, amount: monthlyLabel, status: 'Bezahlt' },
      ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-dark text-white px-6 py-3 flex items-center gap-3">
        <Link href="/member/academy" className="font-sans text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Musikschule
        </Link>
        <span className="text-white/30">/</span>
        <span className="font-sans text-sm font-medium">Konto verwalten</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Nav */}
          <nav className="lg:col-span-1">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {visibleSections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTab(s.id)}
                  className={`text-left whitespace-nowrap px-4 py-2.5 font-sans text-sm transition-colors border-l-2 ${activeTab === s.id ? 'border-accent-gold bg-surface text-dark font-medium' : 'border-transparent text-text-secondary hover:text-dark hover:bg-surface'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'konto' && (
              <SectionCard title="Konto & Daten" desc="Deine persönlichen Angaben. Diese sind nur für dich und LAEMU sichtbar.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Vorname" value="Niklaus" />
                  <Field label="Nachname" value="Hess" />
                  <Field label="E-Mail" value="niklaus@laemu.ch" type="email" />
                  <Field label="Telefon" value="+41 79 123 45 67" />
                  <Field label="Geburtsdatum" value="1990-05-14" type="date" />
                  <Field label="Ort" value="Luzern" />
                  <div className="sm:col-span-2"><Field label="Strasse und Hausnummer" value="Musterstrasse 12" /></div>
                </div>
                <div className="flex items-center justify-end mt-6 pt-5 border-t border-border">
                  <button className="bg-dark text-white font-sans text-sm px-5 py-2.5 hover:bg-accent-gold hover:text-white transition-colors">Änderungen speichern</button>
                </div>
              </SectionCard>
            )}

            {activeTab === 'formation' && inFormation && (
              <>
                <FormationOverviewTab
                  formationName={profile.formationName}
                  isPayer={profile.formationPayer}
                  selfName={profile.name}
                />
                {/* Nur die zahlungspflichtige Person kann die Zahlungspflicht ändern. */}
                {profile.formationPayer && <PayerFormationSettings />}
              </>
            )}

            {activeTab === 'abo' && <AboTab />}

            {activeTab === 'rechnungen' && (
              <SectionCard title="Rechnungen & Zahlungen" desc="Deine Zahlungshistorie.">
                {invoices.length === 0 ? (
                  <p className="font-sans text-sm text-text-secondary border border-dashed border-border px-4 py-6 text-center">
                    Mit deinem Free-Account fallen keine Rechnungen an.
                  </p>
                ) : (
                <div className="divide-y divide-border border border-border">
                  {invoices.map((inv, i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-sans text-sm font-medium">{inv.desc}</p>
                        <p className="font-sans text-xs text-text-secondary">{inv.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-sans text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5">{inv.status}</span>
                        <span className="font-sans text-sm font-medium">{inv.amount}</span>
                        <button className="font-sans text-xs text-accent-gold hover:underline">PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </SectionCard>
            )}

            {activeTab === 'zahlungsmittel' && <ZahlungsmittelTab />}

            {activeTab === 'sicherheit' && <SicherheitTab />}

            {activeTab === 'geraete' && <GeraeteTab />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountInner />
    </Suspense>
  )
}
