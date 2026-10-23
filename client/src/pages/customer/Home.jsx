import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Copy, Check, ShieldCheck, HeartHandshake } from "lucide-react";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { ProductCard } from "../../components/products/ProductCard";
import { QuickViewModal } from "../../components/products/QuickViewModal";
import { Button } from "../../components/common/Button";
import { Hero } from "../../components/home/Hero";
import toast from "react-hot-toast";
export const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("trending");
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    productService.getProducts().then(setProducts);
    categoryService.getCategories().then(setCategories);
  }, []);
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCoupon(null), 3e3);
  };
  const filteredShowcase = products.filter((p) => {
    if (activeTab === "bestsellers") return p.isBestSeller;
    if (activeTab === "new") return p.isNewArrival;
    return p.isFeatured;
  });
  return <div className="space-y-16 lg:space-y-24 pb-20">
      {
    /* 1. Hero Campaign Banner Slider */
  }
      <Hero />

      {
    /* 2. Curated Weaving Regions / Categories */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817]">
            Timeless Traditions
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
            Shop by Weaving Heritage
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Each region weaves a distinct legacy of motifs, borders, and pure artisanal poetry.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => <Link
    key={cat.id}
    to={`/products?category=${cat.slug}`}
    className="group flex flex-col items-center text-center p-3 rounded-xl bg-white border border-stone-200/80 hover:border-[#881930] hover:shadow-md transition-all duration-300"
  >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 bg-stone-100 border-2 border-stone-200 group-hover:border-[#881930] transition-colors">
                <img
    src={cat.image}
    alt={cat.name}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
  />
              </div>
              <h3 className="font-medium text-stone-900 text-sm group-hover:text-[#6b1426] transition-colors">
                {cat.name}
              </h3>
              <span className="text-[11px] text-stone-500 mt-0.5">
                {cat.productCount} Designs
              </span>
            </Link>)}
        </div>
      </section>

      {
    /* 3. Featured Showcase Grid (Anti-slop clean tabbed filter) */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817]">
              Handcrafted Catalogue
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Ethnic Masterpieces
            </h2>
          </div>

          {
    /* Clean Segmented Tab Buttons */
  }
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg self-start sm:self-auto">
            <button
    onClick={() => setActiveTab("trending")}
    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${activeTab === "trending" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"}`}
  >
              Trending Now
            </button>
            <button
    onClick={() => setActiveTab("bestsellers")}
    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${activeTab === "bestsellers" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"}`}
  >
              Bestsellers
            </button>
            <button
    onClick={() => setActiveTab("new")}
    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${activeTab === "new" ? "bg-white text-stone-900 shadow-xs" : "text-stone-600 hover:text-stone-900"}`}
  >
              New Drops
            </button>
          </div>
        </div>

        {
    /* 3-Column Product Grid */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredShowcase.map((product) => <ProductCard
    key={product.id}
    product={product}
    onQuickView={setQuickViewProduct}
  />)}
        </div>

        <div className="mt-12 text-center">
          <Button
    onClick={() => navigate("/products")}
    variant="outline"
    size="lg"
    className="px-8"
  >
            <span>View All Sarees &amp; Fabrics</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {
    /* 4. Promotional Coupon Spotlight Banner */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#520f1d] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-amber-900/40">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-semibold text-[#f2ce6e] uppercase tracking-widest">
              Limited Festive Privileges
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-2 mb-3">
              Special Savings for Discerning Wardrobes
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed mb-6">
              Apply these verified promotion codes during checkout to avail exclusive royal discounts with complimentary insured shipping.
            </p>

            <div className="flex flex-wrap gap-4">
              {
    /* Coupon 1 */
  }
              <div className="bg-[#380a13] border border-[#a07817]/60 rounded-lg p-3.5 flex items-center justify-between gap-4 min-w-[240px]">
                <div>
                  <p className="font-mono text-base font-bold text-[#f2ce6e]">ROYAL15</p>
                  <p className="text-xs text-stone-300">15% off orders above ₹4,999</p>
                </div>
                <button
    onClick={() => handleCopyCode("ROYAL15")}
    className="p-2 hover:bg-white/10 rounded text-stone-300 hover:text-white transition-colors cursor-pointer"
    title="Copy Code"
  >
                  {copiedCoupon === "ROYAL15" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {
    /* Coupon 2 */
  }
              <div className="bg-[#380a13] border border-[#a07817]/60 rounded-lg p-3.5 flex items-center justify-between gap-4 min-w-[240px]">
                <div>
                  <p className="font-mono text-base font-bold text-[#f2ce6e]">FIRST10</p>
                  <p className="text-xs text-stone-300">10% off your maiden order</p>
                </div>
                <button
    onClick={() => handleCopyCode("FIRST10")}
    className="p-2 hover:bg-white/10 rounded text-stone-300 hover:text-white transition-colors cursor-pointer"
    title="Copy Code"
  >
                  {copiedCoupon === "FIRST10" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* 5. Craftsmanship & Ethical Artisanship Story */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817]">
              Purity &amp; Heritage
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              Every Thread Carries a Weaver&apos;s Soul and 500 Years of Heritage
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              At Saree Sansar, we work directly with certified artisan clusters in Varanasi, Kanchipuram, Chanderi, and Murshidabad. We eliminate middlemen to ensure our weavers receive fair wages and you receive 100% genuine Silk Mark certified weaves at honest boutique pricing.
            </p>
            <div className="space-y-2 pt-2 text-sm text-stone-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#881930]" />
                <span>Certified Pure Mulberry and Katan Silks</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#881930]" />
                <span>Direct Artisan Profit Sharing Initiative</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200/80 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Patron Testimonials
            </h3>
            <div className="space-y-4 text-sm">
              <div className="border-l-2 border-[#a07817] pl-4 py-1">
                <p className="text-stone-700 italic">
                  &ldquo;The Crimson Banarasi Katan saree arrived in Delhi within 3 days. The weight of the silk and the brilliance of the antique zari took my breath away on my wedding day.&rdquo;
                </p>
                <p className="text-xs font-semibold text-stone-900 mt-2">
                  — Dr. Meenakshi Iyer, New Delhi
                </p>
              </div>
              <div className="border-l-2 border-[#a07817] pl-4 py-1">
                <p className="text-stone-700 italic">
                  &ldquo;Kanjivaram sarees are often imitated online, but Saree Sansar delivered genuine Silk Mark quality with proper certificate. Exceptional customer service.&rdquo;
                </p>
                <p className="text-xs font-semibold text-stone-900 mt-2">
                  — Sunita Rao, Bangalore
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* Quick View Modal */
  }
      <QuickViewModal
    product={quickViewProduct}
    isOpen={!!quickViewProduct}
    onClose={() => setQuickViewProduct(null)}
  />
    </div>;
};
