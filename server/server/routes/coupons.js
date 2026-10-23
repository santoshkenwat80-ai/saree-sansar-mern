import { Router } from "express";
import { db } from '../db.js';
const router = Router();
router.get("/", (_req, res) => {
  res.json(db.coupons);
});
router.post("/validate", (req, res) => {
  const { code, cartTotal } = req.body;
  if (!code) {
    return res.status(400).json({ isValid: false, message: "Coupon code is required" });
  }
  const coupon = db.coupons.find(
    (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
  );
  if (!coupon) {
    return res.json({ isValid: false, discount: 0, message: "Invalid or expired coupon" });
  }
  const total = Number(cartTotal) || 0;
  if (total < coupon.minOrderValue) {
    return res.json({
      isValid: false,
      discount: 0,
      message: `Minimum order value for ${coupon.code} is \u20B9${coupon.minOrderValue.toLocaleString("en-IN")}`
    });
  }
  let discount = 0;
  if (coupon.discountPercent) {
    discount = Math.round(total * coupon.discountPercent / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.discountAmount) {
    discount = coupon.discountAmount;
  }
  res.json({
    isValid: true,
    discount,
    message: `Coupon ${coupon.code} applied successfully!`,
    coupon
  });
});
router.post("/", (req, res) => {
  const { code, description, discountPercent, discountAmount, minOrderValue, maxDiscount, expiryDate } = req.body;
  if (!code) return res.status(400).json({ error: "Code is required" });
  const newCoupon = {
    id: `c-${Date.now()}`,
    code: code.toUpperCase().trim(),
    description: description || "Special offer",
    discountPercent: Number(discountPercent) || 10,
    discountAmount: Number(discountAmount) || void 0,
    minOrderValue: Number(minOrderValue) || 2e3,
    maxDiscount: Number(maxDiscount) || 1e3,
    expiryDate: expiryDate || "2026-12-31",
    isActive: true
  };
  db.coupons.push(newCoupon);
  db.save();
  res.status(201).json(newCoupon);
});
router.patch("/:id/toggle", (req, res) => {
  const { id } = req.params;
  const item = db.coupons.find((c) => c.id === id);
  if (!item) return res.status(404).json({ error: "Coupon not found" });
  item.isActive = !item.isActive;
  db.save();
  res.json(item);
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.coupons = db.coupons.filter((c) => c.id !== id);
  db.save();
  res.json({ success: true, message: "Coupon deleted" });
});
export default router;
