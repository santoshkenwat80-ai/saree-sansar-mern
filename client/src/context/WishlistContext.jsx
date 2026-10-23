import { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";
import toast from "react-hot-toast";
const WishlistContext = createContext(void 0);
const LOCAL_WISHLIST_KEY = "saree_sansar_wishlist";
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const { addToCart } = useCart();
  useEffect(() => {
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);
  const addToWishlist = (product) => {
    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [...prev, product]);
      toast.success(`Saved ${product.name} to wishlist`);
    } else {
      removeFromWishlist(product.id);
    }
  };
  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Removed from wishlist");
  };
  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };
  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };
  return <WishlistContext.Provider
    value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      moveToCart,
      wishlistCount: wishlist.length
    }}
  >
      {children}
    </WishlistContext.Provider>;
};
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
