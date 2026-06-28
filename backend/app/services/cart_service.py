from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.models.cart import Cart, CartItem
from app.models.product import Product

class CartService:
    @staticmethod
    async def get_or_create_cart(db: AsyncSession, user_id: uuid.UUID) -> Cart:
        # Use SKIP LOCKED row locks to prevent database race conditions on heavy concurrent cart loads
        query = (
            select(Cart)
            .where(Cart.user_id == user_id)
            .options(selectinload(Cart.items).selectinload(CartItem.product))
            .with_for_update(skip_locked=True)
        )
        result = await db.execute(query)
        cart = result.scalars().first()
        
        if not cart:
            check_query = (
                select(Cart)
                .where(Cart.user_id == user_id)
                .options(selectinload(Cart.items).selectinload(CartItem.product))
            )
            res = await db.execute(check_query)
            cart = res.scalars().first()
            
            if not cart:
                cart = Cart(user_id=user_id)
                db.add(cart)
                try:
                    await db.commit()
                except Exception:
                    await db.rollback()
                    res = await db.execute(check_query)
                    cart = res.scalars().first()
                
                # Relock matching query conditions
                result = await db.execute(query)
                cart = result.scalars().first() or cart
                
        return cart

    @staticmethod
    async def add_to_cart(db: AsyncSession, user_id: uuid.UUID, product_id: uuid.UUID, quantity: int) -> Cart:
        async with db.begin():  # Automatically commits or rolls back on exit
            cart = await CartService.get_or_create_cart(db, user_id)
            
            product_result = await db.execute(
                select(Product).where(Product.id == product_id, Product.is_active == True)
            )
            product = product_result.scalars().first()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="Product not found or inactive"
                )
            
            if product.stock < quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Requested quantity exceeds available product stock"
                )
            
            # Locate product duplicate inside cart items list
            cart_item = None
            for item in cart.items:
                if item.product_id == product_id:
                    cart_item = item
                    break
            
            if cart_item:
                new_qty = cart_item.quantity + quantity
                # Cap the item quantity at product stock limits
                if new_qty > product.stock:
                    new_qty = product.stock
                cart_item.quantity = new_qty
            else:
                cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
                db.add(cart_item)
                
        return await CartService.get_or_create_cart(db, user_id)

    @staticmethod
    async def update_cart_item(db: AsyncSession, user_id: uuid.UUID, cart_item_id: uuid.UUID, quantity: int) -> Cart:
        async with db.begin():
            cart = await CartService.get_or_create_cart(db, user_id)
            
            item_result = await db.execute(
                select(CartItem)
                .where(CartItem.id == cart_item_id, CartItem.cart_id == cart.id)
                .options(selectinload(CartItem.product))
            )
            cart_item = item_result.scalars().first()
            if not cart_item:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="Cart item not found"
                )
                
            if cart_item.product.stock < quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Requested quantity exceeds available product stock"
                )
                
            cart_item.quantity = quantity
            
        return await CartService.get_or_create_cart(db, user_id)

    @staticmethod
    async def remove_cart_item(db: AsyncSession, user_id: uuid.UUID, cart_item_id: uuid.UUID) -> Cart:
        async with db.begin():
            cart = await CartService.get_or_create_cart(db, user_id)
            
            item_result = await db.execute(
                select(CartItem).where(CartItem.id == cart_item_id, CartItem.cart_id == cart.id)
            )
            cart_item = item_result.scalars().first()
            if cart_item:
                await db.delete(cart_item)
                
        return await CartService.get_or_create_cart(db, user_id)

    @staticmethod
    async def clear_cart(db: AsyncSession, user_id: uuid.UUID) -> None:
        async with db.begin():
            cart = await CartService.get_or_create_cart(db, user_id)
            for item in cart.items:
                await db.delete(item)
