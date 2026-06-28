from fastapi import APIRouter, Depends, Query, Response, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
import uuid
from app.database import get_db
from app.schemas.product import ProductResponse, ProductListResponse, ProductCreate, ProductUpdate, CategoryResponse
from app.services.product_service import ProductService
from app.services.auth_service import AuthService
from app.models.user import User
from app.utils.cache import cache_instance
from app.utils.pagination import PaginationParams

router = APIRouter()
categories_router = APIRouter()

@router.get("", response_model=ProductListResponse)
async def list_products(
    response: Response,
    page_params: PaginationParams = Depends(),
    category: Optional[str] = Query(None, description="Category slug filter"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    search: Optional[str] = Query(None, description="Search query"),
    sort_by: str = Query("created_at", regex="^(price|name|created_at)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db)
):
    """Lists products with support for pagination, filtering, search, and sorting. Cached for 60s."""
    # Compose namespace cache key
    cache_key = (
        f"products:list:{page_params.page}:{page_params.page_size}:"
        f"{category}:{min_price}:{max_price}:{search}:{sort_by}:{sort_order}"
    )

    cached = await cache_instance.get(cache_key)
    if cached is not None:
        response.headers["Cache-Control"] = "public, max-age=60"
        response.headers["X-Cache"] = "HIT"
        return cached

    items, total = await ProductService.get_products(
        db,
        page=page_params.page,
        page_size=page_params.page_size,
        category_slug=category,
        min_price=min_price,
        max_price=max_price,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )

    # Compute total pages
    pages = (total + page_params.page_size - 1) // page_params.page_size if total > 0 else 1

    response_data = {
        "items": [ProductResponse.model_validate(item).model_dump() for item in items],
        "total": total,
        "page": page_params.page,
        "pages": pages
    }

    # Store in memory cache
    await cache_instance.set(cache_key, response_data, ttl=60)
    response.headers["Cache-Control"] = "public, max-age=60"
    response.headers["X-Cache"] = "MISS"
    return response_data

@router.get("/{slug}", response_model=ProductResponse)
async def get_product(slug: str, response: Response, db: AsyncSession = Depends(get_db)):
    """Retrieves a single product by its slug. Cached for 30s."""
    cache_key = f"products:detail:{slug}"
    
    cached = await cache_instance.get(cache_key)
    if cached is not None:
        response.headers["Cache-Control"] = "public, max-age=30"
        response.headers["X-Cache"] = "HIT"
        return cached

    product = await ProductService.get_product_by_slug(db, slug)
    response_data = ProductResponse.model_validate(product).model_dump()

    await cache_instance.set(cache_key, response_data, ttl=30)
    response.headers["Cache-Control"] = "public, max-age=30"
    response.headers["X-Cache"] = "MISS"
    return response_data

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(AuthService.get_current_admin_user)
):
    """Creates a new product slug. Clears all cached product lists to enforce freshness."""
    product = await ProductService.create_product(db, product_in)
    await cache_instance.clear_prefix("products:")
    return product

@router.put("/{id}", response_model=ProductResponse)
async def update_product(
    id: uuid.UUID,
    product_in: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(AuthService.get_current_admin_user)
):
    """Updates product details. Clears all cached product data."""
    product = await ProductService.update_product(db, id, product_in)
    await cache_instance.clear_prefix("products:")
    return product

@router.delete("/{id}", response_model=ProductResponse)
async def delete_product(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(AuthService.get_current_admin_user)
):
    """Soft deletes a product. Clears all cached product listings."""
    product = await ProductService.delete_product(db, id)
    await cache_instance.clear_prefix("products:")
    return product

@categories_router.get("", response_model=List[CategoryResponse])
async def list_categories(response: Response, db: AsyncSession = Depends(get_db)):
    """Retrieves all product categories. Cached for 300s."""
    cache_key = "categories:list"
    
    cached = await cache_instance.get(cache_key)
    if cached is not None:
        response.headers["Cache-Control"] = "public, max-age=300"
        response.headers["X-Cache"] = "HIT"
        return cached

    categories = await ProductService.get_categories(db)
    response_data = [CategoryResponse.model_validate(cat).model_dump() for cat in categories]

    await cache_instance.set(cache_key, response_data, ttl=300)
    response.headers["Cache-Control"] = "public, max-age=300"
    response.headers["X-Cache"] = "MISS"
    return response_data
