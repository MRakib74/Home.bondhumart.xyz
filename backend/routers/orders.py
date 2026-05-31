from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime, timedelta

router = APIRouter()

class OrderData(BaseModel):
    order_id: str
    customer_name: str
    phone: str
    product_name: str
    amount: float
    status: str # "pending", "completed", "cancelled"
    order_date: datetime

@router.post("/segment", summary="অর্ডার এনালাইসিস এবং কাস্টমার সেগমেন্টেশন")
async def analyze_orders(orders: List[OrderData]):
    """
    Bondhumart ডাটাবেজ থেকে অর্ডার এনে কাস্টমারদের ভাগ করবে।
    """
    segments = {
        "hot_buyers": [],         # যারা লাস্ট ৭ দিনে কিনেছে
        "repeated_customers": [], # যারা একাধিকবার কিনেছে
        "inactive_30_days": [],   # যারা ৩০ দিনের বেশি সময় ধরে কিছু কিনেনি
        "cancelled_orders": []    # যাদের অর্ডার ক্যান্সেল হয়েছে (ফলোআপের জন্য)
    }
    
    phone_counts = {}
    
    # 1. Count repeated customers
    for order in orders:
        if order.phone in phone_counts:
            phone_counts[order.phone] += 1
        else:
            phone_counts[order.phone] = 1

    # 2. Segmenting Logic
    now = datetime.now()
    for order in orders:
        days_since_order = (now - order.order_date.replace(tzinfo=None)).days
        
        customer_info = {
            "name": order.customer_name,
            "phone": order.phone,
            "last_product": order.product_name
        }

        if order.status.lower() == "cancelled":
            segments["cancelled_orders"].append(customer_info)
            continue
            
        if phone_counts[order.phone] > 1 and customer_info not in segments["repeated_customers"]:
            segments["repeated_customers"].append(customer_info)

        if days_since_order <= 7:
            segments["hot_buyers"].append(customer_info)
        elif days_since_order > 30:
            segments["inactive_30_days"].append(customer_info)

    return {
        "message": "কাস্টমার সেগমেন্টেশন সম্পন্ন হয়েছে!",
        "total_analyzed": len(orders),
        "segments": segments
    }

@router.post("/followup", summary="অর্ডার অনুযায়ী ফলোআপ মেসেজ")
async def generate_followup(customer_name: str, product_name: str, segment_type: str):
    """
    কাস্টমারের স্ট্যাটাস বুঝে AI-কে দিয়ে পার্সোনালাইজড ফলোআপ মেসেজ জেনারেট করবে।
    """
    if segment_type == "inactive_30_days":
        msg = f"আসসালামু আলাইকুম {customer_name} ভাইয়া! অনেকদিন আপনার কোনো খবর নেই। আপনি আগে আমাদের থেকে '{product_name}' নিয়েছিলেন। আজ আপনার জন্য স্পেশাল ৫% ডিসকাউন্ট আছে!"
    elif segment_type == "repeated_customers":
        msg = f"হ্যালো {customer_name} ভাইয়া! আপনি আমাদের রেগুলার কাস্টমার, তাই আপনার জন্য আমাদের নতুন কালেকশনে থাকছে ফ্রি ডেলিভারি!"
    else:
        msg = f"জি ভাইয়া, আপনার {product_name} এর অর্ডারটির আপডেট জানতে মেসেজ দিন।"
        
    return {"status": "success", "followup_message": msg}
