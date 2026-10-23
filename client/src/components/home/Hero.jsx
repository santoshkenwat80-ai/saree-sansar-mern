import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Award, ShieldCheck, Truck, RefreshCw } from "lucide-react";
export const Hero = () => {
  const quickCategories = [
    { name: "Banarasi Katan Silk", path: "/products?category=banarasi-silk" },
    { name: "Kanjivaram Temple Silk", path: "/products?category=kanjivaram-silk" },
    { name: "Chanderi & Organza", path: "/products?category=chanderi-organza" },
    { name: "Bridal Heritage Trousseau", path: "/products?category=bridal-heritage" }
  ];
  return <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden bg-stone-950 text-white">
      {
    /* 1. High-Quality Hero Background Image */
  }
      <div className="absolute inset-0 z-0">
        <img
    src="/src/assets/images/hero_saree_royal_palace_1792385155671.jpg"
    alt="Royal Indian Silk Sarees draped gracefully in heritage palace"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover object-[center_35%] lg:object-right transition-transform duration-1000 scale-100 hover:scale-105"
  />

        {
    /* Cinematic Scrim Gradient: Ensures WCAG AA text contrast on left while keeping sarees radiant on right */
  }
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 sm:via-stone-950/65 to-stone-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />

        {
    /* Subtle Gold Brocade Texture Overlay */
  }
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f2ce6e_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      </div>

      {
    /* 2. Hero Content Container */
  }
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 w-full">
        <div className="max-w-2xl lg:max-w-3xl space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
          {
    /* Overline / Kicker (Clean unboxed typography) */
  }
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#f2ce6e]">
            <Sparkles className="w-4 h-4 text-[#f2ce6e] shrink-0" />
            <span>The Royal Heritage Collection 2026</span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span className="text-stone-300">Varanasi &amp; Kanchipuram</span>
          </div>

          {
    /* Main Regal Headline */
  }
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] text-balance">
              Draped in Royalty, Woven for Eternity.
            </h1>
            <p className="font-serif text-lg sm:text-xl text-[#f2ce6e]/90 italic font-medium">
              शाही सिल्क साड़ियां • शुद्ध हैंडलूम का अटूट विश्वास
            </p>
          </div>

          {
    /* Description */
  }
          <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl font-normal drop-shadow-xs">
            Handcrafted on the historic handlooms of Varanasi and Kanchipuram. Discover pure Katan silk, tested gold zari brocades, and certified Silk Mark masterworks woven for weddings and majestic celebrations.
          </p>

          {
    /* Call to Action Buttons */
  }
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Link
    to="/products"
    className="inline-flex items-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-[#f2ce6e] hover:bg-[#ffe394] text-stone-950 font-bold text-sm rounded-xl shadow-xl hover:shadow-[#f2ce6e]/30 transition-all duration-300 group cursor-pointer active:scale-95"
  >
              <span>Explore Saree Collection (साड़ी कलेक्शन देखें)</span>
              <ArrowRight className="w-4 h-4 text-stone-950 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            <Link
    to="/products?category=bridal-heritage"
    className="inline-flex items-center gap-2 px-6 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 hover:border-white/40 font-semibold text-sm rounded-xl transition-all duration-300 cursor-pointer"
  >
              <span>Bridal Heritage (दुल्हन संग्रह)</span>
            </Link>
          </div>

          {
    /* Quick Category Chips */
  }
          <div className="pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block mb-2">
              Popular Weaves:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {quickCategories.map((item) => <Link
    key={item.name}
    to={item.path}
    className="text-xs px-3 py-1.5 rounded-lg bg-stone-900/80 hover:bg-[#881930] text-stone-300 hover:text-white border border-stone-800 hover:border-[#881930] transition-colors"
  >
                  {item.name}
                </Link>)}
            </div>
          </div>

          {
    /* Heritage Trust Badges */
  }
          <div className="pt-4 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#f2ce6e] shrink-0" />
              <span>100% Silk Mark Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#f2ce6e] shrink-0" />
              <span>Direct Weaver Price</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#f2ce6e] shrink-0" />
              <span>Free Delivery &amp; COD</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#f2ce6e] shrink-0" />
              <span>Authentic Handloom</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;
