from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import httpx
from routers.settings import get_current_settings

router = APIRouter()

class LeadData(BaseModel):
    name: str
    phone: str
    source: str # e.g., "instagram", "ecommerce_website"
    notes: str = ""

# ইন-মেমোরি লিড ডাটাবেজ
leads_db = []

@router.post("/trigger-scraping", summary="অটোমেশন দিয়ে লিড স্ক্র্যাপিং ট্রিগার করুন")
async def trigger_n8n_scraping(target_platform: str, keyword: str, automation_tool: str = "n8n"):
    """
    এই এন্ডপয়েন্টটি আপনার n8n/Make/Zapier এর ওয়েবহুকে রিকোয়েস্ট পাঠাবে 
    যাতে তারা অটোমেটিকভাবে ফেসবুক বা গুগল ম্যাপ থেকে লিড স্ক্র্যাপ করে নিয়ে আসে।
    """
    settings = get_current_settings()
    webhook_url = ""
    
    if automation_tool == "n8n":
        webhook_url = settings.get("n8n_webhook_url", "")
    elif automation_tool == "make":
        webhook_url = settings.get("make_webhook_url", "")
    elif automation_tool == "zapier":
        webhook_url = settings.get("zapier_webhook_url", "")
        
    if not webhook_url:
        return {
            "status": "error",
            "message": f"{automation_tool} এর Webhook URL সেটিংসে দেওয়া নেই! দয়া করে ড্যাশবোর্ড থেকে Settings আপডেট করুন।"
        }
    
    # In a real scenario, you would do:
    # async with httpx.AsyncClient() as client:
    #     await client.post(webhook_url, json={"platform": target_platform, "keyword": keyword})
    
    # আপাতত mock response:
    return {
        "status": "success", 
        "message": f"{automation_tool.capitalize()} কে সিগন্যাল পাঠানো হয়েছে (Webhook: {webhook_url[:25]}...)! সে {target_platform} থেকে '{keyword}' লিখে লিড খুঁজছে..."
    }

@router.post("/save", summary="নতুন সংগৃহীত লিড সেভ করুন")
async def save_leads(leads: List[LeadData]):
    """
    n8n যখন লিড সংগ্রহ শেষ করবে, তখন সে এই এন্ডপয়েন্টে ডাটা পাঠিয়ে দিবে। 
    এখান থেকে লিডগুলো ডাটাবেজে সেভ হবে এবং নাম্বারগুলো Number Checker-এ চলে যাবে।
    """
    leads_db.extend(leads)
    
    return {
        "status": "success",
        "message": f"{len(leads)} টি নতুন লিড ডাটাবেজে যুক্ত হয়েছে।",
        "total_leads_now": len(leads_db)
    }

@router.get("/list", summary="সব লিড দেখুন")
async def get_all_leads():
    return leads_db
