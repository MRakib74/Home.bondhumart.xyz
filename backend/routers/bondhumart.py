from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import httpx
from routers.settings import get_current_settings

router = APIRouter()

# ইন-মেমোরি অর্ডার ডাটাবেজ (পরে PostgreSQL-এ স্থানান্তরিত হবে)
bondhumart_orders: List[Dict] = []

# ===========================
# DATA MODELS
# ===========================

class OrderItem(BaseModel):
    product_name: str
    quantity: int
    unit_price: float

class BondhumartOrder(BaseModel):
    order_id: str
    customer_name: str
    customer_phone: str
    customer_address: str
    customer_district: str = "Dhaka"
    items: List[OrderItem]
    total_amount: float
    delivery_charge: float
    order_status: str  # "pending", "confirmed", "shipped", "delivered", "cancelled"
    payment_method: str = "COD"
    created_at: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    order_id: str
    new_status: str
    note: Optional[str] = None

# ===========================
# WEBHOOK ENDPOINT (Bondhumart → BondhuOS)
# ===========================

@router.post("/webhook/new-order", summary="Bondhumart থেকে নতুন অর্ডার ওয়েবহুক")
async def receive_new_order(
    order: BondhumartOrder,
    x_bondhumart_secret: Optional[str] = Header(None)
):
    """
    Bondhumart সাইট থেকে যখনই নতুন অর্ডার আসবে, এই এন্ডপয়েন্টে POST রিকোয়েস্ট আসবে।
    একটি সিক্রেট হেডার দিয়ে নিরাপত্তা নিশ্চিত করা হয়।
    """
    settings = get_current_settings()
    secret = settings.get("bondhumart_webhook_secret", "")

    if secret and x_bondhumart_secret != secret:
        raise HTTPException(status_code=401, detail="অবৈধ Webhook Secret! অ্যাক্সেস অস্বীকার করা হয়েছে।")

    order_dict = order.model_dump()
    order_dict["created_at"] = order.created_at or datetime.now().isoformat()
    order_dict["synced_at"] = datetime.now().isoformat()

    # Duplicate check করা
    existing_ids = [o["order_id"] for o in bondhumart_orders]
    if order.order_id in existing_ids:
        # আপডেট করা
        for i, o in enumerate(bondhumart_orders):
            if o["order_id"] == order.order_id:
                bondhumart_orders[i] = order_dict
                return {"status": "updated", "message": f"অর্ডার #{order.order_id} আপডেট হয়েছে।"}
    else:
        bondhumart_orders.append(order_dict)

    return {
        "status": "success",
        "message": f"নতুন অর্ডার #{order.order_id} সফলভাবে সিঙ্ক হয়েছে!",
        "customer": order.customer_name
    }


@router.post("/webhook/sync-bulk", summary="বাল্ক অর্ডার সিঙ্ক (Bondhumart থেকে)")
async def sync_bulk_orders(orders: List[BondhumartOrder]):
    """
    Bondhumart থেকে একসাথে অনেক অর্ডার সিঙ্ক করার জন্য।
    """
    synced = 0
    updated = 0
    existing_ids = [o["order_id"] for o in bondhumart_orders]

    for order in orders:
        order_dict = order.model_dump()
        order_dict["synced_at"] = datetime.now().isoformat()
        if order.order_id in existing_ids:
            for i, o in enumerate(bondhumart_orders):
                if o["order_id"] == order.order_id:
                    bondhumart_orders[i] = order_dict
                    updated += 1
        else:
            bondhumart_orders.append(order_dict)
            synced += 1

    return {
        "status": "success",
        "new_orders": synced,
        "updated_orders": updated,
        "total_in_db": len(bondhumart_orders)
    }


# ===========================
# PULL ENDPOINT (BondhuOS → Bondhumart API)
# ===========================

@router.post("/sync/pull-from-api", summary="Bondhumart API থেকে সরাসরি অর্ডার টেনে আনুন")
async def pull_from_bondhumart_api():
    """
    আপনার Bondhumart সাইটের REST API থেকে সরাসরি অর্ডার পুল করবে।
    Settings-এ Bondhumart API URL এবং Token বসানো থাকতে হবে।
    """
    settings = get_current_settings()
    api_url = settings.get("bondhumart_api_url", "")
    api_token = settings.get("bondhumart_api_token", "")

    if not api_url or not api_token:
        raise HTTPException(
            status_code=400,
            detail="Bondhumart API URL বা Token সেটিংসে বসানো নেই! Settings পেজে গিয়ে সেট করুন।"
        )

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{api_url.rstrip('/')}/api/orders",
                headers={"Authorization": f"Bearer {api_token}", "Accept": "application/json"},
                timeout=15.0
            )
            response.raise_for_status()
            data = response.json()
            orders_data = data.get("data", data) if isinstance(data, dict) else data

            synced = 0
            existing_ids = [o["order_id"] for o in bondhumart_orders]
            for raw_order in orders_data:
                order_id = str(raw_order.get("id", ""))
                if order_id and order_id not in existing_ids:
                    bondhumart_orders.append({
                        "order_id": order_id,
                        "customer_name": raw_order.get("customer_name", ""),
                        "customer_phone": raw_order.get("customer_phone", raw_order.get("phone", "")),
                        "customer_address": raw_order.get("customer_address", raw_order.get("address", "")),
                        "customer_district": raw_order.get("district", ""),
                        "items": raw_order.get("items", []),
                        "total_amount": float(raw_order.get("total_amount", 0)),
                        "delivery_charge": float(raw_order.get("delivery_charge", 0)),
                        "order_status": raw_order.get("status", "pending"),
                        "payment_method": raw_order.get("payment_method", "COD"),
                        "created_at": raw_order.get("created_at", ""),
                        "synced_at": datetime.now().isoformat()
                    })
                    synced += 1

            return {
                "status": "success",
                "message": f"Bondhumart API থেকে {synced}টি নতুন অর্ডার সিঙ্ক হয়েছে!",
                "total_in_db": len(bondhumart_orders)
            }
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Bondhumart API-তে কানেক্ট করা যাচ্ছে না: {str(e)}")


