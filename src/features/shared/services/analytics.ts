import { Product, Order, OrderItem } from '@/types';

// Structured telemetry layer ready to connect to Segment, PostHog, or Google Tag Manager.
export const analytics = {
  trackProductView(product: Product) {
    console.log(
      '%c[Telemetry] Product View%c ' + product.name,
      'color: #3b82f6; font-weight: bold; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;',
      'color: inherit;',
      {
        id: product.id,
        name: product.name,
        price: product.basePrice,
        category: product.category,
        brand: product.brand,
      }
    );
  },

  trackSearch(query: string) {
    console.log(
      '%c[Telemetry] Search Query%c ' + query,
      'color: #8b5cf6; font-weight: bold; background: #f3e8ff; padding: 2px 6px; border-radius: 4px;',
      'color: inherit;',
      { query }
    );
  },

  trackAddToCart(item: { name: string; price: number; quantity: number }) {
    console.log(
      '%c[Telemetry] Add to Cart%c ' + item.name,
      'color: #10b981; font-weight: bold; background: #d1fae5; padding: 2px 6px; border-radius: 4px;',
      'color: inherit;',
      item
    );
  },

  trackWishlistToggle(product: Product, isFav: boolean) {
    console.log(
      `%c[Telemetry] Wishlist ${isFav ? 'Add' : 'Remove'}%c ` + product.name,
      'color: #ec4899; font-weight: bold; background: #fce7f3; padding: 2px 6px; border-radius: 4px;',
      'color: inherit;',
      { id: product.id, name: product.name }
    );
  },

  trackCheckoutStart(items: OrderItem[], total: number) {
    console.log(
      '%c[Telemetry] Checkout Started%c ' + items.length + ' items',
      'color: #f59e0b; font-weight: bold; background: #fef3c7; padding: 2px 6px; border-radius: 4px;',
      'color: inherit;',
      { itemCount: items.length, total }
    );
  },

  trackPurchase(order: Order) {
    console.log(
      '%c[Telemetry] Purchase Completed 🎉%c Order ID: ' + order.id,
      'color: #10b981; font-weight: bold; background: #d1fae5; padding: 4px 8px; border-radius: 4px;',
      'color: inherit;',
      order
    );
  },
};
