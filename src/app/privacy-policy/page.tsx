import type { Metadata } from 'next';
import { PolicyLayout } from '@/components/layout/PolicyLayout';

export const metadata: Metadata = {
  title: "Privacy Policy | Timeless by Meer",
  description: "Read the Privacy Policy of Timeless by Meer. Learn how we collect, use, and protect your personal information on our online perfume store.",
  alternates: {
    canonical: "https://timelessbymeer.com/privacy-policy"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p className="text-xs text-zinc-500">Last updated: July 01, 2026</p>
      <p>
        At Timeless by Meer, we are committed to safeguarding the privacy of our clients and visitors. This Privacy Policy details how we collect, process, and protect your personal details when you interact with our storefront or buy from us.
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Information We Collect</h3>
      <p>
        When you purchase or attempt to purchase through the Site, we collect certain details from you, including your name, billing address, shipping address, payment details (including credit card numbers, bank transfers, or cash-on-delivery flags), email address, and phone number.
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">How We Use Your Information</h3>
      <p>
        We use the order details that we collect generally to fulfill any orders placed through the Site (including processing your payment details, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this details to communicate with you, screen our orders for potential risk or fraud, and provide you with details or advertising relating to our products or services.
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Data Retention</h3>
      <p>
        When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this details.
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Security</h3>
      <p>
        To protect your personal details, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered, or destroyed.
      </p>
    </PolicyLayout>
  );
}
