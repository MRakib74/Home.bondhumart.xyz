"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShoppingCart, Search, Download, Trash2, CheckCircle, Truck, RefreshCw, Loader2, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Order {
  id: string
  bondhumartId: string | null
  customer: { name: string, phone: string }
  product: { name: string }
  status: string
  amount: number
  createdAt: string
}

const TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'on-hold', label: 'On Hold' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'returning', label: 'Returning' },
  { id: 'return-received', label: 'Return Received' },
]

export default function OrderManagePage() {
  const params = useParams()
  const router = useRouter()
  const currentTab = typeof params.status === 'string' ? params.status : 'all'

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [currentTab])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/website-management/orders?status=${currentTab}`)
      const data = await res.json()
      if (Array.isArray(data)) setOrders(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(orders.map(o => o.id))
    else setSelectedIds([])
  }

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleStatusChange = async (newStatus: string) => {
    if (selectedIds.length === 0) return alert('Select orders first!')
    if (!confirm(`Change status to ${newStatus} and send notifications?`)) return

    setIsProcessing(true)
    try {
      const res = await fetch('/api/website-management/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedIds, status: newStatus, action: 'status_change' })
      })
      if (res.ok) {
        setSelectedIds([])
        fetchOrders() // refresh
      } else {
        alert('Failed to update status')
      }
    } catch (e) {
      alert('Network error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (selectedIds.length === 0) return alert('Select orders first!')
    if (!confirm('Are you sure you want to delete selected orders?')) return

    setIsProcessing(true)
    try {
      const res = await fetch('/api/website-management/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds: selectedIds })
      })
      if (res.ok) {
        setSelectedIds([])
        fetchOrders()
      }
    } catch (e) {
      alert('Network error')
    } finally {
      setIsProcessing(false)
    }
  }

  const filtered = orders.filter(o => 
    o.customer?.phone?.includes(search) || 
    o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.bondhumartId?.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10'
      case 'confirmed': return 'text-blue-400 border-blue-400/20 bg-blue-400/10'
      case 'shipped': return 'text-orange-400 border-orange-400/20 bg-orange-400/10'
      case 'delivered': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10'
      case 'cancelled': return 'text-red-500 border-red-500/20 bg-red-500/10'
      case 'on hold': return 'text-purple-400 border-purple-400/20 bg-purple-400/10'
      default: return 'text-zinc-400 border-zinc-700 bg-zinc-800/50'
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto text-zinc-100 bg-[#0a0a0a] min-h-screen">
      
      {/* Top Tabs Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 flex overflow-x-auto hide-scrollbar snap-x">
        {TABS.map(tab => {
          const isActive = currentTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => router.push(`/website-management/orders/${tab.id}`)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all snap-start",
                isActive 
                  ? "bg-zinc-800 text-white shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        
        {/* Action Bar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <button 
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Selected
            </button>
            <button 
              className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Download CSV
            </button>
            <button 
              onClick={() => handleStatusChange('Confirmed')}
              disabled={isProcessing}
              className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Bulk Confirm & Notify
            </button>
            <button 
              onClick={() => handleStatusChange('Shipped')}
              disabled={isProcessing}
              className="bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Truck className="h-3.5 w-3.5" /> Bulk Dispatch (Steadfast)
            </button>
            <select
              onChange={(e) => {
                if (e.target.value) handleStatusChange(e.target.value)
                e.target.value = "" // reset select after action
              }}
              className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-medium outline-none focus:border-zinc-500"
            >
              <option value="">Status পরিবর্তন...</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="On Hold">On Hold</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returning">Returning</option>
            </select>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search..." 
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-zinc-600" 
            />
          </div>
        </div>

        {/* Selection Info */}
        <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
          <span>{selectedIds.length} record selected</span>
          <div className="space-x-3">
            <button onClick={() => setSelectedIds(orders.map(o => o.id))} className="text-orange-400 hover:text-orange-300">Select all {orders.length}</button>
            <button onClick={() => setSelectedIds([])} className="text-red-400 hover:text-red-300">Deselect all</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[500px]">
          <table className="w-full text-left text-sm text-zinc-400 border-collapse">
            <thead className="bg-zinc-900/50 border-b border-zinc-800 text-xs uppercase font-medium text-zinc-500">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input 
                    type="checkbox" 
                    checked={orders.length > 0 && selectedIds.length === orders.length}
                    onChange={handleSelectAll}
                    className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20"
                  />
                </th>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isLoading || isProcessing ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-600 mx-auto" />
                  </td>
                </tr>
              ) : filtered.length > 0 ? filtered.map(order => (
                <tr 
                  key={order.id} 
                  className={cn(
                    "hover:bg-zinc-900/30 transition-colors",
                    selectedIds.includes(order.id) ? "bg-zinc-900/50 border-l-2 border-l-orange-500" : ""
                  )}
                >
                  <td className="px-4 py-4 align-top">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(order.id)}
                      onChange={() => handleSelectOne(order.id)}
                      className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20"
                    />
                  </td>
                  <td className="px-4 py-4 align-top space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium cursor-pointer hover:underline">
                      <Send className="h-3 w-3" /> WhatsApp
                    </div>
                    <div className="text-blue-400 text-xs flex items-center gap-1.5 cursor-pointer hover:underline">
                      <Download className="h-3 w-3" /> Invoice
                    </div>
                    <div className="text-zinc-300 font-semibold mt-2">
                      #{order.bondhumartId || order.id.slice(-6).toUpperCase()}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="text-zinc-200 font-medium">{order.customer?.name || 'Unknown'}</div>
                    <div className="text-zinc-500 text-xs font-mono mt-1">{order.customer?.phone}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <ul className="list-disc list-inside text-zinc-300 text-xs space-y-1">
                      <li>{order.product?.name || 'Product'} <span className="text-zinc-500">(x1)</span></li>
                    </ul>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full border text-[11px] font-medium tracking-wide uppercase",
                      getStatusColor(order.status)
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top text-emerald-400 font-medium">
                    BDT {order.amount.toFixed(2)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                    No orders found in this tab.
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
