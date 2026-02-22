'use client'

import { Moon } from 'lucide-react'

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      
      <div className="absolute inset-0 islamic-pattern opacity-30" />
      
      <div className="lantern-glow top-[-100px] right-[-100px] animate-glow-pulse" />
      <div className="lantern-glow bottom-[-100px] left-[-100px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      
      <div className="absolute top-20 left-10 text-accent/10 animate-float">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      
      <div className="absolute bottom-20 right-10 text-primary/20 animate-float" style={{ animationDelay: '3s' }}>
        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
        </svg>
      </div>
    </div>
  )
}
