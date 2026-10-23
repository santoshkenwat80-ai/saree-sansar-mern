import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatINR } from "../../utils/currency";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
export const Cart = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discount,
    shippingFee,
    tax,
    totalAmount,
    totalItemsCount
  } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const navigate = useNavigate();
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponCode.trim());
    setIsApplyingCoupon(false);
  };
  const freeShippingThreshold = 2e3;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  if (items.length === 0) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
      title="Your Shopping Bag is Empty"
      description="You haven't added any handloom sarees to your bag yet. Explore our curated collections from Varanasi and Kanchipuram."
      actionText="Discover Collections"
      onAction={() => navigate("/products")}
    />
      </div>;
  }
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mb-8">
        Shopping Bag ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
      </h1>

      {
    /* Free Shipping Tracker */
  }
      {amountNeededForFreeShipping > 0 ? <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-center justify-between text-xs text-amber-900">
          <span>Add <strong>{formatINR(amountNeededForFreeShipping)}</strong> more to unlock <strong>Free Express Shipping</strong>!</span>
          <Link to="/products" className="font-semibold underline ml-2">Continue Shopping</Link>
        </div> : <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-8 flex items-center gap-2 text-xs text-emerald-800 font-medium">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Congratulations! You qualify for complimentary insured shipping across India.</span>
        </div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {
    /* Items List */
  }
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
          {items.map((item) => <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5">
              <Link to={`/products/${item.product.slug}`} className="shrink-0">
                <img
    src={item.product.images[0]}
    alt={item.product.name}
    className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-md bg-stone-100 border border-stone-200"
    referrerPolicy="no-referrer"
  />
              </Link>

              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[11px] font-semibold text-[#a07817] uppercase tracking-wider">
                        {item.product.fabric}
                      </span>
                      <Link
    to={`/products/${item.product.slug}`}
    className="block font-medium text-stone-900 text-sm sm:text-base hover:text-[#6b1426] transition-colors mt-0.5"
  >
                        {item.product.name}
                      </Link>
                    </div>
                    <button
    onClick={() => removeFromCart(item.id)}
    className="text-stone-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
    title="Remove Saree"
  >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-500 mt-1">
                    Color: {item.product.color} · SKU: {item.product.sku}
                  </p>
                  <p className="text-xs text-stone-600 mt-1">
                    Blouse: {item.selectedBlouseOption || "Unstitched Fabric (Included)"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  {
    /* Quantity Stepper */
  }
                  <div className="flex items-center border border-stone-300 rounded-md">
                    <button
    onClick={() => updateQuantity(item.id, item.quantity - 1)}
    disabled={item.quantity <= 1}
    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
  >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 text-xs font-mono font-semibold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
    onClick={() => updateQuantity(item.id, item.quantity + 1)}
    disabled={item.quantity >= item.product.stock}
    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
  >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {
    /* Price */
  }
                  <div className="text-right">
                    <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                    {item.quantity > 1 && <span className="block text-[11px] text-stone-400 font-mono">
                        ({formatINR(item.product.price)} each)
                      </span>}
                  </div>
                </div>
              </div>
            </div>)}
        </div>

        {
    /* Order Summary Sidebar */
  }
        <div className="lg:col-span-4 space-y-6">
          {
    /* Coupon Input Box */
  }
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-serif font-semibold text-sm text-stone-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#881930]" />
              Have a Royal Coupon?
            </h3>

            {appliedCoupon ? <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-800 font-mono">
                    {appliedCoupon.code} Applied
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    You saved {formatINR(discount)}
                  </p>
                </div>
                <button
    onClick={removeCoupon}
    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
  >
                  Remove
                </button>
              </div> : <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
    type="text"
    placeholder="Enter code (e.g. ROYAL15)"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-md uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
                <Button
    type="submit"
    variant="secondary"
    size="sm"
    isLoading={isApplyingCoupon}
  >
                  Apply
                </Button>
              </form>}
          </div>

          {
    /* Pricing Math */
  }
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif font-semibold text-base text-stone-900 border-b pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono tabular-nums text-stone-900 font-medium">
                  {formatINR(subtotal)}
                </span>
              </div>

              {discount > 0 && <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span className="font-mono tabular-nums">-{formatINR(discount)}</span>
                </div>}

              <div className="flex justify-between">
                <span>Insured Express Shipping</span>
                <span className="font-mono tabular-nums">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-semibold uppercase">Free</span> : formatINR(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Taxes (GST 5%)</span>
                <span className="font-mono tabular-nums text-stone-900">
                  {formatINR(tax)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-stone-900">Total Payable</span>
                <span className="block text-[10px] text-stone-400">All taxes included</span>
              </div>
              <span className="font-serif text-2xl font-bold text-[#6b1426] font-mono tabular-nums">
                {formatINR(totalAmount)}
              </span>
            </div>

            <Button
    onClick={() => navigate("/checkout")}
    size="lg"
    className="w-full mt-4"
  >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="pt-3 flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Razorpay 256-bit Bank Grade Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
