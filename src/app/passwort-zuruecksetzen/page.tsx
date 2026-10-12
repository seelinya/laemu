'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { PasswordInput } from '@/components/PasswordInput'

// ─── Passwort zurücksetzen ────────────────────────────────────────────────────
// Ziel des Links aus der «Passwort vergessen»-E-Mail. Man vergibt ein neues
// Passwort (mind. 8 Zeichen, zweimal identisch). In dieser Demo gibt es kein
// Backend — nach dem Absenden zeigen wir die Erfolgsmeldung und führen zurück
// zum Login. Über `?status=expired` lässt sich der Ablauf-Fall zeigen.

function ZuruecksetzenInner() {
  const params = useSearchParams()
  const expired = params.get('status') === 'expired'

  const [passwort, setPasswort] = useState('')
  const [wiederholung, setWiederholung] = useState('')
  const [done, setDone] = useState(false)

  const tooShort = passwort.length > 0 && passwort.length < 8
  const mismatch = wiederholung.length > 0 && wiederholung !== passwort
  const valid = passwort.length >= 8 && passwort === wiederholung

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    setDone(true)
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
          {expired ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-surface border border-border flex items-center justify-center mx-auto mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <h1 className="font-heading text-2xl font-black text-dark mb-3">Link abgelaufen</h1>
              <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6">
                Dieser Link zum Zurücksetzen ist nicht mehr gültig. Fordere einen neuen an.
              </p>
              <Link
                href="/passwort-vergessen"
                className="block w-full bg-dark text-white font-sans text-sm font-semibold tracking-wide py-3.5 hover:bg-accent-gold hover:text-white transition-colors duration-200"
              >
                Neuen Link anfordern →
              </Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-accent-gold flex items-center justify-center mx-auto mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h1 className="font-heading text-2xl font-black text-dark mb-3">Passwort geändert</h1>
              <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6">
                Dein neues Passwort ist gespeichert. Du kannst dich jetzt damit anmelden.
              </p>
              <Link
                href="/login"
                className="block w-full bg-dark text-white font-sans text-sm font-semibold tracking-wide py-3.5 hover:bg-accent-gold hover:text-white transition-colors duration-200"
              >
                Zur Anmeldung →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-2xl font-black text-dark mb-2">Neues Passwort</h1>
              <p className="font-sans text-sm text-text-secondary mb-6 leading-relaxed">
                Vergib ein neues Passwort für dein LAEMU-Konto. Es muss mindestens 8 Zeichen lang sein.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-sans text-xs font-medium text-text-secondary uppercase tracking-widest mb-2">
                    Neues Passwort
                  </label>
                  <PasswordInput
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    required
                    placeholder="Mindestens 8 Zeichen"
                    className="w-full border border-border px-4 py-3 font-sans text-sm text-dark bg-white focus:outline-none focus:border-dark transition-colors"
                  />
                  {tooShort && (
                    <p className="font-sans text-xs text-accent-gold mt-1.5">Das Passwort muss mindestens 8 Zeichen lang sein.</p>
                  )}
                </div>

                <div>
                  <label className="block font-sans text-xs font-medium text-text-secondary uppercase tracking-widest mb-2">
                    Passwort wiederholen
                  </label>
                  <PasswordInput
                    value={wiederholung}
                    onChange={(e) => setWiederholung(e.target.value)}
                    required
                    placeholder="Passwort erneut eingeben"
                    className="w-full border border-border px-4 py-3 font-sans text-sm text-dark bg-white focus:outline-none focus:border-dark transition-colors"
                  />
                  {mismatch && (
                    <p className="font-sans text-xs text-accent-gold mt-1.5">Die Passwörter stimmen nicht überein.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!valid}
                  className={`w-full font-sans text-sm font-semibold tracking-wide py-3.5 transition-colors duration-200 ${valid ? 'bg-dark text-white hover:bg-accent-gold hover:text-white' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  Passwort speichern →
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

export default function PasswortZuruecksetzenPage() {
  return (
    <Suspense fallback={null}>
      <ZuruecksetzenInner />
    </Suspense>
  )
}
