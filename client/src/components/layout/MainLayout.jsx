import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";
import { MobileBottomNav } from "./MobileBottomNav";
export const MainLayout = () => {
  return <div className="min-h-screen flex flex-col bg-[#FCF9F5]">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>;
};
