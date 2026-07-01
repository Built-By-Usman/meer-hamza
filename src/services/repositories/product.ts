import { Product, Category, Brand, Review } from '../../types';
import { apiClient } from '../../lib/api-client';

export interface ProductFilters {
  category?: string; // category slug
  brand?: string; // brand name
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number; // minimum rating
  stockStatus?: ('in_stock' | 'low_stock' | 'out_of_stock')[];
  discountOnly?: boolean;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'rating_desc' | 'newest' | 'trending' | 'best_seller' | 'name';
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
  getBanners(): Promise<any[]>;
}

export class ApiProductRepository implements IProductRepository {
  private mapProduct(item: any): Product {
    // Map backend variants ({ combination: {volume:'50ml',...}, price, stock }) to ProductVariant[]
    const mappedVariants = (item.variants || []).map((v: any, idx: number) => ({
      id: `${item.id}-v${idx}`,
      sku: `${item.slug}-v${idx}`,
      name: Object.entries(v.combination || {}).map(([k, val]) => `${k}: ${val}`).join(' / ') || item.title,
      price: Number(v.price ?? item.price),
      originalPrice: Number(v.original_price ?? v.price ?? item.original_price ?? item.price),
      discountPercent: Number(v.discount_percent ?? item.discount_percent ?? 0),
      stock: Number(v.stock ?? item.stock ?? 0),
      images: item.images && item.images.length > 0 ? item.images : [],
      attributes: {
        ...(v.combination || {}),
      },
      upc: '',
      weight: 0,
    }));

    return {
      id: item.id,
      name: item.title || item.name || '',
      slug: item.slug,
      description: item.description || '',
      basePrice: Number(item.price),
      originalPrice: Number(item.original_price ?? item.price),
      discountPercent: Number(item.discount_percent ?? 0),
      category: item.category?.slug || 'oud-collection',
      brand: 'Timeless by Meer',
      rating: 0,
      reviewsCount: 0,
      images: item.images && item.images.length > 0 ? item.images : (item.image_url ? [item.image_url] : []),
      variants: mappedVariants,
      specifications: {
        'Fragrance Family': 'Oriental Oud',
        'Longevity': 'Extremely Long Lasting (10h+)',
        'Projection': 'Strong',
      },
      stockStatus: item.stock > 10 ? 'in_stock' : item.stock > 0 ? 'low_stock' : 'out_of_stock',
      tags: ['perfume', 'luxury'],
      isFeatured: true,
      isBestSeller: true,
      createdAt: item.created_at || new Date().toISOString(),
    };
  }

  private mapCategory(item: any): Category {
    const images: Record<string, string> = {
      'oud-collection': 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=800&auto=format&fit=crop',
      'arabic-collection': 'https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=800&auto=format&fit=crop',
      'gift-sets': 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=800&auto=format&fit=crop',
    };
    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      image: images[item.slug] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop',
      description: item.name + ' private collection.',
    };
  }

  async getProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
    const params: Record<string, string | number | boolean> = {};
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        params.category = filters.category;
      }
      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.minPrice !== undefined) {
        params.min_price = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        params.max_price = filters.maxPrice;
      }
      if (filters.page !== undefined) {
        params.page = filters.page;
      }
      if (filters.limit !== undefined) {
        params.page_size = filters.limit;
      }
      if (filters.sort) {
        if (filters.sort === 'price_asc') {
          params.sort_by = 'price';
          params.sort_order = 'asc';
        } else if (filters.sort === 'price_desc') {
          params.sort_by = 'price';
          params.sort_order = 'desc';
        } else if (filters.sort === 'newest') {
          params.sort_by = 'created_at';
          params.sort_order = 'desc';
        } else if (filters.sort === 'name') {
          params.sort_by = 'name';
          params.sort_order = 'asc';
        }
      }
    }

    const response = await apiClient.get<{ items: any[]; total: number; page: number; pages: number }>(
      '/products',
      { params }
    );

    return {
      products: response.items.map(item => this.mapProduct(item)),
      total: response.total,
      page: response.page,
      pages: response.pages,
      limit: filters?.limit || 20,
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      return await this.getProductBySlug(id);
    } catch {
      const res = await this.getProducts({ limit: 100 });
      return res.products.find((p) => p.id === id) || null;
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await apiClient.get<any>(`/products/${slug}`);
      return this.mapProduct(response);
    } catch {
      return null;
    }
  }

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<any[]>('/categories');
    return response.map(item => this.mapCategory(item));
  }

  async getBrands(): Promise<Brand[]> {
    return [
      { id: 'b-mh', name: 'Meer Hamza Private Collection', logo: '/brands/mh.svg', slug: 'meer-hamza' },
    ];
  }

  async getReviews(productId: string): Promise<Review[]> {
    try {
      const res = await apiClient.get<any>(`/reviews/product/${productId}`);
      const items = res.items || res.data || [];
      return items.map((item: any) => ({
        id: String(item.id),
        productId: String(item.product_id),
        userId: String(item.user_id),
        userName: item.user_name || 'Verified Buyer',
        rating: item.rating,
        comment: item.comment || '',
        createdAt: item.created_at || new Date().toISOString(),
        verified: true,
      }));
    } catch {
      return [];
    }
  }

  async addReview(productId: string, rating: number, comment: string, userName: string, userId: string): Promise<Review> {
    const res = await apiClient.post<any>(`/reviews/product/${productId}`, { rating, comment });
    return {
      id: String(res.id),
      productId: String(res.product_id),
      userId: String(res.user_id),
      userName: res.user_name || userName,
      rating: res.rating,
      comment: res.comment || '',
      createdAt: res.created_at || new Date().toISOString(),
      verified: true,
    };
  }

  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    const res = await this.getProducts({ limit: 100 });
    return res.products.filter((p) => p.id !== productId).slice(0, limit);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const res = await this.getProducts({ limit: 10 });
    return res.products;
  }

  async getTrendingProducts(): Promise<Product[]> {
    const res = await this.getProducts({ limit: 10 });
    return res.products;
  }

  async getNewArrivals(): Promise<Product[]> {
    const res = await this.getProducts({ limit: 10 });
    return res.products;
  }

  async getFlashSaleProducts(): Promise<Product[]> {
    const res = await this.getProducts({ limit: 10 });
    return res.products;
  }

  async getBestSellers(): Promise<Product[]> {
    const res = await this.getProducts({ limit: 10 });
    return res.products;
  }

  async getBanners(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>('/banners');
      return response;
    } catch {
      return [];
    }
  }
}
