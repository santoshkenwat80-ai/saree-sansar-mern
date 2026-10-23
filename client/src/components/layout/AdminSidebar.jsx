import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Shirt,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  TicketPercent,
  BarChart3,
  LogOut,
  ExternalLink
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export const AdminSidebar = ({ onCloseMobile }) => {
  const { logout } = useAuth();
  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Shirt },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Inventory & Stock", href: "/admin/inventory", icon: Boxes },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "Coupons", href: "/admin/coupons", icon: TicketPercent },
    { name: "Sales Reports", href: "/admin/reports", icon: BarChart3 }
  ];
  return <aside className="w-64 bg-[#1e050b] text-stone-300 flex flex-col justify-between h-full border-r border-stone-800">
      <div>
        {
    /* Brand Header */
  }
        <div className="p-6 border-b border-stone-800/80">
          <span className="font-serif text-xl font-bold text-[#f2ce6e] block tracking-tight">
            Saree Sansar
          </span>
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block mt-0.5">
            Admin Management Console
          </span>
        </div>

        {
    /* Navigation links */
  }
        <nav className="p-4 space-y-1">
          {links.map((link) => {
    const Icon = link.icon;
    return <NavLink
      key={link.name}
      to={link.href}
      onClick={onCloseMobile}
      className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${isActive ? "bg-[#6b1426] text-white font-semibold shadow-xs" : "text-stone-400 hover:text-white hover:bg-white/5"}`}
    >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>;
  })}
        </nav>
      </div>

      {
    /* Footer controls */
  }
      <div className="p-4 border-t border-stone-800 space-y-2">
        <NavLink
    to="/"
    className="flex items-center justify-between px-3 py-2 text-xs text-stone-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
  >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </span>
          <span className="text-[10px] text-[#f2ce6e]">Live</span>
        </NavLink>

        <button
    onClick={logout}
    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer"
  >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>;
};
