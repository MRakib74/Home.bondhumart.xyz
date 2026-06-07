"""
BondhuMart DB Integration Router
সরাসরি BondhuMart এর MySQL ডেটাবেজ থেকে রিয়েল ডেটা দেখানোর API।
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from sqlalchemy.orm import Session
from database import get_db
from models.crm import CCProduct
from pydantic import BaseModel
from services.bondhumart_db import (
    check_db_connection,
    get_dashboard_stats,
    get_recent_orders,
    get_customer_segments,
    get_products,
)

router = APIRouter()


@router.get("/status", summary="ডেটাবেজ কানেকশন চেক করুন")
async def db_status():
    """BondhuMart এর MySQL ডেটাবেজের সাথে কানেকশন চেক করে।"""
    return check_db_connection()


@router.get("/dashboard", summary="ড্যাশবোর্ড - সব গুরুত্বপূর্ণ তথ্য একসাথে")
async def dashboard_stats():
    """
    রিয়েল-টাইম ড্যাশবোর্ড ডেটা:
    - আজকের অর্ডার ও আয়
    - সপ্তাহ ও মাসের তুলনা
    - স্ট্যাটাস ব্রেকডাউন
    - কম স্টক প্রোডাক্ট সংখ্যা
    """
    try:
        return get_dashboard_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ডেটাবেজ এরর: {str(e)}")


@router.get("/orders", summary="BondhuMart এর সাম্প্রতিক অর্ডার দেখুন")
async def list_orders(
    status: Optional[str] = Query(None, description="pending, confirmed, shipped, delivered, cancelled"),
    days: int = Query(30, description="গত কত দিনের অর্ডার"),
    limit: int = Query(20, description="সর্বোচ্চ কয়টি অর্ডার")
):
    """সরাসরি BondhuMart DB থেকে অর্ডার লিস্ট দেখায়।"""
    try:
        return get_recent_orders(limit=limit, status=status, days=days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ডেটাবেজ এরর: {str(e)}")


@router.get("/customers/segments", summary="WhatsApp Broadcast এর জন্য কাস্টমার সেগমেন্ট")
async def customer_segments():
    """
    কাস্টমার সেগমেন্টেশন:
    - Hot Buyers (গত ৭ দিনে অর্ডার করেছে)
    - VIP (৫০০০+ টাকা খরচ করেছে)
    - Inactive (৩০ দিনের বেশি অর্ডার নেই)
    """
    try:
        return get_customer_segments()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ডেটাবেজ এরর: {str(e)}")


class CustomProductInput(BaseModel):
    name: str
    price: float
    buying_price: float = 0.0
    stock: int = 100
    image_url: Optional[str] = None

@router.get("/products", summary="প্রোডাক্ট লিস্ট ও স্টক স্ট্যাটাস")
async def list_products(
    low_stock_only: bool = Query(False, description="শুধু কম স্টকের প্রোডাক্ট দেখান"),
    limit: int = Query(50),
    db: Session = Depends(get_db)
):
    """BondhuMart এর প্রোডাক্ট ও Command Center এর কাস্টম প্রোডাক্ট দেখায়।"""
    try:
        # Bondhumart Live Products
        try:
            live_products = get_products(low_stock_only=low_stock_only, limit=limit)
        except Exception:
            live_products = [] # If live DB is down, just skip
            
        # Command Center Custom Products
        query = db.query(CCProduct).filter(CCProduct.status == "active")
        if low_stock_only:
            query = query.filter(CCProduct.stock <= CCProduct.low_stock_threshold)
        
        custom_products_db = query.limit(limit).all()
        
        custom_products = []
        for cp in custom_products_db:
            custom_products.append({
                "id": f"cc-{cp.id}",
                "name": cp.name,
                "price": cp.price,
                "buying_price": cp.buying_price,
                "profit_margin": round(cp.price - cp.buying_price, 2),
                "stock": cp.stock,
                "low_stock_threshold": cp.low_stock_threshold,
                "image_url": cp.image_url,
                "status": cp.status,
                "is_custom": True
            })
            
        # Combine both
        return custom_products + live_products
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ডেটাবেজ এরর: {str(e)}")


@router.post("/products/custom", summary="কমান্ড সেন্টারে কাস্টম প্রোডাক্ট এড করুন")
async def add_custom_product(
    product: CustomProductInput,
    db: Session = Depends(get_db)
):
    """Command Center-এর নিজস্ব ডাটাবেজে একটি নতুন প্রোডাক্ট তৈরি করে।"""
    new_product = CCProduct(
        name=product.name,
        price=product.price,
        buying_price=product.buying_price,
        stock=product.stock,
        image_url=product.image_url
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    return {"status": "success", "message": f"{product.name} সফলভাবে যোগ করা হয়েছে!", "product_id": new_product.id}

