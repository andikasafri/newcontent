import { Suspense } from "react";
import { getProduct } from "@/app/lib/api";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import ProductDetail from "./ProductDetail";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(parseInt(params.id));

  return (
    <div className="container mx-auto px-4 py-16">
      <Suspense fallback={<LoadingSpinner />}>
        <ProductDetail product={product} />
      </Suspense>
    </div>
  );
}