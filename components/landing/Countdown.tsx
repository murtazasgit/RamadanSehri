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
      <p className="text-text-secondary text-sm mb-3">Time until Sehri</p>
      <div className="flex gap-3 sm:gap-4 justify-center">
        {timeUnits.map(({ label, value }, index) => (
          <div key={label} className="flex flex-col items-center">
            <motion.div
              key={value}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-background-secondary border border-border rounded-lg px-3 sm:px-5 py-3 min-w-[70px] sm:min-w-[80px]"
            >
              <span className="font-heading text-2xl sm:text-3xl text-accent">
                {String(value).padStart(2, '0')}
              </span>
            </motion.div>
            <span className="text-text-secondary text-xs mt-2">{label}</span>
            {index < timeUnits.length - 1 && (
              <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-accent text-xl">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
