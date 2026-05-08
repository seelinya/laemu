import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LAEMU — Am Puls der Ländlermusik',
  description:
    'LAEMU ist die zentrale Plattform für die Schweizer Ländlermusik. Community, Academy, Events, Formationen und mehr.',
  keywords: ['Ländlermusik', 'Schweizer Volksmusik', 'LAEMU', 'Community', 'Academy', 'Schwyzerörgeli', 'Handorgel'],
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
    <html lang="de" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
