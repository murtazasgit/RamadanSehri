'use client'

import Link from 'next/link'
import { Moon } from 'lucide-react'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Moon className="w-6 h-6 text-accent group-hover:animate-pulse" />
            <span className="font-heading text-xl text-text-primary">
              Ramadan<span className="text-accent">Sehri</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/register"
              className="text-sm text-text-secondary hover:text-accent transition-colors"
            >
              Register
            </Link>
            <Link
              href="/admin"
              className="text-sm text-text-secondary hover:text-accent transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
