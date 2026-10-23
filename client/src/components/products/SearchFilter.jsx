import { useState } from "react";
import {
  X,
  Search,
  IndianRupee,
  Sparkles,
  Users,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Layers,
  Wand2,
  CheckCircle2
} from "lucide-react";
import { formatINR } from "../../utils/currency";
export { SidebarFilter } from "./SidebarFilter";
export const CATEGORY_OPTIONS = [
  { slug: "all", name: "All Categories (\u0938\u092D\u0940 \u0938\u093E\u095C\u093F\u092F\u093E\u0901)", short: "All" },
  { slug: "banarasi-silk", name: "Banarasi Silk (\u092C\u0928\u093E\u0930\u0938\u0940 \u0938\u093F\u0932\u094D\u0915)", short: "Banarasi" },
  { slug: "kanjivaram-silk", name: "Kanjivaram Silk (\u0915\u093E\u0902\u091A\u0940\u0935\u0930\u092E \u0938\u093F\u0932\u094D\u0915)", short: "Kanjivaram" },
  { slug: "chanderi-organza", name: "Chanderi & Organza (\u091A\u0902\u0926\u0947\u0930\u0940 \u0935 \u0913\u0930\u094D\u0917\u0947\u0902\u095B\u093E)", short: "Chanderi" },
  { slug: "georgette-chiffon", name: "Georgette & Chiffon (\u091C\u0949\u0930\u094D\u091C\u0947\u091F \u0935 \u0936\u093F\u092B\u0949\u0928)", short: "Georgette" },
  { slug: "bridal-heritage", name: "Bridal Heritage (\u0936\u093E\u0939\u0940 \u0926\u0941\u0932\u094D\u0939\u0928)", short: "Bridal" },
  { slug: "handloom-cotton", name: "Handloom Cotton (\u0939\u0925\u0915\u0930\u0918\u093E \u0938\u0942\u0924\u0940)", short: "Cotton" }
];
export const WEAVING_TECHNIQUES = [
  {
    id: "all",
    name: "All Techniques (\u0938\u092D\u0940 \u0924\u0915\u0928\u0940\u0915\u0947\u0902)",
    badge: "All",
    description: "Explore all traditional Indian handloom craft techniques"
  },
  {
    id: "Kadwa Brocade",
    name: "Kadwa Brocade (\u0915\u0921\u093C\u0935\u093E \u092C\u0941\u0928\u093E\u0908)",
    badge: "Master Kadwa",
    description: "Each booti engraved individually on loom; clean reverse with zero floating threads"
  },
  {
    id: "Korvai Interlock",
    name: "Korvai Interlock (\u0915\u094B\u0930\u0935\u0908 \u092C\u0941\u0928\u093E\u0908)",
    badge: "Temple Interlock",
    description: "Two weavers intertwining solid contrast temple border and body on dual shuttles"
  },
  {
    id: "Katan Silk Handloom",
    name: "Katan Silk Weave (\u0915\u0924\u093E\u0928 \u092C\u0941\u0928\u093E\u0908)",
    badge: "Pure Mulberry",
    description: "Woven with tightly twisted filament silk threads for regal drape and heirloom sheen"
  },
  {
    id: "Khaddi Georgette",
    name: "Khaddi Georgette (\u0916\u0921\u094D\u0921\u0940 \u092C\u0941\u0928\u093E\u0908)",
    badge: "Pitloom Georgette",
    description: "Sheer high-twist yarn handwoven on Banarasi pit looms with silver/gold zari"
  },
  {
    id: "Chanderi Pattu & Gossamer",
    name: "Chanderi Pattu (\u091A\u0902\u0926\u0947\u0930\u0940 \u092A\u091F\u094D\u091F\u0942)",
    badge: "Sheer Gossamer",
    description: "Feather-light sheer drape with delicate golden ashrafi bootis and borders"
  },
  {
    id: "Jacquard & Zari",
    name: "Jacquard & Zari (\u091C\u0948\u0915\u0915\u093E\u0930\u094D\u0921 \u092C\u0941\u0928\u093E\u0908)",
    badge: "Brocade Relief",
    description: "Complex raised heritage patterns woven with precision jacquard punch cards"
  },
  {
    id: "Jamdani Handloom",
    name: "Jamdani Handloom (\u091C\u093E\u092E\u0926\u093E\u0928\u0940 \u092C\u0941\u0928\u093E\u0908)",
    badge: "Hand-Inlaid",
    description: "Supplementary weft motifs delicately hand-inlaid thread-by-thread"
  }
];
export const FABRIC_OPTIONS = [
  "all",
  "Banarasi Silk",
  "Kanjivaram Silk",
  "Chanderi",
  "Georgette",
  "Organza",
  "Pure Silk",
  "Cotton Silk",
  "Paithani Pure Silk"
];
export const ARTISAN_OPTIONS = [
  "all",
  "Master Weaver Bismillah Ansari, Varanasi Looms",
  "Kanchipuram Temple Weavers Guild, Tamil Nadu",
  "Chanderi Heritage Weaver Society, Madhya Pradesh",
  "Banarasi Khaddi Georgette Weavers Collective",
  "Bengal Jamdani Artisan Cooperative",
  "Yeola Paithani Artisan Guild, Maharashtra"
];
export const PRICE_BRACKETS = [
  { label: "All Prices", min: 0, max: 6e4 },
  { label: "Under \u20B910,000", min: 0, max: 1e4 },
  { label: "\u20B910,000 \u2013 \u20B920,000", min: 1e4, max: 2e4 },
  { label: "\u20B920,000 \u2013 \u20B935,000", min: 2e4, max: 35e3 },
  { label: "Above \u20B935,000", min: 35e3, max: 6e4 }
];
export const SearchFilter = ({
  filters,
  onChange,
  onReset,
  totalResults,
  className = "",
  isMobileModal = false,
  onCloseMobile,
  categoriesList
}) => {
  const [artisanSearch, setArtisanSearch] = useState("");
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [isTechniqueExpanded, setIsTechniqueExpanded] = useState(true);
  const [isFabricExpanded, setIsFabricExpanded] = useState(false);
  const [isArtisanExpanded, setIsArtisanExpanded] = useState(false);
  const [customMin, setCustomMin] = useState(filters.minPrice > 0 ? String(filters.minPrice) : "");
  const [customMax, setCustomMax] = useState(
    filters.maxPrice < 6e4 ? String(filters.maxPrice) : ""
  );
  const handleCategorySelect = (categorySlug) => {
    onChange({
      ...filters,
      category: categorySlug === filters.category ? "all" : categorySlug
    });
  };
  const handleTechniqueSelect = (techId) => {
    onChange({
      ...filters,
      weavingTechnique: techId === filters.weavingTechnique ? "all" : techId
    });
  };
  const handleFabricSelect = (fabric) => {
    onChange({
      ...filters,
      fabricType: fabric === filters.fabricType ? "all" : fabric
    });
  };
  const handlePriceRangeChange = (maxVal) => {
    setCustomMax(String(maxVal));
    onChange({
      ...filters,
      maxPrice: maxVal
    });
  };
  const handlePriceBracketSelect = (min, max) => {
    setCustomMin(min > 0 ? String(min) : "");
    setCustomMax(max < 6e4 ? String(max) : "");
    onChange({
      ...filters,
      minPrice: min,
      maxPrice: max
    });
  };
  const handleApplyCustomPrice = (e) => {
    e.preventDefault();
    const min = Number(customMin) || 0;
    const max = Number(customMax) || 6e4;
    onChange({
      ...filters,
      minPrice: min,
      maxPrice: max >= min ? max : min + 1e3
    });
  };
  const handleArtisanSelect = (artisan) => {
    onChange({
      ...filters,
      artisan: artisan === filters.artisan ? "all" : artisan
    });
  };
  const handleCustomArtisanInput = (val) => {
    setArtisanSearch(val);
    onChange({
      ...filters,
      artisan: val.trim() || "all"
    });
  };
  const hasActiveFilters = filters.category && filters.category !== "all" || filters.weavingTechnique && filters.weavingTechnique !== "all" || filters.fabricType && filters.fabricType !== "all" || filters.artisan && filters.artisan !== "all" || filters.minPrice > 0 || filters.maxPrice < 6e4 || filters.inStockOnly || Boolean(filters.searchQuery);
  const activeCategoryObj = CATEGORY_OPTIONS.find((c) => c.slug === filters.category);
  const activeTechniqueObj = WEAVING_TECHNIQUES.find((t) => t.id === filters.weavingTechnique);
  return <div
    className={`bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden ${className}`}
  >
      {
    /* Header */
  }
      <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-[#FCF9F5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#881930]" />
          <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">
            Filter Handlooms
          </h3>
          {totalResults !== void 0 && <span className="text-[11px] font-mono bg-[#f5eedf] text-[#6b1426] px-2 py-0.5 rounded-full font-semibold">
              {totalResults} Sarees
            </span>}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && <button
    type="button"
    onClick={onReset}
    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#881930] hover:text-[#6b1426] cursor-pointer transition-colors"
  >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>}

          {isMobileModal && onCloseMobile && <button
    type="button"
    onClick={onCloseMobile}
    className="p-1 text-stone-500 hover:text-stone-800 rounded-lg cursor-pointer"
    aria-label="Close filters"
  >
              <X className="w-5 h-5" />
            </button>}
        </div>
      </div>

      {
    /* Active Filter Chips */
  }
      {hasActiveFilters && <div className="px-4 py-2.5 bg-stone-50/90 border-b border-stone-200 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mr-1">
            Active:
          </span>

          {
    /* Category Chip */
  }
          {filters.category && filters.category !== "all" && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#881930] text-white rounded-full text-[11px] font-medium shadow-2xs">
              <span>{activeCategoryObj?.short || filters.category}</span>
              <button
    type="button"
    onClick={() => handleCategorySelect(filters.category)}
    className="hover:text-rose-200 cursor-pointer"
    aria-label="Remove category filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* Weaving Technique Chip */
  }
          {filters.weavingTechnique && filters.weavingTechnique !== "all" && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#4a0e1b] text-[#f2ce6e] rounded-full text-[11px] font-medium border border-[#a07817]/40 shadow-2xs">
              <Wand2 className="w-3 h-3 text-[#f2ce6e]" />
              <span>{activeTechniqueObj?.badge || filters.weavingTechnique}</span>
              <button
    type="button"
    onClick={() => handleTechniqueSelect(filters.weavingTechnique)}
    className="hover:text-amber-100 cursor-pointer ml-0.5"
    aria-label="Remove weaving technique filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* Price Range Chip */
  }
          {(filters.minPrice > 0 || filters.maxPrice < 6e4) && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-950 rounded-full text-[11px] font-semibold border border-amber-200 shadow-2xs">
              <span>
                {filters.minPrice > 0 ? `${formatINR(filters.minPrice)} \u2013 ` : "Up to "}
                {formatINR(filters.maxPrice)}
              </span>
              <button
    type="button"
    onClick={() => handlePriceBracketSelect(0, 6e4)}
    className="hover:text-amber-700 cursor-pointer"
    aria-label="Remove price filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* Fabric Chip */
  }
          {filters.fabricType && filters.fabricType !== "all" && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#6b1426] text-white rounded-full text-[11px] font-medium shadow-2xs">
              <span>{filters.fabricType}</span>
              <button
    type="button"
    onClick={() => handleFabricSelect(filters.fabricType)}
    className="hover:text-rose-200 cursor-pointer"
    aria-label="Remove fabric filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* Artisan Chip */
  }
          {filters.artisan && filters.artisan !== "all" && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-stone-800 text-stone-100 rounded-full text-[11px] font-medium shadow-2xs">
              <span>{filters.artisan.split(",")[0]}</span>
              <button
    type="button"
    onClick={() => handleArtisanSelect(filters.artisan)}
    className="hover:text-stone-300 cursor-pointer"
    aria-label="Remove artisan filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* In Stock Chip */
  }
          {filters.inStockOnly && <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-950 rounded-full text-[11px] font-semibold border border-emerald-200 shadow-2xs">
              <span>In Stock Only</span>
              <button
    type="button"
    onClick={() => onChange({ ...filters, inStockOnly: false })}
    className="hover:text-emerald-700 cursor-pointer"
    aria-label="Remove in stock filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}
        </div>}

      {
    /* Filter Sections */
  }
      <div className="p-4 sm:p-5 space-y-6 divide-y divide-stone-100">
        {
    /* ======================================================== */
  }
        {
    /* 1. FILTER BY CATEGORY                                    */
  }
        {
    /* ======================================================== */
  }
        <div className="pt-1">
          <button
    type="button"
    onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-3 cursor-pointer group"
  >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#881930] group-hover:scale-110 transition-transform" />
              <span>Saree Category (साड़ी श्रेणी)</span>
            </div>
            {isCategoryExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {isCategoryExpanded && <div className="space-y-1">
              {CATEGORY_OPTIONS.map((cat) => {
    const isSelected = cat.slug === "all" ? !filters.category || filters.category === "all" : filters.category === cat.slug;
    return <button
      key={cat.slug}
      type="button"
      onClick={() => handleCategorySelect(cat.slug)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${isSelected ? "bg-[#881930] text-white font-semibold shadow-xs" : "text-stone-700 hover:bg-[#fcf7ee] hover:text-[#6b1426]"}`}
    >
                    <span className="truncate pr-2">{cat.name}</span>
                    {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-rose-200 shrink-0" /> : null}
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ======================================================== */
  }
        {
    /* 2. FILTER BY WEAVING TECHNIQUE                           */
  }
        {
    /* ======================================================== */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsTechniqueExpanded(!isTechniqueExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-[#881930] group-hover:rotate-12 transition-transform" />
              <span>Weaving Technique (बुनकर तकनीक)</span>
            </div>
            {isTechniqueExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          <p className="text-[11px] text-stone-500 mb-3 leading-snug">
            Authentic Indian handloom craftsmanship methods
          </p>

          {isTechniqueExpanded && <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {WEAVING_TECHNIQUES.map((tech) => {
    const isSelected = tech.id === "all" ? !filters.weavingTechnique || filters.weavingTechnique === "all" : filters.weavingTechnique?.toLowerCase() === tech.id.toLowerCase();
    return <button
      key={tech.id}
      type="button"
      onClick={() => handleTechniqueSelect(tech.id)}
      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? "bg-[#FCF9F5] border-[#881930] text-[#6b1426] ring-1 ring-[#881930]/30 shadow-2xs" : "border-stone-200/80 bg-white hover:bg-stone-50 text-stone-700"}`}
    >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs text-stone-900">
                        {tech.name}
                      </span>
                      {isSelected ? <Check className="w-3.5 h-3.5 text-[#881930] shrink-0" /> : <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-medium">
                          {tech.badge}
                        </span>}
                    </div>
                    {tech.description && <p className="text-[10px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {tech.description}
                      </p>}
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ======================================================== */
  }
        {
    /* 3. FILTER BY PRICE RANGE                                 */
  }
        {
    /* ======================================================== */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsPriceExpanded(!isPriceExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-3 cursor-pointer"
  >
            <div className="flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-[#881930]" />
              <span>Price Range (कीमत दायरा)</span>
            </div>
            {isPriceExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {isPriceExpanded && <div className="space-y-4">
              {
    /* Range Slider */
  }
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-mono">
                    {filters.minPrice > 0 ? formatINR(filters.minPrice) : "\u20B90"}
                  </span>
                  <span className="font-bold text-[#881930] font-mono text-xs bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                    Up to {formatINR(filters.maxPrice || 6e4)}
                  </span>
                  <span className="text-stone-500 font-mono">₹60,000+</span>
                </div>
                <input
    type="range"
    min="2000"
    max="60000"
    step="1000"
    value={filters.maxPrice || 6e4}
    onChange={(e) => handlePriceRangeChange(Number(e.target.value))}
    className="w-full accent-[#881930] cursor-pointer"
    aria-label="Filter max price"
  />
              </div>

              {
    /* Price Brackets Buttons */
  }
              <div className="grid grid-cols-2 gap-1.5">
                {PRICE_BRACKETS.map((bracket) => {
    const isSelected = filters.minPrice === bracket.min && (filters.maxPrice === bracket.max || !filters.maxPrice && bracket.max === 6e4);
    return <button
      key={bracket.label}
      type="button"
      onClick={() => handlePriceBracketSelect(bracket.min, bracket.max)}
      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left transition-colors cursor-pointer ${isSelected ? "bg-[#f5eedf] text-[#6b1426] font-bold border border-[#d4af37]" : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/70"}`}
    >
                      {bracket.label}
                    </button>;
  })}
              </div>

              {
    /* Custom Min / Max Inputs */
  }
              <form
    onSubmit={handleApplyCustomPrice}
    className="pt-2 border-t border-stone-100 space-y-2"
  >
                <div className="text-[11px] font-semibold text-stone-600">
                  Custom Price (₹):
                </div>
                <div className="flex items-center gap-2">
                  <input
    type="number"
    placeholder="Min ₹"
    value={customMin}
    onChange={(e) => setCustomMin(e.target.value)}
    className="w-1/2 px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881930] focus:bg-white"
  />
                  <span className="text-stone-400 text-xs">–</span>
                  <input
    type="number"
    placeholder="Max ₹"
    value={customMax}
    onChange={(e) => setCustomMax(e.target.value)}
    className="w-1/2 px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881930] focus:bg-white"
  />
                  <button
    type="submit"
    className="px-2.5 py-1.5 bg-[#881930] hover:bg-[#6b1426] text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors shrink-0"
  >
                    Go
                  </button>
                </div>
              </form>
            </div>}
        </div>

        {
    /* ======================================================== */
  }
        {
    /* 4. FILTER BY FABRIC TYPE                                 */
  }
        {
    /* ======================================================== */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsFabricExpanded(!isFabricExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-3 cursor-pointer"
  >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#881930]" />
              <span>Fabric Type (सिल्क व कपड़ा)</span>
            </div>
            {isFabricExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {isFabricExpanded && <div className="flex flex-wrap gap-1.5">
              {FABRIC_OPTIONS.map((fabric) => {
    const isSelected = fabric === "all" ? !filters.fabricType || filters.fabricType === "all" : filters.fabricType?.toLowerCase() === fabric.toLowerCase();
    return <button
      key={fabric}
      type="button"
      onClick={() => handleFabricSelect(fabric)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${isSelected ? "bg-[#6b1426] text-white shadow-xs font-semibold" : "bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-transparent"}`}
    >
                    {fabric === "all" ? "All Fabrics" : fabric}
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ======================================================== */
  }
        {
    /* 5. FILTER BY ARTISAN / WEAVER GUILD                      */
  }
        {
    /* ======================================================== */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsArtisanExpanded(!isArtisanExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-3 cursor-pointer"
  >
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#881930]" />
              <span>Artisan / Weaver Guild (कारीगर)</span>
            </div>
            {isArtisanExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {isArtisanExpanded && <div className="space-y-3">
              {
    /* Artisan Search Input */
  }
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
    type="text"
    placeholder="Search weaver or loom guild..."
    value={artisanSearch}
    onChange={(e) => handleCustomArtisanInput(e.target.value)}
    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881930] focus:bg-white"
  />
              </div>

              {
    /* Artisan Presets List */
  }
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {ARTISAN_OPTIONS.map((artisan) => {
    const isSelected = artisan === "all" ? !filters.artisan || filters.artisan === "all" : filters.artisan?.toLowerCase().includes(artisan.toLowerCase());
    return <button
      key={artisan}
      type="button"
      onClick={() => handleArtisanSelect(artisan)}
      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${isSelected ? "bg-[#f5eedf] text-[#6b1426] font-semibold border border-[#d4af37]/60" : "text-stone-600 hover:bg-stone-50"}`}
    >
                      <span className="truncate pr-2">
                        {artisan === "all" ? "All Master Artisans" : artisan}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#881930] shrink-0" />}
                    </button>;
  })}
              </div>
            </div>}
        </div>

        {
    /* ======================================================== */
  }
        {
    /* 6. AVAILABILITY & STOCK TOGGLE                           */
  }
        {
    /* ======================================================== */
  }
        <div className="pt-5">
          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs font-medium text-stone-700">
              Only Show In-Stock Sarees
            </span>
            <input
    type="checkbox"
    checked={Boolean(filters.inStockOnly)}
    onChange={(e) => onChange({
      ...filters,
      inStockOnly: e.target.checked
    })}
    className="w-4 h-4 accent-[#881930] rounded cursor-pointer"
  />
          </label>
        </div>
      </div>
    </div>;
};
export default SearchFilter;
