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

const features = [
  { icon: '👤', title: 'Eigenes Profil', desc: 'Profilname, Bild, Formation, Instrumente, musikalische Vorbilder und Bio — alles auf deiner persönlichen Seite.' },
  { icon: '🎬', title: 'Videos & Medien', desc: 'Lade eigene Videos hoch, poste Bilder, Texte und teile Links von YouTube, Facebook und mehr.' },
  { icon: '📋', title: 'Feed verwalten', desc: 'Zwei Tabs: alle Beiträge nach Datum, oder nur der Inhalt der Profile, denen du folgst.' },
  { icon: '❤️', title: 'Interagieren', desc: 'Like, kommentiere, teile Beiträge und speichere sie als Inspiration auf deinem Profil.' },
  { icon: '💬', title: 'Direktnachrichten', desc: 'Chatte direkt mit anderen Musikern und tritt LAEMU-Gruppen für Kurse und Events bei.' },
  { icon: '🎓', title: 'Academy-Zugang', desc: 'Jedes Community-Mitglied erhält automatisch Zugang zur LAEMU Academy inklusive Kurs-Chats.' },
  { icon: '📅', title: 'Event-Chats', desc: 'Bei Event-Anmeldung erhältst du Zugang zum LAEMU-Chat für den jeweiligen Anlass.' },
  { icon: '🔒', title: 'Profil & Privatsphäre', desc: 'Verwalte Geräte (max. 2), Blockliste, Zahlungsangaben, Rechnungsverlauf und Passwort.' },
]

const mockPosts = [
  {
    user: 'hansruedi_akkordeon',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    time: 'vor 2 Stunden',
    text: 'Heute am Probetag in Luzern — was für eine Energie! Die Kapelle wächst zusammen 🎶',
    img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80',
    likes: 47,
    comments: 12,
  },
  {
    user: 'maria_oergeli',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    time: 'vor 5 Stunden',
    text: 'Neues Video online! Ich spiele eine kleine Improvisation auf meinem Schwyzerörgeli — traditionell, aber mit eigenem Touch.',
    img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&q=80',
    likes: 89,
    comments: 23,
  },
  {
    user: 'trio_alpstein',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    time: 'vor 1 Tag',
    text: 'Wir freuen uns: Nächsten Samstag spielen wir beim Dorffest Appenzell! Kommt vorbei 🏔️',
    img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=600&q=80',
    likes: 134,
    comments: 41,
  },
]

