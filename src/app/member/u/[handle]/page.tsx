'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

type Shares = {
  whatsapp?: string
  instagram?: string
  email?: string
  website?: string
  openForFormation?: boolean
}

type PublicProfile = {
  name: string
  avatar: string
  role?: 'Lehrer' | 'LAEMU Team' | null
  instruments: string[]
  location: string
  formation?: string
  bio: string
  joined: string
  shares: Shares
}

const profiles: Record<string, PublicProfile> = {
  maria: {
    name: 'Maria Kälin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
    instruments: ['Schwyzerörgeli'], location: 'Schwyz', formation: 'Kapelle Alpstein',
    bio: 'Begeisterte Örgelerin aus dem Muotathal. Spiele seit der Kindheit und liebe urchige Innerschwyzer Ländler.',
    joined: 'Mitglied seit Jan 2025',
    shares: { instagram: 'maria.oergeli', openForFormation: true },
  },
  hansruedi: {
    name: 'Hansruedi Wenger', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80', role: 'Lehrer',
    instruments: ['Handorgel', 'Schwyzerörgeli'], location: 'Luzern',
    bio: 'Handorgel-Lehrer bei der LAEMU Musikschule. Über 25 Jahre Bühnenerfahrung in diversen Formationen.',
    joined: 'Lehrperson seit 2024',
    shares: { email: 'hansruedi@laemu.ch', website: 'wenger-musik.ch', openForFormation: false },
  },
  peter: {
    name: 'Peter Gasser', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    instruments: ['Klarinette'], location: 'Stans',
    bio: 'Klarinettist und Hobby-Komponist. Suche eine Formation für regelmässige Stubeten.',
    joined: 'Mitglied seit Feb 2025',
    shares: { whatsapp: '+41 79 123 45 67', openForFormation: true },
  },
  lisa: {
    name: 'Lisa Frei', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    instruments: ['Klavierbegleitung'], location: 'Zug',
    bio: 'Pianistin mit Faible für moderne Ländlermusik. Übe am liebsten mit dem JamPlayer.',
    joined: 'Mitglied seit Dez 2024',
    shares: { instagram: 'lisa.piano', openForFormation: false },
  },
  anna: {
    name: 'Anna Steiner', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
    instruments: ['Handorgel'], location: 'Appenzell',
    bio: 'Einsteigerin auf der Handorgel — motiviert und lernfreudig. Freue mich über Austausch!',
    joined: 'Mitglied seit März 2025',
    shares: { instagram: 'anna.steiner', whatsapp: '+41 78 987 65 43', openForFormation: true },
  },
  cecile: {
    name: 'Cécile Schmidig', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80', role: 'LAEMU Team',
    instruments: ['Handorgel'], location: 'Luzern',
    bio: 'Handorgel-Lehrerin und Teil des LAEMU Teams. Ich begleite dich gerne auf deinem Lernweg.',
    joined: 'LAEMU Team',
    shares: { email: 'cecile@laemu.ch', openForFormation: false },
  },
}

function fallbackProfile(handle: string): PublicProfile {
  const name = handle.charAt(0).toUpperCase() + handle.slice(1)
  return {
    name, avatar: '', instruments: ['Ländlermusik'], location: 'Schweiz',
    bio: 'Dieses Mitglied hat noch keine öffentlichen Infos hinterlegt.',
    joined: 'LAEMU Mitglied', shares: {},
  }
}

function ShareRow({ icon, label, value, href }: { icon: ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-center gap-3 p-3 border border-border bg-surface hover:border-accent-gold transition-colors">
      <span className="text-accent-gold flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="font-sans text-[10px] uppercase tracking-wider text-text-secondary">{label}</p>
        <p className="font-sans text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  )
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : content
}

export default function PublicProfilePage({ params }: { params: { handle: string } }) {
  const profile = profiles[params.handle] ?? fallbackProfile(params.handle)
  const s = profile.shares
  const hasShares = !!(s.whatsapp || s.instagram || s.email || s.website || s.openForFormation)

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-dark text-white px-6 py-3 flex items-center gap-3">
        <button onClick={() => history.back()} className="font-sans text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Zurück
        </button>
        <span className="text-white/30">/</span>
        <span className="font-sans text-sm font-medium">Öffentliches Profil</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border p-6 flex flex-col sm:flex-row gap-6">
          <div className="relative w-28 h-28 overflow-hidden flex-shrink-0 bg-background border border-border">
            {profile.avatar ? (
              <Image src={profile.avatar} alt={profile.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-secondary">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-heading text-2xl font-bold">{profile.name}</h1>
              {profile.role && (
                <span className="font-sans text-[10px] bg-accent-gold text-white px-1.5 py-0.5 inline-flex items-center gap-1 font-medium">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {profile.role}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-text-secondary font-sans text-sm mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>{profile.location}</span>
              <span className="text-border">·</span>
              <span>{profile.joined}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {profile.instruments.map((inst) => (
                <span key={inst} className="font-sans text-xs px-2 py-1 bg-background border border-border text-text-secondary">{inst}</span>
              ))}
              {profile.formation && (
                <span className="font-sans text-xs px-2 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">🎵 {profile.formation}</span>
              )}
            </div>
            <p className="font-sans text-sm text-text-secondary leading-relaxed">{profile.bio}</p>
          </div>
        </motion.div>

        {/* Shared info */}
        {hasShares ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-surface border border-border p-6">
            <h2 className="font-heading font-bold text-lg mb-1">Kontakt & geteilte Infos</h2>
            <p className="font-sans text-xs text-text-secondary mb-4">Diese Angaben hat {profile.name.split(' ')[0]} freiwillig öffentlich geteilt.</p>

            {s.openForFormation && (
              <div className="mb-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 font-sans text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                Offen für Formationen
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {s.whatsapp && (
                <ShareRow label="WhatsApp" value={s.whatsapp} href={`https://wa.me/${s.whatsapp.replace(/[^0-9]/g, '')}`}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>} />
              )}
              {s.instagram && (
                <ShareRow label="Instagram" value={`@${s.instagram}`} href={`https://instagram.com/${s.instagram}`}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>} />
              )}
              {s.email && (
                <ShareRow label="E-Mail" value={s.email} href={`mailto:${s.email}`}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>} />
              )}
              {s.website && (
                <ShareRow label="Website" value={s.website} href={`https://${s.website}`}
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>} />
              )}
            </div>
          </motion.div>
        ) : (
          <div className="bg-surface border border-border p-6 text-center">
            <p className="font-sans text-sm text-text-secondary">{profile.name.split(' ')[0]} hat noch keine Kontaktinfos öffentlich geteilt.</p>
          </div>
        )}
      </div>
    </div>
  )
}
