'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 })
  const [sehriTime] = useState('05:20')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const [hours, minutes] = sehriTime.split(':').map(Number)
      
      let target = new Date()
      target.setHours(hours, minutes, 0, 0)
      
      if (target <= now) {
        target.setDate(target.getDate() + 1)
      }
      
      const diff = target.getTime() - now.getTime()
      
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [sehriTime])

  const timeUnits = [
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="inline-block">
      <div className="flex gap-2 sm:gap-3 justify-center">
        {timeUnits.map(({ label, value }, index) => (
          <div key={label} className="relative flex flex-col items-center">
            <motion.div
              key={value}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-gradient-to-br from-background-secondary to-background-tertiary border border-accent/30 rounded-xl px-4 sm:px-6 py-4 min-w-[80px] sm:min-w-[90px] shadow-lg shadow-accent/10"
            >
              <span className="font-heading text-3xl sm:text-4xl text-accent drop-shadow-sm">
                {String(value).padStart(2, '0')}
              </span>
              <div className="absolute inset-0 bg-accent/5 rounded-xl" />
            </motion.div>
            <span className="text-text-secondary text-xs mt-3 font-medium uppercase tracking-wider">{label}</span>
            {index < timeUnits.length - 1 && (
              <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-accent text-2xl font-bold opacity-60">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
