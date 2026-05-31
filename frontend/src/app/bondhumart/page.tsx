"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Link2, Loader2, RefreshCw, Flame, Users, UserX, Star, ShoppingBag,
  CheckCircle2, AlertTriangle, ArrowRight, MessageCircle
} from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  delivered: "bg-green-100 text-green-700 border-green-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  pending:   "bg-yellow-100 text-yellow-700 border-yellow-200",
  shipped:   "bg-purple-100 text-purple-700 border-purple-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function BondhumartPage() {
  const [syncing, setSyncing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{type: "success" | "error", msg: string} | null>(null);
  const [segments, setSegments] = useState<any | null>(null);

  const pullFromApi = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/bondhumart/sync/pull-from-api", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncMsg({ type: "success", msg: data.message });
      } else {
        setSyncMsg({ type: "error", msg: data.detail || "সিঙ্ক ব্যর্থ হয়েছে।" });
      }
    } catch (e) {
      setSyncMsg({ type: "error", msg: "সার্ভার কানেকশন ব্যর্থ! Backend রান করা আছে কিনা চেক করুন।" });
    } finally {
      setSyncing(false);
    }
  };

  const runSegmentation = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/bondhumart/segments");
      const data = await res.json();
      setSegments(data);
    } catch (e) {
      alert("এনালাইসিস ব্যর্থ হয়েছে!");
    } finally {
      setAnalyzing(false);
    }
  };

  const CustomerTable = ({ data }: { data: any[] }) => (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>নাম</TableHead>
            <TableHead>ফোন</TableHead>
            <TableHead>মোট অর্ডার</TableHead>
            <TableHead>মোট খরচ</TableHead>
            <TableHead>শেষ প্রোডাক্ট</TableHead>
            <TableHead className="text-right">একশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                এই সেগমেন্টে কোনো কাস্টমার নেই।
              </TableCell>
            </TableRow>
          ) : data.map((c, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>{c.order_count} বার</TableCell>
              <TableCell>৳{c.total_spent?.toLocaleString()}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{c.last_products?.join(", ") || "—"}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Link2 className="text-blue-600" /> Bondhumart কানেকশন সেন্টার
        </h1>
        <p className="text-muted-foreground mt-2">
          আপনার Bondhumart সাইটের সমস্ত অর্ডার এখানে সিঙ্ক করুন এবং কাস্টমারদের বুদ্ধিমত্তার সাথে ম্যানেজ করুন।
        </p>
      </div>

      {/* Connection Status + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-100 bg-blue-50/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600" /> Bondhumart API সিঙ্ক
            </CardTitle>
            <CardDescription>আপনার সাইটের API থেকে সরাসরি অর্ডার টেনে আনুন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {syncMsg && (
              <div className={`p-2 rounded-md text-sm flex items-center gap-2 ${syncMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {syncMsg.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {syncMsg.msg}
              </div>
            )}
            <Button onClick={pullFromApi} disabled={syncing} className="w-full bg-blue-600 hover:bg-blue-700">
              {syncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {syncing ? "সিঙ্ক হচ্ছে..." : "এখনই সিঙ্ক করুন"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Settings-এ Bondhumart API URL ও Token বসানো থাকলে কাজ করবে।
            </p>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 bg-indigo-50/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" /> AI কাস্টমার সেগমেন্টেশন
            </CardTitle>
            <CardDescription>সিঙ্ক করা অর্ডার থেকে স্বয়ংক্রিয় শ্রেণীবিভাগ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={runSegmentation} disabled={analyzing} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {analyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              {analyzing ? "বিশ্লেষণ হচ্ছে..." : "AI এনালাইসিস চালান"}
            </Button>
            {segments && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="text-center bg-white rounded p-2 border text-sm">
                  <p className="font-bold text-lg">{segments.summary?.total_orders}</p>
                  <p className="text-muted-foreground text-xs">মোট অর্ডার</p>
                </div>
                <div className="text-center bg-white rounded p-2 border text-sm">
                  <p className="font-bold text-lg">{segments.summary?.total_unique_customers}</p>
                  <p className="text-muted-foreground text-xs">ইউনিক কাস্টমার</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Webhook Info */}
      <Card className="border-amber-100 bg-amber-50/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-amber-800">⚡ Bondhumart Webhook URL (অটো-সিঙ্কের জন্য)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
            <code className="flex-1 bg-amber-100 border border-amber-200 text-amber-900 px-3 py-2 rounded text-sm font-mono break-all">
              http://YOUR_SERVER_IP:8000/api/v1/bondhumart/webhook/new-order
            </code>
            <Button size="sm" variant="outline" className="text-amber-700 border-amber-300 whitespace-nowrap"
              onClick={() => navigator.clipboard.writeText("http://YOUR_SERVER_IP:8000/api/v1/bondhumart/webhook/new-order")}>
              কপি করুন
            </Button>
          </div>
          <p className="text-xs text-amber-700 mt-2">
            এই URL টি আপনার Bondhumart সাইটের Order Webhook সেকশনে বসিয়ে দিন। তাহলে প্রতিটি নতুন অর্ডার স্বয়ংক্রিয়ভাবে এখানে চলে আসবে।
          </p>
        </CardContent>
      </Card>

      {/* Segmentation Results */}
      {segments && (
        <Tabs defaultValue="hot" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4 h-auto">
            <TabsTrigger value="vip" className="text-xs">⭐ VIP ({segments.segments.vip_customers?.length})</TabsTrigger>
            <TabsTrigger value="hot" className="text-xs">🔥 Hot ({segments.segments.hot_buyers?.length})</TabsTrigger>
            <TabsTrigger value="repeated" className="text-xs">🔄 রিপিটেড ({segments.segments.repeated_customers?.length})</TabsTrigger>
            <TabsTrigger value="new" className="text-xs">🆕 নতুন ({segments.segments.new_customers?.length})</TabsTrigger>
            <TabsTrigger value="inactive" className="text-xs">😴 ইনঅ্যাক্টিভ ({segments.segments.inactive_30_days?.length})</TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs">🚫 ক্যান্সেল ({segments.segments.cancelled_orders?.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="vip">
            <Card><CardHeader><CardTitle>⭐ VIP Customers</CardTitle><CardDescription>৳৫০০০+ খরচ করেছেন এবং ৩+ বার অর্ডার করেছেন। এরাই আপনার সেরা কাস্টমার।</CardDescription></CardHeader><CardContent><CustomerTable data={segments.segments.vip_customers} /></CardContent></Card>
          </TabsContent>
          <TabsContent value="hot">
            <Card><CardHeader><CardTitle>🔥 Hot Buyers</CardTitle><CardDescription>গত ৭ দিনে ডেলিভারি পেয়েছেন। এখনই আপসেল করুন!</CardDescription></CardHeader><CardContent><CustomerTable data={segments.segments.hot_buyers} /></CardContent></Card>
          </TabsContent>
          <TabsContent value="repeated">
            <Card><CardHeader><CardTitle>🔄 Repeated Customers</CardTitle><CardDescription>একাধিকবার অর্ডার করেছেন। এরা আপনার লয়াল কাস্টমার।</CardDescription></CardHeader><CardContent><CustomerTable data={segments.segments.repeated_customers} /></CardContent></Card>
          </TabsContent>
          <TabsContent value="new">
            <Card><CardHeader><CardTitle>🆕 New Customers</CardTitle><CardDescription>প্রথমবার অর্ডার করেছেন। এদের ভালো অভিজ্ঞতা দিলে রিপিট কাস্টমার হবেন।</CardDescription></CardHeader><CardContent><CustomerTable data={segments.segments.new_customers} /></CardContent></Card>
          </TabsContent>
          <TabsContent value="inactive">
            <Card><CardHeader><CardTitle>😴 Inactive (৩০+ দিন)</CardTitle><CardDescription>দীর্ঘদিন কেনেননি। স্পেশাল অফার দিয়ে ফিরিয়ে আনুন।</CardDescription></CardHeader><CardContent><CustomerTable data={segments.segments.inactive_30_days} /></CardContent></Card>
          </TabsContent>
          <TabsContent value="cancelled">
            <Card><CardHeader><CardTitle>🚫 Cancelled Orders</CardTitle><CardDescription>অর্ডার ক্যান্সেল হয়েছে। কারণ জেনে পুনরায় যোগাযোগ করুন।</CardDescription></CardHeader><CardContent><CustomerTable data={segments.segments.cancelled_orders} /></CardContent></Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
