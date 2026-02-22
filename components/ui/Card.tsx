'use client'

import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  hoverable?: boolean
}

export function Card({ children, className, onClick, selected, hoverable }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl p-5 transition-all duration-300',
        'bg-background-secondary border border-border',
        selected && 'border-accent shadow-glow',
        hoverable && 'cursor-pointer hover:scale-[1.02] hover:shadow-card hover:border-primary/50',
        className
      )}
    >
      {children}
    </div>
  )
}
