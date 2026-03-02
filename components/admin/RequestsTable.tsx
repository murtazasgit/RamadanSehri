'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SehriRequest } from '../../lib/constants'
import { formatDate, exportToCSV, validateNoXSS, validateNoSQLInjection } from '../../lib/utils'
import { updateDeliveryStatus, deleteRequest } from '../../lib/store'
import { Search, Download, Check, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface RequestsTableProps {
  requests: SehriRequest[]
  onRefresh: () => void
}

type SortField = 'createdAt' | 'fullName' | 'pgName' | 'peopleCount'
type SortDirection = 'asc' | 'desc'

export function RequestsTable({ requests, onRefresh }: RequestsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [pgFilter, setPgFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const uniquePGs = useMemo(() => {
    const pgs = new Set(requests.map(r => r.pgName))
    return Array.from(pgs).sort()
  }, [requests])

  const filteredRequests = useMemo(() => {
    let filtered = [...requests]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.phone.includes(query) ||
          r.fullName.toLowerCase().includes(query) ||
          r.requestId.toLowerCase().includes(query)
      )
    }

    if (pgFilter !== 'all') {
      filtered = filtered.filter(r => r.pgName === pgFilter)
    }

    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'fullName':
          comparison = a.fullName.localeCompare(b.fullName)
          break
        case 'pgName':
          comparison = a.pgName.localeCompare(b.pgName)
          break
        case 'peopleCount':
          comparison = a.peopleCount - b.peopleCount
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [requests, searchQuery, pgFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleToggleDelivered = (id: string, currentStatus: boolean) => {
    updateDeliveryStatus(id, !currentStatus)
    onRefresh()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      deleteRequest(id)
      onRefresh()
    }
  }

  const handleExport = () => {
    const exportData = filteredRequests.map(r => ({
      'Request ID': r.requestId,
      'PG Name': r.pgName,
      'Full Name': r.fullName,
      'Phone': r.phone,
      'Room Number': r.roomNumber || '-',
      'Address': r.address,
      'People Count': r.peopleCount,
      'Landmark': r.landmark || '-',
      'Notes': r.notes || '-',
      'Delivered': r.delivered ? 'Yes' : 'No',
      'Created At': formatDate(r.createdAt),
    }))
    exportToCSV(exportData, `sehri-requests-${new Date().toISOString().split('T')[0]}`)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by phone, name, or request ID..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value
                if (val.length > 100) return
                if (!validateNoXSS(val) || !validateNoSQLInjection(val)) return
                setSearchQuery(val)
              }}
              className="w-full pl-10 pr-4 py-3 bg-background-tertiary border border-border rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <select
          value={pgFilter}
          onChange={(e) => setPgFilter(e.target.value)}
          className="px-4 py-3 bg-background-tertiary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All PGs</option>
          {uniquePGs.map(pg => (
            <option key={pg} value={pg}>{pg}</option>
          ))}
        </select>
        <Button onClick={handleExport} variant="outline" className="shrink-0">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-1 hover:text-text-primary"
                >
                  Date <SortIcon field="createdAt" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">
                <button
                  onClick={() => handleSort('fullName')}
                  className="flex items-center gap-1 hover:text-text-primary"
                >
                  Name <SortIcon field="fullName" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">
                <button
                  onClick={() => handleSort('pgName')}
                  className="flex items-center gap-1 hover:text-text-primary"
                >
                  PG <SortIcon field="pgName" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">Phone</th>
              <th className="text-center py-3 px-4 text-text-secondary font-medium text-sm">
                <button
                  onClick={() => handleSort('peopleCount')}
                  className="flex items-center gap-1 hover:text-text-primary"
                >
                  People <SortIcon field="peopleCount" />
                </button>
              </th>
              <th className="text-center py-3 px-4 text-text-secondary font-medium text-sm">Status</th>
              <th className="text-center py-3 px-4 text-text-secondary font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-text-secondary">
                    No requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request, index) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-border/50 hover:bg-background-secondary/50"
                  >
                    <td className="py-3 px-4 text-text-secondary text-sm">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-text-primary font-medium">{request.fullName}</p>
                        <p className="text-text-secondary text-xs">{request.requestId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-primary">{request.pgName}</td>
                    <td className="py-3 px-4 text-text-secondary">{request.phone}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent font-medium">
                        {request.peopleCount}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleDelivered(request.id, request.delivered)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          request.delivered
                            ? 'bg-primary/20 text-primary'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}
                      >
                        {request.delivered ? (
                          <>
                            <Check className="w-3 h-3" /> Delivered
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" /> Pending
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
