from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from routers.settings import get_current_settings

router = APIRouter()

class VideoRequest(BaseModel):
    script: str
    provider: str = "heygen" # "heygen", "did", "synthesia"
    avatar_id: str = "default_bondhumart_avatar"
    voice_id: str = "bangla_male_1"
    background: str = "green_screen"

@router.post("/generate", summary="AI ভিডিও জেনারেট করুন (মাল্টি-প্রোভাইডার)")
async def generate_video(request: VideoRequest):
    """
    HeyGen, D-ID, বা Synthesia API ব্যবহার করে কন্টেন্টের স্ক্রিপ্ট দিয়ে নিখুঁত ভিডিও জেনারেট করবে।
    """
    settings = get_current_settings()
    
    if len(request.script) < 10:
        raise HTTPException(status_code=400, detail="ভিডিওর স্ক্রিপ্ট অনেক ছোট! অন্তত ১০ অক্ষরের হতে হবে।")

    # Provider specific API logic
    if request.provider == "heygen":
        api_key = settings.get("heygen_api_key", "")
        if not api_key:
            raise HTTPException(status_code=400, detail="HeyGen API Key সেটিংসে বসানো নেই!")
        # HeyGen Logic Here
        message = "HeyGen দিয়ে ভিডিও রেন্ডারিং শুরু হয়েছে।"
        
    elif request.provider == "did":
        api_key = settings.get("did_api_key", "")
        if not api_key:
            raise HTTPException(status_code=400, detail="D-ID API Key সেটিংসে বসানো নেই!")
        # D-ID Logic Here
        message = "D-ID দিয়ে ভিডিও রেন্ডারিং শুরু হয়েছে।"
        
    elif request.provider == "synthesia":
        api_key = settings.get("synthesia_api_key", "")
        if not api_key:
            raise HTTPException(status_code=400, detail="Synthesia API Key সেটিংসে বসানো নেই!")
        # Synthesia Logic Here
        message = "Synthesia দিয়ে ভিডিও রেন্ডারিং শুরু হয়েছে।"
    
    else:
        raise HTTPException(status_code=400, detail="অবৈধ ভিডিও প্রোভাইডার!")
    
    # আপাতত Mock Response
    return {
        "status": "processing",
        "provider_used": request.provider,
        "message": message,
        "script_used": request.script[:50] + "...",
        "mock_video_id": f"{request.provider}_vid_abc123xyz"
    }
