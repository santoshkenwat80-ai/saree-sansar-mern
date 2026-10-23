import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ExternalLink,
  Layers,
  Scissors
} from "lucide-react";
import { formatINR, calculateDiscount } from "../../utils/currency";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { Button } from "../common/Button";
import toast from "react-hot-toast";
export const QuickViewModal = ({
  product,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { isInWishlist, addToWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedJustNow, setAddedJustNow] = useState(false);
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0] || "");
      setQuantity(1);
      setAddedJustNow(false);
    }
  }, [product, isOpen]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen || !product) return null;
  const isLiked = isInWishlist(product.id);
  const discountVal = calculateDiscount(product.originalPrice, product.price);
  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setAddedJustNow(true);
    toast.success(`Added ${quantity} ${quantity === 1 ? "saree" : "sarees"} to your shopping bag!`, {
      icon: "\u{1F6CD}\uFE0F",
      duration: 2500
    });
  };
  const handleViewFullProduct = () => {
    onClose();
    navigate(`/products/${product.slug}`);
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      {
    /* Backdrop */
  }
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div
    className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity cursor-pointer animate-fade-in"
    onClick={onClose}
    aria-hidden="true"
  />

        {
    /* Modal Dialog Card */
  }
        <div
    className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-4xl my-4 border border-stone-200 z-10 animate-scale-in"
    onClick={(e) => e.stopPropagation()}
  >
          {
    /* Top Close Button */
  }
          <button
    onClick={onClose}
    className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-stone-800 bg-white/90 hover:bg-white rounded-full transition-all shadow-xs cursor-pointer border border-stone-200/60"
    aria-label="Close modal"
  >
            <X className="w-5 h-5" />
          </button>

          {
    /* Quick View Grid: Visual Gallery (Left) & Product Details / Add to Bag (Right) */
  }
          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] md:max-h-[88vh] overflow-y-auto">
            {
    /* Left: Gallery & Imagery (Col 1-5) */
  }
            <div className="md:col-span-5 bg-stone-50 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
              <div className="space-y-3">
                {
    /* Main Large Image Frame */
  }
                <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-2xs group">
                  <img
    src={selectedImage || product.images[0]}
    alt={product.name}
    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
    referrerPolicy="no-referrer"
    onError={(e) => {
      const target = e.currentTarget;
      target.onerror = null;
      target.src = product.images[0] || "";
    }}
  />

                  {
    /* Silk Mark Badge */
  }
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-stone-900 border border-stone-200 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#a07817]" />
                    <span>Silk Mark Certified</span>
                  </div>

                  {
    /* Discount Badge */
  }
                  {discountVal > 0 && <div className="absolute top-3 right-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs font-mono">
                      {discountVal}% OFF
                    </div>}
                </div>

                {
    /* Thumbnails if multiple images exist */
  }
                {product.images.length > 1 && <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => <button
    key={idx}
    onClick={() => setSelectedImage(img)}
    className={`w-14 h-18 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${(selectedImage || product.images[0]) === img ? "border-[#881930] shadow-2xs ring-1 ring-[#881930]" : "border-transparent opacity-70 hover:opacity-100"}`}
  >
                        <img
    src={img}
    alt={`${product.name} view ${idx + 1}`}
    className="w-full h-full object-cover object-top"
    referrerPolicy="no-referrer"
  />
                      </button>)}
                  </div>}
              </div>

              {
    /* Artisan Note */
  }
              <div className="mt-4 pt-3 border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center justify-between">
                <span>Origin: {product.specifications?.Origin || "Artisanal Handloom"}</span>
                <span className="font-mono text-stone-400">SKU: {product.sku}</span>
              </div>
            </div>

            {
    /* Right: Product Details & Add to Bag (Col 6-12) */
  }
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {
    /* Category & Fabric Header */
  }
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#a07817] uppercase tracking-wider mb-1">
                    <span>{product.fabric}</span>
                    {product.weavingTechnique && <>
                        <span>•</span>
                        <span>{product.weavingTechnique}</span>
                      </>}
                  </div>

                  {
    /* Product Title with Link */
  }
                  <h2
    onClick={handleViewFullProduct}
    className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug hover:text-[#881930] cursor-pointer transition-colors"
  >
                    {product.name}
                  </h2>

                  {
    /* Rating & Patron reviews */
  }
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => <Star
    key={i}
    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-current" : "text-stone-300"}`}
  />)}
                    </div>
                    <span className="text-xs font-mono font-semibold text-stone-800">
                      {product.rating}
                    </span>
                    <span className="text-xs text-stone-400">
                      ({product.reviewsCount} Patron Reviews)
                    </span>
                  </div>
                </div>

                {
    /* Price Display */
  }
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#6b1426] font-mono tabular-nums">
                      {formatINR(product.price)}
                    </span>
                    {product.originalPrice > product.price && <span className="text-xs sm:text-sm text-stone-400 line-through font-mono tabular-nums">
                        {formatINR(product.originalPrice)}
                      </span>}
                    {discountVal > 0 && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Save {discountVal}%
                      </span>}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Inclusive of all taxes (GST 5%) · Free insured express shipping across India
                  </p>
                </div>

                {
    /* Short Description */
  }
                <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                {
    /* Specifications Pills */
  }
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 bg-stone-50/60 p-3 rounded-lg border border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#a07817]" />
                    <span>
                      Length: <strong className="font-medium text-stone-900">{product.sareeLength?.split(" ")[0] || "5.5"}m</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-[#a07817]" />
                    <span>
                      Blouse: <strong className="font-medium text-stone-900">{product.blousePieceIncluded ? "Included" : "Separately Available"}</strong>
                    </span>
                  </div>
                  <div className="col-span-2 text-[11px] text-stone-500 truncate">
                    Palette: <strong className="font-medium text-stone-800">{product.color}</strong> · Occasion: <strong className="font-medium text-stone-800">{product.occasion}</strong>
                  </div>
                </div>

                {
    /* Stock Indicator */
  }
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 uppercase tracking-wider text-[11px]">
                    Availability
                  </span>
                  {product.stock > 0 ? <span className="font-medium text-emerald-700 flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" />
                      {product.stock <= 5 ? `Only ${product.stock} left in stock` : "In Stock & Ready to Dispatch"}
                    </span> : <span className="font-medium text-rose-600">Currently Sold Out</span>}
                </div>

                {
    /* Quantity and Action Buttons */
  }
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3">
                    {
    /* Quantity Counter */
  }
                    {product.stock > 0 && <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden shrink-0">
                        <button
    onClick={() => setQuantity(Math.max(1, quantity - 1))}
    disabled={quantity <= 1}
    className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors cursor-pointer text-xs font-bold"
    aria-label="Decrease quantity"
  >
                          -
                        </button>
                        <span className="px-3 py-2 text-xs font-mono font-semibold min-w-[32px] text-center">
                          {quantity}
                        </span>
                        <button
    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
    disabled={quantity >= product.stock}
    className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors cursor-pointer text-xs font-bold"
    aria-label="Increase quantity"
  >
                          +
                        </button>
                      </div>}

                    {
    /* Add to Bag Button */
  }
                    <Button
    onClick={handleAddToCart}
    disabled={product.stock <= 0}
    className="flex-1 text-xs sm:text-sm py-2.5"
  >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      <span>{product.stock > 0 ? "Add to Shopping Bag" : "Sold Out"}</span>
                    </Button>

                    {
    /* Wishlist Button */
  }
                    <button
    onClick={() => addToWishlist(product)}
    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${isLiked ? "border-rose-300 bg-rose-50 text-rose-600" : "border-stone-300 text-stone-700 hover:text-rose-600 hover:border-stone-400 bg-white"}`}
    title={isLiked ? "In Wishlist" : "Add to Wishlist"}
    aria-label="Wishlist"
  >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-current text-rose-600" : ""}`} />
                    </button>
                  </div>

                  {
    /* Added to Bag Instant Feedback Banner */
  }
                  {addedJustNow && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs animate-fade-in">
                      <div className="flex items-center gap-2 text-emerald-800 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Added to your bag! Continue browsing or checkout.</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
    onClick={() => {
      onClose();
      setIsCartDrawerOpen(true);
    }}
    className="px-2.5 py-1 bg-emerald-800 text-white rounded font-medium hover:bg-emerald-900 transition-colors cursor-pointer text-[11px]"
  >
                          View Bag
                        </button>
                      </div>
                    </div>}
                </div>
              </div>

              {
    /* Bottom Footer: Trust highlights & Full Page Link */
  }
              <div className="pt-4 border-t border-stone-200 space-y-3">
                {
    /* Trust mini-strip */
  }
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-stone-500">
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#881930]" />
                    <span>Silk Mark</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#881930]" />
                    <span>Insured Transit</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-[#881930]" />
                    <span>7 Days Return</span>
                  </div>
                </div>

                {
    /* View Full Product & Styling Guide Link */
  }
                <button
    onClick={handleViewFullProduct}
    className="w-full py-2 px-3 text-xs font-semibold text-[#881930] hover:text-[#520f1d] hover:bg-stone-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
  >
                  <span>Explore Full Saree Details &amp; Styling Guide</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
