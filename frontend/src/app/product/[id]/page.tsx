import { ProductClient } from '@/features/product/components/ProductClient';

export const revalidate = 30;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  
  return <ProductClient slug={id} />;
}
