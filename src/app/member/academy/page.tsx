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
    totalHours: 12,
    lastActivity: 'Heute',
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
    totalHours: 4,
    lastActivity: 'Gestern',
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
    totalHours: 8,
    lastActivity: 'vor 3 Tagen',
  },
]

const teachers = [
  {
    id: 'wenger',
    name: 'Hansruedi Wenger',
    specialty: 'Handorgel & Akkordeon',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Hansruedi Wenger ist einer der renommiertesten Handorgel-Lehrer der Deutschschweiz. Mit über 20 Jahren Unterrichtserfahrung und zahlreichen Konzertauftritten verbindet er Tradition und modernes Lehrverständnis.',
    courses: 3,
    students: 156,
    rating: 4.9,
    instruments: ['Handorgel', 'Akkordeon', 'Steirische Harmonika'],
    location: 'Luzern',
    profileHref: '/member/community',
  },
  {
    id: 'kaelin',
    name: 'Maria Kälin',
    specialty: 'Schwyzerörgeli',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    bio: 'Maria Kälin ist die führende Schwyzerörgeli-Lehrerin auf LAEMU. Ihre klare Methodik und ihre Leidenschaft für die Appenzeller Musiktradition machen ihre Kurse aussergewöhnlich.',
    courses: 2,
    students: 98,
    rating: 4.8,
    instruments: ['Schwyzerörgeli', 'Volksgesang'],
    location: 'Appenzell',
    profileHref: '/member/community',
  },
  {
    id: 'frei',
    name: 'Lisa Frei',
    specialty: 'Klavier & Musiktheorie',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    bio: 'Ausgebildete Pianistin und Musiktheoretikerin. Lisa vermittelt das theoretische Fundament, das Ländlermusiker brauchen, um ihr Spiel auf ein neues Niveau zu heben.',
    courses: 2,
    students: 74,
    rating: 4.9,
    instruments: ['Klavier', 'Flügel'],
    location: 'Zürich',
    profileHref: '/member/community',
  },
  {
    id: 'gasser',
    name: 'Peter Gasser',
    specialty: 'Klarinette & Ensemble',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: 'Peter Gasser unterrichtet Klarinette und Ensemblespiel. Als Mitglied mehrerer Kapellen weiss er genau, worauf es im Zusammenspiel ankommt.',
    courses: 1,
    students: 52,
    rating: 4.7,
    instruments: ['Klarinette', 'Bassklarinette'],
    location: 'Schwyz',
    profileHref: '/member/community',
  },
  {
    id: 'mueller',
    name: 'Thomas Müller',
    specialty: 'Kontrabass & Bass',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    bio: 'Thomas Müller ist das Fundament jeder Kapelle. Sein Kurs zeigt dir, wie du den Basspart einer Formation souverän übernimmst — vom Grundschlag bis zur Improvisation.',
    courses: 1,
    students: 38,
    rating: 4.8,
    instruments: ['Kontrabass', 'E-Bass'],
    location: 'Bern',
    profileHref: '/member/community',
  },
]

