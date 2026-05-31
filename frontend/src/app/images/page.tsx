"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Sparkles, Loader2, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ImageAIPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{image_url: string, prompt_used: string} | null>(null);
  const [formData, setFormData] = useState({
    product_name: "",
    prompt: "",
    style: "realistic"
  });

  const generateImage = async () => {
    if (!formData.prompt) {
      alert("দয়া করে ইমেজের বর্ণনা লিখুন!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.status === "success") {
        setResult(data);
      } else {
        alert("ইমেজ জেনারেট করতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      alert("সার্ভার এরর! Backend রান করা আছে কিনা চেক করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ImageIcon className="text-emerald-500" /> AI ইমেজ স্টুডিও (Gemini Powered)
        </h1>
        <p className="text-muted-foreground mt-2">
          Gemini AI ব্যবহার করে আপনার প্রোডাক্টের জন্য দারুণ সব ইমেজ এবং অ্যাড ক্রিয়েটিভ (Ad Creatives) তৈরি করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>ইমেজ প্রম্পট</CardTitle>
            <CardDescription>কেমন ইমেজ চান সেটি লিখুন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>প্রোডাক্টের নাম (অপশনাল)</Label>
              <Input 
                placeholder="যেমন: Smart Watch" 
                value={formData.product_name}
                onChange={(e) => setFormData({...formData, product_name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>ইমেজের বর্ণনা *</Label>
              <Textarea 
                placeholder="একটি ছেলে পাহাড়ের উপর দাঁড়িয়ে ঘড়িটি দেখছে..." 
                className="h-[120px] resize-none"
                value={formData.prompt}
                onChange={(e) => setFormData({...formData, prompt: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>ইমেজের স্টাইল</Label>
              <Select value={formData.style} onValueChange={(val) => setFormData({...formData, style: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="সিলেক্ট করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic Photography</SelectItem>
                  <SelectItem value="cinematic">Cinematic Lighting</SelectItem>
                  <SelectItem value="3d_render">3D Product Render</SelectItem>
                  <SelectItem value="illustration">Digital Illustration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2" 
              onClick={generateImage}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "জেনারেট হচ্ছে..." : "ইমেজ জেনারেট করুন"}
            </Button>
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card className="shadow-sm bg-slate-50 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-emerald-500" /> আউটপুট
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[350px]">
            {result ? (
              <div className="space-y-4 w-full text-center">
                <div className="rounded-lg overflow-hidden border shadow-sm mx-auto max-w-sm">
                  <img src={result.image_url} alt="Generated AI" className="w-full h-auto object-cover" />
                </div>
                <p className="text-xs text-muted-foreground bg-white p-2 border rounded text-left">
                  <span className="font-semibold text-slate-700">Gemini Prompt: </span> 
                  {result.prompt_used}
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" /> ডাউনলোড করুন
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 text-center">
                <Sparkles className="h-10 w-10 mb-4 opacity-20" />
                <p>Gemini ম্যাজিক দেখার জন্য বাম পাশে প্রম্পট দিন</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
