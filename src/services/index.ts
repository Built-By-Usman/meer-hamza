import { MockProductRepository } from './mock/product';
import { MockOrderRepository } from './mock/order';
import { MockCouponRepository } from './mock/coupon';
import { MockAuthRepository } from './mock/auth';

// Singletons that will be used by TanStack Query and Zustand throughout the application.
// When integrating with FastAPI later, simply swap these instances with their API-backed implementations.
export const productRepository = new MockProductRepository();
export const orderRepository = new MockOrderRepository();
export const couponRepository = new MockCouponRepository();
export const authRepository = new MockAuthRepository();

export * from './repositories/product';
export * from './repositories/order';
export * from './repositories/coupon';
export * from './repositories/auth';
export * from './mock/product';
export * from './mock/order';
export * from './mock/coupon';
export * from './mock/auth';
