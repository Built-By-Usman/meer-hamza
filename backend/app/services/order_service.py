from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from decimal import Decimal
import uuid
from typing import List, Tuple, Optional
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.order import Order, OrderItem, OrderStatus

class OrderService:
    @staticmethod
    async def create_order(db: AsyncSession, user_id: uuid.UUID, shipping_address: dict) -> Order:
        # Step-by-step atomic checkout transaction
        async with db.begin():  # Auto-manages commit/rollback on failures
            # 1. Fetch user's cart eagerly loaded
            cart_query = (
                select(Cart)
                .where(Cart.user_id == user_id)
                .options(selectinload(Cart.items).selectinload(CartItem.product))
            )
            cart_res = await db.execute(cart_query)
            cart = cart_res.scalars().first()
            
            if not cart or len(cart.items) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Cannot place order: your shopping cart is empty."
                )
                
            total_amount = Decimal("0.00")
            order_items = []
            
            # 2. Acquire FOR UPDATE row lock on each product to prevent overselling race conditions
            for item in cart.items:
                product_query = (
                    select(Product)
                    .where(Product.id == item.product_id)
                    .with_for_update()
                )
                product_res = await db.execute(product_query)
                product = product_res.scalars().first()
                
                if not product or not product.is_active:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST, 
                        detail=f"Product {item.product_name} is no longer active or available."
                    )
                    
                if product.stock < item.quantity:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST, 
                        detail=f"Insufficient stock for product: {product.name}. Available stock: {product.stock}"
                    )
                    
                # Deduct inventory stock levels
                product.stock -= item.quantity
                
                unit_price = Decimal(str(product.price))
                total_amount += unit_price * item.quantity
                
                order_item = OrderItem(
                    product_id=item.product_id,
                    quantity=item.quantity,
                    unit_price=unit_price
                )
                order_items.append(order_item)
                
            # 3. Persist Order summary record
            db_order = Order(
                user_id=user_id,
                status=OrderStatus.pending,
                total_amount=total_amount,
                shipping_address=shipping_address
            )
            db.add(db_order)
            await db.flush()  # Flush session to fetch generated order UUID
            
            # 4. Link item rows to Order ID
            for item in order_items:
                item.order_id = db_order.id
                db.add(item)
                
            # 5. Clear user's cart items
            for item in cart.items:
                await db.delete(item)
                
        # Retrieve freshly loaded order detail outside transaction scope
        res_query = (
            select(Order)
            .where(Order.id == db_order.id)
            .options(selectinload(Order.items).selectinload(OrderItem.product))
        )
        final_res = await db.execute(res_query)
        return final_res.scalars().first()

    @staticmethod
    async def get_user_orders(
        db: AsyncSession, 
        user_id: uuid.UUID, 
        page: int, 
        page_size: int
    ) -> Tuple[List[Order], int]:
        stmt = select(Order).where(Order.user_id == user_id)
        
        # Get count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_res = await db.execute(count_stmt)
        total = count_res.scalar_one()
        
        # Paginate results
        offset = (page - 1) * page_size
        stmt = stmt.order_by(Order.created_at.desc()).offset(offset).limit(page_size).options(
            selectinload(Order.items).selectinload(OrderItem.product)
        )
        res = await db.execute(stmt)
        orders = list(res.scalars().all())
        return orders, total

    @staticmethod
    async def get_order_detail(db: AsyncSession, order_id: uuid.UUID, user_id: uuid.UUID) -> Order:
        stmt = (
            select(Order)
            .where(Order.id == order_id, Order.user_id == user_id)
            .options(selectinload(Order.items).selectinload(OrderItem.product))
        )
        res = await db.execute(stmt)
        order = res.scalars().first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Order not found or does not belong to you"
            )
        return order

    @staticmethod
    async def cancel_order(db: AsyncSession, order_id: uuid.UUID, user_id: uuid.UUID) -> Order:
        async with db.begin():
            # Retrieve order with lock
            stmt = (
                select(Order)
                .where(Order.id == order_id, Order.user_id == user_id)
                .options(selectinload(Order.items).selectinload(OrderItem.product))
                .with_for_update()
            )
            res = await db.execute(stmt)
            order = res.scalars().first()
            
            if not order:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="Order not found"
                )
                
            if order.status != OrderStatus.pending:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Only pending orders can be cancelled."
                )
                
            # Restore inventory stock for each order item
            for item in order.items:
                product_query = select(Product).where(Product.id == item.product_id).with_for_update()
                product_res = await db.execute(product_query)
                product = product_res.scalars().first()
                if product:
                    product.stock += item.quantity
                    
            order.status = OrderStatus.cancelled
            
        return await OrderService.get_order_detail(db, order_id, user_id)

    @staticmethod
    async def get_admin_orders(
        db: AsyncSession, 
        page: int, 
        page_size: int, 
        status_filter: Optional[str] = None
    ) -> Tuple[List[Order], int]:
        stmt = select(Order)
        if status_filter:
            stmt = stmt.where(Order.status == status_filter)
            
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_res = await db.execute(count_stmt)
        total = count_res.scalar_one()
        
        offset = (page - 1) * page_size
        stmt = stmt.order_by(Order.created_at.desc()).offset(offset).limit(page_size).options(
            selectinload(Order.items).selectinload(OrderItem.product)
        )
        res = await db.execute(stmt)
        orders = list(res.scalars().all())
        return orders, total

    @staticmethod
    async def update_order_status(db: AsyncSession, order_id: uuid.UUID, new_status: OrderStatus) -> Order:
        async with db.begin():
            stmt = (
                select(Order)
                .where(Order.id == order_id)
                .options(selectinload(Order.items).selectinload(OrderItem.product))
                .with_for_update()
            )
            res = await db.execute(stmt)
            order = res.scalars().first()
            
            if not order:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="Order not found"
                )
                
            current = order.status
            allowed = False
            
            # Enforce order state machine transitions
            if current == OrderStatus.pending:
                allowed = new_status in [OrderStatus.confirmed, OrderStatus.cancelled]
            elif current == OrderStatus.confirmed:
                allowed = new_status in [OrderStatus.shipped, OrderStatus.cancelled]
            elif current == OrderStatus.shipped:
                allowed = new_status == OrderStatus.delivered
                
            if not allowed and current != new_status:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail=f"Invalid state transition: cannot change order status from {current} to {new_status}."
                )
                
            # Restore stock if changing to cancelled
            if new_status == OrderStatus.cancelled and current != OrderStatus.cancelled:
                for item in order.items:
                    product_query = select(Product).where(Product.id == item.product_id).with_for_update()
                    product_res = await db.execute(product_query)
                    product = product_res.scalars().first()
                    if product:
                        product.stock += item.quantity
                        
            order.status = new_status
            
        return order
