import { ApiProductRepository } from './repositories/product';
import { ApiOrderRepository } from './repositories/order';
import { MockCouponRepository } from './mock/coupon';
import { ApiAuthRepository } from './repositories/auth';
import { ApiSettingsRepository } from './repositories/settings';

// Singletons that will be used by TanStack Query and Zustand throughout the application.
// When integrating with FastAPI later, simply swap these instances with their API-backed implementations.
export const productRepository = new ApiProductRepository();
export const orderRepository = new ApiOrderRepository();
export const couponRepository = new MockCouponRepository();
export const authRepository = new ApiAuthRepository();
export const settingsRepository = new ApiSettingsRepository();

export * from './repositories/product';
export * from './repositories/order';
export * from './repositories/coupon';
export * from './repositories/auth';
export * from './repositories/settings';
export * from './mock/product';
export * from './mock/order';
export * from './mock/coupon';
export * from './mock/auth';