# ===========================
# SEGMENTATION & ANALYTICS
# ===========================

@router.get("/segments", summary="কাস্টমার সেগমেন্টেশন এনালাইসিস")
async def get_segments():
    """
    সমস্ত অর্ডারের উপর ভিত্তি করে কাস্টমারদের স্বয়ংক্রিয়ভাবে শ্রেণীবদ্ধ করবে।
    """
    from collections import defaultdict
    from datetime import timedelta

    now = datetime.now()
    customer_map = defaultdict(lambda: {
        "name": "", "phone": "", "orders": [], "total_spent": 0,
        "products": [], "statuses": [], "districts": []
    })

    for order in bondhumart_orders:
        phone = order.get("customer_phone", "")
        c = customer_map[phone]
        c["name"] = order.get("customer_name", "")
        c["phone"] = phone
        c["orders"].append(order)
        c["total_spent"] += order.get("total_amount", 0)
        c["statuses"].append(order.get("order_status", ""))
        c["districts"].append(order.get("customer_district", ""))
        for item in order.get("items", []):
            c["products"].append(item.get("product_name", item) if isinstance(item, dict) else item)

    hot_buyers, repeated, inactive, cancelled, new_customers, vip = [], [], [], [], [], []

    for phone, c in customer_map.items():
        order_count = len(c["orders"])
        total_spent = c["total_spent"]
        latest_order_date_str = max(
            (o.get("created_at") or o.get("synced_at", "2000-01-01") for o in c["orders"]),
            default="2000-01-01"
        )
        try:
            latest_date = datetime.fromisoformat(latest_order_date_str[:19])
        except:
            latest_date = now - timedelta(days=100)

        days_since_last = (now - latest_date).days
        has_cancelled = "cancelled" in c["statuses"]
        is_delivered = "delivered" in c["statuses"]

        entry = {
            "name": c["name"], "phone": phone,
            "order_count": order_count, "total_spent": total_spent,
            "days_since_last": days_since_last,
            "last_products": list(set(c["products"]))[:3],
            "districts": list(set(c["districts"]))
        }

        if total_spent >= 5000 and order_count >= 3:
            vip.append(entry)
        elif days_since_last <= 7 and is_delivered:
            hot_buyers.append(entry)
        elif order_count >= 2:
            repeated.append(entry)
        elif days_since_last > 30 and is_delivered:
            inactive.append(entry)
        elif has_cancelled:
            cancelled.append(entry)
        elif order_count == 1 and days_since_last <= 30:
            new_customers.append(entry)

    return {
        "summary": {
            "total_orders": len(bondhumart_orders),
            "total_unique_customers": len(customer_map),
        },
        "segments": {
            "vip_customers": vip,
            "hot_buyers": hot_buyers,
            "repeated_customers": repeated,
            "new_customers": new_customers,
            "inactive_30_days": inactive,
            "cancelled_orders": cancelled
        }
    }


@router.get("/orders", summary="সব অর্ডার দেখুন")
async def get_all_orders(
    status: Optional[str] = None,
    district: Optional[str] = None,
    limit: int = 50
):
    """ফিল্টার করা অর্ডার লিস্ট দেখুন।"""
    result = bondhumart_orders
    if status:
        result = [o for o in result if o.get("order_status") == status]
    if district:
        result = [o for o in result if o.get("customer_district", "").lower() == district.lower()]
    return result[-limit:]


@router.patch("/orders/update-status", summary="অর্ডার স্ট্যাটাস আপডেট করুন")
async def update_order_status(update: OrderStatusUpdate):
    for i, order in enumerate(bondhumart_orders):
        if order["order_id"] == update.order_id:
            bondhumart_orders[i]["order_status"] = update.new_status
            bondhumart_orders[i]["status_note"] = update.note or ""
            bondhumart_orders[i]["updated_at"] = datetime.now().isoformat()
            return {"status": "success", "message": f"অর্ডার #{update.order_id} স্ট্যাটাস '{update.new_status}' তে পরিবর্তন হয়েছে।"}
    raise HTTPException(status_code=404, detail="অর্ডার খুঁজে পাওয়া যায়নি!")
