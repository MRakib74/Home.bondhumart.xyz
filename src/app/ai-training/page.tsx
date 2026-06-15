"use client"

import { useState } from "react"
import { Bot, Zap, Save, ChevronDown, CheckCircle2, Mic, Target, RefreshCcw, Eye, EyeOff, X } from "lucide-react"

export default function AITrainingCenter() {
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [showOpenAIKey, setShowOpenAIKey] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)

  // State
  const [assistantName, setAssistantName] = useState("Bondhu AI")
  const [tone, setTone] = useState("Persuasive (Sales Focused)")
  const [chatbotEnabled, setChatbotEnabled] = useState(true)
  
  const [companyBg, setCompanyBg] = useState("BondhuMart হলো বাংলাদেশের একটি বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম। আমরা সারাদেশে ক্যাশ অন ডেলিভারিতে প্রোডাক্ট পৌঁছে দিই। আমাদের লক্ষ্য হলো প্রতিটি কাস্টমারকে সেরা পণ্য ও সেরা সেবা দেওয়া।")
  const [policy, setPolicy] = useState("কোনো প্রোডাক্টে সমস্যা থাকলে ৩ দিনের মধ্যে রিটার্ন করা যাবে। ডেলিভারি চার্জ ঢাকার ভেতর ৬০ টাকা, বাইরে ১২০ টাকা।")
  
  const [campaignFocusEnabled, setCampaignFocusEnabled] = useState(true)
  const [targetProducts, setTargetProducts] = useState(["Fresh Sleeping Spray"])
  const [campaignInstructions, setCampaignInstructions] = useState("কাস্টমার যাই বলুক না কেন, তুমি শুধু রিপ্লাই দিবে Fresh Sleeping Spray এই প্রোডাক্ট সম্পর্কে অন্য কোনো প্রোডাক্টের কথা বলবে না।")
  
  const [primaryAI, setPrimaryAI] = useState("Groq (Super Fast)")
  const [fallbackEnabled, setFallbackEnabled] = useState(true)
  
  const [groqKey, setGroqKey] = useState("")
  const [groqModel, setGroqModel] = useState("Llama 3.3 70B (Recommended)")
  const [openAIKey, setOpenAIKey] = useState("")
  const [openAIModel, setOpenAIModel] = useState("GPT-4o Mini")
  const [geminiKey, setGeminiKey] = useState("")
  const [geminiModel, setGeminiModel] = useState("Gemini 2.5 Flash")

  const handleSave = () => {
    // In a real app, save to backend/Prisma here
    alert("✅ AI Training Data & Provider Settings Saved Successfully!")
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto text-zinc-100 bg-black min-h-screen">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Train Your AI Sales Assistant
        </h2>
      </div>

      <div className="space-y-6 pb-20">
        
        {/* Card 1: AI Identity & Tone */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">AI Identity & Tone</h3>
          </div>
          <p className="text-sm text-zinc-500 mb-6">আপনার AI অ্যাসিস্ট্যান্টের নাম এবং ব্যক্তিত্ব নির্ধারণ করুন।</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Assistant Name</label>
              <input 
                type="text" 
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Conversation Tone</label>
              <div className="relative">
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-zinc-900 border border-orange-500/50 text-white rounded-lg pl-10 pr-10 py-2.5 appearance-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors cursor-pointer"
                >
                  <option value="Friendly & Polite">😊 Friendly & Polite</option>
                  <option value="Professional & Direct">💼 Professional & Direct</option>
                  <option value="Persuasive (Sales Focused)">🔥 Persuasive (Sales Focused)</option>
                  <option value="Humorous & Engaging">😂 Humorous & Engaging</option>
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {tone.includes('Persuasive') ? '🔥' : tone.includes('Friendly') ? '😊' : tone.includes('Professional') ? '💼' : '😂'}
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3">
            <button 
              onClick={() => setChatbotEnabled(!chatbotEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${chatbotEnabled ? 'bg-indigo-600' : 'bg-zinc-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${chatbotEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-medium text-zinc-300">Enable AI Chatbot on Website</span>
          </div>
        </div>

        {/* Card 2: Knowledge Base */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex -space-x-1">
              <span className="text-xl">📚</span>
            </div>
            <h3 className="text-lg font-bold text-white">Knowledge Base (Training Data)</h3>
          </div>
          <p className="text-sm text-zinc-500 mb-6">AI-কে আপনার কোম্পানি এবং পলিসি সম্পর্কে শিখিয়ে দিন।</p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Company Background</label>
              <div className="relative">
                <textarea 
                  value={companyBg}
                  onChange={(e) => setCompanyBg(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors custom-scrollbar"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Refund & Shipping Policy</label>
              <div className="relative">
                <textarea 
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors custom-scrollbar"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Ad Campaign & Focus Mode */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-rose-500" />
            <h3 className="text-lg font-bold text-white">Ad Campaign & Focus Mode</h3>
          </div>
          <p className="text-sm text-zinc-500 mb-6">যদি কোনো নির্দিষ্ট পণ্যের এড চলে, তবে AI কে শুধুমাত্র সেই পণ্য বিক্রিতে ফোকাস করতে নির্দেশ দিন।</p>
          
          <div className="mb-6 flex items-center gap-3">
            <button 
              onClick={() => setCampaignFocusEnabled(!campaignFocusEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${campaignFocusEnabled ? 'bg-orange-500' : 'bg-zinc-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${campaignFocusEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-medium text-zinc-300">Enable Campaign Focus Mode</span>
            {campaignFocusEnabled && <span className="text-xs text-orange-400 mt-1 block sm:inline sm:mt-0">(অন করলে AI শুধুমাত্র নিচের সিলেক্ট করা পণ্য বিক্রিতে মনোযোগ দেবে)</span>}
          </div>
          
          <div className={`space-y-5 transition-opacity duration-300 ${campaignFocusEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Select Target Product(s)</label>
              <div className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 flex flex-wrap gap-2 items-center">
                {targetProducts.map(prod => (
                  <div key={prod} className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-md text-sm flex items-center gap-2">
                    {prod}
                    <button onClick={() => setTargetProducts(targetProducts.filter(p => p !== prod))} className="hover:text-white"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                <input type="text" placeholder="Select an option..." className="bg-transparent border-none text-sm text-white focus:outline-none flex-1 min-w-[150px] px-2" />
                <ChevronDown className="h-4 w-4 text-zinc-500 mr-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Special Instructions for this Campaign</label>
              <textarea 
                value={campaignInstructions}
                onChange={(e) => setCampaignInstructions(e.target.value)}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors custom-scrollbar"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Multi-AI Provider */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCcw className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Multi-AI Provider (Load Balancing & Auto Fallback)</h3>
          </div>
          <p className="text-sm text-zinc-500 mb-6">প্রাইমারি AI-এর লিমিট শেষ হলে সিস্টেম অটোমেটিক অন্য AI-তে সুইচ করবে! প্রতি বক্সে কমা (,) দিয়ে একাধিক API Key বসান Load Balancing এর জন্য।</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
              <span className="text-amber-500">🥇</span> Primary AI Provider (১ম পছন্দ) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select 
                value={primaryAI}
                onChange={(e) => setPrimaryAI(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors cursor-pointer"
              >
                <option value="Groq (Super Fast)">Groq (Super Fast)</option>
                <option value="OpenAI (Smartest)">OpenAI (Smartest)</option>
                <option value="Gemini (Balanced)">Gemini (Balanced)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          <div className="mb-6 flex items-center gap-3">
            <button 
              onClick={() => setFallbackEnabled(!fallbackEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${fallbackEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${fallbackEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-emerald-400" /> Enable Multi-Provider Fallback & Load Balancing
            </span>
          </div>
          {fallbackEnabled && <p className="text-xs text-zinc-500 mb-6">চালু থাকলে: Primary AI ব্যর্থ হলে স্বয়ংক্রিয়ভাবে পরের AI-তে যাবে (Multi-Provider)। বন্ধ থাকলে: শুধুমাত্র Primary AI ব্যবহার হবে (Single AI Mode)।</p>}

          <div className="space-y-6">
            {/* Groq Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Groq API Keys (Comma Separated)</label>
                <div className="relative">
                  <input 
                    type={showGroqKey ? "text" : "password"}
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    placeholder="gsk_xxxxxxxxxxxxxx"
                    className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button 
                    onClick={() => setShowGroqKey(!showGroqKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showGroqKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Groq Preferred Model</label>
                <div className="relative">
                  <select 
                    value={groqModel}
                    onChange={(e) => setGroqModel(e.target.value)}
                    className="w-full bg-zinc-900 border border-orange-500/50 text-white rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors cursor-pointer"
                  >
                    <option value="Llama 3.3 70B (Recommended)">Llama 3.3 70B (Recommended)</option>
                    <option value="Llama 3.1 8B (Fast)">Llama 3.1 8B (Fast)</option>
                    <option value="DeepSeek R1 Llama 70B">DeepSeek R1 Llama 70B</option>
                    <option value="Mixtral 8x7B">Mixtral 8x7B</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* OpenAI Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">OpenAI API Keys (Comma Separated)</label>
                <div className="relative">
                  <input 
                    type={showOpenAIKey ? "text" : "password"}
                    value={openAIKey}
                    onChange={(e) => setOpenAIKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <button 
                    onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showOpenAIKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">OpenAI Preferred Model</label>
                <div className="relative">
                  <select 
                    value={openAIModel}
                    onChange={(e) => setOpenAIModel(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors cursor-pointer"
                  >
                    <option value="GPT-4o Mini">GPT-4o Mini</option>
                    <option value="GPT-4o">GPT-4o</option>
                    <option value="GPT-4 Turbo">GPT-4 Turbo</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gemini Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Gemini API Keys (Comma Separated)</label>
                <div className="relative">
                  <input 
                    type={showGeminiKey ? "text" : "password"}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button 
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Gemini Preferred Model</label>
                <div className="relative">
                  <select 
                    value={geminiModel}
                    onChange={(e) => setGeminiModel(e.target.value)}
                    className="w-full bg-zinc-900 border border-blue-500/50 text-white rounded-lg px-4 py-2.5 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
                    <option value="Gemini 2.0 Flash">Gemini 2.0 Flash</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-start">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
          >
            <Zap className="h-5 w-5 fill-current" />
            Start Training AI
          </button>
        </div>

      </div>
    </div>
  )
}
