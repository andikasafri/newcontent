// app/admin/products/[id]/page.tsx
"use client";

import { getProduct } from "@/lib/api";
// import { getProduct } from "lib/productApi";
import { getCategories } from "lib/categoryApi";
import { ProductForm } from "@/components/admin/product-form";
import { useEffect, useState } from "react";
import { Product, Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoriesData] = await Promise.all([
          getProduct(parseInt(params.id)),
          getCategories(),
        ]);
        setProduct(productData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={async (data) => {
          // Handle form submission
          try {
            // Make API call to update product
            // Show success message
          } catch (error) {
            // Handle error
          }
        }}
      />
    </div>
  );
}
