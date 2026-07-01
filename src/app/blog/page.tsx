import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

export const metadata: Metadata = {
  title: "Scent Secrets Blog | Timeless by Meer - Perfume Guides Pakistan",
  description: "Read the latest fragrance guides, perfume layering tips, and luxury perfume buying reviews by Meer Hamza. Discover scent longevity secrets.",
  alternates: {
    canonical: "https://timelessbymeer.com/blog"
  }
};

const BLOG_POSTS = [
  {
    slug: "best-perfumes-in-pakistan",
    title: "Best Perfumes in Pakistan: The Ultimate Fragrance Guide",
    excerpt: "Discover the top luxury and premium fragrances in Pakistan for 2026. Explore longevity, sillage, and what makes Pakistani perfume houses unique.",
    publishDate: "2026-06-25",
    author: "Meer Hamza",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "luxury-perfume-buying-guide",
    title: "Luxury Perfume Buying Guide: How to Invest in Fine Scents",
    excerpt: "Everything you need to know about fragrance families, notes, and selecting a signature scent that represents your unique personality.",
    publishDate: "2026-06-20",
    author: "Meer Hamza",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
  },
  {
    slug: "fragrance-layering-guide",
    title: "Art of Fragrance Layering: How to Create a Custom Scent",
    excerpt: "Learn how to combine and layer different perfume notes to create a personalized signature fragrance that is uniquely yours.",
    publishDate: "2026-06-15",
    author: "Meer Hamza",
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=800&auto=format&fit=crop",
  }
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background text-foreground py-16 px-6 max-w-5xl mx-auto font-sans">
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide text-center mb-4">
          Scent Secrets Blog
        </h1>
        <p className="font-sans text-xs sm:text-sm text-zinc-400 font-light tracking-wide text-center mb-12 max-w-md mx-auto">
          Insights, guides, and stories from our master perfumers. Learn how to select, wear, and preserve your luxury scents.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950/30 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300">
              <div>
                <div className="relative aspect-video w-full bg-secondary">
                  <img src={post.image} alt={post.title} className="object-cover w-full h-full opacity-80" />
                </div>
                <div className="p-6">
                  <span className="text-[10px] uppercase tracking-wider text-primary font-medium">{post.publishDate}</span>
                  <h2 className="font-serif text-lg text-white font-normal mt-2 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="font-sans text-xs text-zinc-400 font-light mt-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <Link href={`/blog/${post.slug}`} className="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
