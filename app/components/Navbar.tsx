import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { motion, useScroll } from "framer-motion";

/**
 * Navigation bar component with responsive design and animations
 * Includes user authentication status and cart functionality
 *
 * @component
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = React.useState(false);

  // Handle navbar visibility based on scroll direction
  useEffect(() => {
    return scrollY.on("change", (current) => {
      const previous = scrollY.getPrevious() ?? 0;
      setHidden(current > previous && current > 150);
    });
  }, [scrollY]);

  const navVariants = {
    visible: { y: 0 },
    hidden: { y: "-100%" },
  };

  return (
    <motion.nav
      variants={navVariants}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation Links */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              ShopHub
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-600 hover:text-gray-900"
              >
                Products
              </Link>
            </div>
          </div>

          {/* Cart and User Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user?.name}</span>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 flex items-center"
                aria-label="Login"
              >
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
