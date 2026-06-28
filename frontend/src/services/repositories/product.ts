import { Product, Category, Brand, Review } from '../../types';

export interface ProductFilters {
  category?: string; // category slug
  brand?: string; // brand name
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number; // minimum rating
  stockStatus?: ('in_stock' | 'low_stock' | 'out_of_stock')[];
  discountOnly?: boolean;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'rating_desc' | 'newest' | 'trending' | 'best_seller';
  limit?: number;
  page?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface IProductRepository {
  getProducts(filters?: ProductFilters): Promise<PaginatedProducts>;
  getProductById(id: string): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getCategories(): Promise<Category[]>;
  getBrands(): Promise<Brand[]>;
  getReviews(productId: string): Promise<Review[]>;
  addReview(productId: string, rating: number, comment: string, userName: string, userId: string): Promise<Review>;
  getRelatedProducts(productId: string, limit?: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getTrendingProducts(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  getFlashSaleProducts(): Promise<Product[]>;
  getBestSellers(): Promise<Product[]>;
}
