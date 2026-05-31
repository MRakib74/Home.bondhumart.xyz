"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Video, Play, Loader2, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VideoAIPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{status: string, message: string, provider_used?: string, mock_video_id?: string} | null>(null);
  
  const [formData, setFormData] = useState({
    script: "",
    provider: "heygen",
    avatar_id: "default_bondhumart_avatar",
    voice_id: "bangla_male_1",
    background: "green_screen"
  });

  const generateVideo = async () => {
    if (formData.script.length < 10) {
      alert("ভিডিওর স্ক্রিপ্ট অনেক ছোট! দয়া করে বিস্তারিত লিখুন।");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ status: "error", message: "সার্ভার কানেকশন ফেইল্ড! Backend রান করা আছে কিনা চেক করুন।" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Video className="text-purple-500" /> AI ভিডিও স্টুডিও
        </h1>
        <p className="text-muted-foreground mt-2">
          HeyGen বা D-ID এপিআই ব্যবহার করে টেক্সট (স্ক্রিপ্ট) থেকে সরাসরি হাই-কোয়ালিটি সেলস ভিডিও তৈরি করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Form */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>ভিডিও সেটিংস</CardTitle>
            <CardDescription>আপনার ভিডিওর স্ক্রিপ্ট এবং এভাটার সেট করুন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ভিডিওর স্ক্রিপ্ট (বাংলায়)</Label>
              <Textarea 
                placeholder="হ্যালো ভাইয়া! আপনার রাতের ঘুম কি ঠিকমতো হচ্ছে না? আমাদের কাছে আছে চমৎকার সমাধান..." 
                className="h-[150px] resize-none"
                value={formData.script}
                onChange={(e) => setFormData({...formData, script: e.target.value})}
              />
              <p className="text-xs text-muted-foreground flex justify-between">
                <span>ন্যূনতম ১০ অক্ষর</span>
                <span>{formData.script.length} অক্ষর</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>AI প্রোভাইডার</Label>
                <Select value={formData.provider} onValueChange={(val) => setFormData({...formData, provider: val})}>
                  <SelectTrigger className="border-purple-300 bg-purple-50">
                    <SelectValue placeholder="সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heygen">HeyGen (Recommended)</SelectItem>
                    <SelectItem value="did">D-ID (Alternative 1)</SelectItem>
                    <SelectItem value="synthesia">Synthesia (Alternative 2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>AI এভাটার (Avatar)</Label>
                <Select value={formData.avatar_id} onValueChange={(val) => setFormData({...formData, avatar_id: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default_bondhumart_avatar">Bondhumart Default</SelectItem>
                    <SelectItem value="male_professional">Male Professional</SelectItem>
                    <SelectItem value="female_casual">Female Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>AI ভয়েস (Voice)</Label>
                <Select value={formData.voice_id} onValueChange={(val) => setFormData({...formData, voice_id: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bangla_male_1">Bangla Male 1</SelectItem>
                    <SelectItem value="bangla_female_1">Bangla Female 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>ব্যাকগ্রাউন্ড</Label>
              <Select value={formData.background} onValueChange={(val) => setFormData({...formData, background: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="সিলেক্ট করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="green_screen">Green Screen (এডিট করার জন্য)</SelectItem>
                  <SelectItem value="white_solid">White Solid</SelectItem>
                  <SelectItem value="office_bg">Office Background</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700" 
              onClick={generateVideo}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              {loading ? "রেন্ডারিং হচ্ছে..." : "ভিডিও রেন্ডার করুন"}
            </Button>
          </CardContent>
        </Card>

        {/* Video Preview */}
        <Card className="shadow-sm bg-slate-900 border-slate-800 text-slate-100 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-400" /> আউটপুট প্রিভিউ
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {result ? (
              <div className="text-center space-y-4 w-full">
                <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 mx-auto aspect-video flex flex-col items-center justify-center">
                  {result.status === "processing" ? (
                    <>
                      <Loader2 className="h-10 w-10 animate-spin text-purple-400 mb-4" />
                      <p className="text-lg font-medium">{result.message}</p>
                      <p className="text-sm text-slate-400 mt-2">Provider: <span className="font-bold text-white capitalize">{result.provider_used}</span></p>
                      <p className="text-sm text-slate-500 mt-1">API তে রিকোয়েস্ট পাঠানো হয়েছে (ID: {result.mock_video_id})</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-10 w-10 text-red-400 mb-4" />
                      <p className="text-lg font-medium">{result.message}</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-slate-700 rounded-lg text-slate-500 p-8 text-center aspect-video">
                <Video className="h-12 w-12 mb-4 opacity-20" />
                <p>ভিডিও রেন্ডার হওয়ার পর এখানে দেখতে পাবেন</p>
                <p className="text-xs mt-2 text-slate-600">MP4 ফরম্যাটে ডাউনলোড করা যাবে</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
