import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatINR } from "../../utils/currency";
import { Button } from "../common/Button";
export const CartDrawer = () => {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItemsCount
  } = useCart();
  const navigate = useNavigate();
  if (!isCartDrawerOpen) return null;
  return <div className="fixed inset-0 z-50 overflow-hidden">
      <div
    className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
    onClick={() => setIsCartDrawerOpen(false)}
  />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {
    /* Header */
  }
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#6b1426]" />
              <h2 className="font-serif font-semibold text-lg text-stone-900">
                Shopping Bag ({totalItemsCount})
              </h2>
            </div>
            <button
    onClick={() => setIsCartDrawerOpen(false)}
    className="text-stone-400 hover:text-stone-700 p-1.5 rounded-md transition-colors"
    aria-label="Close cart"
  >
              <X className="w-5 h-5" />
            </button>
          </div>

          {
    /* Body */
  }
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {items.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg text-stone-900 mb-2">Your Bag is Empty</h3>
                <p className="text-sm text-stone-500 mb-6 max-w-xs">
                  Discover our timeless handwoven sarees and add royal elegance to your wardrobe.
                </p>
                <Button
    onClick={() => {
      setIsCartDrawerOpen(false);
      navigate("/products");
    }}
    variant="primary"
  >
                  Explore Sarees
                </Button>
              </div> : items.map((item) => <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <img
    src={item.product.images[0]}
    alt={item.product.name}
    className="w-20 h-26 object-cover rounded-md bg-stone-100 shrink-0 border border-stone-200"
    referrerPolicy="no-referrer"
  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-medium text-stone-900 line-clamp-2 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
    onClick={() => removeFromCart(item.id)}
    className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
    title="Remove item"
  >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        {item.product.fabric} · {item.product.color}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-300 rounded">
                        <button
    onClick={() => updateQuantity(item.id, item.quantity - 1)}
    className="px-2 py-1 text-stone-600 hover:bg-stone-100 transition-colors"
    disabled={item.quantity <= 1}
  >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-semibold font-mono tabular-nums text-stone-900">
                          {item.quantity}
                        </span>
                        <button
    onClick={() => updateQuantity(item.id, item.quantity + 1)}
    className="px-2 py-1 text-stone-600 hover:bg-stone-100 transition-colors"
  >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold font-mono tabular-nums text-stone-900">
                          {formatINR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>)}
          </div>

          {
    /* Footer */
  }
          {items.length > 0 && <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-medium text-stone-900">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Shipping &amp; Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
    onClick={() => {
      setIsCartDrawerOpen(false);
      navigate("/checkout");
    }}
    className="w-full justify-between"
    size="lg"
  >
                  <span>Proceed to Checkout</span>
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    {formatINR(subtotal)} <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
                <Button
    onClick={() => {
      setIsCartDrawerOpen(false);
      navigate("/cart");
    }}
    variant="outline"
    className="w-full text-xs"
    size="sm"
  >
                  View Full Cart &amp; Apply Coupons
                </Button>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
