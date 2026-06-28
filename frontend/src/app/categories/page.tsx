import { CategoriesClient } from '@/features/catalog/components/CategoriesClient';

export const revalidate = 60;

export default function CategoriesPage() {
  return <CategoriesClient />;
}
