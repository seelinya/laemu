'use client'

import { useState } from 'react'
import {
  INDIVIDUAL_PLAN_ORDER,
  individualPlanMeta,
  individualPricing,
  scopeLabels,
  formationPlanMeta,
  formationYearlyPrice,
  FORMATION_INCLUDED_MEMBERS,
  aboScope,
  aboPlanLabel,
  aboInstrumentsLabel,
  type FormationPlanId,
  type IndividualPlanId,
  type Instrument,
  type Scope,
  type UserAbo,
} from '@/lib/academy'
import { setStoredAbo } from '@/lib/userPlan'

const chf = (n: number) => `CHF ${n.toLocaleString('de-CH')}`

// In der Mitgliedschaft (Musikschule) wählbare Instrumente — identisch zur
// Registrierung, damit ein Upgrade dieselbe Auswahl bietet.
const ABO_INSTRUMENTS = ['Schwyzerörgeli', 'Handorgel', 'Bassgeige'] as const

// Welche Einzel-Pläne sind von einem bestehenden Abo aus erreichbar?
// Free → Starter, Pro, Lernvideodatenbank · Starter → Pro (oder Instrumente
// anpassen) · Lernvideodatenbank → Starter, Pro · Pro → Pro (Instrumente anpassen).
function upgradeTargets(plan: UserAbo['plan']): IndividualPlanId[] {
  switch (plan) {
    case 'none':
      return ['starter', 'pro', 'lernvideo']
    case 'starter':
      return ['starter', 'pro']
    case 'lernvideo':
      return ['starter', 'pro', 'lernvideo']
    case 'pro':
      return ['pro']
  }
}

