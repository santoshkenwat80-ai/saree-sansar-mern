import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AppRoutes } from "./routes/AppRoutes";
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
export default function App() {
  return <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
            <Toaster
    position="top-right"
    toastOptions={{
      duration: 3500,
      style: {
        background: "#2e0912",
        color: "#fff",
        border: "1px solid #a07817",
        borderRadius: "8px",
        fontSize: "13px"
      },
      success: {
        iconTheme: {
          primary: "#d4af37",
          secondary: "#2e0912"
        }
      },
      error: {
        iconTheme: {
          primary: "#e11d48",
          secondary: "#fff"
        }
      }
    }}
  />
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>;
}
