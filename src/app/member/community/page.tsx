'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const mockPosts = [
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
    type: 'photo',
  },
  {
    id: 2,
    user: 'maria_oergeli',
    name: 'Maria Kälin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    time: 'vor 5 Stunden',
    text: 'Neues Video online! Eine kleine Improvisation auf meinem Schwyzerörgeli — traditionell, aber mit eigenem Touch. Was meint ihr? 🎼',
    img: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800&q=80',
    likes: 89,
    comments: 23,
    type: 'video',
  },
  {
    id: 3,
    user: 'trio_alpstein',
    name: 'Trio Alpstein',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    time: 'vor 1 Tag',
    text: '🏔️ Wir freuen uns: Nächsten Samstag spielen wir beim Dorffest Appenzell! Kommt vorbei und tanzt mit uns durch den Abend.',
    img: 'https://images.unsplash.com/photo-1415886670524-cc42c35e9fd4?w=800&q=80',
    likes: 134,
    comments: 41,
    type: 'event',
  },
]

const suggestedProfiles = [
  { name: 'Trio Alpstein', handle: '@trio_alpstein', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', type: 'Formation' },
  { name: 'Lisa Frei', handle: '@lisa_piano', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', type: 'Lehrperson' },
  { name: 'Peter Gasser', handle: '@peter_klarinette', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', type: 'Musiker' },
]

const upcomingEvents = [
  { date: '15. Feb', title: 'Community-Abend Luzern', type: 'Community' },
  { date: '22. Feb', title: 'Online-Jam Session', type: 'Online' },
  { date: '01. Mär', title: 'Tanzabend Schwyz', type: 'Tanzabend' },
]

const activeGroups = [
  { name: 'Handorgel-Liebhaber', members: 234 },
  { name: 'Ländlermusik Luzern', members: 189 },
  { name: 'Schwyzerörgeli Forum', members: 156 },
]

const navItems = [
  { icon: '🏠', label: 'Feed', href: '/member/community', active: true },
  { icon: '🔍', label: 'Entdecken', href: '/member/community' },
  { icon: '💬', label: 'Nachrichten', href: '/member/community' },
  { icon: '👫', label: 'Gruppen', href: '/member/community' },
  { icon: '🗓️', label: 'Events', href: '/events' },
]

function PostCard({ post }: { post: typeof mockPosts[0] }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showComment, setShowComment] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image src={post.avatar} alt={post.user} fill className="object-cover" unoptimized />
        </div>
        <div className="flex-1">
          <p className="font-sans font-semibold text-sm">{post.name}</p>
          <div className="flex items-center gap-2">
            <p className="font-sans text-xs text-text-secondary">@{post.user}</p>
            <span className="text-text-secondary text-xs">·</span>
            <p className="font-sans text-xs text-text-secondary">{post.time}</p>
          </div>
        </div>
        {post.type === 'event' && (
          <span className="font-sans text-xs px-2 py-1 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
            Event
          </span>
        )}
        {post.type === 'video' && (
          <span className="font-sans text-xs px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200">
            Video
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image src={post.img} alt={post.user} fill className="object-cover" unoptimized />
        {post.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white text-2xl ml-1">▶</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="font-sans text-sm text-text-secondary mb-4">{post.text}</p>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 font-sans text-sm transition-colors ${liked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}
          >
            <span>{liked ? '❤️' : '🤍'}</span>
            <span>{likeCount}</span>
          </button>
          <button
            onClick={() => setShowComment(!showComment)}
            className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <span>💬</span>
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors ml-auto">
            <span>↗</span>
            <span>Teilen</span>
          </button>
        </div>

        {/* Comment input */}
        <AnimatePresence>
          {showComment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-border overflow-hidden"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kommentar schreiben..."
                  className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold"
                />
                <button className="bg-accent-gold text-white px-3 py-2 font-sans text-sm hover:bg-accent-earth transition-colors">
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

export default function MemberCommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* TOP BAR */}
      <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between sticky top-20 z-20">
        <div className="flex items-center gap-6">
          <h1 className="font-serif font-bold text-lg">Community Feed</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-background rounded-full transition-colors">
            <span>🔔</span>
          </button>
          <button className="p-2 hover:bg-background rounded-full transition-colors">
            <span>⚙️</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-36 space-y-6">
              {/* Profile Card */}
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
                    <p className="font-serif font-bold text-sm">Niklaus Hess</p>
                    <p className="font-sans text-xs text-accent-gold">@niklaus_hess</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center border-t border-border pt-4">
                  <div>
                    <p className="font-serif font-bold text-lg">48</p>
                    <p className="font-sans text-xs text-text-secondary">Beiträge</p>
                  </div>
                  <div>
                    <p className="font-serif font-bold text-lg">312</p>
                    <p className="font-sans text-xs text-text-secondary">Folge ich</p>
                  </div>
                  <div>
                    <p className="font-serif font-bold text-lg">891</p>
                    <p className="font-sans text-xs text-text-secondary">Follower</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-surface border border-border overflow-hidden">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 ${
                      item.active
                        ? 'bg-accent-gold/5 text-accent-gold font-medium'
                        : 'text-text-secondary hover:bg-background hover:text-text-primary'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* MAIN FEED */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Post */}
            <div className="bg-surface border border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                    alt="You"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <input
                  type="text"
                  placeholder="Was möchtest du teilen?"
                  className="flex-1 border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-background"
                />
              </div>
              <div className="flex items-center gap-2 pl-13">
                <button className="flex items-center gap-2 font-sans text-sm text-text-secondary hover:text-text-primary px-3 py-2 hover:bg-background transition-colors">
                  <span>📷</span> Foto
                </button>
                <button className="flex items-center gap-2 font-sans text-sm text-text-secondary hover:text-text-primary px-3 py-2 hover:bg-background transition-colors">
                  <span>🎥</span> Video
                </button>
                <button className="flex items-center gap-2 font-sans text-sm text-text-secondary hover:text-text-primary px-3 py-2 hover:bg-background transition-colors">
                  <span>🗓️</span> Event
                </button>
                <button className="ml-auto bg-accent-gold text-white font-sans text-sm px-4 py-2 hover:bg-accent-earth transition-colors">
                  Posten
                </button>
              </div>
            </div>

            {/* Posts */}
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Load more */}
            <button className="w-full py-4 font-sans text-sm text-text-secondary border border-border hover:bg-surface hover:text-text-primary transition-colors">
              Mehr laden...
            </button>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-36 space-y-6">
              {/* Suggested Profiles */}
              <div className="bg-surface border border-border p-5">
                <h3 className="font-serif font-bold text-sm mb-4">Empfohlene Profile</h3>
                <div className="space-y-4">
                  {suggestedProfiles.map((p) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={p.img} alt={p.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-medium text-xs truncate">{p.name}</p>
                        <p className="font-sans text-xs text-text-secondary">{p.type}</p>
                      </div>
                      <button className="font-sans text-xs text-accent-gold border border-accent-gold px-2 py-1 hover:bg-accent-gold hover:text-white transition-colors">
                        Folgen
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-surface border border-border p-5">
                <h3 className="font-serif font-bold text-sm mb-4">Kommende Events</h3>
                <div className="space-y-3">
                  {upcomingEvents.map((e) => (
                    <div key={e.title} className="flex gap-3">
                      <div className="text-center min-w-[40px]">
                        <span className="font-sans text-xs text-accent-gold font-medium">{e.date}</span>
                      </div>
                      <div>
                        <p className="font-sans text-xs font-medium">{e.title}</p>
                        <span className="font-sans text-[10px] text-text-secondary">{e.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/events" className="block mt-4 font-sans text-xs text-accent-gold hover:text-accent-earth transition-colors">
                  Alle Events →
                </Link>
              </div>

              {/* Active Groups */}
              <div className="bg-surface border border-border p-5">
                <h3 className="font-serif font-bold text-sm mb-4">Aktive Gruppen</h3>
                <div className="space-y-3">
                  {activeGroups.map((g) => (
                    <div key={g.name} className="flex items-center justify-between cursor-pointer group">
                      <p className="font-sans text-xs group-hover:text-accent-gold transition-colors">{g.name}</p>
                      <span className="font-sans text-[10px] text-text-secondary">{g.members} Mitglieder</span>
                    </div>
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
