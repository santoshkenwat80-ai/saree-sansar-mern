import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, PackageCheck, Printer, ArrowRight, ShieldCheck } from "lucide-react";
import { orderService } from "../../services/orderService";
import { formatINR, formatDate } from "../../utils/currency";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
export const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    orderService.getOrderById(orderId).then((res) => {
      setOrder(res);
      setLoading(false);
    });
  }, [orderId]);
  if (loading) return <Loader message="Verifying order receipt..." />;
  const isCod = status === "cod" || order?.paymentMethod === "COD";
  return <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-md p-6 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817]">
            {isCod ? "Order Placed (Cash on Delivery)" : "Payment Verified & Confirmed"}
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mt-1">
            Thank You for Patronizing Saree Sansar!
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            Your heirloom weaves are now being prepared by our master weavers with silk mark authentication.
          </p>
        </div>

        {order && <div className="bg-stone-50 rounded-xl p-6 text-left border border-stone-200 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-stone-200 pb-4">
              <div>
                <span className="text-stone-400 block">Order Number</span>
                <span className="font-mono font-bold text-stone-900">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Date</span>
                <span className="font-semibold text-stone-900">{formatDate(order.createdAt)}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Total Paid</span>
                <span className="font-mono font-bold text-[#6b1426]">{formatINR(order.totalAmount)}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Payment Method</span>
                <span className="font-semibold text-stone-900">{order.paymentMethod}</span>
              </div>
            </div>

            {
    /* Delivery Details */
  }
            <div className="text-xs text-stone-600 space-y-1">
              <span className="font-semibold text-stone-900 block">Delivery Address:</span>
              <p>
                {order.shippingAddress.fullName} · {order.shippingAddress.phone}
              </p>
              <p>
                {order.shippingAddress.addressLine}, {order.shippingAddress.locality}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
              </p>
              {order.estimatedDelivery && <p className="text-emerald-700 font-medium pt-1">
                  Estimated Delivery: {order.estimatedDelivery}
                </p>}
            </div>

            {
    /* Items */
  }
            <div className="border-t border-stone-200 pt-3 space-y-2">
              <span className="text-xs font-semibold text-stone-900 block">Items in this Parcel:</span>
              {order.items.map((item) => <div key={item.id} className="flex justify-between items-center text-xs">
                  <span className="text-stone-700">
                    {item.product.name} × <strong className="font-mono">{item.quantity}</strong>
                  </span>
                  <span className="font-mono font-medium text-stone-900">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>)}
            </div>
          </div>}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
    onClick={() => window.print()}
    variant="outline"
    size="md"
    className="w-full sm:w-auto"
  >
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>

          {order && <Button
    onClick={() => navigate(`/order-tracking/${order.id}`)}
    size="md"
    className="w-full sm:w-auto"
  >
              <PackageCheck className="w-4 h-4 mr-2" />
              Track Package
            </Button>}

          <Button
    onClick={() => navigate("/products")}
    variant="secondary"
    size="md"
    className="w-full sm:w-auto"
  >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Confirmation email &amp; SMS tracking dispatch notifications sent</span>
        </div>
      </div>
    </div>;
};
