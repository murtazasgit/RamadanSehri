'use client'

import { useState, useEffect, useCallback } from 'react'
import { ADMIN_PASSWORD } from '../../lib/constants'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Users, Utensils, Clock, CheckCircle, Loader2, RefreshCw, Calendar } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useRealtimeEntries, Entry } from '../../hooks/useRealtimeEntries'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [allEntries, setAllEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [startDateTime, setStartDateTime] = useState<string>('')

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    
    // Calculate period from last 5 AM to next 5 AM (local time)
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
    
    // Store as ISO string for consistency
    setStartDateTime(periodStart.toISOString())
    
    try {
      const { data, error } = await supabase
        .from('sehri_entries')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setAllEntries(data || [])
      setEntries(data || [])
    } catch (err) {
      console.error('Error fetching:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) fetchEntries()
  }, [isAuthenticated, fetchEntries])

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const formatDisplayDateTime = (isoString: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    return date.toLocaleString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const today = new Date().toDateString()
  const todayEntries = entries.filter(e => new Date(e.created_at).toDateString() === today)

  const stats = {
    total: entries.length,
    today: todayEntries.length,
    totalFood: entries.reduce((sum, e) => sum + e.people_count, 0),
    todayFood: todayEntries.reduce((sum, e) => sum + e.people_count, 0),
  }

  const filteredEntries = entries.filter(e => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return e.person_name.toLowerCase().includes(q) || 
           e.phone.includes(q) || 
           e.address.toLowerCase().includes(q)
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-background-secondary rounded-xl p-6 border border-border/50">
          <div className="text-center mb-5">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-heading text-text-primary">Admin Login</h1>
          </div>
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} error={error} />
          <Button type="submit" className="w-full mt-4">Login</Button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 px-3">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading text-text-primary">Admin <span className="text-accent">Dashboard</span></h1>
            <p className="text-text-secondary text-xs">Manage Sehri requests</p>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)} className="text-sm py-2">Logout</Button>
        </div>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-accent" />
            <div>
              <p className="text-text-primary font-medium text-sm">Period: <span className="text-accent">{formatDisplayDateTime(startDateTime)}</span> to next 5 AM</p>
              <p className="text-text-secondary text-xs">Auto-resets daily at 5 AM</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, icon: Users, color: 'primary' },
            { label: 'Today', value: stats.today, icon: Clock, color: 'accent' },
            { label: 'Total Food', value: stats.totalFood, icon: Utensils, color: 'primary' },
            { label: 'Today Food', value: stats.todayFood, icon: CheckCircle, color: 'accent' },
          ].map((stat, i) => (
            <div key={i} className={`bg-background-secondary rounded-xl p-4 border border-border/50`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-xs">{stat.label}</p>
                  <p className={`text-xl font-heading ${stat.color === 'accent' ? 'text-accent' : 'text-text-primary'}`}>{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.color === 'accent' ? 'bg-accent/20' : 'bg-primary/20'}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color === 'accent' ? 'text-accent' : 'text-primary'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background-secondary rounded-xl p-4 border border-border/50">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Search by name, phone, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-background-tertiary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {loading ? (
            <div className="text-center py-8"><Loader2 className="w-6 h-6 text-accent animate-spin mx-auto" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2.5 px-3 text-text-secondary font-medium">Date</th>
                    <th className="text-left py-2.5 px-3 text-text-secondary font-medium">Name</th>
                    <th className="text-left py-2.5 px-3 text-text-secondary font-medium">Phone</th>
                    <th className="text-left py-2.5 px-3 text-text-secondary font-medium">Address</th>
                    <th className="text-center py-2.5 px-3 text-text-secondary font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-6 text-text-secondary">No entries found</td></tr>
                  ) : (
                    filteredEntries.map((entry) => (
                      <tr key={entry.id} className="border-b border-border/50 hover:bg-background-tertiary/30">
                        <td className="py-2.5 px-3 text-text-secondary text-xs">{new Date(entry.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-2.5 px-3 text-text-primary font-medium">{entry.person_name}</td>
                        <td className="py-2.5 px-3 text-text-secondary">{entry.phone}</td>
                        <td className="py-2.5 px-3 text-text-secondary text-xs">{entry.address}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">{entry.people_count}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
