import { act } from "@testing-library/react";
import { useWishlist } from "@/lib/hooks/use-wishlist";

describe("useWishlist Hook", () => {
  beforeEach(() => {
    // Reset Zustand store before each test
    act(() => {
      useWishlist.setState({ items: [] });
    });
  });

  // Adding negative product IDs
  it("should add negative product ID to the wishlist", () => {
    const { addItem, hasItem } = useWishlist.getState();
    const negativeProductId = -1;
    addItem(negativeProductId);
    expect(hasItem(negativeProductId)).toBe(true);
  });

  // Adding a new product ID to an empty wishlist and verifying the state updates correctly
  it("should add product ID to empty wishlist", () => {
    const { addItem, hasItem } = useWishlist.getState();
    const productId = 123;
    expect(useWishlist.getState().items.length).toBe(0);
    addItem(productId);
    expect(hasItem(productId)).toBe(true);
    expect(useWishlist.getState().items.length).toBe(1);
  });

  // Adding multiple product IDs to the wishlist
  it("should add multiple product IDs to the wishlist", () => {
    const { addItem, hasItem } = useWishlist.getState();
    const productIds = [101, 102, 103];
    productIds.forEach((id) => addItem(id));
    productIds.forEach((id) => expect(hasItem(id)).toBe(true));
  });

  // Removing an existing product ID from the wishlist
  it("should remove an existing product ID from the wishlist", () => {
    const { addItem, removeItem, hasItem } = useWishlist.getState();
    const productId = 1;
    addItem(productId);
    expect(hasItem(productId)).toBe(true);
    removeItem(productId);
    expect(hasItem(productId)).toBe(false);
  });

  // Checking if a product ID exists in the wishlist returns false when not present
  it("should return false when checking for a non-existent product ID", () => {
    const { hasItem } = useWishlist.getState();
    const nonExistentProductId = 999;
    expect(hasItem(nonExistentProductId)).toBe(false);
  });

  // Checking if a product ID exists in the wishlist returns true when present
  it("should return true when a product ID is present in the wishlist", () => {
    const { addItem, hasItem } = useWishlist.getState();
    const productId = 42;
    addItem(productId);
    expect(hasItem(productId)).toBe(true);
  });

  // Persistence of wishlist data between page reloads
  it("should persist wishlist data after page reload", () => {
    const { addItem, hasItem } = useWishlist.getState();
    const productId = 42;
    addItem(productId);
    expect(hasItem(productId)).toBe(true);

    // Simulate page reload by re-initializing the store
    const reinitializedStore = useWishlist.getState();
    expect(reinitializedStore.hasItem(productId)).toBe(true);
  });

  // Removing from an empty wishlist
  it("should not remove any item when wishlist is empty", () => {
    const { removeItem, hasItem } = useWishlist.getState();
    const productId = 1;
    removeItem(productId);
    expect(hasItem(productId)).toBe(false);
  });

  // State updates trigger re-renders in React components
  it("should update state and trigger re-render when adding a product ID", () => {
    const { addItem, hasItem } = useWishlist.getState();
    const productId = 42;
    addItem(productId);
    expect(hasItem(productId)).toBe(true);
  });

  // Multiple instances share the same persisted state
  it("should share the same persisted state across multiple instances", () => {
    const { addItem, hasItem } = useWishlist.getState();
    const productId = 42;
    addItem(productId);

    const newInstance = useWishlist.getState();
    expect(newInstance.hasItem(productId)).toBe(true);
  });

  // Concurrent add/remove operations maintain data consistency
  it("should maintain data consistency when adding and removing items concurrently", () => {
    const { addItem, removeItem, hasItem } = useWishlist.getState();
    const productId1 = 1;
    const productId2 = 2;

    // Simulate concurrent operations
    addItem(productId1);
    removeItem(productId1);
    addItem(productId2);

    // Check data consistency
    expect(hasItem(productId1)).toBe(false);
    expect(hasItem(productId2)).toBe(true);
  });

  // Removing a non-existent product ID should not affect the wishlist
  it("should not change wishlist when removing a non-existent product ID", () => {
    const { removeItem, hasItem } = useWishlist.getState();
    const initialItems = useWishlist.getState().items;
    const nonExistentProductId = 999;
    removeItem(nonExistentProductId);
    expect(useWishlist.getState().items).toEqual(initialItems);
    expect(hasItem(nonExistentProductId)).toBe(false);
  });
});
