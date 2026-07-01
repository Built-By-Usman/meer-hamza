import * as React from 'react';
import type { Metadata } from 'next';
import { ProductClient } from '@/features/product/components/ProductClient';
import { productRepository } from '@/services';
import { PRODUCTS } from '@/data/db';

export const revalidate = 30;

// Pre-generate routes at build time
export async function generateStaticParams() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${apiBaseUrl}/products?limit=100`);
    if (res.ok) {
      const data = await res.json();
      const items = data.items || [];
      return items.map((prod: any) => ({
        slug: prod.slug,
      }));
    }
  } catch (err: any) {
    console.warn('Failed to pre-render API slugs, using fallback db:', err.message);
  }

  return PRODUCTS.map((prod) => ({
    slug: prod.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let product = null;

  try {
    product = await productRepository.getProductBySlug(slug);
  } catch (err) {
    console.error('Metadata fetch failed:', err);
  }

  // Fallback to local DB if API fails
  if (!product) {
    product = PRODUCTS.find((p) => p.slug === slug) || null;
  }

  if (!product) {
    return {
      title: "Luxury Perfume | Timeless by Meer",
      description: "Discover luxury original fragrances crafted by Meer Hamza in Pakistan."
    };
  }

  const title = `${product.name} | Premium Perfume Pakistan`;
  const description = `${product.description} Inspired by ${product.inspiredBy || 'premium luxury formulation'}. Long-lasting scent by Meer Hamza. Fast delivery in Sargodha & all Pakistan.`;
  const canonicalUrl = `https://timelessbymeer.com/products/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: `${product.name} - Timeless by Meer`,
      description,
      url: canonicalUrl,
      images: [
        {
          url: product.images?.[0] || "/logo.png",
          alt: product.name
        }
      ],
      type: "website"
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let product = null;

  try {
    product = await productRepository.getProductBySlug(slug);
  } catch (err) {
    console.error('Schema fetch failed:', err);
  }

  if (!product) {
    product = PRODUCTS.find((p) => p.slug === slug) || null;
  }

  let jsonLd = null;

  if (product) {
    const isOutOfStock = product.variants?.every((v) => v.stock === 0) ?? false;
    const price = product.variants?.[0]?.price ?? product.basePrice ?? 0;
    
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.images || [ "https://timelessbymeer.com/logo.png" ],
      "description": product.longDescription || product.description,
      "sku": product.variants?.[0]?.sku || product.slug,
      "mpn": product.variants?.[0]?.sku || product.slug,
      "brand": {
        "@type": "Brand",
        "name": "Timeless by Meer"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://timelessbymeer.com/products/${slug}`,
        "priceCurrency": "PKR",
        "price": price,
        "priceValidUntil": "2027-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Timeless by Meer"
        }
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewsCount || 10,
        "bestRating": "5",
        "worstRating": "1"
      } : undefined
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClient slug={slug} />
    </>
  );
}
