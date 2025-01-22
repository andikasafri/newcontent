import { Suspense } from 'react';
import { getProduct, getProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import ProductDetails from "./product-details";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const products: Product[] = await getProducts(0, 100);
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

async function ProductContent({ id }: { id: string }) {
  const product = await getProduct(parseInt(id));
  return <ProductDetails product={product} />;
}

export default async function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductContent id={params.id} />
    </Suspense>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/4 mt-2" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}