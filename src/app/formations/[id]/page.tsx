'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

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

const musicians = [
  {
    name: 'Niklaus Hess',
    instrument: 'Handorgel',
    bio: 'Der Gründer der Kapelle und ihr musikalisches Herz. Niklaus spielt seit seinem 12. Lebensjahr Handorgel und hat die Kapelle Hess zu dem gemacht, was sie heute ist.',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    social: '@niklaus_hess',
  },
  {
    name: 'Hans Müller',
    instrument: 'Bass',
    bio: 'Hans sorgt für das solide Fundament des Klangs. Mit seiner warmen Bassstimme gibt er jedem Stück die nötige Tiefe.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    social: '@hans_bass',
  },
  {
    name: 'Peter Keller',
    instrument: 'Klarinette',
    bio: 'Peters melodische Klarinette verleiht der Kapelle ihre charakteristische Leichtigkeit und emotionale Tiefe.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    social: '@peter_klarinette',
  },
  {
    name: 'Anna Kessler',
    instrument: 'Piano',
    bio: 'Anna Kessler ergänzt die Kapelle mit harmonischem Feingefühl und klassischer Ausbildung. Sie verbindet Tradition mit modernem Klang.',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    social: '@anna_piano',
  },
]

const galleryImages = [
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80',
  'https://images.unsplash.com/photo-1501386761578-eaa54b945b46?w=600&q=80',
  'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=600&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
  'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&q=80',
]

const upcomingEvents = [
  { date: '15. Feb 2025', title: 'Ländlerabend Zentralschweiz', location: 'Schüür, Luzern', type: 'Konzert' },
  { date: '08. Mär 2025', title: 'Frühlingskonzert Rigi', location: 'Weggis', type: 'Konzert' },
  { date: '20. Jun 2025', title: 'LAEMU Openair Festival', location: 'Allmend, Bern', type: 'Festival' },
]

