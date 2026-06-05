'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MemberTabs } from '@/components/MemberTabs'
import { ShareMenu } from '@/components/ShareMenu'

// ─── SVG Icon Set ─────────────────────────────────────────────────────────────

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  )
}
function IconMessage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}
function IconBookmark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  )
}
function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
}
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )
}
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
function IconShare() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  )
}
function IconSave({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  )
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  )
}
function IconCamera() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}
function IconVideo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  )
}
function IconLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  )
}
function IconText() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  )
}
function IconMoreHoriz() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
    </svg>
  )
}
function IconPlay() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  )
}
function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  )
}
function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    </svg>
  )
}
function IconLaptop() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  )
}
function IconBlock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  )
}
function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}
function IconKey() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  )
}
function IconLocation() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function IconBilling() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

interface Post {
  id: number
  user: string
  name: string
  avatar: string
  time: string
  text: string
  img?: string
  likes: number
  comments: number
  type: 'photo' | 'video' | 'event' | 'event-announcement' | 'link' | 'text'
  following: boolean
  linkUrl?: string
  linkTitle?: string
  linkDomain?: string
  eventDate?: string
  eventTime?: string
  eventLocation?: string
}

const mockPosts: Post[] = [
  {
    id: 1,
    user: 'hansruedi_akkordeon',
    name: 'Hansruedi Wenger',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    time: 'vor 2 Stunden',
    text: 'Heute am Probetag in Luzern 🎶 Was für eine Energie — wir bereiten uns auf das Frühlingskonzert vor. Wer kommt am 8. März?',
    img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80',
    likes: 47,
    comments: 12,
    type: 'photo' as const,
    following: false,
  },
  {
    id: 2,
    user: 'maria_oergeli',
    name: 'Maria Kälin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    time: 'vor 5 Stunden',
    text: 'Neues Video online! Eine kleine Improvisation auf meinem Schwyzerörgeli — traditionell, aber mit eigenem Touch. Was meint ihr?',
    img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80',
    likes: 89,
    comments: 23,
    type: 'video' as const,
    following: true,
  },
  {
    id: 3,
    user: 'trio_alpstein',
    name: 'Trio Alpstein',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    time: 'vor 1 Tag',
    text: 'Wir freuen uns: Nächsten Samstag spielen wir beim Dorffest Appenzell! Kommt vorbei und tanzt mit uns durch den Abend.',
    img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=800&q=80',
    likes: 134,
    comments: 41,
    type: 'event' as const,
    following: false,
  },
  {
    id: 4,
    user: 'kapelle_rigi',
    name: 'Kapelle Rigi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    time: 'vor 3 Stunden',
    text: 'Wir suchen noch Mitspieler für unsere Kapelle! Handorgel und Bass sind noch frei. Wer Lust hat, melde sich.',
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    likes: 22,
    comments: 8,
    type: 'photo' as const,
    following: false,
  },
  {
    id: 5,
    user: 'handorgel_hoeck_sz',
    name: 'Handorgelhöck Schwyz',
    avatar: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=100&q=80',
    time: 'vor 5 Tagen',
    text: 'Kommt vorbei und bringt eure Handorgeln mit! Organisiert zusammen mit Familie Camenzind aus Immensee SZ. Wir freuen uns auf einen unvergesslichen Nachmittag.',
    likes: 76,
    comments: 18,
    type: 'event-announcement' as const,
    following: true,
    eventDate: 'So, 31. Mai 2025',
    eventTime: '14–20 Uhr',
    eventLocation: 'Rest. Sagi, Haltikon SZ',
  },
  {
    id: 6,
    user: 'volksmusik_magazin',
    name: 'Volksmusik Magazin',
    avatar: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=100&q=80',
    time: 'vor 2 Tagen',
    text: 'Lesenswerter Beitrag: Wie die Ländlermusik die junge Generation neu begeistert — und was das für die Szene bedeutet.',
    likes: 41,
    comments: 7,
    type: 'link' as const,
    following: true,
    linkUrl: 'https://www.volksmusik.ch/nachwuchs',
    linkTitle: 'Ländlermusik und die Jugend — eine neue Beziehung',
    linkDomain: 'volksmusik.ch',
  },
  {
    id: 7,
    user: 'maria_oergeli',
    name: 'Maria Kälin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    time: 'vor 4 Stunden',
    text: 'Heute war ein wunderschöner Tag auf der Alp — nur das Örgeli und die Stille der Berge. Manchmal braucht es keine Worte. 🏔️',
    likes: 54,
    comments: 9,
    type: 'text' as const,
    following: true,
  },
]

