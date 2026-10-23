import { Router } from "express";
import { Review, recalculateSareeRating } from '../models/Review.js';
import { db } from '../db.js';
import { isMongoConnected } from '../config/db.js';
const router = Router();
router.get("/saree/:sareeId", async (req, res) => {
  try {
    const { sareeId } = req.params;
    let reviewsList = [];
    if (isMongoConnected()) {
      try {
        const mongoReviews = await Review.find({ sareeId }).sort({ createdAt: -1 });
        if (mongoReviews && mongoReviews.length > 0) {
          reviewsList = mongoReviews;
        }
      } catch (e) {
        console.warn("MongoDB reviews fetch notice:", e);
      }
    }
    if (reviewsList.length === 0) {
      reviewsList = db.reviews.filter((r) => r.sareeId === sareeId);
    }
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      breakdown[star] = (breakdown[star] || 0) + 1;
    });
    const totalReviews = reviewsList.length;
    const avgRating = totalReviews > 0 ? Number((reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)) : 5;
    res.json({
      sareeId,
      averageRating: avgRating,
      totalReviews,
      breakdown,
      reviews: reviewsList
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const {
      sareeId,
      userId,
      userName,
      userEmail,
      rating,
      title,
      comment,
      images,
      verifiedPurchase
    } = req.body;
    if (!sareeId || !rating || !comment || !userName) {
      return res.status(400).json({
        error: "Saree ID, rating (1-5 stars), feedback comment, and name are required"
      });
    }
    const starRating = Math.min(5, Math.max(1, Number(rating)));
    const newReview = {
      id: `rev-${Date.now()}`,
      sareeId,
      userId: userId || `usr-${Date.now()}`,
      userName: userName.trim(),
      userEmail: userEmail ? userEmail.trim().toLowerCase() : "",
      rating: starRating,
      title: title?.trim() || "Royal Craftsmanship & Pure Silk",
      comment: comment.trim(),
      verifiedPurchase: verifiedPurchase !== void 0 ? Boolean(verifiedPurchase) : true,
      helpfulVotes: 0,
      images: Array.isArray(images) ? images : [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.reviews.unshift(newReview);
    db.save();
    if (isMongoConnected()) {
      try {
        await Review.create({
          sareeId: newReview.sareeId,
          userId: newReview.userId,
          userName: newReview.userName,
          userEmail: newReview.userEmail,
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment,
          verifiedPurchase: newReview.verifiedPurchase,
          helpfulVotes: 0,
          images: newReview.images
        });
        await recalculateSareeRating(sareeId);
        console.log(`\u2B50 [Review] Saved customer review to MongoDB for Saree: ${sareeId}`);
      } catch (mongoErr) {
        console.error("Error saving review to MongoDB:", mongoErr);
      }
    }
    res.status(201).json({
      success: true,
      message: "Review submitted successfully! Thank you for sharing your experience.",
      review: newReview
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Failed to submit review", details: error.message });
  }
});
router.post("/:id/helpful", async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
      const query = isMongoId ? { $or: [{ _id: id }, { id }] } : { id };
      await Review.findOneAndUpdate(query, { $inc: { helpfulVotes: 1 } }).catch(() => {
      });
    }
    const review = db.reviews.find((r) => r.id === id);
    if (review) {
      review.helpfulVotes = (review.helpfulVotes || 0) + 1;
      db.save();
      return res.json({ success: true, helpfulVotes: review.helpfulVotes });
    }
    res.json({ success: true, helpfulVotes: 1 });
  } catch (error) {
    res.status(500).json({ error: "Failed to record helpful vote" });
  }
});
export default router;
