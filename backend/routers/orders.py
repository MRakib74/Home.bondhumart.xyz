from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from models.crm import CCOrder, Customer
import json

router = APIRouter()

class OrderItemInput(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float

class OrderCreateInput(BaseModel):
    customer_name: str
    phone: str
    address: str
    district: str
    items: List[OrderItemInput]
    total_amount: float
    courier_name: Optional[str] = "steadfast"

@router.post("/create", summary="কমান্ড সেন্টারে ম্যানুয়ালি অর্ডার তৈরি করুন")
async def create_cc_order(order: OrderCreateInput, db: Session = Depends(get_db)):
    """
    এই অর্ডারটি BondhuMart-এ যাবে না। এটি শুধু Command Center-এর নিজস্ব ডাটাবেজে থাকবে 
    এবং এখান থেকেই কুরিয়ার (Steadfast/Pathao) হ্যান্ডেল করা হবে।
    """
    # ১. কাস্টমার চেক বা তৈরি করা
    customer = db.query(Customer).filter(Customer.phone == order.phone).first()
    if not customer:
        customer = Customer(
            name=order.customer_name,
            phone=order.phone,
            address=order.address,
            district=order.district
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
    
    # ২. অর্ডার তৈরি করা
    items_json = [item.model_dump() for item in order.items]
    
    new_order = CCOrder(
        customer_id=customer.id,
        items=items_json,
        total_amount=order.total_amount,
        status="pending",
        courier_name=order.courier_name,
        created_by="admin"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    return {
        "status": "success", 
        "message": "Command Center-এ অর্ডার সফলভাবে তৈরি হয়েছে!", 
        "order_id": new_order.id
    }

@router.get("/list", summary="কমান্ড সেন্টারের তৈরি অর্ডারগুলো দেখুন")
async def get_cc_orders(db: Session = Depends(get_db), limit: int = 50):
    orders = db.query(CCOrder).order_by(CCOrder.created_at.desc()).limit(limit).all()
    
    result = []
    for o in orders:
        result.append({
            "id": o.id,
            "customer_name": o.customer.name,
            "phone": o.customer.phone,
            "address": o.customer.address,
            "items": o.items,
            "total_amount": o.total_amount,
            "status": o.status,
            "courier_name": o.courier_name,
            "created_at": o.created_at
        })
    return result
