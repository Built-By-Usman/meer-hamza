import type { Metadata } from 'next';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

export const metadata: Metadata = {
  title: "About Us | Timeless by Meer - Luxury Perfume House",
  description: "Learn about Timeless by Meer, a premium luxury perfume brand founded by Meer Hamza in Sargodha, Pakistan. Read our journey and commitment to exquisite fragrances.",
  alternates: {
    canonical: "https://timelessbymeer.com/about"
  }
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Timeless by Meer",
    "url": "https://timelessbymeer.com/about",
    "description": "Learn about the luxury fragrance journey of Timeless by Meer, founded by Meer Hamza in Sargodha, Pakistan."
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
          Our Story
        </h1>
        
        <div className="space-y-6 text-zinc-300 leading-relaxed text-sm sm:text-base font-light">
          <p>
            Welcome to <strong className="text-white font-medium">Timeless by Meer</strong>, where the art of fine perfumery meets absolute luxury. Founded by <strong className="text-white font-medium">Meer Hamza</strong> in the heart of Sargodha, Punjab, Pakistan, our brand is dedicated to creating premium, high-concentration fragrances that leave a lasting impression.
          </p>
          
          <h2 className="font-serif text-2xl font-normal text-white mt-8 mb-4">
            The Philosophy of Scent
          </h2>
          <p>
            At Timeless by Meer, we believe a fragrance is much more than a cosmetic addition; it is a signature of identity, a memory container, and a statement of presence. Each bottle in our collection is carefully formulated with the highest quality imported perfume oils, blending rich tradition with modern sophistication.
          </p>
          
          <h2 className="font-serif text-2xl font-normal text-white mt-8 mb-4">
            Crafted with Passion
          </h2>
          <p>
            From the deep, mysterious notes of our Oud Royale to the refreshing, vibrant accords of our daily wear selections, our perfumes are crafted with passion and precision. We meticulously choose raw materials from the finest global sources to ensure excellent sillage, projection, and longevity.
          </p>
          
          <h2 className="font-serif text-2xl font-normal text-white mt-8 mb-4">
            Our Commitment
          </h2>
          <p>
            We are committed to delivering an unparalleled luxury shopping experience to fragrance enthusiasts across Pakistan. Our signature premium packaging, quick nationwide shipping, and dedicated client service ensure that every bottle of Timeless by Meer arrives as a precious gift.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
