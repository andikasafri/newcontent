import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "../styles/globals.css";
// Create a new QueryClient instance for React Query
const queryClient = new QueryClient();

function App() {
  // Load the authenticated user when the app starts
  const loadUser = useAuthStore((state) => state.loadUser);

  // Fetch the user's authentication status on component mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    // Provide the QueryClient to the entire app using QueryClientProvider
    <QueryClientProvider client={queryClient}>
      {/* Set up the Router for navigation */}
      <Router
        basename="/"
        // future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        {/* Main app container with a minimum height and background color */}
        <div className="min-h-screen bg-gray-50">
          {/* Render the Navbar at the top of the app */}
          <Navbar />
          {/* Define the routes for the app */}
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home page */}
            <Route path="/products" element={<Products />} />{" "}
            {/* Products page */}
            <Route path="/products/:id" element={<ProductDetail />} />{" "}
            {/* Product details page */}
            <Route path="/cart" element={<Cart />} /> {/* Shopping cart page */}
            <Route path="/login" element={<Login />} /> {/* Login page */}
            <Route path="/register" element={<Register />} />{" "}
            {/* Registration page */}
          </Routes>
        </div>
        {/* Render a toast notification system at the top-right of the screen */}
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
