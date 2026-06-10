import { Users, ShoppingCart, Activity, RefreshCcw } from "lucide-react"

const stats = [
  { name: 'Total Customers', value: '1,632', change: '+12%', icon: Users },
  { name: 'Pending Orders', value: '45', change: '-2%', icon: ShoppingCart },
  { name: 'Active AI Chats', value: '12', change: '+24%', icon: Activity },
  { name: 'Data Sync Status', value: 'Live', change: 'Just now', icon: RefreshCcw },
]

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 h-[400px] w-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">Welcome to your AI Command Center. Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="glass-card rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110 group-hover:opacity-20">
              <stat.icon className="h-16 w-16" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-primary/10 rounded-xl">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
            </div>
            <div className="mt-4 flex items-baseline gap-2 relative z-10">
              <p className="text-3xl font-bold">{stat.value}</p>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-500' : stat.change.startsWith('-') ? 'text-rose-500' : 'text-primary'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent AI Activity</h3>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI replied to <span className="text-primary">018XXXXXX</span> regarding order tracking.</p>
                  <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm">
              <Send className="h-4 w-4" />
              New AI Broadcast
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors font-medium text-sm">
              <RefreshCcw className="h-4 w-4" />
              Sync Laravel Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
