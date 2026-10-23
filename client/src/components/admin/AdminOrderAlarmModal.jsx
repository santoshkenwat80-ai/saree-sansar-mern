import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BellRing, VolumeX, ArrowRight, ShoppingBag, User, Phone, MapPin } from "lucide-react";
import { formatINR } from "../../utils/currency";
import { startOrderAlertAlarm, stopOrderAlertAlarm } from "../../utils/audioAlarm";
export const AdminOrderAlarmModal = ({ order, onClose }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (order) {
      startOrderAlertAlarm();
    }
    return () => {
      stopOrderAlertAlarm();
    };
  }, [order]);
  if (!order) return null;
  const handleDismiss = () => {
    stopOrderAlertAlarm();
    onClose();
  };
  const handleViewOrder = () => {
    stopOrderAlertAlarm();
    onClose();
    navigate("/admin/orders");
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border-4 border-rose-600 overflow-hidden ring-4 ring-rose-500/30 animate-in zoom-in-95 duration-300">
        {
    /* Pulsing Emergency Alarm Header */
  }
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-rose-700 flex items-center justify-center animate-bounce shadow-lg">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-bold text-base uppercase tracking-wider text-white">
                  नया ऑर्डर अलर्ट!
                </h3>
              </div>
              <p className="text-xs text-rose-100">
                New Order Received (अलार्म सक्रिय है)
              </p>
            </div>
          </div>

          <button
    type="button"
    onClick={handleDismiss}
    className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
    title="अलार्म बंद करें"
  >
            <VolumeX className="w-5 h-5" />
          </button>
        </div>

        {
    /* Order Details Body */
  }
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                ऑर्डर नंबर (Order ID)
              </span>
              <span className="font-mono text-base font-bold text-stone-900">
                {order.orderNumber || order.id}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                कुल राशि (Total Amount)
              </span>
              <span className="font-mono text-lg font-black text-emerald-700">
                {formatINR(order.totalAmount)}
              </span>
            </div>
          </div>

          {
    /* Customer & Payment Info */
  }
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                <User className="w-4 h-4 text-[#881930]" />
                <span>{order.userName || order.shippingAddress?.fullName || "Customer"}</span>
              </div>
              <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                {order.paymentMethod}
              </span>
            </div>

            {order.shippingAddress?.phone && <div className="flex items-center gap-1.5 text-stone-600 font-mono">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>+91 {order.shippingAddress.phone}</span>
              </div>}

            {order.shippingAddress && <div className="flex items-start gap-1.5 text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span className="truncate">
                  {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.pincode})
                </span>
              </div>}
          </div>

          {
    /* Items Summary */
  }
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
              साड़ी विवरण ({order.items?.length || 0} आइटम्स):
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto divide-y divide-stone-100 pr-1 text-xs">
              {order.items?.map((item, idx) => <div key={idx} className="pt-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <ShoppingBag className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-medium text-stone-800 truncate">
                      {item.product?.name || "Handloom Silk Saree"}
                    </span>
                    <span className="text-stone-400 text-[10px]">x{item.quantity}</span>
                  </div>
                  <span className="font-mono font-semibold text-stone-700 shrink-0 ml-2">
                    {formatINR((item.product?.price || 0) * (item.quantity || 1))}
                  </span>
                </div>)}
            </div>
          </div>

          {
    /* Action Buttons */
  }
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
    type="button"
    onClick={handleDismiss}
    className="flex-1 py-3 px-4 rounded-xl border-2 border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
  >
              <VolumeX className="w-4 h-4 text-stone-500" />
              <span>🔕 अलार्म बंद करें (Silence)</span>
            </button>

            <button
    type="button"
    onClick={handleViewOrder}
    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
  >
              <span>ऑर्डर देखें (View Order)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>;
};