const videos = [
  { title: 'Ländlerabend Luzern 2024', duration: '12:43', img: 'https://images.unsplash.com/photo-1501386761578-eaa54b945b46?w=600&q=80' },
  { title: 'Studioaufnahme — Herbstwalzer', duration: '4:22', img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&q=80' },
  { title: 'Live am Dorffest Büron 2024', duration: '28:15', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&q=80' },
]

const infoItems = [
  { label: 'Region', value: 'Zentralschweiz', icon: '📍' },
  { label: 'Musikstil', value: 'Ländlermusik, Traditional', icon: '🎵' },
  { label: 'Verfügbarkeit', value: 'Auf Anfrage', icon: '📅' },
  { label: 'Gegründet', value: '2003', icon: '🗓️' },
  { label: 'Geeignet für', value: 'Hochzeiten, Dorffeste, Konzerte, Tanzabende', icon: '🎉' },
  { label: 'Buchung', value: 'info@laendlerkapelle-hess.ch', icon: '✉️' },
]

const products = [
  { name: 'Kapelle Hess CD Vol. 3', price: 'CHF 25', img: 'https://images.unsplash.com/photo-1511715112108-9acc5b103dfc?w=400&q=80' },
  { name: 'Kapelle Hess T-Shirt', price: 'CHF 35', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
  { name: 'Kapelle Hess Poster', price: 'CHF 20', img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80' },
]

export default function FormationDetailPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1920&q=80"
            alt="Ländlerkapelle Hess"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-wrap gap-3 mb-4">
              {['Zentralschweiz', 'Traditional', 'Verfügbar'].map((tag) => (
                <span key={tag} className="font-sans text-xs px-3 py-1 bg-white/20 text-white backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-bold text-white mb-4">
              Ländlerkapelle Hess
            </h1>
            <p className="font-heading text-2xl italic text-white/70">
              "Musik, die das Herz berührt."
            </p>
          </motion.div>
        </div>
      </section>

      {/* BACK LINK + QUICK INFO */}
      <section className="py-6 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <Link href="/formations" className="font-sans text-sm text-text-secondary hover:text-accent-gold transition-colors">
            ← Zurück zu allen Formationen
          </Link>
          <Button href="#booking" variant="primary" size="sm">
            Jetzt buchen
          </Button>
        </div>
      </section>

      {/* ABOUT + INFO */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Section>
                <motion.span variants={fadeUp} className="label text-accent-gold">Über die Formation</motion.span>
                <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-6">
                  Musik mit Seele seit 2003.
                </motion.h2>
                <motion.p variants={fadeUp} className="body-lg text-text-secondary mb-6 leading-loose">
                  Die Ländlerkapelle Hess ist eine der bekanntesten Formationen der Zentralschweizer Ländlermusik.
                  Gegründet von Niklaus Hess im Jahr 2003, hat sich die Kapelle seither zu einem festen Bestandteil
                  der regionalen Musikszene entwickelt.
                </motion.p>
                <motion.p variants={fadeUp} className="body-md text-text-secondary mb-6 leading-loose">
                  Mit einem Repertoire, das von traditionellen Ländlern über Polkas und Walzer bis hin zu eigenen
                  Kompositionen reicht, begeistert die Kapelle das Publikum immer wieder aufs Neue. Ob bei
                  stimmungsvollen Tanzabenden, festlichen Hochzeiten oder grossen Konzerten —
                  die Ländlerkapelle Hess bringt echte Schweizer Musiktradition zum Leben.
                </motion.p>
                <motion.p variants={fadeUp} className="body-md text-text-secondary leading-loose">
                  Die vier Musikerinnen und Musiker verbindet nicht nur die Leidenschaft für die Musik,
                  sondern auch eine tiefe Freundschaft und gegenseitiger Respekt. Das spürt man in jedem Ton.
                </motion.p>
              </Section>
            </div>
            <div>
              <Section className="space-y-4">
                <motion.h3 variants={fadeUp} className="font-heading font-bold text-lg mb-4">Informationen</motion.h3>
                {infoItems.map((item) => (
                  <motion.div key={item.label} variants={fadeUp} className="flex gap-3 p-4 bg-surface border border-border">
                    <span>{item.icon}</span>
                    <div>
                      <p className="font-sans text-xs uppercase tracking-widest text-text-secondary">{item.label}</p>
                      <p className="font-sans text-sm font-medium mt-0.5">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </Section>
            </div>
          </div>
        </div>
      </section>

      {/* MUSICIANS */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Team</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Die Musiker</motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {musicians.map((m) => (
              <motion.div key={m.name} variants={fadeUp} className="group">
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <Image src={m.img} alt={m.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-sans text-xs text-white/70">{m.social}</span>
                  </div>
                </div>
                <h4 className="font-heading font-bold text-lg mb-1">{m.name}</h4>
                <p className="font-sans text-sm text-accent-gold mb-2">{m.instrument}</p>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">{m.bio}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* AUDIO / VIDEO */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Multimedia</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Hör & sieh uns.</motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {videos.map((v) => (
              <motion.div key={v.title} variants={fadeUp}>
                <div className="relative group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={v.img} alt={v.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent-gold/80 transition-colors duration-300">
                        <span className="text-white text-2xl ml-1">▶</span>
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 font-sans">
                      {v.duration}
                    </div>
                  </div>
                  <div className="p-4 bg-surface border border-border border-t-0">
                    <h4 className="font-sans font-medium text-sm">{v.title}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </Section>
          {/* Audio Player Placeholder */}
          <Section>
            <motion.div variants={fadeUp} className="bg-dark p-6 flex items-center gap-6">
              <div className="w-12 h-12 bg-accent-gold flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">▶</span>
              </div>
              <div className="flex-1">
                <p className="font-sans font-medium text-white text-sm">Herbstwalzer — Ländlerkapelle Hess</p>
                <div className="mt-2 h-1 bg-white/20 relative">
                  <div className="absolute left-0 top-0 h-full bg-accent-gold" style={{ width: '35%' }} />
                </div>
              </div>
              <span className="font-sans text-white/50 text-sm">2:41 / 4:22</span>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="mb-12">
            <motion.span variants={fadeUp} className="label text-accent-gold">Galerie</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-4">Impressionen</motion.h2>
          </Section>
          <Section className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((src, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="relative aspect-square overflow-hidden cursor-pointer group"
              >
                <Image
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section id="booking" className="py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Section>
              <motion.span variants={fadeUp} className="label text-accent-gold">Buchung</motion.span>
              <motion.h2 variants={fadeUp} className="heading-lg text-white mt-3 mb-6">
                Interessiert an einer Buchung?
              </motion.h2>
              <motion.p variants={fadeUp} className="body-lg text-white/60 mb-8">
                Die Ländlerkapelle Hess freut sich über jede Anfrage.
                Ob grosses Festival oder privates Fest — wir spielen mit Herz.
              </motion.p>
              <motion.div variants={fadeUp} className="space-y-4">
                <div className="flex items-center gap-3 text-white/70">
                  <span>✉️</span>
                  <a href="mailto:info@laendlerkapelle-hess.ch" className="font-sans hover:text-accent-gold transition-colors">
                    info@laendlerkapelle-hess.ch
                  </a>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <span>📞</span>
                  <span className="font-sans">+41 41 123 45 67</span>
                </div>
              </motion.div>
            </Section>
            <Section>
              <motion.div variants={fadeUp} className="bg-surface p-8">
                <h3 className="font-heading text-xl font-bold mb-6">Anfrage senden</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label text-text-secondary block mb-2">Name</label>
                    <input type="text" className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-background" placeholder="Dein Name" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-2">E-Mail</label>
                    <input type="email" className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-background" placeholder="deine@email.ch" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-2">Anlass</label>
                    <input type="text" className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-background" placeholder="z.B. Hochzeit, 14. Juni 2025" />
                  </div>
                  <div>
                    <label className="label text-text-secondary block mb-2">Nachricht</label>
                    <textarea rows={3} className="w-full border border-border p-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-background resize-none" placeholder="Erzähl uns mehr..." />
                  </div>
                  <Button variant="primary" size="md" className="w-full" type="submit">
                    Anfrage senden
                  </Button>
                </div>
              </motion.div>
            </Section>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="mb-12">
            <motion.span variants={fadeUp} className="label text-accent-gold">Merchandise</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-4">Kapelle Hess Produkte</motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <motion.div key={p.name} variants={fadeUp}>
                <Card hover padding="none" className="overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    <Image src={p.img} alt={p.name} fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <h4 className="font-sans font-medium text-sm">{p.name}</h4>
                      <p className="font-heading font-bold text-accent-gold mt-1">{p.price}</p>
                    </div>
                    <Button href="/shop" variant="secondary" size="sm">Kaufen</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="mb-12">
            <motion.span variants={fadeUp} className="label text-accent-gold">Termine</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-4">Nächste Auftritte</motion.h2>
          </Section>
          <Section className="space-y-4">
            {upcomingEvents.map((e) => (
              <motion.div key={e.title} variants={fadeUp}>
                <div className="flex items-center gap-6 p-6 bg-background border border-border hover:border-accent-gold transition-colors group cursor-pointer">
                  <div className="min-w-[80px]">
                    <span className="font-heading font-bold text-accent-gold text-sm">{e.date}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-bold group-hover:text-accent-gold transition-colors">{e.title}</h4>
                    <p className="font-sans text-sm text-text-secondary">{e.location}</p>
                  </div>
                  <span className="font-sans text-xs px-3 py-1 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                    {e.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </Section>
          <Section className="mt-8">
            <motion.div variants={fadeUp}>
              <Button href="/events" variant="secondary" size="md">Alle Events ansehen</Button>
            </motion.div>
          </Section>
        </div>
      </section>
    </>
  )
}
