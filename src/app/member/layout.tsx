import type { ReactNode } from 'react'
import { MemberChrome } from '@/components/MemberChrome'

// Persistente Mitglieder-Navigation (Sidebar/Drawer) für ALLE Seiten unter
// /member — bleibt beim Wechsel auf Unterseiten (Profil, Stück-Detail …) bestehen.
export default function MemberLayout({ children }: { children: ReactNode }) {
  return <MemberChrome>{children}</MemberChrome>
}
