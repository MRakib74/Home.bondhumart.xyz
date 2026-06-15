"use client"

import { useState, useEffect } from "react"
import { History, Search, Calendar, MessageSquare, Mail, Phone, CheckCircle2, AlertTriangle, Users } from "lucide-react"

export default function BroadcastLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    try {
      const data = localStorage.getItem('bondhu_broadcast_logs')
      if (data) {
        setLogs(JSON.parse(data).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const filteredLogs = logs.filter(log => 
    log.product?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.medium?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getMediumIcon = (medium: string) => {
    if (medium === 'whatsapp') return <MessageSquare className="h-4 w-4 text-emerald-500" />
    if (medium === 'sms') return <Phone className="h-4 w-4 text-blue-500" />
    if (medium === 'gmail') return <Mail className="h-4 w-4 text-purple-500" />
    return null
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto text-zinc-100 bg-black min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="h-6 w-6 text-fuchsia-500" /> Broadcast Logs
          </h2>
          <p className="text-zinc-400 mt-1">Review past broadcast history to prevent spamming customers.</p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#111]">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by product or medium..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-fuchsia-500 text-sm transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs uppercase bg-zinc-900/50 text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Medium</th>
                <th className="px-6 py-4 font-medium">Product / Campaign</th>
                <th className="px-6 py-4 font-medium">Audience Size</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Calendar className="h-4 w-4 text-zinc-500" />
                      {new Date(log.date).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    <div className="flex items-center gap-2 font-medium">
                      {getMediumIcon(log.medium)}
                      <span className={log.medium === 'whatsapp' ? 'text-emerald-400' : log.medium === 'sms' ? 'text-blue-400' : 'text-purple-400'}>
                        {log.medium}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-zinc-200 font-medium">{log.product || 'General Broadcast'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Users className="h-4 w-4 text-zinc-500" />
                      {log.audienceSize} Customers
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {log.status}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <History className="h-8 w-8 mb-3 opacity-20" />
                      <p>No broadcast history found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
