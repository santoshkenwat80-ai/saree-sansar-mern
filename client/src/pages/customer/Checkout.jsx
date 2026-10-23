import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  Plus,
  Check,
  ArrowRight,
  Pencil,
  Star,
  QrCode,
  Smartphone,
  Copy
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/orderService";
import { formatINR } from "../../utils/currency";
import { isValidIndianPhone, isValidIndianPincode } from "../../utils/validators";
import { Button } from "../../components/common/Button";
import { AddressModalWithOtp } from "../../components/common/AddressModalWithOtp";
import toast from "react-hot-toast";
export const Checkout = () => {
  const { items, subtotal, discount, appliedCoupon, shippingFee, tax, totalAmount, clearCart } = useCart();
  const { user, addAddress, updateAddress, setDefaultAddress } = useAuth();
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const defaultAddr = user?.addresses?.find((a) => a.isDefault);
    return defaultAddr ? defaultAddr.id : user?.addresses?.[0]?.id || "";
  });
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const exists = user.addresses.some((a) => a.id === selectedAddressId);
      if (!exists || !selectedAddressId) {
        const defaultAddr = user.addresses.find((a) => a.isDefault);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : user.addresses[0].id);
      }
    }
  }, [user?.addresses, selectedAddressId]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("sareesansar@okaxis");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addrForm, setAddrForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    pincode: "",
    state: "",
    city: "",
    locality: "",
    addressLine: "",
    type: "HOME",
    isDefault: true
  });
  const selectedAddress = user?.addresses?.find((a) => a.id === selectedAddressId);
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrForm({
      fullName: user?.name || "",
      phone: user?.phone || "",
      pincode: "",
      state: "",
      city: "",
      locality: "",
      addressLine: "",
      type: "HOME",
      isDefault: (user?.addresses || []).length === 0
    });
    setIsAddressModalOpen(true);
  };
  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddrForm({
      fullName: addr.fullName,
      phone: addr.phone,
      pincode: addr.pincode,
      state: addr.state,
      city: addr.city,
      locality: addr.locality || "",
      addressLine: addr.addressLine,
      type: addr.type,
      isDefault: addr.isDefault
    });
    setIsAddressModalOpen(true);
  };
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addrForm.fullName.trim() || !addrForm.addressLine.trim() || !addrForm.city.trim() || !addrForm.state.trim()) {
      toast.error("Please fill in all required address fields");
      return;
    }
    if (!isValidIndianPhone(addrForm.phone)) {
      toast.error("Please provide a valid 10-digit Indian phone number");
      return;
    }
    if (!isValidIndianPincode(addrForm.pincode)) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }
    if (editingAddressId) {
      await updateAddress(editingAddressId, addrForm);
      setSelectedAddressId(editingAddressId);
    } else {
      const saved = await addAddress(addrForm);
      if (saved && saved.id) {
        setSelectedAddressId(saved.id);
      }
    }
    setIsAddressModalOpen(false);
    setEditingAddressId(null);
  };
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select or add a delivery address");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions to proceed");
      return;
    }
    setIsSubmitting(true);
    try {
      if (paymentMethod === "UPI") {
        const order = await orderService.createUpiOrder({
          userId: user?.id,
          userName: selectedAddress.fullName,
          userEmail: user?.email,
          items,
          subtotal,
          discount,
          couponCode: appliedCoupon?.code,
          shippingFee,
          tax,
          totalAmount,
          paymentMethod: "UPI",
          shippingAddress: selectedAddress,
          upiId: upiId.trim() || "sareesansar@okaxis",
          upiTxnId: `UPI-TXN-${Date.now()}`
        });
        clearCart();
        toast.success("UPI \u092A\u0947\u092E\u0947\u0902\u091F \u0938\u092B\u0932! \u0906\u092A\u0915\u093E \u0936\u093E\u0939\u0940 \u0938\u093E\u0921\u093C\u0940 \u0911\u0930\u094D\u0921\u0930 \u0938\u092B\u0932\u0924\u093E\u092A\u0942\u0930\u094D\u0935\u0915 \u0926\u0930\u094D\u091C \u0915\u0930 \u0932\u093F\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964");
        navigate(`/payment-result?orderId=${order.id}&status=upi`);
      } else if (paymentMethod === "COD") {
        const order = await orderService.createCodOrder({
          userId: user?.id,
          userName: selectedAddress.fullName,
          userEmail: user?.email,
          items,
          subtotal,
          discount,
          couponCode: appliedCoupon?.code,
          shippingFee,
          tax,
          totalAmount,
          paymentMethod: "COD",
          shippingAddress: selectedAddress
        });
        clearCart();
        toast.success("Your order has been placed successfully via Cash on Delivery!");
        navigate(`/payment-result?orderId=${order.id}&status=cod`);
      } else {
        const rzpOrderData = await orderService.createRazorpayOrder(totalAmount);
        if (typeof window !== "undefined" && window.Razorpay) {
          const options = {
            key: rzpOrderData.keyId,
            amount: rzpOrderData.amount,
            currency: "INR",
            name: "Saree Sansar",
            description: `Payment for Order of ${items.length} Saree(s)`,
            order_id: rzpOrderData.razorpayOrderId,
            prefill: {
              name: selectedAddress.fullName,
              email: user?.email || "patron@sareesansar.com",
              contact: selectedAddress.phone
            },
            theme: {
              color: "#6b1426"
            },
            handler: async (response) => {
              try {
                const verifyRes = await orderService.verifyPayment({
                  razorpayOrderId: response.razorpay_order_id || rzpOrderData.razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                  razorpaySignature: response.razorpay_signature,
                  orderData: {
                    userId: user?.id,
                    userName: selectedAddress.fullName,
                    userEmail: user?.email,
                    items,
                    subtotal,
                    discount,
                    couponCode: appliedCoupon?.code,
                    shippingFee,
                    tax,
                    totalAmount,
                    paymentMethod: "RAZORPAY",
                    shippingAddress: selectedAddress
                  }
                });
                clearCart();
                toast.success("Payment verified! Your royal order is placed.");
                navigate(`/payment-result?orderId=${verifyRes.order.id}&status=success`);
              } catch (err) {
                console.error(err);
                toast.error("Payment verification failed on the server");
              }
            },
            modal: {
              ondismiss: () => {
                setIsSubmitting(false);
                toast.error("Payment was cancelled");
              }
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          const verifyRes = await orderService.verifyPayment({
            razorpayOrderId: rzpOrderData.razorpayOrderId,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            orderData: {
              userId: user?.id,
              userName: selectedAddress.fullName,
              userEmail: user?.email,
              items,
              subtotal,
              discount,
              couponCode: appliedCoupon?.code,
              shippingFee,
              tax,
              totalAmount,
              paymentMethod: "RAZORPAY",
              shippingAddress: selectedAddress
            }
          });
          clearCart();
          toast.success("Payment simulated successfully!");
          navigate(`/payment-result?orderId=${verifyRes.order.id}&status=success`);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create order. Please try again.");
      setIsSubmitting(false);
    }
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 mb-8">
        Secure Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {
    /* Left Column: Address + Payment */
  }
        <div className="lg:col-span-7 space-y-8">
          {
    /* Step 1: Delivery Address */
  }
          <section className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-serif font-semibold text-lg text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#881930]" />
                1. Select Delivery Address
              </h2>
              <Button
    onClick={handleOpenAddAddress}
    variant="outline"
    size="sm"
    className="text-xs"
  >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add New Address
              </Button>
            </div>

            {user?.addresses && user.addresses.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => {
    const isSelected = selectedAddressId === addr.id;
    return <div
      key={addr.id}
      onClick={() => setSelectedAddressId(addr.id)}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${isSelected ? "border-[#881930] bg-rose-50/20 shadow-xs ring-1 ring-[#881930]/30" : "border-stone-200 hover:border-stone-300 bg-white"}`}
    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                            {addr.type}
                          </span>
                          {addr.isDefault && <span className="text-[10px] font-bold text-[#881930] bg-[#881930]/10 px-2 py-0.5 rounded flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Default
                            </span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleOpenEditAddress(addr);
      }}
      className="text-xs text-stone-500 hover:text-[#881930] hover:bg-rose-50 p-1 rounded transition-colors flex items-center gap-0.5"
      title="Edit this address"
    >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          {isSelected && <span className="w-5 h-5 rounded-full bg-[#881930] text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </span>}
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-stone-900">{addr.fullName}</p>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {addr.addressLine}{addr.locality ? `, ${addr.locality}` : ""}
                      </p>
                      <p className="text-xs text-stone-600">
                        {addr.city}, {addr.state} — <span className="font-mono font-medium">{addr.pincode}</span>
                      </p>
                      <div className="mt-2 pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs gap-1.5">
                        <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-semibold text-[11px]">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>OTP Verified: +91 {addr.phone}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-500 font-medium">DB सुरक्षित</span>
                          {!addr.isDefault && <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setDefaultAddress(addr.id);
      }}
      className="text-[11px] text-[#881930] hover:underline font-semibold"
    >
                              Set as Default
                            </button>}
                        </div>
                      </div>
                    </div>;
  })}
              </div> : <div className="text-center py-8 bg-stone-50/80 rounded-xl border border-dashed border-stone-300 p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-[#881930] flex items-center justify-center mx-auto shadow-xs">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-stone-900">
                    कोई डिलीवरी पता नहीं मिला (No Delivery Address Saved)
                  </p>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    कृपया अपना डिलीवरी पता दर्ज करें। आपके मोबाइल नंबर पर OTP सत्यापन के बाद यह पता हमेशा के लिए Database में सुरक्षित रहेगा और आपका ऑर्डर आगे बढ़ेगा।
                  </p>
                </div>
                <Button onClick={handleOpenAddAddress} size="sm" className="px-5 shadow-xs">
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>पता दर्ज करें एवं OTP Verify करें</span>
                </Button>
              </div>}
          </section>

          {
    /* Step 2: Payment Method */
  }
          <section className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="font-serif font-semibold text-lg text-stone-900 flex items-center gap-2 border-b pb-3">
              <CreditCard className="w-5 h-5 text-[#881930]" />
              2. Select Payment Method
            </h2>

            <div className="space-y-3">
              {
    /* Option 1: Direct UPI (Google Pay, PhonePe, Paytm, BHIM) */
  }
              <div
    className={`rounded-xl border-2 transition-all overflow-hidden ${paymentMethod === "UPI" ? "border-[#881930] bg-rose-50/15 shadow-xs" : "border-stone-200 hover:border-stone-300"}`}
  >
                <label className="flex items-start gap-4 p-4 cursor-pointer">
                  <input
    type="radio"
    name="paymentMethod"
    value="UPI"
    checked={paymentMethod === "UPI"}
    onChange={() => setPaymentMethod("UPI")}
    className="mt-1 accent-[#881930]"
  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#881930]" />
                        <span className="text-sm font-bold text-stone-900">
                          UPI Instant Payment (GPay, PhonePe, Paytm, BHIM, QR)
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ⚡ Lowest Failure Rate
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Direct 1-click UPI authorization or scan QR code with any UPI app.
                    </p>
                  </div>
                </label>

                {
    /* Expanded UPI Details when UPI is selected */
  }
                {paymentMethod === "UPI" && <div className="px-4 pb-5 pt-1 border-t border-rose-100 bg-white/70 space-y-4">
                    {
    /* UPI App Selection Chips */
  }
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                        Select Your UPI App:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
    { id: "gpay", name: "Google Pay", handle: "@okhdfcbank" },
    { id: "phonepe", name: "PhonePe", handle: "@ybl" },
    { id: "paytm", name: "Paytm UPI", handle: "@paytm" },
    { id: "bhim", name: "BHIM UPI", handle: "@upi" }
  ].map((app) => <button
    key={app.id}
    type="button"
    onClick={() => {
      setSelectedUpiApp(app.id);
      setUpiId(`patron${app.handle}`);
    }}
    className={`p-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${selectedUpiApp === app.id ? "bg-[#881930] text-white border-[#881930] shadow-xs" : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"}`}
  >
                            <span>{app.name}</span>
                          </button>)}
                      </div>
                    </div>

                    {
    /* VPA / UPI ID Input & QR Code Box */
  }
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 block">
                          Enter your UPI ID / VPA:
                        </label>
                        <div className="flex gap-2">
                          <input
    type="text"
    value={upiId}
    onChange={(e) => setUpiId(e.target.value)}
    placeholder="username@bank"
    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
                          <button
    type="button"
    onClick={() => {
      setUpiId("sareesansar@okaxis");
      navigator.clipboard.writeText("sareesansar@okaxis");
      setCopiedUpi(true);
      toast.success("Merchant VPA copied!");
      setTimeout(() => setCopiedUpi(false), 2e3);
    }}
    className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg border border-stone-300 flex items-center gap-1 font-mono shrink-0 cursor-pointer"
    title="Copy merchant VPA"
  >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedUpi ? "Copied" : "Merchant VPA"}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          e.g. mobileNumber@upi, username@okhdfcbank, patron@ybl
                        </p>
                      </div>

                      {
    /* Instant QR Box */
  }
                      <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-center gap-3">
                        <div className="w-16 h-16 bg-white p-1 rounded-md border border-stone-300 flex items-center justify-center shrink-0 shadow-2xs">
                          {
    /* Stylized UPI QR Graphic */
  }
                          <div className="w-full h-full bg-stone-900 rounded-xs flex flex-col items-center justify-center text-white text-[8px] font-mono leading-none p-1 text-center">
                            <QrCode className="w-9 h-9 text-white" />
                          </div>
                        </div>
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-stone-900 block">Scan &amp; Pay via Any App</span>
                          <span className="text-[11px] text-stone-500 block">
                            Amount: <strong className="text-[#881930] font-mono">{formatINR(totalAmount)}</strong>
                          </span>
                          <span className="text-[10px] text-emerald-700 font-medium block">
                            ✓ Instant payment capture &amp; admin order notification
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>}
              </div>

              {
    /* Option 2: Razorpay Option */
  }
              <label
    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "RAZORPAY" ? "border-[#881930] bg-rose-50/20" : "border-stone-200 hover:border-stone-300"}`}
  >
                <input
    type="radio"
    name="paymentMethod"
    value="RAZORPAY"
    checked={paymentMethod === "RAZORPAY"}
    onChange={() => setPaymentMethod("RAZORPAY")}
    className="mt-1 accent-[#881930]"
  />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-stone-900">
                      Credit / Debit Card &amp; Netbanking (Razorpay Gateway)
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Visa, MasterCard, RuPay, Maestro &amp; Netbanking of 50+ Indian banks.
                  </p>
                </div>
              </label>

              {
    /* Option 3: Cash On Delivery Option */
  }
              <label
    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "COD" ? "border-[#881930] bg-rose-50/20" : "border-stone-200 hover:border-stone-300"}`}
  >
                <input
    type="radio"
    name="paymentMethod"
    value="COD"
    checked={paymentMethod === "COD"}
    onChange={() => setPaymentMethod("COD")}
    className="mt-1 accent-[#881930]"
  />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-stone-700" />
                    <span className="text-sm font-semibold text-stone-900">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Pay by cash or scan courier UPI QR code when parcel arrives.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {
    /* Terms checkbox */
  }
          <div className="flex items-start gap-2 pt-2">
            <input
    type="checkbox"
    id="terms"
    checked={termsAccepted}
    onChange={(e) => setTermsAccepted(e.target.checked)}
    className="mt-1 accent-[#881930] cursor-pointer"
  />
            <label htmlFor="terms" className="text-xs text-stone-600 leading-relaxed cursor-pointer">
              I agree to the <span className="underline">Terms of Service</span>, 7-day return policy, and confirm that all selected saree specifications are correct.
            </label>
          </div>
        </div>

        {
    /* Right Column: Order Review & Total Pay */
  }
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="font-serif font-semibold text-lg text-stone-900 border-b pb-3">
            Review Items ({items.length})
          </h2>

          <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
            {items.map((item) => <div key={item.id} className="py-3 flex gap-3 text-xs">
                <img
    src={item.product.images[0]}
    alt={item.product.name}
    className="w-14 h-18 object-cover rounded bg-stone-100 shrink-0 border border-stone-200"
  />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-stone-900 line-clamp-1">{item.product.name}</h4>
                    <p className="text-stone-500 mt-0.5">{item.product.fabric} · Qty: {item.quantity}</p>
                  </div>
                  <div className="font-mono tabular-nums font-semibold text-stone-900">
                    {formatINR(item.product.price * item.quantity)}
                  </div>
                </div>
              </div>)}
          </div>

          {
    /* Price Breakdown */
  }
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums font-medium text-stone-900">
                {formatINR(subtotal)}
              </span>
            </div>

            {discount > 0 && <div className="flex justify-between text-emerald-700 font-medium">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span className="font-mono tabular-nums">-{formatINR(discount)}</span>
              </div>}

            <div className="flex justify-between">
              <span>Insured Shipping</span>
              <span className="font-mono tabular-nums">
                {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(shippingFee)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST (5% Apparel)</span>
              <span className="font-mono tabular-nums text-stone-900">{formatINR(tax)}</span>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-stone-900">
              <span>Grand Total</span>
              <span className="font-serif text-2xl text-[#6b1426] font-mono tabular-nums">
                {formatINR(totalAmount)}
              </span>
            </div>
          </div>

          <Button
    onClick={handlePlaceOrder}
    size="lg"
    className="w-full"
    isLoading={isSubmitting}
    disabled={!selectedAddress || !termsAccepted}
  >
            <span>{paymentMethod === "COD" ? "Confirm COD Order" : "Pay via Razorpay"}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Payment Guarantee</span>
          </div>
        </div>
      </div>

      {
    /* Add / Edit Address with Mobile OTP Verification & Permanent DB Save */
  }
      <AddressModalWithOtp
    isOpen={isAddressModalOpen}
    onClose={() => {
      setIsAddressModalOpen(false);
      setEditingAddressId(null);
    }}
    onSuccess={(saved) => {
      setSelectedAddressId(saved.id);
      setIsAddressModalOpen(false);
      setEditingAddressId(null);
    }}
    initialAddress={editingAddressId ? user?.addresses?.find((a) => a.id === editingAddressId) : null}
    title={editingAddressId ? "\u0921\u093F\u0932\u0940\u0935\u0930\u0940 \u092A\u0924\u093E \u092C\u0926\u0932\u0947\u0902 (Edit Address)" : "\u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0921\u093F\u0932\u0940\u0935\u0930\u0940 \u092A\u0924\u093E \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (Delivery Address)"}
  />
    </div>;
};
