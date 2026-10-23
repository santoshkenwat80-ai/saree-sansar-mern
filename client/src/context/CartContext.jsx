import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { couponService } from "../services/couponService";
import toast from "react-hot-toast";
const CartContext = createContext(void 0);
const LOCAL_CART_KEY = "saree_sansar_cart";
const LOCAL_COUPON_KEY = "saree_sansar_applied_coupon";
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_COUPON_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(LOCAL_COUPON_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(LOCAL_COUPON_KEY);
    }
  }, [appliedCoupon]);
  const addToCart = (product, quantity = 1, selectedBlouseOption = "Unstitched Fabric (Included)") => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.productId === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          toast.error(`Only ${product.stock} pieces available in stock`);
          return prevItems;
        }
        updated[existingIndex].quantity = newQty;
        toast.success(`Updated quantity for ${product.name}`);
        return updated;
      } else {
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} pieces available in stock`);
          return prevItems;
        }
        const newItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: product.id,
          product,
          quantity,
          selectedBlouseOption
        };
        toast.success(`Added ${product.name} to cart!`);
        return [...prevItems, newItem];
      }
    });
    setIsCartDrawerOpen(true);
  };
  const removeFromCart = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.success("Removed from cart");
  };
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(
      (prev) => prev.map((item) => {
        if (item.id === itemId) {
          if (quantity > item.product.stock) {
            toast.error(`Maximum available stock is ${item.product.stock}`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };
  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);
  const totalItemsCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);
  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    if (subtotal < appliedCoupon.minOrderValue) return 0;
    let d = 0;
    if (appliedCoupon.discountPercent) {
      d = Math.round(subtotal * appliedCoupon.discountPercent / 100);
      if (appliedCoupon.maxDiscount && d > appliedCoupon.maxDiscount) {
        d = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountAmount) {
      d = appliedCoupon.discountAmount;
    }
    return Math.min(d, subtotal);
  }, [appliedCoupon, subtotal]);
  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 2e3 ? 0 : 150;
  }, [subtotal]);
  const tax = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discount);
    return Math.round(taxableAmount * 0.05);
  }, [subtotal, discount]);
  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discount + shippingFee + tax);
  }, [subtotal, discount, shippingFee, tax]);
  const applyCoupon = async (code) => {
    const res = await couponService.validateCoupon(code, subtotal);
    if (res.isValid && res.coupon) {
      setAppliedCoupon(res.coupon);
      toast.success(res.message);
      return true;
    } else {
      toast.error(res.message);
      return false;
    }
  };
  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };
  return <CartContext.Provider
    value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      subtotal,
      discount,
      shippingFee,
      tax,
      totalAmount,
      totalItemsCount,
      isCartDrawerOpen,
      setIsCartDrawerOpen
    }}
  >
      {children}
    </CartContext.Provider>;
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
