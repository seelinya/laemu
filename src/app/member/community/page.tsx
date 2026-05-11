'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
    type: 'photo' as const,
    following: true,
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
    type: 'video' as const,
    following: true,
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
    type: 'event' as const,
    following: false,
  },
  {
    id: 4,
    user: 'kapelle_rigi',
    name: 'Kapelle Rigi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    time: 'vor 3 Stunden',
    text: 'Wir suchen noch Mitspieler für unsere Kapelle! Handorgel und Bass sind noch frei. Wer Lust hat, melde sich. Hier unser WhatsApp-Link: wa.me/gruppenlink',
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
    likes: 22,
    comments: 8,
    type: 'photo' as const,
    following: false,
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

const laemuGroups = [
  { name: 'Handorgel-Onlinekurs', members: 48, icon: '🪗', managed: true },
  { name: 'Schwyzerörgeli-Onlinekurs', members: 34, icon: '🎶', managed: true },
  { name: 'Klavier-Onlinekurs', members: 29, icon: '🎹', managed: true },
]

const navItems = [
  { icon: '🏠', label: 'Feed', id: 'feed' },
  { icon: '🔍', label: 'Entdecken', id: 'discover' },
  { icon: '💬', label: 'Nachrichten', id: 'messages' },
  { icon: '👫', label: 'Gruppen', id: 'groups' },
  { icon: '🔖', label: 'Gespeichert', id: 'saved' },
  { icon: '👤', label: 'Mein Profil', id: 'profile' },
  { icon: '⚙️', label: 'Einstellungen', id: 'settings' },
]

const followingList = [
  { name: 'Hansruedi Wenger', handle: '@hansruedi_akkordeon', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { name: 'Maria Kälin', handle: '@maria_oergeli', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
]

const conversations = [
  { name: 'Hansruedi Wenger', handle: '@hansruedi_akkordeon', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', last: 'Auf bald am Konzert!', time: '10:24', unread: 2 },
  { name: 'Maria Kälin', handle: '@maria_oergeli', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', last: 'Danke für das Feedback 🙏', time: 'Gestern', unread: 0 },
  { name: 'Handorgel-Onlinekurs', handle: 'Gruppe · 48 Mitglieder', img: '', last: 'Niklaus: Bis morgen dann!', time: 'Mo', unread: 5, isGroup: true },
]

function PostCard({ post }: { post: (typeof mockPosts)[number] }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showComment, setShowComment] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border overflow-hidden"
    >
      <div className="p-4 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
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
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1 hover:bg-background rounded transition-colors font-sans text-text-secondary text-lg leading-none">···</button>
          <AnimatePresence>
            {showMenu && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-8 bg-surface border border-border shadow-lg z-10 min-w-[160px]">
                <button onClick={() => { setSaved(!saved); setShowMenu(false) }} className="w-full text-left px-4 py-2.5 font-sans text-sm hover:bg-background transition-colors">
                  {saved ? '🔖 Gespeichert' : '🔖 Als Inspiration speichern'}
                </button>
                <button className="w-full text-left px-4 py-2.5 font-sans text-sm hover:bg-background transition-colors">↗ Beitrag teilen</button>
                <button className="w-full text-left px-4 py-2.5 font-sans text-sm text-red-500 hover:bg-red-50 transition-colors">🚫 Profil blockieren</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {post.type === 'event' && <span className="font-sans text-xs px-2 py-1 bg-accent-gold/10 text-accent-gold border border-accent-gold/20">Event</span>}
        {post.type === 'video' && <span className="font-sans text-xs px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200">Video</span>}
      </div>

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

      <div className="p-4">
        <p className="font-sans text-sm text-text-secondary mb-4">{post.text}</p>
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <button onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1) }} className={`flex items-center gap-1.5 font-sans text-sm transition-colors ${liked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}>
            <span>{liked ? '❤️' : '🤍'}</span>
            <span>{likeCount}</span>
          </button>
          <button onClick={() => setShowComment(!showComment)} className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors">
            <span>💬</span>
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors">
            <span>↗</span>
            <span>Teilen</span>
          </button>
          <button onClick={() => setSaved(!saved)} className={`flex items-center gap-1.5 font-sans text-sm ml-auto transition-colors ${saved ? 'text-accent-gold' : 'text-text-secondary hover:text-accent-gold'}`}>
            <span>{saved ? '🔖' : '🏷️'}</span>
            <span className="text-xs">{saved ? 'Gespeichert' : 'Speichern'}</span>
          </button>
        </div>
        <AnimatePresence>
          {showComment && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-border overflow-hidden">
              <div className="flex gap-2">
                <input type="text" placeholder="Kommentar schreiben..." className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
                <button className="bg-accent-gold text-white px-3 py-2 font-sans text-sm hover:bg-accent-earth transition-colors">Senden</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function FeedView({ tab, setTab }: { tab: 'all' | 'following'; setTab: (t: 'all' | 'following') => void }) {
  const posts = tab === 'following' ? mockPosts.filter(p => p.following) : mockPosts

  return (
    <div className="space-y-6">
      {/* Post composer */}
      <div className="bg-surface border border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="You" fill className="object-cover" unoptimized />
          </div>
          <input type="text" placeholder="Was möchtest du teilen?" className="flex-1 border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-background" />
        </div>
        <div className="flex items-center gap-2 border-t border-border pt-3">
          <button className="flex items-center gap-1.5 font-sans text-xs text-text-secondary hover:text-text-primary px-2 py-1.5 hover:bg-background rounded transition-colors"><span>📷</span> Foto</button>
          <button className="flex items-center gap-1.5 font-sans text-xs text-text-secondary hover:text-text-primary px-2 py-1.5 hover:bg-background rounded transition-colors"><span>🎥</span> Video</button>
          <button className="flex items-center gap-1.5 font-sans text-xs text-text-secondary hover:text-text-primary px-2 py-1.5 hover:bg-background rounded transition-colors"><span>🔗</span> Link</button>
          <button className="flex items-center gap-1.5 font-sans text-xs text-text-secondary hover:text-text-primary px-2 py-1.5 hover:bg-background rounded transition-colors"><span>📝</span> Text</button>
          <button className="ml-auto bg-accent-gold text-white font-sans text-sm px-4 py-2 hover:bg-accent-earth transition-colors">Posten</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button onClick={() => setTab('all')} className={`flex-1 py-3 font-sans text-sm font-medium transition-colors border-b-2 ${tab === 'all' ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
          Alle Beiträge
        </button>
        <button onClick={() => setTab('following')} className={`flex-1 py-3 font-sans text-sm font-medium transition-colors border-b-2 ${tab === 'following' ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
          Gefolgte Profile
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-surface border border-border p-12 text-center">
          <p className="font-sans text-text-secondary text-sm">Du folgst noch keinen Profilen. Entdecke die Community und folge anderen Musikern!</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}

      <button className="w-full py-4 font-sans text-sm text-text-secondary border border-border hover:bg-surface hover:text-text-primary transition-colors">Mehr laden...</button>
    </div>
  )
}

function MessagesView() {
  const [activeConv, setActiveConv] = useState<number | null>(0)
  const [msg, setMsg] = useState('')

  return (
    <div className="bg-surface border border-border overflow-hidden" style={{ minHeight: '500px' }}>
      <div className="flex h-full" style={{ minHeight: '500px' }}>
        {/* Conversation list */}
        <div className="w-72 border-r border-border flex-shrink-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm">Nachrichten</h3>
            <button className="font-sans text-xs text-accent-gold hover:text-accent-earth transition-colors">+ Neue Nachricht</button>
          </div>
          <div>
            {conversations.map((c, i) => (
              <button key={i} onClick={() => setActiveConv(i)} className={`w-full flex items-center gap-3 p-4 border-b border-border transition-colors text-left ${activeConv === i ? 'bg-accent-gold/5' : 'hover:bg-background'}`}>
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-accent-gold/20 flex items-center justify-center">
                  {c.img ? <Image src={c.img} alt={c.name} fill className="object-cover" unoptimized /> : <span className="text-xl">👫</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-sans font-semibold text-xs truncate">{c.name}</p>
                    <span className="font-sans text-[10px] text-text-secondary ml-1 flex-shrink-0">{c.time}</span>
                  </div>
                  <p className="font-sans text-xs text-text-secondary truncate">{c.last}</p>
                </div>
                {c.unread > 0 && <span className="bg-accent-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">{c.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {activeConv !== null ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-accent-gold/20">
                {conversations[activeConv].img && <Image src={conversations[activeConv].img} alt="" fill className="object-cover" unoptimized />}
              </div>
              <div>
                <p className="font-sans font-semibold text-sm">{conversations[activeConv].name}</p>
                <p className="font-sans text-xs text-text-secondary">{conversations[activeConv].handle}</p>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ minHeight: '300px' }}>
              <div className="flex justify-start"><div className="bg-background border border-border px-3 py-2 rounded-lg max-w-xs"><p className="font-sans text-sm">Hoi! Wann ist das nächste Treffen?</p></div></div>
              <div className="flex justify-end"><div className="bg-accent-gold text-white px-3 py-2 rounded-lg max-w-xs"><p className="font-sans text-sm">Am Samstag um 14 Uhr!</p></div></div>
              <div className="flex justify-start"><div className="bg-background border border-border px-3 py-2 rounded-lg max-w-xs"><p className="font-sans text-sm">{conversations[activeConv].last}</p></div></div>
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <input value={msg} onChange={e => setMsg(e.target.value)} type="text" placeholder="Nachricht schreiben..." className="flex-1 border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
              <button className="bg-accent-gold text-white px-4 py-2 font-sans text-sm hover:bg-accent-earth transition-colors">Senden</button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-sans text-text-secondary text-sm">Wähle eine Unterhaltung</p>
          </div>
        )}
      </div>
    </div>
  )
}

function GroupsView() {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border p-6">
        <h3 className="font-serif font-bold text-lg mb-2">LAEMU-Gruppen</h3>
        <p className="font-sans text-sm text-text-secondary mb-6">
          Gruppen werden ausschliesslich von LAEMU verwaltet — für Onlinekurse und Events. Möchtest du eine eigene Gruppe starten? Poste einen Beitrag mit einem öffentlichen WhatsApp-Link.
        </p>
        <div className="space-y-4">
          {laemuGroups.map((g) => (
            <div key={g.name} className="flex items-center gap-4 p-4 border border-border hover:border-accent-gold transition-colors">
              <span className="text-3xl">{g.icon}</span>
              <div className="flex-1">
                <p className="font-sans font-semibold text-sm">{g.name}</p>
                <p className="font-sans text-xs text-text-secondary">{g.members} Mitglieder · Verwaltet von LAEMU</p>
              </div>
              <button className="font-sans text-xs text-accent-gold border border-accent-gold px-3 py-1.5 hover:bg-accent-gold hover:text-white transition-colors">Beitreten</button>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-accent-gold/5 border border-accent-gold/20 p-6">
        <p className="font-sans text-sm text-text-secondary">
          <strong className="text-text-primary">Eigene Gruppe gründen?</strong> Erstelle einen öffentlichen Beitrag in der Community mit deinem WhatsApp-Gruppenlink, damit andere Mitglieder beitreten können.
        </p>
      </div>
    </div>
  )
}

function SavedView() {
  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-lg">Gespeicherte Beiträge</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockPosts.slice(0, 2).map((post) => (
          <div key={post.id} className="bg-surface border border-border overflow-hidden group">
            <div className="relative aspect-video overflow-hidden">
              <Image src={post.img} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 p-3">
                <p className="font-sans text-white text-xs font-semibold">{post.name}</p>
                <p className="font-sans text-white/70 text-xs line-clamp-2">{post.text}</p>
              </div>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="font-sans text-xs text-text-secondary">{post.time}</span>
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

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="bg-surface border border-border overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-accent-gold/20 to-muted-green/20 relative">
          {editMode && <button className="absolute bottom-2 right-2 bg-white/80 text-xs px-2 py-1 font-sans hover:bg-white transition-colors">Titelbild ändern</button>}
        </div>
        <div className="p-6 -mt-10">
          <div className="flex items-end justify-between mb-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-surface bg-background">
              <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" alt="Profile" fill className="object-cover" unoptimized />
              {editMode && <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"><span className="text-white text-xs">Ändern</span></div>}
            </div>
            <button onClick={() => setEditMode(!editMode)} className={`font-sans text-sm px-4 py-2 border transition-colors ${editMode ? 'border-accent-gold bg-accent-gold text-white' : 'border-border hover:border-accent-gold'}`}>
              {editMode ? 'Speichern' : 'Profil bearbeiten'}
            </button>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="font-sans text-xs text-text-secondary uppercase tracking-wider block mb-1">Profilname *</label>
                <input defaultValue="Niklaus Hess" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
              </div>
              <div>
                <label className="font-sans text-xs text-text-secondary uppercase tracking-wider block mb-1">Bio</label>
                <textarea defaultValue="Handorgelist aus Luzern. Leidenschaft für Ländlermusik seit 20 Jahren." rows={3} className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-wider block mb-1">Formation</label>
                  <input defaultValue="Kapelle Hess-Ruedi" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
                </div>
                <div>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-wider block mb-1">Instrumente</label>
                  <input defaultValue="Handorgel, Schwyzerörgeli" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
                </div>
              </div>
              <div>
                <label className="font-sans text-xs text-text-secondary uppercase tracking-wider block mb-1">Musikalische Vorbilder</label>
                <input defaultValue="Ruedi Rymann, Kapelle Hess-Ruedi-Hegner" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-serif text-2xl font-bold">Niklaus Hess</h2>
              <p className="font-sans text-sm text-accent-gold mb-2">@niklaus_hess</p>
              <p className="font-sans text-sm text-text-secondary mb-4">Handorgelist aus Luzern. Leidenschaft für Ländlermusik seit 20 Jahren.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="font-sans text-xs px-2 py-1 bg-background border border-border">🪗 Handorgel</span>
                <span className="font-sans text-xs px-2 py-1 bg-background border border-border">🎶 Schwyzerörgeli</span>
                <span className="font-sans text-xs px-2 py-1 bg-background border border-border">Formation: Kapelle Hess-Ruedi</span>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border text-center">
                <div><p className="font-serif font-bold text-xl">48</p><p className="font-sans text-xs text-text-secondary">Beiträge</p></div>
                <div><p className="font-serif font-bold text-xl">312</p><p className="font-sans text-xs text-text-secondary">Folge ich</p></div>
                <div><p className="font-serif font-bold text-xl">891</p><p className="font-sans text-xs text-text-secondary">Follower</p></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* My posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-lg">Meine Beiträge</h3>
          <button className="font-sans text-sm text-accent-gold hover:text-accent-earth transition-colors">+ Neuer Beitrag</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {mockPosts.slice(0, 3).map((post) => (
            <div key={post.id} className="relative aspect-square overflow-hidden group cursor-pointer">
              <Image src={post.img} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <span className="text-white text-xs">❤️ {post.likes}</span>
                <button className="text-white text-xs hover:text-red-300 transition-colors" onClick={e => e.stopPropagation()}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Following list */}
      <div className="bg-surface border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-sm">Folgeliste</h3>
          <button className="font-sans text-xs text-accent-gold hover:text-accent-earth transition-colors">+ Profil suchen</button>
        </div>
        <div className="space-y-3">
          {followingList.map((f) => (
            <div key={f.handle} className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                <Image src={f.img} alt={f.name} fill className="object-cover" unoptimized />
              </div>
              <div className="flex-1">
                <p className="font-sans font-semibold text-xs">{f.name}</p>
                <p className="font-sans text-xs text-text-secondary">{f.handle}</p>
              </div>
              <button className="font-sans text-xs text-red-500 border border-red-200 px-2 py-1 hover:bg-red-50 transition-colors">Entfolgen</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsView() {
  const [activeSection, setActiveSection] = useState('billing')

  return (
    <div className="bg-surface border border-border overflow-hidden">
      <div className="flex border-b border-border overflow-x-auto">
        {[
          { id: 'billing', label: '💳 Rechnungen' },
          { id: 'payment', label: '💰 Zahlungsmittel' },
          { id: 'address', label: '📍 Adresse' },
          { id: 'password', label: '🔑 Passwort' },
          { id: 'devices', label: '📱 Geräte' },
          { id: 'blocked', label: '🚫 Blockiert' },
        ].map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className={`px-4 py-3 font-sans text-sm whitespace-nowrap transition-colors border-b-2 ${activeSection === s.id ? 'border-accent-gold text-accent-gold' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {activeSection === 'billing' && (
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Rechnungsverlauf</h3>
            <div className="space-y-3">
              {[
                { date: 'Feb 2026', desc: 'LAEMU Community – Monatsmitgliedschaft', amount: 'CHF 5.00', status: 'Bezahlt' },
                { date: 'Jan 2026', desc: 'LAEMU Community – Monatsmitgliedschaft', amount: 'CHF 5.00', status: 'Bezahlt' },
                { date: 'Dez 2025', desc: 'LAEMU Community – Monatsmitgliedschaft', amount: 'CHF 5.00', status: 'Bezahlt' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border">
                  <div>
                    <p className="font-sans text-sm font-medium">{r.desc}</p>
                    <p className="font-sans text-xs text-text-secondary">{r.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm font-semibold">{r.amount}</p>
                    <span className="font-sans text-xs text-muted-green">{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeSection === 'payment' && (
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Zahlungsmittel</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-4 border-2 border-accent-gold bg-accent-gold/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-sans text-sm font-medium">Visa •••• 4242</p>
                    <p className="font-sans text-xs text-text-secondary">Läuft ab 12/2027</p>
                  </div>
                </div>
                <span className="font-sans text-xs text-accent-gold border border-accent-gold px-2 py-0.5">Favorit</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-border hover:border-accent-gold transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-sans text-sm font-medium">PostFinance •••• 8891</p>
                    <p className="font-sans text-xs text-text-secondary">Läuft ab 03/2026</p>
                  </div>
                </div>
                <button className="font-sans text-xs text-text-secondary hover:text-accent-gold transition-colors">Als Favorit</button>
              </div>
            </div>
            <button className="font-sans text-sm text-accent-gold hover:text-accent-earth transition-colors">+ Zahlungsmittel hinzufügen</button>
          </div>
        )}
        {activeSection === 'address' && (
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Wohnadresse</h3>
            <div className="grid grid-cols-2 gap-4">
              {[['Vorname', 'Niklaus'], ['Nachname', 'Hess'], ['Strasse & Nr.', 'Musterstrasse 12'], ['PLZ', '6000'], ['Ort', 'Luzern'], ['Land', 'Schweiz']].map(([label, val]) => (
                <div key={label}>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-wider block mb-1">{label}</label>
                  <input defaultValue={val} className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
                </div>
              ))}
            </div>
            <button className="mt-4 bg-accent-gold text-white font-sans text-sm px-6 py-2 hover:bg-accent-earth transition-colors">Speichern</button>
          </div>
        )}
        {activeSection === 'password' && (
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Passwort ändern</h3>
            <div className="space-y-4 max-w-sm">
              {['Aktuelles Passwort', 'Neues Passwort', 'Passwort bestätigen'].map(label => (
                <div key={label}>
                  <label className="font-sans text-xs text-text-secondary uppercase tracking-wider block mb-1">{label}</label>
                  <input type="password" placeholder="••••••••" className="w-full border border-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-accent-gold" />
                </div>
              ))}
              <button className="bg-accent-gold text-white font-sans text-sm px-6 py-2 hover:bg-accent-earth transition-colors">Passwort aktualisieren</button>
            </div>
          </div>
        )}
        {activeSection === 'devices' && (
          <div>
            <h3 className="font-serif font-bold text-lg mb-2">Geräte-Verwaltung</h3>
            <p className="font-sans text-sm text-text-secondary mb-4">Du kannst maximal 2 Geräte (Laptop und Smartphone) für den Zugriff auf dein Profil hinterlegen.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border-2 border-accent-gold bg-accent-gold/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💻</span>
                  <div>
                    <p className="font-sans text-sm font-medium">MacBook Pro · Safari</p>
                    <p className="font-sans text-xs text-accent-gold">Aktuelles Gerät · Luzern, CH</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-border">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-sans text-sm font-medium">iPhone 15 · Safari</p>
                    <p className="font-sans text-xs text-text-secondary">Letzter Zugriff: heute, 08:32</p>
                  </div>
                </div>
                <button className="font-sans text-xs text-red-500 border border-red-200 px-2 py-1 hover:bg-red-50 transition-colors">Entfernen</button>
              </div>
            </div>
            <p className="font-sans text-xs text-text-secondary mt-4">Möchtest du ein drittes Gerät hinzufügen? Entferne zuerst ein bestehendes.</p>
          </div>
        )}
        {activeSection === 'blocked' && (
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Blockierte Profile</h3>
            <p className="font-sans text-sm text-text-secondary mb-4">Blockierte Profile können dir nicht mehr schreiben und sehen deine Beiträge nicht.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center">
                    <span className="font-sans text-xs text-text-secondary">N/A</span>
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium">Gesperrtes Profil</p>
                    <p className="font-sans text-xs text-text-secondary">@gesperrtes_profil</p>
                  </div>
                </div>
                <button className="font-sans text-xs text-text-secondary border border-border px-2 py-1 hover:border-accent-gold hover:text-accent-gold transition-colors">Entsperren</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MemberCommunityPage() {
  const [activeNav, setActiveNav] = useState('feed')
  const [feedTab, setFeedTab] = useState<'all' | 'following'>('all')

  return (
    <div className="min-h-screen bg-background">
      {/* TOP BAR */}
      <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between sticky top-20 z-20">
        <h1 className="font-serif font-bold text-lg">Community</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-background rounded-full transition-colors relative">
            <span>🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-gold rounded-full"></span>
          </button>
          <button onClick={() => setActiveNav('messages')} className="p-2 hover:bg-background rounded-full transition-colors">
            <span>💬</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-36 space-y-6">
              <div className="bg-surface border border-border p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Profile" fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-sm">Niklaus Hess</p>
                    <p className="font-sans text-xs text-accent-gold">@niklaus_hess</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center border-t border-border pt-4">
                  <div><p className="font-serif font-bold text-lg">48</p><p className="font-sans text-xs text-text-secondary">Beiträge</p></div>
                  <div><p className="font-serif font-bold text-lg">312</p><p className="font-sans text-xs text-text-secondary">Folge ich</p></div>
                  <div><p className="font-serif font-bold text-lg">891</p><p className="font-sans text-xs text-text-secondary">Follower</p></div>
                </div>
              </div>

              <nav className="bg-surface border border-border overflow-hidden">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors border-b border-border last:border-0 text-left ${
                      activeNav === item.id ? 'bg-accent-gold/5 text-accent-gold font-medium' : 'text-text-secondary hover:bg-background hover:text-text-primary'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                    {item.id === 'messages' && <span className="ml-auto bg-accent-gold text-white text-[10px] px-1.5 py-0.5 rounded-full">7</span>}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {activeNav === 'feed' && <FeedView tab={feedTab} setTab={setFeedTab} />}
            {activeNav === 'messages' && <MessagesView />}
            {activeNav === 'groups' && <GroupsView />}
            {activeNav === 'saved' && <SavedView />}
            {activeNav === 'profile' && <ProfileView />}
            {activeNav === 'settings' && <SettingsView />}
            {activeNav === 'discover' && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg">Profile entdecken</h3>
                <input type="text" placeholder="Profile suchen..." className="w-full border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-accent-gold bg-surface" />
                <div className="space-y-3">
                  {[...mockPosts.map(p => ({ name: p.name, handle: `@${p.user}`, img: p.avatar, type: 'Musiker' })), ...suggestedProfiles].map((p, i) => (
                    <div key={i} className="bg-surface border border-border flex items-center gap-3 p-4 hover:border-accent-gold transition-colors">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={p.img} alt={p.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1">
                        <p className="font-sans font-semibold text-sm">{p.name}</p>
                        <p className="font-sans text-xs text-text-secondary">{p.handle} · {p.type}</p>
                      </div>
                      <button className="font-sans text-xs text-accent-gold border border-accent-gold px-3 py-1.5 hover:bg-accent-gold hover:text-white transition-colors">Folgen</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-36 space-y-6">
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
                      <button className="font-sans text-xs text-accent-gold border border-accent-gold px-2 py-1 hover:bg-accent-gold hover:text-white transition-colors flex-shrink-0">Folgen</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-surface border border-border p-5">
                <h3 className="font-serif font-bold text-sm mb-4">Kommende Events</h3>
                <div className="space-y-3">
                  {upcomingEvents.map((e) => (
                    <div key={e.title} className="flex gap-3">
                      <span className="font-sans text-xs text-accent-gold font-medium min-w-[40px]">{e.date}</span>
                      <div>
                        <p className="font-sans text-xs font-medium">{e.title}</p>
                        <span className="font-sans text-[10px] text-text-secondary">{e.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/events" className="block mt-4 font-sans text-xs text-accent-gold hover:text-accent-earth transition-colors">Alle Events →</Link>
              </div>
              <div className="bg-surface border border-border p-5">
                <h3 className="font-serif font-bold text-sm mb-4">LAEMU-Gruppen</h3>
                <div className="space-y-3">
                  {laemuGroups.map((g) => (
                    <div key={g.name} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{g.icon}</span>
                        <p className="font-sans text-xs group-hover:text-accent-gold transition-colors">{g.name}</p>
                      </div>
                      <span className="font-sans text-[10px] text-text-secondary">{g.members}</span>
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
