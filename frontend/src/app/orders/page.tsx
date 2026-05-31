"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Flame, UserMinus, RotateCcw, AlertCircle, MessageCircle } from "lucide-react";

export default function OrdersPage() {
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState<{
    hot_buyers: any[],
    inactive_30_days: any[],
    repeated_customers: any[],
    cancelled_orders: any[]
  } | null>(null);

  const fetchSegments = async () => {
    setLoading(true);
    try {
      // Mock Data to simulate Backend response since we don't have DB connected yet
      setTimeout(() => {
        setSegments({
          hot_buyers: [
            { name: "Rafiq Ahmed", phone: "01711000001", last_product: "Sleeping Spray", days_ago: 2 },
            { name: "Karim Hasan", phone: "01811000002", last_product: "Face Wash", days_ago: 5 }
          ],
          inactive_30_days: [
            { name: "Salma Akter", phone: "01911000003", last_product: "Hair Oil", days_ago: 45 }
          ],
          repeated_customers: [
            { name: "Karim Hasan", phone: "01811000002", total_orders: 3 }
          ],
          cancelled_orders: [
            { name: "Jabbar Ali", phone: "01611000004", reason: "Customer Not Reached" }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (e) {
      setLoading(false);
    }
  };

  const CustomerTable = ({ data, showDays = false, showOrders = false }: { data: any[], showDays?: boolean, showOrders?: boolean }) => (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>নাম</TableHead>
            <TableHead>ফোন নাম্বার</TableHead>
            <TableHead>লাস্ট প্রোডাক্ট</TableHead>
            {showDays && <TableHead>কতদিন আগে</TableHead>}
            {showOrders && <TableHead>মোট অর্ডার</TableHead>}
            <TableHead className="text-right">একশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">কোনো ডাটা পাওয়া যায়নি</TableCell></TableRow>
          ) : data.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.last_product || "N/A"}</TableCell>
              {showDays && <TableCell>{item.days_ago} দিন আগে</TableCell>}
              {showOrders && <TableCell>{item.total_orders} বার</TableCell>}
              <TableCell className="text-right">
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  <MessageCircle className="h-4 w-4 mr-1" /> ফলোআপ 
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart className="text-indigo-500" /> অর্ডার এনালাইসিস
          </h1>
          <p className="text-muted-foreground mt-2">
            Bondhumart ডাটাবেজ থেকে কাস্টমারদের ক্রয় আচরণ বুঝে অটোমেটিক সেগমেন্ট করুন।
          </p>
        </div>
        <Button onClick={fetchSegments} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
          {loading ? "এনালাইসিস হচ্ছে..." : "রিয়েল-টাইম এনালাইসিস শুরু করুন"}
        </Button>
      </div>

      {!segments && !loading && (
        <Card className="border-dashed flex flex-col items-center justify-center h-48 bg-slate-50/50">
          <p className="text-muted-foreground">উপরে "রিয়েল-টাইম এনালাইসিস" বাটনে ক্লিক করুন</p>
        </Card>
      )}

      {segments && (
        <Tabs defaultValue="hot" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="hot" className="data-[state=active]:text-red-600">
              <Flame className="h-4 w-4 mr-2" /> Hot Buyers
            </TabsTrigger>
            <TabsTrigger value="repeated" className="data-[state=active]:text-green-600">
              <RotateCcw className="h-4 w-4 mr-2" /> Repeated
            </TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:text-orange-600">
              <UserMinus className="h-4 w-4 mr-2" /> Inactive
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:text-slate-600">
              <AlertCircle className="h-4 w-4 mr-2" /> Cancelled
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hot">
            <Card>
              <CardHeader>
                <CardTitle>🔥 Hot Buyers ({segments.hot_buyers.length})</CardTitle>
                <CardDescription>যারা গত ৭ দিনের মধ্যে অর্ডার করেছে। এদেরকে আপসেল (Upsell) বা ক্রস-সেল (Cross-sell) করা সহজ।</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerTable data={segments.hot_buyers} showDays={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repeated">
            <Card>
              <CardHeader>
                <CardTitle>🔄 Repeated Customers ({segments.repeated_customers.length})</CardTitle>
                <CardDescription>আমাদের সবচেয়ে লয়াল কাস্টমার যারা বারবার কেনাকাটা করে।</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerTable data={segments.repeated_customers} showOrders={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inactive">
            <Card>
              <CardHeader>
                <CardTitle>😴 Inactive Customers ({segments.inactive_30_days.length})</CardTitle>
                <CardDescription>যারা ৩০ দিনের বেশি সময় ধরে কিছু কেনেনি। এদেরকে স্পেশাল ডিসকাউন্ট দিয়ে ফিরিয়ে আনুন।</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerTable data={segments.inactive_30_days} showDays={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled">
            <Card>
              <CardHeader>
                <CardTitle>🚫 Cancelled Orders ({segments.cancelled_orders.length})</CardTitle>
                <CardDescription>যাদের অর্ডার কোনো কারণে ক্যান্সেল হয়েছে, তাদের ফলোআপ করুন।</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerTable data={segments.cancelled_orders} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
