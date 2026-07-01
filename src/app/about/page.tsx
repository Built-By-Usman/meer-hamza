import type { Metadata } from 'next';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { Sparkles, Quote, Award, Target, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: "About Us | Timeless by Meer - Luxury Perfume House",
  description: "Discover the journey of Timeless by Meer, a premium luxury perfume brand founded by Meer Hamza in Sargodha, Pakistan. Read our mission, vision, and commitment to fine craftsmanship.",
  alternates: {
    canonical: "https://timelessbymeer.com/about"
  }
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://timelessbymeer.com/about/#webpage",
        "url": "https://timelessbymeer.com/about",
        "name": "About Us | Timeless by Meer",
        "description": "Learn about the luxury fragrance journey of Timeless by Meer, founded by Meer Hamza in Sargodha, Pakistan."
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
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://timelessbymeer.com/#localbusiness",
        "name": "Timeless by Meer",
        "image": "https://timelessbymeer.com/logo.png",
        "telephone": "+923211648089",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "University Road",
          "addressLocality": "Sargodha",
          "addressRegion": "Punjab",
          "addressCountry": "PK"
        },
        "url": "https://timelessbymeer.com/about"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://timelessbymeer.com/about/#breadcrumb",
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
            "name": "About Us",
            "item": "https://timelessbymeer.com/about"
          }
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
      <Header />
      
      <main className="min-h-screen bg-[#050505] text-foreground font-sans">
        
        {/* Banner Section */}
        <section className="relative h-[250px] bg-zinc-950 flex flex-col justify-center items-center px-6 overflow-hidden border-b border-primary/10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-[#050505] z-10" />
          <div className="absolute inset-0 bg-cover bg-center opacity-25 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800')" }} />
          
          <div className="relative z-20 text-center space-y-3">
            <span className="text-[9px] uppercase tracking-[0.35em] font-bold text-primary flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3 fill-primary text-primary" /> Established in Pakistan
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-widest uppercase">
              Our Journey
            </h1>
            <div className="h-[1px] w-16 bg-primary/40 mx-auto mt-2" />
          </div>
        </section>

        {/* Brand Story Editorial Content */}
        <section className="max-w-5xl mx-auto py-16 px-6 sm:px-8 space-y-16">
          
          {/* Col 1: Introduction Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-zinc-300 leading-relaxed font-light text-sm sm:text-base">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-light tracking-wide leading-tight">
                Crafting the Spirit of Absolute Luxury
              </h2>
              <p>
                Welcome to <strong className="text-white font-medium">Timeless by Meer</strong>, a luxury perfume brand based in the cultural hub of <strong className="text-white font-medium">Sargodha, Punjab, Pakistan</strong>. Our brand represents a relentless pursuit of aromatic perfection, blending high-end design with traditional oriental depth.
              </p>
              <p>
                We believe a fragrance is much more than a cosmetic addition; it is an invisible signature of identity, a vessel of memory, and a bold statement of presence.
              </p>
            </div>
            
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-900 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=800&auto=format&fit=crop" 
                alt="Fine perfumery ingredients" 
                className="object-cover w-full h-full opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
          </div>

          {/* Scent Quote Editorial Banner */}
          <div className="border-y border-primary/20 py-10 px-6 text-center max-w-3xl mx-auto space-y-4">
            <Quote className="h-6 w-6 text-primary mx-auto opacity-60" />
            <p className="font-serif text-lg sm:text-2xl italic text-zinc-200 leading-relaxed font-light">
              "A signature scent does not simply announce your arrival; it seals your presence in the memory of those you leave behind."
            </p>
            <span className="block text-[10px] uppercase tracking-widest text-primary font-bold">
              — Timeless by Meer Philosophy
            </span>
          </div>

          {/* About the Founder Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-zinc-950/40 p-8 sm:p-10 rounded-3xl border border-primary/10">
            <div className="md:col-span-2 space-y-4 text-zinc-300 font-light text-sm sm:text-base">
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">The Visionary</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-light tracking-wide">
                Meer Hamza, Founder
              </h2>
              <p className="leading-relaxed">
                Timeless by Meer was envisioned and built by <strong className="text-white font-medium">Meer Hamza</strong>. Driven by a passion for premium scents and the standard of local perfumery, Meer Hamza set out to create a collection of Extrait de Parfum that matches international prestige.
              </p>
              <p className="leading-relaxed text-xs sm:text-sm">
                His signature process ensures that only carefully selected raw ingredients make it to the blending phase, creating scents that guarantee projection, sillage, and longevity in Pakistan's warm climates.
              </p>
            </div>
            
            <div className="relative aspect-square w-full max-w-[220px] mx-auto rounded-full overflow-hidden border-2 border-primary/20 shadow-xl bg-zinc-900 flex items-center justify-center">
              {/* Fallback elegant monogram placeholder since founder picture is not available */}
              <div className="font-serif text-5xl font-light text-primary select-none">
                MH
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>
          </div>

          {/* Mission & Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="border border-zinc-900 bg-zinc-950/20 p-8 rounded-2xl space-y-4 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                <h3 className="font-serif text-xl text-white font-normal">Our Mission</h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                To redefine luxury perfumery in Pakistan by crafting long-lasting, premium Extrait de Parfum formulations that are accessible to fragrance connoisseurs, ensuring authenticity and sophistication in every single drop.
              </p>
            </div>
            
            <div className="border border-zinc-900 bg-zinc-950/20 p-8 rounded-2xl space-y-4 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
                <h3 className="font-serif text-xl text-white font-normal">Our Vision</h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                To become Pakistan's leading luxury fragrance house, recognized globally for artisanal craftsmanship, exquisite quality, and premium sensory experiences that transcend boundaries.
              </p>
            </div>
          </div>

          {/* Why Choose Us & Delivery Section */}
          <div className="space-y-6 pt-4 text-zinc-300">
            <h2 className="font-serif text-2xl font-normal text-white text-center sm:text-left">
              Why Choose Timeless by Meer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center sm:text-left">
              <div className="space-y-2 border-l border-primary/20 pl-4 py-1">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Longevity & Sillage</h4>
                <p className="text-xs font-light text-zinc-400">High-concentration Extrait de Parfum formulations optimized for long-lasting sillage on skin and fabrics.</p>
              </div>
              <div className="space-y-2 border-l border-primary/20 pl-4 py-1">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Premium Packaging</h4>
                <p className="text-xs font-light text-zinc-400">Arrives inside our signature ivory cotton box wrapped in premium grosgrain ribbon, perfect for gifting.</p>
              </div>
              <div className="space-y-2 border-l border-primary/20 pl-4 py-1">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Nationwide Delivery</h4>
                <p className="text-xs font-light text-zinc-400">Priority express dispatch to Sargodha, Punjab, Lahore, Karachi, and all cities across Pakistan.</p>
              </div>
            </div>
          </div>

          {/* Localized Details Footer info */}
          <div className="border-t border-zinc-900 pt-10 text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-semibold">Timeless by Meer</p>
            <p className="text-xs font-light text-zinc-400">
              University Road, Sargodha, Punjab, Pakistan
            </p>
            <p className="text-xs font-light text-zinc-400">
              Bespoke Contact: <a href="tel:+923211648089" className="text-primary hover:text-white transition-colors font-bold underline">+92 321 1648089</a>
            </p>
          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
