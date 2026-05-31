from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from routers.settings import get_current_settings

router = APIRouter()

class ContentRequest(BaseModel):
    product_name: str
    product_price: float
    provider: str = "openai"
    content_type: str # "sales_copy", "facebook_ad", "hacking_content"
    audience: str = "সাধারণ কাস্টমার"

@router.post("/generate", summary="কন্টেন্ট তৈরি করুন (AI Writer)")
async def generate_content(request: ContentRequest):
    """
    প্রোডাক্টের ডাটাবেজ থেকে তথ্য নিয়ে AI (যেমন: GPT-4/Claude/Gemini/Groq) 
    অত্যন্ত আকর্ষণীয় সেলস কপি বা হ্যাকিং কন্টেন্ট লিখে দিবে।
    """
    settings = get_current_settings()
    # AI System Prompt Logic (আপনার Bondhumart PHP কোডের মতো)
    system_prompt = f"""
    You are an elite Bangladeshi e-commerce copywriter. Write a highly persuasive {request.content_type} in Bengali.
    Product: {request.product_name}
    Price: ৳{request.product_price}
    Target Audience: {request.audience}
    
    Make it engaging, use emojis, and focus on customer psychology (hacking content).
    """
    
    # Dynamic Provider Logic
    if request.provider == "openai":
        api_key = settings.get("openai_api_key", "")
        if not api_key: raise HTTPException(status_code=400, detail="OpenAI API Key সেট করা নেই!")
        provider_name = "ChatGPT (OpenAI)"
    elif request.provider == "anthropic":
        api_key = settings.get("anthropic_api_key", "")
        if not api_key: raise HTTPException(status_code=400, detail="Anthropic API Key সেট করা নেই!")
        provider_name = "Claude 3.5 (Anthropic)"
    elif request.provider == "gemini":
        api_key = settings.get("gemini_api_key", "")
        if not api_key: raise HTTPException(status_code=400, detail="Gemini API Key সেট করা নেই!")
        provider_name = "Google Gemini"
    elif request.provider == "groq":
        api_key = settings.get("groq_api_key", "")
        if not api_key: raise HTTPException(status_code=400, detail="Groq API Key সেট করা নেই!")
        provider_name = "Groq"
    elif request.provider == "deepseek":
        api_key = settings.get("deepseek_api_key", "")
        if not api_key: raise HTTPException(status_code=400, detail="DeepSeek API Key সেট করা নেই!")
        provider_name = "DeepSeek AI"
    else:
        raise HTTPException(status_code=400, detail="অবৈধ AI প্রোভাইডার!")
    
    # এখানে আমরা সিলেক্টেড প্রোভাইডারের API কল করবো।
    # আপাতত একটি mock response দিচ্ছি
    
    mock_response = f"[{provider_name} দ্বারা লিখিত]\n🔥 অবিশ্বাস্য অফার! {request.product_name} এখন পাচ্ছেন মাত্র ৳{request.product_price} টাকায়! 😱 স্টক ফুরিয়ে যাওয়ার আগেই অর্ডার করুন!"
    
    return {
        "status": "success",
        "provider": provider_name,
        "content": mock_response
    }
