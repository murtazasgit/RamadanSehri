'use client'

import { motion } from 'framer-motion'
import { PGS } from '../../lib/constants'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

interface PGSelectorProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PGSelector({ selectedId, onSelect }: PGSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {PGS.map((pg, index) => (
        <motion.div
          key={pg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            onClick={() => onSelect(pg.id)}
            selected={selectedId === pg.id}
            hoverable
            className={cn(
              'text-center py-4 px-3',
              selectedId === pg.id && 'bg-primary/20'
            )}
          >
            <h3 className="font-heading text-lg text-text-primary">
              {pg.name}
            </h3>
            {pg.id !== 'others' && (
              <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                {pg.address}
              </p>
            )}
            {pg.id === 'others' && (
              <p className="text-xs text-accent mt-1">
                Not listed above
              </p>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
