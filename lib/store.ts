'use client'

import { SehriRequest, generateRequestId } from './constants'

const STORAGE_KEY = 'sehri_requests'

export function getRequests(): SehriRequest[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveRequest(request: Omit<SehriRequest, 'id' | 'delivered' | 'createdAt' | 'updatedAt'>): SehriRequest {
  const requests = getRequests()
  
  const newRequest: SehriRequest = {
    ...request,
    id: crypto.randomUUID(),
    requestId: generateRequestId(),
    delivered: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  requests.push(newRequest)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  
  return newRequest
}

export function checkDuplicatePhone(phone: string): boolean {
  const requests = getRequests()
  return requests.some(r => r.phone === phone)
}

export function updateDeliveryStatus(id: string, delivered: boolean): void {
  const requests = getRequests()
  const index = requests.findIndex(r => r.id === id)
  if (index !== -1) {
    requests[index].delivered = delivered
    requests[index].updatedAt = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  }
}

export function deleteRequest(id: string): void {
  const requests = getRequests()
  const filtered = requests.filter(r => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function getStats() {
  const requests = getRequests()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayRequests = requests.filter(r => new Date(r.createdAt) >= today)
  const totalFood = requests.reduce((sum, r) => sum + r.peopleCount, 0)
  const todayFood = todayRequests.reduce((sum, r) => sum + r.peopleCount, 0)
  
  const pgBreakdown: Record<string, { count: number; food: number }> = {}
  requests.forEach(r => {
    if (!pgBreakdown[r.pgName]) {
      pgBreakdown[r.pgName] = { count: 0, food: 0 }
    }
    pgBreakdown[r.pgName].count++
    pgBreakdown[r.pgName].food += r.peopleCount
  })
  
  return {
    totalRequests: requests.length,
    todayRequests: todayRequests.length,
    totalFood,
    todayFood,
    pgBreakdown,
    deliveredCount: requests.filter(r => r.delivered).length,
    pendingCount: requests.filter(r => !r.delivered).length,
  }
}

export function seedDemoData() {
  const existing = getRequests()
  if (existing.length > 0) return
  
  const demoRequests: Omit<SehriRequest, 'id'>[] = [
    { pgId: 'manju', pgName: 'Manju PG', fullName: 'Ahmed Khan', phone: '9876543210', roomNumber: '101', address: 'Near City Center, Main Road', peopleCount: 2, isOthers: false, requestId: 'REQ-2026-001', delivered: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { pgId: 'techies-nest', pgName: 'Techies Nest', fullName: 'Fatima Begum', phone: '9876543211', roomNumber: '205', address: 'Tech Park Road', peopleCount: 3, isOthers: false, requestId: 'REQ-2026-002', delivered: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { pgId: 'yadavi', pgName: 'Yadavi PG', fullName: 'Omar Hassan', phone: '9876543212', roomNumber: '302', address: 'Yadavi Layout, Block A', peopleCount: 1, isOthers: false, requestId: 'REQ-2026-003', delivered: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { pgId: 'king-1', pgName: 'King PG - 1', fullName: 'Ali Rahman', phone: '9876543213', roomNumber: '104', address: 'King Street, Phase 1', peopleCount: 4, isOthers: false, requestId: 'REQ-2026-004', delivered: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { pgId: 'others', pgName: 'Al-Farooq PG', fullName: 'Yusuf Iqbal', phone: '9876543214', address: '123 New Market Road, Near Mosque', peopleCount: 2, landmark: 'Opposite City Hospital', notes: 'Please deliver at gate', isOthers: true, requestId: 'REQ-2026-005', delivered: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ]
  
  demoRequests.forEach(req => {
    const request: SehriRequest = {
      ...req,
      id: crypto.randomUUID(),
    }
    existing.push(request)
  })
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}
