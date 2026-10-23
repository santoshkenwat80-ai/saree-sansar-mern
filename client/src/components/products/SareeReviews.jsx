import { useState, useEffect } from "react";
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Check,
  Send
} from "lucide-react";
import { reviewService } from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/currency";
import toast from "react-hot-toast";
export const SareeReviews = ({ sareeId, sareeName }) => {
  const { user } = useAuth();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState(user?.name || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const loadReviews = async () => {
    try {
      const data = await reviewService.getReviewsBySareeId(sareeId);
      setReviewData(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadReviews();
  }, [sareeId]);
  useEffect(() => {
    if (user) {
      if (!userName) setUserName(user.name);
      if (!userEmail) setUserEmail(user.email);
    }
  }, [user]);
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      toast.error("Please share a few words about your experience (at least 10 characters)");
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.submitReview({
        sareeId,
        userId: user?.id,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        rating,
        title: title.trim() || "Royal Craftsmanship & Pure Silk",
        comment: comment.trim()
      });
      toast.success("Dhanyavaad! Your review has been published.");
      setTitle("");
      setComment("");
      setShowForm(false);
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };
  const handleVoteHelpful = async (reviewId) => {
    try {
      const res = await reviewService.voteHelpful(reviewId);
      if (res.success && reviewData) {
        setReviewData({
          ...reviewData,
          reviews: reviewData.reviews.map(
            (r) => r.id === reviewId ? { ...r, helpfulVotes: res.helpfulVotes } : r
          )
        });
        toast.success("Thank you for your feedback!");
      }
    } catch {
      toast.error("Could not record vote");
    }
  };
  const avgScore = reviewData?.averageRating || 5;
  const totalCount = reviewData?.totalReviews || 0;
  const breakdown = reviewData?.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  return <div className="mt-16 pt-12 border-t border-stone-200 space-y-8">
      {
    /* Section Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Patron Experiences</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Ratings &amp; Verified Reviews
          </h2>
        </div>

        <button
    type="button"
    onClick={() => setShowForm(!showForm)}
    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#881930] hover:bg-[#6b1426] text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
  >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{showForm ? "Cancel Review" : "Write a Review"}</span>
        </button>
      </div>

      {
    /* Ratings Scorecard Banner */
  }
      <div className="bg-[#FCF9F5] p-6 sm:p-8 rounded-2xl border border-[#d4af37]/30 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {
    /* Big Score Box */
  }
          <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-stone-200/80 pb-6 md:pb-0 md:pr-6">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 font-mono">
                {avgScore.toFixed(1)}
              </span>
              <div>
                <div className="flex items-center gap-0.5 text-[#d4af37]">
                  {[1, 2, 3, 4, 5].map((s) => <Star
    key={s}
    className={`w-4 h-4 ${s <= Math.round(avgScore) ? "fill-current text-[#d4af37]" : "text-stone-300"}`}
  />)}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Based on <strong>{totalCount}</strong> verified patron reviews
                </p>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Certified Silk Mark Purchases</span>
            </div>
          </div>

          {
    /* Star Distribution Progress Bars */
  }
          <div className="md:col-span-8 space-y-1.5 text-xs text-stone-600">
            {[5, 4, 3, 2, 1].map((stars) => {
    const count = breakdown[stars] || 0;
    const pct = totalCount > 0 ? Math.round(count / totalCount * 100) : stars === 5 ? 100 : 0;
    return <div key={stars} className="flex items-center gap-3">
                  <span className="w-12 text-[11px] font-mono flex items-center gap-1 text-stone-500">
                    <span>{stars}</span>
                    <Star className="w-3 h-3 fill-current text-amber-500" />
                  </span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
      className="h-full bg-[#d4af37] rounded-full transition-all duration-500"
      style={{ width: `${pct}%` }}
    />
                  </div>
                  <span className="w-10 text-[11px] font-mono text-stone-400 text-right">
                    {pct}%
                  </span>
                </div>;
  })}
          </div>
        </div>
      </div>

      {
    /* Review Submission Form Drawer / Card */
  }
      {showForm && <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-300 shadow-md animate-in fade-in space-y-5">
          <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Share Your Feedback for {sareeName}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Your rating helps fellow patrons and honors the master weaving artisans.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {
    /* Interactive Star Rating Selector */
  }
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Overall Star Rating:
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
    const isFilled = starVal <= (hoverRating || rating);
    return <button
      key={starVal}
      type="button"
      onClick={() => setRating(starVal)}
      onMouseEnter={() => setHoverRating(starVal)}
      onMouseLeave={() => setHoverRating(0)}
      className="p-1 transition-transform hover:scale-110 cursor-pointer"
      aria-label={`Rate ${starVal} stars`}
    >
                        <Star
      className={`w-6 h-6 ${isFilled ? "fill-current text-[#d4af37] text-shadow" : "text-stone-300"}`}
    />
                      </button>;
  })}
                </div>
                <span className="text-xs font-semibold text-[#881930] ml-2">
                  {rating === 5 && "\u2605\u2605\u2605\u2605\u2605 Royal Masterpiece (5/5)"}
                  {rating === 4 && "\u2605\u2605\u2605\u2605\u2606 Very Good Handloom (4/5)"}
                  {rating === 3 && "\u2605\u2605\u2605\u2606\u2606 Satisfactory Quality (3/5)"}
                  {rating === 2 && "\u2605\u2605\u2606\u2606\u2606 Average Drape (2/5)"}
                  {rating === 1 && "\u2605\u2606\u2606\u2606\u2606 Needs Improvement (1/5)"}
                </span>
              </div>
            </div>

            {
    /* Patron Name and Email */
  }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
    type="text"
    required
    placeholder="e.g. Radhika Sharma"
    value={userName}
    onChange={(e) => setUserName(e.target.value)}
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
    type="email"
    placeholder="radhika@example.com"
    value={userEmail}
    onChange={(e) => setUserEmail(e.target.value)}
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
              </div>
            </div>

            {
    /* Review Title */
  }
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Headline / Title
              </label>
              <input
    type="text"
    placeholder="e.g. Breathtaking Bridal Drape with Tested Gold Zari"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
            </div>

            {
    /* Review Feedback */
  }
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Your Feedback &amp; Review *
              </label>
              <textarea
    rows={4}
    required
    placeholder="Describe the fabric feel, zari sheen, weight, drape, and packaging..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
    type="button"
    onClick={() => setShowForm(false)}
    className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-50 cursor-pointer"
  >
                Cancel
              </button>
              <button
    type="submit"
    disabled={submitting}
    className="px-5 py-2 bg-[#881930] hover:bg-[#6b1426] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
  >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? "Submitting..." : "Post Verified Review"}</span>
              </button>
            </div>
          </form>
        </div>}

      {
    /* Customer Reviews List Feed */
  }
      <div className="space-y-4">
        {loading ? <div className="p-8 text-center text-xs text-stone-400">Loading verified reviews...</div> : !reviewData || reviewData.reviews.length === 0 ? <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200">
            <p className="text-xs text-stone-500">
              No reviews yet for this masterpiece. Be the first patron to share your experience!
            </p>
          </div> : reviewData.reviews.map((rev) => <div
    key={rev.id || rev._id}
    className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200/80 shadow-2xs space-y-3 transition-colors hover:border-stone-300"
  >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f5eedf] text-[#6b1426] font-bold text-xs flex items-center justify-center shrink-0">
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                        {rev.userName}
                      </span>
                      {rev.verifiedPurchase && <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Verified Buyer
                        </span>}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {rev.createdAt ? formatDate(rev.createdAt) : "Recently purchased"}
                    </span>
                  </div>
                </div>

                {
    /* Stars Rating */
  }
                <div className="flex items-center gap-1 text-[#d4af37]">
                  {[1, 2, 3, 4, 5].map((s) => <Star
    key={s}
    className={`w-3.5 h-3.5 ${s <= rev.rating ? "fill-current text-[#d4af37]" : "text-stone-200"}`}
  />)}
                </div>
              </div>

              {
    /* Review Headline & Text */
  }
              <div>
                {rev.title && <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                    {rev.title}
                  </h4>}
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                  {rev.comment}
                </p>
              </div>

              {
    /* Helpful Votes Action */
  }
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <button
    type="button"
    onClick={() => handleVoteHelpful(rev.id || rev._id || "")}
    className="inline-flex items-center gap-1.5 hover:text-stone-800 transition-colors cursor-pointer"
  >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulVotes || 0})</span>
                </button>
                <span className="text-[11px] text-stone-400">Authentic Patron Feedback</span>
              </div>
            </div>)}
      </div>
    </div>;
};
export default SareeReviews;
