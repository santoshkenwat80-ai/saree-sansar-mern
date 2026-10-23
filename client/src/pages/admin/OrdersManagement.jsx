import { useState, useEffect } from "react";
import { Search, Eye, Filter } from "lucide-react";
import { orderService } from "../../services/orderService";
import { formatINR, formatDate } from "../../utils/currency";
import { Modal } from "../../components/common/Modal";
import { Loader } from "../../components/common/Loader";
import toast from "react-hot-toast";
export const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const loadOrders = () => {
    setLoading(true);
    orderService.getAllOrders().then(setOrders).finally(() => setLoading(false));
  };
  useEffect(() => {
    loadOrders();
  }, []);
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o.id === orderId ? updated : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };
  const filtered = orders.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.userName.toLowerCase().includes(search.toLowerCase()) || o.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Fulfillment &amp; Order Pipeline
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Process patron orders, track Razorpay verification, and update logistics statuses
          </p>
        </div>
      </div>

      {
    /* Filter and Search */
  }
      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
    type="text"
    placeholder="Search order ID, patron name, or email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <label htmlFor="order-status-filter" className="text-xs text-stone-500 font-medium">Status Filter:</label>
          <select
    id="order-status-filter"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="text-xs border border-stone-300 rounded-md px-3 py-2 bg-white focus:outline-none"
  >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {
    /* Orders Table */
  }
      {loading ? <Loader message="Loading orders..." /> : <div className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Patron Details</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 font-semibold">Current Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Total (INR)</th>
                  <th className="px-5 py-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((order) => <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-stone-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-900">{order.userName}</p>
                      <p className="text-[10px] text-stone-400">{order.userEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-stone-900 block">{order.paymentMethod}</span>
                      <span
    className={`text-[10px] font-bold ${order.paymentStatus === "PAID" ? "text-emerald-700" : "text-amber-700"}`}
  >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
    aria-label="Order Status"
    value={order.orderStatus}
    onChange={(e) => handleStatusChange(order.id, e.target.value)}
    className="text-[11px] font-semibold border border-stone-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#881930] cursor-pointer"
  >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-[#6b1426]">
                      {formatINR(order.totalAmount)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
    onClick={() => setSelectedOrder(order)}
    className="p-1.5 text-stone-600 hover:text-[#6b1426] hover:bg-stone-100 rounded transition-colors inline-flex items-center gap-1"
    title="View details"
  >
                        <Eye className="w-4 h-4" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}

      {
    /* Inspect Order Modal */
  }
      {selectedOrder && <Modal
    isOpen={!!selectedOrder}
    onClose={() => setSelectedOrder(null)}
    title={`Order Details: ${selectedOrder.orderNumber}`}
    maxWidth="lg"
  >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-3 bg-stone-50 rounded-lg">
              <div>
                <p className="text-stone-400">Patron Name</p>
                <p className="font-semibold text-stone-900">{selectedOrder.userName}</p>
                <p className="text-stone-500">{selectedOrder.userEmail}</p>
              </div>
              <div>
                <p className="text-stone-400">Payment Summary</p>
                <p className="font-semibold text-stone-900">
                  {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </p>
                {selectedOrder.razorpayPaymentId && <p className="font-mono text-[10px] text-stone-500">
                    ID: {selectedOrder.razorpayPaymentId}
                  </p>}
              </div>
            </div>

            {
    /* Delivery address */
  }
            <div className="p-3 border rounded-lg">
              <p className="font-semibold text-stone-900 mb-1">Destination Address:</p>
              <p className="text-stone-600">
                {selectedOrder.shippingAddress.addressLine}, {selectedOrder.shippingAddress.locality}
              </p>
              <p className="text-stone-600">
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} —{" "}
                {selectedOrder.shippingAddress.pincode}
              </p>
              <p className="text-stone-500 font-mono mt-0.5">
                Phone: {selectedOrder.shippingAddress.phone}
              </p>
            </div>

            {
    /* Item list */
  }
            <div>
              <p className="font-semibold text-stone-900 mb-2">Ordered Sarees:</p>
              <div className="divide-y divide-stone-100 max-h-40 overflow-y-auto">
                {selectedOrder.items.map((item) => <div key={item.id} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-stone-900">{item.product.name}</p>
                      <p className="text-stone-400 text-[11px]">
                        Qty: {item.quantity} · {item.product.fabric}
                      </p>
                    </div>
                    <p className="font-mono font-semibold text-stone-900">
                      {formatINR(item.product.price * item.quantity)}
                    </p>
                  </div>)}
              </div>
            </div>

            {
    /* Total math */
  }
            <div className="pt-2 border-t flex justify-between items-baseline font-bold text-sm">
              <span>Total Payable</span>
              <span className="font-mono text-[#6b1426]">
                {formatINR(selectedOrder.totalAmount)}
              </span>
            </div>
          </div>
        </Modal>}
    </div>;
};
