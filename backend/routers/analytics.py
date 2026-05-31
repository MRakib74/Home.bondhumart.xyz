from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard-stats", summary="ড্যাশবোর্ডের ওভারভিউ ডাটা")
async def get_stats():
    """
    কতগুলো লিড আসলো, কত মেসেজ সেন্ড হলো, এবং সেলের গ্রাফিকাল এনালাইসিস।
    """
    return {
        "total_leads": 1250,
        "whatsapp_sent": 5000,
        "orders_today": 45,
        "status": "Analytics Agent running smoothly"
    }
