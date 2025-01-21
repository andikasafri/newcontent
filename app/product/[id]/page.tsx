import { getProduct, getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import ProductDetails from './product-details';

// This is needed for static export
export async function generateStaticParams() {
  const products = await getProducts(0, 100); // Fetch first 100 products
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(parseInt(params.id));
  return <ProductDetails product={product} />;
}