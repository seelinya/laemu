'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Hero } from '@/components/sections/Hero'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

const formations = [
  {
    id: 'hess',
    name: 'Ländlerkapelle Hess',
    region: 'Zentralschweiz',
    style: 'Traditional',
    type: 'Kapelle',
    desc: 'Authentische Ländlermusik aus dem Herzen der Zentralschweiz. Seit über zwei Jahrzehnten ein Garant für unvergessliche Abende.',
    img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
    tags: ['Hochzeiten', 'Konzerte', 'Tanzabende'],
  },
  {
    id: 'alpstein',
    name: 'Trio Alpstein',
    region: 'Appenzell',
    style: 'Innerrhoden Style',
    type: 'Trio',
    desc: 'Das Trio Alpstein verbindet die traditionelle Appenzeller Musik mit zeitgemässen Einflüssen zu einem unverwechselbaren Sound.',
    img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80',
    tags: ['Konzerte', 'Festivals'],
  },
  {
    id: 'rigi',
    name: 'Quartett Rigi',
    region: 'Luzern',
    style: 'Modern Folk',
    type: 'Quartett',
    desc: 'Moderner Folk mit tiefen Wurzeln in der Ländlermusik-Tradition. Das Quartett Rigi überrascht mit frischen Arrangements.',
    img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=800&q=80',
    tags: ['Festivals', 'Konzerte'],
  },
  {
    id: 'schwarzsee',
    name: 'Duo Schwarzsee',
    region: 'Freiburg',
    style: 'Contemporary',
    type: 'Duo',
    desc: 'Ein ungewöhnliches Duo, das zeitgenössische Musik mit volkstümlichen Elementen verschmilzt.',
    img: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&q=80',
    tags: ['Konzerte', 'Hochzeiten'],
  },
  {
    id: 'zugerland',
    name: 'Kapelle Zugerland',
    region: 'Zug',
    style: 'Classical',
    type: 'Kapelle',
    desc: 'Klassische Ländlermusik in reinster Form — die Kapelle Zugerland pflegt das musikalische Erbe mit grösster Sorgfalt.',
    img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80',
    tags: ['Dorffeste', 'Tanzabende'],
  },
  {
    id: 'wallis',
    name: 'Ensemble Wallis',
    region: 'Valais',
    style: 'Modern',
    type: 'Ensemble',
    desc: 'Das vielseitige Ensemble aus dem Wallis bringt Energie und Emotionen in jeden Auftritt.',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    tags: ['Konzerte', 'Festivals', 'Privat'],
  },
  {
    id: 'bern',
    name: 'Jodlerklub Bern',
    region: 'Bern',
    style: 'Traditional',
    type: 'Chor',
    desc: 'Echter Jodel aus der Bundesstadt — der Jodlerklub Bern ist eine Institution der Schweizer Volkskultur.',
    img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
    tags: ['Konzerte', 'Kulturevents'],
  },
  {
    id: 'uri',
    name: 'Schwyzerörgeligruppe Uri',
    region: 'Uri',
    style: 'Traditional',
    type: 'Gruppe',
    desc: 'Die Schwyzerörgeligruppe Uri ist das Herzstück der Urner Volksmusik — rein, ursprünglich und tief berührend.',
    img: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=800&q=80',
    tags: ['Dorffeste', 'Tanzabende', 'Konzerte'],
  },
  {
    id: 'basel',
    name: 'Akkordeonorchester Basel',
    region: 'Basel',
    style: 'Contemporary',
    type: 'Orchester',
    desc: 'Ein Klangkörper der Superlative — das Akkordeonorchester Basel vereint Präzision mit musikalischer Leidenschaft.',
    img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    tags: ['Konzerte', 'Festivals', 'Gala'],
  },
]

const musicStyles = ['Alle', 'Traditional', 'Modern Folk', 'Contemporary', 'Innerrhoden Style', 'Classical', 'Modern']
const formationRegions = ['Alle Regionen', 'Zentralschweiz', 'Appenzell', 'Luzern', 'Freiburg', 'Zug', 'Valais', 'Bern', 'Uri', 'Basel']
const formationTypes = ['Alle Typen', 'Kapelle', 'Trio', 'Quartett', 'Duo', 'Ensemble', 'Chor', 'Gruppe', 'Orchester']

