/**
 * Represents a product in the e-commerce system.
 * Includes essential details like ID, title, price, description, category, and images.
 */
export interface Product {
  id: number; // Unique identifier for the product
  title: string; // Name or title of the product
  price: number; // Price of the product
  description: string; // Detailed description of the product
  category: Category; // Category to which the product belongs
  images: string[]; // Array of image URLs for the product
}

/**
 * Represents a category in the e-commerce system.
 * Used to group products into meaningful collections.
 */
export interface Category {
  id: number; // Unique identifier for the category
  name: string; // Name of the category
  image: string; // URL of the category's image
}

/**
 * Represents a user in the e-commerce system.
 * Contains user-specific information like ID, email, name, role, and avatar.
 */
export interface User {
  id: number; // Unique identifier for the user
  email: string; // Email address of the user
  name: string; // Full name of the user
  role: string; // Role of the user (e.g., "admin", "customer")
  avatar: string; // URL of the user's profile picture
}

/**
 * Represents the credentials required for logging in.
 * Includes email and password fields.
 */
export interface LoginCredentials {
  email: string; // Email address used for login
  password: string; // Password used for login
}

/**
 * Represents the credentials required for registering a new user.
 * Extends `LoginCredentials` and adds additional fields like name and avatar.
 */
export interface RegisterCredentials extends LoginCredentials {
  name: string; // Full name of the user
  avatar: string; // URL of the user's profile picture
}

/**
 * Represents an item in the shopping cart.
 * Extends the `Product` interface and adds a `quantity` field to track how many of the product are in the cart.
 */
export interface CartItem extends Product {
  quantity: number; // Number of this product in the cart
}
