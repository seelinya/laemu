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

// Modern SVG icons
function IconProfile() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function IconMedia() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><polyline points="8 21 12 17 16 21"/></svg>
}
function IconFeed() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
}
function IconHeart() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
}
function IconMessage() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
}
function IconGraduate() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
}
function IconCalendar() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
function IconShield() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}

const features = [
  { icon: <IconProfile />, title: 'Eigenes Profil', desc: 'Profilname, Bild, Formation, Instrumente, musikalische Vorbilder und Bio — alles auf deiner persönlichen Seite.' },
  { icon: <IconMedia />, title: 'Videos & Medien', desc: 'Lade eigene Videos hoch, poste Bilder, Texte und teile Links von YouTube, Facebook und mehr.' },
  { icon: <IconFeed />, title: 'Feed verwalten', desc: 'Zwei Tabs: alle Beiträge nach Datum, oder nur der Inhalt der Profile, denen du folgst.' },
  { icon: <IconHeart />, title: 'Interagieren', desc: 'Like, kommentiere, teile Beiträge und speichere sie als Inspiration auf deinem Profil.' },
  { icon: <IconMessage />, title: 'Direktnachrichten', desc: 'Chatte direkt mit anderen Musikern und tritt LAEMU-Gruppen für Kurse und Events bei.' },
  { icon: <IconGraduate />, title: 'Academy-Zugang', desc: 'Jedes Community-Mitglied erhält automatisch Zugang zur LAEMU Academy inklusive Kurs-Chats.' },
  { icon: <IconCalendar />, title: 'Event-Chats', desc: 'Bei Event-Anmeldung erhältst du Zugang zum LAEMU-Chat für den jeweiligen Anlass.' },
  { icon: <IconShield />, title: 'Profil & Privatsphäre', desc: 'Verwalte Geräte (max. 2), Blockliste, Zahlungsangaben, Rechnungsverlauf und Passwort.' },
]

