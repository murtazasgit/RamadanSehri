import './globals.css'
import type { Metadata } from 'next'
import { Header } from '../components/layout/Header'
import { Background } from '../components/layout/Background'

export const metadata: Metadata = {
  title: 'Ramadan Sehri Coordination Portal',
  description: 'Register for Sehri food - Organized PG food coordination for Ramadan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Background />
        <Header />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
