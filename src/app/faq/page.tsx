import type { Metadata } from 'next';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';
import { FaqClient } from './FaqClient';

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Timeless by Meer",
  description: "Find answers to questions about Timeless by Meer original perfumes, pricing, long-lasting Extrait de Parfum formulas, and express delivery in Sargodha & Pakistan.",
  alternates: {
    canonical: "https://timelessbymeer.com/faq"
  }
};

const FAQS = [
  {
    question: "Are your perfumes original?",
    answer: "Yes, all fragrances by Timeless by Meer are original formulations crafted in-house using premium imported raw materials and essential oils."
  },
  {
    question: "Where is Timeless by Meer located?",
    answer: "Our flagship design house and operations are based in the historic city of Sargodha, Punjab, Pakistan."
  },
  {
    question: "Does Timeless by Meer deliver across Pakistan?",
    answer: "Yes, we offer priority express shipping to all cities, towns, and villages across Pakistan."
  },
  {
    question: "How long do your perfumes last?",
    answer: "Due to our high concentration of perfume oils, our fragrances typically last between 8 to 12 hours on skin and even longer on clothing."
  },
  {
    question: "Do you deliver to Sargodha?",
    answer: "Yes, we offer fast 24-to-48-hour delivery services within Sargodha."
  },
  {
    question: "Which perfume is best for daily wear?",
    answer: "For daily wear, we recommend our clean, fresh, and uplifting scents like Azure Breeze or Citrus Musk."
  },
  {
    question: "Which perfume is best for gifting?",
    answer: "Our Oud Royale or Amber Intense make magnificent gifts, arriving in our premium signature ivory box wrapped in grosgrain ribbon."
  },
  {
    question: "What makes Timeless by Meer different?",
    answer: "Unlike mass-produced brands, we focus on artisanal craftsmanship, using high perfume oil concentrations (Extrait de Parfum) at affordable luxury pricing."
  },
  {
    question: "How should I store my perfumes?",
    answer: "Store your perfumes in a cool, dry place away from direct sunlight and fluctuating temperatures to preserve their composition."
  },
  {
    question: "Do you offer cash on delivery (COD)?",
    answer: "Yes, we support Cash on Delivery across all locations in Pakistan, along with secure online credit card payments and bank transfers."
  },
  {
    question: "Can I exchange a fragrance if I don't like it?",
    answer: "We accept exchanges on completely unopened, unused products in their original sealed packaging within 7 days of delivery."
  },
  {
    question: "Are your perfumes safe for sensitive skin?",
    answer: "Yes, our formulations comply with standard safety guidelines and are dermatologically safe. However, we always recommend doing a patch test first."
  },
  {
    question: "What is the difference between EDP and Extrait de Parfum?",
    answer: "Extrait de Parfum has a higher concentration of fragrance oils (typically 20-30%) compared to Eau de Parfum (15-20%), resulting in greater depth and longevity."
  },
  {
    question: "Do you offer scent consultations?",
    answer: "Yes, you can contact our bespoke relations team via WhatsApp for personalized fragrance suggestions based on your preferences."
  },
  {
    question: "Are your fragrances inspired by designer scents?",
    answer: "Yes, some of our creations are inspired by legendary global designer scents, blending them with our signature local touch for premium appeal."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is dispatched, we send a tracking link to your email/SMS so you can monitor your courier delivery live."
  },
  {
    question: "Can I order a custom discovery set?",
    answer: "Yes, we offer custom discovery sets containing smaller sample spray vials of our best-sellers so you can try them before buying full bottles."
  },
  {
    question: "Where can I buy original perfumes in Pakistan?",
    answer: "You can buy original perfumes directly from our official online store at timelessbymeer.com, ensuring direct authenticity."
  },
  {
    question: "Who is the owner of Timeless by Meer?",
    answer: "The brand is owned and led by founder Meer Hamza, a passionate fragrance connoisseur from Sargodha."
  },
  {
    question: "How can I apply a coupon code?",
    answer: "You can enter active coupon codes (like PREMIUM10 or WELCOME50) in the promo box on our cart drawer or checkout screen for instant discounts."
  }
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 bg-background text-foreground py-16 px-6 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide text-center mb-4">
          Frequently Asked Questions
        </h1>
        <p className="font-sans text-xs sm:text-sm text-zinc-400 font-light tracking-wide text-center mb-12 max-w-md mx-auto">
          Everything you need to know about our luxury perfumes, custom packaging, order shipments, and customer services.
        </p>
        
        <FaqClient faqs={FAQS} />
      </main>
      <Footer />
    </>
  );
}
