'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemberHeader, MemberBreadcrumb } from '@/components/MemberChrome'

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
  if (social.whatsapp) links.push({ key: 'wa', href: `https://wa.me/${social.whatsapp.replace(/[^0-9]/g, '')}`, icon: <IconWhatsApp />, label: 'Telefon' })
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [scheduledDeletion, setScheduledDeletion] = useState(false)
  useMemberHeader(
    { breadcrumb: <MemberBreadcrumb items={[{ label: 'Musikschule', href: '/member/academy' }, { label: 'Profil' }]} /> },
    'profile',
  )
  return (
    <>
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Profile header — ohne Titelbild */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-xl shadow-soft overflow-hidden mb-6">
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
                <span className="font-sans text-[10px] inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-md font-medium">
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
                <span key={inst} className="font-sans text-xs px-2.5 py-1 rounded-md bg-surface-muted border border-border text-text-secondary">{inst}</span>
              ))}
              {profile.roles.map((r) => (
                <span key={r} className="font-sans text-xs px-2 py-1 rounded-md bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">{r}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Profil löschen (Gefahrenzone) ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-surface border border-border rounded-xl shadow-soft p-6">
          <h2 className="font-heading font-bold text-lg mb-1">Profil löschen</h2>
          {scheduledDeletion ? (
            <div className="mt-3 flex items-start gap-2.5 bg-accent-gold/5 border border-accent-gold/30 rounded-lg px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
              <p className="font-sans text-sm text-text-secondary leading-relaxed">
                Dein Profil wird auf <strong className="text-dark font-medium">Ende deines Abos</strong> gelöscht. Du kannst dies bis dahin jederzeit wieder rückgängig machen, indem du dich beim LAEMU-Team meldest.
              </p>
            </div>
          ) : (
            <>
              <p className="font-sans text-sm text-text-secondary leading-relaxed mb-4">
                Beim Löschen wird dein Profil mit allen Angaben auf das Ende deines Abos entfernt. Bis dahin bleibt dein Zugang bestehen.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="font-sans text-sm px-5 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors"
              >
                Profil löschen
              </button>
            </>
          )}
          <p className="font-sans text-xs text-text-secondary leading-relaxed mt-4 pt-4 border-t border-border">
            Möchtest du dein Profil <strong className="text-dark font-medium">per sofort</strong> löschen, melde dich bitte bei{' '}
            <a href="mailto:musikschule@laemu.ch" className="text-accent-gold hover:underline">musikschule@laemu.ch</a>{' '}
            mit deiner E-Mail-Adresse sowie deinem Vor- und Nachnamen.
          </p>
        </motion.div>
      </div>

      {/* Bestätigungs-Dialog */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="w-11 h-11 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Profil wirklich löschen?</h3>
              <p className="font-sans text-sm text-text-secondary leading-relaxed mb-5">
                Bist du sicher, dass du dein Profil auf <strong className="text-dark font-medium">Ende deines Abos</strong> löschen willst? Dein Zugang bleibt bis dahin bestehen.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="font-sans text-sm px-5 py-2.5 border border-border rounded-lg text-text-secondary hover:border-dark transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => { setScheduledDeletion(true); setShowDeleteModal(false) }}
                  className="font-sans text-sm px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Ja, auf Ende des Abos löschen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
