import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Video, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ড্যাশবোর্ড ওভারভিউ</h1>
        <p className="text-muted-foreground mt-2">
          আপনার পুরো বিজনেস এক জায়গা থেকে কন্ট্রোল করুন।
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">আজকের অর্ডার</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">45+</div>
            <p className="text-xs text-muted-foreground">+20% গতকালের চেয়ে</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">নতুন লিড</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">120</div>
            <p className="text-xs text-muted-foreground">n8n থেকে স্ক্র্যাপ করা</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI কন্টেন্ট</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground">আজ জেনারেট হয়েছে</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI ভিডিও</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">3</div>
            <p className="text-xs text-muted-foreground">HeyGen রেন্ডারিং সম্পন্ন</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions (Mobile Optimized) */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">কুইক একশন</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:border-slate-300 transition-colors cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">ব্রডকাস্ট করুন</h3>
              <p className="text-sm text-muted-foreground mt-1">সব কাস্টমারকে WhatsApp এ অফার পাঠান</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:border-slate-300 transition-colors cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">নতুন ভিডিও বানান</h3>
              <p className="text-sm text-muted-foreground mt-1">HeyGen দিয়ে এআই ভিডিও তৈরি করুন</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
