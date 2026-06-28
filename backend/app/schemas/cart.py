from pydantic import BaseModel, ConfigDict, computed_field, Field
from decimal import Decimal
import uuid
from typing import List

class CartItemAdd(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(..., ge=1, le=100, description="Quantity must be between 1 and 100")

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1, le=100, description="Quantity must be between 1 and 100")

class CartItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    product_name: str
    product_price: Decimal
    quantity: int

    @computed_field
    def subtotal(self) -> Decimal:
        """Dynamically computes the subtotal for this item."""
        return self.product_price * self.quantity

    model_config = ConfigDict(from_attributes=True)

class CartResponse(BaseModel):
    id: uuid.UUID
    items: List[CartItemResponse]

    @computed_field
    def total(self) -> Decimal:
        """Dynamically sums all item subtotals to compute the cart total."""
        return sum(item.subtotal for item in self.items)

    model_config = ConfigDict(from_attributes=True)
