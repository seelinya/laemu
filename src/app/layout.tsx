import type { Metadata } from 'next'
import { Syne, Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
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
    'LAEMU ist die zentrale Plattform für die Schweizer Ländlermusik. Community, Academy, Events, Formationen und mehr.',
  keywords: ['Ländlermusik', 'Schweizer Volksmusik', 'LAEMU', 'Community', 'Academy', 'Schwyzerörgeli', 'Handorgel'],
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
    <html lang="de" className={`${syne.variable} ${inter.variable}`}>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
