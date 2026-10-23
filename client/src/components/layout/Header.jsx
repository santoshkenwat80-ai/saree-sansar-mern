import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Shield,
  Sparkles,
  ChevronDown,
  Clock,
  ArrowRight,
  Truck,
  Download,
  Tag,
  CheckCircle2,
  MapPin
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { MernDownloadModal } from "../common/MernDownloadModal";
import { AddressModalWithOtp } from "../common/AddressModalWithOtp";
import { INITIAL_PRODUCTS } from "../../services/mockData";
import { formatINR } from "../../utils/currency";
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const navigate = useNavigate();
  const location = useLocation();
  const sareeTypes = [
    { name: "Banarasi Silk", query: "Banarasi", href: "/products?category=banarasi-silk", badge: "Varanasi Looms" },
    { name: "Kanjivaram Silk", query: "Kanjivaram", href: "/products?category=kanjivaram-silk", badge: "Temple Zari" },
    { name: "Chanderi & Organza", query: "Chanderi", href: "/products?category=chanderi-organza", badge: "Featherlight" },
    { name: "Georgette & Chiffon", query: "Georgette", href: "/products?category=georgette-chiffon", badge: "Fluid Jaal" },
    { name: "Bridal Heritage", query: "Bridal", href: "/products?category=bridal-heritage", badge: "Trousseau" },
    { name: "Paithani Silk", query: "Paithani", href: "/search?q=Paithani", badge: "Peacock Border" },
    { name: "Handloom Cotton", query: "Cotton", href: "/products?category=handloom-cotton", badge: "Artisan Jamdani" }
  ];
  const matchingSarees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return INITIAL_PRODUCTS.filter((product) => {
      return product.name.toLowerCase().includes(q) || product.fabric.toLowerCase().includes(q) || product.category.toLowerCase().includes(q) || product.color.toLowerCase().includes(q) || product.weavingTechnique && product.weavingTechnique.toLowerCase().includes(q) || product.occasion && product.occasion.toLowerCase().includes(q) || product.description && product.description.toLowerCase().includes(q) || product.sku && product.sku.toLowerCase().includes(q);
    });
  }, [searchQuery]);
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(target)) {
        setIsMobileSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
      setIsMobileSearchFocused(false);
    }
  };
  const handleQuickSearch = (term) => {
    setSearchQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
  };
  const handleSelectProduct = (productId) => {
    navigate(`/products/${productId}`);
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
    setSearchQuery("");
  };
  const handleKeyDown = (e) => {
    if (!isSearchFocused || matchingSarees.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % matchingSarees.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => prev <= 0 ? matchingSarees.length - 1 : prev - 1);
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && matchingSarees[selectedIndex]) {
        e.preventDefault();
        handleSelectProduct(matchingSarees[selectedIndex].id);
      }
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
      setIsMobileSearchFocused(false);
    }
  };
  const categoryNavLinks = [
    { name: "Shop", href: "/products" },
    { name: "Collections", href: "/categories" },
    { name: "Banarasi Silk", href: "/products?category=banarasi-silk" },
    { name: "Kanjivaram Silk", href: "/products?category=kanjivaram-silk" },
    { name: "Bridal Heritage", href: "/products?category=bridal-heritage" },
    { name: "About Us", href: "/about-us" },
    { name: "Download MERN (.ZIP)", href: "/download" }
  ];
  const popularSearches = [
    "Crimson Bridal Banarasi",
    "Kanjivaram Pure Mulberry",
    "Tissue Chanderi Pastel",
    "Royal Blue Georgette Jaal"
  ];
  return <>
      {
    /* 1. Top Offer / Announcement Bar */
  }
      <div className="bg-[#4a0e1b] text-[#f2ce6e] text-xs font-medium py-1.5 px-4 tracking-wide border-b border-[#6b1426]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#f2ce6e]" />
            <span>
              Festive Splendor: 100% Pure MERN Stack (React, Node, Express, MongoDB) · Free Insured Express Delivery
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <Link
    to="/download"
    className="inline-flex items-center gap-1.5 bg-[#f2ce6e] hover:bg-[#ffe394] text-stone-950 font-bold px-2.5 py-0.5 rounded-full text-[11px] shadow-xs transition-colors cursor-pointer"
  >
              <Download className="w-3 h-3 text-[#6b1426]" />
              <span>Download MERN Project (.ZIP)</span>
            </Link>
            <Link
    to="/order-tracking"
    className="hidden sm:inline-flex items-center gap-1.5 text-stone-200 hover:text-[#f2ce6e] font-semibold transition-colors shrink-0"
  >
              <Truck className="w-3.5 h-3.5 text-[#f2ce6e]" />
              <span>Track Order (ऑर्डर ट्रैक)</span>
            </Link>
          </div>
        </div>
      </div>

      {
    /* 2. Main Sticky Navigation Header */
  }
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs transition-all">
        {
    /* Upper Zone: Logo, Search Input & Utility Icons */
  }
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
          {
    /* Mobile Hamburger Toggle */
  }
          <div className="flex items-center lg:hidden">
            <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="text-stone-700 p-2 hover:bg-stone-100 rounded-md transition-colors"
    aria-label="Toggle navigation menu"
  >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {
    /* Brand Logo & Royal Wordmark */
  }
          <Link
    to="/"
    className="flex items-center gap-3 group shrink-0 focus-visible:outline-none"
  >
            <div className="w-10 h-10 rounded-lg bg-[#6b1426] text-[#f2ce6e] flex items-center justify-center shadow-xs group-hover:bg-[#520f1d] transition-colors">
              <span className="font-serif text-xl font-bold tracking-tight">SS</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#6b1426] group-hover:text-[#881930] transition-colors whitespace-nowrap">
                Saree Sansar
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#a07817] font-semibold mt-1">
                Heritage Weaves of India
              </span>
            </div>
          </Link>

          {
    /* Quick Deliver To Address Pill with Live Database Status */
  }
          <button
    type="button"
    onClick={() => setIsAddressModalOpen(true)}
    className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-[#881930] bg-stone-50/80 hover:bg-rose-50/40 text-left transition-all cursor-pointer group shrink-0"
    title="डिलीवरी पता चुनें / मोबाइल OTP द्वारा सुरक्षित करें"
  >
            <div className="w-7 h-7 rounded-full bg-rose-100 group-hover:bg-[#881930] text-[#881930] group-hover:text-white flex items-center justify-center transition-colors">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-stone-500 font-medium">
                {defaultAddress?.fullName ? `Deliver to ${defaultAddress.fullName.split(" ")[0]}` : "\u0921\u093F\u0932\u0940\u0935\u0930\u0940 \u092A\u0924\u093E (Deliver to)"}
              </span>
              <span className="text-xs font-bold text-stone-800 group-hover:text-[#881930] truncate max-w-[130px]">
                {defaultAddress ? `${defaultAddress.city} - ${defaultAddress.pincode}` : "\u092A\u0924\u093E \u091C\u094B\u0921\u093C\u0947\u0902 (Add Address)"}
              </span>
            </div>
          </button>

          {
    /* Search Input Bar (Desktop & Tablet) with Real-Time Saree Suggestions */
  }
          <div
    ref={searchContainerRef}
    className="hidden md:flex flex-1 max-w-lg relative mx-2 lg:mx-6"
  >
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
    type="text"
    placeholder="Search specific sarees (e.g. Banarasi, Kanjivaram, Chanderi, Silk)..."
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setIsSearchFocused(true);
    }}
    onFocus={() => setIsSearchFocused(true)}
    onKeyDown={handleKeyDown}
    className="w-full pl-10 pr-20 py-2.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-300 focus:border-[#881930] rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881930]/20 transition-all shadow-2xs"
  />
              {searchQuery && <button
    type="button"
    onClick={() => setSearchQuery("")}
    className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
    aria-label="Clear search"
  >
                  <X className="w-3.5 h-3.5" />
                </button>}
              <button
    type="submit"
    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#6b1426] hover:bg-[#520f1d] text-white text-[11px] font-semibold rounded-full transition-colors cursor-pointer"
  >
                Search
              </button>
            </form>

            {
    /* Instant Real-Time Search Suggestions Dropdown */
  }
            {isSearchFocused && <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 max-h-[460px] flex flex-col">
                {
    /* 1. Specific Saree Types Quick Filter Bar */
  }
                <div className="p-3 bg-stone-50 border-b border-stone-100">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-[#a07817]" />
                      Explore Saree Types
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal">Quick Filters</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sareeTypes.map((type) => <button
    key={type.name}
    type="button"
    onClick={() => handleQuickSearch(type.query)}
    className="px-2.5 py-1 bg-white hover:bg-[#6b1426] hover:text-white border border-stone-200 hover:border-[#6b1426] rounded-full text-[11px] text-stone-700 font-medium transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
  >
                        <span>{type.name}</span>
                      </button>)}
                  </div>
                </div>

                {
    /* 2. Real-Time Product Suggestions Results */
  }
                <div className="overflow-y-auto flex-1 divide-y divide-stone-100">
                  {searchQuery.trim().length > 0 ? matchingSarees.length > 0 ? <div className="p-2">
                        <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                          <span>Matching Handloom Sarees ({matchingSarees.length})</span>
                          <span className="text-[10px] text-stone-400">Use ↑↓ keys to navigate</span>
                        </div>
                        {matchingSarees.map((saree, idx) => <div
    key={saree.id}
    onClick={() => handleSelectProduct(saree.id)}
    className={`p-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${selectedIndex === idx ? "bg-[#6b1426]/10 ring-1 ring-[#6b1426]/30" : "hover:bg-stone-50"}`}
  >
                            <img
    src={saree.images[0]}
    alt={saree.name}
    className="w-12 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
  />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-stone-900 truncate">
                                {saree.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-rose-50 text-[#881930] border border-rose-100">
                                  {saree.fabric}
                                </span>
                                <span className="text-[10px] text-stone-500">
                                  {saree.occasion}
                                </span>
                                {saree.stock > 0 && <span className="text-[10px] text-emerald-700 flex items-center gap-0.5 font-medium">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> In Stock
                                  </span>}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold font-mono text-[#6b1426]">
                                {formatINR(saree.price)}
                              </p>
                              {saree.originalPrice && <p className="text-[10px] font-mono text-stone-400 line-through">
                                  {formatINR(saree.originalPrice)}
                                </p>}
                            </div>
                          </div>)}
                      </div> : <div className="p-6 text-center space-y-2">
                        <Search className="w-8 h-8 text-stone-300 mx-auto" />
                        <p className="text-xs font-semibold text-stone-700">
                          No sarees found matching "{searchQuery}"
                        </p>
                        <p className="text-[11px] text-stone-400">
                          Try searching for Banarasi, Kanjivaram, Chanderi, Silk, or Georgette.
                        </p>
                        <div className="pt-2 flex justify-center gap-2">
                          <button
    type="button"
    onClick={() => handleQuickSearch("Banarasi")}
    className="px-2.5 py-1 bg-stone-100 hover:bg-[#6b1426] hover:text-white rounded-full text-[11px] font-medium"
  >
                            Banarasi
                          </button>
                          <button
    type="button"
    onClick={() => handleQuickSearch("Kanjivaram")}
    className="px-2.5 py-1 bg-stone-100 hover:bg-[#6b1426] hover:text-white rounded-full text-[11px] font-medium"
  >
                            Kanjivaram
                          </button>
                          <button
    type="button"
    onClick={() => handleQuickSearch("Silk")}
    className="px-2.5 py-1 bg-stone-100 hover:bg-[#6b1426] hover:text-white rounded-full text-[11px] font-medium"
  >
                            Pure Silk
                          </button>
                        </div>
                      </div> : <div className="p-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 px-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Popular Handloom Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => <button
    key={term}
    type="button"
    onClick={() => handleQuickSearch(term)}
    className="px-3 py-1.5 bg-stone-100 hover:bg-[#f5eedf] hover:text-[#6b1426] rounded-full text-xs text-stone-700 transition-colors text-left flex items-center gap-1 cursor-pointer"
  >
                            <span>{term}</span>
                            <ArrowRight className="w-3 h-3 text-stone-400" />
                          </button>)}
                      </div>
                    </div>}
                </div>

                {
    /* 3. Bottom Footer Button */
  }
                {searchQuery.trim().length > 0 && matchingSarees.length > 0 && <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center">
                    <button
    type="button"
    onClick={(e) => handleSearchSubmit(e)}
    className="w-full py-1.5 px-3 bg-[#6b1426] hover:bg-[#520f1d] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
  >
                      <span>View all {matchingSarees.length} results for "{searchQuery}"</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>}
              </div>}
          </div>

          {
    /* Action Icons: Account, Wishlist, Cart */
  }
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {
    /* Account Icon & Dropdown */
  }
            <div className="relative">
              <button
    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
    className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-stone-700 hover:text-[#6b1426] hover:bg-stone-100 rounded-full sm:rounded-lg transition-colors cursor-pointer"
    aria-label="Account Options"
  >
                <User className="w-5 h-5 text-stone-700" />
                <span className="hidden xl:inline text-xs font-medium text-stone-700">
                  {isAuthenticated ? user?.name ? user.name.split(" ")[0] : "Account" : "Sign In"}
                </span>
                <ChevronDown className="hidden xl:inline w-3 h-3 text-stone-400" />
              </button>

              {accountMenuOpen && <div
    className="absolute right-0 mt-2 w-60 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95"
    onMouseLeave={() => setAccountMenuOpen(false)}
  >
                  {isAuthenticated ? <>
                      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/50">
                        <p className="text-[11px] text-stone-400">Signed in as</p>
                        <p className="text-sm font-semibold text-stone-900 truncate">
                          {user?.name}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] text-[#a07817] font-semibold uppercase tracking-wider">
                          {user?.role === "admin" ? "Administrator" : "Valued Patron"}
                        </span>
                      </div>
                      <Link
    to="/profile"
    onClick={() => setAccountMenuOpen(false)}
    className="block px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#6b1426]"
  >
                        My Profile &amp; Addresses
                      </Link>
                      <Link
    to="/my-orders"
    onClick={() => setAccountMenuOpen(false)}
    className="block px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#6b1426]"
  >
                        Order History &amp; Tracking
                      </Link>
                      {isAdmin && <Link
    to="/admin/dashboard"
    onClick={() => setAccountMenuOpen(false)}
    className="flex items-center gap-2 px-4 py-2 text-xs text-[#881930] font-semibold hover:bg-rose-50"
  >
                          <Shield className="w-3.5 h-3.5" /> Admin Console
                        </Link>}
                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <button
    onClick={() => {
      logout();
      setAccountMenuOpen(false);
    }}
    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
  >
                          Sign Out
                        </button>
                      </div>
                    </> : <>
                      <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/50">
                        <p className="text-xs font-semibold text-stone-900">Welcome to Saree Sansar</p>
                        <p className="text-[11px] text-stone-500">Access your saved sarees and orders</p>
                      </div>
                      <Link
    to="/login"
    onClick={() => setAccountMenuOpen(false)}
    className="block px-4 py-2 text-xs font-semibold text-[#6b1426] hover:bg-stone-50"
  >
                        Sign In
                      </Link>
                      <Link
    to="/register"
    onClick={() => setAccountMenuOpen(false)}
    className="block px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
  >
                        Create Account
                      </Link>
                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <Link
    to="/admin/login"
    onClick={() => setAccountMenuOpen(false)}
    className="block px-4 py-1.5 text-[11px] text-stone-500 hover:text-stone-900 hover:bg-stone-50"
  >
                          Admin Portal
                        </Link>
                      </div>
                    </>}
                </div>}
            </div>

            {
    /* Direct MERN Stack Download Button */
  }
            <Link
    to="/download"
    className="relative p-2 sm:px-3 sm:py-2 text-[#6b1426] hover:bg-amber-50/70 rounded-full sm:rounded-lg transition-colors flex items-center gap-1.5 font-bold"
    title="Download 100% Pure MERN Stack Code"
    aria-label="Download MERN Stack Code"
  >
              <Download className="w-5 h-5 text-[#881930]" />
              <span className="hidden xl:inline text-xs font-bold text-[#881930]">
                Download MERN (.ZIP)
              </span>
            </Link>

            {
    /* Direct Track Order Button */
  }
            <Link
    to="/order-tracking"
    className="relative p-2 sm:px-3 sm:py-2 text-stone-700 hover:text-[#6b1426] hover:bg-stone-100 rounded-full sm:rounded-lg transition-colors flex items-center gap-1.5"
    title="Track Order Status"
    aria-label="Track Order"
  >
              <Truck className="w-5 h-5 text-stone-700" />
              <span className="hidden xl:inline text-xs font-medium text-stone-700">
                Track
              </span>
            </Link>

            {
    /* Wishlist Icon */
  }
            <Link
    to="/wishlist"
    className="relative p-2 sm:px-3 sm:py-2 text-stone-700 hover:text-[#6b1426] hover:bg-stone-100 rounded-full sm:rounded-lg transition-colors flex items-center gap-1.5"
    title="Saved Wishlist"
    aria-label="Wishlist"
  >
              <Heart className="w-5 h-5 text-stone-700" />
              <span className="hidden xl:inline text-xs font-medium text-stone-700">
                Wishlist
              </span>
              {wishlistCount > 0 && <span className="absolute top-1 right-1 sm:static bg-[#881930] text-white text-[10px] font-bold rounded-full h-4 w-4 sm:h-4.5 sm:w-4.5 flex items-center justify-center font-mono tabular-nums shadow-xs">
                  {wishlistCount}
                </span>}
            </Link>

            {
    /* Cart Icon & Drawer Trigger */
  }
            <button
    onClick={() => setIsCartDrawerOpen(true)}
    className="relative p-2 sm:px-3 sm:py-2 text-stone-700 hover:text-[#6b1426] hover:bg-stone-100 rounded-full sm:rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
    title="Shopping Bag"
    aria-label="Shopping Bag"
  >
              <ShoppingBag className="w-5 h-5 text-stone-700" />
              <span className="hidden xl:inline text-xs font-medium text-stone-700">
                Bag
              </span>
              {totalItemsCount > 0 && <span className="absolute top-1 right-1 sm:static bg-[#881930] text-white text-[10px] font-bold rounded-full h-4 w-4 sm:h-4.5 sm:w-4.5 flex items-center justify-center font-mono tabular-nums shadow-xs">
                  {totalItemsCount}
                </span>}
            </button>
          </div>
        </div>

        {
    /* Lower Zone: Saree Category Navigation Links (Desktop) */
  }
        <div className="hidden lg:block border-t border-stone-100 bg-[#FCF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-10 h-12 text-xs font-semibold uppercase tracking-wider text-stone-700">
              {categoryNavLinks.map((link) => {
    const isActive = location.pathname + location.search === link.href;
    return <Link
      key={link.name}
      to={link.href}
      className={`whitespace-nowrap transition-colors py-2 border-b-2 hover:text-[#6b1426] hover:border-[#6b1426] ${isActive ? "text-[#6b1426] border-[#6b1426]" : "text-stone-700 border-transparent"}`}
    >
                    {link.name}
                  </Link>;
  })}
            </nav>
          </div>
        </div>

        {
    /* Mobile Search Bar (Below Header on small screens) */
  }
        <div ref={mobileSearchContainerRef} className="md:hidden border-t border-stone-200 px-4 py-2.5 bg-stone-50 relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
    type="text"
    placeholder="Search Banarasi, Kanjivaram, Silk..."
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      setIsMobileSearchFocused(true);
    }}
    onFocus={() => setIsMobileSearchFocused(true)}
    className="w-full pl-9 pr-16 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
            {searchQuery && <button
    type="button"
    onClick={() => setSearchQuery("")}
    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-stone-400"
  >
                <X className="w-3.5 h-3.5" />
              </button>}
            <button
    type="submit"
    className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#6b1426] text-white text-[10px] font-semibold rounded-md"
  >
              Go
            </button>
          </form>

          {
    /* Mobile Real-Time Suggestions Dropdown */
  }
          {isMobileSearchFocused && <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-2xl border border-stone-200 z-50 overflow-hidden max-h-[380px] flex flex-col">
              {
    /* Saree Types Pills */
  }
              <div className="p-2.5 bg-stone-50 border-b border-stone-100 flex flex-wrap gap-1">
                {sareeTypes.slice(0, 5).map((type) => <button
    key={type.name}
    type="button"
    onClick={() => handleQuickSearch(type.query)}
    className="px-2 py-0.5 bg-white border border-stone-200 rounded-full text-[10px] font-semibold text-stone-700"
  >
                    {type.name}
                  </button>)}
              </div>

              {
    /* Matching Sarees */
  }
              <div className="overflow-y-auto flex-1 divide-y divide-stone-100 p-1">
                {searchQuery.trim().length > 0 ? matchingSarees.length > 0 ? matchingSarees.slice(0, 4).map((saree) => <div
    key={saree.id}
    onClick={() => handleSelectProduct(saree.id)}
    className="p-2 flex items-center gap-2.5 hover:bg-stone-50 active:bg-stone-100 rounded-lg cursor-pointer"
  >
                        <img
    src={saree.images[0]}
    alt={saree.name}
    className="w-10 h-12 object-cover rounded border border-stone-200 shrink-0"
  />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-stone-900 truncate">
                            {saree.name}
                          </p>
                          <p className="text-[10px] text-[#881930] font-medium">
                            {saree.fabric}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold font-mono text-[#6b1426]">
                            {formatINR(saree.price)}
                          </p>
                        </div>
                      </div>) : <div className="p-4 text-center text-xs text-stone-500">
                      No sarees matching "{searchQuery}"
                    </div> : <div className="p-2.5 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Popular Searches
                    </p>
                    {popularSearches.map((term) => <button
    key={term}
    type="button"
    onClick={() => handleQuickSearch(term)}
    className="block w-full text-left py-1 text-xs text-stone-700 hover:text-[#6b1426]"
  >
                        {term}
                      </button>)}
                  </div>}
              </div>

              {searchQuery.trim().length > 0 && matchingSarees.length > 0 && <div className="p-2 bg-stone-50 border-t border-stone-100">
                  <button
    type="button"
    onClick={(e) => handleSearchSubmit(e)}
    className="w-full py-1.5 bg-[#6b1426] text-white text-xs font-semibold rounded-md text-center"
  >
                    View All {matchingSarees.length} Results
                  </button>
                </div>}
            </div>}
        </div>

        {
    /* Mobile Navigation Drawer */
  }
        {mobileMenuOpen && <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2">
            {
    /* Mobile Deliver to Address Banner */
  }
            <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#881930] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 font-semibold block uppercase">डिलीवरी पता (Deliver to)</span>
                  <span className="text-xs font-bold text-stone-900 block truncate max-w-[170px]">
                    {defaultAddress ? `${defaultAddress.fullName} \xB7 ${defaultAddress.city} ${defaultAddress.pincode}` : "\u092A\u0924\u093E \u091C\u094B\u0921\u093C\u0947\u0902 (Add Address)"}
                  </span>
                </div>
              </div>
              <button
    type="button"
    onClick={() => {
      setMobileMenuOpen(false);
      setIsAddressModalOpen(true);
    }}
    className="text-xs font-bold text-[#881930] hover:underline px-2.5 py-1 bg-white rounded-lg border border-rose-200 shadow-2xs"
  >
                {defaultAddress ? "\u092C\u0926\u0932\u0947\u0902" : "\u091C\u094B\u0921\u093C\u0947\u0902"}
              </button>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a07817] mb-2 px-3">
                Saree Categories
              </p>
              <nav className="flex flex-col space-y-1">
                {categoryNavLinks.map((link) => <Link
    key={link.name}
    to={link.href}
    onClick={() => setMobileMenuOpen(false)}
    className="px-3 py-2 text-sm font-medium text-stone-800 hover:text-[#6b1426] hover:bg-stone-50 rounded-md transition-colors"
  >
                    {link.name}
                  </Link>)}
              </nav>
            </div>

            <div className="border-t border-stone-100 pt-3 space-y-1.5">
              <Link
    to="/cart"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center justify-between px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-md"
  >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-stone-600" />
                  <span>Shopping Bag</span>
                </div>
                <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-0.5 rounded">
                  {totalItemsCount}
                </span>
              </Link>
              <Link
    to="/wishlist"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center justify-between px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-md"
  >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-stone-600" />
                  <span>Saved Sarees</span>
                </div>
                <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-0.5 rounded">
                  {wishlistCount}
                </span>
              </Link>
              <Link
    to="/order-tracking"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center gap-2 px-3 py-2 text-sm text-[#881930] font-semibold hover:bg-rose-50 rounded-md"
  >
                <Truck className="w-4 h-4 text-[#881930]" />
                <span>Track Order (लाइव ट्रैकिंग)</span>
              </Link>
              <Link
    to="/profile"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-md"
  >
                <User className="w-4 h-4 text-stone-600" />
                <span>My Profile &amp; Orders</span>
              </Link>
              <button
    type="button"
    onClick={() => {
      setMobileMenuOpen(false);
      setDownloadModalOpen(true);
    }}
    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#6b1426] text-[#f2ce6e] text-xs font-bold rounded-lg shadow-sm hover:bg-[#520f1d] transition-colors cursor-pointer"
  >
                <Download className="w-4 h-4" />
                <span>Download MERN Project (.ZIP)</span>
              </button>
            </div>
          </div>}
      </header>

      {
    /* Delivery Address Modal with Mobile Number OTP Verification */
  }
      <AddressModalWithOtp
    isOpen={isAddressModalOpen}
    onClose={() => setIsAddressModalOpen(false)}
    onSuccess={() => setIsAddressModalOpen(false)}
    title="डिलीवरी पता चुनें / नया पता जोड़ें (Delivery Address)"
  />

      {
    /* MERN Stack Source Code Download Modal */
  }
      <MernDownloadModal
    isOpen={downloadModalOpen}
    onClose={() => setDownloadModalOpen(false)}
  />
    </>;
};
