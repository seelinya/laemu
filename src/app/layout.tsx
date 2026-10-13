import type { Metadata, Viewport } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/Footer'
import { TopProgressBar } from '@/components/TopProgressBar'

// Fallback-Schrift für Radona Norm (lizenziert, lokal via @font-face):
// Open Sans deckt Headings & Fliesstext/UI ab, falls Radona nicht lädt.
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-opensans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'LAEMU — Der exklusive Bereich für Ländlermusik',
  description:
    'Der exklusive LAEMU Mitgliederbereich: Musikschule, Community und Stücke für die Schweizer Ländlermusik.',
  keywords: ['Ländlermusik', 'Schweizer Volksmusik', 'LAEMU', 'Musikschule', 'Community', 'Stücke', 'Schwyzerörgeli', 'Handorgel'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.png',
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
    <html lang="de" className={openSans.variable}>
      <body>
        {/* Ladebalken ganz oben — über dem Header sichtbar bei jeder Navigation. */}
        <TopProgressBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
