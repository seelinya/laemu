'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

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

export default function MemberProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-dark border-b border-white/10 px-6 py-4 flex items-center justify-between">
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
            <p className="font-sans text-sm font-normal text-text-secondary leading-relaxed mb-4">{profile.bio}</p>

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
                <span key={inst} className="font-sans text-xs px-2.5 py-1 bg-surface-muted border border-border text-text-secondary">{inst}</span>
              ))}
              {profile.roles.map((r) => (
                <span key={r} className="font-sans text-xs px-2 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">{r}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
