import type { Metadata } from 'next';
import { CategoriesClient } from '@/features/catalog/components/CategoriesClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Browse Perfume Collections | Timeless by Meer Pakistan",
  description: "Explore our collection of luxury fragrances. From rare Cambodian Oud to mystical Arabic blends and curated gift sets, discover your signature scent.",
  alternates: {
    canonical: "https://timelessbymeer.com/categories"
  },
  openGraph: {
    title: "Browse Perfume Collections | Timeless by Meer Pakistan",
    description: "Explore our collection of luxury fragrances. From rare Cambodian Oud to mystical Arabic blends and curated gift sets, discover your signature scent.",
    url: "https://timelessbymeer.com/categories"
  }
};

export default function CategoriesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Perfume Collections",
    "url": "https://timelessbymeer.com/categories",
    "description": "Explore the premium fragrance collections from Timeless by Meer.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://timelessbymeer.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Categories",
          "item": "https://timelessbymeer.com/categories"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoriesClient />
    </>
  );
}
