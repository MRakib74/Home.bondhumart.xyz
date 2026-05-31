from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from routers.settings import get_current_settings

router = APIRouter()

class ImageRequest(BaseModel):
    prompt: str
    product_name: str = ""
    style: str = "realistic"

@router.post("/generate", summary="Gemini দিয়ে ইমেজ তৈরি করুন")
async def generate_image(request: ImageRequest):
    """
    এই এন্ডপয়েন্টটি প্রোডাক্টের বর্ণনা নিয়ে প্রম্পট জেনারেট করবে এবং 
    ইমেজ এপিআই (যেমন DALL-E বা Vertex AI) ব্যবহার করে ছবি তৈরি করবে। 
    (আপাতত Gemini Vision/Text দিয়ে সুন্দর ইমেজ প্রম্পট বা ডেমো রেসপন্স দিবে)
    """
    settings = get_current_settings()
    gemini_api_key = settings.get("gemini_api_key", "")
    
    if not gemini_api_key:
        # Mock Response if no API key
        return {
            "status": "success",
            "message": "API Key বসানো নেই, তাই డেমো ইমেজ দেখানো হচ্ছে।",
            "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
            "prompt_used": f"{request.style} image of {request.product_name} - {request.prompt}"
        }

    try:
        # Gemini API Connection Logic (If you use Gemini for prompt enhancement)
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # NOTE: Gemini Text Models don't generate images directly. 
        # Usually, we generate a high-quality prompt with Gemini, then send it to an Image API.
        # For now, we will return a highly optimized prompt and a placeholder image.
        
        ai_response = model.generate_content(
            f"Write a very detailed image generation prompt (in English) for an AI image generator based on this user request: Product: {request.product_name}, Description: {request.prompt}, Style: {request.style}. Just return the prompt text."
        )
        
        enhanced_prompt = ai_response.text
        
        # Here you would typically call an Image API (like Stability AI or OpenAI DALL-E) 
        # using the enhanced_prompt. We use a placeholder for now.
        return {
            "status": "success",
            "message": "Gemini সফলভাবে প্রম্পট তৈরি করেছে!",
            "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            "prompt_used": enhanced_prompt
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
