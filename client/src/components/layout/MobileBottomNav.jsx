import { Link, useLocation } from "react-router-dom";
import { Home, Grid, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
export const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItemsCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navItems = [
    { label: "\u0939\u094B\u092E", icon: Home, path: "/" },
    { label: "\u0938\u093E\u0921\u093C\u093F\u092F\u093E\u0902", icon: Grid, path: "/products" },
    { label: "\u0916\u094B\u091C\u0947\u0902", icon: Search, path: "/search" },
    { label: "\u0925\u0948\u0932\u093E", icon: ShoppingBag, path: "/cart", badge: totalItemsCount },
    { label: isAuthenticated ? "\u0916\u093E\u0924\u093E" : "\u0932\u0949\u0917\u093F\u0928", icon: User, path: isAuthenticated ? "/profile" : "/login" }
  ];
  return <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return <Link
      key={item.path}
      to={item.path}
      className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors relative ${isActive ? "text-[#881930] font-bold" : "text-stone-500 hover:text-stone-800"}`}
    >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
                {item.badge !== void 0 && item.badge > 0 ? <span className="absolute -top-1.5 -right-2 bg-[#881930] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white">
                    {item.badge}
                  </span> : null}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>;
  })}
      </div>
    </nav>;
};
