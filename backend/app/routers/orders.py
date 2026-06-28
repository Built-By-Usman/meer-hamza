from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from typing import Optional
from app.database import get_db
from app.schemas.order import OrderResponse, OrderListResponse, OrderCreate
from app.models.user import User
from app.models.order import OrderStatus
from app.services.auth_service import AuthService
from app.services.order_service import OrderService
from app.utils.pagination import PaginationParams

router = APIRouter()

@router.get("", response_model=OrderListResponse)
async def list_orders(
    page_params: PaginationParams = Depends(),
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves a paginated list of orders for the currently logged-in user."""
    items, total = await OrderService.get_user_orders(
        db, 
        current_user.id, 
        page_params.page, 
        page_params.page_size
    )
    pages = (total + page_params.page_size - 1) // page_params.page_size if total > 0 else 1
    return {
        "items": items,
        "total": total,
        "page": page_params.page,
        "pages": pages
    }

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order_from_cart(
    order_in: OrderCreate,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Submits and processes a checkout transaction from the current active cart items."""
    address_dict = order_in.shipping_address.model_dump()
    return await OrderService.create_order(db, current_user.id, address_dict)

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_details(
    order_id: uuid.UUID,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves specific details for a user order (verifies user ownership)."""
    return await OrderService.get_order_detail(db, order_id, current_user.id)

@router.post("/{order_id}/cancel", response_model=OrderResponse)
async def cancel_pending_order(
    order_id: uuid.UUID,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancels a pending order and restores its stock levels."""
    return await OrderService.cancel_order(db, order_id, current_user.id)

# Admin Order Management Routes

@router.get("/admin/orders", response_model=OrderListResponse)
async def list_all_orders_admin(
    page_params: PaginationParams = Depends(),
    status_filter: Optional[OrderStatus] = Query(None, description="Filter orders by status"),
    admin_user: User = Depends(AuthService.get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Allows administrators to fetch a paginated list of all system orders, filterable by status."""
    items, total = await OrderService.get_admin_orders(
        db, 
        page_params.page, 
        page_params.page_size, 
        status_filter=status_filter
    )
    pages = (total + page_params.page_size - 1) // page_params.page_size if total > 0 else 1
    return {
        "items": items,
        "total": total,
        "page": page_params.page,
        "pages": pages
    }

@router.patch("/admin/orders/{id}/status", response_model=OrderResponse)
async def update_order_status_admin(
    id: uuid.UUID,
    new_status: OrderStatus = Query(..., description="Target status transition"),
    admin_user: User = Depends(AuthService.get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Allows administrators to transition an order through validated status stages."""
    return await OrderService.update_order_status(db, id, new_status)
