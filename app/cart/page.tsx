// cart/page.tsx
import { Suspense } from "react";
import CartItems from "./CartItems";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View and manage your shopping cart",
};

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <CartItems />
      </Suspense>
    </div>
  );
}
