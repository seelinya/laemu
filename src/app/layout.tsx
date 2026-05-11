import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

/*
  Using DM Serif Display + DM Sans as stand-in for Radona (Insigne Design).
  To activate Radona: purchase at myfonts.com/de/collections/radona-font-insigne/,
  place files in /public/fonts/, and follow the @font-face instructions in globals.css.
  Then remove these Google Font imports and update the CSS variable references.
*/
const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'LAEMU — Am Puls der Ländlermusik',
  description:
    'LAEMU ist die zentrale Plattform für die Schweizer Ländlermusik. Community, Academy, Events, Formationen und mehr.',
  keywords: ['Ländlermusik', 'Schweizer Volksmusik', 'LAEMU', 'Community', 'Academy', 'Schwyzerörgeli', 'Handorgel'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
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
    <html lang="de" className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
