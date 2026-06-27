import { Suspense } from 'react';
import { CheckoutSuccessClient } from '@/features/checkout/components/CheckoutSuccessClient';
import { Loader } from '@/components/common/Loader';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<Loader fullPage />}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
