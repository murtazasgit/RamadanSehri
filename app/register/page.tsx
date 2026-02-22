'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Plus, Minus, UtensilsCrossed, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useRealtimeEntries, Entry } from '../../hooks/useRealtimeEntries'

const SETTING_KEY = 'sehri_start_datetime'

export default function RegisterPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [allEntries, setAllEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [startDateTime, setStartDateTime] = useState<string>('')
  const [formData, setFormData] = useState({
    personName: '',
    phone: '',
    address: '',
    peopleCount: '',
  })

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    setError('')
    
    const now = new Date()
    const currentHour = now.getHours()
    
    let periodStart: Date
    if (currentHour >= 5) {
      periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0, 0, 0)
    } else {
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      periodStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 5, 0, 0, 0)
    }
    
    const startTime = periodStart.toISOString().slice(0, 16)
    setStartDateTime(startTime)
    
    try {
      const { data, error: fetchError } = await supabase
        .from('sehri_entries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      
      setAllEntries(data || [])
    } catch (err) {
      console.error('Error fetching:', err)
      setError('Please configure Supabase in .env.local')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  // Use Supabase Realtime instead of polling
  useRealtimeEntries(setAllEntries)

  useEffect(() => {
    if (startDateTime && allEntries.length > 0) {
      const startTime = new Date(startDateTime).getTime()
      const filtered = allEntries.filter(e => {
        const entryTime = new Date(e.created_at).getTime()
        return entryTime >= startTime
      })
      setEntries(filtered)
    } else if (allEntries.length > 0) {
      setEntries(allEntries)
    }
  }, [startDateTime, allEntries])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.personName.trim() || !formData.phone.trim()) return
    
    setSubmitting(true)
    
    try {
      const peopleNum = parseInt(formData.peopleCount) || 0
      
      const { error: insertError } = await supabase
        .from('sehri_entries')
        .insert({
          person_name: formData.personName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          people_count: peopleNum,
        })
      
      if (insertError) throw insertError
      
      setFormData({ personName: '', phone: '', address: '', peopleCount: '' })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      fetchEntries()
    } catch (err) {
      console.error('Error submitting:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const getCount = () => parseInt(formData.peopleCount) || 0
  
  const incrementCount = () => setFormData(p => ({ ...p, peopleCount: String(getCount() + 1) }))
  const decrementCount = () => setFormData(p => ({ ...p, peopleCount: String(Math.max(0, getCount() - 1)) }))
  const handleCountChange = (value: string) => {
    if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 0)) {
      setFormData(p => ({ ...p, peopleCount: value }))
    }
  }

  const totalPeople = entries.reduce((sum, e) => sum + e.people_count, 0)

  return (
    <div className="min-h-screen py-6 px-3">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-2xl sm:text-3xl font-heading text-text-primary mb-1">
          Ramadan Sehri <span className="text-accent">Registration</span>
        </h1>
        <p className="text-text-secondary text-sm mb-6">Enter your details below</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-background-secondary rounded-xl p-5 mb-6 border border-border/50">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Person Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                placeholder="Your name"
                className="w-full px-3 py-2.5 bg-background-tertiary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Phone Number <span className="text-accent">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="10-digit mobile"
                maxLength={10}
                className="w-full px-3 py-2.5 bg-background-tertiary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Address <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Your address"
              className="w-full px-3 py-2.5 bg-background-tertiary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-center">
              Number of People <span className="text-accent">*</span>
            </label>
            <div className="flex items-center justify-center gap-3 max-w-[140px] mx-auto">
              <button type="button" onClick={decrementCount} className="w-10 h-10 rounded-lg bg-background-tertiary border border-border flex items-center justify-center text-text-primary hover:bg-primary/20 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={formData.peopleCount}
                onChange={(e) => handleCountChange(e.target.value)}
                min={0}
                className="flex-1 px-2 py-2.5 bg-background-tertiary border border-border rounded-lg text-text-primary text-center font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="button" onClick={incrementCount} className="w-10 h-10 rounded-lg bg-background-tertiary border border-border flex items-center justify-center text-text-primary hover:bg-primary/20 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-5 py-2.5 bg-primary hover:bg-primary-light text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : showSuccess ? <CheckCircle className="w-4 h-4" /> : null}
            {showSuccess ? 'Registered!' : 'Register for Sehri'}
          </button>
        </form>

        {loading ? (
          <div className="bg-background-secondary rounded-xl p-8 text-center border border-border/50">
            <Loader2 className="w-6 h-6 text-accent animate-spin mx-auto" />
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-background-secondary rounded-xl p-8 text-center border border-border/50">
            <UtensilsCrossed className="w-10 h-10 text-text-secondary/30 mx-auto mb-2" />
            <p className="text-text-secondary text-sm">No entries yet</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-heading text-text-primary">Entries <span className="text-accent">({entries.length})</span></h2>
              <p className="text-text-secondary text-xs">Total: {totalPeople} people</p>
            </div>
            <div className="bg-background-secondary rounded-xl overflow-hidden border border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background-tertiary/50">
                      <th className="text-left py-2.5 px-3 text-text-secondary font-medium">Name</th>
                      <th className="text-left py-2.5 px-3 text-text-secondary font-medium">Address</th>
                      <th className="text-center py-2.5 px-3 text-text-secondary font-medium">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} className="border-b border-border/50">
                        <td className="py-2.5 px-3 text-text-primary font-medium">{entry.person_name}</td>
                        <td className="py-2.5 px-3 text-text-secondary text-xs">{entry.address}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
                            {entry.people_count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
