import mongoose, { Schema } from "mongoose";
const AddressSchema = new Schema({
  id: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  locality: { type: String, default: "" },
  addressLine: { type: String, required: true },
  landmark: { type: String, default: "" },
  isDefault: { type: Boolean, default: false },
  type: { type: String, enum: ["HOME", "WORK"], default: "HOME" }
});
const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, default: "" },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    avatar: { type: String, default: "" },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    addresses: [AddressSchema]
  },
  { timestamps: true }
);
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
