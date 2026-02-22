'use client'

import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  color?: 'primary' | 'accent' | 'default'
}

export function StatsCard({ title, value, subtitle, icon, color = 'default' }: StatsCardProps) {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/30',
    accent: 'from-accent/20 to-accent/5 border-accent/30',
    default: 'from-background-secondary to-background-tertiary border-border',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-xl p-5 border bg-gradient-to-br',
        colorClasses[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm">{title}</p>
          <p className="font-heading text-3xl text-text-primary mt-1">{value}</p>
          {subtitle && <p className="text-text-secondary text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={cn(
          'p-3 rounded-lg',
          color === 'accent' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
        )}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
