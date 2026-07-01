import type { Metadata } from 'next';
import { Header } from '@/features/shared/components/Header';
import { Footer } from '@/features/shared/components/Footer';

export const metadata: Metadata = {
  title: "Terms of Service | Timeless by Meer",
  description: "Read the Terms and Conditions of Timeless by Meer. Terms governing purchases, usage, and services on our online storefront.",
  alternates: {
    canonical: "https://timelessbymeer.com/terms"
  }
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background text-foreground py-16 px-6 max-w-4xl mx-auto font-sans leading-relaxed font-light text-zinc-300">
        <h1 className="font-serif text-3xl text-white font-light tracking-wide mb-8 border-b pb-4">
          Terms of Service
        </h1>
        <div className="space-y-6 text-sm">
          <p>Last updated: July 01, 2026</p>
          <p>
            This website is operated by Timeless by Meer. Throughout the site, the terms “we”, “us” and “our” refer to Timeless by Meer.
          </p>
          <p>
            By visiting our site and/or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions.
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Online Store Terms</h2>
          <p>
            By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you violate any laws in your jurisdiction.
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Products and Pricing</h2>
          <p>
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We have made every effort to display as accurately as possible the colors and images of our products.
          </p>
          <h2 className="font-serif text-xl text-white font-normal mt-6">Billing and Account Accuracy</h2>
          <p>
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. You agree to provide current, complete, and accurate purchase and account details for all purchases made at our store.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
