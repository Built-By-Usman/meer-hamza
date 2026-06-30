import { ProfileClient } from '@/features/account/components/ProfileClient';
import { Suspense } from 'react';
import { Loader } from '@/components/common/Loader';

export default function ProfilePage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProfileClient />
    </Suspense>
  );
}
