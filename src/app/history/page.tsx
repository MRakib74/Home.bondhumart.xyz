"use client"

import { useState, useEffect } from "react"
import { Search, ShieldAlert, History as HistoryIcon, PackageCheck, AlertCircle, Phone, Truck, CheckCircle2, XCircle } from "lucide-react"

export default function HistoryCheckPage() {
  const [phone, setPhone] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Local Stats
  const [localStats, setLocalStats] = useState({ total: 0, delivered: 0, returned: 0, new: 0 })
  const [localOrders, setLocalOrders] = useState<any[]>([])
  
  // Courier Stats (Mocking/Fallback if API isn't publicly available)
  const [courierStats, setCourierStats] = useState<any>(null)
  const [courierError, setCourierError] = useState('')

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!phone || phone.length < 11) return alert('সঠিক ফোন নাম্বার দিন (অন্তত ১১ ডিজিট)')
    
    setIsSearching(true)
    setHasSearched(true)
    setCourierError('')
    setCourierStats(null)

    // 1. Check Local DB (bondhu_orders)
    try {
      const data = localStorage.getItem('bondhu_orders')
      if (data) {
        const parsed = JSON.parse(data)
        const matched = parsed.filter((o: any) => o.phone.includes(phone) || phone.includes(o.phone))
        setLocalOrders(matched)
        
        let delivered = 0, returned = 0, nw = 0
        matched.forEach((o: any) => {
          if (o.status === 'delivered') delivered++
          else if (o.status === 'returned') returned++
          else nw++
        })
        
        setLocalStats({ total: matched.length, delivered, returned, new: nw })
      }
    } catch(err) {
      console.error(err)
    }

    // 2. Check Courier Network History (Steadfast / Pathao API)
    try {
      // Clean phone number (e.g. remove +88)
      const cleanPhone = phone.replace('+88', '').replace(/[^0-9]/g, '')
      
      const res = await fetch(`/api/courier/check-history?phone=${cleanPhone}`)
      const data = await res.json()
      
      if (data.success) {
        setCourierStats(data.data)
      } else {
        // We will show a graceful message if the courier doesn't support public fraud check
        setCourierError(data.error || 'Courier network history unavailable for this number.')
      }
    } catch (err) {
      setCourierError('Failed to connect to courier API.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto text-zinc-100 bg-black min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-emerald-500" /> Fraud Check & History
          </h2>
          <p className="text-zinc-400 mt-1">Check customer order history from your local store and courier network.</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:w-2/3">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Enter customer phone number (e.g. 017XXXXXXXX)" 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <button 
          type="submit" 
          disabled={isSearching}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          {isSearching ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="h-5 w-5" />}
          {isSearching ? 'Checking...' : 'Check History'}
        </button>
      </form>

      {hasSearched && !isSearching && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Local History Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-zinc-900/50 p-5 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-blue-500" /> Your Store History
              </h3>
              <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">Local Data</span>
            </div>
            
            <div className="p-6 flex-1">
              {localStats.total === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-zinc-600" />
                  </div>
                  <h4 className="text-zinc-300 font-medium text-lg">No Local History Found</h4>
                  <p className="text-zinc-500 text-sm mt-1">This customer hasn't ordered from your store before.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800/50">
                      <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">Total Orders</p>
                      <p className="text-2xl font-bold text-white">{localStats.total}</p>
                    </div>
                    <div className="bg-zinc-900 rounded-xl p-4 border border-emerald-500/20">
                      <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">Delivered</p>
                      <p className="text-2xl font-bold text-emerald-500">{localStats.delivered}</p>
                    </div>
                    <div className="bg-zinc-900 rounded-xl p-4 border border-red-500/20">
                      <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">Returned</p>
                      <p className="text-2xl font-bold text-red-500">{localStats.returned}</p>
                    </div>
                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800/50">
                      <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">Success Rate</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {localStats.total > 0 ? Math.round((localStats.delivered / localStats.total) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Warning Logic based on Local DB */}
                  {localStats.returned > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-400">Warning: Previous Returns</p>
                        <p className="text-xs text-red-400/80 mt-1">এই কাস্টমার আগে আপনার স্টোর থেকে প্রোডাক্ট রিটার্ন করেছে। সাবধানতার সাথে অর্ডার কনফার্ম করুন।</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Courier Network Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-zinc-900/50 p-5 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-500" /> Courier Fraud Check
              </h3>
              <span className="bg-purple-500/10 text-purple-400 text-xs px-3 py-1 rounded-full font-medium">Network Data</span>
            </div>
            
            <div className="p-6 flex-1">
              {courierError ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                    <ShieldAlert className="h-8 w-8 text-zinc-600" />
                  </div>
                  <h4 className="text-zinc-300 font-medium text-lg">History Unavailable</h4>
                  <p className="text-zinc-500 text-sm mt-2 max-w-sm">{courierError}</p>
                </div>
              ) : courierStats ? (
                <div className="space-y-6">
                  {/* If courier returns fraud check data */}
                  <div className="flex items-center justify-center p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                    <div className="text-center">
                      <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-2">Network Success Rate</p>
                      <p className={`text-5xl font-black ${courierStats.success_rate >= 80 ? 'text-emerald-500' : courierStats.success_rate >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {courierStats.success_rate}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                      <span className="text-zinc-400 text-sm flex items-center gap-2"><PackageCheck className="h-4 w-4" /> Total Parcels</span>
                      <span className="font-bold text-white">{courierStats.total_parcel}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-emerald-500/20">
                      <span className="text-zinc-400 text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Delivered</span>
                      <span className="font-bold text-emerald-500">{courierStats.success_parcel}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-red-500/20">
                      <span className="text-zinc-400 text-sm flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" /> Cancelled</span>
                      <span className="font-bold text-red-500">{courierStats.cancelled_parcel}</span>
                    </div>
                  </div>
                  
                  {courierStats.success_rate < 50 && courierStats.total_parcel > 2 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-400">High Risk Customer</p>
                        <p className="text-xs text-red-400/80 mt-1">কুরিয়ার নেটওয়ার্কে এই কাস্টমারের ডেলিভারি রেট খুবই খারাপ। প্রোডাক্ট পাঠানোর আগে অবশ্যই অগ্রিম (Advance) কনফার্মেশন নিন।</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
