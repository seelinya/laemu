'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Demo profile data (Hansruedi Wenger) ─────────────────────────────────────

const profile = {
  name: 'Hansruedi Wenger',
  handle: '@hansruedi_akkordeon',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  bio: 'Handorgelist und Akkordeonlehrer aus Luzern. Leidenschaft für Ländlermusik seit über 20 Jahren. Unterrichte auf LAEMU Musikschule und spiele in mehreren Formationen der Innerschweiz.',
  location: 'Luzern LU',
  instruments: ['Handorgel', 'Akkordeon', 'Steirische Harmonika'],
  formations: ['Hess-Rusch-Hegner', 'Ländlertrio Freiamt'],
  roles: ['Lehrperson', 'Musiker'],
}

type PostType = 'photo' | 'video' | 'text' | 'link' | 'event-announcement'

interface ProfilePost {
  id: number
  time: string
  text: string
  img?: string
  likes: number
  comments: number
  type: PostType
  linkTitle?: string
  linkDomain?: string
  eventDate?: string
  eventTime?: string
  eventLocation?: string
}

const posts: ProfilePost[] = [
  {
    id: 1,
    time: 'vor 2 Stunden',
    text: 'Heute am Probetag in Luzern 🎶 Was für eine Energie — wir bereiten uns auf das Frühlingskonzert vor!',
    img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
    likes: 47,
    comments: 12,
    type: 'photo',
  },
  {
    id: 2,
    time: 'vor 3 Tagen',
    text: 'Die Handorgel ist für mich nicht nur ein Instrument — sie ist ein Stück Heimat. Hier mein Lieblingsübungsstück für Einsteiger.',
    likes: 63,
    comments: 18,
    type: 'text',
  },
  {
    id: 3,
    time: 'vor 1 Woche',
    text: 'Empfehlenswerte Lektüre für alle, die tiefer in die Geschichte der Schweizer Volksmusik eintauchen wollen.',
    likes: 29,
    comments: 5,
    type: 'link',
    linkTitle: 'Volksmusik in der Schweiz — Tradition und Wandel',
    linkDomain: 'volksmusik.ch',
  },
  {
    id: 4,
    time: 'vor 2 Wochen',
    text: 'Unser Konzert war ein voller Erfolg! Danke an alle, die dabei waren — die Energie im Saal war unvergesslich.',
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    likes: 134,
    comments: 41,
    type: 'photo',
  },
  {
    id: 5,
    time: 'vor 3 Wochen',
    text: 'Neue Video-Lektion auf LAEMU Musikschule: Der Zwiefache — Rhythmus und Interpretation.',
    img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80',
    likes: 89,
    comments: 23,
    type: 'video',
  },
]

const upcomingEvents = [
  { date: 'Sa, 7. Juni 2025', title: 'Frühlingskonzert Kapelle Hess-Ruedi-Hegner', location: 'Luzern, Zunfthaus' },
  { date: 'So, 15. Juni 2025', title: 'LAEMU Live-Session Handorgel', location: 'Online' },
]

function IconHeart({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  )
}
function IconComment() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  )
}
function IconPlay() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  )
}

