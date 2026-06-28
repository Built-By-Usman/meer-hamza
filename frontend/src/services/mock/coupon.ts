import { ICouponRepository } from '../repositories/coupon';
import { Coupon } from '../../types';
import { COUPONS } from '../../data/db';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockCouponRepository implements ICouponRepository {
  private latency = 300;

  async validateCoupon(code: string, subtotal: number): Promise<Coupon | null> {
    await delay(this.latency);
    const coupon = COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
      return null;
    }

    if (subtotal < coupon.minSpend) {
      return null; // Minimum spend not met
    }

    // Check expiry
    const expiry = new Date(coupon.expiresAt).getTime();
    const now = new Date().getTime();
    if (now > expiry) {
      return null; // Coupon expired
    }

    return { ...coupon };
  }
}
