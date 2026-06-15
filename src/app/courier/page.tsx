"use client"

import { useState, useEffect } from "react"
import { Truck, Save, CheckCircle2, AlertTriangle, Settings, Shield } from "lucide-react"

interface CourierConfig {
  id: string
  name: string
  apiKey: string
  secretKey: string
  isActive: boolean
  baseUrl: string
}

export default function CourierPage() {
  const [couriers, setCouriers] = useState<CourierConfig[]>([
    { id: 'steadfast', name: 'Steadfast Courier', apiKey: '', secretKey: '', isActive: false, baseUrl: 'https://portal.steadfast.com.bd/api/v1' },
    { id: 'pathao', name: 'Pathao Courier', apiKey: '', secretKey: '', isActive: false, baseUrl: 'https://api-hermes.pathao.com' },
    { id: 'redx', name: 'RedX Courier', apiKey: '', secretKey: '', isActive: false, baseUrl: 'https://openapi.redx.com.bd/v1.0.0-beta' },
    { id: 'paperfly', name: 'Paperfly', apiKey: '', secretKey: '', isActive: false, baseUrl: 'https://go-app.paperfly.com.bd/merchant/api' },
    { id: 'sundarban', name: 'Sundarban Courier', apiKey: '', secretKey: '', isActive: false, baseUrl: '' },
    { id: 'sa-poribahan', name: 'SA Paribahan', apiKey: '', secretKey: '', isActive: false, baseUrl: '' },
    { id: 'janani', name: 'Janani Express', apiKey: '', secretKey: '', isActive: false, baseUrl: '' },
    { id: 'delhivery', name: 'Delhivery', apiKey: '', secretKey: '', isActive: false, baseUrl: '' },
  ])
  const [defaultCourier, setDefaultCourier] = useState('steadfast')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const data = localStorage.getItem('bondhu_courier_config')
      if (data) {
        const parsed = JSON.parse(data)
        setCouriers(parsed.couriers || couriers)
        setDefaultCourier(parsed.defaultCourier || 'steadfast')
      }
    } catch (e) { console.error(e) }
  }, [])

  const updateCourier = (id: string, field: string, value: string | boolean) => {
    setCouriers(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const handleSave = () => {
    localStorage.setItem('bondhu_courier_config', JSON.stringify({ couriers, defaultCourier }))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const activeCount = couriers.filter(c => c.isActive).length

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto text-zinc-100 bg-black min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Truck className="h-6 w-6 text-emerald-500" /> Courier Auto-Entry
          </h2>
          <p className="text-zinc-400 mt-1">Setup Bangladesh courier APIs. Confirmed orders auto-ship from Orders page.</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
          {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg"><Truck className="h-5 w-5 text-emerald-500" /></div>
          <div><p className="text-2xl font-bold text-white">{activeCount}</p><p className="text-xs text-zinc-500">Active Couriers</p></div>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg"><Shield className="h-5 w-5 text-blue-500" /></div>
          <div><p className="text-sm font-bold text-white capitalize">{defaultCourier}</p><p className="text-xs text-zinc-500">Default Courier</p></div>
        </div>
      </div>

      {/* Default Courier */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><Settings className="h-5 w-5 text-zinc-400" /> Default Courier</h3>
        <p className="text-xs text-zinc-400 mb-3">Orders পেজ থেকে কুরিয়ারে পাঠানোর সময় এই কুরিয়ারটি ডিফল্ট হিসেবে সিলেক্ট থাকবে।</p>
        <select value={defaultCourier} onChange={e => setDefaultCourier(e.target.value)} className="w-full md:w-72 bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer">
          {couriers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Courier Cards */}
      <div className="space-y-4">
        {couriers.map(c => (
          <div key={c.id} className={`bg-zinc-950 border rounded-2xl p-6 transition-all ${c.isActive ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-zinc-800'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Truck className={`h-5 w-5 ${c.isActive ? 'text-emerald-500' : 'text-zinc-600'}`} />
                <h4 className="text-white font-bold">{c.name}</h4>
                {c.isActive && <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={c.isActive} onChange={e => updateCourier(c.id, 'isActive', e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            {c.isActive && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-800">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">API Key</label>
                  <input type="password" value={c.apiKey} onChange={e => updateCourier(c.id, 'apiKey', e.target.value)} placeholder="Enter API Key..." className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Secret Key</label>
                  <input type="password" value={c.secretKey} onChange={e => updateCourier(c.id, 'secretKey', e.target.value)} placeholder="Enter Secret Key..." className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                {c.baseUrl && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Base URL</label>
                    <input type="text" value={c.baseUrl} onChange={e => updateCourier(c.id, 'baseUrl', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-300 font-medium">Important</p>
          <p className="text-xs text-zinc-400 mt-1">API Key সঠিকভাবে বসানোর পরই কুরিয়ারে অটো এন্ট্রি কাজ করবে। ভুল Key দিলে অর্ডার কুরিয়ারে যাবে না।</p>
        </div>
      </div>
    </div>
  )
}
