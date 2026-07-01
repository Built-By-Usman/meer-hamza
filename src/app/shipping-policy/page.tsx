import type { Metadata } from 'next';
import { PolicyLayout } from '@/components/layout/PolicyLayout';

export const metadata: Metadata = {
  title: "Shipping Policy | Timeless by Meer",
  description: "Read the Shipping Policy of Timeless by Meer. Learn about nationwide express delivery timelines, costs, and packaging terms across Pakistan.",
  alternates: {
    canonical: "https://timelessbymeer.com/shipping-policy"
  }
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy">
      <p className="text-xs text-zinc-500">Last updated: July 01, 2026</p>
      <p>
        At Timeless by Meer, we ensure that your luxury fragrances are packaged with extreme care and shipped swiftly. Below are the terms and details of our shipping policy:
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Nationwide Shipping Rates</h3>
      <p>
        We offer express courier shipping across all major cities and towns of Pakistan. Orders exceeding Rs. 5,000 qualify for free shipping. For orders below this threshold, a flat delivery fee of Rs. 250 is applied at checkout.
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Delivery Timelines</h3>
      <ul className="list-disc pl-5 space-y-2 text-zinc-400 font-light">
        <li><strong>Sargodha City:</strong> Delivered within 24 to 48 hours.</li>
        <li><strong>Major Cities (Lahore, Islamabad, Karachi, Rawalpindi):</strong> 2 to 4 working days.</li>
        <li><strong>Rest of Pakistan:</strong> 3 to 5 working days.</li>
      </ul>
      <p className="pt-2">
        Please note that during sales events, peak holiday seasons, or extreme weather conditions, shipping might experience minor delays.
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Premium Packaging</h3>
      <p>
        Every order is dispatched in our signature insulated luxury box to prevent any bottle damage or leakage during transit. A personalized batch signature tag is included inside the box as a symbol of authenticity.
      </p>
    </PolicyLayout>
  );
}
