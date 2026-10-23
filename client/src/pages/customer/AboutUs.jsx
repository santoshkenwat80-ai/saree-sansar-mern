import { Link } from "react-router-dom";
import { Award, ShieldCheck, HeartHandshake, Sparkles, ArrowRight } from "lucide-react";
export const AboutUs = () => {
  const heritagePilars = [
    {
      title: "Varanasi Master Weavers",
      desc: "Generations-old artisan families hand-weaving pure Mulberry silks and real tested zari on authentic wooden pit looms.",
      icon: Award
    },
    {
      title: "Silk Mark Certified Purity",
      desc: "Every single saree carries the prestigious Silk Mark Organization of India certification tag, guaranteeing 100% natural silk.",
      icon: ShieldCheck
    },
    {
      title: "Direct Weaver Patronage",
      desc: "Eliminating middlemen to ensure fair remuneration to our master artisans while offering patrons royal sarees at authentic prices.",
      icon: HeartHandshake
    }
  ];
  return <div className="bg-[#FCF9F5] text-stone-900 pb-20">
      {
    /* 1. Hero Section */
  }
      <section className="relative bg-[#2e0912] text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#f2ce6e] font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#f2ce6e]" />
            <span>Heritage Weaves of India Since Generations</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            About Saree Sansar
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            साड़ी संसार — भारत की समृद्ध सांस्कृतिक विरासत, प्रामाणिक हैंडलूम कला और सदियों पुरानी बुनाई परंपराओं का जीवंत संगम।
          </p>
        </div>
      </section>

      {
    /* 2. Story Section */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#a07817] font-semibold">
              Our Royal Legacy
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
              Preserving India’s Golden Handloom Traditions
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Founded with a reverent passion for India’s timeless textile poetry, <strong>Saree Sansar</strong> bridges the sacred handlooms of Varanasi, the temple weavers of Kanchipuram, and the featherlight organza artisans of Chanderi directly to patrons across the globe.
            </p>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Every warp and weft in our collection tells a story of devotion. A single bridal Banarasi or Kanjivaram saree often takes between <strong>20 to 45 days</strong> of painstaking hand-weaving by master artisans, blending tested gold zari with pure Mulberry silk.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
    to="/products"
    className="px-6 py-3 bg-[#6b1426] hover:bg-[#520f1d] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
  >
                <span>Explore Sarees (साड़ी देखें)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
    to="/categories"
    className="px-6 py-3 border border-stone-300 hover:border-stone-400 bg-white text-stone-800 text-xs font-semibold rounded-xl transition-all"
  >
                <span>View Collections (कलेक्शन)</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
              <img
    src="/src/assets/images/hero_saree_royal_palace_1792385155671.jpg"
    alt="Master Weavers Handloom Saree"
    className="w-full h-auto object-cover"
  />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#f2ce6e]">
                    Direct From Varanasi Looms
                  </span>
                  <p className="text-sm font-semibold">
                    100% Tested Zari &amp; Certified Natural Silk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {
    /* 3. Core Pillars */
  }
      <section className="bg-stone-100/70 py-16 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#a07817] font-semibold">
              Why Patrons Trust Us
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Our Uncompromised Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {heritagePilars.map((p) => {
    const Icon = p.icon;
    return <div key={p.title} className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#881930] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{p.desc}</p>
                </div>;
  })}
          </div>
        </div>
      </section>

      {
    /* 4. Contact & Support Note */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-stone-900">
          Have a Custom Weave Request or Wedding Order?
        </h3>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          Contact our heritage concierges directly. We custom weave bespoke bridal sarees with personalized color palettes and initials.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <a
    href="https://api.whatsapp.com/send?phone=916267961163&text=Hello%20Saree%20Sansar!%20I%20would%20like%20to%20inquire%20about%20custom%20bridal%20weaves."
    target="_blank"
    rel="noopener noreferrer"
    className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
  >
            <span>WhatsApp Concierge (+91 6267961163)</span>
          </a>
        </div>
      </section>
    </div>;
};
