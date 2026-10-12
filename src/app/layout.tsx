import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/Footer'
import { TopProgressBar } from '@/components/TopProgressBar'

// Fallback-Schriften für Radona Norm (lizenziert, lokal nachzureichen):
// Plus Jakarta Sans deckt Headings ab, Inter den Fliesstext/UI.
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'LAEMU — Der exklusive Bereich für Ländlermusik',
  description:
    'Der exklusive LAEMU Mitgliederbereich: Musikschule, Community und Stücke für die Schweizer Ländlermusik.',
  keywords: ['Ländlermusik', 'Schweizer Volksmusik', 'LAEMU', 'Musikschule', 'Community', 'Stücke', 'Schwyzerörgeli', 'Handorgel'],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'LAEMU — Der exklusive Bereich für Ländlermusik',
    description: 'Musikschule, Community und Stücke für die Schweizer Ländlermusik.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body>
        {/* Ladebalken ganz oben — über dem Header sichtbar bei jeder Navigation. */}
        <TopProgressBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
