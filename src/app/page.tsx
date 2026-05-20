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
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const ecosystemItems = [
  { icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  ), title: 'Community', subtitle: 'Verbinde dich', desc: 'Triff Gleichgesinnte, teile deine Musik und wachse mit einer leidenschaftlichen Community.', href: '/community' },
  { icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  ), title: 'Musikschule', subtitle: 'Lerne & wachse', desc: 'Online-Kurse von den Besten der Szene — für Anfänger bis Profis, ohne Notenkenntnisse.', href: '/musikschule' },
  { icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ), title: 'Events', subtitle: 'Erlebe live', desc: 'Entdecke Konzerte, Tanzabende und Festivals in deiner Region.', href: '/events' },
  { icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
  ), title: 'Formationen', subtitle: 'Entdecke Bands', desc: 'Durchstöbere die vielfältige Landschaft der Schweizer Ländlermusik-Formationen.', href: '/formations' },
  { icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
  ), title: 'Streaming', subtitle: 'Höre & schaue', desc: 'Die beste Ländlermusik — kuratiert und immer griffbereit.', href: '/' },
  { icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
  ), title: 'Shop', subtitle: 'Trage die Kultur', desc: 'Exklusives LAEMU-Merchandise und Produkte aus der Szene.', href: '/shop' },
  { icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
  ), title: 'Instrumente', subtitle: 'Spielzeug für die Seele', desc: 'Alles über Handorgel, Schwyzerörgeli, Klarinette und mehr.', href: '/musikschule' },
  { icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ), title: 'Musikkultur', subtitle: 'Tradition trifft Zukunft', desc: 'LAEMU bewahrt das Erbe und öffnet Türen in eine moderne Zukunft.', href: '/mission' },
]

const stats = [
  { value: '500+', label: 'Formationen' },
  { value: '50+', label: 'Lehrpersonen' },
  { value: "10'000+", label: 'Fans' },
  { value: '200+', label: 'Events' },
]

const supporters = [
  { name: 'Seebi Diener', instrument: 'Bass / Schwyzerörgeli', img: '/images/seebi-diener.jpg' },
  { name: 'Cyrill Rusch', instrument: 'Schwyzerörgeli', img: '/images/cyrill-rusch.jpg' },
  { name: 'Cécile Schmidig', instrument: 'Handorgel', img: '/images/cecile-schmidig.jpg' },
  { name: 'Franz Hess', instrument: 'Klavier', img: '/images/franz-hess.jpg' },
  { name: 'Simon Rusch', instrument: 'Handorgel', img: '/images/simon-rusch.jpg' },
  { name: 'Simon Lüthi', instrument: 'Handorgel / Schwyzerörgeli', img: '/images/simon-luethi.jpg' },
]

