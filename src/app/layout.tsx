import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

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
  title: 'LAEMU — Am Puls der Ländlermusik',
  description:
    'LAEMU ist die zentrale Plattform für die Schweizer Ländlermusik. Community, Musikschule, Events, Formationen und mehr.',
  keywords: ['Ländlermusik', 'Schweizer Volksmusik', 'LAEMU', 'Community', 'Musikschule', 'Schwyzerörgeli', 'Handorgel'],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'LAEMU — Am Puls der Ländlermusik',
    description: 'Die zentrale Plattform für die Schweizer Ländlermusik.',
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
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
