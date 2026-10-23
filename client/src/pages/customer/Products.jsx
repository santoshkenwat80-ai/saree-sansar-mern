import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  ArrowUpDown,
  Search as SearchIcon,
  X,
  Sparkles
} from "lucide-react";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { ProductCard } from "../../components/products/ProductCard";
import { QuickViewModal } from "../../components/products/QuickViewModal";
import { SidebarFilter } from "../../components/products/SidebarFilter";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
const QUICK_SEARCH_TAGS = [
  { label: "Kadwa Banarasi", query: "Kadwa", type: "technique" },
  { label: "Korvai Kanjivaram", query: "Korvai", type: "technique" },
  { label: "Pastel Chanderi", query: "Chanderi", type: "fabric" },
  { label: "Khaddi Georgette", query: "Khaddi", type: "technique" },
  { label: "Bridal Crimson", query: "Bridal", type: "category" },
  { label: "Under \u20B915,000", query: "15000", type: "price" },
  { label: "Jamdani Handloom", query: "Jamdani", type: "technique" }
];
export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const searchQuery = searchParams.get("q") || searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedTechnique = searchParams.get("technique") || searchParams.get("weavingTechnique") || "all";
  const selectedFabric = searchParams.get("fabric") || "all";
  const selectedColor = searchParams.get("color") || "all";
  const selectedArtisan = searchParams.get("artisan") || "all";
  const sortBy = searchParams.get("sort") || "popular";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 6e4;
  const inStockOnly = searchParams.get("inStock") === "true";
  const [searchInput, setSearchInput] = useState(searchQuery);
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    setLoading(true);
    Promise.all([
      productService.getProducts(),
      categoryService.getCategories()
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
    }).finally(() => setLoading(false));
  }, []);
  const filterValues = {
    category: selectedCategory,
    weavingTechnique: selectedTechnique,
    fabricType: selectedFabric,
    color: selectedColor,
    sortBy,
    minPrice,
    maxPrice,
    artisan: selectedArtisan,
    inStockOnly,
    searchQuery
  };
  const handleFilterChange = (newFilters) => {
    const newParams = new URLSearchParams(searchParams);
    if (newFilters.category && newFilters.category !== "all") {
      newParams.set("category", newFilters.category);
    } else {
      newParams.delete("category");
    }
    if (newFilters.weavingTechnique && newFilters.weavingTechnique !== "all") {
      newParams.set("technique", newFilters.weavingTechnique);
    } else {
      newParams.delete("technique");
      newParams.delete("weavingTechnique");
    }
    if (newFilters.fabricType && newFilters.fabricType !== "all") {
      newParams.set("fabric", newFilters.fabricType);
    } else {
      newParams.delete("fabric");
    }
    if (newFilters.color && newFilters.color !== "all") {
      newParams.set("color", newFilters.color);
    } else {
      newParams.delete("color");
    }
    if (newFilters.artisan && newFilters.artisan !== "all") {
      newParams.set("artisan", newFilters.artisan);
    } else {
      newParams.delete("artisan");
    }
    if (newFilters.minPrice > 0) {
      newParams.set("minPrice", String(newFilters.minPrice));
    } else {
      newParams.delete("minPrice");
    }
    if (newFilters.maxPrice < 6e4) {
      newParams.set("maxPrice", String(newFilters.maxPrice));
    } else {
      newParams.delete("maxPrice");
    }
    if (newFilters.inStockOnly) {
      newParams.set("inStock", "true");
    } else {
      newParams.delete("inStock");
    }
    if (newFilters.sortBy) {
      newParams.set("sort", newFilters.sortBy);
    }
    setSearchParams(newParams);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set("q", searchInput.trim());
    } else {
      newParams.delete("q");
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };
  const handleQuickTagClick = (tag) => {
    const newParams = new URLSearchParams(searchParams);
    if (tag.type === "technique") {
      newParams.set("technique", tag.query);
    } else if (tag.type === "category") {
      newParams.set("category", "bridal-heritage");
    } else if (tag.type === "fabric") {
      newParams.set("fabric", tag.query);
    } else if (tag.type === "price") {
      newParams.set("maxPrice", tag.query);
    } else {
      newParams.set("q", tag.query);
    }
    setSearchParams(newParams);
  };
  const clearSearch = () => {
    setSearchInput("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("q");
    newParams.delete("search");
    setSearchParams(newParams);
  };
  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (sortBy !== "popular") newParams.set("sort", sortBy);
    setSearchInput("");
    setSearchParams(newParams);
  };
  const handleSortChange = (newSort) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", newSort);
    setSearchParams(newParams);
  };
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.fabric?.toLowerCase().includes(q) || p.color?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.weavingTechnique?.toLowerCase().includes(q) || p.specifications?.Weave?.toLowerCase().includes(q) || p.specifications?.Origin?.toLowerCase().includes(q) || p.artisan?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (selectedCategory !== "all") {
        const catLower = selectedCategory.toLowerCase();
        const pCatLower = (p.category || "").toLowerCase();
        if (pCatLower !== catLower && !pCatLower.includes(catLower)) {
          return false;
        }
      }
      if (selectedTechnique !== "all") {
        const tq = selectedTechnique.toLowerCase().trim();
        const matchesTechnique = p.weavingTechnique?.toLowerCase().includes(tq) || p.specifications?.Weave?.toLowerCase().includes(tq) || p.description?.toLowerCase().includes(tq);
        if (!matchesTechnique) return false;
      }
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }
      if (selectedFabric !== "all") {
        const fabLower = selectedFabric.toLowerCase();
        const pFabricLower = (p.fabric || "").toLowerCase();
        const pNameLower = p.name.toLowerCase();
        let fabricMatch = pFabricLower.includes(fabLower) || p.fabricType?.toLowerCase()?.includes(fabLower) || pNameLower.includes(fabLower);
        if (!fabricMatch && (fabLower === "pure silk" || fabLower === "silk")) {
          fabricMatch = pFabricLower.includes("silk") || pNameLower.includes("silk");
        } else if (!fabricMatch && fabLower.includes("banarasi")) {
          fabricMatch = pFabricLower.includes("banarasi") || pNameLower.includes("banarasi");
        } else if (!fabricMatch && fabLower.includes("kanjivaram")) {
          fabricMatch = pFabricLower.includes("kanjivaram") || pFabricLower.includes("kanchipuram") || pNameLower.includes("kanchipuram");
        }
        if (!fabricMatch) return false;
      }
      if (selectedColor !== "all") {
        const colorKey = selectedColor.toLowerCase();
        const pColorLower = (p.color || "").toLowerCase();
        const pNameLower = p.name.toLowerCase();
        let colorMatch = pColorLower.includes(colorKey) || pNameLower.includes(colorKey);
        if (!colorMatch) {
          if (colorKey === "red") {
            colorMatch = /red|maroon|crimson|scarlet|ruby/i.test(pColorLower + " " + pNameLower);
          } else if (colorKey === "pink") {
            colorMatch = /pink|rose|blush|rani|magenta/i.test(pColorLower + " " + pNameLower);
          } else if (colorKey === "blue") {
            colorMatch = /blue|navy|royal|indigo/i.test(pColorLower + " " + pNameLower);
          } else if (colorKey === "green") {
            colorMatch = /green|emerald|olive|mint/i.test(pColorLower + " " + pNameLower);
          } else if (colorKey === "yellow") {
            colorMatch = /yellow|mustard|amber|gold/i.test(pColorLower + " " + pNameLower);
          } else if (colorKey === "white") {
            colorMatch = /white|ivory|cream|off-white/i.test(pColorLower + " " + pNameLower);
          } else if (colorKey === "gold") {
            colorMatch = /gold|zari|metallic/i.test(pColorLower + " " + pNameLower);
          } else if (colorKey === "purple") {
            colorMatch = /purple|plum|violet|jamuni|lavender/i.test(pColorLower + " " + pNameLower);
          }
        }
        if (!colorMatch) return false;
      }
      if (selectedArtisan !== "all") {
        const q = selectedArtisan.toLowerCase();
        const artisanMatch = p.artisan?.toLowerCase().includes(q) || p.artisan?.toLowerCase().includes(q) || p.specifications?.Artisan?.toLowerCase().includes(q) || p.specifications?.Origin?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
        if (!artisanMatch) return false;
      }
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedTechnique,
    selectedFabric,
    selectedColor,
    selectedArtisan,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy
  ]);
  const activeFilterCount = (selectedCategory !== "all" ? 1 : 0) + (selectedTechnique !== "all" ? 1 : 0) + (selectedFabric !== "all" ? 1 : 0) + (selectedColor !== "all" ? 1 : 0) + (selectedArtisan !== "all" ? 1 : 0) + (minPrice > 0 || maxPrice < 6e4 ? 1 : 0) + (inStockOnly ? 1 : 0) + (searchQuery.trim() ? 1 : 0);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {
    /* ========================================================== */
  }
      {
    /* 1. COMPREHENSIVE SEARCH BAR & QUICK FILTERS                */
  }
      {
    /* ========================================================== */
  }
      <div className="mb-8 bg-gradient-to-r from-[#FCF9F5] to-stone-50 border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="relative max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4 w-5 h-5 text-stone-400 pointer-events-none" />
            <input
    type="text"
    placeholder="Search sarees by name, weaving technique (Kadwa, Korvai), fabric, color, or motif..."
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-white border border-stone-300 focus:border-[#881930] rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-3 focus:ring-[#881930]/15 shadow-xs transition-all"
  />
            {searchInput && <button
    type="button"
    onClick={clearSearch}
    className="absolute right-20 p-1.5 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 cursor-pointer"
    aria-label="Clear search"
  >
                <X className="w-4 h-4" />
              </button>}
            <button
    type="submit"
    className="absolute right-2 px-4 py-2 bg-[#881930] hover:bg-[#6b1426] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
  >
              Search
            </button>
          </div>
        </form>

        {
    /* Quick Recommendation Filter Tags */
  }
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#a07817]" />
            Trending:
          </span>
          {QUICK_SEARCH_TAGS.map((tag) => <button
    key={tag.label}
    type="button"
    onClick={() => handleQuickTagClick(tag)}
    className="px-2.5 py-1 bg-white hover:bg-[#f5eedf] hover:text-[#6b1426] text-stone-700 text-xs font-medium rounded-full border border-stone-200/80 shadow-2xs transition-colors cursor-pointer"
  >
              {tag.label}
            </button>)}
        </div>
      </div>

      {
    /* ========================================================== */
  }
      {
    /* 2. PAGE HEADER & RESULT CONTROLS                           */
  }
      {
    /* ========================================================== */
  }
      <div className="border-b border-stone-200 pb-5 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
              Handcrafted Saree Collection
            </h1>
            {selectedCategory !== "all" && <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f5eedf] text-[#6b1426] border border-[#d4af37]/40">
                {selectedCategory.replace(/-/g, " ").toUpperCase()}
              </span>}
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Displaying{" "}
            <span className="font-semibold text-stone-900 font-mono tabular-nums">
              {filteredProducts.length}
            </span>{" "}
            authentic heirloom sarees
            {selectedTechnique !== "all" && <span className="text-[#881930] font-medium ml-1">
                with {selectedTechnique} weaving
              </span>}
            {searchQuery && <span className="ml-1 text-stone-600">
                matching &ldquo;<span className="font-medium text-stone-900">{searchQuery}</span>&rdquo;
              </span>}
          </p>
        </div>

        {
    /* Controls: Mobile Filter Button + Sort Select */
  }
        <div className="flex items-center gap-3">
          <Button
    onClick={() => setMobileFilterOpen(true)}
    variant="outline"
    size="sm"
    className="lg:hidden flex items-center gap-2 cursor-pointer relative"
  >
            <Filter className="w-4 h-4 text-[#881930]" />
            <span>Filter Sarees</span>
            {activeFilterCount > 0 && <span className="ml-1 px-1.5 py-0.2 bg-[#881930] text-white text-[10px] font-bold rounded-full">
                {activeFilterCount}
              </span>}
          </Button>

          {
    /* Sort Selector */
  }
          <div className="flex items-center gap-2 text-xs bg-white border border-stone-200 px-3 py-2 rounded-xl shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 hidden sm:inline">Sort:</span>
            <select
    value={sortBy}
    onChange={(e) => handleSortChange(e.target.value)}
    className="bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer"
  >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {
    /* ========================================================== */
  }
      {
    /* 3. MAIN GRID: FILTER SIDEBAR + PRODUCTS LISTING           */
  }
      {
    /* ========================================================== */
  }
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {
    /* Desktop SidebarFilter Component */
  }
        <aside className="hidden lg:block lg:col-span-1 self-start sticky top-24">
          <SidebarFilter
    filters={filterValues}
    onChange={handleFilterChange}
    onReset={clearAllFilters}
    totalResults={filteredProducts.length}
    currentSort={sortBy}
    onSortChange={handleSortChange}
  />
        </aside>

        {
    /* Product Cards Grid */
  }
        <section className="lg:col-span-3">
          {loading ? <Loader message="Loading exquisite handlooms..." /> : filteredProducts.length === 0 ? <EmptyState
    title="No Sarees Found"
    description="No handloom sarees match your active category, price range, weaving technique, or search query. Try resetting filters to explore our full royal collection."
    actionText="Reset All Filters"
    onAction={clearAllFilters}
  /> : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((p) => <ProductCard
    key={p.id}
    product={p}
    onQuickView={setQuickViewProduct}
  />)}
            </div>}
        </section>
      </div>

      {
    /* ========================================================== */
  }
      {
    /* 4. MOBILE SEARCH & FILTER DRAWER                           */
  }
      {
    /* ========================================================== */
  }
      {mobileFilterOpen && <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-in fade-in">
          <div
    className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
    onClick={() => setMobileFilterOpen(false)}
  />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl p-4 overflow-y-auto">
              <SidebarFilter
    isMobileModal
    onCloseMobile={() => setMobileFilterOpen(false)}
    filters={filterValues}
    onChange={handleFilterChange}
    onReset={clearAllFilters}
    totalResults={filteredProducts.length}
    currentSort={sortBy}
    onSortChange={handleSortChange}
  />
              <div className="mt-4 pt-4 border-t border-stone-200">
                <Button
    onClick={() => setMobileFilterOpen(false)}
    className="w-full"
    size="md"
  >
                  Apply Filters &amp; View {filteredProducts.length} Sarees
                </Button>
              </div>
            </div>
          </div>
        </div>}
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
export default Products;
