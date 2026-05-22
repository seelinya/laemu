'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Category =
  | 'Formation'
  | 'Instrumentenbauer'
  | 'Fachgeschäft'
  | 'Musikschule'
  | 'Ländlerlokal'
  | 'Verein'
  | 'Stiftung'

type Member = { id: number; name: string; instrument: string; role: string }

type SocialKey = 'website' | 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'spotify'

const CATEGORIES: { id: Category; icon: string; tagline: string; description: string }[] = [
  {
    id: 'Formation',
    icon: '🎼',
    tagline: 'Kapelle, Trio, Duo, Quartett, Chor',
    description: 'Eure Musikgruppe mit Mitgliedern, Besetzung, Repertoire und Auftrittsprofil.',
  },
  {
    id: 'Instrumentenbauer',
    icon: '🔧',
    tagline: 'Werkstatt & Manufaktur',
    description: 'Neubau, Reparatur, Restaurierung und Stimmung von Volksmusikinstrumenten.',
  },
  {
    id: 'Fachgeschäft',
    icon: '🎵',
    tagline: 'Musikfachhandel & Notenshop',
    description: 'Verkauf, Miete und Beratung — Instrumente, Noten, Zubehör.',
  },
  {
    id: 'Musikschule',
    icon: '🎓',
    tagline: 'Präsenz oder Online',
    description: 'Einzel- oder Gruppenunterricht für Volksmusikinstrumente und Gesang.',
  },
  {
    id: 'Ländlerlokal',
    icon: '🏠',
    tagline: 'Beizli, Gasthaus, Konzertlokal',
    description: 'Auftrittsmöglichkeit, mietbare Räume, Stubete-Lokal.',
  },
  {
    id: 'Verein',
    icon: '🤝',
    tagline: 'Musikverein oder Gesellschaft',
    description: 'Mitgliederverein mit regelmässigen Proben, Anlässen und Konzerten.',
  },
  {
    id: 'Stiftung',
    icon: '🌱',
    tagline: 'Förderorganisation',
    description: 'Stipendien, Projektbeiträge und finanzielle Unterstützung für die Szene.',
  },
]

const MUSIKSTILE = ['Traditionell', 'Modern', 'Stimmungs­musik', 'Volksgesang', 'Jodel', 'Innerschweizer Ländler', 'Appenzeller', 'Bündner', 'Jazz-Einflüsse', 'Weltmusik']
const IDEAL_FUER = ['Hochzeiten', 'Dorffeste', 'Stubete', 'Konzerte', 'Tanzabende', 'Firmenanlässe', 'Geburtstage', 'Vereinsanlässe', 'Beerdigungen / Trauerfeiern', 'Öffentliche Anlässe']
const VERFUEGBARKEIT = ['Auf Anfrage', 'Wochenenden', 'Mehrere Termine pro Monat', 'Saisonal', 'Frühzeitig anfragen empfohlen']
const INSTRUMENTS = ['Handorgel', 'Schwyzerörgeli', 'Steirische Harmonika', 'Klavier', 'Kontrabass / Bass', 'Klarinette', 'Violine / Geige', 'Trompete / Flügelhorn', 'Zither', 'Volksgesang', 'Schlagzeug', 'Hackbrett']

const VENUE_TYPES = ['Beizli / Dorfwirtschaft', 'Gasthaus / Restaurant', 'Berggasthaus', 'Konzertlokal', 'Mehrzweckhalle', 'Saal', 'Privatlokal']
const VENUE_USES = ['Stubete', 'Konzert', 'Tanzabend', 'Vereinsanlass', 'Hochzeit', 'Geburtstag', 'Firmenanlass']
const VENUE_FEATURES = ['Bühne vorhanden', 'PA / Tonanlage', 'Bühnenlicht', 'Klavier vorhanden', 'Backstage', 'Parkplätze', 'ÖV-Anschluss', 'Verpflegung möglich']

const BUILDER_SPECIALTIES = ['Handorgel', 'Schwyzerörgeli', 'Akkordeon', 'Steirische Harmonika', 'Streichinstrumente', 'Zupfinstrumente', 'Hackbrett', 'Zither']
const BUILDER_SERVICES = ['Neubau', 'Reparatur', 'Stimmung', 'Restaurierung', 'Maßanfertigung', 'Miete', 'Beratung']

const SHOP_ASSORTMENT = ['Instrumente Verkauf', 'Instrumente Miete', 'Noten / Lehrwerke', 'Tonträger (CD / LP)', 'Zubehör', 'Reparatur / Service', 'Beratung']

