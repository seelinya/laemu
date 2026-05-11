'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const courses = [
  {
    id: 1,
    title: 'Handorgel für Einsteiger',
    instructor: 'Hansruedi Wenger',
    instructorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    nextLesson: 'Lektion 17: Der Zweischläger',
    img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80',
    category: 'Handorgel',
    level: 'Einsteiger',
  },
  {
    id: 2,
    title: 'Schwyzerörgeli Basics',
    instructor: 'Maria Kälin',
    instructorImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    progress: 32,
    totalLessons: 18,
    completedLessons: 6,
    nextLesson: 'Lektion 7: Melodieläufe',
    img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&q=80',
    category: 'Schwyzerörgeli',
    level: 'Einsteiger',
  },
  {
    id: 3,
    title: 'Musiktheorie für Ländlermusiker',
    instructor: 'Lisa Frei',
    instructorImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    progress: 80,
    totalLessons: 12,
    completedLessons: 10,
    nextLesson: 'Lektion 11: Modulationen',
    img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&q=80',
    category: 'Theorie',
    level: 'Mittelstufe',
  },
]

const achievements = [
  { icon: '🔥', label: '7-Tage Streak', earned: true },
  { icon: '🎓', label: 'Erste Lektion', earned: true },
  { icon: '⭐', label: '10 Lektionen', earned: true },
  { icon: '🏆', label: 'Kurs abgeschlossen', earned: false },
  { icon: '🎵', label: 'Meisterklasse', earned: false },
  { icon: '🌟', label: 'Profi Level', earned: false },
]

