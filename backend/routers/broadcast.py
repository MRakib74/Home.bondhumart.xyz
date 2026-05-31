from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import httpx
from routers.settings import get_current_settings

router = APIRouter()

class BroadcastRequest(BaseModel):
    target_segment: str # e.g., "all_customers", "inactive_30_days"
    message_content: str
    platform: str = "whatsapp" # "whatsapp", "sms", "email"

@router.post("/send", summary="মাল্টি-চ্যানেল ব্রডকাস্ট (WhatsApp/SMS/Email)")
async def send_broadcast(request: BroadcastRequest):
    """
    Evolution API দিয়ে WhatsApp, SMS Gateway দিয়ে SMS, বা SMTP দিয়ে Email ব্রডকাস্ট করবে।
    """
    settings = get_current_settings()
    
    if request.platform == "whatsapp":
        api_key = settings.get("evolution_api_key", "")
        if not api_key: raise HTTPException(status_code=400, detail="Evolution API Key সেটিংসে বসানো নেই!")
        success_msg = f"WhatsApp দিয়ে '{request.target_segment}' সেগমেন্টে মেসেজ পাঠানো শুরু হয়েছে।"
        
    elif request.platform == "sms":
        api_key = settings.get("sms_api_key", "")
        if not api_key: raise HTTPException(status_code=400, detail="SMS API Key সেটিংসে বসানো নেই!")
        success_msg = f"SMS এর মাধ্যমে '{request.target_segment}' সেগমেন্টে ব্রডকাস্ট পাঠানো শুরু হয়েছে।"
        
    elif request.platform == "email":
        api_email = settings.get("smtp_email", "")
        if not api_email: raise HTTPException(status_code=400, detail="SMTP Email সেটিংসে বসানো নেই!")
        success_msg = f"Email এর মাধ্যমে '{request.target_segment}' সেগমেন্টে মেইল পাঠানো শুরু হয়েছে।"
        
    else:
        raise HTTPException(status_code=400, detail="অবৈধ ব্রডকাস্ট মাধ্যম!")
    
    # এখানে রিয়েল API কল বসবে (Evolution / Twilio / SMTP)
    # আপাতত Mock Response
    return {
        "status": "success",
        "platform_used": request.platform,
        "message": success_msg,
        "preview": request.message_content[:50] + "..."
    }

@router.post("/check-numbers", summary="WhatsApp Number Checker")
async def check_whatsapp_numbers(phone_numbers: List[str]):
    """
    Evolution API এর মাধ্যমে চেক করবে কোন নাম্বারগুলোতে হোয়াটসঅ্যাপ আছে আর কোনগুলোতে নেই।
    """
    if not phone_numbers:
        raise HTTPException(status_code=400, detail="কোনো নাম্বার দেওয়া হয়নি!")

    sys_settings = get_current_settings()
    api_key = sys_settings.get("evolution_api_key", "")
    api_url = sys_settings.get("evolution_api_url", "https://ai-api.bondhumart.cloud").rstrip("/")
    instance = sys_settings.get("evolution_instance", "Bondhumart")

    if not api_key:
        raise HTTPException(status_code=400, detail="Evolution API Key সেটিংসে বসানো নেই!")

    results = {"has_whatsapp": [], "no_whatsapp": [], "errors": []}
    
    headers = {
        "apikey": api_key,
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        for number in phone_numbers:
            # Evolution API v2 - checkNumber endpoint
            url = f"{api_url}/chat/whatsappNumbers/{instance}"
            payload = {"numbers": [number]}
            
            try:
                response = await client.post(url, headers=headers, json=payload, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    # Evolution API রেসপন্স অনুযায়ী চেক করা
                    if isinstance(data, list) and len(data) > 0:
                        is_exists = data[0].get('exists', False)
                        if is_exists:
                            results["has_whatsapp"].append(number)
                        else:
                            results["no_whatsapp"].append(number)
                    else:
                        results["no_whatsapp"].append(number)
                else:
                    results["errors"].append({"number": number, "error": response.text})
            except Exception as e:
                results["errors"].append({"number": number, "error": str(e)})

    return {
        "message": f"চেকিং সম্পন্ন হয়েছে। {len(results['has_whatsapp'])} টি নাম্বারে হোয়াটসঅ্যাপ পাওয়া গেছে।",
        "data": results
    }
