import mongoose, { Schema } from "mongoose";
const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    discountPercent: { type: Number },
    discountAmount: { type: Number },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    expiryDate: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
export const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
