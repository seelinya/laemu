import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
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
      <head>
        {/* Material Symbols (Outlined) — Icon-Set des Design Systems */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,300..400,0,0"
        />
      </head>
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
