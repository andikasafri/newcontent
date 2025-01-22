'use client';

import { getProduct, getCategories, getProducts } from "@/lib/api";
import { ProductForm } from "@/components/admin/product-form";
import { useEffect, useState } from "react";
import { Product, Category } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export async function generateStaticParams() {
  const products = await getProducts(0, 100); // Get first 100 products
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const router = useRouter();

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
        toast({
          variant: "destructive",
          description: "Failed to fetch product data",
        });
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, toast, router]);

  const handleSubmit = async (data: Partial<Product>) => {
    try {
      // In a real implementation, this would be an API call
      toast({
        description: "Product updated successfully",
      });
      router.push('/admin/products');
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update product",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
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
        <Button onClick={() => router.push('/admin/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={handleSubmit}
      />
    </div>
  );
}