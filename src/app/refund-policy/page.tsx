import type { Metadata } from 'next';
import { PolicyLayout } from '@/components/layout/PolicyLayout';

export const metadata: Metadata = {
  title: "Refund and Return Policy | Timeless by Meer",
  description: "Read the Refund and Return Policy of Timeless by Meer. Details on our return eligibility, refunds, and replacements for luxury perfumes.",
  alternates: {
    canonical: "https://timelessbymeer.com/refund-policy"
  }
};

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund and Return Policy">
      <p className="text-xs text-zinc-500">Last updated: July 01, 2026</p>
      <p>
        At Timeless by Meer, customer satisfaction is our top priority. Due to the personal and cosmetic nature of fragrances, we enforce the following returns and exchange rules:
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Return Eligibility</h3>
      <p>
        You may request a return or replacement within 7 days of receiving your package under the following conditions:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-zinc-400 font-light">
        <li>The item was received damaged during transit or has a manufacturing defect (e.g. faulty spray nozzle).</li>
        <li>The incorrect item was sent to you (e.g. a different fragrance variant).</li>
        <li>The item remains completely unused, unopened, and in its original premium sealed packaging.</li>
      </ul>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Refund Processing</h3>
      <p>
        Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your bank account or payment method within 5 to 7 working days.
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Customer Care</h3>
      <p>
        To initiate a return or replacement, please contact our relations team via WhatsApp or call us at <a href="tel:+923211648089" className="text-primary hover:text-white transition-colors font-bold underline">+92 321 1648089</a> with your order number and photographs of the received items.
      </p>
    </PolicyLayout>
  );
}
