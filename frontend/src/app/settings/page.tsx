"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Save, Key, Globe, Loader2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [formData, setFormData] = useState({
    evolution_api_url: "",
    evolution_api_key: "",
    evolution_instance: "",
    gemini_api_key: "",
    groq_api_key: "",
    openai_api_key: "",
    anthropic_api_key: "",
    deepseek_api_key: "",
    heygen_api_key: "",
    did_api_key: "",
    synthesia_api_key: "",
    n8n_webhook_url: "",
    make_webhook_url: "",
    zapier_webhook_url: "",
    sms_api_key: "",
    smtp_email: "",
    smtp_password: "",
    bondhumart_api_url: "",
    bondhumart_api_token: "",
    bondhumart_webhook_secret: ""
  });

  useEffect(() => {
    // লোড করার সময় ব্যাকএন্ড থেকে বর্তমান সেটিংস নিয়ে আসবে
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/settings/");
        const data = await res.json();
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
        setSuccessMsg(data.message);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (error) {
      alert("সার্ভার কানেকশন ফেইল্ড! Backend রান করা আছে কিনা চেক করুন।");
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
          <Settings className="text-slate-600" /> ডাইনামিক এপিআই সেটিংস
        </h1>
        <p className="text-muted-foreground mt-2">
          আপনার পুরো সিস্টেমের হার্ডকোডেড (Hardcoded) API Key গুলো এখান থেকে সরাসরি পরিবর্তন ও কন্ট্রোল করুন।
        </p>
      </div>

      <div className="space-y-6">
        {/* Evolution API Settings */}
        <Card className="shadow-sm border-blue-100">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Globe className="h-5 w-5" /> WhatsApp & Broadcast (Evolution API)
            </CardTitle>
            <CardDescription>আপনার নিজস্ব সার্ভারে থাকা WhatsApp API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Evolution API URL</Label>
              <Input 
                placeholder="https://ai-api.bondhumart.cloud" 
                value={formData.evolution_api_url}
                onChange={(e) => setFormData({...formData, evolution_api_url: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>API / Global Key</Label>
                <Input 
                  type="password"
                  placeholder="আপনার সিক্রেট কি" 
                  value={formData.evolution_api_key}
                  onChange={(e) => setFormData({...formData, evolution_api_key: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Instance Name (যেমন: Bondhumart)</Label>
                <Input 
                  placeholder="Bondhumart" 
                  value={formData.evolution_instance}
                  onChange={(e) => setFormData({...formData, evolution_instance: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Models API Settings */}
        <Card className="shadow-sm border-purple-100">
          <CardHeader className="bg-purple-50/50">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Key className="h-5 w-5" /> AI Content Models (Text & Logic)
            </CardTitle>
            <CardDescription>কন্টেন্ট লেখা এবং ইমেজ প্রম্পট জেনারেট করার জন্য এআই</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gemini API Key (Google)</Label>
                <Input 
                  type="password"
                  placeholder="AIzaSy..." 
                  value={formData.gemini_api_key}
                  onChange={(e) => setFormData({...formData, gemini_api_key: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Groq API Key (Superfast)</Label>
                <Input 
                  type="password"
                  placeholder="gsk_..." 
                  value={formData.groq_api_key}
                  onChange={(e) => setFormData({...formData, groq_api_key: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>OpenAI API Key (ChatGPT)</Label>
                <Input 
                  type="password"
                  placeholder="sk-..." 
                  value={formData.openai_api_key}
                  onChange={(e) => setFormData({...formData, openai_api_key: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Anthropic API Key (Claude)</Label>
                <Input 
                  type="password"
                  placeholder="sk-ant-..." 
                  value={formData.anthropic_api_key}
                  onChange={(e) => setFormData({...formData, anthropic_api_key: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>DeepSeek API Key (Cost Effective)</Label>
                <Input 
                  type="password"
                  placeholder="sk-..." 
                  value={formData.deepseek_api_key}
                  onChange={(e) => setFormData({...formData, deepseek_api_key: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video & Automation Settings */}
        <Card className="shadow-sm border-emerald-100">
          <CardHeader className="bg-emerald-50/50">
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Settings className="h-5 w-5" /> Video AI & Automation
            </CardTitle>
            <CardDescription>HeyGen, D-ID, Synthesia এবং n8n অটোমেশন কন্ট্রোল</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>HeyGen API Key</Label>
                <Input 
                  type="password"
                  placeholder="HeyGen Token" 
                  value={formData.heygen_api_key}
                  onChange={(e) => setFormData({...formData, heygen_api_key: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>D-ID API Key (বিকল্প)</Label>
                <Input 
                  type="password"
                  placeholder="D-ID Basic Token" 
                  value={formData.did_api_key}
                  onChange={(e) => setFormData({...formData, did_api_key: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Synthesia API Key (বিকল্প)</Label>
                <Input 
                  type="password"
                  placeholder="Synthesia Token" 
                  value={formData.synthesia_api_key}
                  onChange={(e) => setFormData({...formData, synthesia_api_key: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>n8n Webhook URL</Label>
                <Input 
                  placeholder="https://n8n.bondhumart.cloud/webhook/..." 
                  value={formData.n8n_webhook_url}
                  onChange={(e) => setFormData({...formData, n8n_webhook_url: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Make.com Webhook URL (বিকল্প)</Label>
                <Input 
                  placeholder="https://hook.make.com/..." 
                  value={formData.make_webhook_url}
                  onChange={(e) => setFormData({...formData, make_webhook_url: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Zapier Webhook URL (বিকল্প)</Label>
                <Input 
                  placeholder="https://hooks.zapier.com/..." 
                  value={formData.zapier_webhook_url}
                  onChange={(e) => setFormData({...formData, zapier_webhook_url: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMS & Email Settings */}
        <Card className="shadow-sm border-orange-100">
          <CardHeader className="bg-orange-50/50">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Globe className="h-5 w-5" /> SMS & Email Broadcast
            </CardTitle>
            <CardDescription>বিকল্প চ্যানেল হিসেবে SMS বা Email পাঠানোর সেটিংস</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>SMS API Key (Bulk SMS BD / Twilio)</Label>
              <Input 
                type="password"
                placeholder="SMS API Token" 
                value={formData.sms_api_key}
                onChange={(e) => setFormData({...formData, sms_api_key: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SMTP Email Address (যেমন: Google App Password)</Label>
                <Input 
                  placeholder="admin@bondhumart.com" 
                  value={formData.smtp_email}
                  onChange={(e) => setFormData({...formData, smtp_email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>SMTP Password</Label>
                <Input 
                  type="password"
                  placeholder="App Password" 
                  value={formData.smtp_password}
                  onChange={(e) => setFormData({...formData, smtp_password: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button 
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 px-8" 
            onClick={saveSettings}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {loading ? "সেভ হচ্ছে..." : "সব সেটিংস সেভ করুন"}
          </Button>

          {successMsg && (
            <span className="flex items-center text-emerald-600 font-medium text-sm">
              <CheckCircle2 className="mr-1 h-5 w-5" /> {successMsg}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
