import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'LAEMU — Der exklusive Bereich für Ländlermusik',
  description:
    'Der exklusive LAEMU Mitgliederbereich: Musikschule, Community und Lernvideodatenbank für die Schweizer Ländlermusik.',
  keywords: ['Ländlermusik', 'Schweizer Volksmusik', 'LAEMU', 'Musikschule', 'Community', 'Lernvideodatenbank', 'Schwyzerörgeli', 'Handorgel'],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'LAEMU — Der exklusive Bereich für Ländlermusik',
    description: 'Musikschule, Community und Lernvideodatenbank für die Schweizer Ländlermusik.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
