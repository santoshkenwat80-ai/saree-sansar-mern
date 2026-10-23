import apiClient from "./api";
import { INITIAL_COUPONS } from "./mockData";
const LOCAL_COUPONS_KEY = "saree_sansar_coupons_db";
const getStoredCoupons = () => {
  try {
    const data = localStorage.getItem(LOCAL_COUPONS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed reading coupons", e);
  }
  localStorage.setItem(LOCAL_COUPONS_KEY, JSON.stringify(INITIAL_COUPONS));
  return INITIAL_COUPONS;
};
const saveStoredCoupons = (coupons) => {
  localStorage.setItem(LOCAL_COUPONS_KEY, JSON.stringify(coupons));
};
export const couponService = {
  async getCoupons() {
    try {
      const res = await apiClient.get("/coupons");
      return res.data;
    } catch {
      return getStoredCoupons();
    }
  },
  async validateCoupon(code, cartTotal) {
    try {
      const res = await apiClient.post("/coupons/validate", { code, cartTotal });
      return res.data;
    } catch {
      const coupons = getStoredCoupons();
      const coupon = coupons.find(
        (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
      );
      if (!coupon) {
        return { isValid: false, discount: 0, message: "Invalid or expired coupon code" };
      }
      if (cartTotal < coupon.minOrderValue) {
        return {
          isValid: false,
          discount: 0,
          message: `Minimum order value for ${coupon.code} is \u20B9${coupon.minOrderValue.toLocaleString("en-IN")}`
        };
      }
      let discount = 0;
      if (coupon.discountPercent) {
        discount = Math.round(cartTotal * coupon.discountPercent / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else if (coupon.discountAmount) {
        discount = coupon.discountAmount;
      }
      return {
        isValid: true,
        discount,
        message: `Coupon ${coupon.code} applied successfully!`,
        coupon
      };
    }
  },
  async addCoupon(couponData) {
    try {
      const res = await apiClient.post("/coupons", couponData);
      return res.data;
    } catch {
      const coupons = getStoredCoupons();
      const newCoupon = {
        id: `c-${Date.now()}`,
        code: (couponData.code || "SAVE10").toUpperCase().trim(),
        description: couponData.description || "Special festival discount",
        discountPercent: couponData.discountPercent || 10,
        discountAmount: couponData.discountAmount,
        minOrderValue: Number(couponData.minOrderValue) || 2e3,
        maxDiscount: Number(couponData.maxDiscount) || 1e3,
        expiryDate: couponData.expiryDate || "2026-12-31",
        isActive: true
      };
      coupons.push(newCoupon);
      saveStoredCoupons(coupons);
      return newCoupon;
    }
  },
  async toggleCouponStatus(id) {
    try {
      const res = await apiClient.patch(`/coupons/${id}/toggle`);
      return res.data;
    } catch {
      const coupons = getStoredCoupons();
      const item = coupons.find((c) => c.id === id);
      if (!item) throw new Error("Coupon not found");
      item.isActive = !item.isActive;
      saveStoredCoupons(coupons);
      return item;
    }
  },
  async deleteCoupon(id) {
    try {
      await apiClient.delete(`/coupons/${id}`);
      return true;
    } catch {
      const coupons = getStoredCoupons();
      const filtered = coupons.filter((c) => c.id !== id);
      saveStoredCoupons(filtered);
      return true;
    }
  }
};
