"use client"

import { useState, useEffect } from "react"
import { MessageSquareText, Search, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react"

interface MessageLog {
  id: string
  phone: string
  type: string
  status: string
  content: string
  error: string | null
  createdAt: string
}

export default function MessageLogsPage() {
  const [logs, setLogs] = useState<MessageLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/message-logs')
      const data = await res.json()
      if (Array.isArray(data)) setLogs(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this log?')) return
    try {
      const res = await fetch(`/api/message-logs?id=${id}`, { method: 'DELETE' })
      if (res.ok) setLogs(logs.filter(l => l.id !== id))
    } catch (e) {
      alert('Failed to delete')
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL logs?')) return
    try {
      const res = await fetch('/api/message-logs', { method: 'DELETE' })
      if (res.ok) setLogs([])
    } catch (e) {
      alert('Failed to clear logs')
    }
  }

  const filtered = logs.filter(l => 
    l.phone.includes(search) || 
    l.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto text-zinc-100 bg-[#0a0a0a] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageSquareText className="h-6 w-6 text-blue-500" /> Message Logs
          </h2>
          <p className="text-zinc-400 mt-1">Track all outgoing automated WhatsApp & SMS messages.</p>
        </div>
        <button 
          onClick={handleClearAll}
          className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Clear All Logs
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search phone number or message..." 
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-600" 
          />
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-900/50 border-b border-zinc-800 text-xs uppercase font-medium text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Phone Number</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 w-[40%]">Message Content</th>
                  <th className="px-4 py-3">Error (if any)</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-zinc-600 mx-auto" />
                    </td>
                  </tr>
                ) : filtered.length > 0 ? filtered.map(log => (
                  <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-US', { 
                        dateStyle: 'medium', timeStyle: 'short' 
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-300">{log.phone}</td>
                    <td className="px-4 py-3">
                      <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-xs font-semibold">
                        {log.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {log.status === 'success' ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded-full w-fit">
                          <CheckCircle2 className="h-3 w-3" /> success
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400 text-xs font-medium border border-red-500/20 bg-red-500/10 px-2 py-1 rounded-full w-fit">
                          <XCircle className="h-3 w-3" /> failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="truncate max-w-sm text-zinc-300" title={log.content}>
                        {log.content}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="truncate max-w-[150px] text-red-400 text-xs font-mono" title={log.error || ''}>
                        {log.error || '-'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDelete(log.id)}
                        className="text-red-500/70 hover:text-red-500 transition-colors p-1 flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> <span className="text-xs">Delete</span>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                      No logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
