import mongoose, { Schema } from "mongoose";
const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0 },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    fabric: { type: String, required: true, index: true },
    color: { type: String, required: true },
    colorHex: { type: String },
    occasion: { type: String, default: "Festive" },
    stock: { type: Number, required: true, min: 0, default: 10 },
    sku: { type: String, required: true, unique: true },
    images: [{ type: String }],
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 1 },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    blousePieceIncluded: { type: Boolean, default: true },
    sareeLength: { type: String, default: "5.5 meters saree + 0.8 meter blouse" },
    careInstructions: { type: String, default: "Dry clean only" },
    specifications: { type: Map, of: String }
  },
  { timestamps: true }
);
export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
