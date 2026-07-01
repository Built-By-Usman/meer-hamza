import type { Metadata } from 'next';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

export const metadata: Metadata = {
  title: "Shipping Policy | Timeless by Meer",
  description: "Read the Shipping Policy of Timeless by Meer. Learn about nationwide express delivery timelines, costs, and packaging terms across Pakistan.",
  alternates: {
    canonical: "https://timelessbymeer.com/shipping-policy"
  }
};

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background text-foreground py-16 px-6 max-w-4xl mx-auto font-sans leading-relaxed font-light text-zinc-300">
        <h1 className="font-serif text-3xl text-white font-light tracking-wide mb-8 border-b pb-4">
          Shipping Policy
        </h1>
        <div className="space-y-6 text-sm">
          <p>Last updated: July 01, 2026</p>
          <p>
            At Timeless by Meer, we ensure that your luxury fragrances are packaged with extreme care and shipped swiftly. Below are the terms and details of our shipping policy:
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Nationwide Shipping Rates</h2>
          <p>
            We offer express courier shipping across all major cities and towns of Pakistan. Orders exceeding Rs. 5,000 qualify for free shipping. For orders below this threshold, a flat delivery fee of Rs. 250 is applied at checkout.
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Delivery Timelines</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Sargodha City:</strong> Delivered within 24 to 48 hours.</li>
            <li><strong>Major Cities (Lahore, Islamabad, Karachi, Rawalpindi):</strong> 2 to 4 working days.</li>
            <li><strong>Rest of Pakistan:</strong> 3 to 5 working days.</li>
          </ul>
          <p>
            Please note that during sales events, peak holiday seasons, or extreme weather conditions, shipping might experience minor delays.
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Premium Packaging</h2>
          <p>
            Every order is dispatched in our signature insulated luxury box to prevent any bottle damage or leakage during transit. A personalized batch signature tag is included inside the box as a symbol of authenticity.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