const recommendedLessons = [
  { title: 'Ländler-Rhythmik verstehen', duration: '18 Min.', instructor: 'Hansruedi Wenger', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&q=80' },
  { title: 'Improvisation im Ländlerstil', duration: '24 Min.', instructor: 'Maria Kälin', img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=300&q=80' },
  { title: 'Zusammenspiel in der Kapelle', duration: '32 Min.', instructor: 'Peter Gasser', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&q=80' },
]

const navItems = [
  { icon: '📚', label: 'Meine Kurse', id: 'kurse' },
  { icon: '🎬', label: 'Lernvideo-Datenbank', id: 'lernvideos', href: '/member/academy/lernvideos' },
  { icon: '💬', label: 'Kurs-Chats', id: 'chats' },
  { icon: '👩‍🏫', label: 'Lehrpersonen', id: 'lehrer' },
  { icon: '📈', label: 'Fortschritt', id: 'fortschritt' },
  { icon: '🏆', label: 'Achievements', id: 'achievements' },
]

const courseChats = [
  { id: 'ho', name: 'Handorgel-Lehrgang', icon: '🪗', members: 48, last: 'Hansruedi: Übungsaufgabe bis Freitag!', time: '10:30', unread: 3 },
  { id: 'oe', name: 'Schwyzerörgeli-Lehrgang', icon: '🎶', members: 34, last: 'Maria: Sehr gut gemacht alle!', time: 'Gestern', unread: 0 },
  { id: 'kl', name: 'Klavier-Lehrgang', icon: '🎹', members: 29, last: 'Lisa: Nächster Live-Call am Dienstag', time: 'Mo', unread: 1 },
]

function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 bg-border overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-accent-gold"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  )
}

export default function MemberAcademyPage() {
  const [activeNav, setActiveNav] = useState('kurse')
  const [activeChatId, setActiveChatId] = useState<string | null>('ho')
  const [chatMsg, setChatMsg] = useState('')
  const currentCourse = courses[0]

  return (
    <div className="min-h-screen bg-background">
      {/* TOP BAR */}
      <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between sticky top-20 z-20">
        <div className="flex items-center gap-6">
          <h1 className="font-heading font-bold text-lg">LAEMU Academy</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent-gold/10 text-accent-gold border border-accent-gold/20 px-4 py-2">
            <span>🔥</span>
            <span className="font-sans font-bold text-sm">7 Tage Streak!</span>
          </div>
          <button className="p-2 hover:bg-background rounded-full transition-colors">
            <span>🔔</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-36 space-y-6">
              {/* Profile */}
              <div className="bg-surface border border-border p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                      alt="Profile"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">Niklaus Hess</p>
                    <p className="font-sans text-xs text-accent-gold">Pro-Kurs Mitglied</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-sans mb-1">
                    <span className="text-text-secondary">Gesamtfortschritt</span>
                    <span className="font-medium">59%</span>
                  </div>
                  <ProgressBar value={59} />
                  <p className="font-sans text-xs text-text-secondary">32 von 54 Lektionen abgeschlossen</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-surface border border-border overflow-hidden">
                {navItems.map((item) => (
                  item.href ? (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="w-full flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 text-left text-text-secondary hover:bg-background hover:text-accent-gold"
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 text-left ${
                        activeNav === item.id
                          ? 'bg-accent-gold/5 text-accent-gold font-medium'
                          : 'text-text-secondary hover:bg-background hover:text-text-primary'
                      }`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                      {item.id === 'chats' && <span className="ml-auto bg-accent-gold text-white text-[10px] px-1.5 py-0.5 rounded-full">4</span>}
                    </button>
                  )
                ))}
              </nav>

              {/* Quick stats */}
              <div className="bg-surface border border-border p-5">
                <h3 className="font-heading font-bold text-sm mb-4">Statistiken</h3>
                <div className="space-y-3">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Lektionen diese Woche</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Lernzeit heute</span>
                    <span className="font-medium">45 Min.</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Aktueller Streak</span>
                    <span className="font-medium text-accent-gold">🔥 7 Tage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 space-y-8">

            {/* Kurs-Chats */}
            {activeNav === 'chats' && (
              <div className="bg-surface border border-border overflow-hidden" style={{ minHeight: '500px' }}>
                <div className="flex h-full" style={{ minHeight: '500px' }}>
                  <div className="w-64 border-r border-border flex-shrink-0">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-heading font-bold text-sm">Kurs-Chats</h3>
                      <p className="font-sans text-xs text-text-secondary mt-1">Nur für eingeschriebene Kursteilnehmer</p>
                    </div>
                    {courseChats.map(c => (
                      <button key={c.id} onClick={() => setActiveChatId(c.id)} className={`w-full flex items-center gap-3 p-4 border-b border-border text-left transition-colors ${activeChatId === c.id ? 'bg-accent-gold/5' : 'hover:bg-background'}`}>
                        <span className="text-2xl flex-shrink-0">{c.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-xs font-semibold truncate">{c.name}</p>
                          <p className="font-sans text-[10px] text-text-secondary truncate">{c.last}</p>
                        </div>
                        {c.unread > 0 && <span className="bg-accent-gold text-white text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0">{c.unread}</span>}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 flex flex-col">
                    {activeChatId ? (() => {
                      const chat = courseChats.find(c => c.id === activeChatId)!
                      return (
                        <>
                          <div className="p-4 border-b border-border flex items-center gap-3">
                            <span className="text-2xl">{chat.icon}</span>
                            <div>
                              <p className="font-sans font-semibold text-sm">{chat.name}</p>
                              <p className="font-sans text-xs text-text-secondary">{chat.members} Mitglieder · Verwaltet von LAEMU</p>
                            </div>
                          </div>
                          <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ minHeight: '280px' }}>
                            <div className="flex justify-start"><div className="bg-background border border-border px-3 py-2 max-w-xs"><p className="font-sans text-xs font-semibold text-accent-gold mb-0.5">Hansruedi Wenger (Lehrer)</p><p className="font-sans text-sm">Willkommen im Kurs-Chat! Hier können wir Fragen besprechen.</p></div></div>
                            <div className="flex justify-start"><div className="bg-background border border-border px-3 py-2 max-w-xs"><p className="font-sans text-xs font-semibold mb-0.5">Maria Kälin</p><p className="font-sans text-sm">Super, ich freue mich auf den Austausch!</p></div></div>
                            <div className="flex justify-end"><div className="bg-accent-gold text-white px-3 py-2 max-w-xs"><p className="font-sans text-sm">Ich auch! Frage zur Lektion 3…</p></div></div>
                          </div>
                          <div className="p-4 border-t border-border flex gap-2">
                            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Nachricht schreiben..." className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
                            <button className="bg-accent-gold text-white px-4 py-2 font-sans text-sm hover:bg-accent-earth transition-colors">Senden</button>
                          </div>
                        </>
                      )
                    })() : <div className="flex-1 flex items-center justify-center"><p className="font-sans text-text-secondary text-sm">Wähle einen Kurs-Chat</p></div>}
                  </div>
                </div>
              </div>
            )}

            {activeNav !== 'chats' && <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-2">Willkommen zurück</p>
                  <h2 className="font-heading text-3xl font-bold text-white mb-2">Guten Tag, Niklaus 👋</h2>
                  <p className="font-sans text-white/60">Du hast diese Woche bereits 5 Lektionen abgeschlossen. Weiter so!</p>
                </div>
                <div className="text-right">
                  <div className="bg-accent-gold/20 border border-accent-gold/30 px-4 py-3 text-center">
                    <p className="font-sans text-4xl mb-1">🔥</p>
                    <p className="font-heading font-bold text-accent-gold text-2xl">7</p>
                    <p className="font-sans text-xs text-white/50">Tage Streak</p>
                  </div>
                </div>
              </div>
            </motion.div>}

            {/* Continue where you left off */}
            {activeNav !== 'chats' && <div>
              <h3 className="font-heading font-bold text-xl mb-4">Weitermachen wo du aufgehört hast</h3>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface border border-border overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="relative aspect-video md:aspect-square overflow-hidden">
                    <Image src={currentCourse.img} alt={currentCourse.title} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-accent-gold flex items-center justify-center">
                        <span className="text-white text-xl ml-1">▶</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 p-6 flex flex-col justify-between">
                    <div>
                      <span className="font-sans text-xs text-accent-gold uppercase tracking-wider">{currentCourse.category}</span>
                      <h4 className="font-heading text-xl font-bold mt-1 mb-1">{currentCourse.title}</h4>
                      <p className="font-sans text-sm text-text-secondary mb-2">mit {currentCourse.instructor}</p>
                      <p className="font-sans text-sm font-medium text-text-primary mb-4">
                        ▶ {currentCourse.nextLesson}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-sans mb-2">
                        <span className="text-text-secondary">{currentCourse.completedLessons} / {currentCourse.totalLessons} Lektionen</span>
                        <span className="font-medium">{currentCourse.progress}%</span>
                      </div>
                      <ProgressBar value={currentCourse.progress} className="mb-4" />
                      <Button href="/academy" variant="primary" size="md">
                        Weiterlernen
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>}

            {/* My Courses */}
            {activeNav !== 'chats' && <div>
              <h3 className="font-heading font-bold text-xl mb-4">Meine Kurse</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-surface border border-border overflow-hidden group cursor-pointer hover:border-accent-gold transition-colors"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={course.img} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute top-2 left-2 bg-accent-gold/90 text-white text-xs px-2 py-0.5">
                        {course.level}
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="font-sans text-xs text-accent-gold uppercase tracking-wider">{course.category}</span>
                      <h4 className="font-heading font-bold text-sm mt-1 mb-1 group-hover:text-accent-gold transition-colors">{course.title}</h4>
                      <p className="font-sans text-xs text-text-secondary mb-3">mit {course.instructor}</p>
                      <div className="flex justify-between text-xs font-sans mb-1.5">
                        <span className="text-text-secondary">{course.completedLessons}/{course.totalLessons}</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <ProgressBar value={course.progress} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>}

            {/* Recommended Lessons */}
            {activeNav !== 'chats' && <div>
              <h3 className="font-heading font-bold text-xl mb-4">Empfohlene Lektionen</h3>
              <div className="space-y-3">
                {recommendedLessons.map((lesson, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="bg-surface border border-border flex items-center gap-4 p-4 cursor-pointer group hover:border-accent-gold transition-colors"
                  >
                    <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden">
                      <Image src={lesson.img} alt={lesson.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-sm">▶</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-sans font-medium text-sm group-hover:text-accent-gold transition-colors">{lesson.title}</h5>
                      <p className="font-sans text-xs text-text-secondary">{lesson.instructor}</p>
                    </div>
                    <span className="font-sans text-xs text-text-secondary whitespace-nowrap">{lesson.duration}</span>
                  </motion.div>
                ))}
              </div>
            </div>}

            {/* Achievements */}
            {activeNav !== 'chats' && <div>
              <h3 className="font-heading font-bold text-xl mb-4">Meine Achievements</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {achievements.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 + 0.4 }}
                    className={`flex flex-col items-center gap-2 p-4 border text-center ${
                      a.earned
                        ? 'border-accent-gold/30 bg-accent-gold/5'
                        : 'border-border bg-surface opacity-40'
                    }`}
                  >
                    <span className="text-3xl">{a.icon}</span>
                    <span className="font-sans text-xs text-text-secondary leading-tight">{a.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  )
}
