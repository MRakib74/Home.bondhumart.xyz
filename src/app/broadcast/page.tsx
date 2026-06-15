"use client"

import { useState, useEffect } from "react"
import { Send, Users, Mail, MessageSquare, Phone, Image as ImageIcon, Link as LinkIcon, Video, Settings, Play, CheckCircle2, AlertTriangle, Sparkles, Filter, ChevronDown, X } from "lucide-react"

export default function BroadcastPage() {
  const [audience, setAudience] = useState<any[]>([])
  const [whatsappCount, setWhatsappCount] = useState(0)
  const [emailCount, setEmailCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'sms' | 'gmail'>('whatsapp')

  // Full Database from CRM
  const [allCustomers, setAllCustomers] = useState<any[]>([])
  
  // Filter Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [fDate, setFDate] = useState('All')
  const [fStatus, setFStatus] = useState('All')
  const [fLocation, setFLocation] = useState('Everywhere')
  const [fProduct, setFProduct] = useState('')
  const [fMinPrice, setFMinPrice] = useState('')
  const [fMaxPrice, setFMaxPrice] = useState('')
  const [fLoyal, setFLoyal] = useState(false)

  // Recalculate stats helper
  const updateAudienceStats = (filtered: any[]) => {
    setAudience(filtered)
    let wa = 0
    let em = 0
    filtered.forEach((c: any) => {
      if (c.phone && c.phone.length >= 10 && c.phone !== "No Phone") wa++
      if (c.email && c.email.includes('@')) em++
    })
    setWhatsappCount(wa)
    setEmailCount(em)
    localStorage.setItem('broadcast_audience', JSON.stringify(filtered))
  }

  // Load from local storage
  useEffect(() => {
    try {
      const fullDb = localStorage.getItem('bondhu_customers')
      if (fullDb) setAllCustomers(JSON.parse(fullDb))

      const data = localStorage.getItem('broadcast_audience')
      if (data) {
        const parsed = JSON.parse(data)
        updateAudienceStats(parsed)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const applyFilters = () => {
    let filtered = [...allCustomers]

    // Order Status
    if (fStatus !== 'All') {
      filtered = filtered.filter(c => c.status === fStatus)
    }

    // Location
    if (fLocation === 'Dhaka') {
      filtered = filtered.filter(c => c.district?.toLowerCase().includes('dhaka'))
    } else if (fLocation === 'Outside Dhaka') {
      filtered = filtered.filter(c => c.district && !c.district.toLowerCase().includes('dhaka'))
    }

    // Specific Product
    if (fProduct.trim()) {
      const kw = fProduct.toLowerCase()
      filtered = filtered.filter(c => c.product?.toLowerCase().includes(kw))
    }

    // Price
    if (fMinPrice) {
      filtered = filtered.filter(c => (c.totalSpent || 0) >= Number(fMinPrice))
    }
    if (fMaxPrice) {
      filtered = filtered.filter(c => (c.totalSpent || 0) <= Number(fMaxPrice))
    }

    // Loyal (Multi-order)
    if (fLoyal) {
      filtered = filtered.filter(c => (c.totalOrders || 0) > 1)
    }

    // Note: Date Range omitted for simplicity in mock data, but easily added with Date parsing.
    
    updateAudienceStats(filtered)
    setIsFilterModalOpen(false)
  }

  // State: Message & Media
  const [aiPrompt, setAiPrompt] = useState("")
  const [messageTemplate, setMessageTemplate] = useState("হ্যালো [Name],\n\nআপনার কেনা [Product] এর জন্য বিশেষ অফার! আজই অর্ডার কনফার্ম করলে পাচ্ছেন ২০% ছাড়।\n\nঅফারটি পেতে ভিজিট করুন: [Link]")
  const [mediaLink, setMediaLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)

  // API Config State
  // Evolution
  const [evoUrl, setEvoUrl] = useState("")
  const [evoKey, setEvoKey] = useState("")
  // SMS
  const [smsUrl, setSmsUrl] = useState("")
  const [smsKey, setSmsKey] = useState("")
  // SMTP
  const [smtpHost, setSmtpHost] = useState("smtp.hostinger.com")
  const [smtpPort, setSmtpPort] = useState("465")
  const [smtpEmail, setSmtpEmail] = useState("info@bondhumart.cloud")
  const [smtpPass, setSmtpPass] = useState("")

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setMessageTemplate(`হ্যালো [Name],\n\nআপনার কেনা [Product] প্রোডাক্টটির জন্য আমরা দিচ্ছি বিশেষ ১০% ডিসকাউন্ট! \n\nএই লিংকে ক্লিক করে অর্ডার কনফার্ম করুন: ${mediaLink || '[Link]'}\n\nধন্যবাদ,\nBondhuMart Team`)
      setIsGenerating(false)
    }, 1500)
  }

  const handleSend = () => {
    setIsSending(true)
    setTimeout(() => {
      alert(`✅ ব্রডকাস্ট সফলভাবে শুরু হয়েছে!`)
      setIsSending(false)
    }, 2000)
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto text-zinc-100 bg-black min-h-screen pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Send className="h-6 w-6 text-blue-500" /> AI Broadcast Master
          </h2>
          <p className="text-zinc-400 mt-1">Send bulk personalized AI promotional messages via WhatsApp, SMS, or Email.</p>
        </div>
        <div>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-orange-500/20 transition-all active:scale-95"
          >
            <Filter className="h-4 w-4" /> Customer Data Select
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-[#1a1a1a]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-orange-500" /> Customer Data Select
              </h3>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Date Range <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <select value={fDate} onChange={e=>setFDate(e.target.value)} className="w-full bg-[#1a1a1a] border border-zinc-800 text-white rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer text-sm">
                    <option value="All">Select an option (All Time)</option>
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* Order Status */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Order Status</label>
                <div className="relative">
                  <select value={fStatus} onChange={e=>setFStatus(e.target.value)} className="w-full bg-[#1a1a1a] border border-zinc-800 text-white rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer text-sm">
                    <option value="All">All Statuses</option>
                    <option value="Pending 🟡">Pending 🟡</option>
                    <option value="Confirmed 🔵">Confirmed 🔵</option>
                    <option value="Delivered 🟢">Delivered 🟢</option>
                    <option value="Returned 🟣">Returned 🟣</option>
                    <option value="Cancelled 🔴">Cancelled 🔴</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Customer Location</label>
                <div className="relative">
                  <select value={fLocation} onChange={e=>setFLocation(e.target.value)} className="w-full bg-[#1a1a1a] border border-orange-500 text-white rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer text-sm shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                    <option value="Everywhere">Everywhere</option>
                    <option value="Dhaka">Dhaka Only</option>
                    <option value="Outside Dhaka">Outside Dhaka</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500 pointer-events-none" />
                </div>
              </div>

              {/* Specific Product */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Specific Product (Keyword)</label>
                <input type="text" value={fProduct} onChange={e=>setFProduct(e.target.value)} placeholder="e.g. Shirt, Honey, Sleeping Spray etc." className="w-full bg-[#1a1a1a] border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm" />
              </div>

              {/* Advanced: Price & Loyal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Min Amount (৳)</label>
                  <input type="number" value={fMinPrice} onChange={e=>setFMinPrice(e.target.value)} placeholder="0" className="w-full bg-[#1a1a1a] border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Max Amount (৳)</label>
                  <input type="number" value={fMaxPrice} onChange={e=>setFMaxPrice(e.target.value)} placeholder="Unlimited" className="w-full bg-[#1a1a1a] border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button onClick={() => setFLoyal(!fLoyal)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${fLoyal ? 'bg-orange-500' : 'bg-zinc-700'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${fLoyal ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm font-medium text-zinc-300">Only loyal customers (&gt;1 order)</span>
              </div>
            </div>

            <div className="p-5 border-t border-zinc-800 bg-[#1a1a1a] flex gap-3">
              <button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm">
                Submit
              </button>
              <button onClick={() => setIsFilterModalOpen(false)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-6 py-2.5 rounded-lg font-medium transition-colors text-sm border border-zinc-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Users className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold text-white">{audience.length}</div>
            <div className="text-sm text-zinc-400">Total Filtered Audience</div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><MessageSquare className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold text-white">{whatsappCount}</div>
            <div className="text-sm text-zinc-400">Valid Mobile Numbers</div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Mail className="h-6 w-6" /></div>
          <div>
            <div className="text-2xl font-bold text-white">{emailCount}</div>
            <div className="text-sm text-zinc-400">Valid Email Addresses</div>
          </div>
        </div>
      </div>

      {audience.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">কোনো কাস্টমার সিলেক্ট করা নেই! দয়া করে "Customers & CRM" পেজ থেকে ফিল্টার করে "Send to Broadcast" এ ক্লিক করুন।</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-px overflow-x-auto custom-scrollbar">
        <button onClick={() => setActiveTab('whatsapp')} className={`px-5 py-3 font-medium text-sm border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'whatsapp' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
          <MessageSquare className="h-4 w-4" /> WhatsApp Broadcast
        </button>
        <button onClick={() => setActiveTab('sms')} className={`px-5 py-3 font-medium text-sm border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'sms' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
          <Phone className="h-4 w-4" /> SMS Broadcast
        </button>
        <button onClick={() => setActiveTab('gmail')} className={`px-5 py-3 font-medium text-sm border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'gmail' ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
          <Mail className="h-4 w-4" /> Email (Gmail)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: AI Builder & Media */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-400" /> AI Message Generator
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">AI Prompt (Instruction)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="E.g., Write a 10% discount promo for Sleeping Spray..." 
                    className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={handleGenerate} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium whitespace-nowrap disabled:opacity-50 flex items-center gap-2">
                    {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Sparkles className="h-4 w-4" />}
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2 flex justify-between">
                  <span>Message Master Template (Editable)</span>
                  <span className="text-xs text-zinc-500">Variables: [Name], [Product]</span>
                </label>
                <textarea 
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  rows={8}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 custom-scrollbar leading-relaxed"
                />
                <p className="text-xs text-zinc-500 mt-2">এই টেমপ্লেটটি এডিট করতে পারবেন। ব্রডকাস্ট করার সময় [Name] এর জায়গায় কাস্টমারের আসল নাম অটোমেটিক বসে যাবে।</p>
              </div>

              {/* Media Attachments */}
              {(activeTab === 'whatsapp' || activeTab === 'gmail') && (
                <div className="pt-4 border-t border-zinc-800">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Attach Media (Photo/Video/Link)</label>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors">
                      <ImageIcon className="h-4 w-4 text-pink-400" /> Upload Image
                    </button>
                    <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm transition-colors">
                      <Video className="h-4 w-4 text-emerald-400" /> Upload Video
                    </button>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-2 flex-1 min-w-[200px]">
                      <LinkIcon className="h-4 w-4 text-zinc-500 ml-2 shrink-0" />
                      <input 
                        type="url" 
                        value={mediaLink}
                        onChange={(e) => setMediaLink(e.target.value)}
                        placeholder="https://yourwebsite.com/product" 
                        className="w-full bg-transparent border-none text-white text-sm py-2 focus:outline-none px-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Send */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-zinc-400" /> API Configuration
            </h3>
            
            {activeTab === 'whatsapp' && (
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-2 rounded-lg mb-4">Evolution API Integration</div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Instance URL</label>
                  <input type="text" value={evoUrl} onChange={e=>setEvoUrl(e.target.value)} placeholder="https://api.evolution.com/v1" className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Global API Key</label>
                  <input type="password" value={evoKey} onChange={e=>setEvoKey(e.target.value)} placeholder="• • • • • • • •" className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            )}

            {activeTab === 'sms' && (
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-2 rounded-lg mb-4">Custom SMS Gateway</div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">API Endpoint URL</label>
                  <input type="text" value={smsUrl} onChange={e=>setSmsUrl(e.target.value)} placeholder="https://sms-provider.com/api/send" className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">API Key / Token</label>
                  <input type="password" value={smsKey} onChange={e=>setSmsKey(e.target.value)} placeholder="• • • • • • • •" className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            )}

            {activeTab === 'gmail' && (
              <div className="space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs px-3 py-2 rounded-lg mb-4">Hostinger SMTP</div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">SMTP Host</label>
                  <input type="text" value={smtpHost} onChange={e=>setSmtpHost(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Email Address</label>
                    <input type="email" value={smtpEmail} onChange={e=>setSmtpEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Port</label>
                    <input type="text" value={smtpPort} onChange={e=>setSmtpPort(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">App Password</label>
                    <input type="password" value={smtpPass} onChange={e=>setSmtpPass(e.target.value)} placeholder="• • • • •" className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500" />
                  </div>
                </div>
              </div>
            )}

            <button className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-white text-sm py-2 rounded-lg font-medium transition-colors">
              Test Connection
            </button>
          </div>

          <button 
            onClick={handleSend}
            disabled={isSending || audience.length === 0}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/20 ${
              isSending || audience.length === 0 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white active:scale-95'
            }`}
          >
            {isSending ? (
              <><div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> Sending...</>
            ) : (
              <><Play className="h-5 w-5 fill-current" /> Start {activeTab.toUpperCase()} Broadcast</>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
