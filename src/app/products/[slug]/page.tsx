import * as React from 'react';
import { ProductClient } from '@/features/product/components/ProductClient';
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

  // Fallback to mock product slugs if API is unavailable during build
  return PRODUCTS.map((prod) => ({
    slug: prod.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  return <ProductClient slug={slug} />;
}
