'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductForm } from '@/components/admin/product-form';
import ProductTable from '@/components/admin/product-table';
import { useToast } from '@/hooks/use-toast';
import { getProducts, getCategories, deleteProduct } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { LoadingSpinner } from '@/components/loading-spinner';

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts((page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setTotalProducts(productsData.length); // In a real API, this would come from the backend
      } catch (error) {
        toast({
          variant: 'destructive',
          description: 'Failed to fetch products',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, toast]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // In a real implementation, this would trigger an API call with search params
    const filtered = products.filter(product => 
      product.title.toLowerCase().includes(value.toLowerCase()) ||
      product.description.toLowerCase().includes(value.toLowerCase())
    );
    setProducts(filtered);
  };

  const handleCategoryFilter = (value: string) => {
    setSelectedCategory(value);
    if (value === 'all') {
      // Reset to original products
      getProducts((page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE).then(setProducts);
    } else {
      // Filter products by category
      const filtered = products.filter(product => 
        product.category.id.toString() === value
      );
      setProducts(filtered);
    }
  };

  const handleCreateProduct = async (data: Partial<Product>) => {
    setLoading(true);
    try {
      // In a real implementation, this would be an API call
      const newProduct = {
        id: products.length + 1,
        ...data,
        createdAt: new Date().toISOString(),
      } as Product;
      
      setProducts([newProduct, ...products]);
      setIsOpen(false);
      toast({
        description: 'Product created successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to create product',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      // In a real implementation, this would be an API call
      setProducts(products.filter(product => product.id !== id));
      toast({
        description: 'Product deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to delete product',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              categories={categories}
              onSubmit={handleCreateProduct}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ProductTable
        products={products}
        onDelete={handleDeleteProduct}
        onEdit={(product) => {
          router.push(`/admin/products/${product.id}`);
        }}
      />

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, totalProducts)} of {totalProducts} products
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => router.push(`/admin/products?page=${page - 1}`)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => router.push(`/admin/products?page=${page + 1}`)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}