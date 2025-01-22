import { Suspense } from 'react';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ProductGrid from '@/components/product-grid';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
}

interface ProductsPageProps {
  searchParams: SearchParams;
}

async function ProductList({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const category = searchParams.category || '';
  
  const products = await getProducts((page - 1) * 12, 12);

  return <ProductGrid products={products} />;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
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
              defaultValue={searchParams.search}
            />
          </div>
          <Button variant="outline">Filters</Button>
        </div>
      </div>

      <Suspense 
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        }
      >
        <ProductList searchParams={searchParams} />
      </Suspense>

      <div className="mt-8 flex justify-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={Number(searchParams.page || 1) === 1}
          >
            Previous
          </Button>
          <Button variant="outline">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}