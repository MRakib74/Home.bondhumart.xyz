"use client"

import { useState, useEffect, useRef } from "react"
import {
  BarChart3, TrendingUp, DollarSign, MousePointerClick, Eye,
  ShoppingCart, Sparkles, AlertTriangle, RefreshCw, X,
  Calendar, GripVertical, Tag, CreditCard, Target
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#3b82f6', '#ec4899']
const GENDER_COLORS = ['#3b82f6', '#ec4899']

// ---------- Dummy fallback data ----------
const DUMMY: any = {
  overview: {
    totalSpend: 1250.50,
    totalImpressions: 125000,
    totalReach: 98400,
    totalLinkClicks: 3200,
    totalPageViews: 4100,
    totalAddToCart: 890,
    totalInitiateCheckout: 340,
    totalPurchases: 45,
    totalPurchaseValue: 4001.60,
    overallRoas: 3.2,
    overallCpm: 10.0,
    overallCpp: 27.79
  },
  campaigns: [
    { id: 1, name: "Sleeping Spray – Broad Audience", spend: 500, purchases: 20, roas: 4.1, cpc: 0.15, ctr: 2.5, cpm: 8.0, pageViews: 1500, addToCart: 380, initiateCheckout: 160, purchaseValue: 2050 },
    { id: 2, name: "Retargeting – Last 30 Days",       spend: 200, purchases: 15, roas: 5.5, cpc: 0.10, ctr: 4.2, cpm: 6.5, pageViews: 800,  addToCart: 310, initiateCheckout: 120, purchaseValue: 1100 },
    { id: 3, name: "Lookalike 1% – Purchasers",        spend: 550.5, purchases: 10, roas: 1.8, cpc: 0.25, ctr: 1.5, cpm: 13.0, pageViews: 1800, addToCart: 200, initiateCheckout: 60, purchaseValue: 851.6 }
  ],
  demographics: {
    gender: [{ name: "Male", value: 800 }, { name: "Female", value: 450 }],
    age: [
      { age: "18-24", spend: 150 },
      { age: "25-34", spend: 480 },
      { age: "35-44", spend: 310 },
      { age: "45-54", spend: 180 },
      { age: "55-60", spend: 80  }
    ]
  }
}

// ---------- KPI Card ----------
function KpiCard({ icon: Icon, label, value, color = "text-white", bgIcon }: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden flex flex-col gap-1">
      <div className="absolute top-0 right-0 p-3 opacity-5">
        <Icon className="h-16 w-16" />
      </div>
      <span className="text-zinc-400 text-xs font-medium uppercase tracking-wide">{label}</span>
      <span className={`text-2xl font-black ${color}`}>{value}</span>
    </div>
  )
}