const allAchievements = [
  { id: 1, icon: '🔥', label: '7-Tage Streak', desc: '7 Tage in Folge eine Lektion absolviert', earned: true, earnedDate: '10. Jan 2025', points: 50, category: 'Streak' },
  { id: 2, icon: '🎓', label: 'Erste Lektion', desc: 'Deine allererste Lektion abgeschlossen', earned: true, earnedDate: '5. Jan 2025', points: 10, category: 'Meilenstein' },
  { id: 3, icon: '⭐', label: '10 Lektionen', desc: '10 Lektionen insgesamt abgeschlossen', earned: true, earnedDate: '8. Jan 2025', points: 100, category: 'Meilenstein' },
  { id: 4, icon: '📚', label: '3 Kurse', desc: 'In 3 verschiedenen Kursen eingeschrieben', earned: true, earnedDate: '6. Jan 2025', points: 30, category: 'Engagement' },
  { id: 5, icon: '⚡', label: 'Schnellstarter', desc: '5 Lektionen in einer Woche abgeschlossen', earned: true, earnedDate: '9. Jan 2025', points: 75, category: 'Engagement' },
  { id: 6, icon: '🏆', label: 'Kurs abgeschlossen', desc: 'Einen Kurs vollständig abgeschlossen', earned: false, earnedDate: null, points: 200, category: 'Meilenstein' },
  { id: 7, icon: '🌟', label: '30-Tage Streak', desc: '30 Tage in Folge gelernt', earned: false, earnedDate: null, points: 300, category: 'Streak' },
  { id: 8, icon: '🎵', label: 'Meisterklasse', desc: 'Eine Meisterklasse-Lektion freigeschaltet', earned: false, earnedDate: null, points: 150, category: 'Engagement' },
  { id: 9, icon: '🏅', label: 'Top Schüler', desc: 'Unter den 10% aktivsten Lernenden', earned: false, earnedDate: null, points: 250, category: 'Rang' },
  { id: 10, icon: '🎯', label: 'Zielorientiert', desc: 'Wöchentliches Lernziel 4x erreicht', earned: false, earnedDate: null, points: 120, category: 'Engagement' },
  { id: 11, icon: '💬', label: 'Community-Star', desc: '20 hilfreiche Chat-Nachrichten verfasst', earned: false, earnedDate: null, points: 80, category: 'Community' },
  { id: 12, icon: '🌱', label: 'Profi Level', desc: 'Level 10 in einem Instrument erreicht', earned: false, earnedDate: null, points: 500, category: 'Rang' },
]

const weeklyActivity = [
  { day: 'Mo', minutes: 35 },
  { day: 'Di', minutes: 0 },
  { day: 'Mi', minutes: 52 },
  { day: 'Do', minutes: 45 },
  { day: 'Fr', minutes: 20 },
  { day: 'Sa', minutes: 60 },
  { day: 'So', minutes: 38 },
]

const courseChats = [
  { id: 'ho', name: 'Handorgel-Lehrgang', icon: '🪗', members: 48, last: 'Hansruedi: Übungsaufgabe bis Freitag!', time: '10:30', unread: 3 },
  { id: 'oe', name: 'Schwyzerörgeli-Lehrgang', icon: '🎶', members: 34, last: 'Maria: Sehr gut gemacht alle!', time: 'Gestern', unread: 0 },
  { id: 'kl', name: 'Klavier-Lehrgang', icon: '🎹', members: 29, last: 'Lisa: Nächster Live-Call am Dienstag', time: 'Mo', unread: 1 },
]

