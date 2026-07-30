'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

// ─── E-Mail-Bestätigung / Kontoaktivierung ────────────────────────────────────
// Ziel des Bestätigungslinks aus der Registrierungs-E-Mail. In dieser Demo gibt
// es kein Backend — wir simulieren die Prüfung des Tokens: kurz «prüfen», dann
// «aktiviert». Erst nach der Bestätigung ist der Login in den Mitgliederbereich
// freigeschaltet. Über `?status=expired` lässt sich der Ablauf-Fall zeigen.

type Status = 'checking' | 'success' | 'expired'

function BestaetigenInner() {
  const params = useSearchParams()
  const email = (params.get('email') ?? '').trim()
  const expired = params.get('status') === 'expired'

  const [status, setStatus] = useState<Status>(expired ? 'expired' : 'checking')
  // Erneutes Senden der Bestätigungs-E-Mail (Demo — nur Rückmeldung).
  const [resent, setResent] = useState(false)

  useEffect(() => {
    if (expired) return
    // Token-Prüfung simulieren.
    const t = setTimeout(() => setStatus('success'), 1100)
    return () => clearTimeout(t)
  }, [expired])

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
        <div className="bg-white border border-border p-8 text-center">
          {status === 'checking' && (
            <>
              <div className="w-14 h-14 border-2 border-border border-t-accent-gold rounded-full animate-spin mx-auto mb-5" />
              <h1 className="font-heading text-2xl font-black text-dark mb-3">E-Mail wird bestätigt …</h1>
              <p className="font-sans text-sm text-text-secondary leading-relaxed">
                Einen Moment — wir prüfen deinen Bestätigungslink und aktivieren dein Konto.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-14 h-14 bg-accent-gold flex items-center justify-center mx-auto mb-5"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </motion.div>
              <h1 className="font-heading text-2xl font-black text-dark mb-3">E-Mail bestätigt</h1>
              <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6">
                {email ? (
                  <>Deine Adresse <span className="text-dark font-medium">{email}</span> ist bestätigt.</>
                ) : (
                  <>Deine E-Mail-Adresse ist bestätigt.</>
                )}{' '}
                Dein Konto ist jetzt aktiviert — du kannst dich anmelden.
              </p>
              <Link
                href="/login"
                className="block w-full bg-dark text-white font-sans text-sm font-semibold tracking-wide py-3.5 hover:bg-accent-gold hover:text-white transition-colors duration-200"
              >
                Jetzt anmelden →
              </Link>
            </>
          )}

          {status === 'expired' && (
            <>
              <div className="w-14 h-14 bg-surface border border-border flex items-center justify-center mx-auto mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <h1 className="font-heading text-2xl font-black text-dark mb-3">Link abgelaufen</h1>
              <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6">
                Dieser Bestätigungslink ist nicht mehr gültig. Wir senden dir gerne einen neuen an
                {email ? <> <span className="text-dark font-medium">{email}</span></> : ' deine Adresse'}.
              </p>
              {resent ? (
                <div className="bg-accent-gold/10 border border-accent-gold/40 px-4 py-3 mb-2">
                  <p className="font-sans text-sm text-text-secondary">
                    Ein neuer Bestätigungslink ist unterwegs. Bitte prüfe dein Postfach.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setResent(true)}
                  className="block w-full bg-dark text-white font-sans text-sm font-semibold tracking-wide py-3.5 hover:bg-accent-gold hover:text-white transition-colors duration-200"
                >
                  Neuen Link senden →
                </button>
              )}
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

export default function EmailBestaetigenPage() {
  return (
    <Suspense fallback={null}>
      <BestaetigenInner />
    </Suspense>
  )
}
