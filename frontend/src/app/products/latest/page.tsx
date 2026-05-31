"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Package, RefreshCw, Box, Tag, DollarSign, Activity, Plus } from "lucide-react";

export default function LatestProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    buying_price: "",
    stock: "100",
    image_url: ""
  });
  const [isAdding, setIsAdding] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/live/products?limit=100");
      if (!res.ok) throw new Error("সার্ভার থেকে প্রোডাক্ট আনতে সমস্যা হয়েছে।");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if(!newProduct.name || !newProduct.price) return;
    setIsAdding(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/live/products/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          price: Number(newProduct.price),
          buying_price: Number(newProduct.buying_price || 0),
          stock: Number(newProduct.stock || 100),
          image_url: newProduct.image_url || null
        })
      });
      if(res.ok) {
        setIsDialogOpen(false);
        setNewProduct({ name: "", price: "", buying_price: "", stock: "100", image_url: "" });
        fetchProducts(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="text-blue-500" /> BondhuMart লাইভ প্রোডাক্টস
          </h1>
          <p className="text-muted-foreground mt-2">
            এই প্রোডাক্টগুলো সরাসরি আপনার মেইন সাইট (BondhuMart) থেকে রিয়েল-টাইমে আসছে। AI এই ডেটা ব্যবহার করে কাস্টমারদের রিপ্লাই দেবে।
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                <Plus className="h-4 w-4" /> নতুন প্রোডাক্ট এড করুন
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ম্যানুয়াল প্রোডাক্ট যোগ করুন</DialogTitle>
                <DialogDescription>
                  এই প্রোডাক্টটি BondhuMart-এ যাবে না, শুধু Command Center এবং AI-এর ব্যবহারের জন্য থাকবে।
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>প্রোডাক্টের নাম *</Label>
                  <Input 
                    placeholder="যেমন: Exclusive T-Shirt" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>বিক্রয় মূল্য (৳) *</Label>
                    <Input 
                      type="number" 
                      placeholder="500" 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>কেনা দাম (৳)</Label>
                    <Input 
                      type="number" 
                      placeholder="350" 
                      value={newProduct.buying_price}
                      onChange={(e) => setNewProduct({...newProduct, buying_price: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>স্টক পরিমাণ</Label>
                    <Input 
                      type="number" 
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ছবির লিংক (URL)</Label>
                    <Input 
                      placeholder="https://..." 
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>ক্যান্সেল</Button>
                <Button onClick={handleAddProduct} disabled={isAdding || !newProduct.name || !newProduct.price}>
                  {isAdding ? "অ্যাড হচ্ছে..." : "অ্যাড করুন"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={fetchProducts} disabled={loading} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "রিফ্রেশ হচ্ছে..." : "রিফ্রেশ করুন"}
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{error}</p>
            <p className="text-red-500 text-center text-sm mt-2">BondhuMart Database কানেকশন ঠিক আছে কিনা চেক করুন (.env ফাইল)।</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading && products.length === 0 ? (
            Array(8).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-slate-200 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 border-2 border-dashed rounded-lg">
              <Box className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
            </div>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {/* ইমেজ প্লেসহোল্ডার (পরে আসল ইমেজ URL বসানো যাবে) */}
                <div className="h-40 bg-slate-100 flex items-center justify-center border-b relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="object-cover h-full w-full" />
                  ) : (
                    <Package className="h-12 w-12 text-slate-300" />
                  )}
                  {product.status === 'active' ? (
                    <Badge className="absolute top-2 right-2 bg-green-500">Active</Badge>
                  ) : (
                    <Badge variant="destructive" className="absolute top-2 right-2">Inactive</Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2 min-h-[56px] leading-tight mb-2">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-2 mt-4 text-sm">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-green-600"/> বিক্রয় মূল্য:</span>
                      <span className="font-bold text-lg text-slate-900">৳{product.price}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1"><Tag className="h-4 w-4"/> কেনা দাম:</span>
                      <span>৳{product.buying_price}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1"><Activity className="h-4 w-4 text-blue-500"/> প্রফিট:</span>
                      <span className="text-green-600 font-medium">৳{product.profit_margin}</span>
                    </div>
                  </div>
                </CardContent>
                
                <div className="bg-slate-50 p-3 border-t text-xs flex justify-between items-center text-slate-500">
                  <span>স্টক: <strong className={product.stock <= (product.low_stock_threshold || 5) ? "text-red-500" : "text-green-600"}>{product.stock} পিস</strong></span>
                  <div className="flex gap-2 items-center">
                    {product.is_custom && <Badge variant="outline" className="text-[10px] h-5">Custom (CC)</Badge>}
                    <span>ID: {product.id}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
