"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Save, Image as ImageIcon, Shield, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [formData, setFormData] = useState({
    admin_name: "",
    admin_email: "",
    admin_password: "",
    admin_logo: "",
    admin_profile_pic: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/settings/");
        const data = await res.json();
        // Since settings endpoint returns all settings, we just spread it
        // We only care about the admin fields here, but we must send all fields back when saving
        // So we need to store the full config in a variable or just fetch/send.
        // For simplicity, we'll maintain the full object but only render admin inputs.
        setFormData(data);
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setLoading(true);
    setSuccessMsg("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.status === "success") {
        setSuccessMsg("অ্যাডমিন প্রোফাইল সফলভাবে আপডেট হয়েছে! ড্যাশবোর্ডে পরিবর্তন দেখতে পেজটি রিলোড দিন।");
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch (error) {
      alert("সার্ভার কানেকশন ফেইল্ড!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center items-center h-[50vh]"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <User className="text-indigo-600" /> অ্যাডমিন প্যানেল ও প্রোফাইল
        </h1>
        <p className="text-muted-foreground mt-2">
          আপনার কমান্ড সেন্টারের নাম, লোগো, প্রোফাইল পিকচার এবং লগইন ইনফরমেশন এখান থেকে সেট করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Previews */}
        <div className="space-y-6 md:col-span-1">
          <Card className="shadow-sm border-indigo-100 bg-indigo-50/30">
            <CardHeader>
              <CardTitle className="text-lg">প্রোফাইল প্রিভিউ</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-slate-200 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                {formData.admin_profile_pic ? (
                  <img src={formData.admin_profile_pic} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-slate-400" />
                )}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{formData.admin_name || "Admin Name"}</h3>
                <p className="text-sm text-muted-foreground">{formData.admin_email || "admin@example.com"}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">ব্র্যান্ড লোগো</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-32">
              {formData.admin_logo ? (
                <img src={formData.admin_logo} alt="Logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                  <span className="text-xs">লোগো সেট করা নেই</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="space-y-6 md:col-span-2">
          {/* Personal Info */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-700" /> লগইন ও সাধারণ তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>অ্যাডমিনের নাম</Label>
                <Input 
                  placeholder="যেমন: Rakib Raja" 
                  value={formData.admin_name || ""}
                  onChange={(e) => setFormData({...formData, admin_name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>লগইন ইমেইল</Label>
                  <Input 
                    type="email"
                    placeholder="admin@bondhumart.com" 
                    value={formData.admin_email || ""}
                    onChange={(e) => setFormData({...formData, admin_email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>পাসওয়ার্ড</Label>
                  <Input 
                    type="password"
                    placeholder="নতুন পাসওয়ার্ড দিন" 
                    value={formData.admin_password || ""}
                    onChange={(e) => setFormData({...formData, admin_password: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branding Info */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-slate-700" /> ব্র্যান্ডিং এবং ছবি
              </CardTitle>
              <CardDescription>ছবি বা লোগোর ডাইরেক্ট লিংক (URL) দিন</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>প্রোফাইল পিকচার লিংক (URL)</Label>
                <Input 
                  placeholder="https://example.com/my-photo.jpg" 
                  value={formData.admin_profile_pic || ""}
                  onChange={(e) => setFormData({...formData, admin_profile_pic: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>কোম্পানির লোগো লিংক (URL)</Label>
                <Input 
                  placeholder="https://example.com/logo.png" 
                  value={formData.admin_logo || ""}
                  onChange={(e) => setFormData({...formData, admin_logo: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex flex-col gap-2">
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg" 
              onClick={saveSettings}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              {loading ? "আপডেট হচ্ছে..." : "প্রোফাইল সেভ করুন"}
            </Button>

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 flex items-center justify-center gap-2 mt-2 font-medium">
                <CheckCircle2 className="h-5 w-5" /> {successMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
