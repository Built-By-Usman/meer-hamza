import type { Metadata } from 'next';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

export const metadata: Metadata = {
  title: "Privacy Policy | Timeless by Meer",
  description: "Read the Privacy Policy of Timeless by Meer. Learn how we collect, use, and protect your personal information on our online perfume store.",
  alternates: {
    canonical: "https://timelessbymeer.com/privacy-policy"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background text-foreground py-16 px-6 max-w-4xl mx-auto font-sans leading-relaxed font-light text-zinc-300">
        <h1 className="font-serif text-3xl text-white font-light tracking-wide mb-8 border-b pb-4">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-sm">
          <p>Last updated: July 01, 2026</p>
          <p>
            At Timeless by Meer, we are committed to safeguarding the privacy of our clients and visitors. This Privacy Policy details how we collect, process, and protect your personal details when you interact with our storefront or buy from us.
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Information We Collect</h2>
          <p>
            When you purchase or attempt to purchase through the Site, we collect certain details from you, including your name, billing address, shipping address, payment details (including credit card numbers, bank transfers, or cash-on-delivery flags), email address, and phone number.
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">How We Use Your Information</h2>
          <p>
            We use the order details that we collect generally to fulfill any orders placed through the Site (including processing your payment details, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this details to communicate with you, screen our orders for potential risk or fraud, and provide you with details or advertising relating to our products or services.
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Data Retention</h2>
          <p>
            When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this details.
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Security</h2>
          <p>
            To protect your personal details, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered, or destroyed.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
