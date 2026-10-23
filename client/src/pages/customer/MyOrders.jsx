import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  Ban,
  Eye,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from "lucide-react";
import { orderService } from "../../services/orderService";
import { useAuth } from "../../context/AuthContext";
import { formatINR, formatDate } from "../../utils/currency";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { EmptyState } from "../../components/common/EmptyState";
import { Modal } from "../../components/common/Modal";
import { OrderTracking } from "../../components/orders/OrderTracking";
import { OrderProgressBar } from "../../components/orders/OrderProgressBar";
import toast from "react-hot-toast";
export const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTrackingId, setSearchTrackingId] = useState("");
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("Change of plan / Found another saree design");
  const [customReason, setCustomReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();
  const loadOrders = () => {
    setLoading(true);
    orderService.getMyOrders(user?.id, user?.email).then(setOrders).finally(() => setLoading(false));
  };
  useEffect(() => {
    loadOrders();
  }, [user]);
  const handleOrderUpdated = (updatedOrder) => {
    setOrders(
      (prev) => prev.map((o) => o.id === updatedOrder.id || o.orderNumber === updatedOrder.orderNumber ? updatedOrder : o)
    );
  };
  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    setIsCancelling(true);
    const finalReason = cancelReason === "Other" && customReason.trim() ? customReason.trim() : cancelReason;
    try {
      const orderIdentifier = cancelModalOrder.id || cancelModalOrder.orderNumber;
      const updated = await orderService.cancelOrder(orderIdentifier, finalReason);
      handleOrderUpdated(updated);
      toast.success("Order cancelled successfully. Saree stock has been replenished.");
      setCancelModalOrder(null);
      setCustomReason("");
    } catch (err) {
      toast.error(err.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };
  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  const handleQuickTrackSubmit = (e) => {
    e.preventDefault();
    if (searchTrackingId.trim()) {
      navigate(`/order-tracking/${searchTrackingId.trim()}`);
    }
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800";
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800";
      case "CONFIRMED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      {
    /* Page Header */
  }
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
            My Orders &amp; Shipment Tracking
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time fulfillment tracking, delivery timeline updates, and order cancellation
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {
    /* Quick Tracking Search Bar */
  }
          <form onSubmit={handleQuickTrackSubmit} className="flex gap-1.5 text-xs">
            <input
    type="text"
    placeholder="Enter Order # or AWB..."
    value={searchTrackingId}
    onChange={(e) => setSearchTrackingId(e.target.value)}
    className="px-3 py-2 border border-stone-300 rounded-lg bg-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#881930] w-48"
  />
            <Button type="submit" size="sm" variant="secondary">
              Track
            </Button>
          </form>

          <Button onClick={loadOrders} variant="outline" size="sm" title="Refresh Orders">
            <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
          </Button>

          <Button onClick={() => navigate("/products")} variant="primary" size="sm">
            Explore Sarees
          </Button>
        </div>
      </div>

      {loading ? <Loader message="Loading your orders &amp; tracking history..." /> : orders.length === 0 ? <EmptyState
    icon={<Package className="w-8 h-8 text-stone-400" />}
    title="No Orders Found"
    description="You haven't placed any orders yet. Discover our pure Mulberry silk collections and experience heirloom craftsmanship."
    actionText="Explore Handloom Sarees"
    onAction={() => navigate("/products")}
  /> : <div className="space-y-6">
          {orders.map((order) => {
    const isExpanded = expandedOrderId === order.id || expandedOrderId === order.orderNumber;
    const canCancel = !["CANCELLED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.orderStatus);
    return <div
      key={order.id || order.orderNumber}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs transition-shadow hover:shadow-xs"
    >
                {
      /* Order Summary Header Strip */
    }
                <div className="p-4 sm:p-5 bg-stone-50/70 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-5 sm:gap-8">
                    <div>
                      <span className="text-stone-400 block text-[11px]">Order Date</span>
                      <span className="font-medium text-stone-900">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Order ID</span>
                      <span className="font-mono font-bold text-stone-900">{order.orderNumber}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[11px]">Total Paid</span>
                      <span className="font-mono font-bold text-[#6b1426] text-sm">
                        {formatINR(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
      className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusBadge(
        order.orderStatus
      )}`}
    >
                      {order.orderStatus.replace(/_/g, " ")}
                    </span>

                    <button
      type="button"
      onClick={() => toggleExpand(order.id || order.orderNumber)}
      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-lg text-xs font-semibold cursor-pointer shadow-2xs"
    >
                      <Truck className="w-3.5 h-3.5 text-[#881930]" />
                      <span>{isExpanded ? "Hide Details" : "Timeline Details"}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {
      /* Real-Time Order Status Progression Bar Component */
    }
                <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-stone-50/50 border-b border-stone-200/80">
                  <OrderProgressBar order={order} />
                </div>

                {
      /* Inline Detailed Order Tracking Accordion */
    }
                {isExpanded && <div className="p-4 sm:p-6 bg-stone-50/40 border-b border-stone-200 animate-in fade-in">
                    <OrderTracking
      order={order}
      onOrderUpdated={handleOrderUpdated}
      showCancelButton={canCancel}
    />
                  </div>}

                {
      /* Order Saree Items Listing */
    }
                <div className="p-4 sm:p-6 divide-y divide-stone-100">
                  {order.items.map((item, idx) => {
      const product = item.product || {};
      const img = product.images && product.images[0] || "/src/assets/images/hero_banarasi_bridal_1791698980254.jpg";
      return <div
        key={item.id || idx}
        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 justify-between sm:items-center"
      >
                        <div className="flex gap-4 items-center">
                          <img
        src={img}
        alt={product.name || "Saree"}
        className="w-16 h-20 object-cover rounded-lg bg-stone-100 border border-stone-200 shrink-0"
      />
                          <div>
                            <h4 className="font-serif font-bold text-stone-900 text-sm">
                              {product.name || "Handloom Pure Silk Saree"}
                            </h4>
                            <p className="text-xs text-stone-500 mt-0.5">
                              {product.fabric || "Pure Silk"} · Qty:{" "}
                              <strong className="font-mono text-stone-800">{item.quantity}</strong>
                            </p>
                            <p className="text-xs font-mono font-bold text-stone-900 mt-1">
                              {formatINR((product.price || 0) * (item.quantity || 1))}
                            </p>
                          </div>
                        </div>

                        {
        /* Action buttons per order */
      }
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 pt-2 sm:pt-0">
                          <Link
        to={`/order-tracking/${order.orderNumber || order.id}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f5eedf] hover:bg-[#ebd9c3] text-[#6b1426] rounded-lg text-xs font-semibold transition-colors"
      >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detailed Tracking Page</span>
                          </Link>

                          {canCancel && <button
        type="button"
        onClick={() => setCancelModalOrder(order)}
        className="text-xs text-rose-600 hover:text-rose-800 hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
      >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Cancel Order</span>
                            </button>}
                        </div>
                      </div>;
    })}
                </div>
              </div>;
  })}
        </div>}

      {
    /* In-App Cancellation Confirmation Modal (No window.confirm!) */
  }
      {cancelModalOrder && <Modal
    isOpen={!!cancelModalOrder}
    onClose={() => !isCancelling && setCancelModalOrder(null)}
    title={`Cancel Order #${cancelModalOrder.orderNumber}`}
    maxWidth="md"
  >
          <div className="space-y-5 text-xs text-stone-700">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <p className="font-semibold text-rose-900 text-sm">
                Are you sure you want to cancel this order?
              </p>
              <p className="text-rose-700 text-xs">
                Total Amount: <strong>{formatINR(cancelModalOrder.totalAmount)}</strong> ({cancelModalOrder.paymentMethod})
              </p>
              <p className="text-[11px] text-rose-600">
                The handloom saree inventory reserved for this order will be released back into the catalog immediately.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Reason for Cancellation
              </label>
              <select
    value={cancelReason}
    onChange={(e) => setCancelReason(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#881930] focus:outline-none"
  >
                <option value="Change of plan / Found another saree design">
                  Change of plan / Found another saree design
                </option>
                <option value="Ordered by mistake / Duplicate order">
                  Ordered by mistake / Duplicate order
                </option>
                <option value="Incorrect shipping address or pin code">
                  Incorrect shipping address or pin code
                </option>
                <option value="Need delivery earlier than estimated date">
                  Need delivery earlier than estimated date
                </option>
                <option value="Price or payment method preference change">
                  Price or payment method preference change
                </option>
                <option value="Other">Other / Custom feedback</option>
              </select>
            </div>

            {cancelReason === "Other" && <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Please specify reason
                </label>
                <textarea
    rows={2}
    value={customReason}
    onChange={(e) => setCustomReason(e.target.value)}
    placeholder="Tell us why you wish to cancel..."
    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-[#881930] focus:outline-none"
  />
              </div>}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <Button
    type="button"
    variant="outline"
    size="sm"
    disabled={isCancelling}
    onClick={() => setCancelModalOrder(null)}
  >
                Keep Order
              </Button>
              <Button
    type="button"
    size="sm"
    disabled={isCancelling}
    onClick={handleConfirmCancel}
    className="bg-rose-700 hover:bg-rose-800 text-white font-medium"
  >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </div>
        </Modal>}
    </div>;
};
export default MyOrders;
