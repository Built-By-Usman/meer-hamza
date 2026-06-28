from typing import Optional, List, Tuple
from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from slugify import slugify
import uuid
from app.models.product import Product, Category

class ProductService:
    @staticmethod
    async def get_products(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        category_slug: Optional[str] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        search: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Tuple[List[Product], int]:
        # 1. Base statement
        stmt = select(Product)
        
        # 2. Filter by Category slug if provided
        if category_slug:
            stmt = stmt.join(Product.category).where(Category.slug == category_slug)
            
        # 3. Filtering by Price boundaries
        if min_price is not None:
            stmt = stmt.where(Product.price >= min_price)
        if max_price is not None:
            stmt = stmt.where(Product.price <= max_price)
            
        # 4. PostgreSQL Full-Text search integration using plainto_tsquery matching GIN index
        if search:
            # We match the compiled GIN index on Product name + description
            stmt = stmt.where(
                func.to_tsvector("english", Product.name + " " + func.coalesce(Product.description, "")).op("@@")(
                    func.plainto_tsquery("english", search)
                )
            )

        # 5. Extract Total Filtered Count using a nested subquery (avoids separate redundant filter duplication)
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await db.execute(count_stmt)
        total_count = count_result.scalar_one()

        # 6. Apply Sorting rules
        sort_column = Product.created_at
        if sort_by == "price":
            sort_column = Product.price
        elif sort_by == "name":
            sort_column = Product.name

        if sort_order == "desc":
            stmt = stmt.order_by(sort_column.desc())
        else:
            stmt = stmt.order_by(sort_column.asc())

        # 7. Apply Pagination limits and eager load categories (blocks N+1 query triggers)
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size).options(selectinload(Product.category))

        result = await db.execute(stmt)
        items = list(result.scalars().all())
        
        return items, total_count

    @staticmethod
    async def get_product_by_slug(db: AsyncSession, slug: str) -> Product:
        # Load category eagerly during single item retrieval for detailed responses
        stmt = select(Product).where(Product.slug == slug).options(selectinload(Product.category))
        result = await db.execute(stmt)
        product = result.scalars().first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        return product

    @staticmethod
    async def create_product(db: AsyncSession, product_in: any) -> Product:
        base_slug = slugify(product_in.name)
        slug = base_slug
        
        # Resolve potential slug collisions by appending a shortened random hash suffix
        collision_check = await db.execute(select(Product).where(Product.slug == slug))
        if collision_check.scalars().first():
            slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"
            
        db_product = Product(
            name=product_in.name,
            slug=slug,
            description=product_in.description,
            price=product_in.price,
            stock=product_in.stock,
            category_id=product_in.category_id,
            image_url=product_in.image_url,
            is_active=True
        )
        db.add(db_product)
        await db.commit()
        await db.refresh(db_product)
        return db_product

    @staticmethod
    async def update_product(db: AsyncSession, product_id: uuid.UUID, product_update: any) -> Product:
        stmt = select(Product).where(Product.id == product_id)
        result = await db.execute(stmt)
        product = result.scalars().first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )

        # Exclude unset fields to perform precise partial updates
        update_data = product_update.model_dump(exclude_unset=True)
        
        # Regenerate slug if name has changed
        if "name" in update_data:
            base_slug = slugify(update_data["name"])
            slug = base_slug
            collision_check = await db.execute(
                select(Product).where(Product.slug == slug, Product.id != product_id)
            )
            if collision_check.scalars().first():
                slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"
            update_data["slug"] = slug

        for key, value in update_data.items():
            setattr(product, key, value)

        await db.commit()
        await db.refresh(product)
        return product

    @staticmethod
    async def delete_product(db: AsyncSession, product_id: uuid.UUID) -> Product:
        # Soft delete operation (simply toggling active flag, preserving transactional order relationships)
        stmt = select(Product).where(Product.id == product_id)
        result = await db.execute(stmt)
        product = result.scalars().first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        product.is_active = False
        await db.commit()
        await db.refresh(product)
        return product

    @staticmethod
    async def get_categories(db: AsyncSession) -> List[Category]:
        result = await db.execute(select(Category))
        return list(result.scalars().all())
