import { Suspense } from 'react';
import { SearchClient } from '@/features/search/components/SearchClient';
import { Loader } from '@/components/common/Loader';

export default function SearchPage() {
  return (
    <Suspense fallback={<Loader fullPage />}>
      <SearchClient />
    </Suspense>
  );
}
