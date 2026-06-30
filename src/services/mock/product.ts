import { IProductRepository, ProductFilters, PaginatedProducts } from '../repositories/product';
import { Product, Category, Brand, Review } from '../../types';
import { PRODUCTS, CATEGORIES, BRANDS, REVIEWS } from '../../data/db';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Keep a mutable local copy of reviews for adding new reviews in-session
let mockReviews = [...REVIEWS];

export class MockProductRepository implements IProductRepository {
  private latency = 400;

  async getProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
    await delay(this.latency);
    let items = [...PRODUCTS];

    if (filters) {
      const { category, brand, search, minPrice, maxPrice, rating, stockStatus, discountOnly } = filters;

      // Category filter (slug match)
      if (category && category !== 'all') {
        items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      // Brand filter
      if (brand && brand !== 'all') {
        items = items.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
      }

      // Search keyword filter
      if (search) {
        const query = search.toLowerCase();
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.tags.some((t) => t.toLowerCase().includes(query))
        );
      }

      // Price filter (compare basePrice or variant price if variants exist)
      if (minPrice !== undefined) {
        items = items.filter((p) => p.basePrice >= minPrice);
      }
      if (maxPrice !== undefined) {
        items = items.filter((p) => p.basePrice <= maxPrice);
      }

      // Rating filter
      if (rating !== undefined) {
        items = items.filter((p) => p.rating >= rating);
      }

      // Stock status filter
      if (stockStatus && stockStatus.length > 0) {
        items = items.filter((p) => stockStatus.includes(p.stockStatus));
      }

      // Discounted only filter
      if (discountOnly) {
        items = items.filter((p) => (p.discountPercent || 0) > 0);
      }

      // Sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'price_asc':
            items.sort((a, b) => a.basePrice - b.basePrice);
            break;
          case 'price_desc':
            items.sort((a, b) => b.basePrice - a.basePrice);
            break;
          case 'rating_desc':
            items.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'trending':
            items.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
            break;
          case 'best_seller':
            items.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
            break;
          case 'featured':
          default:
            items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
            break;
        }
      }
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const total = items.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedItems = items.slice(start, start + limit);

    return {
      products: paginatedItems,
      total,
      page,
      pages,
      limit,
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    await delay(this.latency);
    const product = PRODUCTS.find((p) => p.id === id);
    return product ? { ...product } : null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    await delay(this.latency);
    const product = PRODUCTS.find((p) => p.slug === slug);
    return product ? { ...product } : null;
  }

  async getCategories(): Promise<Category[]> {
    await delay(this.latency / 2);
    return [...CATEGORIES];
  }

  async getBrands(): Promise<Brand[]> {
    await delay(this.latency / 2);
    return [...BRANDS];
  }

  async getReviews(productId: string): Promise<Review[]> {
    await delay(this.latency);
    return mockReviews.filter((r) => r.productId === productId);
  }

  async addReview(productId: string, rating: number, comment: string, userName: string, userId: string): Promise<Review> {
    await delay(this.latency);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      verified: true,
    };

    mockReviews.unshift(newReview);

    // Re-calculate aggregate product rating & count in-session
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      const prodReviews = mockReviews.filter((r) => r.productId === productId);
      const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      product.reviewsCount = prodReviews.length;
      product.rating = parseFloat((totalRating / prodReviews.length).toFixed(1));
    }

    return newReview;
  }

  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    await delay(this.latency);
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return [];

    return PRODUCTS.filter((p) => p.id !== productId && (p.category === product.category || p.brand === product.brand)).slice(0, limit);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    await delay(this.latency);
    return PRODUCTS.filter((p) => p.isFeatured);
  }

  async getTrendingProducts(): Promise<Product[]> {
    await delay(this.latency);
    return PRODUCTS.filter((p) => p.isTrending);
  }

  async getNewArrivals(): Promise<Product[]> {
    await delay(this.latency);
    return PRODUCTS.filter((p) => p.isNewArrival);
  }

  async getFlashSaleProducts(): Promise<Product[]> {
    await delay(this.latency);
    return PRODUCTS.filter((p) => p.isFlashSale || (p.discountPercent || 0) > 0);
  }

  async getBestSellers(): Promise<Product[]> {
    await delay(this.latency);
    return PRODUCTS.filter((p) => p.isBestSeller);
  }

  async getBanners(): Promise<any[]> {
    await delay(this.latency);
    return [];
  }
}
