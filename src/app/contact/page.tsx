import type { Metadata } from 'next';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

export const metadata: Metadata = {
  title: "Contact Us | Timeless by Meer - Luxury Perfumes Pakistan",
  description: "Get in touch with Timeless by Meer. Visit our store in Sargodha, Punjab or contact us via phone or email for orders, scent consultation, and support.",
  alternates: {
    canonical: "https://timelessbymeer.com/contact"
  }
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Timeless by Meer",
    "image": "https://timelessbymeer.com/logo.png",
    "telephone": "+923001234567",
    "email": "support@timelessbymeer.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Flagship Fragrance Store, Sargodha Road",
      "addressLocality": "Sargodha",
      "addressRegion": "Punjab",
      "addressCountry": "PK"
    },
    "url": "https://timelessbymeer.com/contact"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 bg-background text-foreground py-16 px-6 max-w-4xl mx-auto font-sans">
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide text-center mb-8 border-b pb-4">
          Contact Us
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 text-zinc-300">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-white font-normal">
              Flagship House
            </h2>
            <p className="font-light text-sm leading-relaxed">
              Timeless by Meer Fragrances<br />
              Sargodha City, Punjab, Pakistan
            </p>
            
            <h2 className="font-serif text-2xl text-white font-normal pt-4">
              Direct Relations
            </h2>
            <p className="font-light text-sm leading-relaxed">
              <strong>Email:</strong> support@timelessbymeer.com<br />
              <strong>WhatsApp / Support:</strong> +92 300 1234567<br />
              <strong>Hours:</strong> Mon - Sat, 11:00 AM - 9:00 PM (PKT)
            </p>
          </div>
          
          <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-900">
            <h2 className="font-serif text-xl text-white font-normal mb-4">
              Send a Message
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">Name</label>
                <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-primary text-sm font-light" required />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">Email</label>
                <input type="email" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-primary text-sm font-light" required />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1">Message</label>
                <textarea rows={4} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-primary text-sm font-light" required></textarea>
              </div>
              
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded font-bold uppercase tracking-widest text-xs hover:bg-primary/95 transition-colors cursor-pointer">
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
