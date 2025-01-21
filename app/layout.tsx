'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { ShoppingCart, User, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              NextShop
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" size="icon">
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{user.name}</span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}