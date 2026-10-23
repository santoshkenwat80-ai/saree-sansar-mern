import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Truck,
  Search,
  Package,
  ChevronLeft,
  Headphones,
  Sparkles
} from "lucide-react";
import { orderService } from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";
import { formatINR, formatDate } from "../../utils/currency";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import { OrderTracking as OrderTrackingCard } from "../../components/orders/OrderTracking";
import toast from "react-hot-toast";
export const OrderTracking = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryId = searchParams.get("id") || searchParams.get("orderNumber") || "";
  const initialId = (orderId || queryId || "").trim();
  const [searchInput, setSearchInput] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [myRecentOrders, setMyRecentOrders] = useState([]);
  useEffect(() => {
    orderService.getMyOrders(user?.id, user?.email).then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setMyRecentOrders(res);
      }
    }).catch(() => {
    });
  }, [user]);
  const fetchOrder = async (idToSearch) => {
    const clean = idToSearch.trim();
    if (!clean) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const found = await orderService.getOrderById(clean);
      setOrder(found);
      if (!found) {
        toast.error(`No order found matching "${clean}".`);
      }
    } catch (err) {
      setOrder(null);
      toast.error(err.message || "Error tracking order");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (initialId) {
      setSearchInput(initialId);
      fetchOrder(initialId);
    } else {
      setLoading(false);
    }
  }, [initialId]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.error("Please enter an Order ID or AWB Tracking Number");
      return;
    }
    navigate(`/order-tracking/${encodeURIComponent(searchInput.trim())}`);
  };
  const handleSelectRecentOrder = (selectedOrder) => {
    const idToUse = selectedOrder.orderNumber || selectedOrder.id;
    setSearchInput(idToUse);
    navigate(`/order-tracking/${encodeURIComponent(idToUse)}`);
  };
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      {
    /* Navigation & Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <Link
    to="/my-orders"
    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#881930] mb-2 transition-colors"
  >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Orders</span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 flex items-center gap-2.5">
            <Truck className="w-7 h-7 sm:w-8 sm:h-8 text-[#881930]" />
            Live Shipment &amp; Order Tracker
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time status updates from our Varanasi &amp; Kanchipuram master handloom ateliers to your doorstep
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
    to="/my-orders"
    className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
  >
            My Orders Dashboard
          </Link>
          <Link
    to="/products"
    className="px-3.5 py-1.5 rounded-lg bg-[#6b1426] hover:bg-[#520f1d] text-white text-xs font-semibold transition-colors"
  >
            Explore Sarees
          </Link>
        </div>
      </div>

      {
    /* Search Bar Hero Card */
  }
      <div className="bg-gradient-to-br from-[#24060d] to-[#3d0916] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#f2ce6e] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#f2ce6e]" />
            Direct Order Search
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold">
            Track Any Saree Sansar Shipment
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            Enter your <strong>Order ID</strong> (e.g. <code>SS-ORD-9281</code> or just <code>9281</code>) or <strong>Courier Waybill / AWB #</strong> (e.g. <code>COD-IN-3336983</code> or <code>EXP-IN-8821092</code>).
          </p>

          <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
    type="text"
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    placeholder="Enter Order # or Tracking AWB code..."
    className="w-full pl-10 pr-4 py-2.5 bg-white text-stone-900 placeholder:text-stone-400 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#f2ce6e]"
  />
            </div>
            <Button
    type="submit"
    size="md"
    className="bg-[#d4af37] hover:bg-[#c29e2e] text-[#24060d] font-bold px-6 shadow-sm"
  >
              Track Order
            </Button>
          </form>

          {
    /* Quick Click Demo / Test Pills */
  }
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-stone-300">
            <span className="text-stone-400">Quick Test Samples:</span>
            {["SS-ORD-9281", "SS-ORD-2794", "DEL-IND-8821092"].map((sample) => <button
    key={sample}
    type="button"
    onClick={() => {
      setSearchInput(sample);
      navigate(`/order-tracking/${sample}`);
    }}
    className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[#f2ce6e] font-mono cursor-pointer transition-colors"
  >
                {sample}
              </button>)}
          </div>
        </div>
      </div>

      {
    /* Logged-In User's Recent Orders Quick Selector */
  }
      {myRecentOrders.length > 0 && <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#881930]" />
              Your Recent Placed Orders
            </h3>
            <span className="text-[11px] text-stone-500">Click any order to track instantly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myRecentOrders.slice(0, 6).map((o) => {
    const isCurrent = order && (order.id === o.id || order.orderNumber === o.orderNumber);
    return <button
      key={o.id || o.orderNumber}
      type="button"
      onClick={() => handleSelectRecentOrder(o)}
      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${isCurrent ? "bg-white border-[#881930] shadow-xs ring-1 ring-[#881930]" : "bg-white/70 border-stone-200 hover:border-stone-300 hover:bg-white"}`}
    >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-stone-900">{o.orderNumber}</span>
                    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${o.orderStatus === "CANCELLED" ? "bg-rose-100 text-rose-800" : o.orderStatus === "DELIVERED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
    >
                      {o.orderStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 flex justify-between">
                    <span>{formatDate(o.createdAt)}</span>
                    <span className="font-mono font-semibold text-stone-800">{formatINR(o.totalAmount)}</span>
                  </div>
                </button>;
  })}
          </div>
        </div>}

      {
    /* Dynamic Content Area: Loader, Order Tracking Component, or Empty State */
  }
      {loading ? <Loader message="Fetching real-time tracking timeline &amp; fulfillment logs..." /> : order ? <div className="space-y-6 animate-in fade-in">
          {
    /* Main Interactive Order Tracking Component with Cancellation */
  }
          <OrderTrackingCard
    order={order}
    onOrderUpdated={(updated) => setOrder(updated)}
    showCancelButton={true}
  />
        </div> : hasSearched ? <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            No Order Found for &ldquo;{searchInput}&rdquo;
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Please ensure you have entered the exact Order ID sent via SMS/Email (e.g., <strong>SS-ORD-9281</strong> or just <strong>9281</strong>) or your courier AWB code.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button
    onClick={() => {
      setSearchInput("SS-ORD-9281");
      navigate("/order-tracking/SS-ORD-9281");
    }}
    variant="outline"
    size="sm"
  >
              Try Demo Order SS-ORD-9281
            </Button>
            <Link
    to="/my-orders"
    className="px-4 py-2 bg-[#6b1426] hover:bg-[#520f1d] text-white text-xs font-semibold rounded-lg"
  >
              Go to My Orders
            </Link>
          </div>
        </div> : <div className="bg-stone-50/60 rounded-2xl border border-stone-200/80 p-8 sm:p-12 text-center space-y-4">
          <Truck className="w-12 h-12 text-[#a07817] mx-auto opacity-70" />
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
            Enter an Order # or Tracking Code to Begin
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Use the search box above to track any shipment, review silk inspection status, or manage order cancellations.
          </p>
        </div>}

      {
    /* Customer Concierge / Helpdesk Card */
  }
      <div className="bg-stone-50 p-6 sm:p-7 rounded-2xl border border-stone-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs text-stone-600">
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#881930]" />
            Need Assistance with Dispatch or Cancellation?
          </h4>
          <p className="text-stone-500 leading-relaxed">
            Our artisan concierge desk is available 10:00 AM – 7:00 PM IST for doorstep delivery re-routing, blouse customization holds, and instant cancellation assistance.
          </p>
        </div>
        <div className="shrink-0 space-y-1 font-medium text-stone-700">
          <p>
            Email: <a href="mailto:care@sareesansar.com" className="text-[#881930] hover:underline font-mono">care@sareesansar.com</a>
          </p>
          <p>
            Helpline: <a href="tel:+919876543210" className="text-[#881930] hover:underline font-mono">+91 98765 43210</a>
          </p>
        </div>
      </div>
    </div>;
};
export default OrderTracking;
