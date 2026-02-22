'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '../ui/Button'
import { Countdown } from './Countdown'
import { Moon, Star } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-accent"
            >
              <Moon className="w-16 h-16" />
            </motion.div>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-text-primary mb-4 leading-tight">
            Ramadan Sehri
            <br />
            <span className="text-gold-gradient">Food Registration</span>
          </h1>
          
          <p className="text-arabic text-2xl text-accent mb-4" dir="rtl">
            مَنْ فَطَّرَ صَائِمًا
          </p>
          
          <p className="text-lg sm:text-xl text-text-secondary mb-8 font-body">
            "May Allah bless those who feed others."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Countdown />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10"
        >
          <Link href="/register">
            <Button size="lg" className="px-10 py-4 text-lg">
              Register for Sehri
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