export default function FormationsPage() {
  const [activeStyle, setActiveStyle] = useState('Alle')
  const [activeRegion, setActiveRegion] = useState('Alle Regionen')
  const [activeType, setActiveType] = useState('Alle Typen')

  const filtered = formations.filter((f) => {
    if (activeStyle !== 'Alle' && f.style !== activeStyle) return false
    if (activeRegion !== 'Alle Regionen' && f.region !== activeRegion) return false
    if (activeType !== 'Alle Typen' && f.type !== activeType) return false
    return true
  })

  return (
    <>
      <Hero
        title={"Die Formationen\nder Schweizer\nLändlermusik."}
        subtitle="Entdecke die vielfältige Klangwelt der Schweizer Ländlermusik — von traditionell bis modern."
        primaryCta={{ label: 'Jetzt entdecken', href: '#formations' }}
        imageSrc="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1920&q=80"
        size="large"
      />

      {/* FILTERS */}
      <section className="py-10 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-2">Musikstil</p>
              <div className="flex flex-wrap gap-2">
                {musicStyles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveStyle(s)}
                    className={`font-sans text-sm px-3 py-1.5 transition-all ${activeStyle === s ? 'bg-accent-gold text-white' : 'bg-background text-text-secondary hover:bg-border'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-2">Region</p>
                <select
                  value={activeRegion}
                  onChange={(e) => setActiveRegion(e.target.value)}
                  className="font-sans text-sm px-4 py-2 border border-border bg-background"
                >
                  {formationRegions.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-2">Typ</p>
                <select
                  value={activeType}
                  onChange={(e) => setActiveType(e.target.value)}
                  className="font-sans text-sm px-4 py-2 border border-border bg-background"
                >
                  {formationTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section id="formations" className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="mb-8 flex items-center justify-between">
            <motion.p variants={fadeUp} className="font-sans text-sm text-text-secondary">
              {filtered.length} Formation{filtered.length !== 1 ? 'en' : ''} gefunden
            </motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((f) => (
              <motion.div key={f.id} variants={fadeUp}>
                <Link href={`/formations/${f.id}`}>
                  <motion.div
                    className="group relative overflow-hidden bg-surface border border-border cursor-pointer"
                    whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(0,0,0,0.12)' }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={f.img}
                        alt={f.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="font-sans text-xs px-2 py-1 bg-accent-gold text-white">{f.type}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-xl font-bold group-hover:text-accent-gold transition-colors">{f.name}</h3>
                        <span className="font-sans text-xs px-2 py-1 bg-background border border-border ml-2 whitespace-nowrap">{f.region}</span>
                      </div>
                      <p className="font-sans text-xs text-accent-gold uppercase tracking-wider mb-3">{f.style}</p>
                      <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4">{f.desc}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {f.tags.map((tag) => (
                          <span key={tag} className="font-sans text-xs px-2 py-1 bg-background border border-border text-text-secondary">{tag}</span>
                        ))}
                      </div>
                      <span className="font-sans text-sm text-accent-gold group-hover:text-accent-earth transition-colors">
                        Mehr erfahren →
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.span variants={fadeUp} className="label text-accent-gold">Karte</motion.span>
              <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-6">
                Entdecke Formationen in deiner Nähe.
              </motion.h2>
              <motion.p variants={fadeUp} className="body-lg text-text-secondary mb-8">
                Die Ländlermusik ist überall in der Schweiz zuhause. Finde Formationen aus deiner Region
                und erlebe echte Livemusik vor deiner Haustür.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Button href="/formations" variant="primary" size="md">
                  Interaktive Karte öffnen
                </Button>
              </motion.div>
            </div>
            {/* Placeholder Map */}
            <motion.div
              variants={fadeUp}
              className="relative aspect-square bg-gradient-to-br from-muted-green/10 to-accent-gold/10 border border-border flex items-center justify-center overflow-hidden"
            >
              <div className="text-center p-8">
                <span className="text-8xl block mb-6">🗺️</span>
                <p className="font-serif text-2xl font-bold mb-2">Schweiz</p>
                <p className="font-sans text-sm text-text-secondary">Interaktive Karte</p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {['Zürich', 'Bern', 'Luzern', 'Uri', 'Appenzell', 'Basel'].map((c) => (
                    <span key={c} className="font-sans text-xs px-3 py-1 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                      📍 {c}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* MISSING FORMATION CTA */}
      <section className="py-32 bg-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Section>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mb-6">
              Fehlt deine Formation noch auf LAEMU?
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/60 mb-10">
              Wir laden alle Formationen der Schweizer Ländlermusik ein, sich auf LAEMU zu präsentieren.
              Kostenlos, einfach und mit riesigem Potenzial.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Button href="/contact" variant="primary" size="lg">Formation eintragen</Button>
              <Button href="/contact" variant="outline" size="lg">Mehr erfahren</Button>
            </motion.div>
          </Section>
        </div>
      </section>
    </>
  )
}
