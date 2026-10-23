import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";
import { productService } from "../../services/productService";
import { ProductCard } from "../../components/products/ProductCard";
import { QuickViewModal } from "../../components/products/QuickViewModal";
import { SidebarFilter } from "../../components/products/SidebarFilter";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/common/Button";
export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const selectedTechnique = searchParams.get("technique") || searchParams.get("weavingTechnique") || "all";
  const selectedFabric = searchParams.get("fabric") || "all";
  const selectedColor = searchParams.get("color") || "all";
  const selectedArtisan = searchParams.get("artisan") || "all";
  const sortBy = searchParams.get("sort") || "popular";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 6e4;
  const inStockOnly = searchParams.get("inStock") === "true";
  const [inputValue, setInputValue] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  useEffect(() => {
    setInputValue(query);
    setLoading(true);
    productService.getProducts(query ? { search: query } : void 0).then(setProducts).finally(() => setLoading(false));
  }, [query]);
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
    searchQuery: query
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
  const handleSortChange = (newSort) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", newSort);
    setSearchParams(newParams);
  };
  const clearFilters = () => {
    const newParams = new URLSearchParams();
    if (query) newParams.set("q", query);
    setSearchParams(newParams);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (inputValue.trim()) {
      newParams.set("q", inputValue.trim());
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams);
  };
  const handleClear = () => {
    setInputValue("");
    setSearchParams({});
  };
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== "all") {
        const catLower = selectedCategory.toLowerCase();
        const pCatLower = (p.category || "").toLowerCase();
        if (pCatLower !== catLower && !pCatLower.includes(catLower)) {
          return false;
        }
      }
      if (selectedTechnique !== "all") {
        const tq = selectedTechnique.toLowerCase().trim();
        const techMatch = p.weavingTechnique?.toLowerCase().includes(tq) || p.specifications?.Weave?.toLowerCase().includes(tq) || p.description?.toLowerCase().includes(tq);
        if (!techMatch) return false;
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
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
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
  const activeFilterCount = (selectedCategory !== "all" ? 1 : 0) + (selectedTechnique !== "all" ? 1 : 0) + (selectedFabric !== "all" ? 1 : 0) + (selectedColor !== "all" ? 1 : 0) + (selectedArtisan !== "all" ? 1 : 0) + (minPrice > 0 || maxPrice < 6e4 ? 1 : 0) + (inStockOnly ? 1 : 0);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {
    /* Search Header Form */
  }
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">
          Discover Heirloom Sarees
        </h1>
        <p className="text-xs text-stone-500 mb-5">
          Browse by category, weaving technique (Kadwa, Korvai, Katan), price range, or weaver guilds.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
    type="text"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    placeholder="Search by weave, fabric, artisan, or color (e.g. Kadwa Banarasi, Korvai Kanjivaram)..."
    className="w-full pl-12 pr-28 py-3.5 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#881930] shadow-xs"
  />
          {inputValue && <button
    type="button"
    onClick={handleClear}
    className="absolute right-24 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
  >
              <X className="w-4 h-4" />
            </button>}
          <button
    type="submit"
    className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#6b1426] text-white text-xs font-semibold rounded-lg hover:bg-[#520f1d] cursor-pointer shadow-2xs"
  >
            Search
          </button>
        </form>

        {
    /* Quick Suggestion Chips */
  }
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          <span className="text-[11px] text-stone-400 self-center mr-1">Trending:</span>
          {["Kadwa Banarasi", "Korvai Kanjivaram", "Chanderi", "Bridal Heritage", "Under \u20B920,000"].map((term) => <button
    key={term}
    type="button"
    onClick={() => {
      if (term === "Under \u20B920,000") {
        handleFilterChange({ ...filterValues, maxPrice: 2e4 });
      } else if (term === "Kadwa Banarasi") {
        handleFilterChange({ ...filterValues, weavingTechnique: "Kadwa Brocade" });
      } else if (term === "Korvai Kanjivaram") {
        handleFilterChange({ ...filterValues, weavingTechnique: "Korvai Interlock" });
      } else {
        setInputValue(term);
        const newParams = new URLSearchParams(searchParams);
        newParams.set("q", term);
        setSearchParams(newParams);
      }
    }}
    className="px-2.5 py-1 bg-stone-100 hover:bg-[#f5eedf] hover:text-[#6b1426] rounded-full text-[11px] text-stone-600 transition-colors cursor-pointer"
  >
              {term}
            </button>)}
        </div>
      </div>

      {
    /* Main Grid: SidebarFilter + Results */
  }
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {
    /* Desktop SidebarFilter Component */
  }
        <aside className="hidden lg:block lg:col-span-1 self-start sticky top-28">
          <SidebarFilter
    filters={filterValues}
    onChange={handleFilterChange}
    onReset={clearFilters}
    totalResults={filteredProducts.length}
    currentSort={sortBy}
    onSortChange={handleSortChange}
  />
        </aside>

        {
    /* Results Area */
  }
        <section className="lg:col-span-3">
          {
    /* Mobile Filter Toggle */
  }
          <div className="lg:hidden flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
            <span className="text-xs text-stone-500">
              Found <strong>{filteredProducts.length}</strong> matching sarees
            </span>
            <button
    type="button"
    onClick={() => setMobileFilterOpen(true)}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer"
  >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#881930]" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
            </button>
          </div>

          {loading ? <Loader message="Searching handloom catalogue..." /> : filteredProducts.length === 0 ? <EmptyState
    title="No Matching Sarees Found"
    description="No sarees match your current search query and filter criteria. Try broadening your category, weaving technique, or price range options."
    actionText="Reset All Filters"
    onAction={clearFilters}
  /> : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => <ProductCard
    key={p.id}
    product={p}
    onQuickView={setQuickViewProduct}
  />)}
            </div>}
        </section>
      </div>

      {
    /* Mobile Drawer */
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
    onReset={clearFilters}
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
                  Apply &amp; View {filteredProducts.length} Sarees
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
export default Search;
