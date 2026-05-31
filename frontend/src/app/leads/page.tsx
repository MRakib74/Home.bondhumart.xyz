"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Loader2, Workflow, Database, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LeadsPage() {
  const [loading, setLoading] = useState(false);
  const [triggerMsg, setTriggerMsg] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  
  const [scrapeData, setScrapeData] = useState({
    platform: "facebook_pages",
    keyword: "",
    automation_tool: "n8n"
  });

  // লিড লিস্ট ফ্যাচ করার ফাংশন
  const fetchLeads = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/leads/list");
      const data = await res.json();
      setLeads(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const triggerScraping = async () => {
    if (!scrapeData.keyword) {
      alert("কীওয়ার্ড লিখুন!");
      return;
    }

    setLoading(true);
    setTriggerMsg("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/leads/trigger-scraping?target_platform=${scrapeData.platform}&keyword=${scrapeData.keyword}&automation_tool=${scrapeData.automation_tool}`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.status === "success") {
        setTriggerMsg(data.message);
      }
    } catch (error) {
      setTriggerMsg("সার্ভার এরর! Backend রান করা আছে কিনা চেক করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="text-pink-500" /> লিড কালেকশন সেন্টার
          </h1>
          <p className="text-muted-foreground mt-2">
            n8n, Make.com বা Zapier অটোমেশন ব্যবহার করে ইন্টারনেট থেকে স্বয়ংক্রিয়ভাবে লিড সংগ্রহ করুন।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trigger Scraping */}
        <Card className="shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-pink-500" /> n8n স্ক্র্যাপার ট্রিগার
            </CardTitle>
            <CardDescription>বটকে বলুন কোথা থেকে লিড আনবে</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>অটোমেশন টুল</Label>
                <Select value={scrapeData.automation_tool} onValueChange={(val) => setScrapeData({...scrapeData, automation_tool: val})}>
                  <SelectTrigger className="border-pink-200 bg-pink-50/50">
                    <SelectValue placeholder="সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="n8n">n8n (Recommended)</SelectItem>
                    <SelectItem value="make">Make.com</SelectItem>
                    <SelectItem value="zapier">Zapier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>টার্গেট প্ল্যাটফর্ম</Label>
                <Select value={scrapeData.platform} onValueChange={(val) => setScrapeData({...scrapeData, platform: val})}>
                  <SelectTrigger>
                    <SelectValue placeholder="সিলেক্ট করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook_pages">Facebook Pages</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="google_maps">Google Maps</SelectItem>
                    <SelectItem value="website_no_pixel">ই-কমার্স (Pixel ছাড়া)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>কীওয়ার্ড বা নিস (Niche)</Label>
              <Input 
                placeholder="যেমন: Clothing Brand BD" 
                value={scrapeData.keyword}
                onChange={(e) => setScrapeData({...scrapeData, keyword: e.target.value})}
              />
            </div>

            {triggerMsg && (
              <div className="p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200 text-sm">
                {triggerMsg}
              </div>
            )}

            <Button 
              className="w-full bg-slate-900 text-white" 
              onClick={triggerScraping}
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {loading ? "সিগন্যাল পাঠানো হচ্ছে..." : "স্ক্র্যাপিং শুরু করুন"}
            </Button>
          </CardContent>
        </Card>

        {/* Lead Database Table */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-slate-700" /> সংগৃহীত লিডস ডাটাবেজ
              </CardTitle>
              <CardDescription className="mt-1">n8n যে লিডগুলো পাঠিয়েছে</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchLeads}>
              <RotateCcw className="h-4 w-4 mr-2" /> রিফ্রেশ
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md mt-4 max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-slate-50 sticky top-0">
                  <TableRow>
                    <TableHead>নাম / পেজ</TableHead>
                    <TableHead>ফোন নাম্বার</TableHead>
                    <TableHead>সোর্স</TableHead>
                    <TableHead className="text-right">একশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                        কোনো লিড পাওয়া যায়নি। বাম পাশ থেকে স্ক্র্যাপিং ট্রিগার করুন।
                      </TableCell>
                    </TableRow>
                  ) : leads.map((lead, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell className="capitalize">{lead.source.replace('_', ' ')}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900">
                           অ্যাড টু ব্রডকাস্ট
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {leads.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                  <Download className="mr-2 h-4 w-4" /> CSV হিসেবে এক্সপোর্ট করুন
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// Add RotateCcw import
import { RotateCcw } from "lucide-react";
