'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '../ui/Button'
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
          
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
            <p className="relative text-3xl sm:text-4xl lg:text-5xl font-arabic text-accent tracking-wider py-2" dir="rtl">
              مَنْ فَطَّرَ صَائِمًا
            </p>
            <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-3 text-accent/60" viewBox="0 0 100 20" fill="currentColor">
              <path d="M0 10 Q25 0 50 10 T100 10" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          
          <p className="text-lg sm:text-xl text-text-secondary mb-8 font-body">
            "May Allah bless those who feed others."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
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
