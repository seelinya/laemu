import { redirect } from 'next/navigation'

// Die LAEMU App führt direkt in den exklusiven Mitgliederbereich.
// Wer die App öffnet, wird sofort zum Login weitergeleitet.
export default function RootPage() {
  redirect('/login')
}
