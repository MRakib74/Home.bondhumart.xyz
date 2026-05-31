"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, Users, History, UploadCloud, Database, 
  MessageSquare, FileText, CheckCircle2, Search, Filter,
  MessageCircle, Smartphone, AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SmartBroadcastCRM() {
  const [loading, setLoading] = useState(false);

  // ডামি ডেটা (পরে ব্যাকএন্ড থেকে আসবে)
  const customers = [
    { id: 1, name: "রাকিব হাসান", phone: "01711223344", has_whatsapp: true, total_orders: 5, spent: 7500, segment: "VIP", last_bought: "Panjabi" },
    { id: 2, name: "সাদিয়া আক্তার", phone: "01822334455", has_whatsapp: false, total_orders: 1, spent: 1200, segment: "New", last_bought: "T-Shirt" },
    { id: 3, name: "তানভীর আহমেদ", phone: "01933445566", has_whatsapp: true, total_orders: 2, spent: 2500, segment: "Repeated", last_bought: "Watch" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Send className="text-indigo-500" /> AI স্মার্ট ব্রডকাস্ট ও CRM
        </h1>
        <p className="text-muted-foreground mt-2">
          BondhuMart ডেটা ইম্পোর্ট, কাস্টমার সেগমেন্টেশন এবং AI দ্বারা অটোমেটিক মেসেজ ব্রডকাস্ট।
        </p>
      </div>

      <Tabs defaultValue="audience" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-200/50 p-1 rounded-xl">
          <TabsTrigger value="audience" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="w-4 h-4 mr-2" /> কাস্টমার ডাটাবেজ
          </TabsTrigger>
          <TabsTrigger value="broadcast" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <MessageSquare className="w-4 h-4 mr-2" /> নতুন ব্রডকাস্ট
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <History className="w-4 h-4 mr-2" /> হিস্ট্রি ও রিপোর্ট
          </TabsTrigger>
        </TabsList>

        {/* ===================== TAB 1: AUDIENCE ===================== */}
        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="border-indigo-100 bg-indigo-50/30">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                <Database className="h-10 w-10 text-indigo-500 mb-3" />
                <h3 className="text-lg font-semibold mb-1">BondhuMart থেকে সিঙ্ক করুন</h3>
                <p className="text-sm text-slate-500 mb-4">রিয়েল-টাইম লাইভ ডাটাবেজ থেকে কাস্টমার আনুন</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                  <RefreshCwIcon className="w-4 h-4 mr-2" /> লাইভ সিঙ্ক শুরু করুন
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 bg-blue-50/30">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                <UploadCloud className="h-10 w-10 text-blue-500 mb-3" />
                <h3 className="text-lg font-semibold mb-1">ম্যানুয়াল ইম্পোর্ট (Excel/CSV)</h3>
                <p className="text-sm text-slate-500 mb-4">বাইরের লিড বা কাস্টমার ডেটা আপলোড করুন</p>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="file" accept=".csv, .xlsx" className="bg-white" />
                  <Button variant="outline">আপলোড</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>কাস্টমার লিস্ট</CardTitle>
                <CardDescription>আপনার সমস্ত ইম্পোর্ট করা কাস্টমারদের তালিকা</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input placeholder="নাম বা নাম্বার খুঁজুন..." className="pl-8 w-[200px] h-9" />
                </div>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" /> ফিল্টার
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                    <tr>
                      <th className="px-4 py-3">নাম ও নাম্বার</th>
                      <th className="px-4 py-3">অর্ডার হিস্ট্রি</th>
                      <th className="px-4 py-3">চ্যানেল (WhatsApp/SMS)</th>
                      <th className="px-4 py-3">সেগমেন্ট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{c.name}</div>
                          <div className="text-slate-500 text-xs">{c.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-700">{c.total_orders}টি অর্ডার (৳{c.spent})</div>
                          <div className="text-xs text-slate-500">শেষ কিনেছে: {c.last_bought}</div>
                        </td>
                        <td className="px-4 py-3">
                          {c.has_whatsapp ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 border-0">
                              <MessageCircle className="w-3 h-3" /> WhatsApp
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1 border-0">
                              <Smartphone className="w-3 h-3" /> SMS Only
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={c.segment === 'VIP' ? 'default' : 'outline'}>{c.segment}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== TAB 2: BROADCAST ===================== */}
        <TabsContent value="broadcast" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>নতুন ব্রডকাস্ট তৈরি করুন</CardTitle>
                  <CardDescription>কাদেরকে মেসেজ পাঠাবেন এবং কী মেসেজ পাঠাবেন সেট করুন</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>টার্গেট সেগমেন্ট (Audience)</Label>
                      <Select defaultValue="vip">
                        <SelectTrigger>
                          <SelectValue placeholder="সিলেক্ট করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">সবাইকে (All)</SelectItem>
                          <SelectItem value="vip">VIP কাস্টমার (৳৫০০০+)</SelectItem>
                          <SelectItem value="hot">Hot Buyers (গত ৭ দিন)</SelectItem>
                          <SelectItem value="inactive">Inactive (গত ৩০ দিনে কেনেনি)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>সেন্ডিং চ্যানেল</Label>
                      <Select defaultValue="smart">
                        <SelectTrigger>
                          <SelectValue placeholder="সিলেক্ট করুন" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smart">Smart (WhatsApp থাকলে WA, না থাকলে SMS)</SelectItem>
                          <SelectItem value="whatsapp_only">শুধুমাত্র WhatsApp (Evolution)</SelectItem>
                          <SelectItem value="sms_only">শুধুমাত্র SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>ব্রডকাস্ট মেসেজ</Label>
                      <span className="text-xs text-blue-600 cursor-pointer hover:underline">AI দিয়ে লিখিয়ে নিন</span>
                    </div>
                    <Textarea 
                      placeholder="হ্যালো {name}, কেমন আছেন? আপনার জন্য আমাদের নতুন কালেকশনে থাকছে বিশেষ অফার..."
                      className="min-h-[150px] resize-y"
                    />
                    <p className="text-xs text-slate-500">শর্টকোড ব্যবহার করুন: <code>{`{name}`}</code>, <code>{`{last_bought}`}</code></p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/30">
                <CardContent className="pt-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-green-800 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> AI অটো-রিপ্লাই ও সেলস এজেন্ট
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      ব্রডকাস্ট পাঠানোর পর কেউ রিপ্লাই দিলে AI তার হিস্ট্রি দেখে নিজে থেকেই চ্যাট করবে এবং অর্ডার তৈরি করবে।
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">অ্যাক্টিভ করুন</span>
                    {/* Switch placeholder */}
                    <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg">
                <Send className="w-5 h-5 mr-2" /> ব্রডকাস্ট পাঠানো শুরু করুন
              </Button>
            </div>

            {/* Sidebar Preview */}
            <div>
              <Card className="sticky top-6 border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#075e54] text-white p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">BondhuMart</div>
                    <div className="text-[10px] opacity-80">WhatsApp Preview</div>
                  </div>
                </div>
                <div className="bg-[#efeae2] p-4 min-h-[300px] flex flex-col justify-end">
                  <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm max-w-[85%] text-slate-800 mb-2">
                    হ্যালো <strong>রাকিব হাসান</strong>, কেমন আছেন? আপনার জন্য আমাদের নতুন কালেকশনে থাকছে বিশেষ অফার!
                    <div className="text-[10px] text-slate-400 text-right mt-1">10:42 AM</div>
                  </div>
                  
                  <div className="bg-[#d9fdd3] p-3 rounded-lg rounded-tr-none shadow-sm text-sm max-w-[85%] text-slate-800 self-end mb-2 relative">
                    <div className="text-xs text-green-700 font-semibold mb-1">AI Agent (Auto Reply)</div>
                    জি ভাইয়া, আপনি গতবার <strong>Panjabi</strong> নিয়েছিলেন, এবার শার্ট নিতে পারেন!
                    <div className="text-[10px] text-slate-400 text-right mt-1">10:43 AM</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ===================== TAB 3: HISTORY ===================== */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>ব্রডকাস্ট হিস্ট্রি</CardTitle>
              <CardDescription>আগে পাঠানো মেসেজগুলোর লগ এবং রিপোর্ট</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-lg">
                <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>এখনও কোনো ব্রডকাস্ট পাঠানো হয়নি।</p>
                <p className="text-sm mt-1">আপনার প্রথম ক্যাম্পেইন রান করলে এখানে রিপোর্ট দেখতে পাবেন।</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper icons
function RefreshCwIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
}
function UserIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
