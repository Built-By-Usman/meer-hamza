import { CategoryClient } from '@/features/catalog/components/CategoryClient';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  return <CategoryClient slug={slug} />;
}
