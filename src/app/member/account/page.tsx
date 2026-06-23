'use client'

import { Suspense, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  aboPlanLabel,
  aboMonthlyPrice,
  aboInstrumentsLabel,
  type UserAbo,
} from '@/lib/academy'
import { useUserAbo } from '@/lib/userPlan'
import { UpgradeDialog } from '@/components/UpgradeDialog'

const SECTIONS = [
  { id: 'konto', label: 'Konto & Daten' },
  { id: 'abo', label: 'Mein Abo' },
  { id: 'rechnungen', label: 'Rechnungen & Zahlungen' },
  { id: 'zahlungsmittel', label: 'Zahlungsmittel' },
  { id: 'geraete', label: 'Geräte' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

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
              className="bg-dark text-white font-sans text-sm px-5 py-2.5 hover:bg-accent-gold transition-colors"
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
// Main inner component
// ---------------------------------------------------------------------------
function AccountInner() {
  const params = useSearchParams()
  const initial = (params.get('tab') as SectionId) ?? 'konto'
  const [tab, setTab] = useState<SectionId>(SECTIONS.some((s) => s.id === initial) ? initial : 'konto')

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
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTab(s.id)}
                  className={`text-left whitespace-nowrap px-4 py-2.5 font-sans text-sm transition-colors border-l-2 ${tab === s.id ? 'border-accent-gold bg-surface text-dark font-medium' : 'border-transparent text-text-secondary hover:text-dark hover:bg-surface'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {tab === 'konto' && (
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
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
                  <button className="font-sans text-xs text-red-600 hover:underline">Konto löschen</button>
                  <button className="bg-dark text-white font-sans text-sm px-5 py-2.5 hover:bg-accent-gold transition-colors">Änderungen speichern</button>
                </div>
              </SectionCard>
            )}

            {tab === 'abo' && <AboTab />}

            {tab === 'rechnungen' && (
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

            {tab === 'zahlungsmittel' && <ZahlungsmittelTab />}

            {tab === 'geraete' && <GeraeteTab />}
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