const mockPosts = [
  {
    user: 'hansruedi_akkordeon',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    time: 'vor 2 Stunden',
    text: 'Heute am Probetag in Luzern — was für eine Energie! Die Kapelle wächst zusammen.',
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
    text: 'Wir freuen uns: Nächsten Samstag spielen wir beim Dorffest Appenzell! Kommt vorbei.',
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
      <section id="features" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-16">
            <motion.span variants={fadeUp} className="label text-accent-gold">Was dich erwartet</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Alles an einem Ort.</motion.h2>
            <motion.p variants={fadeUp} className="body-lg font-light text-text-secondary max-w-xl mx-auto">
              Die LAEMU Community bietet dir alle Werkzeuge, um dich zu vernetzen und zu wachsen.
            </motion.p>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className="bg-white p-8 hover:bg-background transition-colors group">
                <span className="block mb-5 text-dark group-hover:text-accent-gold transition-colors">{f.icon}</span>
                <h3 className="font-heading text-lg font-bold mb-2">{f.title}</h3>
                <p className="font-sans text-text-secondary text-sm font-light leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* FEED PREVIEW */}
      <section className="py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-14">
            <motion.span variants={fadeUp} className="label text-accent-gold">Live Preview</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-4">Was die Community gerade teilt.</motion.h2>
          </Section>
          <div className="relative">
            <Section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockPosts.map((post, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <div className="bg-surface border border-border overflow-hidden">
                    <div className="p-4 flex items-center gap-3 border-b border-border">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden">
                        <Image src={post.avatar} alt={post.user} fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <p className="font-sans font-semibold text-sm">@{post.user}</p>
                        <p className="font-sans text-xs font-light text-text-secondary">{post.time}</p>
                      </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={post.img} alt="post" fill className="object-cover" unoptimized />
                    </div>
                    <div className="p-4">
                      <p className="font-sans text-sm font-light text-text-secondary mb-3 leading-relaxed line-clamp-2">{post.text}</p>
                      <div className="flex items-center gap-4 text-xs text-text-secondary border-t border-border pt-3">
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Section>
            <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 flex justify-center pb-4">
              <Button href="/member/community" variant="dark" size="lg">
                Beitreten & alles sehen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="text-center mb-14">
            <motion.span variants={fadeUp} className="label text-accent-gold">Preise</motion.span>
            <motion.h2 variants={fadeUp} className="heading-lg mt-3 mb-4">Dein Zugang zur Community.</motion.h2>
          </Section>
          <Section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div variants={fadeUp}>
              <div className="border border-border p-8 h-full hover:border-dark transition-colors">
                <div className="mb-6">
                  <h3 className="font-heading text-2xl font-black mb-2">Community</h3>
                  <p className="font-sans text-text-secondary text-sm font-light">Für alle die verbinden wollen</p>
                </div>
                <div className="mb-8">
                  <span className="font-heading text-5xl font-black">CHF 5</span>
                  <span className="font-sans text-text-secondary font-light">/Monat</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Eigenes Community-Profil', 'Beiträge, Videos & Links posten', 'Direktnachrichten (Chat)', 'Academy-Zugang inklusive', 'Event-Chats bei Anmeldung', 'Geräte-Verwaltung (max. 2)', 'Blockliste & Datenschutz'].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-sans text-sm font-light">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-dark"><polyline points="20 6 9 17 4 12"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button href="/member/community" variant="dark" size="md" className="w-full">
                  Jetzt starten
                </Button>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="border-2 border-dark bg-dark text-white p-8 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0">
                  <div className="bg-accent-yellow text-dark text-xs font-heading font-black px-3 py-1.5 tracking-wide">
                    BEST VALUE
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="font-heading text-2xl font-black mb-2">Mit Academy</h3>
                  <p className="font-sans text-white/50 text-sm font-light">Academy-Mitglieder erhalten automatisch Zugang</p>
                </div>
                <div className="mb-8">
                  <span className="font-heading text-5xl font-black text-accent-yellow">Inklusive</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Alles aus Community (CHF 5/Mt.)', 'Strukturierte Lehrgänge (Handorgel, Schwyzerörgeli, Klavier, Bass, Klarinette)', 'Lernvideo-Datenbank für Fortgeschrittene', 'Kurs-Chat pro Lehrgang', 'Live-Calls & persönliches Feedback'].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-sans text-sm font-light text-white/80">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-accent-yellow"><polyline points="20 6 9 17 4 12"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button href="/academy" variant="primary" size="md" className="w-full">
                  Academy entdecken
                </Button>
              </div>
            </motion.div>
          </Section>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Section className="mb-12">
            <motion.span variants={fadeUp} className="label text-accent-gold">Bald dabei</motion.span>
            <motion.h2 variants={fadeUp} className="heading-md mt-3 mb-8">Kommende Community-Events.</motion.h2>
          </Section>
          <Section className="space-y-px bg-border">
            {upcomingEvents.map((e) => (
              <motion.div key={e.title} variants={fadeUp}>
                <div className="flex items-center gap-6 p-6 bg-white hover:bg-background transition-colors group cursor-pointer">
                  <div className="text-center min-w-[60px]">
                    <span className="font-heading font-black text-accent-gold text-sm">{e.date}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-bold group-hover:text-accent-gold transition-colors">{e.title}</h4>
                    <p className="font-sans text-sm font-light text-text-secondary">{e.location}</p>
                  </div>
                  <span className="font-sans text-xs font-medium px-3 py-1 bg-dark text-white group-hover:bg-accent-gold transition-colors">
                    {e.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </Section>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 bg-dark">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Section>
            <motion.h2 variants={fadeUp} className="heading-lg text-white mb-6">
              Bereit, Teil der Community zu werden?
            </motion.h2>
            <motion.p variants={fadeUp} className="body-lg font-light text-white/50 mb-10">
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
