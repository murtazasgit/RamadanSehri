export const PGS = [
  { id: 'manju', name: 'Manju PG', address: 'Near City Center, Main Road' },
  { id: 'pg-street', name: 'PG Street LMP PG', address: 'PG Street, LMP Area' },
  { id: 'yadavi', name: 'Yadavi PG', address: 'Yadavi Layout, Block A' },
  { id: 'sri-sai-ram', name: 'Sri Sai Ram Boys PG', address: 'Sri Sai Ram Nagar' },
  { id: 'techies-nest', name: 'Techies Nest', address: 'Tech Park Road' },
  { id: 'king-1', name: 'King PG - 1', address: 'King Street, Phase 1' },
  { id: 'king-2', name: 'King PG - 2', address: 'King Street, Phase 2' },
  { id: 'maruti', name: 'Maruti PG', address: 'Maruti Nagar' },
  { id: 'guest-hub', name: 'Guest Hub PG', address: 'Guest Hub Complex' },
  { id: 'shanuboganahalli', name: 'Shanuboganahalli Flat', address: 'Shanuboganahalli Village' },
  { id: 'others', name: 'Others', address: '' },
] as const

export const SEHRI_TIME = '05:20'

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ramadan2026'

export type PG = typeof PGS[number]

export interface SehriRequest {
  id: string
  pgId: string
  pgName: string
  fullName: string
  phone: string
  roomNumber?: string
  address: string
  peopleCount: number
  landmark?: string
  notes?: string
  isOthers: boolean
  requestId: string
  delivered: boolean
  createdAt: string
  updatedAt: string
}

export function generateRequestId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `REQ-${year}-${random}`
}

export function getPGById(id: string): PG | undefined {
  return PGS.find(pg => pg.id === id)
}
