import apiClient from "./api";
export const reviewService = {
  async getReviewsBySareeId(sareeId) {
    try {
      const res = await apiClient.get(`/reviews/saree/${sareeId}`);
      return res.data;
    } catch {
      return {
        sareeId,
        averageRating: 5,
        totalReviews: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        reviews: []
      };
    }
  },
  async submitReview(data) {
    const res = await apiClient.post("/reviews", data);
    return res.data;
  },
  async voteHelpful(reviewId) {
    const res = await apiClient.post(`/reviews/${reviewId}/helpful`);
    return res.data;
  }
};
export default reviewService;
