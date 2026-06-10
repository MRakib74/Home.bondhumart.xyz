import { BookOpen, Plus, Search } from "lucide-react"

export default function KnowledgeBase() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Knowledge Base</h2>
          <p className="text-muted-foreground mt-2">Manage your company policies, rules, and guidelines for the AI.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-5 w-5" />
          Add New Rule
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search policies..." 
              className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {[
            { topic: "Return Policy", content: "Customers can return products within 3 days of delivery if the seal is unbroken. Video proof of unboxing is required." },
            { topic: "Delivery Charges", content: "Inside Dhaka: 70 BDT. Outside Dhaka: 120 BDT. Cash on Delivery is available everywhere." },
            { topic: "Payment Details", content: "Bkash/Nagad number: 01XXXXXXXXX (Personal). Please send last 4 digits after payment." }
          ].map((rule, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{rule.topic}</h3>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground">Edit</button>
                  <button className="text-sm font-medium text-rose-500 hover:text-rose-600">Delete</button>
                </div>
              </div>
              <p className="mt-3 text-muted-foreground leading-relaxed">{rule.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
