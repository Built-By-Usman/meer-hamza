import { MetadataRoute } from 'next';
import { PRODUCTS, CATEGORIES } from '@/data/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://timelessbymeer.com';

  // Base pages
  const routes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/categories',
    '/privacy-policy',
    '/terms',
    '/shipping-policy',
    '/refund-policy',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Product detail pages
  const productRoutes = PRODUCTS.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category listing pages
  const categoryRoutes = CATEGORIES.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Blog posts
  const blogSlugs = [
    'best-perfumes-in-pakistan',
    'luxury-perfume-buying-guide',
    'fragrance-layering-guide',
  ];
  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...routes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
