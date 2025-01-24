import { getProducts, getCategories } from "@/lib/api";
import { Product, Category } from "@/lib/types";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/product-grid";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

interface CategoryData {
  products: Product[];
  category: Category | undefined;
  categories: Category[];
}

async function getData(categoryId: string): Promise<CategoryData> {
  const [products, categories] = await Promise.all([
    getProducts(0, 50),
    getCategories(),
  ]);

  const filteredProducts = products.filter(
    (product: Product) => product.category.id === parseInt(categoryId)
  );
  const currentCategory = categories.find(
    (category: Category) => category.id === parseInt(categoryId)
  );

  return { products: filteredProducts, category: currentCategory, categories };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category: Category) => ({
    id: category.id.toString(),
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { products, category, categories } = await getData(params.id);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <p className="text-muted-foreground mb-8">
          The category you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/categories">
          <Button>View All Categories</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href="/categories"
          className="text-muted-foreground hover:text-foreground"
        >
          Categories
        </Link>
        <span className="text-muted-foreground">/</span>
        <span>{category?.name}</span>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Categories</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-2">
                {categories.map((cat: Category) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    className={`block p-2 rounded-lg hover:bg-accent ${
                      cat.id === category?.id ? "bg-accent" : ""
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map((cat: Category) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className={`block p-2 rounded-lg hover:bg-accent ${
                    cat.id === category?.id ? "bg-accent" : ""
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{category?.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {products.length} products
              </span>
            </div>
          </div>

          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
