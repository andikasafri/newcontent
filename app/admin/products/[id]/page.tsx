import { getProduct, getCategories } from '@/lib/api';
import { ProductForm } from '@/components/admin/product-form';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    getProduct(parseInt(params.id)),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={async (data) => {
          'use server';
          // Update product API call would go here
        }}
      />
    </div>
  );
}