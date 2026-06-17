import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — LAEMU',
  description: 'Wie LAEMU deine persönlichen Daten erhebt, verwendet und schützt.',
}

export default function DatenschutzPage() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      updated="15. Juni 2026"
      intro="Der Schutz deiner persönlichen Daten ist uns wichtig. Diese Erklärung beschreibt, welche Daten LAEMU erhebt, zu welchem Zweck wir sie verwenden und welche Rechte dir zustehen. Wir halten uns dabei an das Schweizer Datenschutzgesetz (revDSG)."
      sections={[
        {
          heading: 'Verantwortliche Stelle',
          body: (
            <p>
              Verantwortlich für die Datenbearbeitung ist LAEMU. Bei Fragen zum Datenschutz erreichst du uns unter{' '}
              <a href="mailto:info@laemu.ch" className="text-accent-gold hover:underline">info@laemu.ch</a>.
            </p>
          ),
        },
        {
          heading: 'Welche Daten wir erheben',
          body: (
            <>
              <p>Im Rahmen der Kontoerstellung und Nutzung erheben wir insbesondere:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Stammdaten: Vor- und Nachname, E-Mail-Adresse, Geburtsdatum und Adresse</li>
                <li>Konto- und Mitgliedschaftsdaten: gewählter Plan, Instrumente und Profilangaben</li>
                <li>Zahlungsdaten: bei kostenpflichtigen Plänen (Free-Account ohne Zahlungsmittel)</li>
                <li>Nutzungsdaten: Fortschritt in Kursen, angesehene Lernvideos und Community-Beiträge</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Zweck der Bearbeitung',
          body: (
            <p>
              Wir bearbeiten deine Daten, um dein Konto zu führen, dir die Musikschule, Community und
              Lernvideodatenbank bereitzustellen, Zahlungen abzuwickeln sowie unsere Dienste zu verbessern und mit dir
              zu kommunizieren.
            </p>
          ),
        },
        {
          heading: 'Weitergabe an Dritte',
          body: (
            <p>
              Eine Weitergabe erfolgt nur, soweit dies für den Betrieb der Plattform erforderlich ist (z. B. an
              Zahlungsdienstleister oder Hosting-Anbieter) oder wir gesetzlich dazu verpflichtet sind. Diese Partner
              sind vertraglich zur Vertraulichkeit und zur Einhaltung des Datenschutzes verpflichtet.
            </p>
          ),
        },
        {
          heading: 'Speicherdauer',
          body: (
            <p>
              Wir speichern deine Daten so lange, wie es für die genannten Zwecke oder aufgrund gesetzlicher
              Aufbewahrungspflichten erforderlich ist. Löschst du dein Konto, werden deine Daten entfernt, soweit keine
              gesetzlichen Pflichten entgegenstehen.
            </p>
          ),
        },
        {
          heading: 'Cookies & Reichweitenmessung',
          body: (
            <p>
              Wir verwenden technisch notwendige Cookies, um die Plattform bereitzustellen und dich angemeldet zu
              halten. Für statistische Auswertungen setzen wir nur datensparsame, möglichst anonymisierte Verfahren
              ein.
            </p>
          ),
        },
        {
          heading: 'Deine Rechte',
          body: (
            <p>
              Dir stehen die Rechte auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit sowie das Recht auf
              Widerspruch gegen bestimmte Bearbeitungen zu. Wende dich dazu jederzeit an{' '}
              <a href="mailto:info@laemu.ch" className="text-accent-gold hover:underline">info@laemu.ch</a>.
            </p>
          ),
        },
        {
          heading: 'Datensicherheit',
          body: (
            <p>
              Wir treffen angemessene technische und organisatorische Massnahmen, um deine Daten vor Verlust, Missbrauch
              und unbefugtem Zugriff zu schützen. Eine vollständige Sicherheit bei der Übertragung im Internet kann
              jedoch nicht garantiert werden.
            </p>
          ),
        },
      ]}
    />
  )
}