function PostCard({ post }: { post: ProfilePost }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          <Image src={profile.avatar} alt={profile.name} fill className="object-cover" unoptimized />
        </div>
        <div className="flex-1">
          <p className="font-heading font-bold text-sm">{profile.name}</p>
          <p className="font-sans text-xs text-text-secondary">{post.time}</p>
        </div>
        {post.type === 'video' && (
          <span className="font-sans text-[10px] font-semibold px-2 py-1 bg-dark text-white tracking-wide uppercase">Video</span>
        )}
      </div>

      {post.img && (
        <div className="relative aspect-video overflow-hidden">
          <Image src={post.img} alt="" fill className="object-cover" unoptimized />
          {post.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <IconPlay />
              </div>
            </div>
          )}
        </div>
      )}

      {post.type === 'link' && post.linkDomain && (
        <div className="mx-4 mb-3 border border-border p-4 bg-background hover:border-dark transition-colors cursor-pointer flex items-start gap-3">
          <div className="flex-1">
            <p className="font-sans text-[10px] text-text-secondary uppercase tracking-wider mb-1">{post.linkDomain}</p>
            <p className="font-sans text-sm font-medium leading-snug">{post.linkTitle}</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-text-secondary mt-0.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </div>
      )}

      <div className="p-4">
        <p className="font-sans text-sm font-light text-text-secondary leading-relaxed mb-4">{post.text}</p>
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <button
            onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1) }}
            className={`flex items-center gap-1.5 font-sans text-sm transition-colors ${liked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}
          >
            <IconHeart filled={liked} />
            <span className="text-xs">{likeCount}</span>
          </button>
          <button className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-dark transition-colors">
            <IconComment />
            <span className="text-xs">{post.comments}</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function MemberProfilePage() {
  const [following, setFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'events'>('posts')
  const [eventsVisible, setEventsVisible] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-dark border-b border-dark-secondary px-6 py-4 flex items-center justify-between">
        <Link href="/member/academy" className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Zurück zur Musikschule
        </Link>
        <h1 className="font-heading font-bold text-base text-white">Profil</h1>
        <div className="w-24" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border overflow-hidden mb-6">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-r from-dark to-dark/60 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px)' }}
            />
          </div>
          <div className="px-6 pb-6 -mt-10">
            <div className="flex items-end justify-between mb-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-surface flex-shrink-0">
                <Image src={profile.avatar} alt={profile.name} fill className="object-cover" unoptimized />
              </div>
              <button
                onClick={() => setFollowing(!following)}
                className={`font-sans text-sm font-semibold px-5 py-2.5 border-2 transition-all ${
                  following
                    ? 'border-border text-text-secondary hover:border-red-300 hover:text-red-500'
                    : 'border-dark bg-dark text-white hover:bg-accent-gold hover:border-accent-gold'
                }`}
              >
                {following ? 'Gefolgt ✓' : '+ Folgen'}
              </button>
            </div>

            <h1 className="font-heading text-2xl font-black">{profile.name}</h1>
            <p className="font-sans text-sm text-accent-gold mb-2">{profile.handle}</p>
            <p className="font-sans text-sm font-light text-text-secondary leading-relaxed mb-4">{profile.bio}</p>

            <div className="flex flex-wrap gap-3 text-xs font-sans text-text-secondary mb-4">
              <span className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {profile.location}
              </span>
              {profile.formations.map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  {f}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profile.instruments.map((inst) => (
                <span key={inst} className="font-sans text-xs px-2 py-1 bg-background border border-border">{inst}</span>
              ))}
              {profile.roles.map((r) => (
                <span key={r} className="font-sans text-xs px-2 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">{r}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 font-sans text-sm font-medium transition-colors border-b-2 ${activeTab === 'posts' ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}
          >
            Beiträge
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 font-sans text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2 ${activeTab === 'events' ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}
          >
            Events
            {!eventsVisible && (
              <span className="font-sans text-[10px] text-text-secondary/60 border border-border px-1.5 py-0.5 leading-tight">versteckt</span>
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'posts' && (
            <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </motion.div>
          )}
          {activeTab === 'events' && (
            <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">

              {/* Visibility toggle — owner-only setting */}
              <div className="bg-surface border border-border px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-medium">Events für andere sichtbar</p>
                  <p className="font-sans text-xs text-text-secondary mt-0.5">
                    {eventsVisible
                      ? 'Andere Nutzer sehen deine Events im Profil.'
                      : 'Events werden anderen Nutzern nicht angezeigt.'}
                  </p>
                </div>
                <button
                  onClick={() => setEventsVisible(!eventsVisible)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${eventsVisible ? 'bg-dark' : 'bg-border'}`}
                  aria-label="Events ein-/ausblenden"
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${eventsVisible ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <AnimatePresence>
                {eventsVisible ? (
                  <motion.div
                    key="events-on"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <p className="font-sans text-sm text-text-secondary pt-2">Anstehende Events:</p>
                    {upcomingEvents.map((event, i) => (
                      <div key={i} className="bg-surface border border-border p-5 hover:border-dark transition-colors">
                        <p className="font-sans text-xs text-accent-gold font-semibold mb-1">{event.date}</p>
                        <h3 className="font-heading font-bold text-base mb-1">{event.title}</h3>
                        <p className="font-sans text-xs text-text-secondary flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {event.location}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="events-off"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-background border border-dashed border-border p-8 text-center"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary mx-auto mb-3">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                    <p className="font-sans text-sm text-text-secondary">Events sind ausgeblendet.</p>
                    <p className="font-sans text-xs text-text-secondary/60 mt-1">Andere Nutzer sehen diesen Tab nicht.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
