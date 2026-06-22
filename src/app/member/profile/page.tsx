'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Demo profile data (Hansruedi Wenger) ─────────────────────────────────────

const profile = {
  name: 'Hansruedi Wenger',
  handle: '@hansruedi_handorgel',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  tagline: 'Schweizer Örgeli-Kurslehrer',
  bio: 'Handorgelist und Handorgellehrer aus Luzern. Leidenschaft für Ländlermusik seit über 20 Jahren. Unterrichte auf LAEMU Musikschule und spiele in mehreren Formationen der Innerschweiz.',
  location: 'Luzern LU',
  instruments: ['Handorgel', 'Schwyzerörgeli', 'Hackbrett'],
  formations: ['Hess-Rusch-Hegner', 'Ländlertrio Freiamt'],
  roles: ['Lehrperson', 'Musiker'],
  openForFormation: true,
  social: {
    instagram: 'hansruedi.oergeli',
    whatsapp: '+41 79 123 45 67',
    email: 'hansruedi@laemu.ch',
    facebook: 'hansruedi.wenger.musik',
    tiktok: 'hansruedi_oergeli',
  },
}

// In der Community ergänzt man sein Profil ausschliesslich mit Foto- und
// Video-Beiträgen. Links, Texte und Events lassen sich nicht teilen.
type PostType = 'photo' | 'video'

interface ProfilePost {
  id: number
  time: string
  text: string
  img: string
  likes: number
  comments: number
  type: PostType
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
    time: 'vor 2 Wochen',
    text: 'Unser Konzert war ein voller Erfolg! Danke an alle, die dabei waren — die Energie im Saal war unvergesslich.',
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    likes: 134,
    comments: 41,
    type: 'photo',
  },
  {
    id: 3,
    time: 'vor 3 Wochen',
    text: 'Neue Video-Lektion auf LAEMU Musikschule: Der Zwiefache — Rhythmus und Interpretation.',
    img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80',
    likes: 89,
    comments: 23,
    type: 'video',
  },
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
function IconEmail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
  )
}

function SocialLinks({ social }: { social: typeof profile.social }) {
  const links: { key: string; href: string; icon: React.ReactNode; label: string }[] = []
  if (social.instagram) links.push({ key: 'ig', href: `https://instagram.com/${social.instagram}`, icon: <IconInstagram />, label: 'Instagram' })
  if (social.whatsapp) links.push({ key: 'wa', href: `https://wa.me/${social.whatsapp.replace(/[^0-9]/g, '')}`, icon: <IconWhatsApp />, label: 'WhatsApp' })
  if (social.email) links.push({ key: 'em', href: `mailto:${social.email}`, icon: <IconEmail />, label: 'E-Mail' })
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

// Beiträge anderer Profile lassen sich weder liken noch kommentieren — man kann
// sie aber anklicken und vergrössert anschauen.
function PostCard({ post, onOpen }: { post: ProfilePost; onOpen: () => void }) {
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

      <button onClick={onOpen} className="relative aspect-video overflow-hidden w-full block cursor-zoom-in group" aria-label="Beitrag vergrössern">
        <Image src={post.img} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        {post.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <IconPlay />
            </div>
          </div>
        )}
      </button>

      <div className="p-4">
        <p className="font-sans text-sm font-light text-text-secondary leading-relaxed">{post.text}</p>
      </div>
    </motion.div>
  )
}

function Lightbox({ post, onClose }: { post: ProfilePost; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" aria-label="Schliessen">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-video bg-black overflow-hidden">
          <Image src={post.img} alt="" fill className="object-contain" unoptimized />
          {post.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"><IconPlay /></div>
            </div>
          )}
        </div>
        {post.text && <p className="font-sans text-sm text-white/80 mt-3 text-center">{post.text}</p>}
      </motion.div>
    </motion.div>
  )
}

export default function MemberProfilePage() {
  const [lightbox, setLightbox] = useState<ProfilePost | null>(null)
  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {lightbox && <Lightbox key="lightbox" post={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
      <div className="bg-dark border-b border-dark-secondary px-6 py-4 flex items-center justify-between">
        <Link href="/member/academy" className="flex items-center gap-2 font-sans text-sm text-white/60 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Zurück zur Musikschule
        </Link>
        <h1 className="font-heading font-bold text-base text-white">Profil</h1>
        <div className="w-24" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Profile header — ohne Titelbild */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border overflow-hidden mb-6">
          <div className="p-6">
            <div className="mb-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-border bg-background flex items-center justify-center text-text-secondary flex-shrink-0">
                {profile.avatar ? (
                  <Image src={profile.avatar} alt={profile.name} fill className="object-cover" unoptimized />
                ) : (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                )}
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

        {/* Beiträge — nur Foto & Video */}
        <h2 className="font-heading font-bold text-lg mb-4">Beiträge</h2>
        <div className="space-y-4">
          {posts.map((post) => <PostCard key={post.id} post={post} onOpen={() => setLightbox(post)} />)}
        </div>
      </div>
    </div>
  )
}
