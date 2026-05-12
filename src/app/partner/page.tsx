'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

type PartnerCategory = 'Alle' | 'Instrumentenbauer' | 'Fachgeschäfte' | 'Musikschulen' | 'Ländlerlokale' | 'Vereine' | 'Stiftungen'

interface Partner {
  name: string
  type: string
  category: PartnerCategory
  location: string
  description: string
  tags: string[]
  contact?: string
  website?: string
  badge?: string
}

const partners: Partner[] = [
  // Instrumentenbauer
  {
    name: 'Harmonika-Atelier Steiner',
    type: 'Instrumentenbauer',
    category: 'Instrumentenbauer',
    location: 'Sursee LU',
    description: 'Fachbetrieb für Handorgeln und Schwyzerörgeli. Reparatur, Stimmung, Neubau und Restaurierung von Volksmusikinstrumenten seit 1978.',
    tags: ['Handorgel', 'Schwyzerörgeli', 'Reparatur', 'Neubau'],
    badge: 'Empfohlen',
  },
  {
    name: 'Akkordeon-Werkstatt Schöni',
    type: 'Instrumentenbauer',
    category: 'Instrumentenbauer',
    location: 'Bern BE',
    description: 'Spezialist für Akkordeon und Handorgeln. Restaurierungen, Stimmarbeiten und Maßanfertigungen für Profimusiker und Hobbyisten.',
    tags: ['Akkordeon', 'Handorgel', 'Restaurierung'],
  },
  {
    name: 'Zupf & Streich Manufaktur',
    type: 'Instrumentenbauer',
    category: 'Instrumentenbauer',
    location: 'Appenzell AI',
    description: 'Handgefertigte Streich- und Zupfinstrumente für die Volksmusik. Geigen, Zithern und Kontrabässe aus der Ostschweizer Werkstatt.',
    tags: ['Geige', 'Zither', 'Kontrabass', 'Handarbeit'],
  },
  // Fachgeschäfte
  {
    name: 'Musikhaus Edelmann',
    type: 'Fachgeschäft',
    category: 'Fachgeschäfte',
    location: 'Schwyz SZ',
    description: 'Das führende Musikfachgeschäft im Kanton Schwyz. Grosse Auswahl an Volksmusikinstrumenten, Noten und Zubehör.',
    tags: ['Instrumente', 'Noten', 'Zubehör'],
    badge: 'Partner',
  },
  {
    name: 'Örgelifachhandel Kälin',
    type: 'Fachgeschäft',
    category: 'Fachgeschäfte',
    location: 'Appenzell AI',
    description: 'Spezialisiert auf Schwyzerörgeli und Appenzeller Volksmusik. Verkauf, Miete und Beratung für Einsteiger und Fortgeschrittene.',
    tags: ['Schwyzerörgeli', 'Miete', 'Beratung'],
  },
  {
    name: 'Notenhaus Volksberg',
    type: 'Fachgeschäft',
    category: 'Fachgeschäfte',
    location: 'Luzern LU',
    description: 'Spezialbuchhandlung für Schweizer Volksmusik-Noten, Lehrwerke und Tondokumente. Grösste Auswahl an Ländler-Noten der Innerschweiz.',
    tags: ['Noten', 'Lehrwerke', 'Volksmusik'],
  },
  // Musikschulen
  {
    name: 'Musikschule Luzern – Volksmusik',
    type: 'Musikschule',
    category: 'Musikschulen',
    location: 'Luzern LU',
    description: 'Die Volksmusik-Abteilung der Musikschule Luzern bietet Einzel- und Gruppenunterricht in Handorgel, Schwyzerörgeli, Kontrabass und Volksgesang.',
    tags: ['Präsenzunterricht', 'Handorgel', 'Schwyzerörgeli', 'Volksgesang'],
  },
  {
    name: 'Ländlermusikschule Schwyz',
    type: 'Musikschule',
    category: 'Musikschulen',
    location: 'Schwyz SZ',
    description: 'Traditionell verankerte Musikschule mit Fokus auf Innerschweizer Ländlermusik. Unterricht für alle Altersgruppen und Niveaus.',
    tags: ['Präsenzunterricht', 'Alle Niveaus', 'Ländlermusik'],
    badge: 'Partner',
  },
  {
    name: 'LAEMU Academy',
    type: 'Online-Musikschule',
    category: 'Musikschulen',
    location: 'Online – Schweizweit',
    description: 'Die digitale Heimat der Schweizer Volksmusik. Video-Kurse, Live-Sessions und Community-Chats mit den besten Lehrpersonen der Szene.',
    tags: ['Online', 'Video-Kurse', 'Live-Sessions', 'Community'],
    badge: 'LAEMU',
  },
  // Ländlerlokale
  {
    name: 'Restaurant Sagi',
    type: 'Ländlerlokal',
    category: 'Ländlerlokale',
    location: 'Haltikon SZ',
    description: 'Rustikales Beizli in Haltikon — Heimat des Handorgelhöcks. Mietbar für Stubetä, Konzerte und Vereinsanlässe. Platz für bis zu 80 Personen.',
    tags: ['Mietbar', 'Stubetä', 'Konzerte', 'Handorgelhöck'],
    badge: 'Empfohlen',
  },
  {
    name: 'Gasthof Adler',
    type: 'Ländlerlokal',
    category: 'Ländlerlokale',
    location: 'Appenzell AI',
    description: 'Traditionsreiches Gasthaus im Appenzellerland. Ideale Bühne für Ländlerkonzerte und Tanzabende. Regelmässige Volksmusikabende.',
    tags: ['Auftrittsmöglichkeit', 'Tanzabend', 'Tradition'],
  },
  {
    name: 'Berggasthaus Hoher Kasten',
    type: 'Ländlerlokal',
    category: 'Ländlerlokale',
    location: 'Appenzell AR',
    description: 'Einzigartiges Ambiente auf dem Hohen Kasten. Exklusive Konzertlocation mit Alpenpanorama — unvergessliche Rahmen für besondere Anlässe.',
    tags: ['Exklusiv', 'Konzertlocation', 'Alpen'],
  },
  {
    name: 'Restaurant Rössli Muotathal',
    type: 'Ländlerlokal',
    category: 'Ländlerlokale',
    location: 'Muotathal SZ',
    description: 'Das Dorfbeizli im Muotathal — Treffpunkt der Urschweizer Volksmusikszene. Mietbar für Vereinsanlässe und intime Stubetä.',
    tags: ['Mietbar', 'Vereinsanlässe', 'Urschweiz'],
  },
  // Vereine
  {
    name: 'Gigäbank Muotathal',
    type: 'Verein',
    category: 'Vereine',
    location: 'Muotathal SZ',
    description: 'Einer der traditionsreichsten Volksmusikvereine der Innerschweiz. Fördert die Ländlermusik im Muotathal durch Konzerte, Ausbildung und Nachwuchsförderung.',
    tags: ['Tradition', 'Nachwuchs', 'Konzerte', 'Innerschweiz'],
    badge: 'Empfohlen',
  },
  {
    name: 'Ländlerklub Innerschwyz',
    type: 'Verein',
    category: 'Vereine',
    location: 'Schwyz SZ',
    description: 'Aktiver Verein mit regelmässigen Proben, Auftritten und geselligen Anlässen. Willkommen sind Musikerinnen und Musiker aller Niveaus.',
    tags: ['Alle Niveaus', 'Gesellig', 'Auftritte'],
  },
  {
    name: 'Appenzellische Volksmusik-Gesellschaft',
    type: 'Verein',
    category: 'Vereine',
    location: 'Appenzell AI',
    description: 'Dachorganisation der appenzellischen Volksmusiker. Koordiniert Anlässe, fördert Nachwuchs und vernetzt die Szene im ganzen Kanton.',
    tags: ['Dachorganisation', 'Vernetzung', 'Appenzell'],
  },
  // Stiftungen
  {
    name: 'Ländlermusik-Stiftung Schweiz',
    type: 'Stiftung',
    category: 'Stiftungen',
    location: 'Zürich ZH',
    description: 'Fördert die Dokumentation, Verbreitung und Entwicklung der Schweizer Ländlermusik. Vergabe von Stipendien und Projektbeiträgen.',
    tags: ['Stipendien', 'Projektbeiträge', 'Förderung'],
    badge: 'Förderstelle',
  },
  {
    name: 'Pro Musica Helvetica',
    type: 'Stiftung',
    category: 'Stiftungen',
    location: 'Bern BE',
    description: 'Nationale Kulturstiftung für Schweizer Volksmusik und traditionelle Künste. Unterstützt Aufnahmen, Tourneen und Bildungsprojekte.',
    tags: ['National', 'Aufnahmen', 'Bildung', 'Tourneen'],
  },
]

