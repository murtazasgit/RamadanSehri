import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
}

const SQL_PATTERN = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|TABLE|DATABASE|EXEC|EXECUTE|xp_)\b|;|--|\/\*|\*\/|@@|@)/gi

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  return input.trim()
}

export function sanitizeForHTML(input: string): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/[&<>"'/]/g, char => HTML_ENTITIES[char] || char)
    .trim()
}

export function sanitizeForSQL(input: string): string {
  if (typeof input !== 'string') return ''
  return input.replace(SQL_PATTERN, '')
}

export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') return ''
  return phone.replace(/\D/g, '').slice(0, 10)
}

export function validateNoXSS(input: string): boolean {
  if (typeof input !== 'string') return false
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:\s*text\/html/gi,
    /vbscript:/gi,
  ]
  return !xssPatterns.some(pattern => pattern.test(input))
}

export function validateNoSQLInjection(input: string): boolean {
  if (typeof input !== 'string') return false
  return !SQL_PATTERN.test(input)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatDateOnly(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function isToday(date: string | Date): boolean {
  const today = new Date()
  const inputDate = new Date(date)
  return (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  )
}

export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {})
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        const stringValue = String(value ?? '')
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
