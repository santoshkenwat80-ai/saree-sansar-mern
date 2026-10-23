import { useState } from "react";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  IndianRupee,
  Sparkles,
  Palette,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle2,
  CheckSquare
} from "lucide-react";
import { formatINR } from "../../utils/currency";
export const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular", hindi: "\u0932\u094B\u0915\u092A\u094D\u0930\u093F\u092F", icon: "\u2B50" },
  { id: "price-asc", label: "Price: Low to High", hindi: "\u0915\u092E \u0938\u0947 \u0905\u0927\u093F\u0915 \u0915\u0940\u092E\u0924", icon: "\u2191" },
  { id: "price-desc", label: "Price: High to Low", hindi: "\u0905\u0927\u093F\u0915 \u0938\u0947 \u0915\u092E \u0915\u0940\u092E\u0924", icon: "\u2193" },
  { id: "rating", label: "Highest Rated", hindi: "\u0909\u0924\u094D\u0915\u0943\u0937\u094D\u091F \u0930\u0947\u091F\u093F\u0902\u0917", icon: "\u2605" },
  { id: "newest", label: "Newest Arrivals", hindi: "\u0928\u0935\u0940\u0928\u0924\u092E \u0938\u0902\u0917\u094D\u0930\u0939", icon: "\u2728" }
];
export const PRICE_BRACKETS = [
  { label: "All Prices", min: 0, max: 6e4, hindi: "\u0938\u092D\u0940 \u0915\u0940\u092E\u0924\u0947\u0902" },
  { label: "Under \u20B910,000", min: 0, max: 1e4, hindi: "\u0915\u093F\u092B\u093E\u092F\u0924\u0940 \u0939\u0948\u0902\u0921\u0932\u0942\u092E" },
  { label: "\u20B910,000 \u2013 \u20B918,000", min: 1e4, max: 18e3, hindi: "\u0909\u0924\u094D\u0938\u0935 \u0938\u0902\u0917\u094D\u0930\u0939" },
  { label: "\u20B918,000 \u2013 \u20B925,000", min: 18e3, max: 25e3, hindi: "\u0935\u093F\u0930\u093E\u0938\u0924 \u0938\u093F\u0932\u094D\u0915" },
  { label: "Above \u20B925,000", min: 25e3, max: 6e4, hindi: "\u0936\u093E\u0939\u0940 \u0926\u0941\u0932\u094D\u0939\u0928" }
];
export const FABRIC_OPTIONS = [
  { id: "all", name: "All Fabrics", hindi: "\u0938\u092D\u0940 \u0938\u093F\u0932\u094D\u0915 \u0935 \u0915\u092A\u0921\u093C\u093E" },
  { id: "Banarasi Silk", name: "Banarasi Silk", hindi: "\u092C\u0928\u093E\u0930\u0938\u0940 \u0938\u093F\u0932\u094D\u0915", badge: "Katan & Kadwa" },
  { id: "Kanjivaram Silk", name: "Kanjivaram Silk", hindi: "\u0915\u093E\u0902\u091A\u0940\u0935\u0930\u092E \u0938\u093F\u0932\u094D\u0915", badge: "Pure Mulberry" },
  { id: "Pure Silk", name: "Pure Silk", hindi: "\u0936\u0941\u0926\u094D\u0927 \u0930\u0947\u0936\u092E", badge: "Silk Mark" },
  { id: "Chanderi", name: "Chanderi", hindi: "\u091A\u0902\u0926\u0947\u0930\u0940", badge: "Tissue Weave" },
  { id: "Georgette", name: "Khaddi Georgette", hindi: "\u0916\u0921\u094D\u0921\u0940 \u091C\u0949\u0930\u094D\u091C\u0947\u091F", badge: "Pitloom" },
  { id: "Cotton Silk", name: "Cotton Silk", hindi: "\u0915\u0949\u091F\u0928 \u0938\u093F\u0932\u094D\u0915", badge: "Handloom" },
  { id: "Organza", name: "Organza", hindi: "\u0913\u0930\u094D\u0917\u0947\u0902\u095B\u093E", badge: "Sheer Gossamer" }
];
export const COLOR_OPTIONS = [
  { id: "all", name: "All Colors", hindi: "\u0938\u092D\u0940 \u0930\u0902\u0917", hex: "#64748B" },
  { id: "red", name: "Red & Maroon", hindi: "\u0932\u093E\u0932 \u0935 \u092E\u0939\u0930\u0942\u0928", hex: "#881930", dotBorder: false },
  { id: "pink", name: "Rani & Rose Pink", hindi: "\u0930\u093E\u0928\u0940 \u0935 \u0917\u0941\u0932\u093E\u092C\u0940", hex: "#DB2777", dotBorder: false },
  { id: "blue", name: "Royal Navy Blue", hindi: "\u0936\u093E\u0939\u0940 \u0928\u0940\u0932\u093E", hex: "#1E3A8A", dotBorder: false },
  { id: "green", name: "Emerald Green", hindi: "\u092A\u0928\u094D\u0928\u093E \u0939\u0930\u093E", hex: "#047857", dotBorder: false },
  { id: "yellow", name: "Mustard & Yellow", hindi: "\u092A\u0940\u0932\u093E \u0935 \u0938\u0930\u0938\u094B\u0902", hex: "#D97706", dotBorder: false },
  { id: "white", name: "Ivory & Cream", hindi: "\u0938\u092B\u0947\u0926 \u0935 \u0915\u094D\u0930\u0940\u092E", hex: "#F8F6F0", dotBorder: true },
  { id: "gold", name: "Gold & Zari", hindi: "\u0938\u0941\u0928\u0939\u0930\u093E \u0935 \u091C\u093C\u0930\u0940", hex: "#D4AF37", dotBorder: false },
  { id: "purple", name: "Plum & Purple", hindi: "\u092C\u0948\u0902\u0917\u0928\u0940 \u0935 \u091C\u093E\u092E\u0941\u0928\u0940", hex: "#7E22CE", dotBorder: false }
];
export const CATEGORY_OPTIONS = [
  { slug: "all", name: "All Categories", hindi: "\u0938\u092D\u0940 \u0938\u093E\u095C\u093F\u092F\u093E\u0901" },
  { slug: "banarasi-silk", name: "Banarasi Silk", hindi: "\u092C\u0928\u093E\u0930\u0938\u0940" },
  { slug: "kanjivaram-silk", name: "Kanjivaram Silk", hindi: "\u0915\u093E\u0902\u091A\u0940\u0935\u0930\u092E" },
  { slug: "chanderi-organza", name: "Chanderi & Organza", hindi: "\u091A\u0902\u0926\u0947\u0930\u0940 \u0935 \u0913\u0930\u094D\u0917\u0947\u0902\u095B\u093E" },
  { slug: "georgette-chiffon", name: "Georgette & Chiffon", hindi: "\u091C\u0949\u0930\u094D\u091C\u0947\u091F" },
  { slug: "bridal-heritage", name: "Bridal Heritage", hindi: "\u0936\u093E\u0939\u0940 \u0926\u0941\u0932\u094D\u0939\u0928" },
  { slug: "handloom-cotton", name: "Handloom Cotton", hindi: "\u0939\u0925\u0915\u0930\u0918\u093E \u0938\u0942\u0924\u0940" }
];
export const SidebarFilter = ({
  filters,
  onChange,
  onReset,
  totalResults,
  className = "",
  isMobileModal = false,
  onCloseMobile,
  currentSort = "popular",
  onSortChange
}) => {
  const [isSortExpanded, setIsSortExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [isFabricExpanded, setIsFabricExpanded] = useState(true);
  const [isColorExpanded, setIsColorExpanded] = useState(true);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [customMin, setCustomMin] = useState(filters.minPrice > 0 ? String(filters.minPrice) : "");
  const [customMax, setCustomMax] = useState(
    filters.maxPrice < 6e4 ? String(filters.maxPrice) : ""
  );
  const activeSort = filters.sortBy || currentSort || "popular";
  const handleSortSelect = (sortId) => {
    if (onSortChange) {
      onSortChange(sortId);
    }
    onChange({
      ...filters,
      sortBy: sortId
    });
  };
  const handleFabricSelect = (fabric) => {
    onChange({
      ...filters,
      fabricType: fabric === filters.fabricType ? "all" : fabric
    });
  };
  const handleColorSelect = (colorId) => {
    onChange({
      ...filters,
      color: colorId === filters.color ? "all" : colorId
    });
  };
  const handleCategorySelect = (categorySlug) => {
    onChange({
      ...filters,
      category: categorySlug === filters.category ? "all" : categorySlug
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
  const hasActiveFilters = filters.fabricType && filters.fabricType !== "all" || filters.color && filters.color !== "all" || filters.category && filters.category !== "all" || filters.weavingTechnique && filters.weavingTechnique !== "all" || filters.minPrice > 0 || filters.maxPrice < 6e4 || filters.inStockOnly;
  const activeColorObj = COLOR_OPTIONS.find((c) => c.id === filters.color);
  const activeFabricObj = FABRIC_OPTIONS.find(
    (f) => f.id.toLowerCase() === filters.fabricType?.toLowerCase()
  );
  return <div
    className={`bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden ${className}`}
  >
      {
    /* ----------------------------------------------------------- */
  }
      {
    /* 1. Header with Result Counter and Reset                     */
  }
      {
    /* ----------------------------------------------------------- */
  }
      <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-gradient-to-r from-[#FCF9F5] to-stone-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#881930]/10 text-[#881930]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-tight">
              Filter & Sort Sarees
            </h3>
            {totalResults !== void 0 && <span className="text-[11px] text-stone-500 font-medium">
                <span className="font-semibold text-stone-900 font-mono">{totalResults}</span>{" "}
                Handloom pieces
              </span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && <button
    type="button"
    onClick={onReset}
    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#881930] hover:text-[#6b1426] bg-[#881930]/5 hover:bg-[#881930]/10 rounded-lg cursor-pointer transition-colors"
  >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>}

          {isMobileModal && onCloseMobile && <button
    type="button"
    onClick={onCloseMobile}
    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors"
    aria-label="Close filter drawer"
  >
              <X className="w-5 h-5" />
            </button>}
        </div>
      </div>

      {
    /* ----------------------------------------------------------- */
  }
      {
    /* 2. Active Filter Tags Bar                                   */
  }
      {
    /* ----------------------------------------------------------- */
  }
      {hasActiveFilters && <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200/80 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mr-1">
            Active:
          </span>

          {
    /* Color Tag */
  }
          {filters.color && filters.color !== "all" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-200 text-stone-800 rounded-lg text-xs font-medium shadow-2xs">
              <span
    className="w-2.5 h-2.5 rounded-full shrink-0"
    style={{ backgroundColor: activeColorObj?.hex || "#881930" }}
  />
              <span>{activeColorObj?.name || filters.color}</span>
              <button
    type="button"
    onClick={() => handleColorSelect(filters.color)}
    className="text-stone-400 hover:text-stone-700 cursor-pointer ml-0.5"
    aria-label="Remove color filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* Fabric Tag */
  }
          {filters.fabricType && filters.fabricType !== "all" && <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#881930] text-white rounded-lg text-xs font-medium shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#f2ce6e]" />
              <span>{activeFabricObj?.name || filters.fabricType}</span>
              <button
    type="button"
    onClick={() => handleFabricSelect(filters.fabricType)}
    className="hover:text-rose-200 cursor-pointer ml-0.5"
    aria-label="Remove fabric filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* Price Tag */
  }
          {(filters.minPrice > 0 || filters.maxPrice < 6e4) && <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f5eedf] text-[#6b1426] border border-[#d4af37]/40 rounded-lg text-xs font-semibold shadow-2xs">
              <IndianRupee className="w-3 h-3 text-[#881930]" />
              <span>
                {filters.minPrice > 0 ? `${formatINR(filters.minPrice)} \u2013 ` : "Up to "}
                {formatINR(filters.maxPrice)}
              </span>
              <button
    type="button"
    onClick={() => handlePriceBracketSelect(0, 6e4)}
    className="hover:text-red-700 cursor-pointer ml-0.5"
    aria-label="Remove price filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* Category Tag */
  }
          {filters.category && filters.category !== "all" && <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-800 text-stone-100 rounded-lg text-xs font-medium shadow-2xs">
              <Layers className="w-3 h-3 text-[#d4af37]" />
              <span>{filters.category.replace(/-/g, " ")}</span>
              <button
    type="button"
    onClick={() => handleCategorySelect(filters.category)}
    className="hover:text-stone-300 cursor-pointer ml-0.5"
    aria-label="Remove category filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}

          {
    /* In-Stock Tag */
  }
          {filters.inStockOnly && <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium shadow-2xs">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>In Stock Only</span>
              <button
    type="button"
    onClick={() => onChange({ ...filters, inStockOnly: false })}
    className="hover:text-emerald-950 cursor-pointer ml-0.5"
    aria-label="Remove in stock filter"
  >
                <X className="w-3 h-3" />
              </button>
            </span>}
        </div>}

      {
    /* ----------------------------------------------------------- */
  }
      {
    /* 3. Accordion Filter & Sort Sections                         */
  }
      {
    /* ----------------------------------------------------------- */
  }
      <div className="p-4 sm:p-5 space-y-5 divide-y divide-stone-100">
        {
    /* ========================================================= */
  }
        {
    /* SECTION A: SORT SAREES                                    */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-1">
          <button
    type="button"
    onClick={() => setIsSortExpanded(!isSortExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-1.5 text-stone-900">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#881930] group-hover:scale-110 transition-transform" />
              <span>Sort Sarees By (क्रमबद्ध करें)</span>
            </div>
            {isSortExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {isSortExpanded && <div className="space-y-1 mt-2.5">
              {SORT_OPTIONS.map((opt) => {
    const isSelected = activeSort === opt.id;
    return <button
      key={opt.id}
      type="button"
      onClick={() => handleSortSelect(opt.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${isSelected ? "bg-[#881930] text-white font-semibold shadow-xs" : "text-stone-700 hover:bg-[#FCF9F5] hover:text-[#6b1426]"}`}
    >
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-80">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </div>
                    {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-rose-200 shrink-0" /> : <span className="text-[10px] text-stone-400">{opt.hindi}</span>}
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ========================================================= */
  }
        {
    /* SECTION B: PRICE RANGE FILTER                             */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsPriceExpanded(!isPriceExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-1.5 text-stone-900">
              <IndianRupee className="w-3.5 h-3.5 text-[#881930] group-hover:scale-110 transition-transform" />
              <span>Price Range (कीमत दायरा)</span>
            </div>
            {isPriceExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {isPriceExpanded && <div className="space-y-4 mt-2.5">
              {
    /* Range Slider Indicator */
  }
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-mono">
                    {filters.minPrice > 0 ? formatINR(filters.minPrice) : "\u20B90"}
                  </span>
                  <span className="font-bold text-[#881930] font-mono text-xs bg-rose-50 px-2 py-0.5 rounded border border-rose-100 shadow-2xs">
                    Up to {formatINR(filters.maxPrice || 6e4)}
                  </span>
                  <span className="text-stone-500 font-mono">₹60,000+</span>
                </div>
                <input
    type="range"
    min="5000"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {PRICE_BRACKETS.map((bracket) => {
    const isSelected = filters.minPrice === bracket.min && (filters.maxPrice === bracket.max || !filters.maxPrice && bracket.max === 6e4);
    return <button
      key={bracket.label}
      type="button"
      onClick={() => handlePriceBracketSelect(bracket.min, bracket.max)}
      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-left transition-all cursor-pointer ${isSelected ? "bg-[#f5eedf] text-[#6b1426] font-bold border border-[#d4af37] shadow-2xs" : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/70"}`}
    >
                      <div className="leading-tight">{bracket.label}</div>
                      <div className="text-[9px] text-stone-400 mt-0.5">{bracket.hindi}</div>
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
                <div className="text-[11px] font-semibold text-stone-600 flex items-center justify-between">
                  <span>Custom Budget (₹):</span>
                  <span className="text-[10px] text-stone-400">Enter range</span>
                </div>
                <div className="flex items-center gap-1.5">
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
    className="px-3 py-1.5 bg-[#881930] hover:bg-[#6b1426] text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors shrink-0 shadow-2xs"
  >
                    Go
                  </button>
                </div>
              </form>
            </div>}
        </div>

        {
    /* ========================================================= */
  }
        {
    /* SECTION C: FABRIC TYPE FILTER (Banarasi, Silk, etc.)      */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsFabricExpanded(!isFabricExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-1.5 text-stone-900">
              <Sparkles className="w-3.5 h-3.5 text-[#881930] group-hover:rotate-12 transition-transform" />
              <span>Fabric Type (सिल्क व कपड़ा)</span>
            </div>
            {isFabricExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          <p className="text-[11px] text-stone-500 mb-2 leading-tight">
            Pure weaves: Banarasi, Kanjivaram, Chanderi & Silks
          </p>

          {isFabricExpanded && <div className="space-y-1.5 mt-2">
              {FABRIC_OPTIONS.map((fabric) => {
    const isSelected = fabric.id === "all" ? !filters.fabricType || filters.fabricType === "all" : filters.fabricType?.toLowerCase() === fabric.id.toLowerCase();
    return <button
      key={fabric.id}
      type="button"
      onClick={() => handleFabricSelect(fabric.id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer ${isSelected ? "bg-[#881930] text-white font-semibold shadow-xs" : "bg-stone-50/70 hover:bg-[#FCF9F5] text-stone-700 hover:text-[#6b1426] border border-stone-200/50"}`}
    >
                    <div className="flex flex-col">
                      <span className="font-medium">{fabric.name}</span>
                      <span
      className={`text-[10px] ${isSelected ? "text-rose-200" : "text-stone-400"}`}
    >
                        {fabric.hindi}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {fabric.badge && <span
      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isSelected ? "bg-white/20 text-white font-semibold" : "bg-stone-100 text-stone-500"}`}
    >
                          {fabric.badge}
                        </span>}
                      {isSelected && <Check className="w-3.5 h-3.5 text-rose-200 shrink-0" />}
                    </div>
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ========================================================= */
  }
        {
    /* SECTION D: COLOR FILTER                                   */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsColorExpanded(!isColorExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-1.5 text-stone-900">
              <Palette className="w-3.5 h-3.5 text-[#881930] group-hover:scale-110 transition-transform" />
              <span>Saree Color (शाही रंग)</span>
            </div>
            {isColorExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          <p className="text-[11px] text-stone-500 mb-2.5 leading-tight">
            Curated royal hues & traditional wedding palettes
          </p>

          {isColorExpanded && <div className="grid grid-cols-1 gap-1.5 mt-2">
              {COLOR_OPTIONS.map((c) => {
    const isSelected = c.id === "all" ? !filters.color || filters.color === "all" : filters.color?.toLowerCase() === c.id.toLowerCase();
    return <button
      key={c.id}
      type="button"
      onClick={() => handleColorSelect(c.id)}
      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${isSelected ? "bg-[#FCF9F5] border-2 border-[#881930] text-[#6b1426] font-semibold shadow-2xs" : "bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80"}`}
    >
                    <div className="flex items-center gap-2.5">
                      {
      /* Color Swatch Dot */
    }
                      <span
      className={`w-4 h-4 rounded-full shadow-2xs shrink-0 flex items-center justify-center ${c.dotBorder ? "border border-stone-300" : ""}`}
      style={{ backgroundColor: c.hex }}
    >
                        {isSelected && c.id !== "all" && <Check
      className={`w-2.5 h-2.5 ${c.id === "white" ? "text-stone-900" : "text-white"}`}
    />}
                      </span>

                      <div className="flex flex-col text-left">
                        <span className="leading-tight font-medium">{c.name}</span>
                        <span className="text-[10px] text-stone-400">{c.hindi}</span>
                      </div>
                    </div>

                    {isSelected && <span className="text-[10px] font-bold text-[#881930] bg-[#f5eedf] px-2 py-0.5 rounded-full">
                        Active
                      </span>}
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ========================================================= */
  }
        {
    /* SECTION E: CATEGORY (OPTIONAL ACCORDION)                  */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-5">
          <button
    type="button"
    onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800 mb-2 cursor-pointer group"
  >
            <div className="flex items-center gap-1.5 text-stone-900">
              <Layers className="w-3.5 h-3.5 text-[#881930] group-hover:scale-110 transition-transform" />
              <span>Saree Category (श्रेणी)</span>
            </div>
            {isCategoryExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
          </button>

          {isCategoryExpanded && <div className="space-y-1 mt-2">
              {CATEGORY_OPTIONS.map((cat) => {
    const isSelected = cat.slug === "all" ? !filters.category || filters.category === "all" : filters.category === cat.slug;
    return <button
      key={cat.slug}
      type="button"
      onClick={() => handleCategorySelect(cat.slug)}
      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-left transition-all cursor-pointer ${isSelected ? "bg-[#881930] text-white font-semibold" : "text-stone-700 hover:bg-stone-50"}`}
    >
                    <span>{cat.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-200 shrink-0" />}
                  </button>;
  })}
            </div>}
        </div>

        {
    /* ========================================================= */
  }
        {
    /* SECTION F: IN-STOCK TOGGLE                                */
  }
        {
    /* ========================================================= */
  }
        <div className="pt-4">
          <label className="flex items-center justify-between cursor-pointer py-1 group">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#881930]" />
              <span className="text-xs font-medium text-stone-800 group-hover:text-[#6b1426] transition-colors">
                Only Ready-to-Ship Sarees
              </span>
            </div>
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
export default SidebarFilter;
