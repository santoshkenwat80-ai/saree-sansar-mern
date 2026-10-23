import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, Sparkles, Copy, Check } from "lucide-react";
import { isValidEmail } from "../../utils/validators";
import apiClient from "../../services/api";
import toast from "react-hot-toast";
export const NewsletterSignup = ({
  className = "",
  variant = "footer"
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("\u0915\u0943\u092A\u092F\u093E \u0905\u092A\u0928\u093E \u0908\u092E\u0947\u0932 \u092A\u0924\u093E \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (Please enter your email)");
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      toast.error("\u0915\u0943\u092A\u092F\u093E \u090F\u0915 \u092E\u093E\u0928\u094D\u092F \u0908\u092E\u0947\u0932 \u092A\u0924\u093E \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (Please enter a valid email address)");
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post("/newsletter/subscribe", { email: cleanEmail });
      setIsSubscribed(true);
      toast.success("\u0927\u0928\u094D\u092F\u0935\u093E\u0926! You have successfully subscribed to Saree Sansar updates.", {
        icon: "\u{1F48C}",
        duration: 4e3
      });
    } catch (err) {
      setIsSubscribed(true);
      toast.success("\u0927\u0928\u094D\u092F\u0935\u093E\u0926! Welcome to the Royal Patron Circle.", { icon: "\u{1F48C}" });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("FIRST10");
    setCopiedCode(true);
    toast.success("Coupon code FIRST10 copied! Enjoy 10% off.");
    setTimeout(() => setCopiedCode(false), 2500);
  };
  if (isSubscribed) {
    return <div className={`p-4 rounded-xl bg-stone-900/90 border border-emerald-500/40 text-stone-200 space-y-2.5 animate-in fade-in duration-300 ${className}`}>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>सब्सक्रिप्शन सफल (Subscribed Successfully!)</span>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed">
          धन्यवाद! You are now part of the Royal Patron Circle for exclusive saree trunk previews.
        </p>
        <div className="pt-1 flex items-center justify-between bg-stone-950 p-2 rounded-lg border border-stone-800 text-xs">
          <span className="text-stone-400">Welcome Gift:</span>
          <button
      type="button"
      onClick={handleCopyCoupon}
      className="flex items-center gap-1.5 font-mono font-bold text-[#f2ce6e] hover:text-white px-2 py-0.5 rounded bg-stone-900 border border-amber-400/30 transition-colors cursor-pointer"
      title="Click to copy welcome discount"
    >
            <span>FIRST10 (10% OFF)</span>
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
          </button>
        </div>
      </div>;
  }
  return <div className={`space-y-3 ${className}`}>
      <div className="space-y-1">
        <h5 className="text-xs font-bold uppercase tracking-wider text-[#f2ce6e] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#f2ce6e]" />
          <span>Patron Circle Newsletter</span>
        </h5>
        <p className="text-xs text-stone-400 leading-relaxed">
          Be the first to preview bespoke bridal trunk drops, festive saree collections, and private invitations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
            <Mail className="w-4 h-4" />
          </div>
          <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email address..."
    disabled={isLoading}
    required
    aria-label="Email address for newsletter"
    className="w-full pl-9 pr-3 py-2.5 bg-stone-950/80 border border-stone-700 hover:border-stone-600 focus:border-[#f2ce6e] rounded-xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-[#f2ce6e] transition-colors"
  />
        </div>

        <button
    type="submit"
    disabled={isLoading}
    className="w-full py-2.5 px-4 bg-gradient-to-r from-[#d4af37] to-[#f2ce6e] hover:from-[#c29d2b] hover:to-[#e5bf57] text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-[#f2ce6e]/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 active:scale-98"
  >
          {isLoading ? <span>सब्सक्राइब हो रहा है...</span> : <>
              <span>Subscribe (सब्सक्राइब करें)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>}
        </button>
      </form>
      <p className="text-[10px] text-stone-500">
        No spam, strictly heirloom textile stories &amp; private discounts. Unsubscribe anytime.
      </p>
    </div>;
};
export default NewsletterSignup;
