'use client'

import { Suspense, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const SECTIONS = [
  { id: 'konto', label: 'Konto & Daten' },
  { id: 'profil', label: 'Mein Profil' },
  { id: 'beitraege', label: 'Meine Beiträge' },
  { id: 'abo', label: 'Mein Abo' },
  { id: 'rechnungen', label: 'Rechnungen & Zahlungen' },
  { id: 'zahlungsmittel', label: 'Zahlungsmittel' },
  { id: 'geraete', label: 'Geräte' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

const invoices = [
  { date: '26. Mai 2026', desc: 'Starterkurs — Monatsabo', amount: 'CHF 79.00', status: 'Bezahlt' },
  { date: '26. Apr 2026', desc: 'Starterkurs — Monatsabo', amount: 'CHF 79.00', status: 'Bezahlt' },
  { date: '26. Mär 2026', desc: 'Starterkurs — Monatsabo', amount: 'CHF 79.00', status: 'Bezahlt' },
]

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

const myPosts = [
  { id: 'p1', text: 'Endlich den Grundlagenkurs Handorgel abgeschlossen! 🪗 Danke an Hansruedi für die super Erklärungen.', time: 'vor 2 Tagen', likes: 14, comments: 3 },
  { id: 'p2', text: 'Wer übt auch gerade «Dr Alperose»? Suche Austausch zur 2. Stimme.', time: 'vor 1 Woche', likes: 8, comments: 6 },
]

const PLANS = [
  { id: 'starter', name: 'Starterkurs', price: 79, desc: 'Grundlagen, Community-Zugang' },
  { id: 'pro', name: 'Pro', price: 149, desc: 'Alle Kurse, Livecoaching, Downloads' },
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
function WeitereLinks() {
  const [links, setLinks] = useState<{ id: number; label: string; value: string }[]>([])
  const add = () => setLinks((prev) => [...prev, { id: Date.now(), label: '', value: '' }])
  const update = (id: number, key: 'label' | 'value', val: string) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: val } : l)))
  const remove = (id: number) => setLinks((prev) => prev.filter((l) => l.id !== id))

  const inputClass = 'border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface'
  return (
    <div className="mt-4">
      <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">Sonstiges (frei)</label>
      {links.length > 0 && (
        <div className="space-y-2 mb-3">
          {links.map((l) => (
            <div key={l.id} className="flex flex-col sm:flex-row gap-2">
              <input
                value={l.label}
                onChange={(e) => update(l.id, 'label', e.target.value)}
                placeholder="Bezeichnung (z.B. YouTube)"
                className={`${inputClass} sm:w-2/5`}
              />
              <div className="flex gap-2 flex-1 min-w-0">
                <input
                  value={l.value}
                  onChange={(e) => update(l.id, 'value', e.target.value)}
                  placeholder="Link oder Text"
                  className={`${inputClass} flex-1 min-w-0`}
                />
                <button
                  onClick={() => remove(l.id)}
                  aria-label="Entfernen"
                  className="flex-shrink-0 w-10 border border-border text-text-secondary hover:border-red-400 hover:text-red-500 transition-colors flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={add}
        className="flex items-center gap-2 font-sans text-sm text-accent-gold hover:text-dark transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Sonstiges hinzufügen
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Abo Tab
// ---------------------------------------------------------------------------
function AboTab() {
  const [activePlanId, setActivePlanId] = useState<string>('starter')
  const [cancelled, setCancelled] = useState(false)

  // Modal states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string>('starter')
  const [upgradeSuccess, setUpgradeSuccess] = useState(false)

  const [showCancelModal, setShowCancelModal] = useState(false)

  const activePlan = PLANS.find((p) => p.id === activePlanId) ?? PLANS[0]

  // End of current month (today = 2026-06-05, so end = 30. Juni 2026)
  const cancelDateLabel = '30. Juni 2026'

  function openUpgrade() {
    setSelectedPlanId(activePlanId)
    setUpgradeSuccess(false)
    setShowUpgradeModal(true)
  }

  function confirmUpgrade() {
    setActivePlanId(selectedPlanId)
    setCancelled(false)
    setUpgradeSuccess(true)
  }

  function closeUpgradeModal() {
    setShowUpgradeModal(false)
    setUpgradeSuccess(false)
  }

  function confirmCancel() {
    setCancelled(true)
    setShowCancelModal(false)
  }

  function undoCancel() {
    setCancelled(false)
  }

  return (
    <>
      <SectionCard title="Mein Abo" desc="Übersicht deines aktuellen Plans.">
        <div className="border border-border p-5 flex items-start justify-between mb-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-1">Aktiver Plan</p>
            <h3 className="font-heading text-xl font-bold">{activePlan.name}</h3>
            {cancelled ? (
              <p className="font-sans text-xs text-red-600 mt-1 font-medium">Gekündigt — Zugang bis {cancelDateLabel}</p>
            ) : (
              <p className="font-sans text-xs text-text-secondary mt-1">Nächste Abrechnung: 26. Juni 2026</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-heading text-2xl font-bold text-accent-gold">CHF {activePlan.price}</p>
            <p className="font-sans text-xs text-text-secondary">/ Monat</p>
          </div>
        </div>

        {cancelled && (
          <div className="bg-red-50 border border-red-200 px-4 py-3 mb-4 flex items-center justify-between">
            <p className="font-sans text-sm text-red-700">Dein Abo wurde gekündigt. Du hast noch Zugang bis zum {cancelDateLabel}.</p>
            <button onClick={undoCancel} className="font-sans text-xs text-red-700 underline hover:no-underline ml-4 whitespace-nowrap">Kündigung rückgängig machen</button>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={openUpgrade}
            className="bg-accent-gold text-white font-sans text-sm px-5 py-2.5 hover:bg-dark transition-colors"
          >
            Abo ändern
          </button>
          {!cancelled && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="border border-border font-sans text-sm px-5 py-2.5 hover:border-dark transition-colors"
            >
              Abo kündigen
            </button>
          )}
        </div>
      </SectionCard>

      {/* Upgrade / Change plan modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-dark/70" onClick={closeUpgradeModal} />
          <div className="relative bg-surface border border-border w-full max-w-md mx-4 p-6 shadow-xl">
            {upgradeSuccess ? (
              <>
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-1">Abo aktualisiert!</h3>
                  <p className="font-sans text-sm text-text-secondary mb-5">
                    Dein Plan wurde auf <strong>{PLANS.find((p) => p.id === activePlanId)?.name}</strong> geändert.
                  </p>
                  <button onClick={closeUpgradeModal} className="bg-dark text-white font-sans text-sm px-6 py-2.5 hover:bg-accent-gold transition-colors">Schliessen</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-heading font-bold text-xl mb-1">Abo ändern</h3>
                <p className="font-sans text-sm text-text-secondary mb-5">Wähle deinen neuen Plan.</p>

                <div className="space-y-3 mb-6">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`w-full flex items-start justify-between border p-4 text-left transition-colors ${selectedPlanId === plan.id ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-medium text-sm">{plan.name}</span>
                          {plan.id === activePlanId && (
                            <span className="font-sans text-[10px] bg-accent-gold/10 text-accent-gold border border-accent-gold/30 px-1.5 py-0.5">Aktuell</span>
                          )}
                        </div>
                        <p className="font-sans text-xs text-text-secondary mt-0.5">{plan.desc}</p>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <span className="font-heading font-bold text-lg">CHF {plan.price}</span>
                        <span className="font-sans text-xs text-text-secondary block">/ Monat</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 justify-end border-t border-border pt-4">
                  <button onClick={closeUpgradeModal} className="font-sans text-sm text-text-secondary hover:text-dark transition-colors px-4 py-2">Abbrechen</button>
                  <button
                    onClick={confirmUpgrade}
                    disabled={selectedPlanId === activePlanId}
                    className="bg-dark text-white font-sans text-sm px-5 py-2.5 hover:bg-accent-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Abo aktualisieren
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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

            {tab === 'profil' && (
              <SectionCard title="Mein Profil" desc="Diese Angaben sind öffentlich sichtbar, wenn andere Mitglieder auf dein Profil klicken.">
                <div className="space-y-4">
                  <Field label="Anzeigename" value="Niklaus Hess" />
                  <div>
                    <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Bio</label>
                    <textarea defaultValue="Handorgelist aus Luzern, leidenschaftlich für Ländlermusik." rows={3} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface resize-none" />
                  </div>
                  <Field label="Instrumente" value="Handorgel, Schwyzerörgeli" />
                  <div className="border-t border-border pt-4">
                    <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-3">Öffentlich geteilte Kontakt-Infos</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="WhatsApp (optional)" value="" />
                      <Field label="Instagram (optional)" value="niklaus.oergeli" />
                      <Field label="Facebook (optional)" value="" />
                      <Field label="TikTok (optional)" value="" />
                    </div>
                    <WeitereLinks />
                    <label className="flex items-center gap-2 mt-4 font-sans text-sm cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-accent-gold w-4 h-4" />
                      Offen für Formationen
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
                  <Link href="/member/profile" className="font-sans text-sm text-accent-gold hover:text-dark transition-colors">Öffentliches Profil ansehen →</Link>
                  <button className="bg-dark text-white font-sans text-sm px-5 py-2.5 hover:bg-accent-gold transition-colors">Profil speichern</button>
                </div>
              </SectionCard>
            )}

            {tab === 'beitraege' && (
              <SectionCard title="Meine Beiträge" desc="Deine Beiträge in der LAEMU Community.">
                <div className="space-y-3">
                  {myPosts.map((p) => (
                    <div key={p.id} className="border border-border p-4">
                      <p className="font-sans text-sm text-dark leading-relaxed mb-3">{p.text}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 font-sans text-xs text-text-secondary">
                          <span>♥ {p.likes}</span>
                          <span>💬 {p.comments}</span>
                          <span>{p.time}</span>
                        </div>
                        <button className="font-sans text-xs text-text-secondary hover:text-red-600 transition-colors">Löschen</button>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/member/community" className="mt-4 inline-block font-sans text-sm text-accent-gold hover:text-dark transition-colors">Zur Community →</Link>
              </SectionCard>
            )}

            {tab === 'abo' && <AboTab />}

            {tab === 'rechnungen' && (
              <SectionCard title="Rechnungen & Zahlungen" desc="Deine Zahlungshistorie.">
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