const suggestedProfiles = [
  { name: 'Lisa Frei', handle: '@lisa_piano', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', type: 'Lehrperson' },
  { name: 'Peter Gasser', handle: '@peter_klarinette', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', type: 'Musiker' },
]

const upcomingEvents = [
  { date: '15. Feb', title: 'Community-Abend Luzern', type: 'Community' },
  { date: '22. Feb', title: 'Online-Jam Session', type: 'Online' },
  { date: '01. Mär', title: 'Tanzabend Schwyz', type: 'Tanzabend' },
]

const laemuGroups = [
  { name: 'Handorgel-Onlinekurs', members: 48, icon: '🪗', managed: true },
  { name: 'Schwyzerörgeli-Onlinekurs', members: 34, icon: '🎶', managed: true },
  { name: 'Klavier-Onlinekurs', members: 29, icon: '🎹', managed: true },
]

const navItems = [
  { icon: <IconHome />, label: 'Feed', id: 'feed' },
  { icon: <IconSearch />, label: 'Entdecken', id: 'discover' },
  { icon: <IconMessage />, label: 'Nachrichten', id: 'messages' },
  { icon: <IconUsers />, label: 'Gruppen', id: 'groups' },
  { icon: <IconBookmark />, label: 'Gespeichert', id: 'saved' },
  { icon: <IconUser />, label: 'Mein Profil', id: 'profile' },
  { icon: <IconSettings />, label: 'Einstellungen', id: 'settings' },
]

const knownFormations = [
  { name: 'Ländlerkapelle Hess', id: 'hess' },
  { name: 'Trio Alpstein', id: 'alpstein' },
  { name: 'Quartett Rigi', id: 'rigi' },
]

const communityMentions = [
  { handle: 'hansruedi_akkordeon', name: 'Hansruedi Wenger', type: 'person' as const, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { handle: 'maria_oergeli', name: 'Maria Kälin', type: 'person' as const, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { handle: 'lisa_piano', name: 'Lisa Frei', type: 'person' as const, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
  { handle: 'peter_klarinette', name: 'Peter Gasser', type: 'person' as const, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { handle: 'trio_alpstein', name: 'Trio Alpstein', type: 'formation' as const, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', href: '/formations/alpstein' },
  { handle: 'kapelle_hess', name: 'Ländlerkapelle Hess', type: 'formation' as const, img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=100&q=80', href: '/formations/hess' },
  { handle: 'quartett_rigi', name: 'Quartett Rigi', type: 'formation' as const, img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=100&q=80', href: '/formations/rigi' },
]

const conversations = [
  { name: 'Hansruedi Wenger', handle: '@hansruedi_akkordeon', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', last: 'Auf bald am Konzert!', time: '10:24', unread: 2 },
  { name: 'Maria Kälin', handle: '@maria_oergeli', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', last: 'Danke für das Feedback 🙏', time: 'Gestern', unread: 0 },
  { name: 'Handorgel-Onlinekurs', handle: 'Gruppe · 48 Mitglieder', img: '', last: 'Niklaus: Bis morgen dann!', time: 'Mo', unread: 5, isGroup: true },
]

// ─── Components ───────────────────────────────────────────────────────────────

type PostComment = { id: string; name: string; avatar: string; text: string; time: string; liked: boolean; likes: number }

const initialPostComments: PostComment[] = [
  { id: 'pc1', name: 'Maria Kälin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', text: 'Wunderschön! 🎶 Da wäre ich gerne dabei.', time: 'vor 1 Std.', liked: false, likes: 3 },
  { id: 'pc2', name: 'Peter Gasser', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', text: 'Tönt super — viel Erfolg beim Konzert!', time: 'vor 40 Min.', liked: false, likes: 1 },
]

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showComment, setShowComment] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [comments, setComments] = useState<PostComment[]>(() => initialPostComments.slice(0, Math.max(0, Math.min(2, post.comments))))
  const [commentCount, setCommentCount] = useState(post.comments)
  const [commentText, setCommentText] = useState('')

  const addComment = () => {
    const t = commentText.trim()
    if (!t) return
    setComments((prev) => [
      ...prev,
      { id: `pc-${Date.now()}`, name: 'Niklaus Hess', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', text: t, time: 'Gerade eben', liked: false, likes: 0 },
    ])
    setCommentCount((c) => c + 1)
    setCommentText('')
  }

  const toggleCommentLike = (id: string) =>
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c)))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border overflow-hidden"
    >
      <div className="p-4 flex items-center gap-3">
        <Link href="/member/profile" className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
          <Image src={post.avatar} alt={post.user} fill className="object-cover" unoptimized />
        </Link>
        <div className="flex-1">
          <Link href="/member/profile" className="font-heading font-bold text-sm hover:text-accent-gold transition-colors">{post.name}</Link>
          <div className="flex items-center gap-2">
            <p className="font-sans text-xs text-text-secondary">@{post.user}</p>
            <span className="text-text-secondary text-xs">·</span>
            <p className="font-sans text-xs text-text-secondary">{post.time}</p>
          </div>
        </div>
        {(post.type === 'event' || post.type === 'event-announcement') && (
          <span className="font-sans text-[10px] font-semibold px-2 py-1 bg-accent-gold text-white tracking-wide uppercase">Event</span>
        )}
        {post.type === 'video' && (
          <span className="font-sans text-[10px] font-semibold px-2 py-1 bg-dark text-white tracking-wide uppercase">Video</span>
        )}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-background rounded-full transition-colors text-text-secondary"
          >
            <IconMoreHoriz />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 top-9 bg-surface border border-border shadow-xl z-10 min-w-[180px]"
              >
                <button
                  onClick={() => { setSaved(!saved); setShowMenu(false) }}
                  className="w-full text-left px-4 py-3 font-sans text-sm hover:bg-background transition-colors flex items-center gap-2.5"
                >
                  <IconSave filled={saved} />
                  {saved ? 'Gespeichert' : 'Als Inspiration speichern'}
                </button>
                <button className="w-full text-left px-4 py-3 font-sans text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5">
                  <IconBlock /> Profil blockieren
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {post.img && (
        <div className="relative aspect-video overflow-hidden">
          <Image src={post.img} alt={post.user} fill className="object-cover" unoptimized />
          {post.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <IconPlay />
              </div>
            </div>
          )}
        </div>
      )}
      {post.type === 'link' && post.linkUrl && (
        <a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="mx-4 mb-3 border border-border p-4 bg-background hover:border-dark transition-colors cursor-pointer flex items-start gap-3 block">
          <div className="flex-1">
            <p className="font-sans text-[10px] text-text-secondary uppercase tracking-wider mb-1">{post.linkDomain}</p>
            <p className="font-sans text-sm font-medium leading-snug">{post.linkTitle}</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-text-secondary mt-0.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      )}
      {post.type === 'event-announcement' && post.eventDate && (
        <div className="mx-4 mb-3 bg-dark text-white p-5">
          <p className="font-sans text-[10px] text-accent-gold uppercase tracking-widest mb-2">SAVE THE DATE</p>
          <p className="font-heading text-2xl font-bold mb-3">{post.eventDate}</p>
          <div className="flex items-center gap-4 text-sm font-sans">
            <span className="text-white/70">{post.eventTime}</span>
            <span className="text-white/30">·</span>
            <span className="text-white/70">{post.eventLocation}</span>
          </div>
        </div>
      )}

      <div className="p-4">
        <p className="font-sans text-sm font-light text-text-secondary mb-4 leading-relaxed">{post.text}</p>
        <div className="flex items-center gap-3 sm:gap-4 pt-3 border-t border-border">
          <button
            onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1) }}
            className={`flex items-center gap-1.5 font-sans text-sm transition-colors ${liked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}
          >
            <IconHeart filled={liked} />
            <span className="text-xs">{likeCount}</span>
          </button>
          <button
            onClick={() => setShowComment(!showComment)}
            className={`flex items-center gap-1.5 font-sans text-sm transition-colors ${showComment ? 'text-dark' : 'text-text-secondary hover:text-dark'}`}
          >
            <IconComment />
            <span className="text-xs">{commentCount}</span>
          </button>
          <ShareMenu title={post.name} text={post.text} className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-dark transition-colors">
            <IconShare />
            <span className="text-xs hidden sm:inline">Teilen</span>
          </ShareMenu>
          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-1.5 font-sans text-sm ml-auto transition-colors ${saved ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold'}`}
          >
            <IconSave filled={saved} />
            <span className="text-xs hidden sm:inline">{saved ? 'Gespeichert' : 'Speichern'}</span>
          </button>
        </div>
        <AnimatePresence>
          {showComment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-border overflow-hidden"
            >
              {/* Kommentarliste */}
              {comments.length > 0 && (
                <div className="space-y-3 mb-3">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={c.avatar} alt={c.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-background border border-border px-3 py-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-sans font-semibold text-xs">{c.name}</span>
                            <span className="font-sans text-[10px] text-text-secondary">{c.time}</span>
                          </div>
                          <p className="font-sans text-sm font-light text-dark leading-snug break-words">{c.text}</p>
                        </div>
                        <button
                          onClick={() => toggleCommentLike(c.id)}
                          className={`mt-1 flex items-center gap-1 font-sans text-[11px] transition-colors ${c.liked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}
                        >
                          <IconHeart filled={c.liked} />
                          {c.likes > 0 && <span>{c.likes}</span>}
                          <span>Gefällt mir</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Eingabe */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addComment() }}
                  placeholder="Kommentar schreiben..."
                  className="flex-1 min-w-0 border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark bg-background"
                />
                <button onClick={addComment} disabled={!commentText.trim()} className="bg-dark text-white px-3 py-2 font-sans text-sm hover:bg-accent-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
                  Senden
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function FormationCreateModal({ initialName, onClose }: { initialName: string; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [formName, setFormName] = useState(initialName)
  const [formType, setFormType] = useState('Duo')
  const [region, setRegion] = useState('')
  const [members, setMembers] = useState('')

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }} className="bg-surface w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="font-heading font-bold text-sm">Formation-Profil erstellen</p>
            <p className="font-sans text-xs text-text-secondary">Schritt {step} von 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors text-text-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {/* Step indicators */}
        <div className="flex border-b border-border">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-1 transition-colors ${s <= step ? 'bg-dark' : 'bg-border'}`} />
          ))}
        </div>
        <div className="p-5 space-y-4">
          {step === 1 && (
            <>
              <p className="font-sans text-xs text-text-secondary uppercase tracking-widest mb-1">Name der Formation</p>
              <input value={formName} onChange={e => setFormName(e.target.value)} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" placeholder="z.B. Kapelle Hess-Ruedi" />
              <div>
                <p className="font-sans text-xs text-text-secondary uppercase tracking-widest mb-2">Art der Formation</p>
                <div className="grid grid-cols-4 gap-2">
                  {['Duo', 'Trio', 'Quartett', 'Kapelle'].map(t => (
                    <button key={t} onClick={() => setFormType(t)} className={`py-2 font-sans text-xs font-medium border transition-colors ${formType === t ? 'bg-dark text-white border-dark' : 'border-border hover:border-dark'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <p className="font-sans text-xs text-text-secondary uppercase tracking-widest mb-1">Region</p>
                <input value={region} onChange={e => setRegion(e.target.value)} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" placeholder="z.B. Zentralschweiz" />
              </div>
              <div>
                <p className="font-sans text-xs text-text-secondary uppercase tracking-widest mb-1">Mitglieder (kommagetrennt)</p>
                <input value={members} onChange={e => setMembers(e.target.value)} className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark" placeholder="z.B. @niklaus_hess, @maria_oergeli" />
              </div>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">Mitglieder erhalten eine Einladung und müssen das Profil bestätigen.</p>
            </>
          )}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4973A" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <p className="font-heading font-bold text-lg mb-1">{formName}</p>
              <p className="font-sans text-sm text-text-secondary mb-2">{formType} · {region || 'Schweiz'}</p>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">Das Formation-Profil wird nach der Bestätigung aller Mitglieder öffentlich sichtbar und kann dann getaggt werden.</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-border">
          {step > 1
            ? <button onClick={() => setStep(s => s - 1)} className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors">Zurück</button>
            : <button onClick={onClose} className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors">Abbrechen</button>
          }
          {step < 3
            ? <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !formName.trim()} className="font-sans text-sm px-5 py-2 bg-dark text-white hover:bg-accent-gold transition-colors disabled:opacity-40">Weiter →</button>
            : <button onClick={onClose} className="font-sans text-sm px-5 py-2 bg-accent-gold text-white hover:bg-dark transition-colors">Einladungen senden ✓</button>
          }
        </div>
      </motion.div>
    </div>
  )
}

function PostComposerModal({ initialType, onClose }: { initialType: 'text' | 'photo' | 'video' | 'link'; onClose: () => void }) {
  const [type, setType] = useState<'text' | 'photo' | 'video' | 'link'>(initialType)
  const [text, setText] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [mentions, setMentions] = useState<typeof communityMentions>([])
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')

  const types = [
    { id: 'text' as const, label: 'Text', icon: <IconText /> },
    { id: 'photo' as const, label: 'Foto', icon: <IconCamera /> },
    { id: 'video' as const, label: 'Video', icon: <IconVideo /> },
    { id: 'link' as const, label: 'Link', icon: <IconLink /> },
  ]

  // @mention detection
  const atMatch = text.match(/@(\w*)$/)
  const mentionQuery = atMatch ? atMatch[1].toLowerCase() : null
  const mentionSuggestions = mentionQuery !== null
    ? communityMentions.filter(m =>
        m.handle.toLowerCase().startsWith(mentionQuery) || m.name.toLowerCase().includes(mentionQuery)
      ).slice(0, 5)
    : []

  const insertMention = (m: typeof communityMentions[0]) => {
    const newText = text.replace(/@\w*$/, `@${m.handle} `)
    setText(newText)
    if (!mentions.find(x => x.handle === m.handle)) setMentions(prev => [...prev, m])
  }

  const canPost = text.trim().length > 0 || type === 'photo' || type === 'video'

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-surface w-full max-w-lg overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="You" fill className="object-cover" unoptimized />
            </div>
            <div>
              <p className="font-heading font-bold text-sm">Niklaus Hess</p>
              <p className="font-sans text-xs text-accent-gold">@niklaus_hess</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors text-text-secondary hover:text-dark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Type tabs */}
        <div className="flex border-b border-border">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 font-sans text-xs font-medium transition-colors border-b-2 ${type === t.id ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={type === 'link' ? 'Beschreibe den Link…' : 'Was möchtest du teilen? Tippe @ um jemanden zu erwähnen.'}
              rows={type === 'link' ? 2 : 4}
              className="w-full font-sans text-sm font-light focus:outline-none resize-none bg-transparent placeholder:text-border"
              autoFocus
            />
            {/* @mention suggestions */}
            <AnimatePresence>
              {mentionSuggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute left-0 right-0 bg-surface border border-border shadow-xl z-10">
                  {mentionSuggestions.map(m => (
                    <button key={m.handle} onClick={() => insertMention(m)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-background transition-colors text-left">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={m.img} alt={m.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-medium truncate">{m.name}</p>
                        <p className="font-sans text-xs text-text-secondary">@{m.handle} · {m.type === 'formation' ? 'Formation' : 'Musiker/in'}</p>
                      </div>
                      {m.type === 'formation' && <span className="font-sans text-[10px] text-accent-gold font-semibold uppercase tracking-wide">Formation</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Mention chips */}
          {mentions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2 mb-1">
              {mentions.map(m => (
                <span key={m.handle} className={`inline-flex items-center gap-1 font-sans text-xs px-2 py-0.5 rounded-full ${m.type === 'formation' ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/30' : 'bg-dark/5 text-dark border border-dark/20'}`}>
                  @{m.handle}
                  <button onClick={() => setMentions(prev => prev.filter(x => x.handle !== m.handle))} className="ml-0.5 opacity-50 hover:opacity-100">×</button>
                </span>
              ))}
            </div>
          )}

          {type === 'photo' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 border-2 border-dashed border-border hover:border-dark transition-colors p-8 text-center cursor-pointer group"
            >
              <div className="flex justify-center mb-2 text-text-secondary group-hover:text-dark transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <p className="font-sans text-sm text-text-secondary">Foto auswählen</p>
              <p className="font-sans text-xs text-text-secondary/60 mt-1">PNG, JPG bis 10 MB</p>
            </motion.div>
          )}

          {type === 'video' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 border-2 border-dashed border-border hover:border-dark transition-colors p-8 text-center cursor-pointer group"
            >
              <div className="flex justify-center mb-2 text-text-secondary group-hover:text-dark transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <p className="font-sans text-sm text-text-secondary">Video hochladen</p>
              <p className="font-sans text-xs text-text-secondary/60 mt-1">MP4, MOV bis 500 MB</p>
            </motion.div>
          )}

          {type === 'link' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 space-y-2"
            >
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://"
                className="w-full border border-border px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-dark bg-background"
              />
              {linkUrl && (
                <div className="border border-border p-3 bg-background flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-gold flex-shrink-0" />
                  <p className="font-sans text-xs text-text-secondary">Link-Vorschau wird nach dem Posten generiert</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Visibility toggle */}
        <div className="px-5 pb-2">
          <p className="font-sans text-xs text-text-secondary uppercase tracking-widest mb-2">Sichtbarkeit</p>
          <div className="inline-flex border border-border overflow-hidden">
            <button
              onClick={() => setVisibility('public')}
              className={`flex items-center gap-1.5 px-4 py-2 font-sans text-xs font-medium transition-colors ${visibility === 'public' ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              Öffentlich posten
            </button>
            <button
              onClick={() => setVisibility('private')}
              className={`flex items-center gap-1.5 px-4 py-2 font-sans text-xs font-medium transition-colors border-l border-border ${visibility === 'private' ? 'bg-dark text-white' : 'text-text-secondary hover:text-dark'}`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Nur für mich / Privat
            </button>
          </div>
          {visibility === 'private' && (
            <p className="font-sans text-[11px] text-text-secondary mt-2 leading-relaxed">Privat gespeicherte Notizen sind nur für dich sichtbar — sie erscheinen nicht im Feed.</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border">
          <p className="font-sans text-xs text-text-secondary">
            {text.length > 0 && `${text.length} Zeichen`}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors">
              Abbrechen
            </button>
            <button
              onClick={onClose}
              disabled={!canPost}
              className="font-sans text-sm px-5 py-2 bg-dark text-white hover:bg-accent-gold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {visibility === 'public' ? 'Öffentlich posten' : 'Privat speichern'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function FeedView() {
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerType, setComposerType] = useState<'text' | 'photo' | 'video' | 'link'>('text')
  const posts = mockPosts

  const openComposer = (type: 'text' | 'photo' | 'video' | 'link') => {
    setComposerType(type)
    setComposerOpen(true)
  }

  return (
    <>
      <AnimatePresence>
        {composerOpen && (
          <PostComposerModal
            key="composer"
            initialType={composerType}
            onClose={() => setComposerOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Post composer */}
        <div className="bg-surface border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="You" fill className="object-cover" unoptimized />
            </div>
            <button
              onClick={() => openComposer('text')}
              className="flex-1 border border-border px-4 py-3 font-sans text-sm font-light text-text-secondary text-left bg-background hover:border-dark transition-colors"
            >
              Was möchtest du teilen?
            </button>
          </div>
          <div className="flex items-center gap-1 border-t border-border pt-3">
            <button onClick={() => openComposer('photo')} className="flex items-center gap-1.5 font-sans text-xs text-text-secondary hover:text-dark px-3 py-2 hover:bg-background transition-colors">
              <IconCamera /> Foto
            </button>
            <button onClick={() => openComposer('video')} className="flex items-center gap-1.5 font-sans text-xs text-text-secondary hover:text-dark px-3 py-2 hover:bg-background transition-colors">
              <IconVideo /> Video
            </button>
            <button onClick={() => openComposer('link')} className="flex items-center gap-1.5 font-sans text-xs text-text-secondary hover:text-dark px-3 py-2 hover:bg-background transition-colors">
              <IconLink /> Link
            </button>
            <button onClick={() => openComposer('text')} className="flex items-center gap-1.5 font-sans text-xs text-text-secondary hover:text-dark px-3 py-2 hover:bg-background transition-colors">
              <IconText /> Text
            </button>
            <button onClick={() => openComposer('text')} className="ml-auto bg-dark text-white font-sans text-sm font-medium px-5 py-2 hover:bg-accent-gold transition-colors">
              Posten
            </button>
          </div>
        </div>

        {/* Linear chronological feed — neueste zuerst */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="font-heading font-bold text-sm">Aktuelle Beiträge</h2>
          <span className="font-sans text-xs text-text-secondary">Neueste zuerst</span>
        </div>

        {posts.map((post) => <PostCard key={post.id} post={post} />)}

        <button className="w-full py-4 font-sans text-sm text-text-secondary border border-border hover:bg-surface hover:text-dark transition-colors">
          Mehr laden…
        </button>
      </div>
    </>
  )
}

function MessagesView() {
  const [activeConv, setActiveConv] = useState<number | null>(0)
  const [msg, setMsg] = useState('')

  return (
    <div className="bg-surface border border-border overflow-hidden" style={{ minHeight: '500px' }}>
      <div className="flex h-full" style={{ minHeight: '500px' }}>
        <div className="w-72 border-r border-border flex-shrink-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm">Nachrichten</h3>
            <button className="font-sans text-xs text-accent-gold hover:text-dark transition-colors">+ Neu</button>
          </div>
          <div>
            {conversations.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveConv(i)}
                className={`w-full flex items-center gap-3 p-4 border-b border-border transition-colors text-left ${activeConv === i ? 'bg-dark text-white' : 'hover:bg-background'}`}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-border flex items-center justify-center">
                  {c.img ? <Image src={c.img} alt={c.name} fill className="object-cover" unoptimized /> : <IconUsers />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className={`font-sans font-semibold text-xs truncate ${activeConv === i ? 'text-white' : ''}`}>{c.name}</p>
                    <span className={`font-sans text-[10px] ml-1 flex-shrink-0 ${activeConv === i ? 'text-white/60' : 'text-text-secondary'}`}>{c.time}</span>
                  </div>
                  <p className={`font-sans text-xs truncate ${activeConv === i ? 'text-white/70' : 'text-text-secondary'}`}>{c.last}</p>
                </div>
                {c.unread > 0 && (
                  <span className="bg-accent-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">{c.unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {activeConv !== null ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-border">
                {conversations[activeConv].img && (
                  <Image src={conversations[activeConv].img} alt="" fill className="object-cover" unoptimized />
                )}
              </div>
              <div>
                <p className="font-heading font-bold text-sm">{conversations[activeConv].name}</p>
                <p className="font-sans text-xs text-text-secondary">{conversations[activeConv].handle}</p>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ minHeight: '300px' }}>
              <div className="flex justify-start">
                <div className="bg-background border border-border px-3 py-2 max-w-xs">
                  <p className="font-sans text-sm font-light">Hoi! Wann ist das nächste Treffen?</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-dark text-white px-3 py-2 max-w-xs">
                  <p className="font-sans text-sm font-light">Am Samstag um 14 Uhr!</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-background border border-border px-3 py-2 max-w-xs">
                  <p className="font-sans text-sm font-light">{conversations[activeConv].last}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <input
                value={msg}
                onChange={e => setMsg(e.target.value)}
                type="text"
                placeholder="Nachricht schreiben…"
                className="flex-1 border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark"
              />
              <button className="bg-dark text-white px-4 py-2 font-sans text-sm hover:bg-accent-gold transition-colors">
                Senden
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-sans text-text-secondary text-sm font-light">Wähle eine Unterhaltung</p>
          </div>
        )}
      </div>
    </div>
  )
}

const groupCourseLinks: Record<string, string> = {
  'Handorgel-Onlinekurs': '/member/academy',
  'Schwyzerörgeli-Onlinekurs': '/member/academy',
  'Klavier-Onlinekurs': '/member/academy',
}

function GroupsView() {
  const [joined, setJoined] = useState<Record<string, boolean>>({})
  const [joining, setJoining] = useState<string | null>(null)

  const handleJoin = (name: string) => {
    setJoining(name)
    setTimeout(() => {
      setJoined(prev => ({ ...prev, [name]: true }))
      setJoining(null)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6">
        <h3 className="font-heading font-bold text-lg mb-2">LAEMU-Gruppen</h3>
        <p className="font-sans text-sm font-light text-text-secondary mb-6 leading-relaxed">
          Gruppen werden ausschliesslich von LAEMU verwaltet — für Onlinekurse und Events. Möchtest du eine eigene Gruppe starten? Poste einen Beitrag mit einem öffentlichen WhatsApp-Link.
        </p>
        <div className="space-y-3">
          {laemuGroups.map((g) => (
            <div key={g.name} className={`flex items-center gap-4 p-4 border transition-colors group ${joined[g.name] ? 'border-accent-gold bg-accent-gold/5' : 'border-border hover:border-dark'}`}>
              <span className="text-2xl">{g.icon}</span>
              <div className="flex-1">
                <p className="font-sans font-semibold text-sm">{g.name}</p>
                <p className="font-sans text-xs font-light text-text-secondary">{g.members} Mitglieder · Verwaltet von LAEMU</p>
              </div>
              {joined[g.name] ? (
                <Link href={groupCourseLinks[g.name] ?? '/member/academy'} className="font-sans text-xs font-medium text-accent-gold border border-accent-gold px-3 py-1.5 hover:bg-accent-gold hover:text-white transition-colors">
                  Zum Kurs →
                </Link>
              ) : (
                <button
                  onClick={() => handleJoin(g.name)}
                  disabled={joining === g.name}
                  className="font-sans text-xs text-dark border border-dark px-3 py-1.5 hover:bg-dark hover:text-white transition-colors disabled:opacity-60"
                >
                  {joining === g.name ? 'Beitrete…' : 'Beitreten'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-dark p-6">
        <p className="font-sans text-sm font-light text-white/70 leading-relaxed">
          <strong className="text-white font-semibold">Eigene Gruppe gründen?</strong> Erstelle einen öffentlichen Beitrag in der Community mit deinem WhatsApp-Gruppenlink.
        </p>
      </div>
    </div>
  )
}

function SavedView() {
  return (
    <div className="space-y-4">
      <h3 className="font-heading font-bold text-lg">Gespeicherte Beiträge</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockPosts.slice(0, 2).map((post) => (
          <div key={post.id} className="bg-surface border border-border overflow-hidden group">
            <div className="relative aspect-video overflow-hidden">
              <Image src={post.img ?? ''} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 p-3">
                <p className="font-heading text-white text-sm font-bold">{post.name}</p>
                <p className="font-sans text-white/70 text-xs font-light line-clamp-2">{post.text}</p>
              </div>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="font-sans text-xs font-light text-text-secondary">{post.time}</span>
              <button className="font-sans text-xs text-red-500 hover:text-red-700 transition-colors">Entfernen</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfileView() {
  const [editMode, setEditMode] = useState(false)
  const [eventsVisible, setEventsVisible] = useState(true)
  const [composerOpen, setComposerOpen] = useState(false)
  const [createFormationName, setCreateFormationName] = useState<string | null>(null)
  const [profileTab, setProfileTab] = useState<'posts' | 'shared'>('posts')

  // Committed profile values
  const [name, setName] = useState('Niklaus Hess')
  const [bio, setBio] = useState('Handorgelist aus Luzern. Leidenschaft für Ländlermusik seit 20 Jahren.')
  const [formation, setFormation] = useState('Kapelle Hess-Ruedi')
  const [instruments, setInstruments] = useState('Handorgel, Schwyzerörgeli')
  const [vorbilder, setVorbilder] = useState('Ruedi Rymann, Kapelle Hess-Ruedi-Hegner')
  const [openForFormation, setOpenForFormation] = useState(false)
  const [instagram, setInstagram] = useState('niklaus.hess')
  const [whatsapp, setWhatsapp] = useState('')
  const [facebook, setFacebook] = useState('')
  const [tiktok, setTiktok] = useState('')

  // Draft values (live while editing)
  const [draftName, setDraftName] = useState('')
  const [draftBio, setDraftBio] = useState('')
  const [draftFormation, setDraftFormation] = useState('')
  const [draftInstruments, setDraftInstruments] = useState('')
  const [draftVorbilder, setDraftVorbilder] = useState('')
  const [draftOpenForFormation, setDraftOpenForFormation] = useState(false)
  const [draftInstagram, setDraftInstagram] = useState('')
  const [draftWhatsapp, setDraftWhatsapp] = useState('')
  const [draftFacebook, setDraftFacebook] = useState('')
  const [draftTiktok, setDraftTiktok] = useState('')

  const startEdit = () => {
    setDraftName(name)
    setDraftBio(bio)
    setDraftFormation(formation)
    setDraftInstruments(instruments)
    setDraftVorbilder(vorbilder)
    setDraftOpenForFormation(openForFormation)
    setDraftInstagram(instagram)
    setDraftWhatsapp(whatsapp)
    setDraftFacebook(facebook)
    setDraftTiktok(tiktok)
    setEditMode(true)
  }

  const saveEdit = () => {
    setName(draftName.trim() || name)
    setBio(draftBio)
    setFormation(draftFormation)
    setInstruments(draftInstruments)
    setVorbilder(draftVorbilder)
    setOpenForFormation(draftOpenForFormation)
    setInstagram(draftInstagram.trim())
    setWhatsapp(draftWhatsapp.trim())
    setFacebook(draftFacebook.trim())
    setTiktok(draftTiktok.trim())
    setEditMode(false)
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {composerOpen && (
          <PostComposerModal key="profile-composer" initialType="text" onClose={() => setComposerOpen(false)} />
        )}
        {createFormationName && (
          <FormationCreateModal key="formation-create" initialName={createFormationName} onClose={() => setCreateFormationName(null)} />
        )}
      </AnimatePresence>

      {/* Profile header */}
      <div className="bg-surface border border-border overflow-hidden">
        <div className="h-36 bg-gradient-to-r from-dark via-dark-secondary to-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px)' }}
          />
          {editMode && (
            <button className="absolute bottom-3 right-3 bg-white/20 text-white text-xs px-3 py-1.5 font-sans hover:bg-white/30 transition-colors">
              Titelbild ändern
            </button>
          )}
        </div>
        <div className="p-6 -mt-10">
          <div className="flex items-end justify-between mb-5">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-surface bg-background">
              <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" alt="Profile" fill className="object-cover" unoptimized />
              {editMode && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                  <span className="text-white"><IconEdit /></span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="font-sans text-sm px-4 py-2 border border-border hover:border-dark transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={saveEdit}
                    className="font-sans text-sm font-semibold px-4 py-2 bg-accent-gold text-white hover:bg-dark transition-colors"
                  >
                    Speichern ✓
                  </button>
                </>
              ) : (
                <button
                  onClick={startEdit}
                  className="font-sans text-sm font-medium px-4 py-2 border border-border hover:border-dark transition-colors"
                >
                  Profil bearbeiten
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {editMode ? (
              <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] block mb-1">Profilname *</label>
                  <input value={draftName} onChange={e => setDraftName(e.target.value)} className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                </div>
                <div>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] block mb-1">Bio</label>
                  <textarea value={draftBio} onChange={e => setDraftBio(e.target.value)} rows={3} className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] block mb-1">Formation(en)</label>
                    <input value={draftFormation} onChange={e => setDraftFormation(e.target.value)} placeholder="Mehrere: kommagetrennt" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                    {/* Formation picker suggestions */}
                    {draftFormation.length > 0 && (
                      <div className="border border-border bg-surface mt-0.5 shadow-sm">
                        {knownFormations.filter(kf => kf.name.toLowerCase().includes(draftFormation.split(',').pop()!.trim().toLowerCase())).map(kf => (
                          <button key={kf.id} onClick={() => {
                            const parts = draftFormation.split(',').map(s => s.trim()).filter(Boolean)
                            parts[parts.length - 1] = kf.name
                            setDraftFormation(parts.join(', '))
                          }} className="w-full text-left px-3 py-2 font-sans text-xs hover:bg-background transition-colors flex items-center gap-2">
                            <span className="text-accent-gold">✓</span> {kf.name}
                          </button>
                        ))}
                        <button onClick={() => setCreateFormationName(draftFormation.split(',').pop()!.trim())} className="w-full text-left px-3 py-2 font-sans text-xs text-text-secondary hover:bg-background transition-colors flex items-center gap-2 border-t border-border">
                          <span>+</span> «{draftFormation.split(',').pop()!.trim()}» als neue Formation erfassen…
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] block mb-1">Instrumente</label>
                    <input value={draftInstruments} onChange={e => setDraftInstruments(e.target.value)} className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                  </div>
                </div>
                <div>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] block mb-1">Musikalische Vorbilder</label>
                  <input value={draftVorbilder} onChange={e => setDraftVorbilder(e.target.value)} className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                </div>

                {/* Social-media links (managed outside the post stream) */}
                <div className="pt-4 border-t border-border">
                  <p className="font-sans text-xs text-text-secondary uppercase tracking-[0.15em] mb-3">Social Media</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">Instagram</label>
                      <input value={draftInstagram} onChange={e => setDraftInstagram(e.target.value)} placeholder="benutzername" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">WhatsApp</label>
                      <input value={draftWhatsapp} onChange={e => setDraftWhatsapp(e.target.value)} placeholder="+41 79 …" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">Facebook</label>
                      <input value={draftFacebook} onChange={e => setDraftFacebook(e.target.value)} placeholder="profil-name" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-text-secondary block mb-1">TikTok</label>
                      <input value={draftTiktok} onChange={e => setDraftTiktok(e.target.value)} placeholder="@benutzername" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                    </div>
                  </div>
                </div>

                {/* Offen für eine Formation */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-sans text-sm font-medium">Offen für eine Formation</p>
                    <p className="font-sans text-xs text-text-secondary mt-0.5">
                      {draftOpenForFormation ? 'Andere sehen, dass du eine Formation suchst.' : 'Zeige, dass du für eine Formation offen bist.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setDraftOpenForFormation(v => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${draftOpenForFormation ? 'bg-accent-gold' : 'bg-border'}`}
                    aria-label="Offen für eine Formation"
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${draftOpenForFormation ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Events toggle inside edit mode */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-sans text-sm font-medium">Event-Teilnahmen sichtbar</p>
                    <p className="font-sans text-xs text-text-secondary mt-0.5">
                      {eventsVisible ? 'Andere Nutzer sehen deine Events.' : 'Events sind für andere ausgeblendet.'}
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
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-heading text-2xl font-black">{name}</h2>
                  {openForFormation && (
                    <span className="font-sans text-[10px] font-semibold px-2 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold uppercase tracking-wide">Offen für Formationen</span>
                  )}
                </div>
                <p className="font-sans text-sm text-accent-gold mb-2">@niklaus_hess</p>
                <p className="font-sans text-sm font-light text-text-secondary mb-4 leading-relaxed">{bio}</p>

                {/* Social-media links */}
                {(instagram || whatsapp || facebook || tiktok) && (
                  <div className="flex items-center gap-2 mb-4">
                    {instagram && (
                      <a href={`https://instagram.com/${instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" title={`Instagram: ${instagram}`} className="w-8 h-8 flex items-center justify-center border border-border hover:border-dark hover:text-accent-gold text-text-secondary transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                      </a>
                    )}
                    {whatsapp && (
                      <a href={`https://wa.me/${whatsapp.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer" title={`WhatsApp: ${whatsapp}`} className="w-8 h-8 flex items-center justify-center border border-border hover:border-dark hover:text-accent-gold text-text-secondary transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
                      </a>
                    )}
                    {facebook && (
                      <a href={`https://facebook.com/${facebook.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" title={`Facebook: ${facebook}`} className="w-8 h-8 flex items-center justify-center border border-border hover:border-dark hover:text-accent-gold text-text-secondary transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                      </a>
                    )}
                    {tiktok && (
                      <a href={`https://tiktok.com/@${tiktok.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" title={`TikTok: ${tiktok}`} className="w-8 h-8 flex items-center justify-center border border-border hover:border-dark hover:text-accent-gold text-text-secondary transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>
                      </a>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {instruments.split(',').map(i => (
                    <span key={i} className="font-sans text-xs px-2 py-1 bg-background border border-border">{i.trim()}</span>
                  ))}
                  {formation.split(',').map(f => {
                    const trimmed = f.trim()
                    const known = knownFormations.find(kf => kf.name.toLowerCase() === trimmed.toLowerCase())
                    return known
                      ? <span key={f} className="font-sans text-xs px-2 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold">Formation: {trimmed}</span>
                      : <button key={f} onClick={() => setCreateFormationName(trimmed)} title="Kein öffentliches Profil vorhanden — jetzt erstellen" className="font-sans text-xs px-2 py-1 bg-background border border-dashed border-border hover:border-dark transition-colors flex items-center gap-1">Formation: {trimmed} <span className="text-text-secondary">+</span></button>
                  })}
                </div>
                {vorbilder && (
                  <p className="font-sans text-xs text-text-secondary mb-3">
                    <span className="font-medium text-dark">Vorbilder:</span> {vorbilder}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs font-sans text-text-secondary mb-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {eventsVisible
                      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                      : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    }
                  </svg>
                  Events: {eventsVisible ? 'für andere sichtbar' : 'ausgeblendet'}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border text-center">
                  <div>
                    <p className="font-heading font-black text-xl">48</p>
                    <p className="font-sans text-xs font-light text-text-secondary">Beiträge</p>
                  </div>
                  <div>
                    <p className="font-heading font-black text-xl">12</p>
                    <p className="font-sans text-xs font-light text-text-secondary">Gespeichert</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Profile content tabs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex border-b border-border">
            <button
              onClick={() => setProfileTab('posts')}
              className={`px-4 py-2 font-sans text-sm font-medium transition-colors border-b-2 -mb-px ${profileTab === 'posts' ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}
            >
              Beiträge
            </button>
            <button
              onClick={() => setProfileTab('shared')}
              className={`px-4 py-2 font-sans text-sm font-medium transition-colors border-b-2 -mb-px ${profileTab === 'shared' ? 'border-dark text-dark' : 'border-transparent text-text-secondary hover:text-dark'}`}
            >
              Geteilte Beiträge
            </button>
          </div>
          <button
            onClick={() => setComposerOpen(true)}
            className="font-sans text-sm text-accent-gold hover:text-dark transition-colors whitespace-nowrap"
          >
            + Neuer Beitrag
          </button>
        </div>

        {profileTab === 'posts' ? (
          <div className="grid grid-cols-3 gap-2">
            {mockPosts.filter(p => p.img).slice(0, 3).map((post) => (
              <div key={post.id} className="relative aspect-square overflow-hidden group cursor-pointer">
                <Image src={post.img ?? ''} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs flex items-center gap-1"><IconHeart filled /> {post.likes}</span>
                  <button className="text-white/80 hover:text-red-300 transition-colors" onClick={e => e.stopPropagation()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-sans text-xs text-text-secondary">Die neuesten Inhalte, die du geteilt hast — Events, Videos, Links und Texte.</p>
            {mockPosts.map((post) => {
              const typeLabel =
                post.type === 'video' ? 'Video' :
                post.type === 'link' ? 'Link' :
                (post.type === 'event' || post.type === 'event-announcement') ? 'Event' :
                post.type === 'photo' ? 'Foto' : 'Text'
              const typeIcon =
                post.type === 'video' ? <IconVideo /> :
                post.type === 'link' ? <IconLink /> :
                post.type === 'photo' ? <IconCamera /> : <IconText />
              return (
                <div key={post.id} className="bg-surface border border-border p-4 flex items-start gap-3 hover:border-dark transition-colors">
                  <span className="w-8 h-8 flex items-center justify-center bg-background border border-border text-text-secondary flex-shrink-0">{typeIcon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-[10px] font-semibold px-1.5 py-0.5 bg-dark text-white uppercase tracking-wide">{typeLabel}</span>
                      <span className="font-sans text-xs text-text-secondary">geteilt · {post.time}</span>
                    </div>
                    <p className="font-sans text-sm font-light text-text-secondary leading-snug line-clamp-2">{post.text}</p>
                    {post.type === 'link' && post.linkTitle && (
                      <p className="font-sans text-xs text-accent-gold mt-1 truncate">{post.linkTitle}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsView() {
  const [activeSection, setActiveSection] = useState('billing')

  const sections = [
    { id: 'billing', label: 'Rechnungen', icon: <IconBilling /> },
    { id: 'payment', label: 'Zahlungsmittel', icon: <IconCard /> },
    { id: 'address', label: 'Adresse', icon: <IconLocation /> },
    { id: 'password', label: 'Passwort', icon: <IconKey /> },
    { id: 'devices', label: 'Geräte', icon: <IconPhone /> },
    { id: 'blocked', label: 'Blockiert', icon: <IconBlock /> },
  ]

  return (
    <div className="bg-surface border border-border overflow-hidden">
      <div className="flex border-b border-border overflow-x-auto">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-4 py-3 font-sans text-sm whitespace-nowrap transition-colors border-b-2 ${activeSection === s.id ? 'border-dark text-dark font-medium' : 'border-transparent text-text-secondary hover:text-dark'}`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {activeSection === 'billing' && (
          <div>
            {/* Active subscriptions */}
            <div className="mb-6">
              <h3 className="font-heading font-bold text-lg mb-3">Aktive Abonnements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-accent-gold/40 bg-accent-gold/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🪗</span>
                    <div>
                      <p className="font-sans text-sm font-semibold">LAEMU Musikschule – Handorgel-Lehrgang</p>
                      <p className="font-sans text-xs text-text-secondary">Jahresabo · nächste Verlängerung 1. Feb 2027</p>
                      <span className="font-sans text-[10px] text-accent-gold font-medium">Formation-Rabatt aktiv (Kapelle Hess-Ruedi)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm font-semibold text-accent-gold">CHF 222.40 / Jahr</p>
                    <span className="font-sans text-[10px] text-text-secondary line-through">CHF 278.00</span>
                    <div className="mt-1">
                      <button className="font-sans text-xs text-red-500 hover:text-red-700 transition-colors">Kündigen</button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌐</span>
                    <div>
                      <p className="font-sans text-sm font-semibold">LAEMU Community – Mitgliedschaft</p>
                      <p className="font-sans text-xs text-text-secondary">Monatlich · nächste Verlängerung 1. Mär 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm font-semibold">CHF 5.00 / Monat</p>
                    <div className="mt-1">
                      <button className="font-sans text-xs text-red-500 hover:text-red-700 transition-colors">Kündigen</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Invoice history */}
            <h3 className="font-heading font-bold text-lg mb-3">Rechnungsverlauf</h3>
            <div className="space-y-3">
              {[
                { date: 'Feb 2026', desc: 'LAEMU Musikschule – Handorgel-Lehrgang (Jahresabo)', amount: 'CHF 222.40' },
                { date: 'Feb 2026', desc: 'LAEMU Community – Monatsmitgliedschaft', amount: 'CHF 5.00' },
                { date: 'Jan 2026', desc: 'LAEMU Community – Monatsmitgliedschaft', amount: 'CHF 5.00' },
                { date: 'Dez 2025', desc: 'LAEMU Community – Monatsmitgliedschaft', amount: 'CHF 5.00' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border hover:border-dark transition-colors">
                  <div>
                    <p className="font-sans text-sm font-medium">{r.desc}</p>
                    <p className="font-sans text-xs font-light text-text-secondary">{r.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm font-semibold">{r.amount}</p>
                    <span className="font-sans text-xs text-green-600 font-medium">Bezahlt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeSection === 'payment' && (
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Zahlungsmittel</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-4 border-2 border-dark bg-dark text-white">
                <div className="flex items-center gap-3">
                  <IconCard />
                  <div>
                    <p className="font-sans text-sm font-medium">Visa •••• 4242</p>
                    <p className="font-sans text-xs text-white/60">Läuft ab 12/2027</p>
                  </div>
                </div>
                <span className="font-sans text-xs text-accent-yellow border border-accent-yellow px-2 py-0.5">Favorit</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-border hover:border-dark transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <IconCard />
                  <div>
                    <p className="font-sans text-sm font-medium">PostFinance •••• 8891</p>
                    <p className="font-sans text-xs font-light text-text-secondary">Läuft ab 03/2026</p>
                  </div>
                </div>
                <button className="font-sans text-xs text-text-secondary hover:text-dark transition-colors">Als Favorit</button>
              </div>
            </div>
            <button className="font-sans text-sm text-accent-gold hover:text-dark transition-colors">+ Zahlungsmittel hinzufügen</button>
          </div>
        )}
        {activeSection === 'address' && (
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Wohnadresse</h3>
            <div className="grid grid-cols-2 gap-4">
              {[['Vorname', 'Niklaus'], ['Nachname', 'Hess'], ['Strasse & Nr.', 'Musterstrasse 12'], ['PLZ', '6000'], ['Ort', 'Luzern'], ['Land', 'Schweiz']].map(([label, val]) => (
                <div key={label}>
                  <label className="font-sans text-xs font-light text-text-secondary uppercase tracking-[0.15em] block mb-1">{label}</label>
                  <input defaultValue={val} className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                </div>
              ))}
            </div>
            <button className="mt-4 bg-dark text-white font-sans text-sm px-6 py-2.5 hover:bg-accent-gold transition-colors">Speichern</button>
          </div>
        )}
        {activeSection === 'password' && (
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Passwort ändern</h3>
            <div className="space-y-4 max-w-sm">
              {['Aktuelles Passwort', 'Neues Passwort', 'Passwort bestätigen'].map(label => (
                <div key={label}>
                  <label className="font-sans text-xs font-light text-text-secondary uppercase tracking-[0.15em] block mb-1">{label}</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-border px-3 py-2 font-sans text-sm font-light focus:outline-none focus:border-dark" />
                </div>
              ))}
              <button className="bg-dark text-white font-sans text-sm px-6 py-2.5 hover:bg-accent-gold transition-colors">Passwort aktualisieren</button>
            </div>
          </div>
        )}
        {activeSection === 'devices' && (
          <div>
            <h3 className="font-heading font-bold text-lg mb-2">Geräte-Verwaltung</h3>
            <p className="font-sans text-sm font-light text-text-secondary mb-4 leading-relaxed">
              Du kannst maximal 2 Geräte (Laptop und Smartphone) für den Zugriff hinterlegen.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border-2 border-dark bg-dark text-white">
                <div className="flex items-center gap-3">
                  <IconLaptop />
                  <div>
                    <p className="font-sans text-sm font-medium">MacBook Pro · Safari</p>
                    <p className="font-sans text-xs text-accent-yellow">Aktuelles Gerät · Luzern, CH</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-border hover:border-dark transition-colors">
                <div className="flex items-center gap-3">
                  <IconPhone />
                  <div>
                    <p className="font-sans text-sm font-medium">iPhone 15 · Safari</p>
                    <p className="font-sans text-xs font-light text-text-secondary">Letzter Zugriff: heute, 08:32</p>
                  </div>
                </div>
                <button className="font-sans text-xs text-red-500 border border-red-200 px-2 py-1 hover:bg-red-50 transition-colors">Entfernen</button>
              </div>
            </div>
            <p className="font-sans text-xs font-light text-text-secondary mt-4">
              Möchtest du ein drittes Gerät hinzufügen? Entferne zuerst ein bestehendes.
            </p>
          </div>
        )}
        {activeSection === 'blocked' && (
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Blockierte Profile</h3>
            <p className="font-sans text-sm font-light text-text-secondary mb-4 leading-relaxed">
              Blockierte Profile können dir nicht mehr schreiben und sehen deine Beiträge nicht.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-text-secondary">
                    <IconUser />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium">Gesperrtes Profil</p>
                    <p className="font-sans text-xs font-light text-text-secondary">@gesperrtes_profil</p>
                  </div>
                </div>
                <button className="font-sans text-xs text-text-secondary border border-border px-2 py-1 hover:border-dark hover:text-dark transition-colors">Entsperren</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DiscoverProfiles() {
  const profiles = [
    ...mockPosts
      .filter(p => ['hansruedi_akkordeon', 'maria_oergeli'].includes(p.user))
      .map(p => ({ name: p.name, handle: `@${p.user}`, img: p.avatar, type: 'Musiker', href: '/member/profile' })),
    ...suggestedProfiles.map(p => ({ ...p, href: '/member/profile' })),
  ]
  return (
    <div className="space-y-3">
      {profiles.map((p, i) => (
        <div key={i} className="bg-surface border border-border flex items-center gap-3 p-4 hover:border-dark transition-colors group">
          <Link href={p.href} className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
            <Image src={p.img} alt={p.name} fill className="object-cover" unoptimized />
          </Link>
          <div className="flex-1">
            <Link href={p.href} className="font-sans font-semibold text-sm group-hover:text-accent-gold transition-colors">{p.name}</Link>
            <p className="font-sans text-xs font-light text-text-secondary">{p.handle} · {p.type}</p>
          </div>
          <Link
            href={p.href}
            className="font-sans text-xs font-medium px-3 py-1.5 border border-dark text-dark hover:bg-dark hover:text-white transition-colors whitespace-nowrap"
          >
            Profil ansehen →
          </Link>
        </div>
      ))}
    </div>
  )
}

function SuggestedProfilesSidebar() {
  return (
    <div className="bg-surface border border-border p-5">
      <h3 className="font-heading font-bold text-sm mb-4">Profile entdecken</h3>
      <div className="space-y-4">
        {suggestedProfiles.map((p) => (
          <Link key={p.name} href="/member/profile" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 group-hover:opacity-80 transition-opacity">
              <Image src={p.img} alt={p.name} fill className="object-cover" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-medium text-xs truncate group-hover:text-accent-gold transition-colors">{p.name}</p>
              <p className="font-sans text-[10px] font-light text-text-secondary">{p.type}</p>
            </div>
            <span className="font-sans text-xs text-text-secondary group-hover:text-accent-gold transition-colors flex-shrink-0">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MemberCommunityPage() {
  const [activeNav, setActiveNav] = useState('feed')

  return (
    <div className="min-h-screen bg-background">
      {/* TOP BAR — embedded as section between nav and content, not sticky overlay */}
      <div className="bg-dark border-b border-dark-secondary px-6 py-4 flex items-center justify-between">
        <h1 className="font-heading font-black text-lg text-white tracking-tight">Community</h1>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative text-white">
            <IconBell />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-yellow rounded-full"></span>
          </button>
          <button onClick={() => setActiveNav('messages')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <IconMessage />
          </button>
        </div>
      </div>

      {/* ── AREA TABS ── */}
      <MemberTabs active="community" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-4">
              {/* Own profile quick-card: no follow graph — just own activity counts */}
              <button onClick={() => setActiveNav('profile')} className="w-full bg-surface border border-border p-5 hover:border-dark transition-colors text-left block">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Profile" fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">Niklaus Hess</p>
                    <p className="font-sans text-xs text-accent-gold">@niklaus_hess</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center border-t border-border pt-4">
                  <div>
                    <p className="font-heading font-black text-lg">48</p>
                    <p className="font-sans text-[10px] font-light text-text-secondary">Beiträge</p>
                  </div>
                  <div>
                    <p className="font-heading font-black text-lg">12</p>
                    <p className="font-sans text-[10px] font-light text-text-secondary">Gespeichert</p>
                  </div>
                </div>
              </button>

              <nav className="bg-surface border border-border overflow-hidden">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 text-left ${
                      activeNav === item.id
                        ? 'bg-dark text-white font-medium'
                        : 'text-text-secondary hover:bg-background hover:text-dark'
                    }`}
                  >
                    <span className={activeNav === item.id ? 'text-accent-yellow' : ''}>{item.icon}</span>
                    {item.label}
                    {item.id === 'messages' && (
                      <span className="ml-auto bg-accent-gold text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">7</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {activeNav === 'feed' && <FeedView />}
            {activeNav === 'messages' && <MessagesView />}
            {activeNav === 'groups' && <GroupsView />}
            {activeNav === 'saved' && <SavedView />}
            {activeNav === 'profile' && <ProfileView />}
            {activeNav === 'settings' && <SettingsView />}
            {activeNav === 'discover' && (
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-xl">Profile entdecken</h3>
                <input
                  type="text"
                  placeholder="Profile suchen…"
                  className="w-full border border-border px-4 py-3 font-sans text-sm font-light focus:outline-none focus:border-dark bg-surface"
                />
                {/* Discover view: no follower counts shown on other profiles */}
                <DiscoverProfiles />
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-4">
              {/* Suggested profiles: no follower counts */}
              <SuggestedProfilesSidebar />

              {/* Playlist & Saved quick access */}
              <div className="bg-surface border border-border p-5">
                <h3 className="font-heading font-bold text-sm mb-3">Lernvideos</h3>
                <div className="space-y-2">
                  <Link href="/member/academy/lernvideos?playlist=open" className="flex items-center justify-between p-3 border border-border hover:border-accent-gold hover:bg-accent-gold/5 transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary group-hover:text-accent-gold transition-colors"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>
                      <span className="font-sans text-xs">Meine Playlist</span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-accent-gold">5</span>
                  </Link>
                  <Link href="/member/academy/lernvideos?saved=1" className="flex items-center justify-between p-3 border border-border hover:border-accent-gold hover:bg-accent-gold/5 transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary group-hover:text-accent-gold transition-colors"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                      <span className="font-sans text-xs">Gespeicherte Videos</span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-accent-gold">3</span>
                  </Link>
                </div>
              </div>

              <div className="bg-surface border border-border p-5">
                <h3 className="font-heading font-bold text-sm mb-4">Kommende Events</h3>
                <div className="space-y-3">
                  {upcomingEvents.map((e) => (
                    <div key={e.title} className="flex gap-3 group">
                      <span className="font-sans text-xs text-accent-gold font-semibold min-w-[42px]">{e.date}</span>
                      <div>
                        <p className="font-sans text-xs font-medium">{e.title}</p>
                        <span className="font-sans text-[10px] font-light text-text-secondary">{e.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-dark p-5">
                <h3 className="font-heading font-bold text-sm mb-4 text-white">LAEMU-Gruppen</h3>
                <div className="space-y-3">
                  {laemuGroups.map((g) => (
                    <button key={g.name} onClick={() => setActiveNav('groups')} className="w-full flex items-center justify-between cursor-pointer group text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{g.icon}</span>
                        <p className="font-sans text-xs text-white/70 group-hover:text-white transition-colors">{g.name}</p>
                      </div>
                      <span className="font-sans text-[10px] text-white/40">{g.members}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
