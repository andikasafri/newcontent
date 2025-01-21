import { getCategories } from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <span>Categories</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.id}`}>
            <Card className="group cursor-pointer overflow-hidden">
              <div className="aspect-[16/9] relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h2 className="text-white text-2xl font-bold">{category.name}</h2>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-muted-foreground">
                  Browse our collection of {category.name.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}