import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Share2,
  MapPin,
  Sparkles
} from "lucide-react";
import { productService } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatINR, calculateDiscount } from "../../utils/currency";
import { isValidIndianPincode } from "../../utils/validators";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { ProductCard } from "../../components/products/ProductCard";
import { SareeReviews } from "../../components/products/SareeReviews";
import { StylingGuide } from "../../components/products/StylingGuide";
import toast from "react-hot-toast";
export const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState({ checked: false });
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist } = useWishlist();
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService.getProductByIdOrSlug(slug).then((prod) => {
      setProduct(prod);
      if (prod) {
        setSelectedImage(prod.images[0]);
        productService.getProducts({ category: prod.category }).then((all) => {
          setRelatedProducts(all.filter((p) => p.id !== prod.id).slice(0, 3));
        });
      }
    }).finally(() => setLoading(false));
  }, [slug]);
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!isValidIndianPincode(pincode)) {
      setPincodeStatus({
        checked: true,
        available: false,
        message: "Please enter a valid 6-digit Indian PIN code"
      });
      return;
    }
    const isMetro = ["110", "400", "560", "700", "600", "500"].some(
      (prefix) => pincode.startsWith(prefix)
    );
    const estDays = isMetro ? "2-3 business days" : "4-5 business days";
    setPincodeStatus({
      checked: true,
      available: true,
      message: `Delivery available by ${estDays}. Free Express Shipping applicable.`
    });
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard");
    }
  };
  if (loading) return <Loader message="Unveiling royal saree..." />;
  if (!product) {
    return <div className="py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Saree Not Found</h2>
        <p className="text-sm text-stone-500 mt-2">The requested saree might be unlisted or archived.</p>
        <Link to="/products" className="inline-block mt-4 text-[#881930] font-semibold underline">
          Return to All Collections
        </Link>
      </div>;
  }
  const isLiked = isInWishlist(product.id);
  const discountVal = calculateDiscount(product.originalPrice, product.price);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24">
      {
    /* Breadcrumb */
  }
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <Link to="/products" className="hover:text-stone-900">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span className="text-[#881930] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {
    /* Main PDP Grid: Sticky Gallery (Left) vs Contiguous Purchase Module (Right) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {
    /* Left: Gallery */
  }
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {
    /* Thumbnails */
  }
          {product.images.length > 1 && <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0">
              {product.images.map((img, idx) => <button
    key={idx}
    onClick={() => setSelectedImage(img)}
    className={`w-16 h-20 md:w-20 md:h-26 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === img ? "border-[#881930] shadow-sm" : "border-transparent opacity-70 hover:opacity-100"}`}
  >
                  <img
    src={img}
    alt={`Thumbnail ${idx + 1}`}
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  />
                </button>)}
            </div>}

          {
    /* Primary Main Image Frame */
  }
          <div className="flex-1 relative aspect-3/4 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
            <img
    src={selectedImage || product.images[0]}
    alt={product.name}
    className="w-full h-full object-cover object-top"
    referrerPolicy="no-referrer"
  />
            {
    /* Silk Mark Badge */
  }
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-stone-900 border border-stone-200 text-xs font-semibold px-2.5 py-1 rounded-sm shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#a07817]" />
              <span>Silk Mark Authenticated</span>
            </div>

            <button
    onClick={handleShare}
    className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-xs text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
    title="Share Saree"
  >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {
    /* Right: Contiguous Purchase Module */
  }
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#a07817] uppercase tracking-wider mb-1">
              <span>{product.fabric}</span>
              <span>·</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h1>

            {
    /* Rating */
  }
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => <Star
    key={i}
    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-stone-300"}`}
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
    /* Pricing Row */
  }
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/80 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-[#6b1426] font-mono tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                  {formatINR(product.originalPrice)}
                </span>}
              {discountVal > 0 && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Save {discountVal}%
                </span>}
            </div>
            <p className="text-[11px] text-stone-500">
              Inclusive of all taxes (GST 5%). Free insured shipping across India.
            </p>
          </div>

          {
    /* Short Description */
  }
          <p className="text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {
    /* Stock and Quantity */
  }
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Availability
              </span>
              {product.stock > 0 ? <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 font-mono">
                  <Check className="w-3.5 h-3.5" />
                  {product.stock <= 5 ? `Only ${product.stock} in stock` : "In Stock & Ready to Dispatch"}
                </span> : <span className="text-xs font-medium text-rose-600">Currently Sold Out</span>}
            </div>

            {
    /* Quantity Selector */
  }
            {product.stock > 0 && <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center border border-stone-300 rounded-md">
                  <button
    onClick={() => setQuantity(Math.max(1, quantity - 1))}
    disabled={quantity <= 1}
    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-sm font-mono font-semibold">
                    {quantity}
                  </span>
                  <button
    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
    disabled={quantity >= product.stock}
    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
  >
                    +
                  </button>
                </div>
              </div>}
          </div>

          {
    /* Primary Action Buttons */
  }
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <Button
    onClick={() => addToCart(product, quantity)}
    size="lg"
    variant="outline"
    className="flex-1 border-[#6b1426] text-[#6b1426] hover:bg-rose-50"
    disabled={product.stock <= 0}
  >
                <ShoppingBag className="w-4 h-4 mr-2" />
                <span>{product.stock > 0 ? "\u092C\u0948\u0917 \u092E\u0947\u0902 \u091C\u094B\u0921\u093C\u0947\u0902" : "Out of Stock"}</span>
              </Button>
              <Button
    onClick={() => {
      addToCart(product, quantity);
      navigate("/checkout");
    }}
    size="lg"
    className="flex-1 bg-[#6b1426] hover:bg-[#520f1d] text-white shadow-md"
    disabled={product.stock <= 0}
  >
                <Sparkles className="w-4 h-4 mr-1 text-[#f2ce6e]" />
                <span>तुरंत खरीदें (Buy Now)</span>
              </Button>
              <Button
    onClick={() => addToWishlist(product)}
    variant="outline"
    size="lg"
    className={isLiked ? "text-rose-600 border-rose-300" : ""}
    title={isLiked ? "In Wishlist" : "Add to Wishlist"}
  >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current text-rose-600" : ""}`} />
              </Button>
            </div>

            {
    /* WhatsApp Video Consultation Link */
  }
            <a
    href={`https://wa.me/919876543210?text=${encodeURIComponent(
      `\u0928\u092E\u0938\u094D\u0924\u0947 Saree Sansar! \u092E\u0948\u0902 \u0907\u0938 \u0938\u093E\u0921\u093C\u0940 \u0915\u093E \u0905\u0938\u0932\u0940 \u0935\u0940\u0921\u093F\u092F\u094B \u0935 \u092B\u094B\u091F\u094B \u0926\u0947\u0916\u0928\u093E \u091A\u093E\u0939\u0924\u093E/\u091A\u093E\u0939\u0924\u0940 \u0939\u0942\u0901: ${product.name} (\u092E\u0942\u0932\u094D\u092F: \u20B9${product.price})`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
  >
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span>💬 WhatsApp पर साड़ी का लाइव वीडियो/फोटो मांगें</span>
            </a>
          </div>

          {
    /* Delivery PIN Code Checker */
  }
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#881930]" />
              Check Delivery Estimate
            </h4>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
    type="text"
    placeholder="Enter 6-digit PIN (e.g. 110001)"
    maxLength={6}
    value={pincode}
    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
              <Button type="submit" variant="secondary" size="sm">
                Check
              </Button>
            </form>
            {pincodeStatus.checked && <p
    className={`text-xs mt-2 ${pincodeStatus.available ? "text-emerald-700" : "text-rose-600"}`}
  >
                {pincodeStatus.message}
              </p>}
          </div>

          {
    /* Trust Highlights */
  }
          <div className="pt-4 border-t border-stone-200 grid grid-cols-3 gap-2 text-center text-[11px] text-stone-600">
            <div className="p-2 bg-stone-50 rounded">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#881930]" />
              <span>100% Silk Mark</span>
            </div>
            <div className="p-2 bg-stone-50 rounded">
              <Truck className="w-4 h-4 mx-auto mb-1 text-[#881930]" />
              <span>Insured Transit</span>
            </div>
            <div className="p-2 bg-stone-50 rounded">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-[#881930]" />
              <span>7 Days Return</span>
            </div>
          </div>

          {
    /* Quick Styling Guide Banner */
  }
          <a
    href="#styling-guide"
    className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#fbf5eb] to-[#fcf8f0] border border-[#ebd9c3] hover:border-[#a07817] transition-all text-xs group shadow-2xs cursor-pointer"
  >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#a07817] shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-[#4a0e1b] block">
                  Royal Styling &amp; Draping Guide
                </span>
                <span className="text-[11px] text-stone-600 block">
                  Drape secrets for {product.fabric} &amp; jewelry pairings
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a07817] group-hover:translate-x-1 transition-transform shrink-0" />
          </a>
        </div>
      </div>

      {
    /* Specifications & Craft Details */
  }
      <div className="mt-16 pt-12 border-t border-stone-200">
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
          Weaving Specifications &amp; Care
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {
    /* Table */
  }
          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-stone-100">
                <tr className="bg-stone-50/50">
                  <td className="px-4 py-3 font-semibold text-stone-600 w-1/3">Fabric</td>
                  <td className="px-4 py-3 text-stone-900">{product.fabric}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-stone-600">Color Palette</td>
                  <td className="px-4 py-3 text-stone-900">{product.color}</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="px-4 py-3 font-semibold text-stone-600">Occasion</td>
                  <td className="px-4 py-3 text-stone-900">{product.occasion}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-stone-600">Length &amp; Blouse</td>
                  <td className="px-4 py-3 text-stone-900">{product.sareeLength}</td>
                </tr>
                {Object.entries(product.specifications || {}).map(([key, val]) => <tr key={key} className="even:bg-stone-50/50">
                    <td className="px-4 py-3 font-semibold text-stone-600">{key}</td>
                    <td className="px-4 py-3 text-stone-900">{val}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>

          {
    /* Care Instructions */
  }
          <div className="bg-[#fcf9f2] p-6 rounded-lg border border-[#ebd9c3] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#4a0e1b]">
              Heirloom Saree Preservation
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              {product.careInstructions}
            </p>
            <div className="text-xs text-stone-600 space-y-2 pt-2 border-t border-[#dfb746]/40">
              <p>• Always fold your pure silk sarees along different creases every 3-4 months.</p>
              <p>• Avoid storing in plastic bags; use unbleached pure cotton or muslin covers.</p>
              <p>• Keep away from moisture and direct sunlight to protect the antique zari sheen.</p>
            </div>
          </div>
        </div>
      </div>

      {
    /* Bespoke Styling & Draping Guide Section */
  }
      <StylingGuide product={product} />

      {
    /* Customer Ratings & Feedback Section */
  }
      <SareeReviews sareeId={product.id} sareeName={product.name} />

      {
    /* Related Products */
  }
      {relatedProducts.length > 0 && <div className="mt-16 pt-12 border-t border-stone-200">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
            Complementary Weaves
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>}

      {
    /* Sticky Mobile Buy Now Bar */
  }
      {product && <div className="md:hidden fixed bottom-15 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-3 py-2 shadow-lg flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-stone-500 block leading-tight">कुल मूल्य</span>
            <span className="text-base font-bold font-mono text-[#6b1426]">
              {formatINR(product.price)}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
    type="button"
    onClick={() => addToCart(product, quantity)}
    disabled={product.stock <= 0}
    className="py-2 px-3 border border-[#6b1426] text-[#6b1426] active:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
  >
              बैग में जोड़ें
            </button>
            <button
    type="button"
    onClick={() => {
      addToCart(product, quantity);
      navigate("/checkout");
    }}
    disabled={product.stock <= 0}
    className="py-2 px-3.5 bg-[#6b1426] active:bg-[#520f1d] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1"
  >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>तुरंत खरीदें</span>
            </button>
          </div>
        </div>}
    </div>;
};
