from pydantic import BaseModel, ConfigDict, computed_field, Field
from decimal import Decimal
from datetime import datetime
import uuid
from typing import List, Optional

class ShippingAddress(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    address_line1: str = Field(..., min_length=5, max_length=255)
    address_line2: Optional[str] = Field(None, max_length=255)
    city: str = Field(..., min_length=2, max_length=100)
    postal_code: str = Field(..., min_length=3, max_length=20)
    country: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=5, max_length=30)

class OrderCreate(BaseModel):
    shipping_address: ShippingAddress

class OrderItemResponse(BaseModel):
    product_id: uuid.UUID
    product_name: str
    quantity: int
    unit_price: Decimal

    @computed_field
    def subtotal(self) -> Decimal:
        """Computes subtotal value dynamically."""
        return self.unit_price * self.quantity

    model_config = ConfigDict(from_attributes=True)

class OrderResponse(BaseModel):
    id: uuid.UUID
    status: str
    total_amount: Decimal
    shipping_address: ShippingAddress
    items: List[OrderItemResponse]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    pages: int
