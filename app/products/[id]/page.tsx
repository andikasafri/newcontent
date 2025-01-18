import { Suspense } from "react";
import { getProduct } from "@/app/lib/api";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import ProductDetail from "./ProductDetail";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(parseInt(params.id));
  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(parseInt(params.id));

  return (
    <div className="container mx-auto px-4 py-16">
      <Suspense fallback={<LoadingSpinner />}>
        <ProductDetail product={product} />
      </Suspense>
    </div>
  );
}