'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Constants ───────────────────────────────────────────────────────────────

const TAKTARTEN = ['Schottisch', 'Ländler', 'Walzer', 'Mazurka', 'Polka', 'Schnellpolka', 'Stümpäli', 'Lead', 'Marsch', 'Anderes']
const VOLKSTUEMLICH_TAGS = ['Urchig', 'Modern', 'Konzertant', 'Illgauer Stil', 'Innerschwyzer Stil', 'Berner Stil', 'Büntner Stil', 'Zweistimmig']
const BEKANNTE_TAGS = ['Schlager', 'Kinderlied', 'Weihnachtslied', 'Zweistimmig', 'Pop', 'Rock']
const FORMATION_OPTIONS = ['Solo', 'Duo', 'Trio', 'Quartett', 'Kapelle', 'Grossformation', 'Andere']
const INSTRUMENTS = ['Handorgel', 'Schwyzerörgeli', 'Bass', 'Klavier', 'Trompete', 'Posaune', 'Schlagzeug', 'Andere']
const STUFEN = [2, 3, 4, 5, 6]

const LEHRPERSONEN = [
  { id: 'hansruedi', name: 'Hansruedi Wenger', title: 'Handorgel & Akkordeon', bio: 'Über 20 Jahre Unterrichtserfahrung. Mitglied der Ländlerkapelle Hess.', profileUrl: '/member/profile/hansruedi_wenger' },
  { id: 'seebi', name: 'Seebi Diener', title: 'Schwyzerörgeli & Handorgel', bio: 'Konzertreifer Schwyzerörgelist, Gründungsmitglied der Bodästänix.', profileUrl: '/member/profile/seebi_diener' },
  { id: 'cecile', name: 'Cécile Schmidig', title: 'Klavier & Musiktheorie', bio: 'Klassisch ausgebildet, spezialisiert auf Volksmusik-Arrangements.', profileUrl: '/member/profile/cecile_schmidig' },
  { id: 'cyrill', name: 'Cyrill Rusch', title: 'Bass & Harmonielehre', bio: 'Langjähriger Bassbegleiter und Experte für Zusammenspiel-Techniken.', profileUrl: '/member/profile/cyrill_rusch' },
  { id: 'franz', name: 'Franz Hess', title: 'Klavier & Begleitung', bio: 'Bekannt durch das Hess-Rusch-Hegner Trio. Langjähriger LAEMU-Dozent.', profileUrl: '/member/profile/franz_hess' },
]

// ─── Types ───────────────────────────────────────────────────────────────────

type ArtDesStückes = 'volkstuemlich' | 'bekannte_melodie'
type DifficultyPlan = 'free' | 'starter' | 'pro'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <label className="font-sans text-xs uppercase tracking-widest text-text-secondary block mb-2">{children}</label>
}

function FieldGroup({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="font-sans text-xs text-text-secondary">{hint}</p>}
    </div>
  )
}

function TagButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-sans text-xs px-3 py-1.5 border transition-colors ${active ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
    >
      {label}
    </button>
  )
}

// ─── Auto-tag preview logic ───────────────────────────────────────────────────

function computeAutoTags(opts: {
  instruments: string[]
  difficultyPlan: DifficultyPlan
  taktart: string | null
  artDesStückes: ArtDesStückes[]
  formations: string[]
  notenViolinschluessel: boolean
  notenGriffschrift: boolean
  courseContext?: string
}): string[] {
  const tags: string[] = []
  opts.instruments.forEach(i => tags.push(i))
  if (opts.difficultyPlan === 'starter') tags.push('Starter')
  if (opts.difficultyPlan === 'pro') tags.push('Pro')
  if (opts.difficultyPlan === 'free') tags.push('Free')
  if (opts.taktart) tags.push(opts.taktart)
  if (opts.artDesStückes.includes('volkstuemlich')) tags.push('Volksmusik')
  if (opts.artDesStückes.includes('bekannte_melodie')) tags.push('Bekannte Melodie')
  if (opts.notenViolinschluessel || opts.notenGriffschrift) tags.push('Noten vorhanden')
  if (opts.notenViolinschluessel) tags.push('Violinschlüssel')
  if (opts.notenGriffschrift) tags.push('Griffschrift')
  if (opts.courseContext) tags.push(opts.courseContext)
  return tags.filter((t, i, a) => a.indexOf(t) === i)
}