const categories: PartnerCategory[] = ['Alle', 'Instrumentenbauer', 'Fachgeschäfte', 'Musikschulen', 'Ländlerlokale', 'Vereine', 'Stiftungen']

const categoryDescriptions: Record<string, string> = {
  Instrumentenbauer: 'Meisterbetriebe für Volksmusik-Instrumente',
  Fachgeschäfte: 'Spezialisierte Musikfachhandlungen',
  Musikschulen: 'Online- und Präsenzunterricht',
  Ländlerlokale: 'Konzertlokale, Beizli & mietbare Räume',
  Vereine: 'Volksmusikvereine & Gesellschaften',
  Stiftungen: 'Förderungen & Kulturbeiträge',
}

export default function PartnerPage() {
  const [activeCategory, setActiveCategory] = useState<PartnerCategory>('Alle')

  const filtered = partners.filter((p) =>
    activeCategory === 'Alle' || p.category === activeCategory
  )

  return (
    <>
      {/* HERO */}
      <section className="bg-dark pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="max-w-3xl">
            <motion.span variants={fadeUp} className="label text-accent-gold">Netzwerk</motion.span>
            <motion.h1 variants={fadeUp} className="font-heading text-6xl md:text-8xl font-bold text-white leading-tight mt-4 mb-6">
              Von und für die Szene.
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans text-xl text-white/60 leading-relaxed max-w-2xl">
              Von Instrumentenbauern über Ländlerlokale bis zu Vereinen und Stiftungen — das LAEMU-Partnernetzwerk verbindet die ganze Schweizer Volksmusikszene.
            </motion.p>
          </Section>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-surface border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-border">
            {categories.slice(1).map((cat) => {
              const count = partners.filter(p => p.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`bg-surface px-4 py-5 text-center hover:bg-background transition-colors group ${activeCategory === cat ? 'bg-background' : ''}`}
                >
                  <p className={`font-heading font-bold text-2xl transition-colors ${activeCategory === cat ? 'text-accent-gold' : 'text-dark group-hover:text-accent-gold'}`}>{count}</p>
                  <p className="font-sans text-xs text-text-secondary mt-1">{cat}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* FILTER */}
      <section className="py-6 bg-background border-b border-border sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-sm px-5 py-2.5 transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-accent-gold text-white'
                    : 'bg-surface border border-border text-text-secondary hover:border-dark'
                }`}
              >
                {cat}
              </button>
            ))}
            <span className="ml-auto font-sans text-sm text-text-secondary whitespace-nowrap flex-shrink-0">
              {filtered.length} Partner
            </span>
          </div>
        </div>
      </section>

      {/* PARTNER GRID */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {activeCategory !== 'Alle' && (
            <div className="mb-10">
              <h2 className="font-heading text-3xl font-bold mb-2">{activeCategory}</h2>
              <p className="font-sans text-text-secondary">{categoryDescriptions[activeCategory]}</p>
            </div>
          )}

          {activeCategory === 'Alle' ? (
            <div className="space-y-16">
              {categories.slice(1).map((cat) => {
                const catPartners = partners.filter(p => p.category === cat)
                return (
                  <Section key={cat}>
                    <motion.div variants={fadeUp} className="flex items-baseline gap-4 mb-6">
                      <h2 className="font-heading text-2xl font-bold">{cat}</h2>
                      <span className="font-sans text-sm text-text-secondary">{categoryDescriptions[cat]}</span>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catPartners.map((partner) => (
                        <motion.div key={partner.name} variants={fadeUp}>
                          <PartnerCard partner={partner} />
                        </motion.div>
                      ))}
                    </div>
                  </Section>
                )
              })}
            </div>
          ) : (
            <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((partner) => (
                <motion.div key={partner.name} variants={fadeUp}>
                  <PartnerCard partner={partner} />
                </motion.div>
              ))}
            </Section>
          )}
        </div>
      </section>

      {/* CTA — Eigenen Partner vorschlagen */}
      <section className="py-24 bg-dark">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <Section>
            <motion.span variants={fadeUp} className="label text-accent-gold">Eintrag beantragen</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mt-3 mb-5">
              Dein Betrieb fehlt noch?
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/60 mb-8">
              Bist du Instrumentenbauer, Musikschule, Lokal oder Verein und möchtest im LAEMU-Netzwerk sichtbar werden? Meld dich bei uns.
            </motion.p>
            <motion.div variants={fadeUp} className="max-w-md mx-auto space-y-3">
              <input
                type="text"
                placeholder="Name / Betrieb"
                className="w-full border border-white/20 bg-white/5 text-white placeholder:text-white/30 px-4 py-3 font-sans text-sm focus:outline-none focus:border-accent-gold"
              />
              <input
                type="email"
                placeholder="E-Mail Adresse"
                className="w-full border border-white/20 bg-white/5 text-white placeholder:text-white/30 px-4 py-3 font-sans text-sm focus:outline-none focus:border-accent-gold"
              />
              <textarea
                rows={3}
                placeholder="Kurze Beschreibung deines Betriebs / Vereins"
                className="w-full border border-white/20 bg-white/5 text-white placeholder:text-white/30 px-4 py-3 font-sans text-sm focus:outline-none focus:border-accent-gold resize-none"
              />
              <button className="w-full bg-accent-gold text-white font-sans font-semibold py-3 hover:bg-white hover:text-dark transition-colors">
                Anfrage senden
              </button>
            </motion.div>
          </Section>
        </div>
      </section>
    </>
  )
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="bg-surface border border-border p-6 hover:border-dark transition-colors group h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-bold text-base group-hover:text-accent-gold transition-colors">{partner.name}</h3>
            {partner.badge && (
              <span className={`font-sans text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap ${
                partner.badge === 'LAEMU' ? 'bg-dark text-white' :
                partner.badge === 'Förderstelle' ? 'bg-muted-green/20 text-muted-green border border-muted-green/30' :
                'bg-accent-gold/10 text-accent-gold border border-accent-gold/30'
              }`}>{partner.badge}</span>
            )}
          </div>
          <p className="font-sans text-xs text-accent-gold">{partner.type}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span className="font-sans text-xs text-text-secondary">{partner.location}</span>
      </div>

      <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4 flex-1">{partner.description}</p>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {partner.tags.map((tag) => (
          <span key={tag} className="font-sans text-xs px-2 py-0.5 bg-background border border-border text-text-secondary">{tag}</span>
        ))}
      </div>
    </div>
  )
}
