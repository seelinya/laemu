'use client'

import { useRef } from 'react'
import Image from 'next/image'
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

const usps = [
  {
    title: 'Authentizität',
    subtitle: 'The real deal, not commercial',
    desc: 'LAEMU steht für unverfälschte Ländlermusik. Keine Kompromisse, keine Kommerzialisierung. Wir bauen eine Plattform, die die Werte der Musik respektiert und hochhält.',
    icon: '🎯',
  },
  {
    title: 'Gemeinschaft',
    subtitle: 'Community first',
    desc: 'Die stärkste Kraft in der Musik ist die Gemeinschaft. LAEMU bringt Menschen zusammen — Musikerinnen, Fans, Lehrende und Lernende — in einem Raum des Vertrauens.',
    icon: '🤝',
  },
  {
    title: 'Zukunft',
    subtitle: 'For the next generation',
    desc: 'Die Ländlermusik muss nicht verstauben. Mit LAEMU geben wir ihr eine moderne Heimat, die die nächste Generation begeistert und inspiriert.',
    icon: '🚀',
  },
]

const forWhom = [
  { icon: '🎸', title: 'Musikerinnen & Musiker', desc: 'Präsentiert euch, vernetzt euch und findet neue Auftrittsmöglichkeiten.' },
  { icon: '🎶', title: 'Formationen', desc: 'Stellt eure Kapelle vor und erreicht neue Fans und Veranstalter.' },
  { icon: '❤️', title: 'Fans & Liebhaber', desc: 'Tauche ein in die Welt der Ländlermusik und entdecke Neues.' },
  { icon: '📚', title: 'Lernende', desc: 'Starte deine musikalische Reise mit den besten Lehrpersonen der Szene.' },
  { icon: '🗓️', title: 'Veranstalter', desc: 'Finde die perfekte Formation für deinen nächsten Event.' },
  { icon: '🌱', title: 'Die nächste Generation', desc: 'LAEMU schafft Räume, in denen junge Menschen zur Ländlermusik finden.' },
]