// Upgrade-/Abo-ändern-Dialog: dieselben Preise & dasselbe Konzept wie der erste
// Schritt der Registrierung — aber als Popup, ohne den Registrationsprozess. Wer
// bereits Zugang zu LAEMU hat, wählt hier sein neues Abo und hinterlegt direkt
// ein Zahlungsmittel.
export function UpgradeDialog({
  abo,
  onClose,
  onUpgraded,
}: {
  abo: UserAbo
  onClose: () => void
  onUpgraded?: (next: UserAbo) => void
}) {
  const targets = upgradeTargets(abo.plan)
  const planChoices = INDIVIDUAL_PLAN_ORDER.filter((p) => targets.includes(p))
  const defaultPlan: IndividualPlanId =
    abo.plan === 'starter' || abo.plan === 'lernvideo' || abo.plan === 'pro' ? 'pro' : 'starter'

  const [step, setStep] = useState<'plan' | 'payment' | 'success'>('plan')
  const [type, setType] = useState<'individual' | 'formation'>('individual')
  const [billing, setBilling] = useState<'yearly' | 'monthly'>('yearly')
  const [plan, setPlan] = useState<IndividualPlanId>(targets.includes(defaultPlan) ? defaultPlan : targets[0])
  const [scope, setScope] = useState<Scope>(abo.plan === 'none' ? '1' : aboScope(abo))
  const [instr, setInstr] = useState<string[]>(() => {
    const seed = abo.allInstruments
      ? [...ABO_INSTRUMENTS]
      : abo.instruments.filter((i) => (ABO_INSTRUMENTS as readonly string[]).includes(i))
    return seed.length > 0 ? seed : ['Handorgel']
  })
  const [formationPlan, setFormationPlan] = useState<FormationPlanId>('pro')
  const [members, setMembers] = useState(3)

  // Zahlungsmittel
  const [payMethod, setPayMethod] = useState<'card' | 'twint'>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [twintPhone, setTwintPhone] = useState('+41 ')

  const [confirmedAbo, setConfirmedAbo] = useState<UserAbo | null>(null)

  const scopeCount = (s: Scope) => (s === 'all' ? ABO_INSTRUMENTS.length : Number(s))
  const hasScope = type === 'individual' && plan !== 'lernvideo' && individualPlanMeta[plan].hasScope
  const periodLabel = type === 'formation' || billing === 'yearly' ? '/ Jahr' : '/ Monat'

  const price = (() => {
    if (type === 'formation') return formationYearlyPrice(formationPlan, members)
    if (plan === 'lernvideo') return individualPricing.lernvideo[billing]
    return individualPricing[plan][scope][billing]
  })()
  const formationExtra = Math.max(0, members - FORMATION_INCLUDED_MEMBERS)

  function toggleInstr(inst: string) {
    setInstr((prev) => {
      if (prev.includes(inst)) return prev.filter((i) => i !== inst)
      const max = scopeCount(scope)
      if (prev.length >= max) return [...prev.slice(1), inst]
      return [...prev, inst]
    })
  }

  function selectScope(s: Scope) {
    setScope(s)
    if (s === 'all') setInstr([...ABO_INSTRUMENTS])
    else setInstr((prev) => prev.slice(0, Number(s)))
  }

  const planStepValid = !(hasScope && instr.length === 0)
  const paymentValid =
    payMethod === 'card'
      ? cardNumber.trim().length >= 12 && cardExp.trim().length >= 4 && cardCvc.trim().length >= 3 && cardHolder.trim().length > 0
      : twintPhone.replace(/\D/g, '').length >= 9

  function buildAbo(): UserAbo {
    if (type === 'formation') {
      return { plan: formationPlan, instruments: [...ABO_INSTRUMENTS] as Instrument[], allInstruments: true }
    }
    if (plan === 'lernvideo') {
      return { plan: 'lernvideo', instruments: [...ABO_INSTRUMENTS] as Instrument[], allInstruments: true }
    }
    return {
      plan,
      instruments: (scope === 'all' ? [...ABO_INSTRUMENTS] : instr) as Instrument[],
      allInstruments: scope === 'all',
    }
  }

  function confirm() {
    const next = buildAbo()
    setStoredAbo(next)
    setConfirmedAbo(next)
    onUpgraded?.(next)
    setStep('success')
  }

  const instrumentsLabel = aboInstrumentsLabel(abo)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="absolute inset-0 bg-dark/70" onClick={onClose} />
      <div className="relative bg-surface border border-border w-full max-w-lg mx-4 shadow-xl">
        {step === 'success' && confirmedAbo ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-accent-gold flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 className="font-heading font-bold text-2xl mb-2">Abo aktiviert</h3>
            <p className="font-sans text-sm text-text-secondary mb-6">
              Dein neuer Plan <strong className="text-dark">{aboPlanLabel(confirmedAbo)}</strong>
              {aboInstrumentsLabel(confirmedAbo) ? <> — {aboInstrumentsLabel(confirmedAbo)}</> : null} ist ab sofort aktiv.
            </p>
            <button onClick={onClose} className="bg-dark text-white font-sans text-sm px-6 py-3 hover:bg-accent-gold transition-colors">
              Fertig
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 sticky top-0 bg-surface">
              <h3 className="font-heading font-bold text-xl">{step === 'plan' ? 'Abo wählen' : 'Zahlung'}</h3>
              <button onClick={onClose} className="text-text-secondary hover:text-dark transition-colors" aria-label="Schliessen">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {step === 'plan' && (
              <div className="p-6">
                <p className="font-sans text-sm text-text-secondary mb-5">
                  Aktuell: <strong className="text-dark">{aboPlanLabel(abo)}</strong>
                  {instrumentsLabel ? <> — {instrumentsLabel}</> : null}. Wähle deinen neuen Plan — gleiche Preise & gleiches Konzept wie bei der Registrierung.
                </p>

                {/* Account type */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {([
                    { id: 'individual', label: 'Einzelperson', desc: 'Für dich allein' },
                    { id: 'formation', label: 'Formation', desc: 'Für deine Gruppe' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setType(opt.id)}
                      className={`p-3 border-2 text-left transition-all ${type === opt.id ? 'border-dark bg-dark/5' : 'border-border bg-surface hover:border-dark'}`}
                    >
                      <p className="font-sans font-semibold text-sm">{opt.label}</p>
                      <p className="font-sans text-xs text-text-secondary">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                {type === 'individual' ? (
                  <>
                    {/* Billing */}
                    <div className="flex items-center justify-center gap-1 mb-5 bg-background border border-border p-1 w-fit mx-auto">
                      {([
                        { id: 'yearly', label: 'Jährlich', hint: '−16 %' },
                        { id: 'monthly', label: 'Monatlich', hint: null },
                      ] as const).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setBilling(opt.id)}
                          className={`px-4 py-2 font-sans text-sm transition-colors flex items-center gap-1.5 ${billing === opt.id ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
                        >
                          {opt.label}
                          {opt.hint && <span className={`font-sans text-[10px] leading-none px-1.5 py-0.5 ${billing === opt.id ? 'bg-accent-gold text-white' : 'bg-accent-gold/15 text-accent-gold'}`}>{opt.hint}</span>}
                        </button>
                      ))}
                    </div>

                    {/* Plan choices */}
                    <div className="space-y-3 mb-5">
                      {planChoices.map((planId) => {
                        const meta = individualPlanMeta[planId]
                        const active = plan === planId
                        const p = planId === 'lernvideo' ? individualPricing.lernvideo[billing] : individualPricing[planId][scope][billing]
                        return (
                          <button
                            key={planId}
                            onClick={() => setPlan(planId)}
                            className={`w-full text-left p-4 border-2 transition-all ${active ? (planId === 'pro' ? 'border-accent-gold bg-accent-gold/5' : 'border-dark bg-dark/5') : 'border-border bg-surface hover:border-dark'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span>{meta.emoji}</span>
                                  <span className="font-sans font-semibold text-sm">{meta.label}</span>
                                  {meta.badge && <span className="font-sans text-[10px] font-bold px-2 py-0.5 bg-accent-gold text-white">{meta.badge}</span>}
                                </div>
                                <p className="font-sans text-xs text-text-secondary leading-relaxed">{meta.desc}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="font-heading font-bold text-lg text-accent-gold">{chf(p)}</span>
                                <span className="font-sans text-xs text-text-secondary block">{periodLabel}</span>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Scope + instruments */}
                    {hasScope && (
                      <div className="bg-background border border-border p-4 mb-5">
                        <h4 className="font-heading font-bold text-sm mb-3">Umfang wählen</h4>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {(['1', '2', '3'] as Scope[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => selectScope(s)}
                              className={`py-2 px-2 font-sans text-xs border transition-colors ${scope === s ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark'}`}
                            >
                              {scopeLabels[s]}
                            </button>
                          ))}
                        </div>
                        <p className="font-sans text-xs text-text-secondary mb-2">
                          Wähle {scopeCount(scope)} {scopeCount(scope) === 1 ? 'Instrument' : 'Instrumente'} ({instr.length}/{scopeCount(scope)})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {ABO_INSTRUMENTS.map((inst) => {
                            const selected = instr.includes(inst)
                            return (
                              <button
                                key={inst}
                                onClick={() => toggleInstr(inst)}
                                className={`font-sans text-sm px-3 py-2 border transition-all ${selected ? 'border-dark bg-dark text-white' : 'border-border bg-surface text-text-secondary hover:border-dark'}`}
                              >
                                {inst}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {plan === 'lernvideo' && (
                      <div className="bg-accent-gold/10 border border-accent-gold/40 p-4 mb-5">
                        <p className="font-sans text-sm font-semibold mb-1">Zugang zur ganzen Lernvideo-Datenbank</p>
                        <p className="font-sans text-xs text-text-secondary leading-relaxed">
                          Du erhältst direkten Zugang zur kompletten Lernvideo-Datenbank — sämtliche Instrumente, ohne Lehrgänge oder Umfang.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Formation members */}
                    <div className="bg-background border border-border p-4 mb-5">
                      <h4 className="font-heading font-bold text-sm mb-1">Anzahl Mitglieder</h4>
                      <p className="font-sans text-xs text-text-secondary mb-3">
                        Gilt für bis zu {FORMATION_INCLUDED_MEMBERS} Mitglieder. Darüber: +10 % pro zusätzlichem Mitglied.
                      </p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setMembers((m) => Math.max(1, m - 1))} className="w-9 h-9 border border-border font-heading font-bold hover:border-dark transition-colors">−</button>
                        <span className="font-heading font-bold text-lg w-10 text-center tabular-nums">{members}</span>
                        <button onClick={() => setMembers((m) => m + 1)} className="w-9 h-9 border border-border font-heading font-bold hover:border-dark transition-colors">+</button>
                        {formationExtra > 0 && <span className="font-sans text-xs text-accent-gold ml-2">+{formationExtra} × 10 % Zuschlag</span>}
                      </div>
                    </div>

                    {/* Formation plans */}
                    <div className="space-y-3 mb-5">
                      {(['pro', 'lernvideo'] as FormationPlanId[]).map((planId) => {
                        const meta = formationPlanMeta[planId]
                        const active = formationPlan === planId
                        const p = formationYearlyPrice(planId, members)
                        return (
                          <button
                            key={planId}
                            onClick={() => setFormationPlan(planId)}
                            className={`w-full text-left p-4 border-2 transition-all ${active ? (planId === 'pro' ? 'border-accent-gold bg-accent-gold/5' : 'border-dark bg-dark/5') : 'border-border bg-surface hover:border-dark'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span>{meta.emoji}</span>
                                  <span className="font-sans font-semibold text-sm">Formation {meta.label}</span>
                                </div>
                                <p className="font-sans text-xs text-text-secondary leading-relaxed">{meta.desc}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="font-heading font-bold text-lg text-accent-gold">{chf(p)}</span>
                                <span className="font-sans text-xs text-text-secondary block">/ Jahr</span>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}

                {/* Price + next */}
                <div className="flex items-center justify-between border-t border-border pt-4 mb-4">
                  <span className="font-sans text-sm text-text-secondary">Neuer Preis</span>
                  <span className="font-heading font-bold text-2xl text-accent-gold">
                    {chf(price)}<span className="font-sans text-sm font-normal text-text-secondary">{periodLabel}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <button onClick={onClose} className="font-sans text-sm text-text-secondary hover:text-dark transition-colors px-4 py-2">Abbrechen</button>
                  <button
                    onClick={() => setStep('payment')}
                    disabled={!planStepValid}
                    className={`font-sans text-sm px-5 py-2.5 transition-colors ${planStepValid ? 'bg-dark text-white hover:bg-accent-gold' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                  >
                    Weiter zur Zahlung →
                  </button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="p-6">
                {/* Auswahl-Zusammenfassung */}
                <div className="bg-accent-gold/10 border border-accent-gold/40 p-4 mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-1">Deine Auswahl</p>
                    <p className="font-sans font-semibold text-sm">
                      {type === 'formation' ? `Formation ${formationPlanMeta[formationPlan].label}` : individualPlanMeta[plan].label}
                    </p>
                    <p className="font-sans text-xs text-text-secondary">
                      {type === 'formation'
                        ? `${members} Mitglied${members !== 1 ? 'er' : ''}`
                        : hasScope
                          ? `${scopeLabels[scope]} · ${(scope === 'all' ? [...ABO_INSTRUMENTS] : instr).join(', ')}`
                          : 'Alle Instrumente'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-heading font-bold text-xl text-accent-gold">{chf(price)}</span>
                    <span className="font-sans text-xs text-text-secondary block">{periodLabel}</span>
                  </div>
                </div>

                <h4 className="font-heading font-bold text-sm mb-1">Zahlungsmittel hinterlegen</h4>
                <p className="font-sans text-xs text-text-secondary mb-4">Dein Zahlungsmittel wird sicher über Stripe verbunden.</p>

                {/* Methodenwahl */}
                <div className="flex gap-2 mb-4">
                  {([
                    { id: 'card', label: 'Kredit- / Debitkarte' },
                    { id: 'twint', label: 'TWINT' },
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`flex-1 py-2 font-sans text-sm border transition-colors ${payMethod === m.id ? 'bg-dark text-white border-dark' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {payMethod === 'card' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Kartennummer</label>
                      <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} inputMode="numeric" placeholder="1234 5678 9012 3456" maxLength={19} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-background" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Ablauf (MM/JJ)</label>
                        <input value={cardExp} onChange={(e) => setCardExp(e.target.value)} placeholder="08/27" maxLength={5} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-background" />
                      </div>
                      <div>
                        <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">CVC</label>
                        <input value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} placeholder="123" maxLength={4} type="password" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-background" />
                      </div>
                    </div>
                    <div>
                      <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Karteninhaber:in</label>
                      <input value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="Name auf der Karte" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-background" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-1.5">Telefonnummer</label>
                      <input value={twintPhone} onChange={(e) => setTwintPhone(e.target.value)} placeholder="+41 79 123 45 67" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-background" />
                    </div>
                    <p className="font-sans text-xs text-text-secondary bg-background border border-border px-3 py-2">
                      Nach dem Abschluss erhältst du eine TWINT-Anfrage auf dein Smartphone zur Bestätigung.
                    </p>
                  </div>
                )}

                <p className="font-sans text-[11px] text-text-secondary leading-relaxed mt-4 flex items-start gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Das Upgrade wird sofort aktiv. Du wirst {periodLabel === '/ Jahr' ? 'jährlich' : 'monatlich'} mit {chf(price)} belastet — jederzeit kündbar.
                </p>

                <div className="flex items-center gap-3 justify-between mt-5 pt-4 border-t border-border">
                  <button onClick={() => setStep('plan')} className="font-sans text-sm text-text-secondary hover:text-dark transition-colors px-4 py-2">← Zurück</button>
                  <button
                    onClick={confirm}
                    disabled={!paymentValid}
                    className={`font-sans text-sm px-5 py-2.5 transition-colors ${paymentValid ? 'bg-accent-gold text-white hover:bg-dark' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                  >
                    Zahlungspflichtig upgraden ✓
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
