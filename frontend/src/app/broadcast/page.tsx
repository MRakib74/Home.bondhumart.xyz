"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Send, CheckCircle, AlertTriangle, Loader2, Upload, Download, ListChecks, Bot, History, MessageSquare, Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BroadcastPage() {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [numbersInput, setNumbersInput] = useState("");
  const [checkResult, setCheckResult] = useState<{has_whatsapp: string[], no_whatsapp: string[]} | null>(null);
  
  const [campaignData, setCampaignData] = useState({
    name: "",
    target_segment: "hot_buyers",
    platform: "whatsapp",
    product_context: "",
    message_content: "",
    ai_auto_reply: true,
  });

  const checkNumbers = async () => {
    if (!numbersInput.trim()) {
      alert("দয়া করে অন্তত একটি নাম্বার দিন!");
      return;
    }

    const numberList = numbersInput.split("\n").map(n => n.trim()).filter(n => n);
    
    setLoading(true);
    try {
      // Mock API call for now (will connect to backend)
      setTimeout(() => {
        const hasWa = numberList.slice(0, Math.ceil(numberList.length * 0.8));
        const noWa = numberList.slice(Math.ceil(numberList.length * 0.8));
        setCheckResult({ has_whatsapp: hasWa, no_whatsapp: noWa });
        setLoading(false);
      }, 1500);
    } catch (error) {
      alert("সার্ভার এরর! আপনার Evolution API চালু আছে কিনা নিশ্চিত করুন।");
      setLoading(false);
    }
  };

  const sendCampaign = async () => {
    if (!campaignData.message_content || !campaignData.name) {
      alert("ক্যাম্পেইনের নাম এবং মেসেজ খালি রাখা যাবে না!");
      return;
    }

    setSending(true);
    try {
      // Mocking the send request
      setTimeout(() => {
        alert(`"${campaignData.name}" ক্যাম্পেইন সফলভাবে শুরু হয়েছে! AI এখন অটো-রিপ্লাইয়ের জন্য প্রস্তুত।`);
        setCampaignData({...campaignData, message_content: "", name: ""});
        setSending(false);
      }, 2000);
    } catch (error) {
      alert("সার্ভার এরর! Backend রান করা আছে কিনা চেক করুন।");
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Send className="text-blue-500" /> AI স্মার্ট ব্রডকাস্ট ও ডেটা ম্যানেজমেন্ট
        </h1>
        <p className="text-muted-foreground mt-2">
          আপনার কাস্টমার ডেটা ইমপোর্ট করুন, হোয়াটসঅ্যাপ ফিল্টার করুন এবং AI-এর মাধ্যমে অটো-সেলস ক্যাম্পেইন চালান।
        </p>
      </div>

      <Tabs defaultValue="campaign" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaign" className="flex gap-2"><Bot className="h-4 w-4"/> AI ক্যাম্পেইন সেন্ডার</TabsTrigger>
          <TabsTrigger value="data" className="flex gap-2"><ListChecks className="h-4 w-4"/> ডেটা ও ফিল্টার</TabsTrigger>
          <TabsTrigger value="history" className="flex gap-2"><History className="h-4 w-4"/> ব্রডকাস্ট হিস্টোরি</TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: AI CAMPAIGN SENDER ================= */}
        <TabsContent value="campaign">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            <Card className="shadow-sm border-blue-100 bg-blue-50/20">
              <CardHeader>
                <CardTitle className="text-blue-900">নতুন ক্যাম্পেইন তৈরি করুন</CardTitle>
                <CardDescription>ব্রডকাস্ট পাঠানোর পর AI নিজে থেকেই কাস্টমারের সাথে কথা বলবে এবং অর্ডার নিবে।</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ক্যাম্পেইনের নাম</Label>
                  <Input 
                    placeholder="যেমন: ঈদ ধামাকা অফার - শার্ট" 
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>কাকে পাঠাবেন?</Label>
                    <Select value={campaignData.target_segment} onValueChange={(val: string | null) => setCampaignData({...campaignData, target_segment: val || ""})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="টার্গেট সিলেক্ট করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hot_buyers">🔥 Hot Buyers (লাস্ট ৭ দিন)</SelectItem>
                        <SelectItem value="vip">💎 VIP কাস্টমার (৩+ অর্ডার)</SelectItem>
                        <SelectItem value="inactive">😴 Inactive (৩০ দিনের বেশি)</SelectItem>
                        <SelectItem value="has_whatsapp">✅ ফিল্টার করা WhatsApp লিস্ট</SelectItem>
                        <SelectItem value="no_whatsapp">📱 SMS লিস্ট (যাদের WA নেই)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>কোন মাধ্যমে?</Label>
                    <Select value={campaignData.platform} onValueChange={(val: string | null) => setCampaignData({...campaignData, platform: val || ""})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="মাধ্যম সিলেক্ট করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">💬 WhatsApp (Evolution API)</SelectItem>
                        <SelectItem value="sms">📱 SMS (Bulk SMS BD)</SelectItem>
                        <SelectItem value="email">📧 Email (SMTP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Label className="flex items-center gap-2 text-purple-700 font-semibold">
                    <Bot className="h-4 w-4" /> AI সেলস কনটেক্সট (প্রোডাক্ট)
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">কাস্টমার রিপ্লাই দিলে AI কোন প্রোডাক্ট বিক্রি করার চেষ্টা করবে?</p>
                  <Select value={campaignData.product_context} onValueChange={(val: string | null) => setCampaignData({...campaignData, product_context: val || ""})}>
                    <SelectTrigger className="bg-purple-50 border-purple-200">
                      <SelectValue placeholder="প্রোডাক্ট সিলেক্ট করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium_shirt">Premium Casual Shirt (৳950)</SelectItem>
                      <SelectItem value="smart_watch">Smart Watch X200 (৳1200)</SelectItem>
                      <SelectItem value="all_products">যেকোনো প্রোডাক্ট (জেনারেল বট)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>ব্রডকাস্ট মেসেজ</Label>
                  <Textarea 
                    placeholder="হ্যালো {name} ভাইয়া! আপনি আমাদের রেগুলার কাস্টমার। আপনার জন্য এই শার্টটিতে থাকছে স্পেশাল ২০% ছাড়! নিতে চাইলে 'হ্যাঁ' লিখে রিপ্লাই দিন..." 
                    className="h-[120px] bg-white resize-none"
                    value={campaignData.message_content}
                    onChange={(e) => setCampaignData({...campaignData, message_content: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">ভেরিয়েবল: {`{name}`}, {`{last_product}`}, {`{total_orders}`}</p>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={sendCampaign}
                  disabled={sending}
                >
                  {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {sending ? "ক্যাম্পেইন চালু হচ্ছে..." : "ক্যাম্পেইন শুরু করুন"}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-purple-100 bg-purple-50/20">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center gap-2">
                  <Bot className="h-5 w-5" /> AI এর কাজ কী হবে?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-700">
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span><strong>কাস্টমার হিস্টোরি মনে রাখা:</strong> ব্রডকাস্ট পাওয়ার পর কেউ রিপ্লাই দিলে AI তার আগের কেনার হিস্টোরি চেক করবে এবং সে অনুযায়ী সম্মান দিয়ে কথা বলবে।</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span><strong>অর্ডার তৈরি করা:</strong> কাস্টমার রাজি হলে AI সরাসরি BondhuMart ডাটাবেজে নতুন অর্ডার তৈরি করে ফেলবে।</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span><strong>ইনভয়েস পাঠানো:</strong> অর্ডার কনফার্ম হওয়ার সাথে সাথেই AI পিডিএফ ইনভয়েস বা ডিটেইলস পাঠিয়ে দিবে।</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================= TAB 2: DATA & FILTER ================= */}
        <TabsContent value="data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>ডেটা ইমপোর্ট ও চেকার</CardTitle>
                <CardDescription>কাস্টমারদের নাম্বার দিন, সিস্টেম নিজে থেকে WhatsApp এবং SMS আলাদা করবে।</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full"><Upload className="mr-2 h-4 w-4"/> CSV আপলোড</Button>
                  <Button variant="outline" className="w-full"><Download className="mr-2 h-4 w-4"/> ফরম্যাট ডাউনলোড</Button>
                </div>
                
                <div className="flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="px-3 text-xs text-slate-400">অথবা ম্যানুয়ালি পেস্ট করুন</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="space-y-2">
                  <Textarea 
                    placeholder="01712345678, Rakib, Dhaka&#10;8801812345678, Hasan, Sylhet" 
                    className="h-[150px] resize-none"
                    value={numbersInput}
                    onChange={(e) => setNumbersInput(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={checkNumbers} 
                  disabled={loading} 
                  className="w-full bg-slate-900 text-white"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ListChecks className="mr-2 h-4 w-4"/>}
                  {loading ? "ফিল্টার হচ্ছে..." : "WhatsApp ও SMS আলাদা করুন"}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>ফিল্টারিং রেজাল্ট</CardTitle>
                <CardDescription>চেক করার পর ডেটা এখান থেকে এক্সপোর্ট করতে পারবেন।</CardDescription>
              </CardHeader>
              <CardContent>
                {checkResult ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-green-700 font-semibold">
                          <MessageSquare className="h-5 w-5" /> 
                          হোয়াটসঅ্যাপ আছে ({checkResult.has_whatsapp.length})
                        </div>
                        <Button size="sm" variant="outline" className="text-green-700 border-green-300">এক্সপোর্ট</Button>
                      </div>
                      <p className="text-sm text-green-600">এই লিস্টটি ব্রডকাস্ট ক্যাম্পেইনে `WhatsApp` অপশনে ব্যবহার করতে পারবেন।</p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-orange-700 font-semibold">
                          <Phone className="h-5 w-5" /> 
                          হোয়াটসঅ্যাপ নেই ({checkResult.no_whatsapp.length})
                        </div>
                        <Button size="sm" variant="outline" className="text-orange-700 border-orange-300">এক্সপোর্ট</Button>
                      </div>
                      <p className="text-sm text-orange-600">এই লিস্টটি ব্রডকাস্ট ক্যাম্পেইনে `SMS` অপশনে ব্যবহার করতে পারবেন।</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-slate-400">
                    <ListChecks className="h-10 w-10 mb-2 opacity-20" />
                    <p>এখনো কোনো ডেটা চেক করা হয়নি</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================= TAB 3: HISTORY ================= */}
        <TabsContent value="history">
          <Card className="shadow-sm mt-4">
            <CardHeader>
              <CardTitle>ব্রডকাস্ট ও এআই হিস্টোরি</CardTitle>
              <CardDescription>কাকে কবে মেসেজ পাঠানো হয়েছে এবং তারা কী কিনেছে তার লিস্ট।</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>তারিখ</TableHead>
                      <TableHead>ক্যাম্পেইন</TableHead>
                      <TableHead>কাস্টমার</TableHead>
                      <TableHead>মাধ্যম</TableHead>
                      <TableHead>স্ট্যাটাস</TableHead>
                      <TableHead>এআই কনভার্সন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>May 31, 2026</TableCell>
                      <TableCell className="font-medium">ঈদ ধামাকা - শার্ট</TableCell>
                      <TableCell>
                        <div className="font-medium">Rakib Hasan</div>
                        <div className="text-xs text-muted-foreground">01712345678 (3 Orders)</div>
                      </TableCell>
                      <TableCell><span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3"/> WhatsApp</span></TableCell>
                      <TableCell><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Sent</span></TableCell>
                      <TableCell><span className="text-blue-600 font-medium">অর্ডার করেছে (BM-1045)</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 31, 2026</TableCell>
                      <TableCell className="font-medium">ঈদ ধামাকা - শার্ট</TableCell>
                      <TableCell>
                        <div className="font-medium">Mehedi Hasan</div>
                        <div className="text-xs text-muted-foreground">01812345678 (1 Order)</div>
                      </TableCell>
                      <TableCell><span className="inline-flex items-center gap-1"><Phone className="h-3 w-3"/> SMS</span></TableCell>
                      <TableCell><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Sent</span></TableCell>
                      <TableCell><span className="text-slate-500">রিপ্লাই নেই</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>May 30, 2026</TableCell>
                      <TableCell className="font-medium">Winback Campaign</TableCell>
                      <TableCell>
                        <div className="font-medium">Abdur Rahman</div>
                        <div className="text-xs text-muted-foreground">01912345678 (VIP)</div>
                      </TableCell>
                      <TableCell><span className="inline-flex items-center gap-1"><MessageSquare className="h-3 w-3"/> WhatsApp</span></TableCell>
                      <TableCell><span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Sent</span></TableCell>
                      <TableCell><span className="text-purple-600 font-medium">এআই কথা বলছে...</span></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
