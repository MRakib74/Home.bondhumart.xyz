"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { 
  LayoutDashboard, 
  MessageSquare, 
  Send,
  History,
  Truck,
  BookOpen,
  Settings,
  BarChart3,
  Globe,
  ShoppingCart,
  ShieldAlert,
  BellRing,
  MessageSquareText,
  ChevronDown,
  ChevronRight,
  Menu, X
} from "lucide-react"

type NavItem = {
  name: string
  href?: string
  icon?: any
  children?: NavItem[]
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Ads Analytics', href: '/ads', icon: BarChart3 },
  { 
    name: 'Website Management', 
    icon: Globe,
    children: [
      { 
        name: 'Order Manage', 
        icon: ShoppingCart,
        children: [
          { name: 'All Orders', href: '/website-management/orders/all' },
          { name: 'Pending Order', href: '/website-management/orders/pending' },
          { name: 'Confirmed Order', href: '/website-management/orders/confirmed' },
          { name: 'Hold Order', href: '/website-management/orders/on-hold' },
          { name: 'Shipped Order', href: '/website-management/orders/shipped' },
          { name: 'Delivered Order', href: '/website-management/orders/delivered' },
          { name: 'Cancelled Order', href: '/website-management/orders/cancelled' },
          { name: 'Returning Order', href: '/website-management/orders/returning' },
          { name: 'Return Received', href: '/website-management/orders/return-received' },
        ]
      },
      { name: 'Blocked Fraud Customer', href: '/website-management/blocked', icon: ShieldAlert },
      { name: 'Notification & SMS', href: '/website-management/notifications', icon: BellRing },
      { name: 'Message Info', href: '/website-management/message-logs', icon: MessageSquareText },
    ]
  },
  { name: 'Fraud Check & History', href: '/history', icon: History },
  { name: 'Live AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'AI Broadcast', href: '/broadcast', icon: Send },
  { name: 'Broadcast Logs', href: '/broadcast-logs', icon: History },
  { name: 'AI Training Center', href: '/ai-training', icon: BookOpen },
  { name: 'Courier Auto-Entry', href: '/courier', icon: Truck },
  { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
  { name: 'Invoice Builder', href: '/invoice-builder', icon: Settings },
  { name: 'Settings', href: '/settings', icon: Settings },
]

function NavItemComponent({ item, level = 0, pathname, closeMobile }: { item: NavItem, level?: number, pathname: string, closeMobile?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Auto open if a child is active
  useEffect(() => {
    if (item.children) {
      const isChildActive = (children: NavItem[]): boolean => {
        return children.some(child => 
          (child.href && pathname.startsWith(child.href)) || 
          (child.children && isChildActive(child.children))
        )
      }
      if (isChildActive(item.children)) {
        setIsOpen(true)
      }
    }
  }, [pathname, item.children])

  const isActive = item.href ? pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) : false

  if (item.children) {
    return (
      <div className="flex flex-col space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "group flex items-center justify-between gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            isActive ? "bg-primary/10 text-primary" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          )}
          style={{ paddingLeft: `${(level * 12) + 12}px` }}
        >
          <div className="flex items-center gap-x-3">
            {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
            {item.name}
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        </button>
        
        {isOpen && (
          <div className="flex flex-col space-y-1 mt-1">
            {item.children.map((child, idx) => (
              <NavItemComponent key={idx} item={child} level={level + 1} pathname={pathname} closeMobile={closeMobile} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href || '#'}
      onClick={closeMobile}
      className={cn(
        "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
        isActive 
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
      style={{ paddingLeft: `${(level * 12) + 12}px` }}
    >
      {level > 0 && !isActive && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-zinc-500 transition-colors" />
      )}
      {item.icon && (
        <item.icon
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
      )}
      {item.name}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-[#0a0a0a]">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          BondhuOS AI
        </h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-6 space-y-1 custom-scrollbar">
        {navigation.map((item, idx) => (
          <NavItemComponent key={idx} item={item} pathname={pathname} />
        ))}
      </div>
    </div>
  )
}

// ---------- Mobile Navigation ----------
export function MobileNav() {
  const pathname = usePathname()
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  const mainNav = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Website', href: '/website-management/orders/all', icon: Globe },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Broadcast', href: '/broadcast', icon: Send },
  ]

  const moreNav = navigation.filter(n => !mainNav.find(m => m.name === n.name))

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 z-50 px-2 flex items-center justify-around pb-safe">
        {mainNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center w-16 h-full tap-highlight-transparent"
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                isActive ? "bg-primary/20" : "bg-transparent"
              )}>
                <item.icon className={cn("h-[22px] w-[22px]", isActive ? "text-primary" : "text-zinc-500")} />
              </div>
              <span className={cn("text-[10px] mt-1 font-medium", isActive ? "text-primary" : "text-zinc-500")}>
                {item.name}
              </span>
            </Link>
          )
        })}

        <button
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center justify-center w-16 h-full tap-highlight-transparent"
        >
          <div className={cn("p-1.5 rounded-xl transition-all duration-300", isMoreOpen ? "bg-primary/20" : "bg-transparent")}>
            <Menu className={cn("h-[22px] w-[22px]", isMoreOpen ? "text-primary" : "text-zinc-500")} />
          </div>
          <span className={cn("text-[10px] mt-1 font-medium", isMoreOpen ? "text-primary" : "text-zinc-500")}>
            More
          </span>
        </button>
      </div>

      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsMoreOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 rounded-t-3xl h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 shrink-0">
              <h2 className="text-lg font-bold text-white">Menu</h2>
              <button onClick={() => setIsMoreOpen(false)} className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navigation.map((item, idx) => (
                <NavItemComponent key={idx} item={item} pathname={pathname} closeMobile={() => setIsMoreOpen(false)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

