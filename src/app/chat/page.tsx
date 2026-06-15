"use client"

import { useState } from "react"
import { Search, Send, Bot, User, Check, CheckCheck, Phone, Video, MoreVertical, Paperclip, Smile, Image as ImageIcon, MessageCircle, MessageSquare } from "lucide-react"

// Dummy data for chats
const DUMMY_CHATS = [
  { id: 1, name: "Rakib Raja", platform: "whatsapp", avatar: "R", lastMsg: "Please confirm my order", time: "10:42 AM", unread: 2, isOnline: true },
  { id: 2, name: "Nayeem Islam", platform: "messenger", avatar: "N", lastMsg: "How much for delivery?", time: "09:15 AM", unread: 0, isOnline: false },
  { id: 3, name: "Ashik Rana", platform: "whatsapp", avatar: "A", lastMsg: "I need this urgently.", time: "Yesterday", unread: 0, isOnline: true },
  { id: 4, name: "Tanvir Ahmed", platform: "messenger", avatar: "T", lastMsg: "Thanks!", time: "Yesterday", unread: 0, isOnline: false },
]

// Dummy messages for selected chat
const DUMMY_MESSAGES = [
  { id: 1, text: "Hello! I saw your ad on Facebook.", sender: "user", time: "10:30 AM", platform: "whatsapp" },
  { id: 2, text: "Welcome to BondhuMart! How can I help you today?", sender: "ai", time: "10:30 AM", platform: "whatsapp" },
  { id: 3, text: "I want to order the Fresh Sleeping Spray.", sender: "user", time: "10:35 AM", platform: "whatsapp" },
  { id: 4, text: "Great choice! Could you please provide your delivery address and phone number?", sender: "ai", time: "10:35 AM", platform: "whatsapp" },
  { id: 5, text: "House 12, Road 5, Dhanmondi. Phone: 01700000000", sender: "user", time: "10:40 AM", platform: "whatsapp" },
  { id: 6, text: "Please confirm my order", sender: "user", time: "10:42 AM", platform: "whatsapp" },
]

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1)
  const [message, setMessage] = useState("")
  const [aiEnabled, setAiEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // all, whatsapp, messenger

  const currentChat = DUMMY_CHATS.find(c => c.id === selectedChat)
  
  // Filter chats
  const filteredChats = DUMMY_CHATS.filter(c => {
    if (activeTab === 'all') return true;
    return c.platform === activeTab;
  })

  return (
    <div className="h-[calc(100vh-2rem)] p-4 md:p-6 bg-black flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-500" /> Live AI Chat
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Manage all your WhatsApp and Messenger conversations in one place.</p>
        </div>
      </div>

      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex shadow-2xl">
        
        {/* Left Sidebar - Chat List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-zinc-800 flex flex-col bg-zinc-950 shrink-0">
          
          {/* Search & Tabs */}
          <div className="p-4 border-b border-zinc-800 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search messages or users..." 
                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg">
              <button onClick={() => setActiveTab('all')} className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${activeTab === 'all' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>All</button>
              <button onClick={() => setActiveTab('whatsapp')} className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'whatsapp' ? 'bg-[#25D366]/20 text-[#25D366] shadow' : 'text-zinc-400 hover:text-[#25D366]'}`}>
                <MessageCircle className="h-3.5 w-3.5" /> WA
              </button>
              <button onClick={() => setActiveTab('messenger')} className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all flex items-center justify-center gap-1 ${activeTab === 'messenger' ? 'bg-[#0084FF]/20 text-[#0084FF] shadow' : 'text-zinc-400 hover:text-[#0084FF]'}`}>
                <MessageSquare className="h-3.5 w-3.5" /> MS
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredChats.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-b border-zinc-800/50 cursor-pointer transition-all hover:bg-zinc-900 ${selectedChat === chat.id ? 'bg-zinc-900 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {chat.avatar}
                    </div>
                    {chat.isOnline && <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-zinc-950 rounded-full"></div>}
                    
                    {/* Platform Badge */}
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center border-2 border-zinc-950">
                      {chat.platform === 'whatsapp' ? (
                        <div className="bg-[#25D366] h-full w-full rounded-full flex items-center justify-center">
                          <MessageCircle className="h-3 w-3 text-white fill-current" />
                        </div>
                      ) : (
                        <div className="bg-[#0084FF] h-full w-full rounded-full flex items-center justify-center">
                          <MessageSquare className="h-3 w-3 text-white fill-current" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-white font-semibold truncate pr-2">{chat.name}</h4>
                      <span className="text-xs text-zinc-500 shrink-0">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate pr-2 ${chat.unread > 0 ? 'text-white font-medium' : 'text-zinc-500'}`}>
                        {chat.lastMsg}
                      </p>
                      {chat.unread > 0 && (
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Area - Active Chat */}
        {selectedChat && currentChat ? (
          <div className="flex-1 flex flex-col bg-[#0a0a0a] relative">
            
            {/* Chat Header */}
            <div className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white font-bold shadow-inner">
                  {currentChat.avatar}
                </div>
                <div>
                  <h3 className="text-white font-bold flex items-center gap-2">
                    {currentChat.name}
                    {currentChat.platform === 'whatsapp' ? (
                      <span className="text-[10px] bg-[#25D366]/20 text-[#25D366] px-2 py-0.5 rounded-full border border-[#25D366]/30">WhatsApp</span>
                    ) : (
                      <span className="text-[10px] bg-[#0084FF]/20 text-[#0084FF] px-2 py-0.5 rounded-full border border-[#0084FF]/30">Messenger</span>
                    )}
                  </h3>
                  <p className="text-xs text-zinc-500">{currentChat.isOnline ? 'Online' : 'Last seen recently'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* AI Toggle */}
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
                  <Bot className={`h-4 w-4 ${aiEnabled ? 'text-emerald-500' : 'text-zinc-500'}`} />
                  <span className="text-xs font-medium text-zinc-300">AI Auto-Reply</span>
                  <label className="relative inline-flex items-center cursor-pointer ml-1">
                    <input type="checkbox" checked={aiEnabled} onChange={() => setAiEnabled(!aiEnabled)} className="sr-only peer" />
                    <div className="w-7 h-4 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                
                <button className="text-zinc-400 hover:text-white transition-colors"><Phone className="h-5 w-5" /></button>
                <button className="text-zinc-400 hover:text-white transition-colors"><MoreVertical className="h-5 w-5" /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://i.pinimg.com/1200x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center bg-fixed bg-blend-overlay bg-black/90">
              {DUMMY_MESSAGES.map((msg, idx) => {
                const isUser = msg.sender === 'user'
                const isAi = msg.sender === 'ai'
                
                return (
                  <div key={msg.id} className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-end gap-2 max-w-[75%]">
                      
                      {isUser && (
                        <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 mb-1">
                          <User className="h-3 w-3 text-zinc-400" />
                        </div>
                      )}
                      
                      <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm ${
                        isUser 
                          ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-bl-sm' 
                          : 'bg-blue-600 text-white rounded-br-sm'
                      }`}>
                        {isAi && (
                          <div className="absolute -top-3 -left-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                            <Bot className="h-2.5 w-2.5" /> AI REPLIED
                          </div>
                        )}
                        
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        
                        <div className={`flex items-center justify-end gap-1 mt-1 ${isUser ? 'text-zinc-500' : 'text-blue-200'}`}>
                          <span className="text-[10px]">{msg.time}</span>
                          {!isUser && <CheckCheck className="h-3 w-3" />}
                        </div>
                      </div>

                      {!isUser && !isAi && (
                        <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mb-1">
                          <img src="/bondhu-logo.png" alt="" className="h-4 w-4 opacity-50" onError={(e) => e.currentTarget.style.display='none'} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 shrink-0">
              {aiEnabled && (
                <div className="mb-3 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <Bot className="h-4 w-4" /> AI is automatically responding to this conversation. You can type below to take over.
                </div>
              )}
              
              <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 focus-within:border-blue-500/50 transition-colors shadow-inner">
                <button className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors rounded-xl hover:bg-zinc-800 shrink-0">
                  <Smile className="h-5 w-5" />
                </button>
                <button className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors rounded-xl hover:bg-zinc-800 shrink-0">
                  <Paperclip className="h-5 w-5" />
                </button>
                <button className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors rounded-xl hover:bg-zinc-800 shrink-0">
                  <ImageIcon className="h-5 w-5" />
                </button>
                
                <textarea 
                  placeholder={currentChat.platform === 'whatsapp' ? 'Type a WhatsApp message...' : 'Type a Messenger message...'}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full max-h-32 min-h-[44px] bg-transparent text-white placeholder:text-zinc-500 resize-none outline-none py-3 px-2 text-[15px] custom-scrollbar"
                  rows={1}
                />
                
                <button 
                  className={`p-3 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    message.trim() 
                      ? currentChat.platform === 'whatsapp' ? 'bg-[#25D366] text-zinc-950 hover:bg-[#20bd5a]' : 'bg-[#0084FF] text-white hover:bg-[#0073e6]'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="h-5 w-5 ml-1" />
                </button>
              </div>
              
              <div className="mt-2 text-center flex justify-center">
                <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                  Replying via {currentChat.platform === 'whatsapp' ? <><MessageCircle className="h-3 w-3 text-[#25D366]" /> WhatsApp</> : <><MessageSquare className="h-3 w-3 text-[#0084FF]" /> Messenger</>}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 text-center p-8">
             <div className="h-24 w-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-inner">
               <MessageSquare className="h-10 w-10 text-zinc-700" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Omnichannel Inbox</h3>
             <p className="text-zinc-500 max-w-md mx-auto">Select a chat from the left to start messaging. Your WhatsApp and Messenger conversations will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  )
}
