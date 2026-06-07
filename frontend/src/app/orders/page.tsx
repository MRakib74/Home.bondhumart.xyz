"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Truck, User, CreditCard, ShoppingCart, CheckCircle2, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OrdersPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ccOrders, setCcOrders] = useState<any[]>([]);
  
  // New Order State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    phone: "",
    address: "",
    district: "",
    product_name: "",
    quantity: 1,
    price: 0,
    courier_name: "steadfast"
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 1. Fetch BondhuMart Live Orders
      const liveRes = await fetch("http://127.0.0.1:8000/api/v1/live/orders?limit=30");
      if (liveRes.ok) {
        const liveData = await liveRes.json();
        setOrders(liveData);
      }
      
      // 2. Fetch Command Center Created Orders
      const ccRes = await fetch("http://127.0.0.1:8000/api/v1/orders/list");
      if (ccRes.ok) {
        const ccData = await ccRes.json();
        setCcOrders(ccData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async () => {
    if(!newOrder.customer_name || !newOrder.phone || !newOrder.product_name || !newOrder.price) return;
    setIsSubmitting(true);
    try {
      const payload = {
        customer_name: newOrder.customer_name,
        phone: newOrder.phone,
        address: newOrder.address,
        district: newOrder.district,
        courier_name: newOrder.courier_name,
        total_amount: newOrder.price * newOrder.quantity,
        items: [
          {
            product_id: "custom",
            product_name: newOrder.product_name,
            quantity: newOrder.quantity,
            price: newOrder.price
          }
        ]
      };
      
      const res = await fetch("http://127.0.0.1:8000/api/v1/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if(res.ok) {
        alert("অর্ডার সফলভাবে তৈরি হয়েছে!");
        setNewOrder({
          customer_name: "", phone: "", address: "", district: "",
          product_name: "", quantity: 1, price: 0, courier_name: "steadfast"
        });
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingCart className="text-indigo-500" /> অর্ডার ম্যানেজমেন্ট
          </h1>
          <p className="text-muted-foreground mt-2">
            Bondhumart এর লাইভ অর্ডার দেখুন এবং Command Center থেকে নতুন অর্ডার তৈরি করুন।
          </p>
        </div>
        <Button onClick={fetchOrders} disabled={loading} variant="outline" className="gap-2">
          <RotateCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "আপডেট হচ্ছে..." : "রিফ্রেশ"}
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="list" className="text-md">অর্ডার লিস্ট (সব)</TabsTrigger>
          <TabsTrigger value="create" className="text-md bg-indigo-50 text-indigo-700">নতুন অর্ডার তৈরি করুন</TabsTrigger>
        </TabsList>
        
        {/* ===================== TAB 1: ORDER LIST ===================== */}
        <TabsContent value="list" className="space-y-6">
          {/* Command Center Orders */}
          <Card className="border-indigo-100">
            <CardHeader className="bg-indigo-50/50 pb-4">
              <CardTitle className="text-indigo-800 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Command Center থেকে তৈরি করা অর্ডার
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>কাস্টমার</TableHead>
                    <TableHead>আইটেম</TableHead>
                    <TableHead>মোট বিল</TableHead>
                    <TableHead>কুরিয়ার</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ccOrders.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-6 text-slate-500">কোনো অর্ডার নেই</TableCell></TableRow>
                  ) : ccOrders.map((order, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-xs text-slate-500">{order.phone}</div>
                      </TableCell>
                      <TableCell>{order.items[0]?.product_name} <span className="text-xs text-slate-400">(x{order.items[0]?.quantity})</span></TableCell>
                      <TableCell className="font-semibold text-green-700">৳{order.total_amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize bg-slate-100">{order.courier_name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* BondhuMart Orders */}
          <Card>
            <CardHeader>
              <CardTitle>BondhuMart সাইটের লাইভ অর্ডার</CardTitle>
              <CardDescription>মেইন ওয়েবসাইট থেকে আসা রিসেন্ট অর্ডারগুলো</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>অর্ডার আইডি</TableHead>
                    <TableHead>কাস্টমার</TableHead>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>মোট বিল</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-6 text-slate-500">কোনো ডেটা পাওয়া যায়নি</TableCell></TableRow>
                  ) : orders.map((order, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        <div>{order.customer_name}</div>
                        <div className="text-xs text-slate-500">{order.phone}</div>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="font-semibold">৳{order.total}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===================== TAB 2: CREATE ORDER ===================== */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>নতুন ম্যানুয়াল অর্ডার</CardTitle>
              <CardDescription>এই অর্ডারটি মেইন ওয়েবসাইটে যাবে না, সরাসরি এখান থেকে কুরিয়ারে যাবে।</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div className="space-y-4 border-r md:pr-8">
                  <h3 className="font-semibold flex items-center gap-2 border-b pb-2"><User className="h-4 w-4 text-blue-500" /> কাস্টমার তথ্য</h3>
                  
                  <div className="space-y-2">
                    <Label>কাস্টমারের নাম *</Label>
                    <Input placeholder="যেমন: রাকিব হাসান" value={newOrder.customer_name} onChange={e => setNewOrder({...newOrder, customer_name: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>মোবাইল নাম্বার *</Label>
                    <Input placeholder="01XXXXXXXXX" value={newOrder.phone} onChange={e => setNewOrder({...newOrder, phone: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>সম্পূর্ণ ঠিকানা *</Label>
                    <Input placeholder="বাড়ি নং, রাস্তা, এলাকা" value={newOrder.address} onChange={e => setNewOrder({...newOrder, address: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>জেলা / শহর</Label>
                    <Input placeholder="ঢাকা" value={newOrder.district} onChange={e => setNewOrder({...newOrder, district: e.target.value})} />
                  </div>
                </div>

                {/* Product & Courier Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 border-b pb-2"><Package className="h-4 w-4 text-purple-500" /> প্রোডাক্ট ও কুরিয়ার</h3>
                  
                  <div className="space-y-2">
                    <Label>প্রোডাক্টের নাম *</Label>
                    <Input placeholder="যেমন: Exclusive Panjabi" value={newOrder.product_name} onChange={e => setNewOrder({...newOrder, product_name: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>পরিমাণ (Quantity)</Label>
                      <Input type="number" min="1" value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>দাম (প্রতি পিস) *</Label>
                      <Input type="number" placeholder="৳" value={newOrder.price || ""} onChange={e => setNewOrder({...newOrder, price: Number(e.target.value)})} />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label>কুরিয়ার সার্ভিস</Label>
                    <Select value={newOrder.courier_name} onValueChange={(v: string | null) => setNewOrder({...newOrder, courier_name: v || "steadfast"})}>
                      <SelectTrigger>
                        <SelectValue placeholder="কুরিয়ার সিলেক্ট করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="steadfast">Steadfast Courier</SelectItem>
                        <SelectItem value="pathao">Pathao Courier</SelectItem>
                        <SelectItem value="redx">RedX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-6 bg-slate-50 p-4 rounded-lg border flex justify-between items-center">
                    <span className="font-medium text-slate-700">সর্বমোট বিল:</span>
                    <span className="text-2xl font-bold text-indigo-700">৳{newOrder.price * newOrder.quantity}</span>
                  </div>

                  <Button 
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-lg mt-4" 
                    onClick={handleCreateOrder}
                    disabled={isSubmitting || !newOrder.customer_name || !newOrder.phone || !newOrder.product_name || !newOrder.price}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" /> 
                    {isSubmitting ? "অর্ডার তৈরি হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
