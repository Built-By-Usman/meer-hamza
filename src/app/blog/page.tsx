import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { Sparkles, Calendar, User, ArrowRight } from 'lucide-react';

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
      <main className="flex-1 bg-[#050505] text-foreground font-sans">
        
        {/* Banner Section */}
        <section className="relative h-[250px] bg-zinc-950 flex flex-col justify-center items-center px-6 overflow-hidden border-b border-primary/10 mb-12">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-[#050505] z-10" />
          <div className="absolute inset-0 bg-cover bg-center opacity-25 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1800')" }} />
          
          <div className="relative z-20 text-center space-y-3">
            <span className="text-[9px] uppercase tracking-[0.35em] font-bold text-primary flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3 fill-primary text-primary" /> Scent Editorial
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-widest uppercase">
              The Scent Blog
            </h1>
            <div className="h-[1px] w-16 bg-primary/40 mx-auto mt-2" />
          </div>
        </section>

        {/* Blog grid list */}
        <section className="max-w-6xl mx-auto py-8 px-6 sm:px-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article 
                key={post.slug} 
                className="group border border-zinc-900 hover:border-primary/20 rounded-2xl overflow-hidden bg-zinc-950/20 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-500"
              >
                <div>
                  {/* Blog Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-900 border-b border-zinc-900/60">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="object-cover w-full h-full opacity-70 group-hover:scale-103 transition-transform duration-700" 
                    />
                  </div>
                  
                  {/* Blog Text */}
                  <div className="p-6 text-left space-y-3">
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-primary" /> {post.publishDate}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3 text-primary" /> {post.author}</span>
                    </div>
                    
                    <h2 className="font-serif text-lg sm:text-xl text-white font-light group-hover:text-primary transition-colors duration-300 leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                
                {/* Blog Action button */}
                <div className="px-6 pb-6 text-left">
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors cursor-pointer group/link"
                  >
                    Read Article <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