const upcomingEvents = [
  { date: '15. Feb', title: 'Community-Abend Luzern', location: 'Kultur- und Kongresszentrum, Luzern', type: 'Community' },
  { date: '22. Feb', title: 'Online-Jam Session', location: 'LAEMU Live Stream', type: 'Online' },
  { date: '01. Mär', title: 'Tanzabend Schwyz', location: 'Landgasthof Rigi, Schwyz', type: 'Tanzabend' },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'community' | 'academy'>('community')

  return (
    <>
      <Hero
        title={"Deine Community.\nDeine Bühne."}
        subtitle="Der exklusive Ort für Ländlermusik-Liebhaber. Vernetze dich, teile deine Musik, wachse gemeinsam."
        primaryCta={{ label: 'Community beitreten', href: '/member/community' }}
        secondaryCta={{ label: 'Mehr erfahren', href: '#features' }}
        imageSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80"
        size="large"
      />

      {/* FEATURES */}
      <section id="features" className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-20">
            <motion.span variants={fadeUp} className="label text-accent-gold">Was dich erwartet</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Alles an einem Ort.</motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-text-secondary max-w-xl mx-auto">
              Die LAEMU Community bietet dir alle Werkzeuge, um dich zu vernetzen und zu wachsen.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Card hover padding="lg">
                  <span className="text-3xl block mb-4">{f.icon}</span>
                  <h3 className="font-serif text-xl font-bold mb-2">{f.title}</h3>
                  <p className="font-sans text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* FEED PREVIEW */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Live Preview</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-4">Was die Community gerade teilt.</motion.h2>
          </Section>
          <div className="relative">
            <Section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockPosts.map((post, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <Card padding="none" className="overflow-hidden">
                    <div className="p-4 flex items-center gap-3 border-b border-border">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image src={post.avatar} alt={post.user} fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-sm">@{post.user}</p>
                        <p className="font-sans text-xs text-text-secondary">{post.time}</p>
                      </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={post.img} alt="post" fill className="object-cover" unoptimized />
                    </div>
                    <div className="p-4">
                      <p className="font-sans text-sm text-text-secondary mb-3">{post.text}</p>
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </Section>
            {/* Overlay to encourage signup */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 flex justify-center pb-4">
              <Button href="/member/community" variant="primary" size="lg">
                Beitreten & alles sehen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Preise</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Dein Zugang zur Community.</motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div variants={fadeUp}>
              <Card padding="lg" className="border-2 border-border">
                <div className="mb-6">
                  <h3 className="font-serif text-2xl font-bold mb-2">Community</h3>
                  <p className="font-sans text-text-secondary text-sm">Für alle die verbinden wollen</p>
                </div>
                <div className="mb-8">
                  <span className="font-serif text-5xl font-bold">CHF 5</span>
                  <span className="font-sans text-text-secondary">/Monat</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Eigenes Community-Profil', 'Beiträge, Videos & Links posten', 'Direktnachrichten (Chat)', 'Academy-Zugang inklusive', 'Event-Chats bei Anmeldung', 'Geräte-Verwaltung (max. 2)', 'Blockliste & Datenschutz'].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-sans text-sm">
                      <span className="text-muted-green">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button href="/member/community" variant="dark" size="md" className="w-full">
                  Jetzt starten
                </Button>
              </Card>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card padding="lg" className="border-2 border-accent-gold bg-dark text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-accent-gold text-white text-xs px-3 py-1 font-sans">
                  BEST VALUE
                </div>
                <div className="mb-6">
                  <h3 className="font-serif text-2xl font-bold mb-2">Mit Academy</h3>
                  <p className="font-sans text-white/60 text-sm">Academy-Mitglieder erhalten automatisch Zugang</p>
                </div>
                <div className="mb-8">
                  <span className="font-serif text-5xl font-bold text-accent-gold">Inklusive</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Alles aus Community (CHF 5/Mt.)', 'Strukturierte Lehrgänge (Handorgel, Schwyzerörgeli, Klavier, Bass, Klarinette)', 'Lernvideo-Datenbank für Fortgeschrittene', 'Kurs-Chat pro Lehrgang', 'Live-Calls & persönliches Feedback'].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-sans text-sm text-white/80">
                      <span className="text-accent-gold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button href="/academy" variant="primary" size="md" className="w-full">
                  Academy entdecken
                </Button>
              </Card>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="mb-12">
            <motion.span variants={fadeUp} className="label text-accent-gold">Bald dabei</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-8">Kommende Community-Events.</motion.h2>
          </Section>
          <Section className="space-y-4">
            {upcomingEvents.map((e) => (
              <motion.div key={e.title} variants={fadeUp}>
                <div className="flex items-center gap-6 p-6 bg-background border border-border hover:border-accent-gold transition-colors group cursor-pointer">
                  <div className="text-center min-w-[60px]">
                    <span className="font-serif font-bold text-accent-gold text-sm">{e.date}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif font-bold group-hover:text-accent-gold transition-colors">{e.title}</h4>
                    <p className="font-sans text-sm text-text-secondary">{e.location}</p>
                  </div>
                  <span className="font-sans text-xs px-3 py-1 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                    {e.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Section>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mb-6">
              Bereit, Teil der Community zu werden?
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg text-white/60 mb-10">
              Tausende von Ländlermusik-Liebhabern warten schon auf dich.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button href="/member/community" variant="primary" size="lg">
                Jetzt der Community beitreten
              </Button>
            </motion.div>
          </Section>
        </div>
      </section>
    </>
  )
}