const SCHOOL_FORMATS = ['Präsenzunterricht', 'Online-Unterricht', 'Hybrid', 'Workshops', 'Lager / Camps']
const SCHOOL_LEVELS = ['Einsteiger', 'Fortgeschrittene', 'Profi', 'Kinder', 'Jugendliche', 'Erwachsene', 'Senioren']

const VEREIN_ACTIVITIES = ['Regelmässige Proben', 'Konzerte', 'Stubete', 'Anlässe', 'Nachwuchsförderung', 'Kurse', 'Stammtisch']

const STIFTUNG_TYPES = ['Stipendien', 'Projektbeiträge', 'Aufnahme-Unterstützung', 'Tourneeförderung', 'Bildungsprojekte', 'Nachwuchsförderung', 'Forschungsbeiträge']

const HEARD_ABOUT = ['Persönliche Empfehlung', 'Instagram / Social Media', 'Suchmaschine', 'Veranstaltung / Event', 'Presse / Medien', 'LAEMU Community', 'Andere']

const STEP_LABELS = ['Kategorie', 'Grunddaten', 'Details', 'Präsentation', 'Medien', 'Abschluss']

function chip(active: boolean) {
  return `font-sans text-sm px-3 py-2 border transition-all ${
    active ? 'border-dark bg-dark text-white' : 'border-border bg-surface text-text-secondary hover:border-dark'
  }`
}

const inputCls = 'w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-surface transition-colors'
const labelCls = 'label text-text-secondary block mb-1.5'