// ---------- Calendar Picker ----------
function CalendarPicker({ onApply }: { onApply: (since: string, until: string, label: string) => void }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"preset" | "custom">("preset")
  const [label, setLabel] = useState("Last 7 Days")
  const [since, setSince] = useState("")
  const [until, setUntil] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  const presets = [
    { label: "Today",       since: "today",   until: "today"      },
    { label: "Yesterday",   since: "yesterday", until: "yesterday" },
    { label: "Last 7 Days", since: "last_7d",  until: ""           },
    { label: "Last 30 Days",since: "last_30d", until: ""           },
    { label: "This Month",  since: "this_month", until: ""         },
    { label: "Last Month",  since: "last_month", until: ""         },
  ]

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const applyPreset = (p: typeof presets[0]) => {
    setLabel(p.label)
    onApply(p.since, p.until, p.label)
    setOpen(false)
  }

  const applyCustom = () => {
    if (!since || !until) return
    const l = `${since} → ${until}`
    setLabel(l)
    onApply(since, until, l)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-white rounded-xl px-4 py-2.5 font-medium transition-colors text-sm"
      >
        <Calendar className="h-4 w-4 text-orange-400" />
        {label}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 w-80 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex gap-2 mb-4 bg-zinc-900 p-1 rounded-lg">
            <button onClick={() => setMode("preset")} className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-all ${mode === "preset" ? "bg-orange-500 text-white" : "text-zinc-400"}`}>Presets</button>
            <button onClick={() => setMode("custom")} className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-all ${mode === "custom" ? "bg-orange-500 text-white" : "text-zinc-400"}`}>Custom Range</button>
          </div>

          {mode === "preset" ? (
            <div className="grid grid-cols-2 gap-2">
              {presets.map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className={`text-sm py-2 px-3 rounded-xl border transition-colors text-left ${label === p.label ? "border-orange-500 bg-orange-500/10 text-orange-400" : "border-zinc-800 text-zinc-300 hover:border-zinc-600"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">From Date</label>
                <input type="date" value={since} onChange={e => setSince(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">To Date</label>
                <input type="date" value={until} onChange={e => setUntil(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500" />
              </div>
              <button onClick={applyCustom}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white rounded-xl py-2 font-bold text-sm transition-colors">
                Apply Custom Range
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------- Main Page ----------
export default function AdsAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [dateConfig, setDateConfig] = useState({ since: "last_7d", until: "" })

  // AI
  const [aiAnalysis, setAiAnalysis] = useState("")
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)

  // Drag & drop
  const [campaigns, setCampaigns] = useState<any[]>([])
  const dragIndex = useRef<number | null>(null)

  const fetchData = async (since: string, until: string) => {
    setIsLoading(true)
    setError("")
    try {
      const configStr = localStorage.getItem('bondhu_chat_config') || '{}'
      const config = JSON.parse(configStr)
      if (!config.fbAdAccountId || !config.fbAdAccessToken) {
        setError("Please configure your Meta Ad Account ID and Access Token in Settings → Facebook Ads.")
        setIsLoading(false)
        return
      }
      const res = await fetch("/api/ads/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fbAdAccountId: config.fbAdAccountId, fbAdAccessToken: config.fbAdAccessToken, datePreset: since })
      })
      const json = await res.json()
      if (json.error) { setError(json.error) }
      else { setData(json); setCampaigns(json.campaigns || []) }
    } catch { setError("Failed to fetch ads data.") }
    setIsLoading(false)
  }

  useEffect(() => { fetchData(dateConfig.since, dateConfig.until) }, [])

  const handleDateApply = (since: string, until: string, label: string) => {
    setDateConfig({ since, until })
    fetchData(since, until)
  }

  const displayData = (data && !error) ? data : DUMMY
  const displayCampaigns = (data && !error) ? campaigns : DUMMY.campaigns

  // Drag & Drop handlers
  const onDragStart = (idx: number) => { dragIndex.current = idx }
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === idx) return
    const updated = [...displayCampaigns]
    const dragged = updated.splice(dragIndex.current, 1)[0]
    updated.splice(idx, 0, dragged)
    dragIndex.current = idx
    setCampaigns(updated)
  }
  const onDragEnd = () => { dragIndex.current = null }

  // AI Guide
  const getAiGuidance = async () => {
    setShowAiModal(true)
    setIsAiThinking(true)
    setAiAnalysis("")
    try {
      const aiConfigStr = localStorage.getItem('bondhu_ai_config') || '{}'
      const apiKey = JSON.parse(aiConfigStr).groqKey || ""
      if (!apiKey) {
        setAiAnalysis("❌ Groq API Key পাওয়া যায়নি। AI Training Center-এ আপনার Groq API Key সেট করুন।")
        setIsAiThinking(false); return
      }
      const prompt = `
You are an expert Facebook Ads Marketer and analyst. Analyze the following data and provide a concise, actionable guide in Bengali.
Tell the user which campaigns are doing well, which are wasting money, what ROAS is acceptable, and what their next 3 steps should be.

### OVERVIEW
Total Spend: $${displayData.overview.totalSpend.toFixed(2)}
Purchases: ${displayData.overview.totalPurchases}
ROAS: ${displayData.overview.overallRoas.toFixed(2)}x
CPM: $${displayData.overview.overallCpm.toFixed(2)}
Page Views: ${displayData.overview.totalPageViews}
Add to Cart: ${displayData.overview.totalAddToCart}
Initiate Checkout: ${displayData.overview.totalInitiateCheckout}

### CAMPAIGNS:
${displayCampaigns.map((c: any) => `- ${c.name}: Spend=$${c.spend}, Purchases=${c.purchases}, ROAS=${c.roas.toFixed(2)}x, CTR=${c.ctr}%, CPC=$${c.cpc}, CPM=$${c.cpm}`).join('\n')}

Be encouraging but honest. Use bullet points. Keep it professional.
      `
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3-70b-8192", messages: [{ role: "user", content: prompt }], temperature: 0.7 })
      })
      if (res.ok) {
        const result = await res.json()
        setAiAnalysis(result.choices[0].message.content)
      } else {
        const err = await res.json()
        setAiAnalysis(`❌ API Error: ${err.error?.message || "Failed"}`)
      }
    } catch { setAiAnalysis("❌ AI কানেক্ট করতে ব্যর্থ। ইন্টারনেট বা API Key চেক করুন।") }
    setIsAiThinking(false)
  }

  return (
    <div className="p-6 space-y-6 pb-20 min-h-screen bg-black">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-orange-500" /> Ads Analytics
          </h2>
          <p className="text-zinc-400 mt-1 text-sm">Track, analyze, and optimize your Meta Ads performance.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <CalendarPicker onApply={handleDateApply} />
          <button onClick={() => fetchData(dateConfig.since, dateConfig.until)}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-white transition-colors">
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin text-orange-500' : ''}`} />
          </button>
          <button onClick={getAiGuidance}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm">
            <Sparkles className="h-4 w-4" /> AI Marketing Guide
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-400 font-bold text-sm">Connection Error</h4>
            <p className="text-red-400/80 text-sm mt-0.5">{error}</p>
            <p className="text-zinc-500 text-xs mt-1 italic">Showing demo preview data below.</p>
          </div>
        </div>
      )}

      {/* ── Row 1: Main KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={DollarSign}       label="Amount Spent"    value={`$${displayData.overview.totalSpend.toFixed(2)}`} />
        <KpiCard icon={TrendingUp}       label="Overall ROAS"    value={`${displayData.overview.overallRoas.toFixed(2)}x`}
          color={displayData.overview.overallRoas >= 3 ? "text-emerald-400" : displayData.overview.overallRoas >= 2 ? "text-orange-400" : "text-red-400"} />
        <KpiCard icon={MousePointerClick} label="Link Clicks"    value={displayData.overview.totalLinkClicks.toLocaleString()} />
        <KpiCard icon={Eye}              label="Impressions"     value={displayData.overview.totalImpressions.toLocaleString()} />
      </div>

      {/* ── Row 2: Conversion KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={Eye}         label="Page Views"          value={displayData.overview.totalPageViews.toLocaleString()}      color="text-sky-400" />
        <KpiCard icon={ShoppingCart} label="Add to Cart"        value={displayData.overview.totalAddToCart.toLocaleString()}      color="text-purple-400" />
        <KpiCard icon={CreditCard}  label="Initiate Checkout"   value={displayData.overview.totalInitiateCheckout.toLocaleString()} color="text-amber-400" />
        <KpiCard icon={Target}      label="CPM"                 value={`$${displayData.overview.overallCpm.toFixed(2)}`}          color="text-pink-400" />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Age Chart (wider) */}
        <div className="lg:col-span-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Spend by Age Group (18–60)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData.demographics.age} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="age" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <RechartsTooltip
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#f97316' }}
                  formatter={(v: any) => [`$${v}`, 'Spend']}
                />
                <Bar dataKey="spend" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Chart */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Spend by Gender</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={displayData.demographics.gender} cx="50%" cy="45%"
                  innerRadius={55} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {displayData.demographics.gender.map((_: any, i: number) => (
                    <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                  formatter={(v: any, n: any) => [`$${Number(v).toFixed(2)}`, n]} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#a1a1aa', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Campaign Performance (drag & drop) ── */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Campaign Performance</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Drag rows to reorder.</p>
          </div>
          <GripVertical className="h-5 w-5 text-zinc-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900/60 text-zinc-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-4 w-8"></th>
                <th className="px-4 py-4 font-semibold">Campaign Name</th>
                <th className="px-4 py-4 font-semibold">Spend</th>
                <th className="px-4 py-4 font-semibold">Page Views</th>
                <th className="px-4 py-4 font-semibold">Add to Cart</th>
                <th className="px-4 py-4 font-semibold">Initiate Chk.</th>
                <th className="px-4 py-4 font-semibold">Purchases</th>
                <th className="px-4 py-4 font-semibold">ROAS</th>
                <th className="px-4 py-4 font-semibold">CTR</th>
                <th className="px-4 py-4 font-semibold">CPC</th>
                <th className="px-4 py-4 font-semibold">CPM</th>
                <th className="px-4 py-4 font-semibold">Cost/Pur.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {displayCampaigns.map((camp: any, idx: number) => (
                <tr
                  key={camp.id ?? idx}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={(e) => onDragOver(e, idx)}
                  onDragEnd={onDragEnd}
                  className="hover:bg-zinc-900/40 transition-colors cursor-grab active:cursor-grabbing active:bg-zinc-900/80 group"
                >
                  <td className="px-3 py-4">
                    <GripVertical className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                  </td>
                  <td className="px-4 py-4 font-semibold text-white max-w-[220px] truncate">{camp.name}</td>
                  <td className="px-4 py-4 text-zinc-300">${camp.spend.toFixed(2)}</td>
                  <td className="px-4 py-4 text-sky-400">{camp.pageViews?.toLocaleString() ?? "—"}</td>
                  <td className="px-4 py-4 text-purple-400">{camp.addToCart?.toLocaleString() ?? "—"}</td>
                  <td className="px-4 py-4 text-amber-400">{camp.initiateCheckout?.toLocaleString() ?? "—"}</td>
                  <td className="px-4 py-4 text-zinc-300">{camp.purchases}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${camp.roas >= 3 ? 'bg-emerald-500/15 text-emerald-400' : camp.roas >= 2 ? 'bg-orange-500/15 text-orange-400' : 'bg-red-500/15 text-red-400'}`}>
                      {camp.roas.toFixed(2)}x
                    </span>
                  </td>
                  <td className="px-4 py-4 text-zinc-300">{camp.ctr.toFixed(2)}%</td>
                  <td className="px-4 py-4 text-zinc-300">${camp.cpc.toFixed(2)}</td>
                  <td className="px-4 py-4 text-pink-400">${camp.cpm.toFixed(2)}</td>
                  <td className="px-4 py-4 text-zinc-300">${camp.purchases > 0 ? (camp.spend / camp.purchases).toFixed(2) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── AI Modal ── */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-blue-900/30 to-transparent">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-400" /> AI Marketing Guide
              </h3>
              <button onClick={() => setShowAiModal(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {isAiThinking ? (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                  <div className="relative">
                    <div className="animate-ping absolute inset-0 bg-blue-500 rounded-full opacity-20"></div>
                    <Sparkles className="h-12 w-12 text-blue-500 relative z-10 animate-pulse" />
                  </div>
                  <p className="text-zinc-400 font-medium animate-pulse">Analyzing your campaigns...</p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-[15px] text-zinc-200 leading-relaxed">{aiAnalysis}</div>
              )}
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3">
              <button onClick={getAiGuidance} disabled={isAiThinking}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Regenerate
              </button>
              <button onClick={() => setShowAiModal(false)}
                className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
