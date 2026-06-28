import { HomeClient } from '@/features/home/components/HomeClient';

export const revalidate = 60;

export default function HomePage() {
  return <HomeClient />;
}
