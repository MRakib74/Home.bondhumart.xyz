from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ProductBase(BaseModel):
    name: str = Field(..., title="Product Name", description="পণ্যের নাম")
    description: str = Field(..., title="Description", description="পণ্যের বিস্তারিত বিবরণ")
    price: float = Field(..., title="Regular Price", description="নিয়মিত দাম")
    offer_price: Optional[float] = Field(None, title="Offer Price", description="অফার বা ডিসকাউন্ট দাম")
    delivery_charge_inside_dhaka: float = Field(80.0, title="Delivery Charge (Dhaka)", description="ঢাকায় ডেলিভারি চার্জ")
    delivery_charge_outside_dhaka: float = Field(130.0, title="Delivery Charge (Outside)", description="ঢাকার বাইরে ডেলিভারি চার্জ")
    tags: List[str] = Field(default=[], description="প্রোডাক্ট ক্যাটাগরি বা ট্যাগ (যেমন: gadget, beauty)")
    target_audience: Optional[str] = Field(None, description="এই প্রোডাক্ট কাদের জন্য (AI এর সুবিধার জন্য)")
    
class ProductCreate(ProductBase):
    pass

class ProductInDB(ProductBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
