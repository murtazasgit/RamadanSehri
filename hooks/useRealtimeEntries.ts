'use client'

import { useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface Entry {
  id: number
  person_name: string
  phone: string
  address: string
  people_count: number
  created_at: string
}

type RealtimePayload = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Entry
  old: Entry
}

export function useRealtimeEntries(
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>
) {
  const handleRealtimeUpdate = useCallback((payload: RealtimePayload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    setEntries((prev) => {
      switch (eventType) {
        case 'INSERT':
          if (prev.some(e => e.id === newRecord.id)) return prev
          return [newRecord, ...prev]
        
        case 'UPDATE':
          return prev.map((entry) =>
            entry.id === newRecord.id ? newRecord : entry
          )
        
        case 'DELETE':
          return prev.filter((entry) => entry.id !== oldRecord.id)
        
        default:
          return prev
      }
    })
  }, [setEntries])

  useEffect(() => {
    const channel = supabase
      .channel('sehri-entries-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sehri_entries',
        },
        (payload) => {
          handleRealtimeUpdate(payload as unknown as RealtimePayload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [handleRealtimeUpdate])
}
