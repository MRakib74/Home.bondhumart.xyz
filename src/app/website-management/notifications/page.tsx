"use client"

import { useState, useEffect } from "react"
import { BellRing, Save, Loader2, CheckCircle2 } from "lucide-react"

interface Template {
  id: string
  type: string
  isActive: boolean
  message: string
  channel: string
}

export default function NotificationsPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/notifications/templates')
      const data = await res.json()
      if (Array.isArray(data)) setTemplates(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (id: string, updates: Partial<Template>) => {
    // Optimistic update
    setTemplates(templates.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const handleSave = async (template: Template) => {
    setSavingId(template.id)
    try {
      const res = await fetch('/api/notifications/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      })
      if (!res.ok) throw new Error('Failed to save')
      
      // Show short success indicator (optional UX enhancement)
      setTimeout(() => setSavingId(null), 1000)
    } catch (e) {
      alert('Failed to save changes')
      setSavingId(null)
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto text-zinc-100 bg-[#0a0a0a] min-h-screen">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <BellRing className="h-6 w-6 text-emerald-500" /> Notification & SMS Templates
        </h2>
        <p className="text-zinc-400 mt-1">Configure automated WhatsApp/SMS messages sent to customers on order status changes.</p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : templates.map((template) => (
          <div key={template.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-zinc-900/50 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="font-semibold text-white">{template.type} মেসেজ</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500">
                  Variables: <code className="text-emerald-400 bg-emerald-400/10 px-1 rounded">{`{name}`}</code>, <code className="text-emerald-400 bg-emerald-400/10 px-1 rounded">{`{order_id}`}</code>, <code className="text-emerald-400 bg-emerald-400/10 px-1 rounded">{`{amount}`}</code>, <code className="text-emerald-400 bg-emerald-400/10 px-1 rounded">{`{invoice_url}`}</code>
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={template.isActive}
                    onChange={(e) => handleUpdate(template.id, { isActive: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  <span className="ml-3 text-sm font-medium text-zinc-300">চালু রাখুন</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">মেসেজ টেমপ্লেট</label>
                <textarea 
                  value={template.message}
                  onChange={(e) => handleUpdate(template.id, { message: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 min-h-[120px]"
                />
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => handleSave(template)}
                  disabled={savingId === template.id}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {savingId === template.id ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="h-4 w-4" /> Update Template</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
