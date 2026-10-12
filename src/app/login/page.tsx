'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PasswordInput } from '@/components/PasswordInput'

// Begrüssungsbild links auf der Anmeldeseite — freundlicher Einstieg.
const AUTH_IMAGE = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('niklaus@laemu.ch')
  const [password, setPassword] = useState('demo1234')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push('/member/academy')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Bild links — freundlicher Einstieg; LAEMU-Branding bleibt erhalten */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src={AUTH_IMAGE} alt="" fill className="object-cover" unoptimized priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
          <p className="font-heading text-3xl font-bold tracking-tight">LAEMU</p>
          <p className="font-sans text-sm text-white/85 mt-1 italic">Am Puls der Ländlermusik.</p>
          <p className="font-sans text-sm text-white/75 mt-3 leading-relaxed max-w-sm">
            Die Online-Musikschule für echte Ländlermusik — Kurse und Lernvideos von den Besten der Szene.
          </p>
        </div>
      </div>

      {/* Rechte Spalte: Anmeldeformular */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="text-center mb-10 lg:hidden">
          <Link href="/" className="inline-block">
            <span className="font-heading text-4xl font-bold text-dark">LAEMU</span>
          </Link>
          <p className="font-sans text-sm text-text-secondary mt-2 italic">Am Puls der Ländlermusik.</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-border rounded-2xl shadow-card p-8">
          <h1 className="font-heading text-2xl font-black text-dark mb-6">Anmelden</h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block font-sans text-xs font-medium text-text-secondary uppercase tracking-widest mb-2">
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-border px-4 py-3 font-sans text-sm text-dark bg-white focus:outline-none focus:border-dark transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-sans text-xs font-medium text-text-secondary uppercase tracking-widest">
                  Passwort
                </label>
                <Link
                  href="/passwort-vergessen"
                  className="font-sans text-xs text-text-secondary hover:text-accent-gold transition-colors"
                >
                  Passwort vergessen?
                </Link>
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-border px-4 py-3 font-sans text-sm text-dark bg-white focus:outline-none focus:border-dark transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dark text-white font-sans text-sm font-semibold tracking-wide py-3.5 hover:bg-accent-gold hover:text-white transition-colors duration-200 disabled:opacity-60"
            >
              {loading ? 'Wird angemeldet…' : 'Anmelden →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="font-sans text-sm text-text-secondary">
              Noch kein Konto?{' '}
              <Link href="/register" className="text-dark font-semibold hover:text-accent-gold transition-colors">
                Jetzt registrieren →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  )
}
