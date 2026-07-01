import type { Metadata } from 'next';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { MapPin, Phone, Clock, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: "Contact Us | Timeless by Meer - Luxury Perfumes Pakistan",
  description: "Get in touch with Timeless by Meer. Visit our store on University Road, Sargodha, Punjab or call +92 321 1648089 for orders, support, and inquiries.",
  alternates: {
    canonical: "https://timelessbymeer.com/contact"
  }
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://timelessbymeer.com/contact/#webpage",
        "url": "https://timelessbymeer.com/contact",
        "name": "Contact Us | Timeless by Meer",
        "description": "Contact details and flagship store location for Timeless by Meer in Sargodha, Pakistan."
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
        "url": "https://timelessbymeer.com/contact"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://timelessbymeer.com/contact/#breadcrumb",
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
            "name": "Contact Us",
            "item": "https://timelessbymeer.com/contact"
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
          <div className="absolute inset-0 bg-cover bg-center opacity-25 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1800')" }} />
          
          <div className="relative z-20 text-center space-y-3">
            <span className="text-[9px] uppercase tracking-[0.35em] font-bold text-primary flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3 fill-primary text-primary" /> Bespoke Client Services
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-widest uppercase">
              Contact Us
            </h1>
            <div className="h-[1px] w-16 bg-primary/40 mx-auto mt-2" />
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-5xl mx-auto py-16 px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-4 items-start">
            
            {/* Info Column (Left) */}
            <div className="md:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Flagship House</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-light tracking-wide">
                  Visit the Maison
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Experience our collection in person, request custom fragrance curation, or coordinate order collections.
                </p>
              </div>

              {/* Location Card */}
              <div className="flex gap-4 p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 shadow-md">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-xs uppercase tracking-wider text-white font-semibold">Address</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    University Road,<br />
                    Sargodha, Punjab, Pakistan
                  </p>
                </div>
              </div>

              {/* Call Card */}
              <div className="flex gap-4 p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 shadow-md">
                <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-xs uppercase tracking-wider text-white font-semibold">Bespoke Relations</h4>
                  <p className="text-xs text-zinc-400 font-light">
                    Direct Call / WhatsApp:<br />
                    <a href="tel:+923211648089" className="text-primary hover:text-white transition-colors font-bold underline">
                      +92 321 1648089
                    </a>
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="flex gap-4 p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 shadow-md">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-xs uppercase tracking-wider text-white font-semibold">Availability</h4>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed">
                    Monday — Saturday<br />
                    11:00 AM — 9:00 PM (PKT)
                  </p>
                </div>
              </div>
            </div>

            {/* Form Column (Right) */}
            <div className="md:col-span-7 bg-zinc-950/50 p-8 rounded-3xl border border-primary/10 shadow-2xl">
              <h3 className="font-serif text-xl sm:text-2xl text-white font-light mb-6 tracking-wide">
                Send a Message
              </h3>
              
              <form className="space-y-5">
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-primary rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-sm font-light" 
                    required 
                  />
                </div>
                
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-primary rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-sm font-light" 
                    required 
                  />
                </div>
                
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Bespoke Inquiry</label>
                  <textarea 
                    rows={4} 
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-primary rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-sm font-light resize-none" 
                    required 
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-primary/95 transition-all duration-300 active:scale-95 cursor-pointer shadow-lg"
                >
                  Submit Message
                </button>
              </form>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
