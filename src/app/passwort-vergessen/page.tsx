'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PasswortVergessenPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
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
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-accent-gold flex items-center justify-center mx-auto mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h1 className="font-heading text-2xl font-black text-dark mb-3">E-Mail unterwegs</h1>
              <p className="font-sans text-sm text-text-secondary leading-relaxed mb-5">
                Falls ein Konto mit <span className="text-dark font-medium">{email || 'dieser Adresse'}</span> existiert,
                haben wir dir einen Link zum Zurücksetzen deines Passworts geschickt.
              </p>
              {/* Demo: Der Link in der E-Mail führt zur Seite «Passwort zurücksetzen». */}
              <Link
                href="/passwort-zuruecksetzen"
                className="inline-block font-sans text-xs text-accent-gold hover:underline"
              >
                Demo: Link aus der E-Mail öffnen →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-2xl font-black text-dark mb-2">Passwort vergessen?</h1>
              <p className="font-sans text-sm text-text-secondary mb-6 leading-relaxed">
                Gib deine E-Mail-Adresse ein — wir senden dir einen Link, um dein Passwort zurückzusetzen.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-sans text-xs font-medium text-text-secondary uppercase tracking-widest mb-2">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="deine@email.ch"
                    className="w-full border border-border px-4 py-3 font-sans text-sm text-dark bg-white focus:outline-none focus:border-dark transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-dark text-white font-sans text-sm font-semibold tracking-wide py-3.5 hover:bg-accent-gold hover:text-white transition-colors duration-200"
                >
                  Link senden →
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link href="/login" className="font-sans text-sm text-dark font-semibold hover:text-accent-gold transition-colors">
              ← Zurück zum Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
