import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Ban,
  Copy,
  AlertTriangle
} from "lucide-react";
import { orderService } from "../../services/orderService";
import { formatINR, formatDate } from "../../utils/currency";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import toast from "react-hot-toast";
export const OrderTracking = ({
  order,
  onOrderUpdated,
  showCancelButton = true
}) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Change of plan / Found another saree design");
  const [isCancelling, setIsCancelling] = useState(false);
  const steps = [
    { key: "PLACED", title: "Order Placed", desc: "Received & payment verified" },
    { key: "CONFIRMED", title: "Confirmed", desc: "Master loom inventory reserved" },
    { key: "PACKED", title: "Packed", desc: "Silk Mark inspection & gift boxed" },
    { key: "SHIPPED", title: "Shipped", desc: "Dispatched with express courier" },
    { key: "OUT_FOR_DELIVERY", title: "Out for Delivery", desc: "Delivery agent en route" },
    { key: "DELIVERED", title: "Delivered", desc: "Safely arrived at destination" }
  ];
  const isCancelled = order.orderStatus === "CANCELLED";
  const getStepStatus = (stepKey, index) => {
    if (isCancelled) return "cancelled";
    const orderStatusOrder = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
    const currentIdx = orderStatusOrder.indexOf(order.orderStatus);
    if (index < currentIdx) return "completed";
    if (index === currentIdx) return "current";
    return "upcoming";
  };
  const handleCopyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      toast.success("Tracking ID copied to clipboard");
    }
  };
  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    setIsCancelling(true);
    try {
      const orderIdentifier = order.id || order.orderNumber;
      const updated = await orderService.cancelOrder(orderIdentifier, cancelReason);
      toast.success("Order cancelled successfully. Saree stock has been replenished.");
      setIsCancelModalOpen(false);
      if (onOrderUpdated) {
        onOrderUpdated(updated);
      }
    } catch (err) {
      toast.error(err.message || "Could not cancel order");
    } finally {
      setIsCancelling(false);
    }
  };
  const canCancel = showCancelButton && !isCancelled && (order.orderStatus === "PLACED" || order.orderStatus === "CONFIRMED" || order.orderStatus === "PACKED");
  return <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden space-y-6 p-5 sm:p-7">
      {
    /* Order Status & Key Identifiers Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a07817]">
              Live Order Tracker
            </span>
            <span
    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isCancelled ? "bg-rose-100 text-rose-800" : order.orderStatus === "DELIVERED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}
  >
              {order.orderStatus.replace(/_/g, " ")}
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            Order #{order.orderNumber}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Booked on {formatDate(order.createdAt)} · Payment:{" "}
            <strong className="text-stone-800">{order.paymentMethod}</strong> (
            <span className={order.paymentStatus === "PAID" ? "text-emerald-700 font-semibold" : "text-amber-700"}>
              {order.paymentStatus}
            </span>
            )
          </p>
        </div>

        {
    /* Cancel Button Header Trigger */
  }
        {canCancel && <Button
    onClick={() => setIsCancelModalOpen(true)}
    variant="outline"
    size="sm"
    className="text-rose-700 border-rose-300 hover:bg-rose-50 self-start sm:self-auto cursor-pointer"
  >
            <Ban className="w-3.5 h-3.5 mr-1" />
            <span>Cancel Order</span>
          </Button>}
      </div>

      {
    /* Red Banner if Cancelled */
  }
      {isCancelled && <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3 text-rose-900 text-xs">
          <Ban className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">This Order Has Been Cancelled</h4>
            <p className="mt-0.5 text-rose-700">
              Reason: {order.cancelReason || "Cancelled by customer request."}
            </p>
            <p className="mt-1 text-[11px] text-rose-600">
              Inventory stock has been returned to the loom catalogue. If payment was collected online, refund will be processed within 5-7 working days.
            </p>
          </div>
        </div>}

      {
    /* Real-Time Stepper Progress Timeline */
  }
      {!isCancelled ? <div className="py-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-6 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#881930]" />
            <span>Real-Time Shipment Progress</span>
          </h4>

          {
    /* Stepper Bar Desktop */
  }
          <div className="hidden sm:grid grid-cols-6 gap-2 relative">
            {steps.map((step, idx) => {
    const status = getStepStatus(step.key, idx);
    return <div key={step.key} className="text-center relative flex flex-col items-center">
                  {
      /* Step Connector Line */
    }
                  {idx < steps.length - 1 && <div
      className={`absolute top-4 left-1/2 w-full h-1 -z-0 ${status === "completed" ? "bg-emerald-600" : "bg-stone-200"}`}
    />}

                  {
      /* Icon Circle */
    }
                  <div
      className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all ${status === "completed" ? "bg-emerald-600 text-white shadow-xs" : status === "current" ? "bg-[#881930] text-white ring-4 ring-[#881930]/20 animate-pulse" : "bg-stone-100 text-stone-400 border border-stone-300"}`}
    >
                    {status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : status === "current" ? <Clock className="w-4 h-4" /> : <span className="text-xs font-mono font-semibold">{idx + 1}</span>}
                  </div>

                  <p
      className={`font-semibold text-xs mt-2.5 ${status === "current" ? "text-[#881930] font-bold" : status === "completed" ? "text-stone-900" : "text-stone-400"}`}
    >
                    {step.title}
                  </p>
                  <span className="text-[10px] text-stone-400 mt-0.5 leading-tight">
                    {step.desc}
                  </span>
                </div>;
  })}
          </div>

          {
    /* Vertical Stepper Mobile */
  }
          <div className="sm:hidden space-y-4 border-l-2 border-stone-200 ml-4 pl-4">
            {steps.map((step, idx) => {
    const status = getStepStatus(step.key, idx);
    return <div key={step.key} className="relative">
                  <div
      className={`absolute -left-[25px] top-0.5 w-4 h-4 rounded-full border-2 bg-white ${status === "completed" ? "border-emerald-600 bg-emerald-600" : status === "current" ? "border-[#881930] bg-[#881930] ring-4 ring-[#881930]/20" : "border-stone-300"}`}
    />
                  <p
      className={`text-xs font-semibold ${status === "current" ? "text-[#881930] font-bold" : status === "completed" ? "text-stone-900" : "text-stone-400"}`}
    >
                    {step.title}
                  </p>
                  <span className="text-[11px] text-stone-500 block">{step.desc}</span>
                </div>;
  })}
          </div>
        </div> : null}

      {
    /* Logistics & Courier Details Strip */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
        {
    /* Courier Info */
  }
        <div className="bg-[#FCF9F5] p-4 rounded-xl border border-[#d4af37]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Truck className="w-3.5 h-3.5 text-[#881930]" />
              Courier &amp; Delivery Logistics
            </span>
            <span className="text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded text-[10px]">
              Silk Mark Verified
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-stone-900 font-semibold">
              Courier Partner:{" "}
              <span className="text-[#6b1426] font-bold">
                {order.courierPartner || "BlueDart Express Handloom Wing"}
              </span>
            </p>
            {order.trackingNumber && <div className="flex items-center gap-2">
                <p className="text-stone-600 font-mono">AWB: {order.trackingNumber}</p>
                <button
    type="button"
    onClick={handleCopyTracking}
    className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
    title="Copy Tracking ID"
  >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>}
            {order.estimatedDelivery && <p className="text-emerald-700 font-semibold pt-1">
                Estimated Doorstep Delivery: {order.estimatedDelivery}
              </p>}
          </div>
        </div>

        {
    /* Shipping Address */
  }
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-1">
          <span className="font-semibold text-stone-700 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-[#881930]" />
            Delivery Destination
          </span>
          <p className="font-bold text-stone-900">
            {order.shippingAddress?.fullName || order.userName}
          </p>
          <p className="text-stone-600 leading-relaxed text-[11px]">
            {order.shippingAddress?.addressLine || "Connaught Place"}
            {order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ""}
            {order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ""} -{" "}
            <strong className="font-mono">{order.shippingAddress?.pincode || "110001"}</strong>
          </p>
          <p className="text-stone-500 font-mono text-[11px]">
            Contact: {order.shippingAddress?.phone || order.userEmail}
          </p>
        </div>
      </div>

      {
    /* Order Item Thumbnails */
  }
      <div className="pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
          Ordered Saree Creations:
        </h4>
        <div className="space-y-3">
          {order.items.map((item, idx) => {
    const product = item.product || {};
    const img = product.images && product.images[0] || "/src/assets/images/hero_banarasi_bridal_1791698980254.jpg";
    return <div
      key={item.id || idx}
      className="flex items-center justify-between p-3 bg-stone-50/60 rounded-xl border border-stone-200/70"
    >
                <div className="flex items-center gap-3">
                  <img
      src={img}
      alt={product.name || "Handloom Saree"}
      className="w-12 h-14 object-cover object-top rounded-lg border border-stone-200"
    />
                  <div>
                    <h5 className="font-serif font-bold text-stone-900 text-xs sm:text-sm">
                      {product.name || "Pure Silk Saree"}
                    </h5>
                    <p className="text-[11px] text-stone-500">
                      {product.fabric || "Pure Mulberry Silk"} · Qty:{" "}
                      <strong className="font-mono font-bold text-stone-800">{item.quantity}</strong>
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">
                  {formatINR((product.price || 0) * (item.quantity || 1))}
                </span>
              </div>;
  })}
        </div>
      </div>

      {
    /* Cancellation Modal */
  }
      <Modal
    isOpen={isCancelModalOpen}
    onClose={() => setIsCancelModalOpen(false)}
    title="Cancel Saree Order"
    maxWidth="md"
  >
        <form onSubmit={handleCancelSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Are you sure you want to cancel Order <strong>#{order.orderNumber}</strong>? The reserved handloom sarees will be released back into public inventory.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Please Select Cancellation Reason *
            </label>
            <select
    value={cancelReason}
    onChange={(e) => setCancelReason(e.target.value)}
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881930] bg-white"
  >
              <option value="Change of plan / Found another saree design">
                Change of plan / Found another saree design
              </option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Need delivery earlier than estimated date">
                Need delivery earlier than estimated date
              </option>
              <option value="Incorrect delivery address entered">
                Incorrect delivery address entered
              </option>
              <option value="Other reasons">Other reasons</option>
            </select>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => setIsCancelModalOpen(false)}
  >
              Keep Order
            </Button>
            <Button
    type="submit"
    variant="primary"
    size="sm"
    disabled={isCancelling}
    className="bg-rose-700 hover:bg-rose-800 text-white"
  >
              {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
};
export default OrderTracking;
