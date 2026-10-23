import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { isValidEmail, isValidIndianPhone } from "../../utils/validators";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";
export const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [dispatchedOtp, setDispatchedOtp] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState(null);
  const [smsUrl, setSmsUrl] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    let interval;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1e3);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);
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
      gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch {
    }
  };
  const handleInitiateRegistration = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!isValidIndianPhone(phone)) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await authService.sendOtp(phone, "phone", "register");
      if (res.success) {
        setDispatchedOtp(res.otp || null);
        setWhatsappUrl(res.whatsappUrl || null);
        setSmsUrl(res.smsUrl || null);
        setStep(2);
        setResendTimer(30);
        playSmsTone();
        toast.success(`Verification OTP dispatched to +91 ${phone}!`, { icon: "\u{1F4F1}" });
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send OTP. Please verify your mobile number.";
      toast.error(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsSendingOtp(true);
    try {
      const res = await authService.sendOtp(phone, "phone", "register");
      if (res.success) {
        setDispatchedOtp(res.otp || null);
        setWhatsappUrl(res.whatsappUrl || null);
        setSmsUrl(res.smsUrl || null);
        setResendTimer(30);
        playSmsTone();
        toast.success("Fresh OTP sent to your mobile number!");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to resend OTP";
      toast.error(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleVerifyDirect = async (codeToVerify) => {
    if (!codeToVerify || codeToVerify.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }
    setIsVerifying(true);
    try {
      const success = await register(name, email, phone, password, codeToVerify.trim());
      if (success) {
        navigate("/");
      }
    } finally {
      setIsVerifying(false);
    }
  };
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    await handleVerifyDirect(otp);
  };
  const handleAutoFillAndRegister = async () => {
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
  return <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-xl space-y-6">
        {
    /* Step Indicator */
  }
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? "bg-[#6b1426] text-white" : "bg-emerald-600 text-white"}`}
  >
            {step === 2 ? "\u2713" : "1"}
          </span>
          <div className={`h-0.5 w-12 ${step === 2 ? "bg-emerald-600" : "bg-stone-200"}`} />
          <span
    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? "bg-[#6b1426] text-white" : "bg-stone-100 text-stone-500"}`}
  >
            2
          </span>
        </div>

        {
    /* Header */
  }
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817]">
            {step === 1 ? "Join Patron Circle" : "OTP Security Verification"}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            {step === 1 ? "Create Your Account" : "Verify Mobile Number"}
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            {step === 1 ? "Enjoy first-order privileges, saved sarees, and personalized recommendations." : `We have sent a 6-digit SMS verification code to +91 ${phone}`}
          </p>
        </div>

        {
    /* STEP 1: Registration Form */
  }
        {step === 1 && <form onSubmit={handleInitiateRegistration} className="space-y-4">
            <Input
    label="Full Name"
    type="text"
    required
    placeholder="e.g. Priyanka Sharma"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

            <Input
    label="Email Address (for Order Updates & Invoices)"
    type="email"
    required
    placeholder="you@domain.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

            <div>
              <Input
    label="Mobile Number (for SMS OTP Verification)"
    type="tel"
    required
    maxLength={10}
    placeholder="10-digit mobile number"
    value={phone}
    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
  />
              <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-[#881930]" />
                <span>A 6-digit OTP will be dispatched to this number for verification.</span>
              </p>
            </div>

            <div className="relative">
              <Input
    label="Create Password"
    type={showPassword ? "text" : "password"}
    required
    placeholder="Minimum 6 characters"
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

            <Input
    label="Confirm Password"
    type={showPassword ? "text" : "password"}
    required
    placeholder="Re-enter password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verified Account Protection:</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Both your mobile phone number and email will be authenticated to ensure strict account privacy and order safety.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isSendingOtp}>
              Send Mobile Verification OTP
            </Button>
          </form>}

        {
    /* STEP 2: Mobile OTP Verification Screen */
  }
        {step === 2 && <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            {
    /* SMS Simulation Banner */
  }
            {dispatchedOtp && <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-900 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#881930]" />
                    <span>Incoming SMS Simulation</span>
                  </span>
                  <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded font-mono">
                    Gateway Live
                  </span>
                </div>
                <p className="text-xs text-amber-800 font-mono">
                  &ldquo;Your Saree Sansar verification code is: <strong>{dispatchedOtp}</strong>. Valid for 10 minutes.&rdquo;
                </p>
                <button
    type="button"
    onClick={handleAutoFillAndRegister}
    disabled={isVerifying}
    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ring-1 ring-emerald-400"
  >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isVerifying ? "\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0939\u094B \u0930\u0939\u093E \u0939\u0948..." : `\u26A1 \u0911\u091F\u094B-\u0935\u0947\u0930\u0940\u092B\u093E\u0908 \u0915\u0930 \u0906\u0917\u0947 \u092C\u095D\u0947\u0902 (${dispatchedOtp})`}
                  </span>
                </button>

                {
    /* Direct Multi-Channel Delivery Buttons */
  }
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  {whatsappUrl && <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold border border-emerald-300 transition-colors"
  >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>WhatsApp OTP</span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </a>}
                  {smsUrl && <a
    href={smsUrl}
    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold border border-stone-200 transition-colors"
  >
                      <Smartphone className="w-3.5 h-3.5 text-stone-600" />
                      <span>SMS App खोलें</span>
                    </a>}
                </div>
              </div>}

            {
    /* OTP Input Field */
  }
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider text-center">
                Enter 6-Digit OTP Code (6-अंकीय OTP)
              </label>
              <input
    type="text"
    maxLength={6}
    autoFocus
    placeholder="• • • • • •"
    value={otp}
    onChange={(e) => handleOtpInput(e.target.value)}
    className="w-full py-3 text-center text-2xl font-mono tracking-[0.5em] font-bold border-2 border-stone-300 rounded-xl focus:outline-none focus:border-[#881930] focus:ring-2 focus:ring-[#881930]/20 bg-stone-50"
  />
              <p className="text-[11px] text-stone-500 text-center">
                Dispatched to <strong className="text-stone-900">+91 {phone}</strong> (6 अंक भरते ही स्वतः आगे बढ़ेगा)
              </p>
            </div>

            {
    /* Email verification status info */
  }
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold block">Email Verification Sync</span>
                <span className="text-[11px] text-emerald-700 block">
                  {email} is linked and will be activated alongside your verified mobile.
                </span>
              </div>
            </div>

            {
    /* Resend Timer & Actions */
  }
            <div className="flex items-center justify-between text-xs pt-1">
              <button
    type="button"
    onClick={() => setStep(1)}
    className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
  >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Mobile / Details</span>
              </button>

              <button
    type="button"
    onClick={handleResendOtp}
    disabled={resendTimer > 0 || isSendingOtp}
    className="text-[#881930] hover:underline font-semibold disabled:opacity-40 disabled:no-underline cursor-pointer flex items-center gap-1"
  >
                <RotateCcw className="w-3 h-3" />
                <span>
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend Code via SMS"}
                </span>
              </button>
            </div>

            {
    /* Verify & Create Account Button */
  }
            <Button
    type="submit"
    size="lg"
    className="w-full"
    isLoading={isVerifying}
    disabled={otp.length !== 6}
  >
              Verify OTP &amp; Create Account
            </Button>
          </form>}

        {
    /* Footer Navigation */
  }
        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          <span>Already registered with Saree Sansar? </span>
          <Link to="/login" className="font-semibold text-[#881930] hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>;
};
export default Register;
