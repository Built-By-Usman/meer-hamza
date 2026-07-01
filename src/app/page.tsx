import type { Metadata } from 'next';
import { HomeClient } from '@/features/home/components/HomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Timeless by Meer | Luxury Perfumes & Fragrances Store Pakistan",
  description: "Experience Pakistan's premium luxury perfume brand by Meer Hamza. Shop original, long-lasting signature fragrances crafted in Sargodha, Punjab. Nationwide express delivery.",
  alternates: {
    canonical: "https://timelessbymeer.com"
  },
  openGraph: {
    title: "Timeless by Meer | Luxury Perfumes & Fragrances Store Pakistan",
    description: "Experience Pakistan's premium luxury perfume brand by Meer Hamza. Shop original, long-lasting signature fragrances crafted in Sargodha, Punjab. Nationwide express delivery.",
    url: "https://timelessbymeer.com",
    siteName: "Timeless by Meer",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Timeless by Meer Fragrances Collection"
      }
    ],
    locale: "en_US",
    type: "website"
  }
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://timelessbymeer.com/#website",
        "url": "https://timelessbymeer.com/",
        "name": "Timeless by Meer",
        "description": "Luxury Perfumes & Fragrances Store in Pakistan",
        "publisher": {
          "@id": "https://timelessbymeer.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://timelessbymeer.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://timelessbymeer.com/#organization",
        "name": "Timeless by Meer",
        "url": "https://timelessbymeer.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://timelessbymeer.com/logo.png"
        },
        "founder": {
          "@type": "Person",
          "name": "Meer Hamza"
        },
        "sameAs": [
          "https://www.instagram.com/timelessbymeer",
          "https://www.facebook.com/timelessbymeer"
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
