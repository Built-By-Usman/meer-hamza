import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant, OrderItem, Coupon } from '../types';

export interface CartState {
  items: OrderItem[];
  coupon: Coupon | null;
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  _hasHydrated: boolean;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
}

const TAX_RATE = 0.08; // 8% sales tax
const FREE_SHIPPING_THRESHOLD = 0; // Free shipping threshold (0 means disabled)
const STANDARD_SHIPPING_COST = 250;

const calculateTotals = (items: OrderItem[], coupon: Coupon | null) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let discount = 0;
  let shippingCost = subtotal > 0 ? STANDARD_SHIPPING_COST : 0;

  if (coupon) {
    if (coupon.code === 'FREESHIP') {
      shippingCost = 0;
    } else if (coupon.type === 'percentage') {
      discount = subtotal * (coupon.value / 100);
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, subtotal);
    }
  }

  // Free shipping threshold check (after regular discount)
  if (FREE_SHIPPING_THRESHOLD > 0 && subtotal - discount >= FREE_SHIPPING_THRESHOLD) {
    shippingCost = 0;
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = parseFloat((taxableAmount * TAX_RATE).toFixed(2));
  const total = parseFloat((taxableAmount + tax + shippingCost).toFixed(2));

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    tax,
    shippingCost,
    total,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      subtotal: 0,
      discount: 0,
      tax: 0,
      shippingCost: 0,
      total: 0,
      _hasHydrated: false,

      addToCart: (product, variant, quantity = 1) => {
        const { items, coupon } = get();
        const productId = product.id;
        const variantId = variant?.id;
        const sku = variant?.sku || product.id;
        const price = variant?.price !== undefined ? variant.price : product.basePrice;
        const image = variant?.images?.[0] || product.images[0];
        const name = product.name;

        // Extract attributes
        const attributes: Record<string, string> = {};
        if (variant?.attributes) {
          Object.entries(variant.attributes).forEach(([key, val]) => {
            if (val) attributes[key] = val;
          });
        }

        const existingItemIndex = items.findIndex(
          (item) => item.productId === productId && item.variantId === variantId
        );

        let newItems = [...items];

        if (existingItemIndex > -1) {
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity,
          };
        } else {
          newItems.push({
            productId,
            variantId,
            name,
            sku,
            price,
            quantity,
            image,
            attributes,
          });
        }

        const totals = calculateTotals(newItems, coupon);
        set({ items: newItems, ...totals });
      },

      removeFromCart: (productId, variantId) => {
        const { items, coupon } = get();
        const newItems = items.filter(
          (item) => !(item.productId === productId && item.variantId === variantId)
        );
        const totals = calculateTotals(newItems, coupon);
        set({ items: newItems, ...totals });
      },

      updateQuantity: (productId, quantity, variantId) => {
        const { items, coupon } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId, variantId);
          return;
        }

        const newItems = items.map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            return { ...item, quantity };
          }
          return item;
        });

        const totals = calculateTotals(newItems, coupon);
        set({ items: newItems, ...totals });
      },

      applyCoupon: (coupon) => {
        const { items } = get();
        const totals = calculateTotals(items, coupon);
        set({ coupon, ...totals });
      },

      removeCoupon: () => {
        const { items } = get();
        const totals = calculateTotals(items, null);
        set({ coupon: null, ...totals });
      },

      clearCart: () => {
        set({
          items: [],
          coupon: null,
          subtotal: 0,
          discount: 0,
          tax: 0,
          shippingCost: 0,
          total: 0,
        });
      },
    }),
    {
      name: 'premium-cart-storage',
      onRehydrateStorage: () => (state) => {
        // Called once localStorage has been read and state has been restored
        if (state) state._hasHydrated = true;
      },
    }
  )
);
