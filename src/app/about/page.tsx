import type { Metadata } from 'next';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

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
      <main className="flex-1 bg-background text-foreground py-16 px-6 max-w-4xl mx-auto font-sans">
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide text-center mb-8 border-b border-primary/20 pb-4 text-white">
          Our Story
        </h1>
        
        <div className="space-y-10 text-zinc-300 leading-relaxed text-sm sm:text-base font-light">
          
          {/* Section 1: The Brand Story */}
          <section className="space-y-4">
            <p>
              Welcome to <strong className="text-white font-medium">Timeless by Meer</strong>, where the art of fine perfumery meets absolute luxury. Founded in the historic city of <strong className="text-white font-medium">Sargodha, Punjab, Pakistan</strong>, our brand is dedicated to creating premium, high-concentration fragrances that leave a lasting impression.
            </p>
            <p>
              We believe a fragrance is much more than a cosmetic addition; it is a signature of identity, a memory container, and a statement of presence. Each bottle in our collection is carefully formulated with the highest quality imported perfume oils, blending rich tradition with modern sophistication.
            </p>
          </section>

          {/* Section 2: About the Founder */}
          <section className="bg-zinc-950/60 p-8 rounded-2xl border border-primary/10 space-y-4">
            <h2 className="font-serif text-2xl font-normal text-white">
              About the Founder
            </h2>
            <p>
              <strong className="text-white font-medium">Timeless by Meer</strong> was envisioned and founded by <strong className="text-white font-medium">Meer Hamza</strong>, a passionate fragrance connoisseur. Committed to elevating the standard of local perfumery, Meer Hamza set out to build a brand that offers authentic, long-lasting luxury fragrances. His dedication to selecting only the finest raw ingredients and perfecting each blend ensures that every product represents pure elegance and craftsmanship.
            </p>
          </section>

          {/* Section 3: Mission and Vision */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="border border-zinc-900 bg-zinc-950/20 p-6 rounded-xl space-y-3">
              <h3 className="font-serif text-xl text-white font-normal">Our Mission</h3>
              <p className="text-xs sm:text-sm">
                To redefine luxury perfumery in Pakistan by crafting long-lasting, premium Extrait de Parfum formulations that are accessible to fragrance connoisseurs, ensuring authenticity and sophistication in every drop.
              </p>
            </div>
            <div className="border border-zinc-900 bg-zinc-950/20 p-6 rounded-xl space-y-3">
              <h3 className="font-serif text-xl text-white font-normal">Our Vision</h3>
              <p className="text-xs sm:text-sm">
                To become Pakistan's leading luxury fragrance house, recognized globally for artisanal craftsmanship, exquisite quality, and premium sensory experiences that transcend boundaries.
              </p>
            </div>
          </section>

          {/* Section 4: Why Choose Us */}
          <section className="space-y-4 pt-4">
            <h2 className="font-serif text-2xl font-normal text-white">
              Why Choose Timeless by Meer
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li><strong>Commitment to Quality:</strong> We utilize only premium imported ingredients, ensuring our formulations meet safety and aesthetic standards.</li>
              <li><strong>Longevity & Sillage:</strong> Our perfumes are formulated as high-concentration Extrait de Parfum, allowing them to last longer on skin and fabric.</li>
              <li><strong>Nationwide Express Delivery:</strong> We offer reliable courier delivery to Sargodha, Punjab, and all major cities and towns across Pakistan.</li>
              <li><strong>Customer Satisfaction:</strong> We offer bespoke guidance and relations support to help you find your signature scent.</li>
            </ul>
          </section>

          {/* Section 5: Brand Details Footer */}
          <section className="border-t border-zinc-900 pt-8 text-center space-y-2">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Timeless by Meer</p>
            <p className="text-xs font-light text-zinc-400">
              University Road, Sargodha, Punjab, Pakistan
            </p>
            <p className="text-xs font-light text-zinc-400">
              Phone Support: <a href="tel:+923211648089" className="text-primary hover:text-white transition-colors font-bold">+92 321 1648089</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
