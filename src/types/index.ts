export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  stock: number;
  images: string[];
  attributes: {
    color?: string;
    size?: string;
    material?: string;
    storage?: string;
    weight?: string;
    [key: string]: string | undefined;
  };
  upc: string;
  weight: number; // in kg
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  inspiredBy?: string;
  basePrice: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string; // category slug
  brand: string; // brand name
  rating: number;
  reviewsCount: number;
  images: string[];
  variants: ProductVariant[];
  specifications: Record<string, string>;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  tags: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  featuredProductCount?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  expiresAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface Address {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  attributes?: Record<string, string>;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  paymentMethod: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
}
