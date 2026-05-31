from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

class SystemSettings(BaseModel):
    # Admin Panel Settings
    admin_name: str
    admin_email: str
    admin_password: str
    admin_logo: str
    admin_profile_pic: str
    
    # Bondhumart Connection
    bondhumart_api_url: str
    bondhumart_api_token: str
    bondhumart_webhook_secret: str

    # API Settings
    evolution_api_url: str
    evolution_instance: str
    gemini_api_key: str
    groq_api_key: str
    openai_api_key: str
    anthropic_api_key: str
    deepseek_api_key: str
    heygen_api_key: str
    did_api_key: str
    synthesia_api_key: str
    n8n_webhook_url: str
    make_webhook_url: str
    zapier_webhook_url: str
    sms_api_key: str
    smtp_email: str
    smtp_password: str

# ইন-মেমোরি সেটিংস ডাটাবেজ (পরে ডাটাবেজে স্টোর হবে)
current_settings = {
    "admin_name": "Admin",
    "admin_email": "admin@bondhumart.com",
    "admin_password": "",
    "admin_logo": "",
    "admin_profile_pic": "",
    # Bondhumart Connection
    "bondhumart_api_url": "https://bondhumart.com",
    "bondhumart_api_token": "",
    "bondhumart_webhook_secret": "",
    "evolution_api_url": "https://ai-api.bondhumart.cloud",
    "evolution_api_key": "",
    "evolution_instance": "Bondhumart",
    "gemini_api_key": "",
    "groq_api_key": "",
    "openai_api_key": "",
    "anthropic_api_key": "",
    "deepseek_api_key": "",
    "heygen_api_key": "",
    "did_api_key": "",
    "synthesia_api_key": "",
    "n8n_webhook_url": "",
    "make_webhook_url": "",
    "zapier_webhook_url": "",
    "sms_api_key": "",
    "smtp_email": "",
    "smtp_password": ""
}

@router.get("/", summary="সব API Keys এবং Settings দেখুন")
async def get_settings():
    """
    ড্যাশবোর্ডের সেটিংস পেজে দেখানোর জন্য বর্তমান API Keys রিটার্ন করবে।
    """
    return current_settings

@router.post("/update", summary="API Keys আপডেট করুন")
async def update_settings(settings: SystemSettings):
    """
    ড্যাশবোর্ড থেকে ডায়নামিকভাবে API Keys সেভ করবে।
    """
    global current_settings
    current_settings.update(settings.model_dump())
    return {"status": "success", "message": "সেটিংস সফলভাবে আপডেট হয়েছে!"}

def get_current_settings():
    return current_settings
