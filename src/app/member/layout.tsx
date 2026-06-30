// Mitgliederbereich-Layout — aktiviert das dunkle LAEMU-Theme (Design System)
// ausschliesslich für /member. Die Klasse `theme-dark` setzt die dunklen
// Farb-Tokens (siehe globals.css); Landing/Login/Registrierung bleiben hell.
export default function MemberLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="theme-dark bg-background text-text-primary min-h-screen">
      {children}
    </div>
  )
}
