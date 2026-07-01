import type { Metadata } from 'next';
import { CategoryClient } from '@/features/catalog/components/CategoryClient';
import { CATEGORIES } from '@/data/db';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find(c => c.slug === slug);
  const title = category ? `${category.name} | Luxury Fragrance Collection` : "Luxury Fragrance Collections";
  const description = category 
    ? `${category.description} Shop original, premium long-lasting perfumes by Meer Hamza. Fast delivery in Sargodha and all Pakistan.`
    : "Browse our collections of luxury long-lasting fragrances. Handcrafted premium scents for men, women, and unisex wear.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://timelessbymeer.com/category/${slug}`
    },
    openGraph: {
      title: `${title} | Timeless by Meer`,
      description,
      url: `https://timelessbymeer.com/category/${slug}`,
      images: [
        {
          url: category?.image || "/logo.png",
          alt: title
        }
      ]
    }
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find(c => c.slug === slug);
  const title = category ? category.name : "Perfume Collection";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "url": `https://timelessbymeer.com/category/${slug}`,
    "description": category?.description || "Luxury fragrances collection by Timeless by Meer.",
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
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": title,
          "item": `https://timelessbymeer.com/category/${slug}`
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
      <CategoryClient slug={slug} />
    </>
  );
}
