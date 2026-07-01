import type { Metadata } from 'next';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

export const metadata: Metadata = {
  title: "Refund and Return Policy | Timeless by Meer",
  description: "Read the Refund and Return Policy of Timeless by Meer. Details on our return eligibility, refunds, and replacements for luxury perfumes.",
  alternates: {
    canonical: "https://timelessbymeer.com/refund-policy"
  }
};

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background text-foreground py-16 px-6 max-w-4xl mx-auto font-sans leading-relaxed font-light text-zinc-300">
        <h1 className="font-serif text-3xl text-white font-light tracking-wide mb-8 border-b pb-4">
          Refund and Return Policy
        </h1>
        <div className="space-y-6 text-sm">
          <p>Last updated: July 01, 2026</p>
          <p>
            At Timeless by Meer, customer satisfaction is our top priority. Due to the personal and cosmetic nature of fragrances, we enforce the following returns and exchange rules:
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Return Eligibility</h2>
          <p>
            You may request a return or replacement within 7 days of receiving your package under the following conditions:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The item was received damaged during transit or has a manufacturing defect (e.g. faulty spray nozzle).</li>
            <li>The incorrect item was sent to you (e.g. a different fragrance variant).</li>
            <li>The item remains completely unused, unopened, and in its original premium sealed packaging.</li>
          </ul>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Refund Processing</h2>
          <p>
            Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your bank account or payment method within 5 to 7 working days.
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Contact Us</h2>
          <p>
            To initiate a return or replacement, please contact our relations team at support@timelessbymeer.com or WhatsApp us at +92 300 1234567 with your order number and photographs of the received items.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
