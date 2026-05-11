'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
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

const events = [
  {
    id: 1,
    name: 'Ländlerabend Zentralschweiz',
    date: '15. Feb 2025',
    location: 'Schüür, Luzern',
    formation: 'Ländlerkapelle Hess',
    type: 'Konzert',
    img: 'https://images.unsplash.com/photo-1501386761578-eaa54b945b46?w=800&q=80',
  },
  {
    id: 2,
    name: 'Tanzabend Appenzell',
    date: '22. Feb 2025',
    location: 'Landgasthof Säntis, Appenzell',
    formation: 'Trio Alpstein',
    type: 'Tanzabend',
    img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
  },
  {
    id: 3,
    name: 'Frühlingskonzert Rigi',
    date: '08. Mär 2025',
    location: 'Hotel Rigi Kaltbad, Weggis',
    formation: 'Quartett Rigi',
    type: 'Konzert',
    img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=800&q=80',
  },
  {
    id: 4,
    name: 'LAEMU Openair Festival',
    date: '20. Jun 2025',
    location: 'Allmend, Bern',
    formation: 'Verschiedene',
    type: 'Festival',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  },
  {
    id: 5,
    name: 'Hochzeitslive mit Hess',
    date: '12. Jul 2025',
    location: 'Barfüsserkirche, Basel',
    formation: 'Ländlerkapelle Hess',
    type: 'Hochzeit',
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
  },
  {
    id: 6,
    name: 'Dorffest Uri',
    date: '02. Aug 2025',
    location: 'Dorfplatz Altdorf, Uri',
    formation: 'Schwyzerörgeligruppe Uri',
    type: 'Dorffest',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  },
]

const impressionImages = [
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
  'https://images.unsplash.com/photo-1501386761578-eaa54b945b46?w=600&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
]

const typeColors: Record<string, string> = {
  Konzert: 'bg-accent-gold/10 text-accent-gold',
  Tanzabend: 'bg-muted-green/10 text-muted-green',
  Festival: 'bg-purple-100 text-purple-700',
  Hochzeit: 'bg-pink-100 text-pink-700',
  Dorffest: 'bg-blue-100 text-blue-700',
}

const filterTypes = ['Alle', 'Konzert', 'Tanzabend', 'Festival', 'Hochzeit', 'Dorffest']
const regions = ['Alle Regionen', 'Zentralschweiz', 'Appenzell', 'Bern', 'Basel', 'Uri', 'Luzern']

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('Alle')
  const [activeRegion, setActiveRegion] = useState('Alle Regionen')

  const filtered = events.filter((e) => {
    if (activeFilter !== 'Alle' && e.type !== activeFilter) return false
    return true
  })

  return (
    <>
      <Hero
        title={"Erlebe die Musik.\nLive. Nah. Unvergesslich."}
        subtitle="Alle Konzerte, Tanzabende und Festivals der Schweizer Ländlermusik auf einen Blick."
        primaryCta={{ label: 'Events entdecken', href: '#events' }}
        imageSrc="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80"
        size="large"
      />

      {/* FILTERS */}
      <section className="py-12 bg-surface border-b border-border sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-2">Typ</p>
              <div className="flex flex-wrap gap-2">
                {filterTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`font-sans text-sm px-4 py-2 transition-all duration-200 ${
                      activeFilter === type
                        ? 'bg-accent-gold text-white'
                        : 'bg-background text-text-secondary hover:bg-border'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:ml-8">
              <p className="font-sans text-xs uppercase tracking-widest text-text-secondary mb-2">Region</p>
              <select
                value={activeRegion}
                onChange={(e) => setActiveRegion(e.target.value)}
                className="font-sans text-sm px-4 py-2 border border-border bg-background focus:outline-none focus:border-accent-gold"
              >
                {regions.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS GRID */}
      <section id="events" className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((event) => (
              <motion.div key={event.id} variants={fadeUp}>
                <Card hover padding="none" className="overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={event.img} alt={event.name} fill className="object-cover hover:scale-105 transition-transform duration-700" unoptimized />
                    <div className="absolute top-4 left-4 bg-dark/90 text-white px-3 py-1 font-sans text-sm font-medium backdrop-blur-sm">
                      {event.date}
                    </div>
                    <span className={`absolute top-4 right-4 font-sans text-xs px-3 py-1 ${typeColors[event.type] || 'bg-white/80 text-dark'}`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading text-xl font-bold mb-2">{event.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                      <span>📍</span>
                      <span className="font-sans">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                      <span>🎵</span>
                      <span className="font-sans">{event.formation}</span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border">
                      <Button href={`/events`} variant="ghost" size="sm" className="text-accent-gold hover:text-accent-earth">
                        Mehr erfahren →
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* IMPRESSIONS */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Atmosphäre</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Atmosphäre pur.</motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-xl">
              Eindrücke von vergangenen Events.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {impressionImages.map((src, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`relative overflow-hidden ${i === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`}
              >
                <Image src={src} alt={`Event impression ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" unoptimized />
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* ORGANIZER CTA */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Section>
              <Card padding="lg" className="h-full border-2 border-border">
                <motion.span variants={fadeUp} className="label text-accent-gold block mb-4">Für Organisatoren</motion.span>
                <motion.h3 variants={fadeUp} className="heading-sm mb-4">
                  Planst du selber einen Anlass?
                </motion.h3>
                <motion.p variants={fadeUp} className="body-md text-text-secondary mb-8">
                  Finde die passende Formation für deinen Event — ob Hochzeit, Dorffest oder Konzertabend.
                  LAEMU verbindet dich mit den besten Formationen der Schweiz.
                </motion.p>
                <motion.div variants={fadeUp}>
                  <Button href="/formations" variant="primary" size="md">
                    Formation finden
                  </Button>
                </motion.div>
              </Card>
            </Section>
            <Section>
              <Card padding="lg" className="h-full bg-dark border-2 border-accent-gold/30">
                <motion.span variants={fadeUp} className="label text-accent-gold block mb-4">Exklusiv für Mitglieder</motion.span>
                <motion.h3 variants={fadeUp} className="heading-sm text-white mb-4">
                  Exklusive LAEMU Events
                </motion.h3>
                <motion.p variants={fadeUp} className="body-md text-white/60 mb-8">
                  Als LAEMU-Mitglied erhältst du Frühzugang zu exklusiven Events, Backstage-Erlebnissen
                  und unvergesslichen Begegnungen mit deinen Lieblingsmusikern.
                </motion.p>
                <motion.div variants={fadeUp}>
                  <Button href="/community" variant="outline" size="md">
                    Mitglied werden
                  </Button>
                </motion.div>
              </Card>
            </Section>
          </div>
        </div>
      </section>
    </>
  )
}
