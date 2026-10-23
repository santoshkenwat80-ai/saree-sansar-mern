import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { formatINR } from "../../utils/currency";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
export const Wishlist = () => {
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  if (wishlistCount === 0) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
      title="Your Wishlist is Empty"
      description="You haven't saved any heirloom sarees yet. Explore our royal catalogues and click the heart icon on any saree to save it for later."
      actionText="Browse Handlooms"
      onAction={() => navigate("/products")}
    />
      </div>;
  }
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            Saved Sarees &amp; Wishlist
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {wishlistCount} {wishlistCount === 1 ? "saree" : "sarees"} saved
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
    onClick={() => {
      wishlist.forEach((p) => addToCart(p, 1));
      wishlist.forEach((p) => removeFromWishlist(p.id));
    }}
    variant="secondary"
    size="sm"
  >
            <ShoppingBag className="w-3.5 h-3.5 mr-1" />
            <span>Move All to Bag</span>
          </Button>
          <Button
    onClick={() => navigate("/products")}
    variant="outline"
    size="sm"
  >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => <div
    key={product.id}
    className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between group"
  >
            <div className="relative aspect-3/4 bg-stone-100 overflow-hidden">
              <img
    src={product.images[0]}
    alt={product.name}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    referrerPolicy="no-referrer"
  />
              <button
    onClick={() => removeFromWishlist(product.id)}
    className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors shadow-xs"
    title="Remove from wishlist"
  >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-[#a07817] uppercase tracking-wider">
                  {product.fabric}
                </span>
                <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 mt-0.5">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice > product.price && <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                      {formatINR(product.originalPrice)}
                    </span>}
                </div>
              </div>

              <Button
    onClick={() => {
      addToCart(product, 1);
      removeFromWishlist(product.id);
    }}
    size="sm"
    className="w-full text-xs"
  >
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                <span>Move to Bag</span>
              </Button>
            </div>
          </div>)}
      </div>
    </div>;
};
