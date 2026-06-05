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

const paymentMethods = [
  { id: 'pm1', type: 'Visa', last4: '4242', exp: '08/27', primary: true },
  { id: 'pm2', type: 'TWINT', last4: '67', exp: '+41 79 ••• •• 67', primary: false },
]

const devices = [
  { id: 'd1', name: 'iPhone 15 — Safari', location: 'Luzern, CH', last: 'Aktiv jetzt', current: true },
  { id: 'd2', name: 'MacBook Pro — Chrome', location: 'Luzern, CH', last: 'vor 2 Stunden', current: false },
  { id: 'd3', name: 'iPad — LAEMU App', location: 'Schwyz, CH', last: 'vor 3 Tagen', current: false },
]

const myPosts = [
  { id: 'p1', text: 'Endlich den Grundlagenkurs Handorgel abgeschlossen! 🪗 Danke an Hansruedi für die super Erklärungen.', time: 'vor 2 Tagen', likes: 14, comments: 3 },
  { id: 'p2', text: 'Wer übt auch gerade «Dr Alperose»? Suche Austausch zur 2. Stimme.', time: 'vor 1 Woche', likes: 8, comments: 6 },
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
                    </div>
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

            {tab === 'abo' && (
              <SectionCard title="Mein Abo" desc="Übersicht deines aktuellen Plans.">
                <div className="border border-border p-5 flex items-start justify-between mb-4">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-wider text-text-secondary mb-1">Aktiver Plan</p>
                    <h3 className="font-heading text-xl font-bold">Starterkurs</h3>
                    <p className="font-sans text-xs text-text-secondary mt-1">Nächste Abrechnung: 26. Juni 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-2xl font-bold text-accent-gold">CHF 79</p>
                    <p className="font-sans text-xs text-text-secondary">/ Monat</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/register" className="bg-accent-gold text-white font-sans text-sm px-5 py-2.5 hover:bg-accent-warm transition-colors">Auf Pro upgraden</Link>
                  <button className="border border-border font-sans text-sm px-5 py-2.5 hover:border-dark transition-colors">Abo kündigen</button>
                </div>
              </SectionCard>
            )}

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

            {tab === 'zahlungsmittel' && (
              <SectionCard title="Zahlungsmittel" desc="Verbundene Zahlungsmittel verwalten.">
                <div className="space-y-3 mb-5">
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="flex items-center gap-4 border border-border p-4">
                      <div className="w-10 h-10 bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-medium">{pm.type} · {pm.last4}</p>
                        <p className="font-sans text-xs text-text-secondary">{pm.exp}</p>
                      </div>
                      {pm.primary && <span className="font-sans text-[10px] bg-accent-gold/10 text-accent-gold border border-accent-gold/30 px-2 py-0.5">Standard</span>}
                      <button className="font-sans text-xs text-text-secondary hover:text-red-600 transition-colors">Entfernen</button>
                    </div>
                  ))}
                </div>
                <button className="border border-dashed border-border w-full py-3 font-sans text-sm text-text-secondary hover:border-dark hover:text-dark transition-colors">+ Zahlungsmittel hinzufügen</button>
              </SectionCard>
            )}

            {tab === 'geraete' && (
              <SectionCard title="Geräte" desc="Geräte, die mit deinem Konto verbunden sind.">
                <div className="space-y-3">
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
                      {!d.current && <button className="font-sans text-xs text-text-secondary hover:text-red-600 transition-colors">Abmelden</button>}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
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
