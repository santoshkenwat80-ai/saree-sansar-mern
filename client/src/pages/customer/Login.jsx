import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Shield,
  UserCheck,
  Smartphone,
  Lock,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Bell,
  ExternalLink
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { isValidIndianPhone } from "../../utils/validators";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";
export const Login = () => {
  const [loginMethod, setLoginMethod] = useState("otp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("6267961163");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [dispatchedOtp, setDispatchedOtp] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState(null);
  const [smsUrl, setSmsUrl] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showSmsPushBanner, setShowSmsPushBanner] = useState(false);
  const { login, loginWithOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const playSmsTone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {
    }
  };
  useEffect(() => {
    let interval;
    if (isOtpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1e3);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, resendTimer]);
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email or mobile number");
      return;
    }
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      navigate(from, { replace: true });
    }
  };
  const handleSendMobileOtp = async (e) => {
    if (e) e.preventDefault();
    const clean = phone.replace(/\D/g, "").slice(-10);
    if (!isValidIndianPhone(clean)) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await authService.sendOtp(clean, "phone", "login");
      if (res.success) {
        setIsOtpSent(true);
        setDispatchedOtp(res.otp || null);
        setWhatsappUrl(res.whatsappUrl || null);
        setSmsUrl(res.smsUrl || null);
        setResendTimer(30);
        setShowSmsPushBanner(true);
        playSmsTone();
        toast.success(`OTP sent to +91 ${clean}!`, { icon: "\u{1F4F1}" });
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to dispatch OTP. Please check your mobile number.";
      toast.error(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleVerifyDirect = async (codeToVerify) => {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone) {
      toast.error("Mobile number is required");
      return;
    }
    if (!codeToVerify || codeToVerify.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const success = await loginWithOtp(cleanPhone, codeToVerify.trim());
      if (success) {
        setShowSmsPushBanner(false);
        navigate(from, { replace: true });
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    await handleVerifyDirect(otp);
  };
  const handleAutoFillAndProceed = async () => {
    if (dispatchedOtp) {
      setOtp(dispatchedOtp);
      toast.success("OTP auto-filled! Verifying & proceeding...", { icon: "\u26A1" });
      await handleVerifyDirect(dispatchedOtp);
    }
  };
  const handleOtpInput = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setOtp(clean);
    if (clean.length === 6) {
      handleVerifyDirect(clean);
    }
  };
  const handleDemoCustomer = () => {
    setLoginMethod("password");
    setEmail("priyanka@sareesansar.com");
    setPassword("Customer@2026");
  };
  const handleDemoAdmin = () => {
    setLoginMethod("password");
    setEmail("admin@sareesansar.com");
    setPassword("Admin@2026");
  };
  const handleDemoMobile = () => {
    setLoginMethod("otp");
    setPhone("6267961163");
  };
  return <div className="min-h-[85vh] flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-stone-50/50 relative">
      {
    /* 1. Real-Time Smartphone Incoming SMS Push Notification Banner */
  }
      {showSmsPushBanner && dispatchedOtp && <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-stone-700 space-y-3 ring-2 ring-emerald-500/40">
            <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold tracking-wide text-stone-200">
                  VK-SAREES (मोबाइल संदेश / SMS)
                </span>
              </div>
              <span className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
                <Bell className="w-3 h-3 text-amber-400" /> अभी प्राप्त हुआ
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-stone-300">
                साड़ी संसार में लॉगिन हेतु आपका 6-अंकीय OTP है:
              </p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black tracking-widest text-[#f2ce6e] bg-stone-800/80 px-3 py-1 rounded-lg border border-amber-400/30">
                  {dispatchedOtp}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800">
                  10 मिनट तक वैध
                </span>
              </div>
            </div>

            {
    /* 1-Click Verification & Proceed Action Button */
  }
            <button
    type="button"
    onClick={handleAutoFillAndProceed}
    disabled={isVerifyingOtp}
    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ring-2 ring-emerald-400/50"
  >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {isVerifyingOtp ? "\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0939\u094B \u0930\u0939\u093E \u0939\u0948..." : "\u26A1 \u0911\u091F\u094B-\u0935\u0947\u0930\u0940\u092B\u093E\u0908 \u0915\u0930 \u0906\u0917\u0947 \u092C\u095D\u0947\u0902 (Verify & Proceed)"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {
    /* Direct Multi-Channel Delivery Buttons */
  }
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {whatsappUrl && <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-semibold border border-emerald-700 transition-colors"
  >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp OTP</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </a>}
              {smsUrl && <a
    href={smsUrl}
    className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold border border-stone-600 transition-colors"
  >
                  <Smartphone className="w-3.5 h-3.5 text-stone-400" />
                  <span>SMS App खोलें</span>
                </a>}
            </div>
          </div>
        </div>}

      {
    /* Main Login Card */
  }
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xl space-y-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817]">
            Patron Access • रॉयल एक्सेस
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Sign In to Saree Sansar
          </h1>
          <p className="text-xs text-stone-500 mt-1.5">
            मोबाइल OTP दर्ज करें और अपना सुरक्षित खाता खोलें।
          </p>
        </div>

        {
    /* Tab Switcher: Mobile OTP vs Password */
  }
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
          <button
    type="button"
    onClick={() => setLoginMethod("otp")}
    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${loginMethod === "otp" ? "bg-white text-[#6b1426] shadow-xs" : "text-stone-600 hover:text-stone-900"}`}
  >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile OTP (ओटीपी)</span>
          </button>
          <button
    type="button"
    onClick={() => setLoginMethod("password")}
    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${loginMethod === "password" ? "bg-white text-[#6b1426] shadow-xs" : "text-stone-600 hover:text-stone-900"}`}
  >
            <Lock className="w-3.5 h-3.5" />
            <span>Password (पासवर्ड)</span>
          </button>
        </div>

        {
    /* Quick One-Click Demo Fill */
  }
        <div className="bg-[#FCF9F5] p-3 rounded-xl border border-amber-200/60 text-xs space-y-2">
          <p className="font-semibold text-stone-800 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#881930]" />
            पसंदीदा मोबाइल / डेमो खाता:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
    type="button"
    onClick={handleDemoMobile}
    className="flex-1 min-w-[130px] py-1.5 px-2 bg-rose-50 border border-rose-200 rounded text-[#881930] hover:bg-rose-100 font-bold cursor-pointer transition-colors text-center text-[11px]"
  >
              📱 6267961163 (संतोष कुमार)
            </button>
            <button
    type="button"
    onClick={handleDemoCustomer}
    className="py-1.5 px-2.5 bg-white border border-stone-300 rounded text-stone-800 hover:bg-stone-50 font-medium cursor-pointer transition-colors text-center text-[11px]"
  >
              Demo Email
            </button>
            <button
    type="button"
    onClick={handleDemoAdmin}
    className="py-1.5 px-2.5 bg-amber-50 border border-amber-300 rounded text-amber-900 hover:bg-amber-100 font-semibold cursor-pointer transition-colors text-center text-[11px]"
  >
              Admin
            </button>
          </div>
        </div>

        {
    /* TAB 1: Mobile OTP Login */
  }
        {loginMethod === "otp" && <div className="space-y-4">
            {!isOtpSent ? <form onSubmit={handleSendMobileOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    10-अंकीय मोबाइल नंबर दर्ज करें (Mobile Number)
                  </label>
                  <div className="relative flex rounded-xl shadow-2xs">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-stone-300 bg-stone-100 text-stone-800 text-xs font-bold">
                      🇮🇳 +91
                    </span>
                    <input
    type="tel"
    required
    maxLength={10}
    placeholder="e.g. 6267961163"
    value={phone}
    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
    className="flex-1 block w-full rounded-none rounded-r-xl border border-stone-300 px-3.5 py-2.5 text-stone-900 text-sm font-mono font-semibold focus:border-[#6b1426] focus:ring-1 focus:ring-[#6b1426] focus:outline-none"
  />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1.5">
                    बटन दबाते ही 6-अंकीय OTP कोड तुरंत भेजा जाएगा।
                  </p>
                </div>

                <Button
    type="submit"
    size="lg"
    className="w-full flex items-center justify-center gap-2"
    isLoading={isSendingOtp}
  >
                  <Smartphone className="w-4 h-4" />
                  <span>मोबाइल में OTP भेजें (Send OTP)</span>
                </Button>
              </form> : <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                {
    /* OTP Notification Card */
  }
                <div className="p-4 bg-gradient-to-br from-amber-50/70 to-orange-50/50 border border-amber-300 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#881930]" />
                      SMS संदेश (+91 {phone})
                    </span>
                    <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      सक्रिय (Active)
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200">
                    <div>
                      <span className="text-[10px] text-stone-500 block">प्राप्त OTP कोड:</span>
                      <span className="font-mono text-xl font-black tracking-widest text-[#881930]">
                        {dispatchedOtp || "..."}
                      </span>
                    </div>
                    {dispatchedOtp && <button
    type="button"
    onClick={handleAutoFillAndProceed}
    className="py-1.5 px-3 bg-[#6b1426] hover:bg-[#520f1d] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
  >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>सत्यापित करें</span>
                      </button>}
                  </div>

                  {
    /* Multi-channel OTP receipt options */
  }
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    {whatsappUrl && <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold border border-emerald-300 transition-colors text-[11px]"
  >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        <span>WhatsApp OTP</span>
                        <ExternalLink className="w-3 h-3 text-emerald-600" />
                      </a>}
                    {smsUrl && <a
    href={smsUrl}
    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold border border-stone-200 transition-colors text-[11px]"
  >
                        <Smartphone className="w-3.5 h-3.5 text-stone-600" />
                        <span>SMS App खोलें</span>
                      </a>}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      6-अंकीय OTP दर्ज करें (Enter 6-Digit OTP)
                    </label>
                    <button
    type="button"
    onClick={() => {
      setIsOtpSent(false);
      setOtp("");
      setShowSmsPushBanner(false);
    }}
    className="text-[11px] text-[#6b1426] hover:underline cursor-pointer font-medium"
  >
                      नंबर बदलें (Change Number)
                    </button>
                  </div>
                  <input
    type="text"
    maxLength={6}
    required
    placeholder="• • • • • •"
    value={otp}
    onChange={(e) => handleOtpInput(e.target.value)}
    className="w-full text-center tracking-[0.4em] font-mono text-2xl font-black border-2 border-stone-300 rounded-xl py-2.5 focus:border-[#6b1426] focus:ring-2 focus:ring-[#6b1426]/20 focus:outline-none"
  />
                  <p className="text-[10px] text-stone-400 text-center mt-1">
                    6 अंक पूरे होते ही स्वतः सत्यापन होकर खाता खुल जाएगा।
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>SMS नहीं मिला?</span>
                  <button
    type="button"
    onClick={() => handleSendMobileOtp()}
    disabled={resendTimer > 0 || isSendingOtp}
    className={`inline-flex items-center gap-1 font-semibold ${resendTimer > 0 ? "text-stone-400 cursor-not-allowed" : "text-[#6b1426] hover:underline cursor-pointer"}`}
  >
                    <RotateCcw className="w-3 h-3" />
                    {resendTimer > 0 ? `\u092A\u0941\u0928\u0903 \u092D\u0947\u091C\u0947\u0902 (${resendTimer}s)` : "\u0913\u091F\u0940\u092A\u0940 \u092A\u0941\u0928\u0903 \u092D\u0947\u091C\u0947\u0902"}
                  </button>
                </div>

                <Button
    type="submit"
    size="lg"
    className="w-full flex items-center justify-center gap-2"
    isLoading={isVerifyingOtp}
  >
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>सत्यापित कर आगे बढ़ाएं (Verify &amp; Proceed)</span>
                </Button>
              </form>}
          </div>}

        {
    /* TAB 2: Password Login */
  }
        {loginMethod === "password" && <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
    label="User ID (Email or 10-Digit Mobile Number)"
    type="text"
    required
    placeholder="e.g. priyanka@sareesansar.com or 9876543210"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

            <div className="relative">
              <Input
    label="Password"
    type={showPassword ? "text" : "password"}
    required
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
              <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-8 text-stone-400 hover:text-stone-600 cursor-pointer"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-stone-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#881930]" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#881930] hover:underline font-medium">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Sign In with Password
            </Button>
          </form>}

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          <span>New to Saree Sansar? </span>
          <Link to="/register" className="font-semibold text-[#881930] hover:underline">
            Register with Mobile OTP
          </Link>
        </div>

        <div className="text-center">
          <Link
    to="/admin/login"
    className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700"
  >
            <Shield className="w-3.5 h-3.5" />
            <span>Dedicated Admin Portal</span>
          </Link>
        </div>
      </div>
    </div>;
};
