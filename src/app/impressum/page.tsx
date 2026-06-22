import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Impressum — LAEMU',
  description: 'Impressum und Kontaktangaben der LAEMU-Plattform für die Schweizer Ländlermusik.',
}

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      updated="22. Juni 2026"
      intro="Angaben gemäss den gesetzlichen Vorgaben zur Anbieterkennzeichnung der LAEMU-Plattform."
      sections={[
        {
          heading: 'Betreiberin',
          body: (
            <>
              <p>
                LAEMU — Ländlermusik
                <br />
                Musterstrasse 12
                <br />
                6000 Luzern
                <br />
                Schweiz
              </p>
            </>
          ),
        },
        {
          heading: 'Kontakt',
          body: (
            <>
              <p>
                E-Mail:{' '}
                <a href="mailto:info@laemu.ch" className="text-accent-gold hover:underline">
                  info@laemu.ch
                </a>
              </p>
              <p>
                Allgemeine Anfragen und Anliegen rund um Musikschule, Community und Lernvideodatenbank richtest du
                bitte an die oben genannte E-Mail-Adresse.
              </p>
            </>
          ),
        },
        {
          heading: 'Vertretungsberechtigte Personen',
          body: <p>Die Plattform wird durch das LAEMU-Team betrieben und vertreten.</p>,
        },
        {
          heading: 'Haftungsausschluss',
          body: (
            <p>
              Die Inhalte dieser Plattform werden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
              und Aktualität der Inhalte wird jedoch keine Gewähr übernommen. Für Inhalte externer Links sind
              ausschliesslich deren Betreiber verantwortlich.
            </p>
          ),
        },
        {
          heading: 'Urheberrecht',
          body: (
            <p>
              Alle auf dieser Plattform veröffentlichten Inhalte (Lernvideos, Texte, Bilder, Notenmaterial) sind
              urheberrechtlich geschützt. Eine Weiterverbreitung oder Vervielfältigung ohne ausdrückliche Zustimmung
              ist nicht gestattet.
            </p>
          ),
        },
      ]}
    />
  )
}
