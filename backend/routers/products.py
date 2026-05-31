from fastapi import APIRouter, HTTPException
from typing import List
from models.product import ProductCreate, ProductInDB
import uuid
from datetime import datetime

router = APIRouter()

# ইন-মেমোরি ডাটাবেজ (টেস্টিংয়ের জন্য, পরে আমরা আসল ডাটাবেজ লাগাবো)
fake_product_db = []

@router.post("/", response_model=ProductInDB, summary="নতুন প্রোডাক্ট এড করুন")
async def add_product(product: ProductCreate):
    """
    এই এন্ডপয়েন্টের মাধ্যমে ড্যাশবোর্ড থেকে প্রোডাক্ট এড করা হবে।
    প্রোডাক্টের নাম, দাম, অফার, ডেলিভারি চার্জ এবং বিবরণ দিলে AI সেটা স্টোর করে রাখবে 
    ভবিষ্যতে কন্টেন্ট জেনারেট বা ফলোআপ মেসেজ লেখার জন্য।
    """
    new_product = ProductInDB(
        id=str(uuid.uuid4()),
        created_at=datetime.now(),
        **product.model_dump()
    )
    fake_product_db.append(new_product)
    
    # এখানে আমরা Master AI-কে ট্র্রিগার করতে পারি যেন সে নতুন প্রোডাক্ট এনালাইসিস করে
    # এবং n8n বা Vector Database-এ পাঠিয়ে দেয়।
    
    return new_product

@router.get("/", response_model=List[ProductInDB], summary="সব প্রোডাক্ট দেখুন")
async def get_all_products():
    """
    এআই কমান্ড সেন্টারের ডাটাবেজে থাকা সব প্রোডাক্টের লিস্ট।
    """
    return fake_product_db

@router.get("/{product_id}", response_model=ProductInDB, summary="নির্দিষ্ট প্রোডাক্ট দেখুন")
async def get_product(product_id: str):
    for p in fake_product_db:
        if p.id == product_id:
            return p
    raise HTTPException(status_code=404, detail="প্রোডাক্ট পাওয়া যায়নি!")
