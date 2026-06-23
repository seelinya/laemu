import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Nutzungsbedingungen — LAEMU',
  description: 'Die Nutzungsbedingungen der LAEMU-Plattform für Musikschule, Community und Stücke.',
}

export default function AgbPage() {
  return (
    <LegalPage
      title="Nutzungsbedingungen"
      updated="15. Juni 2026"
      intro="Diese Nutzungsbedingungen regeln die Nutzung der LAEMU-Plattform — bestehend aus Musikschule, Community und Stücke rund um die Schweizer Ländlermusik. Mit der Erstellung eines Kontos akzeptierst du diese Bedingungen."
      sections={[
        {
          heading: 'Geltungsbereich',
          body: (
            <p>
              LAEMU stellt eine Online-Plattform für die Schweizer Ländlermusik bereit. Diese Bedingungen gelten für
              alle Personen, die ein Konto erstellen und die angebotenen Dienste nutzen. Ergänzend gilt unsere
              Datenschutzerklärung.
            </p>
          ),
        },
        {
          heading: 'Konto & Registrierung',
          body: (
            <>
              <p>
                Ein Konto ist ausschliesslich für natürliche Personen vorgesehen — nicht für Firmen oder
                Organisationen. Du verpflichtest dich, bei der Registrierung wahrheitsgemässe Angaben zu machen und
                deine Zugangsdaten vertraulich zu behandeln.
              </p>
              <p>
                Du kannst kostenlos als Free-Account starten und die Plattform erkunden. Zur Nutzung der
                kostenpflichtigen Funktionen ist ein Upgrade auf einen passenden Plan erforderlich.
              </p>
            </>
          ),
        },
        {
          heading: 'Mitgliedschaften & Preise',
          body: (
            <p>
              Wir bieten Einzel- und Formationsmitgliedschaften mit jährlicher oder monatlicher Abrechnung sowie einen
              kostenlosen Free-Account an. Die jeweils gültigen Preise und Leistungen werden im Registrierungsprozess
              transparent ausgewiesen. Jahresabos werden für die gewählte Laufzeit im Voraus abgerechnet.
            </p>
          ),
        },
        {
          heading: 'Nutzung der Inhalte',
          body: (
            <p>
              Sämtliche Kurse, Lernvideos und weiteren Inhalte sind urheberrechtlich geschützt und ausschliesslich für
              deinen persönlichen, nicht-kommerziellen Gebrauch bestimmt. Das Vervielfältigen, Weitergeben oder
              öffentliche Zugänglichmachen der Inhalte ist ohne ausdrückliche Zustimmung untersagt.
            </p>
          ),
        },
        {
          heading: 'Verhalten in der Community',
          body: (
            <p>
              In der Community gehen wir respektvoll miteinander um. Beiträge mit rechtswidrigen, beleidigenden oder
              diskriminierenden Inhalten sind untersagt. LAEMU behält sich vor, solche Inhalte zu entfernen und Konten
              bei Verstössen einzuschränken oder zu sperren.
            </p>
          ),
        },
        {
          heading: 'Kündigung',
          body: (
            <p>
              Mitgliedschaften können jeweils zum Ende der laufenden Abrechnungsperiode gekündigt werden. Ein
              Free-Account kann jederzeit gelöscht werden. Bereits bezahlte Beiträge werden — soweit gesetzlich nicht
              anders vorgeschrieben — nicht anteilig zurückerstattet.
            </p>
          ),
        },
        {
          heading: 'Haftung',
          body: (
            <p>
              LAEMU bemüht sich um einen zuverlässigen Betrieb der Plattform, übernimmt jedoch keine Gewähr für die
              ununterbrochene Verfügbarkeit. Die Haftung für leichte Fahrlässigkeit ist im gesetzlich zulässigen Rahmen
              ausgeschlossen.
            </p>
          ),
        },
        {
          heading: 'Änderungen & anwendbares Recht',
          body: (
            <p>
              Wir können diese Nutzungsbedingungen anpassen und informieren dich über wesentliche Änderungen. Es gilt
              schweizerisches Recht; Gerichtsstand ist — soweit zulässig — der Sitz von LAEMU.
            </p>
          ),
        },
      ]}
    />
  )
}