const recommendedLessons = [
  { title: 'Ländler-Rhythmik verstehen', duration: '18 Min.', instructor: 'Hansruedi Wenger', img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&q=80' },
  { title: 'Improvisation im Ländlerstil', duration: '24 Min.', instructor: 'Maria Kälin', img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=300&q=80' },
  { title: 'Zusammenspiel in der Kapelle', duration: '32 Min.', instructor: 'Peter Gasser', img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&q=80' },
]

const navItems = [
  { label: 'Meine Kurse', id: 'kurse' },
  { label: 'Lernvideo-Datenbank', id: 'lernvideos', href: '/member/academy/lernvideos' },
  { label: 'Kurs-Chats', id: 'chats', badge: 4 },
  { label: 'Lehrpersonen', id: 'lehrer' },
  { label: 'Fortschritt', id: 'fortschritt' },
  { label: 'Achievements', id: 'achievements' },
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

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= Math.floor(value) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="text-accent-gold">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="font-sans text-xs text-text-secondary ml-1">{value}</span>
    </div>
  )
}

export default function MemberAcademyPage() {
  const [activeNav, setActiveNav] = useState('kurse')
  const [activeChatId, setActiveChatId] = useState<string | null>('ho')
  const [chatMsg, setChatMsg] = useState('')
  const [achievementFilter, setAchievementFilter] = useState('Alle')
  const currentCourse = courses[0]

  const earnedCount = allAchievements.filter(a => a.earned).length
  const totalPoints = allAchievements.filter(a => a.earned).reduce((s, a) => s + a.points, 0)
  const maxBarMinutes = Math.max(...weeklyActivity.map(d => d.minutes))
  const achievementCategories = ['Alle', ...Array.from(new Set(allAchievements.map(a => a.category)))]
  const filteredAchievements = achievementFilter === 'Alle' ? allAchievements : allAchievements.filter(a => a.category === achievementFilter)

  return (
    <div className="min-h-screen bg-background">
      {/* TOP BAR */}
      <div className="bg-dark text-white px-6 py-3 flex items-center justify-between mt-20">
        <div className="flex items-center gap-6">
          <h1 className="font-heading font-bold text-lg">LAEMU Academy</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-4 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span className="font-sans font-bold text-sm">7 Tage Streak!</span>
          </div>
          <button className="p-2 hover:bg-white/10 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
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
                  <div className="relative w-12 h-12 overflow-hidden">
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
                    <p className="font-sans text-xs text-accent-gold">Academy Mitglied</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-sans mb-1">
                    <span className="text-text-secondary">Gesamtfortschritt</span>
                    <span className="font-medium">59%</span>
                  </div>
                  <ProgressBar value={59} />
                  <p className="font-sans text-xs text-text-secondary">32 von 54 Lektionen</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-surface border border-border overflow-hidden">
                {navItems.map((item) => (
                  item.href ? (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="w-full flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 text-left text-text-secondary hover:bg-background hover:text-dark"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 text-left ${
                        activeNav === item.id
                          ? 'bg-dark text-white font-medium'
                          : 'text-text-secondary hover:bg-background hover:text-dark'
                      }`}
                    >
                      {item.label}
                      {item.badge && <span className="ml-auto bg-accent-gold text-white text-[10px] px-1.5 py-0.5">{item.badge}</span>}
                    </button>
                  )
                ))}
              </nav>

              {/* Quick stats */}
              <div className="bg-surface border border-border p-5">
                <h3 className="font-heading font-bold text-sm mb-4">Diese Woche</h3>
                <div className="space-y-3">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Lektionen</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Lernzeit</span>
                    <span className="font-medium">3h 50min</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Streak</span>
                    <span className="font-medium text-accent-gold">7 Tage</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-text-secondary">Punkte</span>
                    <span className="font-medium">{totalPoints} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 space-y-8">

            {/* ── KURSE ── */}
            {activeNav === 'kurse' && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-dark p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-sans text-xs uppercase tracking-widest text-accent-gold mb-2">Willkommen zurück</p>
                      <h2 className="font-heading text-3xl font-bold text-white mb-2">Guten Tag, Niklaus</h2>
                      <p className="font-sans text-white/60">Du hast diese Woche bereits 5 Lektionen abgeschlossen. Weiter so!</p>
                    </div>
                    <div className="bg-accent-gold/20 border border-accent-gold/30 px-4 py-3 text-center">
                      <p className="font-heading font-bold text-accent-gold text-2xl">7</p>
                      <p className="font-sans text-xs text-white/50">Tage Streak</p>
                    </div>
                  </div>
                </motion.div>

                <div>
                  <h3 className="font-heading font-bold text-xl mb-4">Weitermachen</h3>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface border border-border overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="relative aspect-video md:aspect-square overflow-hidden">
                        <Image src={currentCourse.img} alt={currentCourse.title} fill className="object-cover" unoptimized />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-14 h-14 bg-accent-gold flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2 p-6 flex flex-col justify-between">
                        <div>
                          <span className="font-sans text-xs text-accent-gold uppercase tracking-wider">{currentCourse.category}</span>
                          <h4 className="font-heading text-xl font-bold mt-1 mb-1">{currentCourse.title}</h4>
                          <p className="font-sans text-sm text-text-secondary mb-2">mit {currentCourse.instructor}</p>
                          <p className="font-sans text-sm font-medium mb-4">▶ {currentCourse.nextLesson}</p>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-sans mb-2">
                            <span className="text-text-secondary">{currentCourse.completedLessons} / {currentCourse.totalLessons} Lektionen</span>
                            <span className="font-medium">{currentCourse.progress}%</span>
                          </div>
                          <ProgressBar value={currentCourse.progress} className="mb-4" />
                          <Button href="/member/academy/lernvideos" variant="primary" size="md">Weiterlernen</Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl mb-4">Meine Kurse</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {courses.map((course, i) => (
                      <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-surface border border-border overflow-hidden group cursor-pointer hover:border-dark transition-colors">
                        <div className="relative aspect-video overflow-hidden">
                          <Image src={course.img} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                          <div className="absolute top-2 left-2 bg-accent-gold/90 text-white text-xs px-2 py-0.5">{course.level}</div>
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
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl mb-4">Empfohlene Lektionen</h3>
                  <div className="space-y-3">
                    {recommendedLessons.map((lesson, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.3 }} className="bg-surface border border-border flex items-center gap-4 p-4 cursor-pointer group hover:border-dark transition-colors">
                        <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden">
                          <Image src={lesson.img} alt={lesson.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
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
                </div>
              </>
            )}

            {/* ── CHATS ── */}
            {activeNav === 'chats' && (
              <div className="bg-surface border border-border overflow-hidden" style={{ minHeight: '500px' }}>
                <div className="flex h-full" style={{ minHeight: '500px' }}>
                  <div className="w-64 border-r border-border flex-shrink-0">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-heading font-bold text-sm">Kurs-Chats</h3>
                      <p className="font-sans text-xs text-text-secondary mt-1">Nur für eingeschriebene Kursteilnehmer</p>
                    </div>
                    {courseChats.map(c => (
                      <button key={c.id} onClick={() => setActiveChatId(c.id)} className={`w-full flex items-center gap-3 p-4 border-b border-border text-left transition-colors ${activeChatId === c.id ? 'bg-dark text-white' : 'hover:bg-background'}`}>
                        <div className="flex-1 min-w-0">
                          <p className={`font-sans text-xs font-semibold truncate ${activeChatId === c.id ? 'text-white' : ''}`}>{c.name}</p>
                          <p className={`font-sans text-[10px] truncate ${activeChatId === c.id ? 'text-white/50' : 'text-text-secondary'}`}>{c.last}</p>
                        </div>
                        {c.unread > 0 && <span className="bg-accent-gold text-white text-[10px] px-1.5 py-0.5 flex-shrink-0">{c.unread}</span>}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 flex flex-col">
                    {activeChatId ? (() => {
                      const chat = courseChats.find(c => c.id === activeChatId)!
                      return (
                        <>
                          <div className="p-4 border-b border-border flex items-center gap-3">
                            <div>
                              <p className="font-sans font-semibold text-sm">{chat.name}</p>
                              <p className="font-sans text-xs text-text-secondary">{chat.members} Mitglieder</p>
                            </div>
                          </div>
                          <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ minHeight: '280px' }}>
                            <div className="flex justify-start"><div className="bg-background border border-border px-3 py-2 max-w-xs"><p className="font-sans text-xs font-semibold text-accent-gold mb-0.5">Hansruedi Wenger (Lehrer)</p><p className="font-sans text-sm">Willkommen im Kurs-Chat! Hier können wir Fragen besprechen.</p></div></div>
                            <div className="flex justify-start"><div className="bg-background border border-border px-3 py-2 max-w-xs"><p className="font-sans text-xs font-semibold mb-0.5">Maria Kälin</p><p className="font-sans text-sm">Super, ich freue mich auf den Austausch!</p></div></div>
                            <div className="flex justify-end"><div className="bg-dark text-white px-3 py-2 max-w-xs"><p className="font-sans text-sm">Ich auch! Frage zur Lektion 3…</p></div></div>
                          </div>
                          <div className="p-4 border-t border-border flex gap-2">
                            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} placeholder="Nachricht schreiben..." className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dark" />
                            <button className="bg-dark text-white px-4 py-2 font-sans text-sm hover:bg-accent-gold transition-colors">Senden</button>
                          </div>
                        </>
                      )
                    })() : <div className="flex-1 flex items-center justify-center"><p className="font-sans text-text-secondary text-sm">Wähle einen Kurs-Chat</p></div>}
                  </div>
                </div>
              </div>
            )}

            {/* ── LEHRPERSONEN ── */}
            {activeNav === 'lehrer' && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-heading text-2xl font-bold mb-2">Lehrpersonen</h2>
                  <p className="font-sans text-text-secondary text-sm">Die Besten der Szene — erfahrene Musikerinnen und Musiker, die ihr Wissen weitergeben.</p>
                </motion.div>

                <div className="space-y-6">
                  {teachers.map((teacher, i) => (
                    <motion.div key={teacher.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-surface border border-border overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="relative aspect-square md:aspect-auto overflow-hidden">
                          <Image src={teacher.img} alt={teacher.name} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" unoptimized />
                        </div>
                        <div className="md:col-span-3 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <h3 className="font-heading text-xl font-bold">{teacher.name}</h3>
                                <p className="font-sans text-sm text-accent-gold">{teacher.specialty}</p>
                              </div>
                              <StarRating value={teacher.rating} />
                            </div>
                            <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4 mt-2">{teacher.bio}</p>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {teacher.instruments.map(inst => (
                                <span key={inst} className="font-sans text-xs px-2 py-1 bg-background border border-border text-text-secondary">{inst}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex gap-6 text-sm font-sans">
                              <div>
                                <span className="font-heading font-bold text-lg">{teacher.courses}</span>
                                <span className="text-text-secondary ml-1">Kurse</span>
                              </div>
                              <div>
                                <span className="font-heading font-bold text-lg">{teacher.students}</span>
                                <span className="text-text-secondary ml-1">Schüler</span>
                              </div>
                              <div className="flex items-center gap-1 text-text-secondary">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <span>{teacher.location}</span>
                              </div>
                            </div>
                            <Link href={teacher.profileHref} className="font-sans text-sm text-dark font-medium border border-dark px-4 py-2 hover:bg-dark hover:text-white transition-colors">
                              Profil ansehen
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* ── FORTSCHRITT ── */}
            {activeNav === 'fortschritt' && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-heading text-2xl font-bold mb-2">Mein Fortschritt</h2>
                  <p className="font-sans text-text-secondary text-sm">Übersicht deiner Lernaktivität und deines Wachstums.</p>
                </motion.div>

                {/* Stats overview */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                  {[
                    { label: 'Lektionen', value: '32', sub: 'abgeschlossen' },
                    { label: 'Lernzeit', value: '24h', sub: 'insgesamt' },
                    { label: 'Streak', value: '7', sub: 'Tage in Folge' },
                    { label: 'XP-Punkte', value: String(totalPoints), sub: 'verdient' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-surface p-6 text-center">
                      <p className="font-heading text-3xl font-bold text-accent-gold">{stat.value}</p>
                      <p className="font-sans text-sm font-medium mt-1">{stat.label}</p>
                      <p className="font-sans text-xs text-text-secondary">{stat.sub}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Weekly activity chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface border border-border p-6">
                  <h3 className="font-heading font-bold text-lg mb-6">Aktivität diese Woche</h3>
                  <div className="flex items-end gap-3 h-36">
                    {weeklyActivity.map((day, i) => (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                        <span className="font-sans text-xs text-text-secondary">{day.minutes > 0 ? `${day.minutes}m` : ''}</span>
                        <motion.div
                          className={`w-full ${day.minutes > 0 ? 'bg-accent-gold' : 'bg-border'}`}
                          initial={{ height: 0 }}
                          animate={{ height: day.minutes > 0 ? `${(day.minutes / maxBarMinutes) * 100}px` : '4px' }}
                          transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                        />
                        <span className="font-sans text-xs text-text-secondary">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Per-course progress */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-surface border border-border p-6">
                  <h3 className="font-heading font-bold text-lg mb-6">Kurs-Fortschritt</h3>
                  <div className="space-y-6">
                    {courses.map((course) => (
                      <div key={course.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 overflow-hidden flex-shrink-0">
                              <Image src={course.img} alt={course.title} fill className="object-cover" unoptimized />
                            </div>
                            <div>
                              <h4 className="font-sans font-medium text-sm">{course.title}</h4>
                              <p className="font-sans text-xs text-text-secondary">{course.completedLessons} / {course.totalLessons} Lektionen · {course.totalHours}h Lernzeit · Zuletzt: {course.lastActivity}</p>
                            </div>
                          </div>
                          <span className="font-heading font-bold text-sm">{course.progress}%</span>
                        </div>
                        <ProgressBar value={course.progress} />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Learning goals */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading font-bold text-lg">Wöchentliches Ziel</h3>
                    <span className="font-sans text-xs text-text-secondary">5 von 7 Tagen erreicht</span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, i) => (
                      <div key={day} className="flex-1 text-center">
                        <div className={`h-8 flex items-center justify-center mb-1 ${i < 5 ? 'bg-accent-gold' : 'bg-border'}`}>
                          {i < 5 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <span className="font-sans text-[10px] text-text-secondary">{day}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-sans text-xs text-text-secondary">Ziel: jeden Tag mindestens eine Lektion absolvieren. Noch 2 Tage bis zum vollen Wochenziel!</p>
                </motion.div>
              </>
            )}

            {/* ── ACHIEVEMENTS ── */}
            {activeNav === 'achievements' && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-heading text-2xl font-bold mb-2">Achievements</h2>
                  <p className="font-sans text-text-secondary text-sm">Sammle Abzeichen für deine Lernfortschritte und Meilensteine.</p>
                </motion.div>

                {/* Summary */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-dark p-6 flex items-center gap-8">
                  <div className="text-center">
                    <p className="font-heading text-4xl font-bold text-accent-gold">{earnedCount}</p>
                    <p className="font-sans text-xs text-white/50 mt-1">Errungen</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center">
                    <p className="font-heading text-4xl font-bold text-white">{allAchievements.length}</p>
                    <p className="font-sans text-xs text-white/50 mt-1">Total</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center">
                    <p className="font-heading text-4xl font-bold text-accent-gold">{totalPoints}</p>
                    <p className="font-sans text-xs text-white/50 mt-1">XP-Punkte</p>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between text-xs font-sans mb-2">
                      <span className="text-white/50">Fortschritt</span>
                      <span className="text-white/70">{Math.round((earnedCount / allAchievements.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-accent-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${(earnedCount / allAchievements.length) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Filter */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2">
                  {achievementCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setAchievementFilter(cat)}
                      className={`font-sans text-xs px-3 py-1.5 transition-all ${achievementFilter === cat ? 'bg-dark text-white' : 'bg-surface border border-border text-text-secondary hover:border-dark'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>

                {/* Achievements grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredAchievements.map((a, i) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`p-5 border flex flex-col gap-3 ${a.earned ? 'border-accent-gold/40 bg-surface' : 'border-border bg-surface opacity-45'}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-3xl">{a.icon}</span>
                        <span className={`font-sans text-xs px-2 py-0.5 ${a.earned ? 'bg-accent-gold text-white' : 'bg-border text-text-secondary'}`}>
                          +{a.points} XP
                        </span>
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm">{a.label}</h4>
                        <p className="font-sans text-xs text-text-secondary mt-1 leading-relaxed">{a.desc}</p>
                      </div>
                      <div className="mt-auto">
                        {a.earned ? (
                          <p className="font-sans text-xs text-accent-gold">{a.earnedDate}</p>
                        ) : (
                          <p className="font-sans text-xs text-text-secondary">Noch nicht errungen</p>
                        )}
                        <span className="font-sans text-[10px] uppercase tracking-wider text-text-secondary">{a.category}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