const teachers = [
  { name: 'Hansruedi Wenger', instrument: 'Handorgel', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { name: 'Maria Kälin', instrument: 'Schwyzerörgeli', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
  { name: 'Peter Gasser', instrument: 'Klarinette', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
  { name: 'Lisa Frei', instrument: 'Piano', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
]

const partners = [
  'Schweizer Volksmusikverband',
  'Eidgenössisches Musikfest',
  'Pro Helvetia',
  'SRF Musik',
  'Lucerne Festival',
]

const contributeOptions = [
  { icon: '💡', title: 'Ideen einbringen', desc: 'Teile deine Ideen für eine bessere LAEMU-Plattform.', cta: 'Idee teilen', href: '/contact' },
  { icon: '🎵', title: 'Talent einbringen', desc: 'Als Musiker, Lehrer oder Kreativkopf — wir brauchen dich.', cta: 'Bewerbung senden', href: '/contact' },
  { icon: '📖', title: 'Wissen teilen', desc: 'Teile dein Wissen über Ländlermusik, Geschichte und Kultur.', cta: 'Beitrag leisten', href: '/contact' },
  { icon: '🔥', title: 'Motivation zeigen', desc: 'Werde Supporter und zeige, dass du hinter der Vision stehst.', cta: 'Unterstützen', href: '/contact' },
]

export default function MissionPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center bg-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1416453072034-c8dbfa2856b5?w=1920&q=80"
            alt="Mission"
            fill
            className="object-cover opacity-20"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 to-dark" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-40">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl"
          >
            <motion.span variants={fadeUp} className="label text-accent-gold">Die Mission</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-8xl font-bold text-white leading-tight mt-4 mb-8">
              Etwas Grosses beginnt immer mit den Ersten.
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans text-xl text-white/60 leading-relaxed max-w-2xl">
              LAEMU ist nicht einfach eine weitere Musikplattform. Es ist der Anfang von etwas,
              das die Schweizer Ländlermusik für immer verändern wird.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* WHAT IS LAEMU */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1000&q=80"
                alt="Ländlermusik"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <Section>
              <motion.span variants={fadeUp} className="label text-accent-gold">Was ist LAEMU?</motion.span>
              <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-8">
                Die zentrale Heimat der Ländlermusik.
              </motion.h2>
              <motion.p variants={fadeUp} className="body-lg text-text-secondary mb-6 leading-loose">
                LAEMU — kurz für "Ländlermusik" — ist die erste digitale Plattform, die alle Aspekte
                der Schweizer Ländlermusik unter einem Dach vereint.
              </motion.p>
              <motion.p variants={fadeUp} className="body-md text-text-secondary mb-6 leading-loose">
                Hier finden Musikerinnen und Musiker eine Community, die sie versteht. Fans entdecken
                neue Formationen und Events. Lernende finden die besten Lehrer. Veranstalter finden
                die perfekte Formation.
              </motion.p>
              <motion.p variants={fadeUp} className="body-md text-text-secondary leading-loose">
                LAEMU ist nicht von einer grossen Plattenfirma oder einem Konzern gebaut worden.
                Es ist ein Projekt von Menschen, die die Ländlermusik lieben und verstehen, dass
                diese Kultur eine digitale Heimat braucht, die ihr gerecht wird.
              </motion.p>
            </Section>
          </div>
        </div>
      </section>

      {/* 3 USPS */}
      <section className="py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Unsere Werte</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mt-3 mb-4">Was uns antreibt.</motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {usps.map((usp) => (
              <motion.div key={usp.title} variants={fadeUp}>
                <div className="border border-white/10 p-10 h-full hover:border-accent-gold transition-colors duration-300">
                  <span className="text-5xl block mb-6">{usp.icon}</span>
                  <h3 className="font-serif text-2xl font-bold text-white mb-1">{usp.title}</h3>
                  <p className="font-sans text-xs text-accent-gold uppercase tracking-widest mb-4">{usp.subtitle}</p>
                  <p className="font-sans text-white/60 text-sm leading-relaxed">{usp.desc}</p>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* FOR WHOM */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Für wen</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Für wen ist LAEMU da?</motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-2xl mx-auto">
              LAEMU richtet sich an alle, die die Ländlermusik lieben, leben und weiterentwickeln wollen.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forWhom.map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <Card hover padding="lg">
                  <span className="text-3xl block mb-4">{item.icon}</span>
                  <h3 className="font-serif text-xl font-bold mb-2">{item.title}</h3>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Die Gründer</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">
              Zwei Stärken. Eine gemeinsame Mission.
            </motion.h2>
          </Section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {[
              {
                name: 'Niklaus Hess',
                role: 'Co-Founder & Musikdirektor',
                img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
                bio1: 'Niklaus Hess ist von Kindsbeinen an mit der Ländlermusik aufgewachsen. Als Gründer der Ländlerkapelle Hess hat er sich als einer der bekanntesten Handorgelspieler der Zentralschweiz etabliert.',
                bio2: 'Mit LAEMU will Niklaus der Ländlermusik die Plattform geben, die sie verdient. Sein tiefes Wissen über die Szene, ihre Menschen und ihre Traditionen ist das Fundament, auf dem LAEMU gebaut ist.',
                contact: 'niklaus@laemu.ch',
              },
              {
                name: 'Selina Strickler',
                role: 'Co-Founder & Creative Director',
                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
                bio1: 'Selina Strickler bringt Expertise in Branding, digitale Strategie und modernes Marketing mit. Bevor sie zu LAEMU stiess, baute sie erfolgreiche Marken in der Schweizer Kulturszene auf.',
                bio2: 'Bei LAEMU verantwortet Selina alles, was die Marke sichtbar und greifbar macht — von der visuellen Identität bis zur digitalen Kommunikation. Ihr Ziel: LAEMU zu einer Marke zu machen, die man fühlt.',
                contact: 'selina@laemu.ch',
              },
            ].map((founder) => (
              <Section key={founder.name} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <motion.div variants={fadeUp} className="relative aspect-[3/4] overflow-hidden">
                  <Image src={founder.img} alt={founder.name} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 p-6">
                    <span className="font-sans text-xs text-accent-gold">{founder.role}</span>
                    <h3 className="font-serif text-2xl font-bold text-white">{founder.name}</h3>
                  </div>
                </motion.div>
                <div className="flex flex-col justify-center">
                  <motion.p variants={fadeUp} className="body-md text-text-secondary mb-4 leading-loose">{founder.bio1}</motion.p>
                  <motion.p variants={fadeUp} className="body-md text-text-secondary mb-6 leading-loose">{founder.bio2}</motion.p>
                  <motion.a variants={fadeUp} href={`mailto:${founder.contact}`} className="font-sans text-sm text-accent-gold hover:text-accent-earth transition-colors">
                    {founder.contact}
                  </motion.a>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* TEACHERS */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Team</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Lehrpersonen</motion.h2>
          </Section>
          <Section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teachers.map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="group text-center">
                <div className="relative aspect-square overflow-hidden mb-3">
                  <Image src={t.img} alt={t.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" unoptimized />
                </div>
                <h4 className="font-serif font-bold">{t.name}</h4>
                <p className="font-sans text-xs text-accent-gold">{t.instrument}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center">
            <motion.span variants={fadeUp} className="label text-text-secondary mb-8 block">Partner & Zusammenarbeit</motion.span>
            <motion.div variants={stagger} className="flex flex-wrap items-center justify-center gap-8 mt-6">
              {partners.map((p) => (
                <motion.span
                  key={p}
                  variants={fadeUp}
                  className="font-sans text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-4 py-2 border border-border"
                >
                  {p}
                </motion.span>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* CONTRIBUTE CTA */}
      <section className="py-32 bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Mitmachen</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mt-3 mb-4">
              Werde Teil von etwas Grossem.
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/60 max-w-xl mx-auto">
              Es gibt viele Arten, wie du LAEMU mitgestalten kannst. Jeder Beitrag zählt.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributeOptions.map((opt) => (
              <motion.div key={opt.title} variants={fadeUp} className="text-center border border-white/10 p-8 hover:border-accent-gold transition-colors duration-300">
                <span className="text-4xl block mb-4">{opt.icon}</span>
                <h3 className="font-serif text-lg font-bold text-white mb-2">{opt.title}</h3>
                <p className="font-sans text-white/50 text-sm mb-6 leading-relaxed">{opt.desc}</p>
                <Button href={opt.href} variant="outline" size="sm">{opt.cta}</Button>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>
    </>
  )
}
