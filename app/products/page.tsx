import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ProductGrid from '@/components/product-grid';

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
  
  const products = await getProducts((page - 1) * 12, 12);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <span>Products</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              defaultValue={search}
            />
          </div>
          <Button variant="outline">Filters</Button>
        </div>
      </div>

      <ProductGrid products={products} />

      <div className="mt-8 flex justify-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => {
              // Handle pagination
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Handle pagination
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}