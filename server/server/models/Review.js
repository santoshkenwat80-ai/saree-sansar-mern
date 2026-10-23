import mongoose, { Schema } from "mongoose";
import { Saree } from './Saree.js';
import { Product } from './Product.js';
import { db } from '../db.js';
const ReviewSchema = new Schema(
  {
    sareeId: {
      type: String,
      required: [true, "Saree or product identifier is required"],
      index: true
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      default: () => `usr-${Date.now()}`
    },
    userName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    rating: {
      type: Number,
      required: [true, "Star rating (1-5) is required"],
      min: [1, "Minimum rating is 1 star"],
      max: [5, "Maximum rating is 5 stars"]
    },
    title: {
      type: String,
      trim: true,
      default: "Royal Craftsmanship & Pure Silk"
    },
    comment: {
      type: String,
      required: [true, "Review feedback is required"],
      trim: true
    },
    verifiedPurchase: {
      type: Boolean,
      default: true
    },
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0
    },
    images: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);
export async function recalculateSareeRating(sareeId) {
  try {
    const reviews = await Review.find({ sareeId });
    if (reviews.length === 0) {
      return { rating: 5, reviewsCount: 0 };
    }
    const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalStars / reviews.length).toFixed(1));
    const reviewsCount = reviews.length;
    await Promise.all([
      Saree.findOneAndUpdate(
        { $or: [{ _id: sareeId }, { slug: sareeId }, { id: sareeId }] },
        { rating: avgRating, reviewsCount }
      ).catch(() => {
      }),
      Product.findOneAndUpdate(
        { $or: [{ _id: sareeId }, { slug: sareeId }, { id: sareeId }] },
        { rating: avgRating, reviewsCount }
      ).catch(() => {
      })
    ]);
    const local = db.products.find((p) => p.id === sareeId || p.slug === sareeId);
    if (local) {
      local.rating = avgRating;
      local.reviewsCount = reviewsCount;
      db.save();
    }
    return { rating: avgRating, reviewsCount };
  } catch (err) {
    console.warn("Recalculate saree rating notice:", err);
    return { rating: 5, reviewsCount: 1 };
  }
}
export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
