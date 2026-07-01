import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  author: string;
  image: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "best-perfumes-in-pakistan",
    title: "Best Perfumes in Pakistan: The Ultimate Fragrance Guide",
    excerpt: "Discover the top luxury and premium fragrances in Pakistan for 2026. Explore longevity, sillage, and what makes Pakistani perfume houses unique.",
    publishDate: "2026-06-25",
    author: "Meer Hamza",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
    content: "Finding the perfect scent in Pakistan's warm climate requires an understanding of perfume concentration and notes. In this comprehensive guide, we explore the best perfumes available in Pakistan, focusing on longevity and premium ingredients.\n\nLongevity is key when choosing a perfume in Pakistan. The extreme heat can cause top notes to evaporate quickly, making deep wood bases like agarwood (oud), sandalwood, and amber essential for lasting projection. At Timeless by Meer, our Extrait de Parfum formulations offer higher concentration ratios (25%+) compared to standard designer brands, guaranteeing a lasting fragrance throughout the day."
  },
  {
    slug: "luxury-perfume-buying-guide",
    title: "Luxury Perfume Buying Guide: How to Invest in Fine Scents",
    excerpt: "Everything you need to know about fragrance families, notes, and selecting a signature scent that represents your unique personality.",
    publishDate: "2026-06-20",
    author: "Meer Hamza",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
    content: "Investing in a luxury fragrance is a personal journey. This guide details how to choose between fresh, oriental, woody, and floral scent families, and how to read the complex note pyramids (top, heart, and base notes).\n\nUnderstanding scent structure helps you make informed purchase decisions. Top notes provide the initial impression, heart notes form the core theme, and base notes secure the fragrance over time. Choosing inspired or signature formulations that harmonize base woods with floral heights offers the finest olfactory experience."
  },
  {
    slug: "fragrance-layering-guide",
    title: "Art of Fragrance Layering: How to Create a Custom Scent",
    excerpt: "Learn how to combine and layer different perfume notes to create a personalized signature fragrance that is uniquely yours.",
    publishDate: "2026-06-15",
    author: "Meer Hamza",
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=800&auto=format&fit=crop",
    content: "Fragrance layering is an ancient art that allows you to express your individual style. By combining lighter citrus scents with rich oud or amber bases, you can customize a fragrance that changes dynamically on your skin.\n\nTo begin layering, always apply the heaviest fragrance first. Deep woody or musk bases should settle on your pulse points before you layer floral or fresh accords on top. Experiment with combining different notes from Timeless by Meer's Private Collection to discover your ultimate signature scent."
  }
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  
  if (!post) {
    return {
      title: "Blog Post Not Found | Timeless by Meer"
    };
  }

  return {
    title: `${post.title} | Timeless by Meer`,
    description: post.excerpt,
    alternates: {
      canonical: `https://timelessbymeer.com/blog/${slug}`
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://timelessbymeer.com/blog/${slug}`,
      images: [{ url: post.image, alt: post.title }]
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [post.image],
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://timelessbymeer.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Timeless by Meer",
      "logo": {
        "@type": "ImageObject",
        "url": "https://timelessbymeer.com/logo.png"
      }
    },
    "description": post.excerpt
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 bg-background text-foreground py-16 px-6 max-w-3xl mx-auto font-sans">
        <div className="mb-6">
          <Link href="/blog" className="text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
            ← Back to Blog
          </Link>
        </div>
        
        <article className="space-y-6">
          <header className="space-y-4">
            <span className="text-[10px] uppercase tracking-wider text-primary font-medium">{post.publishDate} · Written by {post.author}</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-white font-light tracking-wide leading-tight">
              {post.title}
            </h1>
          </header>
          
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-secondary my-8">
            <img src={post.image} alt={post.title} className="object-cover w-full h-full opacity-80" />
          </div>
          
          <div className="text-zinc-300 font-light text-sm sm:text-base leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
