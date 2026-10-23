import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { formatINR } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { QuickViewModal } from "./QuickViewModal";
export const ProductCard = ({
  product,
  onQuickView
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist } = useWishlist();
  const [isLocalQuickViewOpen, setIsLocalQuickViewOpen] = useState(false);
  const isLiked = isInWishlist(product.id);
  const handleOpenQuickView = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onQuickView) {
      onQuickView(product);
    } else {
      setIsLocalQuickViewOpen(true);
    }
  };
  return <>
      <div className="group relative bg-white border border-stone-200/80 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {
    /* Visual Slot / Imagery */
  }
        <div className="relative aspect-3/4 w-full overflow-hidden bg-stone-100">
          <Link to={`/products/${product.slug}`} className="block w-full h-full">
            <img
    src={product.images[0]}
    alt={product.name}
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
    onError={(e) => {
      const target = e.currentTarget;
      target.onerror = null;
      target.style.display = "none";
      const parent = target.parentElement;
      if (parent) {
        parent.classList.add("bg-stone-200", "flex", "items-center", "justify-center");
        parent.innerHTML = `<span class="text-stone-500 font-serif text-sm">Saree Sansar Handloom</span>`;
      }
    }}
  />
          </Link>

          {
    /* Subtle Single Tag */
  }
          {product.isBestSeller ? <div className="absolute top-3 left-3 bg-[#6b1426] text-[#f2ce6e] text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
              Bestseller
            </div> : product.isNewArrival ? <div className="absolute top-3 left-3 bg-stone-900 text-stone-100 text-[10px] font-medium px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
              New Drop
            </div> : null}

          {
    /* Top-Right Action Buttons: Quick View + Wishlist */
  }
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {
    /* Quick View Mini Button */
  }
            <button
    onClick={handleOpenQuickView}
    className="p-2 rounded-full bg-white/90 text-stone-700 hover:text-[#6b1426] hover:bg-white transition-all duration-200 shadow-xs cursor-pointer backdrop-blur-xs"
    title="Quick View Saree"
    aria-label="Quick View"
  >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {
    /* Wishlist Button */
  }
            <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      addToWishlist(product);
    }}
    className={`p-2 rounded-full transition-all duration-200 shadow-xs cursor-pointer backdrop-blur-xs ${isLiked ? "bg-rose-50 text-rose-600" : "bg-white/90 text-stone-700 hover:text-rose-600 hover:bg-white"}`}
    title={isLiked ? "Remove from wishlist" : "Save to wishlist"}
    aria-label="Wishlist"
  >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current text-rose-600" : ""}`} />
            </button>
          </div>

          {
    /* Quick Actions Hover Overlay (Quick View + Quick Add) */
  }
          <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2 z-10">
            {
    /* Quick View Button */
  }
            <button
    onClick={handleOpenQuickView}
    className="flex-1 py-2 px-2.5 bg-white/95 hover:bg-white text-stone-900 hover:text-[#6b1426] text-xs font-semibold rounded-lg shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-stone-200 backdrop-blur-xs"
    title="Quick View Saree Details"
  >
              <Eye className="w-3.5 h-3.5 text-[#881930]" />
              <span>Quick View</span>
            </button>

            {
    /* Quick Add Button */
  }
            <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product, 1);
    }}
    className="py-2 px-3 bg-[#6b1426] text-white text-xs font-semibold rounded-lg shadow-md hover:bg-[#520f1d] flex items-center justify-center gap-1 cursor-pointer transition-colors"
    title="Add to Shopping Bag directly"
    aria-label="Quick Add to Bag"
  >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {
    /* Product Content Details */
  }
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
          <div>
            {
    /* Metadata clean text */
  }
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-medium uppercase tracking-wider text-[#a07817]">
                {product.fabric}
              </span>
              <div className="flex items-center gap-1 font-mono text-stone-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400">({product.reviewsCount})</span>
              </div>
            </div>

            {
    /* Title */
  }
            <Link to={`/products/${product.slug}`} className="block group-hover:text-[#6b1426] transition-colors">
              <h3 className="text-sm font-semibold text-stone-900 line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>

            {(product.weavingTechnique || product.specifications?.Weave) && <div className="mt-1 flex items-center gap-1 text-[11px] text-stone-600">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a07817]" />
                <span className="truncate">
                  {product.weavingTechnique || product.specifications?.Weave}
                </span>
              </div>}
          </div>

          {
    /* Price Row with Tabular Numerals */
  }
          <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                  {formatINR(product.originalPrice)}
                </span>}
            </div>
            {product.discountPercent > 0 && <span className="text-[11px] font-semibold text-emerald-700 font-mono">
                {product.discountPercent}% OFF
              </span>}
          </div>

          {
    /* Quick Add to Bag Action Button (Always Accessible) */
  }
          <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product, 1);
    }}
    className="w-full mt-1 py-2 px-3 bg-[#6b1426] hover:bg-[#520f1d] active:bg-[#3d0b16] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
    aria-label={`Add ${product.name} to Shopping Bag`}
  >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>बैग में जोड़ें (Add to Bag)</span>
          </button>
        </div>
      </div>

      {
    /* Local fallback modal if parent didn't provide onQuickView */
  }
      {!onQuickView && <QuickViewModal
    product={product}
    isOpen={isLocalQuickViewOpen}
    onClose={() => setIsLocalQuickViewOpen(false)}
  />}
    </>;
};
