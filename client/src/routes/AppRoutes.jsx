import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { AdminLayout } from "../components/layout/AdminLayout";
import { Home } from "../pages/customer/Home";
import { Products } from "../pages/customer/Products";
import { ProductDetails } from "../pages/customer/ProductDetails";
import { Categories } from "../pages/customer/Categories";
import { Search } from "../pages/customer/Search";
import { Cart } from "../pages/customer/Cart";
import { Wishlist } from "../pages/customer/Wishlist";
import { Checkout } from "../pages/customer/Checkout";
import { PaymentResult } from "../pages/customer/PaymentResult";
import { MyOrders } from "../pages/customer/MyOrders";
import { OrderTracking } from "../pages/customer/OrderTracking";
import { Profile } from "../pages/customer/Profile";
import { Login } from "../pages/customer/Login";
import { Register } from "../pages/customer/Register";
import { ForgotPassword } from "../pages/customer/ForgotPassword";
import { MernDownloadPage } from "../pages/customer/MernDownloadPage";
import { AboutUs } from "../pages/customer/AboutUs";
import { AdminLogin } from "../pages/admin/AdminLogin";
import { Dashboard } from "../pages/admin/Dashboard";
import { ProductsManagement } from "../pages/admin/ProductsManagement";
import { CategoriesManagement } from "../pages/admin/CategoriesManagement";
import { Inventory } from "../pages/admin/Inventory";
import { OrdersManagement } from "../pages/admin/OrdersManagement";
import { UsersManagement } from "../pages/admin/UsersManagement";
import { CouponsManagement } from "../pages/admin/CouponsManagement";
import { SalesReports } from "../pages/admin/SalesReports";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";
export const AppRoutes = () => {
  return <Routes>
      {
    /* Customer Storefront Routes */
  }
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetails />} />
        <Route path="categories" element={<Categories />} />
        <Route path="search" element={<Search />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment-result" element={<PaymentResult />} />
        <Route path="order-tracking" element={<OrderTracking />} />
        <Route path="order-tracking/:orderId" element={<OrderTracking />} />
        <Route path="track-order" element={<OrderTracking />} />
        <Route path="track-order/:orderId" element={<OrderTracking />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="download" element={<MernDownloadPage />} />
        <Route path="mern" element={<MernDownloadPage />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="about-us" element={<AboutUs />} />

        {
    /* Customer Protected Routes */
  }
        <Route
    path="profile"
    element={<ProtectedRoute>
              <Profile />
            </ProtectedRoute>}
  />
        <Route
    path="my-orders"
    element={<ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>}
  />
      </Route>

      {
    /* Admin Login (Standalone) */
  }
      <Route path="/admin/login" element={<AdminLogin />} />

      {
    /* Admin Console Protected Routes */
  }
      <Route
    path="/admin"
    element={<AdminRoute>
            <AdminLayout />
          </AdminRoute>}
  >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="categories" element={<CategoriesManagement />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="coupons" element={<CouponsManagement />} />
        <Route path="reports" element={<SalesReports />} />
      </Route>

      {
    /* Fallback */
  }
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>;
};
