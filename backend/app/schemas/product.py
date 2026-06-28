from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from datetime import datetime
from typing import Optional, List
import uuid

class CategoryCreate(BaseModel):
    name: str
    slug: str
    parent_id: Optional[uuid.UUID] = None

class CategoryResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    parent_id: Optional[uuid.UUID] = None

    model_config = ConfigDict(from_attributes=True)

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    stock: int = 0
    category_id: uuid.UUID
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    category_id: Optional[uuid.UUID] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: uuid.UUID
    slug: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    pages: int
