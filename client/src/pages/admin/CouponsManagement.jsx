import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { couponService } from "../../services/couponService";
import { formatINR } from "../../utils/currency";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { Loader } from "../../components/common/Loader";
import toast from "react-hot-toast";
export const CouponsManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountPercent: 15,
    minOrderValue: 4999,
    maxDiscount: 1500,
    expiryDate: "2026-12-31"
  });
  const loadCoupons = () => {
    setLoading(true);
    couponService.getCoupons().then(setCoupons).finally(() => setLoading(false));
  };
  useEffect(() => {
    loadCoupons();
  }, []);
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    await couponService.addCoupon(form);
    toast.success(`Coupon ${form.code.toUpperCase()} created`);
    setIsModalOpen(false);
    setForm({
      code: "",
      description: "",
      discountPercent: 15,
      minOrderValue: 4999,
      maxDiscount: 1500,
      expiryDate: "2026-12-31"
    });
    loadCoupons();
  };
  const handleToggle = async (id) => {
    await couponService.toggleCouponStatus(id);
    toast.success("Coupon status updated");
    loadCoupons();
  };
  const handleDelete = async (id, code) => {
    if (window.confirm(`Delete coupon code ${code}?`)) {
      await couponService.deleteCoupon(id);
      toast.success("Coupon deleted");
      loadCoupons();
    }
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Promotions &amp; Coupons
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure discount codes, minimum basket thresholds, and festive campaign rules
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Coupon
        </Button>
      </div>

      {loading ? <Loader message="Loading coupons..." /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => <div
    key={c.id}
    className={`p-5 rounded-xl border-2 space-y-3 bg-white shadow-xs transition-all ${c.isActive ? "border-stone-200" : "border-stone-200 opacity-60 bg-stone-50"}`}
  >
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-[#6b1426] tracking-wider bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                  {c.code}
                </span>
                <button
    onClick={() => handleToggle(c.id)}
    className="cursor-pointer"
    title={c.isActive ? "Deactivate" : "Activate"}
  >
                  {c.isActive ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span> : <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      <XCircle className="w-3.5 h-3.5" />
                      Inactive
                    </span>}
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{c.description}</p>

              <div className="text-xs space-y-1 pt-2 border-t text-stone-500">
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span className="font-bold text-stone-900 font-mono">
                    {c.discountPercent ? `${c.discountPercent}% OFF` : formatINR(c.discountAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Min Basket Value:</span>
                  <span className="font-mono text-stone-700">{formatINR(c.minOrderValue)}</span>
                </div>
                {c.maxDiscount && <div className="flex justify-between">
                    <span>Max Cap:</span>
                    <span className="font-mono text-stone-700">{formatINR(c.maxDiscount)}</span>
                  </div>}
                <div className="flex justify-between">
                  <span>Valid Until:</span>
                  <span className="font-mono text-stone-700">{c.expiryDate}</span>
                </div>
              </div>

              <div className="pt-2 border-t flex justify-end">
                <button
    onClick={() => handleDelete(c.id, c.code)}
    className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
  >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>)}
        </div>}

      {
    /* Create Modal */
  }
      <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    title="Create Promotional Coupon"
    maxWidth="md"
  >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <Input
    label="Coupon Code"
    required
    placeholder="e.g. DIWALI20"
    value={form.code}
    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
  />

          <Input
    label="Offer Description"
    required
    placeholder="e.g. Flat 15% discount on all silk weaves"
    value={form.description}
    onChange={(e) => setForm({ ...form, description: e.target.value })}
  />

          <div className="grid grid-cols-2 gap-4">
            <Input
    label="Discount Percentage (%)"
    type="number"
    value={form.discountPercent}
    onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
  />
            <Input
    label="Maximum Discount Cap (₹)"
    type="number"
    value={form.maxDiscount}
    onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
  />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
    label="Min Order Amount (₹)"
    type="number"
    value={form.minOrderValue}
    onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
  />
            <Input
    label="Expiry Date"
    type="date"
    value={form.expiryDate}
    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
  />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Activate Coupon</Button>
          </div>
        </form>
      </Modal>
    </div>;
};
