import type { Metadata } from 'next';
import { PolicyLayout } from '@/components/layout/PolicyLayout';

export const metadata: Metadata = {
  title: "Terms of Service | Timeless by Meer",
  description: "Read the Terms and Conditions of Timeless by Meer. Terms governing purchases, usage, and services on our online storefront.",
  alternates: {
    canonical: "https://timelessbymeer.com/terms"
  }
};

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service">
      <p className="text-xs text-zinc-500">Last updated: July 01, 2026</p>
      <p>
        This website is operated by Timeless by Meer. Throughout the site, the terms “we”, “us” and “our” refer to Timeless by Meer.
      </p>
      <p>
        By visiting our site and/or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions.
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Online Store Terms</h3>
      <p>
        By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you violate any laws in your jurisdiction.
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Products and Pricing</h3>
      <p>
        Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We have made every effort to display as accurately as possible the colors and images of our products.
      </p>
      <h3 className="font-serif text-xl text-white font-normal mt-6 mb-2">Billing and Account Accuracy</h3>
      <p>
        We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. You agree to provide current, complete, and accurate purchase and account details for all purchases made at our store.
      </p>
    </PolicyLayout>
  );
}
