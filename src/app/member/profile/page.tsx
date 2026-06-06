'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShareMenu } from '@/components/ShareMenu'

// ─── Demo profile data (Hansruedi Wenger) ─────────────────────────────────────

const profile = {
  name: 'Hansruedi Wenger',
  handle: '@hansruedi_akkordeon',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  tagline: 'Schweizer Örgeli-Kurslehrer',
  bio: 'Handorgelist und Akkordeonlehrer aus Luzern. Leidenschaft für Ländlermusik seit über 20 Jahren. Unterrichte auf LAEMU Musikschule und spiele in mehreren Formationen der Innerschweiz.',
  location: 'Luzern LU',
  instruments: ['Handorgel', 'Akkordeon', 'Steirische Harmonika'],
  formations: ['Hess-Rusch-Hegner', 'Ländlertrio Freiamt'],
  roles: ['Lehrperson', 'Musiker'],
  openForFormation: true,
  social: {
    instagram: 'hansruedi.oergeli',
    whatsapp: '+41 79 123 45 67',
    facebook: 'hansruedi.wenger.musik',
    tiktok: 'hansruedi_oergeli',
  },
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

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  )
}
function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
  )
}
function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
  )
}
function IconTikTok() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>
  )
}

function SocialLinks({ social }: { social: typeof profile.social }) {
  const links: { key: string; href: string; icon: React.ReactNode; label: string }[] = []
  if (social.instagram) links.push({ key: 'ig', href: `https://instagram.com/${social.instagram}`, icon: <IconInstagram />, label: 'Instagram' })
  if (social.whatsapp) links.push({ key: 'wa', href: `https://wa.me/${social.whatsapp.replace(/[^0-9]/g, '')}`, icon: <IconWhatsApp />, label: 'WhatsApp' })
  if (social.facebook) links.push({ key: 'fb', href: `https://facebook.com/${social.facebook}`, icon: <IconFacebook />, label: 'Facebook' })
  if (social.tiktok) links.push({ key: 'tt', href: `https://tiktok.com/@${social.tiktok}`, icon: <IconTikTok />, label: 'TikTok' })
  if (links.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="w-9 h-9 flex items-center justify-center border border-border bg-background text-text-secondary hover:text-accent-gold hover:border-accent-gold transition-colors"
        >
          {l.icon}
        </a>
      ))}
    </div>
  )
}

// ─── Shared-activity stream (derived from posts + events) ────────────────────

type SharedKind = 'event' | 'video' | 'link' | 'text' | 'photo'

interface SharedItem {
  id: string
  kind: SharedKind
  label: string
  title: string
  meta?: string
  time: string
}

const sharedItems: SharedItem[] = [
  ...upcomingEvents.map((e, i) => ({
    id: `ev-${i}`,
    kind: 'event' as SharedKind,
    label: 'Event geteilt',
    title: e.title,
    meta: `${e.date} · ${e.location}`,
    time: e.date,
  })),
  ...posts
    .filter((p) => p.type === 'video' || p.type === 'link' || p.type === 'text' || p.type === 'photo')
    .map((p) => ({
      id: `po-${p.id}`,
      kind: p.type as SharedKind,
      label:
        p.type === 'video' ? 'Video geteilt'
        : p.type === 'link' ? 'Link geteilt'
        : p.type === 'photo' ? 'Foto geteilt'
        : 'Beitrag geteilt',
      title: p.type === 'link' && p.linkTitle ? p.linkTitle : p.text,
      meta: p.type === 'link' ? p.linkDomain : undefined,
      time: p.time,
    })),
]

function SharedRow({ item }: { item: SharedItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border p-4 flex items-start gap-3 hover:border-dark transition-colors"
    >
      <span className="font-sans text-[10px] font-semibold px-2 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold uppercase tracking-wide flex-shrink-0">
        {item.label}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-sans text-sm font-medium leading-snug">{item.title}</p>
        {item.meta && <p className="font-sans text-xs text-text-secondary mt-0.5">{item.meta}</p>}
        <p className="font-sans text-[11px] text-text-secondary/70 mt-1">{item.time}</p>
      </div>
    </motion.div>
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
  const [activeTab, setActiveTab] = useState<'posts' | 'shared'>('posts')

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
              <div className="flex items-center gap-2">
                <button className="font-sans text-sm font-semibold px-5 py-2.5 border-2 border-dark bg-dark text-white hover:bg-accent-gold hover:border-accent-gold transition-all flex items-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  Nachricht
                </button>
                <ShareMenu
                  title={profile.name}
                  text={`${profile.name} auf LAEMU`}
                  align="right"
                  className="font-sans text-sm font-semibold px-3 py-2.5 border-2 border-border text-text-secondary hover:border-dark hover:text-dark transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                </ShareMenu>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-heading text-2xl font-black">{profile.name}</h1>
              {profile.openForFormation && (
                <span className="font-sans text-[10px] inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 font-medium">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  Offen für Formationen
                </span>
              )}
            </div>
            <p className="font-sans text-sm text-accent-gold">{profile.handle}</p>
            <p className="font-sans text-sm font-medium text-dark mb-2">{profile.tagline}</p>
            <p className="font-sans text-sm font-light text-text-secondary leading-relaxed mb-4">{profile.bio}</p>

            <SocialLinks social={profile.social} />

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
            onClick={() => setActiveTab('shared')}
            className={`flex-1 py-3 font-sans text-sm font-medium transition-colors border-b-2 ${activeTab === 'shared' ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}
          >
            Geteilte Beiträge
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'posts' && (
            <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </motion.div>
          )}
          {activeTab === 'shared' && (
            <motion.div key="shared" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <p className="font-sans text-sm text-text-secondary">
                Beiträge, Events, Videos und Links, die {profile.name.split(' ')[0]} geteilt hat.
              </p>
              {sharedItems.map((item) => <SharedRow key={item.id} item={item} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
