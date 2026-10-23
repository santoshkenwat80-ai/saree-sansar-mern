import mongoose, { Schema } from "mongoose";
const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    productCount: { type: Number, default: 0 },
    tagline: { type: String, default: "" }
  },
  { timestamps: true }
);
export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
