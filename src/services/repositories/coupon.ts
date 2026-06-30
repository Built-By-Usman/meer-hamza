import { Coupon } from '../../types';

export interface ICouponRepository {
  validateCoupon(code: string, subtotal: number): Promise<Coupon | null>;
}
