"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenTool, Sparkles, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContentPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    product_name: "",
    product_price: "",
    provider: "openai",
    content_type: "sales_copy",
    audience: "সাধারণ কাস্টমার"
  });

  const generateContent = async () => {
    if (!formData.product_name || !formData.product_price) {
      alert("দয়া করে প্রোডাক্টের নাম ও দাম লিখুন!");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      // Backend (FastAPI) API call
      const res = await fetch("http://127.0.0.1:8000/api/v1/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: formData.product_name,
          product_price: parseFloat(formData.product_price),
          provider: formData.provider,
          content_type: formData.content_type,
          audience: formData.audience
        })
      });

      const data = await res.json();
      if (data.status === "success") {
        setResult(data.content);
      } else {
        setResult("⚠️ কন্টেন্ট জেনারেট করতে সমস্যা হয়েছে!");
      }
    } catch (error) {
      setResult("⚠️ সার্ভার এরর! নিশ্চিত করুন আপনার Python (FastAPI) ব্যাকএন্ড রান করা আছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <PenTool className="text-orange-500" /> AI কন্টেন্ট রাইটার
        </h1>
        <p className="text-muted-foreground mt-2">
          ChatGPT, Claude, Gemini বা Groq ব্যবহার করে নিমিষেই হাই-কনভার্টিং সেলস কপি এবং কাস্টমার হ্যাকিং কন্টেন্ট জেনারেট করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>প্রোডাক্টের তথ্য</CardTitle>
            <CardDescription>AI-কে আপনার প্রোডাক্ট সম্পর্কে ধারণা দিন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>প্রোডাক্টের নাম</Label>
              <Input 
                placeholder="যেমন: Cool Sleeping Spray" 
                value={formData.product_name}
                onChange={(e) => setFormData({...formData, product_name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>দাম (৳)</Label>
              <Input 
                type="number" 
                placeholder="যেমন: 790" 
                value={formData.product_price}
                onChange={(e) => setFormData({...formData, product_price: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>AI প্রোভাইডার</Label>
                <Select value={formData.provider} onValueChange={(val) => setFormData({...formData, provider: val})}>
                  <SelectTrigger className="border-orange-200 bg-orange-50/50">
                    <SelectValue placeholder="সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
                    <SelectItem value="anthropic">Anthropic (Claude 3.5)</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="groq">Groq (Superfast)</SelectItem>
                    <SelectItem value="deepseek">DeepSeek AI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>কন্টেন্টের ধরন</Label>
                <Select value={formData.content_type} onValueChange={(val) => setFormData({...formData, content_type: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales_copy">আকর্ষণীয় সেলস কপি</SelectItem>
                    <SelectItem value="hacking_content">হ্যাকিং কন্টেন্ট</SelectItem>
                    <SelectItem value="facebook_ad">ফেসবুক অ্যাড ক্যাপশন</SelectItem>
                    <SelectItem value="video_script">ভিডিও স্ক্রিপ্ট</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>টার্গেট অডিয়েন্স</Label>
              <Input 
                placeholder="যেমন: যাদের রাতে ঘুম আসে না" 
                value={formData.audience}
                onChange={(e) => setFormData({...formData, audience: e.target.value})}
              />
            </div>

            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700" 
              onClick={generateContent}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "জেনারেট হচ্ছে..." : "ম্যাজিক কন্টেন্ট তৈরি করুন"}
            </Button>
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card className="shadow-sm bg-slate-900 text-slate-50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" /> AI জেনারেটেড কন্টেন্ট
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="relative">
                <Textarea 
                  className="min-h-[350px] bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400 resize-none" 
                  value={result}
                  readOnly
                />
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute top-2 right-2 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    alert("কপি করা হয়েছে!");
                  }}
                >
                  Copy
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[350px] border border-dashed border-slate-700 rounded-lg text-slate-500">
                <PenTool className="h-10 w-10 mb-2 opacity-20" />
                <p>এখানে আপনার আকর্ষণীয় কন্টেন্ট দেখা যাবে...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