export default function PartnerAnmeldenPage() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const [category, setCategory] = useState<Category | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pre = params.get('kategorie') as Category | null
    if (pre && CATEGORIES.some((c) => c.id === pre)) {
      setCategory(pre)
      setStep(1)
    }
  }, [])

  // Basisdaten
  const [name, setName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [regions, setRegions] = useState('')
  const [founded, setFounded] = useState('')

  // Social
  const [socials, setSocials] = useState<Record<SocialKey, string>>({
    website: '',
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    spotify: '',
  })

  // Category-specific
  const [members, setMembers] = useState<Member[]>([{ id: 1, name: '', instrument: '', role: '' }])
  const [musikstile, setMusikstile] = useState<string[]>([])
  const [idealFuer, setIdealFuer] = useState<string[]>([])
  const [verfuegbarkeit, setVerfuegbarkeit] = useState<string[]>([])
  const [verfuegbarkeitNote, setVerfuegbarkeitNote] = useState('')
  const [repertoire, setRepertoire] = useState('')

  const [venueType, setVenueType] = useState('')
  const [venueCapacity, setVenueCapacity] = useState('')
  const [venueRentable, setVenueRentable] = useState<'ja' | 'nein' | 'teilweise' | null>(null)
  const [venueUses, setVenueUses] = useState<string[]>([])
  const [venueFeatures, setVenueFeatures] = useState<string[]>([])

  const [builderSpec, setBuilderSpec] = useState<string[]>([])
  const [builderServices, setBuilderServices] = useState<string[]>([])
  const [waitingTime, setWaitingTime] = useState('')

  const [shopAssortment, setShopAssortment] = useState<string[]>([])
  const [shopBrands, setShopBrands] = useState('')

  const [schoolFormats, setSchoolFormats] = useState<string[]>([])
  const [schoolInstruments, setSchoolInstruments] = useState<string[]>([])
  const [schoolLevels, setSchoolLevels] = useState<string[]>([])

  const [vereinActivities, setVereinActivities] = useState<string[]>([])
  const [vereinMembers, setVereinMembers] = useState('')
  const [vereinOpen, setVereinOpen] = useState<'ja' | 'nein' | null>(null)

  const [stiftungTypes, setStiftungTypes] = useState<string[]>([])
  const [stiftungDeadlines, setStiftungDeadlines] = useState('')
  const [stiftungAudience, setStiftungAudience] = useState('')

  // Öffnungszeiten — relevant für Lokal, Bauer, Shop, Schule
  const [hoursMode, setHoursMode] = useState<'standard' | 'termin' | 'custom'>('termin')
  const [hoursCustom, setHoursCustom] = useState('')

  // Präsentation
  const [shortDesc, setShortDesc] = useState('')
  const [longDesc, setLongDesc] = useState('')
  const [uniqueSelling, setUniqueSelling] = useState('')
  const [bookingChannel, setBookingChannel] = useState('')

  // Medien
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [videoFiles, setVideoFiles] = useState<File[]>([])

  // Abschluss
  const [heardAbout, setHeardAbout] = useState('')
  const [notes, setNotes] = useState('')
  const [terms, setTerms] = useState(false)

  const toggle = (list: string[], setList: (l: string[]) => void, val: string) => {
    setList(list.includes(val) ? list.filter((v) => v !== val) : [...list, val])
  }

  const addMember = () => {
    setMembers((prev) => [...prev, { id: Date.now(), name: '', instrument: '', role: '' }])
  }
  const updateMember = (id: number, field: keyof Member, val: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: val } : m)))
  }
  const removeMember = (id: number) => {
    setMembers((prev) => (prev.length > 1 ? prev.filter((m) => m.id !== id) : prev))
  }

  const showVenueFields = category === 'Ländlerlokal'
  const showBuilderFields = category === 'Instrumentenbauer'
  const showShopFields = category === 'Fachgeschäft'
  const showSchoolFields = category === 'Musikschule'
  const showFormationFields = category === 'Formation'
  const showVereinFields = category === 'Verein'
  const showStiftungFields = category === 'Stiftung'
  const showHoursField = showVenueFields || showBuilderFields || showShopFields || showSchoolFields

  const canContinueStep0 = category !== null
  const canContinueStep1 = name.trim() !== '' && contactPerson.trim() !== '' && email.trim() !== ''
  const canSubmit = terms

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-32">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-accent-gold flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-heading text-4xl font-bold mb-4">Anfrage gesendet!</h1>
          <p className="font-sans text-text-secondary leading-relaxed mb-2">
            Vielen Dank für deine Anmeldung im LAEMU-Partnernetzwerk.
          </p>
          <p className="font-sans text-text-secondary leading-relaxed mb-8">
            Wir prüfen deine Angaben innert weniger Tage und melden uns per E-Mail bei dir, sobald dein Profil online ist.
          </p>
          <div className="bg-surface border border-border p-5 text-left mb-8">
            <p className="font-sans text-xs text-text-secondary mb-2">Hast du Bilder oder Videos, die zu gross für den Upload waren?</p>
            <p className="font-sans text-sm">
              Sende sie via{' '}
              <a href="https://wetransfer.com" target="_blank" rel="noopener noreferrer" className="text-accent-gold hover:underline">
                WeTransfer
              </a>{' '}
              an{' '}
              <a href="mailto:info@laemu.ch" className="text-accent-gold hover:underline">
                info@laemu.ch
              </a>{' '}
              — bitte mit Betreff «{name || 'Dein Partnername'}».
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/partner" className="block w-full bg-dark text-white text-center font-sans font-semibold py-4 hover:bg-accent-gold transition-colors">
              Zurück zur Partner-Übersicht
            </Link>
            <Link href="/" className="block w-full bg-surface border border-border text-center font-sans text-sm py-3 hover:border-dark transition-colors">
              Zur Startseite
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-dark py-5 px-6 flex items-center justify-between mt-20">
        <Link href="/" className="font-heading font-bold text-white text-lg tracking-tight">
          LAEMU
        </Link>
        <Link href="/partner" className="font-sans text-xs text-white/50 hover:text-white transition-colors">
          Abbrechen
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-12 overflow-x-auto">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`w-9 h-9 flex items-center justify-center font-heading font-bold text-sm transition-all flex-shrink-0 ${
                    step > i ? 'bg-accent-gold text-white' : step === i ? 'bg-dark text-white' : 'bg-border text-text-secondary'
                  }`}
                >
                  {step > i ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`font-sans text-[10px] md:text-xs mt-2 text-center whitespace-nowrap ${step === i ? 'text-dark font-medium' : 'text-text-secondary'}`}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-px mx-2 md:mx-4 mb-6 transition-colors ${step > i ? 'bg-accent-gold' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0 — Kategorie */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <span className="label text-accent-gold">Partner werden</span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-3">Was möchtest du registrieren?</h1>
              <p className="font-sans text-text-secondary text-sm mb-8 max-w-xl">
                Je nach Kategorie fragen wir später unterschiedliche Angaben ab. Du kannst die Kategorie später noch ändern.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`text-left p-5 border-2 transition-all ${category === c.id ? 'border-accent-gold bg-accent-gold/5' : 'border-border bg-surface hover:border-dark'}`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-base">{c.id}</p>
                        <p className="font-sans text-xs text-accent-gold">{c.tagline}</p>
                      </div>
                    </div>
                    <p className="font-sans text-xs text-text-secondary leading-relaxed">{c.description}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Link href="/partner" className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors">
                  ← Zurück
                </Link>
                <button
                  onClick={() => setStep(1)}
                  disabled={!canContinueStep0}
                  className="flex-1 bg-dark text-white font-sans font-semibold py-4 hover:bg-accent-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Weiter →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1 — Grunddaten */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <span className="label text-accent-gold">{category}</span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-3">Grunddaten</h1>
              <p className="font-sans text-text-secondary text-sm mb-8">Diese Angaben erscheinen im Partner-Eintrag und Kontaktbereich.</p>

              <div className="space-y-5">
                <div>
                  <label className={labelCls}>
                    {showFormationFields ? 'Name der Formation' : 'Name des Betriebs / der Organisation'} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                    placeholder={
                      showFormationFields
                        ? 'z.B. Ländlerkapelle Hess'
                        : showVenueFields
                        ? 'z.B. Restaurant Sagi'
                        : showBuilderFields
                        ? 'z.B. Harmonika-Atelier Steiner'
                        : 'Name eingeben'
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Ansprechperson *</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className={inputCls}
                      placeholder="Vor- und Nachname"
                    />
                    <p className="font-sans text-[11px] text-text-secondary mt-1">An wen dürfen sich Interessierte wenden?</p>
                  </div>
                  <div>
                    <label className={labelCls}>Rolle / Funktion</label>
                    <input
                      type="text"
                      value={bookingChannel}
                      onChange={(e) => setBookingChannel(e.target.value)}
                      className={inputCls}
                      placeholder={showFormationFields ? 'z.B. Kapellmeister' : 'z.B. Inhaber, Geschäftsführerin'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>E-Mail *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="kontakt@beispiel.ch" />
                  </div>
                  <div>
                    <label className={labelCls}>Telefon</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="078 850 87 ..." />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className={labelCls}>Strasse und Hausnummer</label>
                    <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className={inputCls} placeholder="Hauptstrasse 12" />
                  </div>
                  <div>
                    <label className={labelCls}>PLZ</label>
                    <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} className={inputCls} placeholder="6440" />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Ort</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} placeholder="Brunnen" />
                </div>

                <div>
                  <label className={labelCls}>{showFormationFields ? 'Region(en), in denen ihr aktiv seid' : 'Region(en), die ihr abdeckt'}</label>
                  <input
                    type="text"
                    value={regions}
                    onChange={(e) => setRegions(e.target.value)}
                    className={inputCls}
                    placeholder="z.B. Vorderthal SZ, Küssnacht SZ, Gommiswald SG"
                  />
                  <p className="font-sans text-[11px] text-text-secondary mt-1">Mehrere Orte mit Komma trennen. Wird im «Region»-Feld des Eintrags angezeigt.</p>
                </div>

                <div>
                  <label className={labelCls}>{showFormationFields ? 'Gegründet im Jahr' : showVereinFields ? 'Gegründet im Jahr' : 'Gegründet / aktiv seit'}</label>
                  <input type="text" value={founded} onChange={(e) => setFounded(e.target.value)} className={inputCls} placeholder="z.B. 2003" />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(0)} className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors">
                  ← Zurück
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!canContinueStep1}
                  className="flex-1 bg-dark text-white font-sans font-semibold py-4 hover:bg-accent-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Weiter →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Details (Kategorie-spezifisch) */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <span className="label text-accent-gold">{category} — Details</span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-3">Was zeichnet euch aus?</h1>
              <p className="font-sans text-text-secondary text-sm mb-8">Diese Angaben füllen den Steckbrief auf eurem Eintrag.</p>

              <div className="space-y-8">
                {/* ---------------- FORMATION ---------------- */}
                {showFormationFields && (
                  <>
                    <div>
                      <div className="flex items-baseline justify-between mb-3">
                        <label className="label text-text-secondary">Mitglieder der Formation</label>
                        <button onClick={addMember} className="font-sans text-xs text-accent-gold hover:underline">
                          + Mitglied hinzufügen
                        </button>
                      </div>
                      <div className="space-y-3">
                        {members.map((m, idx) => (
                          <div key={m.id} className="border border-border p-4 bg-surface">
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-sans text-xs font-semibold text-text-secondary">Mitglied {idx + 1}</p>
                              {members.length > 1 && (
                                <button onClick={() => removeMember(m.id)} className="font-sans text-xs text-text-secondary hover:text-dark">
                                  Entfernen
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input type="text" value={m.name} onChange={(e) => updateMember(m.id, 'name', e.target.value)} className={inputCls} placeholder="Vor- und Nachname" />
                              <input type="text" value={m.instrument} onChange={(e) => updateMember(m.id, 'instrument', e.target.value)} className={inputCls} placeholder="Instrument" />
                              <input type="text" value={m.role} onChange={(e) => updateMember(m.id, 'role', e.target.value)} className={inputCls} placeholder="Rolle (optional)" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label text-text-secondary block mb-3">Musikstil</label>
                      <div className="flex flex-wrap gap-2">
                        {MUSIKSTILE.map((s) => (
                          <button key={s} onClick={() => toggle(musikstile, setMusikstile, s)} className={chip(musikstile.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label text-text-secondary block mb-3">Ideal für</label>
                      <div className="flex flex-wrap gap-2">
                        {IDEAL_FUER.map((s) => (
                          <button key={s} onClick={() => toggle(idealFuer, setIdealFuer, s)} className={chip(idealFuer.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label text-text-secondary block mb-3">Verfügbarkeit</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {VERFUEGBARKEIT.map((s) => (
                          <button key={s} onClick={() => toggle(verfuegbarkeit, setVerfuegbarkeit, s)} className={chip(verfuegbarkeit.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={verfuegbarkeitNote}
                        onChange={(e) => setVerfuegbarkeitNote(e.target.value)}
                        className={inputCls}
                        placeholder="Ergänzende Hinweise (optional)"
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Repertoire-Beispiele</label>
                      <textarea
                        rows={3}
                        value={repertoire}
                        onChange={(e) => setRepertoire(e.target.value)}
                        className={`${inputCls} resize-none`}
                        placeholder="z.B. Eigenkompositionen, traditionelle Tänze, bekannte Volksmusik-Klassiker"
                      />
                    </div>
                  </>
                )}

                {/* ---------------- LÄNDLERLOKAL ---------------- */}
                {showVenueFields && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Lokaltyp</label>
                        <select value={venueType} onChange={(e) => setVenueType(e.target.value)} className={inputCls}>
                          <option value="">Bitte wählen…</option>
                          {VENUE_TYPES.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Kapazität (Personen)</label>
                        <input type="number" value={venueCapacity} onChange={(e) => setVenueCapacity(e.target.value)} className={inputCls} placeholder="z.B. 80" />
                      </div>
                    </div>

                    <div>
                      <label className="label text-text-secondary block mb-3">Mietbar?</label>
                      <div className="flex flex-wrap gap-2">
                        {(['ja', 'nein', 'teilweise'] as const).map((v) => (
                          <button key={v} onClick={() => setVenueRentable(v)} className={chip(venueRentable === v)}>
                            {v === 'ja' ? 'Ja, mietbar' : v === 'nein' ? 'Nein' : 'Teilweise / auf Anfrage'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label text-text-secondary block mb-3">Ideal für</label>
                      <div className="flex flex-wrap gap-2">
                        {VENUE_USES.map((s) => (
                          <button key={s} onClick={() => toggle(venueUses, setVenueUses, s)} className={chip(venueUses.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="label text-text-secondary block mb-3">Ausstattung</label>
                      <div className="flex flex-wrap gap-2">
                        {VENUE_FEATURES.map((s) => (
                          <button key={s} onClick={() => toggle(venueFeatures, setVenueFeatures, s)} className={chip(venueFeatures.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ---------------- INSTRUMENTENBAUER ---------------- */}
                {showBuilderFields && (
                  <>
                    <div>
                      <label className="label text-text-secondary block mb-3">Spezialisierung</label>
                      <div className="flex flex-wrap gap-2">
                        {BUILDER_SPECIALTIES.map((s) => (
                          <button key={s} onClick={() => toggle(builderSpec, setBuilderSpec, s)} className={chip(builderSpec.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label text-text-secondary block mb-3">Leistungen</label>
                      <div className="flex flex-wrap gap-2">
                        {BUILDER_SERVICES.map((s) => (
                          <button key={s} onClick={() => toggle(builderServices, setBuilderServices, s)} className={chip(builderServices.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Aktuelle Wartezeit</label>
                      <input type="text" value={waitingTime} onChange={(e) => setWaitingTime(e.target.value)} className={inputCls} placeholder="z.B. 4–6 Monate für Neubau" />
                    </div>
                  </>
                )}

                {/* ---------------- FACHGESCHÄFT ---------------- */}
                {showShopFields && (
                  <>
                    <div>
                      <label className="label text-text-secondary block mb-3">Sortiment</label>
                      <div className="flex flex-wrap gap-2">
                        {SHOP_ASSORTMENT.map((s) => (
                          <button key={s} onClick={() => toggle(shopAssortment, setShopAssortment, s)} className={chip(shopAssortment.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Geführte Marken / Hersteller</label>
                      <input type="text" value={shopBrands} onChange={(e) => setShopBrands(e.target.value)} className={inputCls} placeholder="z.B. Salvi, Hohner, Eichler, …" />
                    </div>
                  </>
                )}

                {/* ---------------- MUSIKSCHULE ---------------- */}
                {showSchoolFields && (
                  <>
                    <div>
                      <label className="label text-text-secondary block mb-3">Unterrichtsform</label>
                      <div className="flex flex-wrap gap-2">
                        {SCHOOL_FORMATS.map((s) => (
                          <button key={s} onClick={() => toggle(schoolFormats, setSchoolFormats, s)} className={chip(schoolFormats.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label text-text-secondary block mb-3">Angebotene Instrumente</label>
                      <div className="flex flex-wrap gap-2">
                        {INSTRUMENTS.map((s) => (
                          <button key={s} onClick={() => toggle(schoolInstruments, setSchoolInstruments, s)} className={chip(schoolInstruments.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label text-text-secondary block mb-3">Zielgruppen / Niveaus</label>
                      <div className="flex flex-wrap gap-2">
                        {SCHOOL_LEVELS.map((s) => (
                          <button key={s} onClick={() => toggle(schoolLevels, setSchoolLevels, s)} className={chip(schoolLevels.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ---------------- VEREIN ---------------- */}
                {showVereinFields && (
                  <>
                    <div>
                      <label className="label text-text-secondary block mb-3">Aktivitäten</label>
                      <div className="flex flex-wrap gap-2">
                        {VEREIN_ACTIVITIES.map((s) => (
                          <button key={s} onClick={() => toggle(vereinActivities, setVereinActivities, s)} className={chip(vereinActivities.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Mitgliederzahl (ca.)</label>
                        <input type="text" value={vereinMembers} onChange={(e) => setVereinMembers(e.target.value)} className={inputCls} placeholder="z.B. 45" />
                      </div>
                      <div>
                        <label className="label text-text-secondary block mb-3">Offen für neue Mitglieder?</label>
                        <div className="flex flex-wrap gap-2">
                          {(['ja', 'nein'] as const).map((v) => (
                            <button key={v} onClick={() => setVereinOpen(v)} className={chip(vereinOpen === v)}>
                              {v === 'ja' ? 'Ja' : 'Aktuell nicht'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ---------------- STIFTUNG ---------------- */}
                {showStiftungFields && (
                  <>
                    <div>
                      <label className="label text-text-secondary block mb-3">Förderarten</label>
                      <div className="flex flex-wrap gap-2">
                        {STIFTUNG_TYPES.map((s) => (
                          <button key={s} onClick={() => toggle(stiftungTypes, setStiftungTypes, s)} className={chip(stiftungTypes.includes(s))}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Antragsfristen</label>
                      <input type="text" value={stiftungDeadlines} onChange={(e) => setStiftungDeadlines(e.target.value)} className={inputCls} placeholder="z.B. 31. März und 30. September" />
                    </div>
                    <div>
                      <label className={labelCls}>Zielgruppen</label>
                      <input type="text" value={stiftungAudience} onChange={(e) => setStiftungAudience(e.target.value)} className={inputCls} placeholder="z.B. Junge Musiker:innen unter 30, Profi-Formationen, …" />
                    </div>
                  </>
                )}

                {/* ---------------- ÖFFNUNGSZEITEN ---------------- */}
                {showHoursField && (
                  <div>
                    <label className="label text-text-secondary block mb-3">Öffnungs- / Werkstattzeiten</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {([
                        { id: 'termin', label: 'Termin auf Anfrage' },
                        { id: 'standard', label: 'Reguläre Öffnungszeiten' },
                        { id: 'custom', label: 'Anders / saisonal' },
                      ] as const).map((opt) => (
                        <button key={opt.id} onClick={() => setHoursMode(opt.id)} className={chip(hoursMode === opt.id)}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {hoursMode !== 'termin' && (
                      <textarea
                        rows={3}
                        value={hoursCustom}
                        onChange={(e) => setHoursCustom(e.target.value)}
                        className={`${inputCls} resize-none`}
                        placeholder={
                          hoursMode === 'standard'
                            ? 'z.B. Mo–Fr 09:00–18:30, Sa 09:00–16:00'
                            : 'z.B. April bis Oktober täglich 10:00–22:00, Winterpause'
                        }
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(1)} className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors">
                  ← Zurück
                </button>
                <button onClick={() => setStep(3)} className="flex-1 bg-dark text-white font-sans font-semibold py-4 hover:bg-accent-gold transition-colors">
                  Weiter →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Präsentation + Web/Social */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <span className="label text-accent-gold">Präsentation</span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-3">Wie stellt ihr euch vor?</h1>
              <p className="font-sans text-text-secondary text-sm mb-8">Diese Texte erscheinen direkt im Partner-Eintrag und auf der Detailseite.</p>

              <div className="space-y-7">
                <div>
                  <label className={labelCls}>Kurzbeschreibung *</label>
                  <textarea
                    rows={2}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    maxLength={250}
                    className={`${inputCls} resize-none`}
                    placeholder="Ein bis zwei Sätze für die Übersichtskarte (max. 250 Zeichen)"
                  />
                  <p className="font-sans text-[11px] text-text-secondary mt-1 text-right">{shortDesc.length} / 250</p>
                </div>
                <div>
                  <label className={labelCls}>Ausführliche Beschreibung</label>
                  <textarea
                    rows={5}
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
                    className={`${inputCls} resize-none`}
                    placeholder="Erzähl die Geschichte, Werte und das musikalische Profil — was macht euch besonders?"
                  />
                </div>
                <div>
                  <label className={labelCls}>Was zeichnet euch aus?</label>
                  <textarea
                    rows={3}
                    value={uniqueSelling}
                    onChange={(e) => setUniqueSelling(e.target.value)}
                    className={`${inputCls} resize-none`}
                    placeholder="Spezialitäten, USPs, ungewöhnliche Angebote — was sollte man unbedingt wissen?"
                  />
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-heading font-bold text-lg mb-2">Website & Social Media</h3>
                  <p className="font-sans text-text-secondary text-sm mb-5">Wo seid ihr online präsent? Wir verlinken alle hinterlegten Profile.</p>

                  <div className="space-y-3">
                    {([
                      { key: 'website', label: 'Website', placeholder: 'https://beispiel.ch' },
                      { key: 'instagram', label: 'Instagram', placeholder: '@handle oder URL' },
                      { key: 'facebook', label: 'Facebook', placeholder: 'URL' },
                      { key: 'youtube', label: 'YouTube', placeholder: '@kanal oder URL' },
                      { key: 'tiktok', label: 'TikTok', placeholder: '@handle' },
                      { key: 'spotify', label: 'Spotify', placeholder: 'Artist-URL' },
                    ] as const).map((s) => (
                      <div key={s.key} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-3 items-center">
                        <label className="font-sans text-sm text-text-secondary md:text-right">{s.label}</label>
                        <input
                          type="text"
                          value={socials[s.key]}
                          onChange={(e) => setSocials({ ...socials, [s.key]: e.target.value })}
                          className={inputCls}
                          placeholder={s.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(2)} className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors">
                  ← Zurück
                </button>
                <button onClick={() => setStep(4)} className="flex-1 bg-dark text-white font-sans font-semibold py-4 hover:bg-accent-gold transition-colors">
                  Weiter →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Medien */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <span className="label text-accent-gold">Bilder & Videos</span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-3">Zeigt euch.</h1>
              <p className="font-sans text-text-secondary text-sm mb-8">Wir empfehlen mindestens ein Logo oder Portrait und 3–5 Bilder.</p>

              <div className="space-y-7">
                <FileDropzone
                  label="Logo / Profilbild"
                  hint="Quadratisches Bild, mindestens 400×400 px. JPG oder PNG."
                  accept="image/*"
                  multiple={false}
                  files={logoFile ? [logoFile] : []}
                  onChange={(files) => setLogoFile(files[0] || null)}
                />

                <FileDropzone
                  label={showFormationFields ? 'Portraits & Bandfotos' : 'Bilder vom Betrieb / Lokal'}
                  hint="JPG oder PNG, idealerweise im Querformat. Max. 10 MB pro Datei."
                  accept="image/*"
                  multiple
                  files={photoFiles}
                  onChange={setPhotoFiles}
                />

                <FileDropzone
                  label="Videos"
                  hint="MP4, MOV oder WebM. Max. 50 MB pro Datei."
                  accept="video/*"
                  multiple
                  files={videoFiles}
                  onChange={setVideoFiles}
                />

                <div className="bg-accent-gold/10 border border-accent-gold/30 p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">📦</span>
                    <div>
                      <p className="font-heading font-bold text-sm mb-1">Dateien zu gross für den Upload?</p>
                      <p className="font-sans text-sm text-text-secondary leading-relaxed">
                        Sende deine Bilder und Videos via{' '}
                        <a href="https://wetransfer.com" target="_blank" rel="noopener noreferrer" className="text-accent-gold font-semibold hover:underline">
                          WeTransfer
                        </a>{' '}
                        an{' '}
                        <a href="mailto:info@laemu.ch" className="text-accent-gold font-semibold hover:underline">
                          info@laemu.ch
                        </a>{' '}
                        — bitte mit Betreff «{name || 'Partnername'}».
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(3)} className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors">
                  ← Zurück
                </button>
                <button onClick={() => setStep(5)} className="flex-1 bg-dark text-white font-sans font-semibold py-4 hover:bg-accent-gold transition-colors">
                  Weiter →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5 — Abschluss */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <span className="label text-accent-gold">Letzter Schritt</span>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-3">Fast geschafft.</h1>
              <p className="font-sans text-text-secondary text-sm mb-8">Eine kurze Übersicht — und wenn alles passt, einreichen.</p>

              {/* Zusammenfassung */}
              <div className="bg-surface border border-border p-6 mb-8">
                <p className="font-sans text-xs text-text-secondary mb-3">Vorschau Steckbrief</p>
                <p className="font-heading font-bold text-lg mb-1">{name || '—'}</p>
                <p className="font-sans text-xs text-accent-gold mb-4">{category}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-wider text-text-secondary mb-1">Region</p>
                    <p className="font-sans">{regions || '—'}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-wider text-text-secondary mb-1">Musikstil / Profil</p>
                    <p className="font-sans">
                      {(showFormationFields ? musikstile : showVenueFields ? venueUses : showBuilderFields ? builderSpec : showShopFields ? shopAssortment : showSchoolFields ? schoolFormats : showVereinFields ? vereinActivities : stiftungTypes)
                        .slice(0, 4)
                        .join(', ') || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-wider text-text-secondary mb-1">Ideal für</p>
                    <p className="font-sans">{(showFormationFields ? idealFuer : venueUses).join(', ') || '—'}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-wider text-text-secondary mb-1">Verfügbarkeit</p>
                    <p className="font-sans">{verfuegbarkeit.join(', ') || verfuegbarkeitNote || '—'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-sans text-[11px] uppercase tracking-wider text-text-secondary mb-1">Buchung</p>
                    <p className="font-sans">
                      {email || '—'}
                      {phone && ` · ${phone}`}
                      {contactPerson && ` · ${contactPerson}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Wie hast du von LAEMU erfahren?</label>
                  <select value={heardAbout} onChange={(e) => setHeardAbout(e.target.value)} className={inputCls}>
                    <option value="">Bitte wählen…</option>
                    {HEARD_ABOUT.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Anmerkungen für das LAEMU-Team</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`${inputCls} resize-none`}
                    placeholder="Optional — alles, was du noch loswerden möchtest."
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-accent-gold flex-shrink-0"
                  />
                  <span className="font-sans text-xs text-text-secondary leading-relaxed">
                    Ich bin berechtigt, die hochgeladenen Inhalte (Texte, Bilder, Videos) zu verwenden, und stimme der Veröffentlichung auf LAEMU sowie der{' '}
                    <Link href="/datenschutz" className="text-accent-gold hover:underline">
                      Datenschutzerklärung
                    </Link>{' '}
                    zu.
                  </span>
                </label>
              </div>

              <div className="flex gap-3 mt-10">
                <button onClick={() => setStep(4)} className="px-6 py-4 border border-border font-sans text-sm hover:border-dark transition-colors">
                  ← Zurück
                </button>
                <button
                  onClick={() => setDone(true)}
                  disabled={!canSubmit}
                  className="flex-1 bg-accent-gold text-white font-sans font-semibold py-4 hover:bg-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Anfrage einreichen ✓
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function FileDropzone({
  label,
  hint,
  accept,
  multiple,
  files,
  onChange,
}: {
  label: string
  hint: string
  accept: string
  multiple: boolean
  files: File[]
  onChange: (files: File[]) => void
}) {
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || [])
    onChange(multiple ? [...files, ...list] : list)
  }
  const remove = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <label className="label text-text-secondary block mb-2">{label}</label>
      <label className="block border-2 border-dashed border-border hover:border-accent-gold transition-colors p-6 text-center cursor-pointer bg-surface">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary mx-auto mb-3">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="font-sans text-sm font-medium mb-1">Dateien auswählen oder hierher ziehen</p>
        <p className="font-sans text-xs text-text-secondary">{hint}</p>
        <input type="file" accept={accept} multiple={multiple} onChange={handle} className="hidden" />
      </label>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="flex items-center justify-between border border-border bg-background px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="font-sans text-xs font-medium truncate">{file.name}</p>
                <p className="font-sans text-[11px] text-text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={() => remove(i)} className="font-sans text-xs text-text-secondary hover:text-dark ml-3 flex-shrink-0">
                Entfernen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
