import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import ProductTable from '@/components/admin/product-table';
import { Suspense } from 'react';
import { ProductTableSkeleton } from '@/components/admin/product-table-skeleton';

export const dynamic = 'force-dynamic'; // Enable SSR

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const category = searchParams.category || '';
  
  const products = await getProducts((page - 1) * 10, 10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            defaultValue={search}
          />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <Suspense fallback={<ProductTableSkeleton />}>
        <ProductTable products={products} />
      </Suspense>
    </div>
  );
}