"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Package, Save, CheckCircle2, Loader2, Database } from "lucide-react";

export default function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offer_price: "",
    delivery_charge_inside_dhaka: "80",
    delivery_charge_outside_dhaka: "130",
    target_audience: ""
  });

  const saveProduct = async () => {
    if (!formData.name || !formData.price || !formData.description) {
      alert("নাম, দাম এবং বিবরণ অবশ্যই দিতে হবে!");
      return;
    }

    setLoading(true);
    setSuccessMsg("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        offer_price: formData.offer_price ? parseFloat(formData.offer_price) : null,
        delivery_charge_inside_dhaka: parseFloat(formData.delivery_charge_inside_dhaka),
        delivery_charge_outside_dhaka: parseFloat(formData.delivery_charge_outside_dhaka),
        target_audience: formData.target_audience
      };

      const res = await fetch("http://127.0.0.1:8000/api/v1/products/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.id) {
        setSuccessMsg(`"${data.name}" সফলভাবে এআই ডাটাবেজে সেভ হয়েছে!`);
        setFormData({
          name: "", description: "", price: "", offer_price: "",
          delivery_charge_inside_dhaka: "80", delivery_charge_outside_dhaka: "130", target_audience: ""
        });
      }
    } catch (error) {
      alert("সার্ভার কানেকশন ফেইল্ড! Backend রান করা আছে কিনা চেক করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Database className="text-emerald-500" /> এআই প্রোডাক্ট নলেজবেস
        </h1>
        <p className="text-muted-foreground mt-2">
          নতুন প্রোডাক্টের তথ্য দিন, যাতে এআই পরবর্তীতে কন্টেন্ট লেখা বা কাস্টমারের সাথে কথা বলার সময় এটি ব্যবহার করতে পারে।
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" /> নতুন প্রোডাক্ট এন্ট্রি
          </CardTitle>
          <CardDescription>আপনার প্রোডাক্টের বিস্তারিত তথ্য এখানে লিখুন</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label>প্রোডাক্টের নাম *</Label>
            <Input 
              placeholder="যেমন: Magic Hair Oil" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>বিস্তারিত বিবরণ *</Label>
            <Textarea 
              placeholder="এই তেলের কাজ কি, কিভাবে ব্যবহার করতে হয়..." 
              className="h-[100px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>রেগুলার দাম (৳) *</Label>
              <Input 
                type="number" 
                placeholder="1000" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>অফার দাম (৳) (যদি থাকে)</Label>
              <Input 
                type="number" 
                placeholder="790" 
                value={formData.offer_price}
                onChange={(e) => setFormData({...formData, offer_price: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ডেলিভারি চার্জ (ঢাকা)</Label>
              <Input 
                type="number" 
                value={formData.delivery_charge_inside_dhaka}
                onChange={(e) => setFormData({...formData, delivery_charge_inside_dhaka: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>ডেলিভারি চার্জ (ঢাকার বাইরে)</Label>
              <Input 
                type="number" 
                value={formData.delivery_charge_outside_dhaka}
                onChange={(e) => setFormData({...formData, delivery_charge_outside_dhaka: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>টার্গেট অডিয়েন্স (AI এর সুবিধার জন্য)</Label>
            <Input 
              placeholder="যেমন: যাদের প্রচুর চুল পড়ছে" 
              value={formData.target_audience}
              onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
            />
          </div>

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> {successMsg}
            </div>
          )}

          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4" 
            onClick={saveProduct}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? "ডাটাবেজে সেভ হচ্ছে..." : "এআই নলেজবেসে সেভ করুন"}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
