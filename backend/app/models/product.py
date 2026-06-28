from sqlalchemy import String, Boolean, DateTime, Numeric, ForeignKey, Text, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from typing import List, Optional
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    parent_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("categories.id", ondelete="CASCADE"), 
        nullable=True
    )

    # Self-referential relationships
    parent: Mapped[Optional["Category"]] = relationship("Category", remote_side=[id], back_populates="subcategories")
    subcategories: Mapped[List["Category"]] = relationship("Category", back_populates="parent", cascade="all, delete-orphan")
    products: Mapped[List["Product"]] = relationship(back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    stock: Mapped[int] = mapped_column(default=0)
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("categories.id", ondelete="RESTRICT"), 
        nullable=False
    )
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    category: Mapped["Category"] = relationship(back_populates="products")

# Composite Index for high performance category filtered listings with ordering on prices
Index("idx_products_cat_active_price", Product.category_id, Product.is_active, Product.price)

# PostgreSQL GIN index for high-performance full-text search
Index(
    "idx_products_search",
    func.to_tsvector("english", Product.name + " " + func.coalesce(Product.description, "")),
    postgresql_using="gin"
)

