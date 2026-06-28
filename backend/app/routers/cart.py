from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.database import get_db
from app.schemas.cart import CartResponse, CartItemAdd, CartItemUpdate
from app.models.user import User
from app.services.auth_service import AuthService
from app.services.cart_service import CartService

router = APIRouter()

@router.get("", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves the shopping cart for the currently authenticated user."""
    return await CartService.get_or_create_cart(db, current_user.id)

@router.post("/items", response_model=CartResponse)
async def add_item_to_cart(
    item_in: CartItemAdd,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Appends an item to the user's shopping cart."""
    return await CartService.add_to_cart(db, current_user.id, item_in.product_id, item_in.quantity)

@router.put("/items/{item_id}", response_model=CartResponse)
async def update_item_quantity(
    item_id: uuid.UUID,
    item_in: CartItemUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Updates the quantity of a specific item in the shopping cart."""
    return await CartService.update_cart_item(db, current_user.id, item_id, item_in.quantity)

@router.delete("/items/{item_id}", response_model=CartResponse)
async def remove_item_from_cart(
    item_id: uuid.UUID,
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Removes a specific item from the shopping cart."""
    return await CartService.remove_cart_item(db, current_user.id, item_id)

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_shopping_cart(
    current_user: User = Depends(AuthService.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Clears all items from the shopping cart (emptying the cart)."""
    await CartService.clear_cart(db, current_user.id)
