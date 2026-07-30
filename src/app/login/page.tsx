'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { PasswordInput } from '@/components/PasswordInput'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('niklaus@laemu.ch')
  const [password, setPassword] = useState('demo1234')
  const [loading, setLoading] = useState(false)
  // Passkey-Anmeldung (WebAuthn) — in dieser Demo simuliert.
  const [passkeyLoading, setPasskeyLoading] = useState(false)

  const busy = loading || passkeyLoading

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push('/member/academy')
    }, 800)
  }

  // Passkey-Login: Öffnet normalerweise den Sicherheitsdialog des Geräts
  // (Fingerabdruck, Gesicht, PIN). Hier simulieren wir den Ablauf.
  const handlePasskey = () => {
    setPasskeyLoading(true)
    setTimeout(() => {
      router.push('/member/academy')
    }, 900)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="font-heading text-4xl font-bold text-dark">LAEMU</span>
          </Link>
          <p className="font-sans text-sm text-text-secondary mt-2 italic">Am Puls der Ländlermusik.</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-border p-8">
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
              disabled={busy}
              className="w-full bg-dark text-white font-sans text-sm font-semibold tracking-wide py-3.5 hover:bg-accent-gold hover:text-white transition-colors duration-200 disabled:opacity-60"
            >
              {loading ? 'Wird angemeldet…' : 'Anmelden →'}
            </button>
          </form>

          {/* Trenner */}
          <div className="flex items-center gap-3 my-6">
            <span className="h-px flex-1 bg-border" />
            <span className="font-sans text-xs uppercase tracking-widest text-text-secondary">oder</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Passkey-Anmeldung (WebAuthn) */}
          <button
            type="button"
            onClick={handlePasskey}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 border border-border font-sans text-sm font-semibold text-dark py-3.5 hover:border-dark transition-colors disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 0-5 5c0 2.5 1.5 4 1.5 4M12 2a5 5 0 0 1 5 5" /><circle cx="12" cy="9" r="2.5" /><path d="M12 11.5V21M12 21l-2-1.5M12 18l2-1.5" /></svg>
            {passkeyLoading ? 'Passkey wird geprüft…' : 'Mit Passkey anmelden'}
          </button>
          <p className="font-sans text-xs text-text-secondary text-center mt-2">
            Ohne Passwort — mit Fingerabdruck, Gesichtserkennung oder Geräte-PIN.
          </p>

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
  )
}
