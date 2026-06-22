"use client"

import { useState, useEffect } from "react"
import { ShieldAlert, Plus, Trash2, Search, Loader2 } from "lucide-react"

interface BlockedCustomer {
  id: string
  name: string
  phone: string
  reason: string
  createdAt: string
}

export default function BlockedCustomersPage() {
  const [blockedList, setBlockedList] = useState<BlockedCustomer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // Form State
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    fetchBlocked()
  }, [])

  const fetchBlocked = async () => {
    try {
      const res = await fetch('/api/blocked')
      const data = await res.json()
      if (Array.isArray(data)) setBlockedList(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return alert('Phone number is required!')
    
    setIsAdding(true)
    try {
      const res = await fetch('/api/blocked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, reason })
      })
      
      const data = await res.json()
      if (res.ok) {
        setBlockedList([data, ...blockedList])
        setName(''); setPhone(''); setReason('')
      } else {
        alert(data.error || 'Failed to block customer')
      }
    } catch (e) {
      alert('Internal error')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to unblock this customer?')) return
    
    try {
      const res = await fetch(`/api/blocked?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setBlockedList(blockedList.filter(b => b.id !== id))
      }
    } catch (e) {
      alert('Failed to unblock')
    }
  }

  const filtered = blockedList.filter(b => 
    b.phone.includes(search) || 
    (b.name && b.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto text-zinc-100 bg-[#0a0a0a] min-h-screen">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-red-500" /> Blocked Fraud Customers
        </h2>
        <p className="text-zinc-400 mt-1">Add fraudulent numbers to block them from placing orders on your website.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">Block New Customer</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Customer Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                placeholder="e.g. Fraud Hasan"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Phone Number *</label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                placeholder="01xxxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Reason for blocking</label>
              <textarea 
                value={reason} 
                onChange={e => setReason(e.target.value)} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 min-h-[80px]"
                placeholder="e.g. Returned 5 orders consecutively"
              />
            </div>
            <button 
              type="submit" 
              disabled={isAdding}
              className="w-full bg-red-600 hover:bg-red-500 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Block Customer
            </button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search blocked numbers..." 
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-zinc-600 shadow-xl" 
            />
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-900/50 border-b border-zinc-800 text-xs uppercase font-medium text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center">
                        <Loader2 className="h-6 w-6 animate-spin text-zinc-600 mx-auto" />
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? filtered.map(b => (
                    <tr key={b.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-200">{b.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-red-400 font-mono text-xs">{b.phone}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500 max-w-[200px] truncate">{b.reason || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => handleDelete(b.id)}
                          className="text-zinc-500 hover:text-emerald-400 transition-colors p-1"
                          title="Unblock"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                        No blocked customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