const formations = [
  { name: 'Ländlerkapelle Hess', region: 'Zentralschweiz', style: 'Traditional', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80', id: 'hess' },
  { name: 'Trio Alpstein', region: 'Appenzell', style: 'Innerrhoden Style', img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80', id: 'alpstein' },
  { name: 'Quartett Rigi', region: 'Luzern', style: 'Modern Folk', img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=800&q=80', id: 'rigi' },
]

const products = [
  { name: 'LAEMU Hoodie Black', price: 'CHF 79', img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80' },
  { name: 'LAEMU T-Shirt White', price: 'CHF 39', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
  { name: 'LAEMU Cap', price: 'CHF 49', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80' },
  { name: 'LAEMU Tote Bag', price: 'CHF 29', img: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80' },
]

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80"
            alt="Live music concert"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <motion.div
            className="max-w-4xl pt-32 pb-20"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              className="inline-block font-sans text-xs uppercase tracking-[0.3em] text-accent-gold mb-6"
            >
              Am Puls der Ländlermusik
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-8 whitespace-pre-line"
            >
              {"Am Puls der\nLändlermusik."}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="font-sans text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mb-12"
            >
              LAEMU entfacht das volle Potenzial der Ländlermusik – als starke, inspirierende und modern gelebte Kultur.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Button href="/community" variant="primary" size="lg">
                Jetzt entdecken
              </Button>
              <Button href="/mission" variant="outline" size="lg">
                Über LAEMU
              </Button>
            </motion.div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
          <motion.div
            className="w-px h-14 bg-gradient-to-b from-white/40 to-transparent"
            animate={{ scaleY: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* ECOSYSTEM */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Das Ökosystem</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-5">
              Ein Zuhause für eine ganze Kultur.
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-2xl mx-auto">
              LAEMU verbindet alles, was die Ländlermusik lebendig macht.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ecosystemItems.map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <Link href={item.href}>
                  <motion.div
                    className="group bg-white border border-border p-6 h-full cursor-pointer hover:bg-background transition-colors"
                    whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="block mb-4 text-dark group-hover:text-accent-gold transition-colors">{item.icon}</span>
                    <h3 className="font-heading text-lg font-bold mb-1 group-hover:text-accent-gold transition-colors">{item.title}</h3>
                    <p className="font-sans text-xs uppercase tracking-[0.15em] text-accent-gold mb-3 font-medium">{item.subtitle}</p>
                    <p className="font-sans text-sm font-light text-text-secondary leading-relaxed">{item.desc}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* WHY LAEMU */}
      <section className="py-32 bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Section>
              <motion.span variants={fadeUp} className="label text-accent-gold">Warum LAEMU</motion.span>
              <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-8">
                Warum LAEMU?
              </motion.h2>
              <motion.p variants={fadeUp} className="body-lg text-text-secondary mb-10 leading-relaxed">
                Die Ländlermusik ist das Herzstück der Schweizer Kultur — lebendig, emotional und tief verwurzelt.
                Doch in einer digitalen Welt braucht auch eine traditionsreiche Kultur ein modernes Zuhause.
                LAEMU schafft genau das: eine Plattform, die Tradition ehrt und Zukunft ermöglicht.
              </motion.p>
              <motion.div variants={stagger} className="space-y-6">
                {[
                  {
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
                    title: 'Authentisch',
                    text: 'Keine Kompromisse. LAEMU steht für echte Musik, echte Menschen, echte Leidenschaft.'
                  },
                  {
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
                    title: 'Gemeinschaft',
                    text: 'Von der Szene, für die Szene. Wir schaffen Verbindungen, die zählen.'
                  },
                  {
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
                    title: 'Zukunftsorientiert',
                    text: 'Modern gedacht, traditionell verwurzelt — für die nächste Generation der Ländlermusik.'
                  },
                ].map((item) => (
                  <motion.div key={item.title} variants={fadeUp} className="flex gap-4">
                    <span className="flex-shrink-0 mt-1 text-accent-gold">{item.icon}</span>
                    <div>
                      <h4 className="font-heading font-bold text-lg mb-1">{item.title}</h4>
                      <p className="font-sans font-light text-text-secondary text-sm">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </Section>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-[4/5] overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1000&q=80"
                  alt="Swiss folk musician"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-8 -left-8 bg-accent-gold p-6 max-w-[240px]"
              >
                <p className="font-heading text-white text-lg font-bold italic">
                  "Musik, die Generationen verbindet."
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* MOVEMENT / STATS */}
      <section className="py-32 bg-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Die Bewegung</motion.span>
            <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mt-4 mb-8 max-w-4xl mx-auto">
              Die Ländlermusik verdient eine Bühne für die Zukunft.
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/60 max-w-2xl mx-auto">
              LAEMU ist mehr als eine Plattform — es ist eine Bewegung. Gemeinsam schaffen wir den Raum,
              den diese Musik seit Jahrzehnten verdient.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center border border-white/10 p-8"
              >
                <div className="font-heading text-4xl md:text-5xl font-bold text-accent-gold mb-2">
                  {stat.value}
                </div>
                <div className="font-sans text-sm uppercase tracking-widest text-white/50">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* SUPPORTERS */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Bekannte Gesichter</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-5">
              Bekannte Gesichter der Szene.
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-xl mx-auto">
              Musikerinnen und Musiker, die LAEMU unterstützen und mitgestalten.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {supporters.map((person) => (
              <motion.div
                key={person.name}
                variants={fadeUp}
                className="group text-center"
              >
                <motion.div
                  className="relative aspect-square overflow-hidden mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={person.img}
                    alt={person.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:saturate-[1.2] group-hover:contrast-[1.05] transition-all duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <h4 className="font-heading font-bold text-sm">{person.name}</h4>
                <p className="font-sans text-xs text-text-secondary mt-1">{person.instrument}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* FORMATIONS TEASER */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <motion.span variants={fadeUp} className="label text-accent-gold">Die Szene</motion.span>
              <motion.h2 variants={fadeUp} className="heading-lg mt-3">
                Entdecke die Szene.
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Button href="/formations" variant="secondary" size="md">
                Alle Formationen →
              </Button>
            </motion.div>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formations.map((f) => (
              <motion.div key={f.id} variants={fadeUp}>
                <Link href={`/formations/${f.id}`}>
                  <motion.div
                    className="group relative overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={f.img}
                        alt={f.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <div className="flex gap-2 mb-2">
                          <span className="font-sans text-xs px-2 py-1 bg-accent-gold/90 text-white">{f.style}</span>
                          <span className="font-sans text-xs px-2 py-1 bg-white/20 text-white backdrop-blur-sm">{f.region}</span>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-white">{f.name}</h3>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* MERCHANDISE TEASER */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Lifestyle</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">
              Trage die Bewegung.
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary">
              LAEMU Lifestyle — Swiss Folk Culture
            </motion.p>
          </Section>
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {products.map((p) => (
              <motion.div key={p.name} variants={fadeUp}>
                <Card hover padding="none" className="overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-sans font-medium text-sm mb-1">{p.name}</h4>
                    <p className="font-heading font-bold text-accent-gold">{p.price}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Section>
          <Section className="text-center">
            <motion.div variants={fadeUp}>
              <Button href="/shop" variant="primary" size="lg">Zum Shop</Button>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Die Gründer</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mt-3 mb-4">
              Zwei Stärken. Eine gemeinsame Mission.
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/50 max-w-2xl mx-auto">
              Hinter dem Beginn von LAEMU stehen Niklaus und Selina — derselben Überzeugung: Für die LAEndlerMUsik kann und soll etwas Grosses entstehen.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'Niklaus Hess',
                role: 'Co-Founder',
                bio: 'Als leidenschaftlicher Volksmusikant tief in der Szene verwurzelt. Niklaus bringt die ursprüngliche Vision von LAEMU mit — und will die Schweizer Ländlermusik verbinden und neue Chancen für die Volksmusikszene schaffen.',
                img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
              },
              {
                name: 'Selina Strickler',
                role: 'Co-Founder',
                bio: 'Selina bringt ein feines Gespür für Branding, Marketing und digitale Lösungen ein. Begeistert von der Natürlichkeit, Lebensfreude und Echtheit der Ländlerszene — und entschlossen, sie professionell zu vermarkten.',
                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
              },
            ].map((founder) => (
              <motion.div key={founder.name} variants={fadeUp} className="group">
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <Image
                    src={founder.img}
                    alt={founder.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="font-sans text-xs uppercase tracking-widest text-accent-gold">{founder.role}</span>
                    <h3 className="font-heading text-3xl font-bold text-white mt-1">{founder.name}</h3>
                  </div>
                </div>
                <p className="font-sans text-white/60 leading-relaxed">{founder.bio}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* MISSION TEASER */}
      <section className="py-32 bg-surface">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Section>
            <motion.span variants={fadeUp} className="label text-accent-gold">Die Mission</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-8">
              Etwas Grosses beginnt immer mit den Ersten.
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-2xl mx-auto mb-12 leading-loose">
              LAEMU ist mehr als eine Website — es ist der Beginn einer Bewegung.
              Eine Bewegung, die die Ländlermusik dorthin trägt, wo sie hingehört:
              in die Herzen einer neuen Generation, auf die Bühnen der Zukunft,
              und in eine starke, vernetzte Gemeinschaft.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button href="/mission" variant="primary" size="lg">
                Erfahre mehr über unsere Vision
              </Button>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Mach mit</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mt-3 mb-4">
              Werde Teil der Mission.
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/60 max-w-xl mx-auto">
              Es gibt viele Wege, wie du LAEMU mitgestalten kannst.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
                title: 'Idee einbringen',
                desc: 'Hast du eine Idee, die LAEMU besser macht? Wir hören dir zu.',
                href: '/contact',
                cta: 'Schreib uns'
              },
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
                title: 'Community beitreten',
                desc: 'Sei von Anfang an dabei und gestalte die Community aktiv mit.',
                href: '/community',
                cta: 'Jetzt beitreten'
              },
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
                title: 'LAEMU unterstützen',
                desc: 'Als Supporter oder Partner — jede Form der Unterstützung zählt.',
                href: '/contact',
                cta: 'Unterstützen'
              },
            ].map((option) => (
              <motion.div key={option.title} variants={fadeUp} className="border border-white/10 p-8 text-center group hover:border-accent-yellow transition-colors duration-300">
                <span className="block mb-5 text-white/50 group-hover:text-accent-yellow transition-colors mx-auto w-fit">{option.icon}</span>
                <h3 className="font-heading text-xl font-bold text-white mb-3">{option.title}</h3>
                <p className="font-sans font-light text-white/50 text-sm mb-6">{option.desc}</p>
                <Button href={option.href} variant="outline" size="sm">{option.cta}</Button>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>
    </>
  )
}
