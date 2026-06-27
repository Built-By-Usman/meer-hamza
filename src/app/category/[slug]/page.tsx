import { CategoryClient } from '@/features/catalog/components/CategoryClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  return <CategoryClient slug={slug} />;
}
