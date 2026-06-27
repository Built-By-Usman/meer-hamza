import { ProductClient } from '@/features/product/components/ProductClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  
  return <ProductClient slug={id} />;
}