// ─── Section component ────────────────────────────────────────────────────────

function SectionCard({ num, title, subtitle, children }: { num: number; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background flex items-start gap-4">
        <div className="w-7 h-7 bg-dark text-white flex items-center justify-center font-sans font-bold text-sm flex-shrink-0 mt-0.5">{num}</div>
        <div>
          <p className="font-heading font-bold text-base">{title}</p>
          {subtitle && <p className="font-sans text-xs text-text-secondary mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LernvideoUploadPage() {
  const [title, setTitle] = useState('')
  const [composer, setComposer] = useState('')
  const [artist, setArtist] = useState('')
  const [year, setYear] = useState('')
  const [instruments, setInstruments] = useState<string[]>([])
  const [formations, setFormations] = useState<string[]>([])
  const [lehrpersonen, setLehrpersonen] = useState<string[]>([])
  const [difficultyNum, setDifficultyNum] = useState(3)
  const [difficultyPlan, setDifficultyPlan] = useState<DifficultyPlan>('starter')
  const [stufen, setStufen] = useState(3)
  const [artDesStückes, setArtDesStückes] = useState<ArtDesStückes[]>([])
  const [taktart, setTaktart] = useState<string | null>(null)
  const [styleTags, setStyleTags] = useState<string[]>([])
  const [melodieTags, setMelodieTags] = useState<string[]>([])
  const [notenViolinschluessel, setNotenViolinschluessel] = useState(false)
  const [notenGriffschrift, setNotenGriffschrift] = useState(false)
  const [courseContext, setCourseContext] = useState('Grundlagenkurs')
  const [submitted, setSubmitted] = useState(false)

  const toggleSet = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  const toggleArt = (val: ArtDesStückes) => {
    setArtDesStückes(prev => {
      const next = prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
      // Clear sub-tags if type is deselected
      if (!next.includes('volkstuemlich')) { setStyleTags([]); setTaktart(null) }
      if (!next.includes('bekannte_melodie')) { setMelodieTags([]) }
      return next
    })
  }

  const autoTags = computeAutoTags({ instruments, difficultyPlan, taktart, artDesStückes, formations, notenViolinschluessel, notenGriffschrift, courseContext: courseContext || undefined })

  const allTags = [
    ...autoTags,
    ...styleTags,
    ...melodieTags,
  ].filter((t, i, a) => a.indexOf(t) === i)

  const isValid = !!title && !!composer && instruments.length > 0 && artDesStückes.length > 0

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-surface border border-border p-12 max-w-md text-center">
          <div className="w-16 h-16 bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="font-heading font-bold text-2xl mb-2">Stück erfasst!</h2>
          <p className="font-sans text-sm text-text-secondary mb-6">
            <strong className="text-dark">{title || 'Dein Stück'}</strong> wurde mit allen Metadaten gespeichert. Die Lernvideos können nun verknüpft werden.
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center mb-6">
            {allTags.map(t => (
              <span key={t} className="font-sans text-xs px-2 py-1 bg-accent-gold/10 border border-accent-gold/20 text-accent-gold">{t}</span>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setSubmitted(false)} className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors">Weiteres Stück</button>
            <Link href="/member/academy/lernvideos" className="font-sans text-sm px-4 py-2 bg-dark text-white hover:bg-accent-gold transition-colors">Zur Datenbank →</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-dark text-white px-6 py-4 flex items-center justify-between mt-20">
        <div className="flex items-center gap-4">
          <Link href="/member/academy/lernvideos" className="font-sans text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Datenbank
          </Link>
          <span className="text-white/20">/</span>
          <h1 className="font-heading font-bold text-base">Stück hochladen</h1>
        </div>
        <span className="font-sans text-xs text-white/40 border border-white/20 px-2.5 py-1">Creator-Ansicht</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Intro */}
        <div className="bg-accent-gold/5 border border-accent-gold/20 px-5 py-4">
          <p className="font-sans text-sm text-dark leading-relaxed">
            <strong>Automatisches Tagging:</strong> Gewisse Attribute werden automatisch gesetzt — bspw. trägt ein Video im Handorgel-Grundlagenkurs automatisch die Tags <em>Handorgel</em> und <em>Starter</em>. Erscheint dasselbe Video in mehreren Kursen, erhält es alle entsprechenden Tags und wird über verschiedene Wege gefunden.
          </p>
        </div>

        {/* 1 — Grundinfos */}
        <SectionCard num={1} title="Grundinformationen" subtitle="Name, Komponist, Entstehungsjahr und Lehrperson">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldGroup label="Titel des Stückes *">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="z.B. Dr Alperose" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
            </FieldGroup>
            <FieldGroup label="Komponist *">
              <input value={composer} onChange={e => setComposer(e.target.value)} placeholder="z.B. Willi Valotti" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
            </FieldGroup>
            <FieldGroup label="Bekannt durch (Interpret)">
              <input value={artist} onChange={e => setArtist(e.target.value)} placeholder="z.B. Hess-Rusch-Hegner Trio" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
            </FieldGroup>
            <FieldGroup label="Entstehungsjahr">
              <input value={year} onChange={e => setYear(e.target.value)} placeholder="z.B. 1978" type="number" className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" />
            </FieldGroup>
          </div>

          {/* Lehrperson */}
          <FieldGroup label="Lehrperson(en) *" hint="Welche Lehrperson(en) unterrichtet dieses Stück? Mehrfachauswahl möglich.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LEHRPERSONEN.map(lp => {
                const active = lehrpersonen.includes(lp.id)
                return (
                  <div key={lp.id} className={`border transition-colors ${active ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
                    <button
                      type="button"
                      onClick={() => setLehrpersonen(prev => toggleSet(prev, lp.id))}
                      className="w-full p-3 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`font-heading font-bold text-sm ${active ? 'text-accent-gold' : ''}`}>{lp.name}</p>
                          <p className="font-sans text-xs text-text-secondary">{lp.title}</p>
                        </div>
                        <div className={`w-4 h-4 border flex-shrink-0 mt-0.5 flex items-center justify-center ${active ? 'bg-accent-gold border-accent-gold' : 'border-border'}`}>
                          {active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                      </div>
                    </button>
                    <AnimatePresence>
                      {active && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-3 pb-3 border-t border-accent-gold/20 pt-2.5 flex items-center justify-between gap-3">
                            <p className="font-sans text-xs text-text-secondary leading-snug">{lp.bio}</p>
                            <Link href={lp.profileUrl} className="font-sans text-xs text-accent-gold hover:underline whitespace-nowrap flex-shrink-0">
                              Profil →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </FieldGroup>

          <FieldGroup label="Instrument(e) *" hint="Mehrfachauswahl möglich">
            <div className="flex flex-wrap gap-2">
              {INSTRUMENTS.map(i => (
                <TagButton key={i} label={i} active={instruments.includes(i)} onClick={() => setInstruments(prev => toggleSet(prev, i))} />
              ))}
            </div>
          </FieldGroup>

          <FieldGroup label="Bekannte Formationen" hint="Welche Formationen haben dieses Stück bekannt gemacht? Mehrfachauswahl möglich.">
            <div className="flex flex-wrap gap-2">
              {FORMATION_OPTIONS.map(f => (
                <TagButton key={f} label={f} active={formations.includes(f)} onClick={() => setFormations(prev => toggleSet(prev, f))} />
              ))}
            </div>
          </FieldGroup>
        </SectionCard>

        {/* 2 — Klassifikation */}
        <SectionCard num={2} title="Klassifikation" subtitle="Schwierigkeitsgrad, Abonnementstufe und Harmonielehre-Stufe">
          <FieldGroup label="Schwierigkeit (1–6)">
            <div className="flex items-center gap-4">
              <input type="range" min={1} max={6} value={difficultyNum} onChange={e => setDifficultyNum(Number(e.target.value))} className="flex-1 accent-[#C4973A]" />
              <div className="flex gap-1 flex-shrink-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`w-4 h-4 border ${i < difficultyNum ? 'bg-accent-gold border-accent-gold' : 'border-border'}`} />
                ))}
              </div>
              <span className="font-sans text-sm font-medium w-4 flex-shrink-0">{difficultyNum}</span>
            </div>
          </FieldGroup>

          <FieldGroup label="Abonnementstufe (Plan)" hint="Bestimmt, welche Mitglieder Zugriff haben. Wird automatisch als Tag gesetzt.">
            <div className="flex gap-2">
              {([['free', 'Free', 'Für alle sichtbar'], ['starter', 'Starter', 'Ab Starter-Abo'], ['pro', 'Pro', 'Nur Pro-Abo']] as const).map(([val, label, desc]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDifficultyPlan(val)}
                  className={`flex-1 px-3 py-3 border text-left transition-colors ${difficultyPlan === val ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                >
                  <p className={`font-heading font-bold text-sm ${difficultyPlan === val ? 'text-accent-gold' : ''}`}>{label}</p>
                  <p className="font-sans text-xs text-text-secondary mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup label="Harmonielehre-Stufen" hint="Wie viele Stufen hat dieses Stück? (2 bis 6)">
            <div className="flex gap-2">
              {STUFEN.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStufen(s)}
                  className={`w-12 h-10 border font-sans text-sm font-medium transition-colors ${stufen === s ? 'border-dark bg-dark text-white' : 'border-border hover:border-dark text-text-secondary'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </FieldGroup>
        </SectionCard>

        {/* 3 — Art des Stückes */}
        <SectionCard num={3} title="Art des Stückes" subtitle="Mehrfachauswahl möglich — beides kombiniert erlaubt">
          <p className="font-sans text-xs text-text-secondary -mt-1">Ein Stück kann gleichzeitig volkstümlich und eine bekannte Melodie sein. Beide Typen können ausgewählt werden.</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              ['volkstuemlich', 'Volkstümlich', 'Traditionelle Schweizer Volksmusik — Ländler, Schottisch, Walzer etc.'],
              ['bekannte_melodie', 'Bekannte Melodie', 'Schlager, Pop, Weihnachtslieder, Kinderlieder etc.'],
            ] as const).map(([val, label, desc]) => {
              const active = artDesStückes.includes(val)
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => toggleArt(val)}
                  className={`p-4 border text-left transition-colors ${active ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`font-heading font-bold text-sm ${active ? 'text-accent-gold' : ''}`}>{label}</p>
                    <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center ${active ? 'bg-accent-gold border-accent-gold' : 'border-border'}`}>
                      {active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </div>
                  <p className="font-sans text-xs text-text-secondary leading-snug">{desc}</p>
                </button>
              )
            })}
          </div>

          {/* Volkstümlich sub-section */}
          <AnimatePresence>
            {artDesStückes.includes('volkstuemlich') && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="border border-border bg-background p-5 space-y-5 mt-2">
                  <div className="flex items-center gap-2 mb-0">
                    <div className="w-2 h-2 bg-accent-gold flex-shrink-0" />
                    <p className="font-sans text-xs font-semibold text-accent-gold uppercase tracking-widest">Volkstümlich</p>
                  </div>
                  <div>
                    <Label>Stil-Tags</Label>
                    <p className="font-sans text-xs text-text-secondary mb-3">Mehrere möglich — helfen beim Durchsuchen und Filtern</p>
                    <div className="flex flex-wrap gap-2">
                      {VOLKSTUEMLICH_TAGS.map(t => (
                        <TagButton key={t} label={t} active={styleTags.includes(t)} onClick={() => setStyleTags(prev => toggleSet(prev, t))} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Taktart</Label>
                    <p className="font-sans text-xs text-text-secondary mb-3">Nur eine auswählbar — wird automatisch als Filter-Tag gesetzt</p>
                    <div className="flex flex-wrap gap-2">
                      {TAKTARTEN.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTaktart(prev => prev === t ? null : t)}
                          className={`font-sans text-xs px-3 py-1.5 border transition-colors ${taktart === t ? 'border-dark bg-dark text-white' : 'border-border text-text-secondary hover:border-dark hover:text-dark'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bekannte Melodie sub-section */}
          <AnimatePresence>
            {artDesStückes.includes('bekannte_melodie') && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="border border-border bg-background p-5 mt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-dark flex-shrink-0" />
                    <p className="font-sans text-xs font-semibold text-dark uppercase tracking-widest">Bekannte Melodie</p>
                  </div>
                  <Label>Genre-Tags</Label>
                  <p className="font-sans text-xs text-text-secondary mb-3">Mehrere möglich</p>
                  <div className="flex flex-wrap gap-2">
                    {BEKANNTE_TAGS.map(t => (
                      <TagButton key={t} label={t} active={melodieTags.includes(t)} onClick={() => setMelodieTags(prev => toggleSet(prev, t))} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>

        {/* 4 — Kurs-Kontext (auto-tagging) */}
        <SectionCard num={4} title="Kurs-Kontext" subtitle="Bestimmt, welche Tags automatisch zugewiesen werden">
          <FieldGroup label="In welchem Kurs erscheint dieses Video?" hint="Wenn das Video in mehreren Kursen erscheint, wird es mehrfach verknüpft und erhält alle relevanten Tags automatisch.">
            <select value={courseContext} onChange={e => setCourseContext(e.target.value)} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-surface">
              <option value="Grundlagenkurs">Grundlagenkurs</option>
              <option value="Fortgeschrittenenkurs">Fortgeschrittenenkurs</option>
              <option value="Meisterklasse">Meisterklasse</option>
              <option value="Lernvideo-Datenbank (standalone)">Lernvideo-Datenbank (standalone)</option>
            </select>
          </FieldGroup>
          <p className="font-sans text-xs text-text-secondary bg-background border border-border px-4 py-3">
            Beim Verknüpfen mit einem Kurs wird automatisch das zugehörige Instrument und der Plan-Level getaggt. Ein Video im Handorgel-Starter-Kurs erhält bspw. die Tags <em>Handorgel</em> und <em>Starter</em> — ohne manuelle Eingabe.
          </p>
        </SectionCard>

        {/* 5 — Noten */}
        <SectionCard num={5} title="Noten" subtitle="Welche Notenblätter werden zu diesem Stück hochgeladen?">
          <p className="font-sans text-xs text-text-secondary -mt-1">
            Die Notentypen werden automatisch als Tags gesetzt und sind für Lernende beim Filtern sichtbar — z.B. können Lernende, die nur Violinschlüssel lesen, gezielt nach solchen Stücken filtern.
          </p>
          <div className="space-y-3">
            <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${notenViolinschluessel ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
              <input
                type="checkbox"
                checked={notenViolinschluessel}
                onChange={e => setNotenViolinschluessel(e.target.checked)}
                className="mt-0.5 accent-[#C4973A] w-4 h-4 flex-shrink-0"
              />
              <div>
                <p className={`font-heading font-bold text-sm ${notenViolinschluessel ? 'text-accent-gold' : ''}`}>Violinschlüssel vorhanden</p>
                <p className="font-sans text-xs text-text-secondary mt-0.5">
                  Standardnotation. Für Lernende, die klassische Notation lesen können. Setzt automatisch die Tags <em>Noten vorhanden</em> und <em>Violinschlüssel</em>.
                </p>
              </div>
            </label>
            <label className={`flex items-start gap-4 p-4 border cursor-pointer transition-colors ${notenGriffschrift ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
              <input
                type="checkbox"
                checked={notenGriffschrift}
                onChange={e => setNotenGriffschrift(e.target.checked)}
                className="mt-0.5 accent-[#C4973A] w-4 h-4 flex-shrink-0"
              />
              <div>
                <p className={`font-heading font-bold text-sm ${notenGriffschrift ? 'text-accent-gold' : ''}`}>Griffschrift vorhanden</p>
                <p className="font-sans text-xs text-text-secondary mt-0.5">
                  Griffschrift für Schwyzerörgeli/Handorgel. Für Lernende ohne klassische Notenkenntnisse. Setzt automatisch die Tags <em>Noten vorhanden</em> und <em>Griffschrift</em>.
                </p>
              </div>
            </label>
          </div>
          {(notenViolinschluessel || notenGriffschrift) && (
            <div className="flex flex-wrap gap-1.5">
              <span className="font-sans text-[10px] px-2 py-1 bg-dark text-white">Noten vorhanden</span>
              {notenViolinschluessel && <span className="font-sans text-[10px] px-2 py-1 bg-dark text-white">Violinschlüssel</span>}
              {notenGriffschrift && <span className="font-sans text-[10px] px-2 py-1 bg-dark text-white">Griffschrift</span>}
              <span className="font-sans text-[10px] px-2 py-1 bg-background border border-border text-text-secondary">werden automatisch getaggt</span>
            </div>
          )}
        </SectionCard>

        {/* 6 — Auto-Tag Vorschau */}
        <SectionCard num={6} title="Tag-Vorschau" subtitle="So wird das Stück in der Suchmaschine gefunden">
          <div>
            <p className="font-sans text-xs text-text-secondary mb-3">Automatisch generierte Tags (aus Kurs-Kontext, Instrument, Plan, Taktart, Noten):</p>
            {autoTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {autoTags.map(t => (
                  <span key={t} className="font-sans text-xs px-2.5 py-1 bg-dark text-white">{t}</span>
                ))}
              </div>
            ) : (
              <p className="font-sans text-xs text-text-secondary italic mb-4">— Noch keine Auto-Tags (bitte oben ausfüllen)</p>
            )}
            {(styleTags.length > 0 || melodieTags.length > 0) && (
              <>
                <p className="font-sans text-xs text-text-secondary mb-2">Manuell gesetzte Tags:</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[...styleTags, ...melodieTags].map(t => (
                    <span key={t} className="font-sans text-xs px-2.5 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">{t}</span>
                  ))}
                </div>
              </>
            )}
            {allTags.length > 0 && (
              <>
                <div className="border-t border-border pt-4">
                  <p className="font-sans text-xs font-medium mb-2">Alle Tags zusammen — so erscheint das Stück in Suchergebnissen:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map(t => (
                      <span key={t} className="font-sans text-xs px-2.5 py-1 bg-surface border border-border">{t}</span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </SectionCard>

        {/* Submit */}
        <div className="flex items-center justify-between gap-4 py-2">
          <Link href="/member/academy/lernvideos" className="font-sans text-sm text-text-secondary hover:text-dark transition-colors">
            Abbrechen
          </Link>
          <button
            onClick={() => { if (isValid) setSubmitted(true) }}
            disabled={!isValid}
            className="bg-accent-gold text-white font-sans font-semibold text-sm px-8 py-3 hover:bg-accent-warm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Stück erfassen & Lernvideos verknüpfen →
          </button>
        </div>

        {!isValid && (
          <p className="font-sans text-xs text-text-secondary text-right">
            Pflichtfelder: Titel, Komponist, mind. 1 Instrument, Art des Stückes
          </p>
        )}

      </div>
    </div>
  )
}
