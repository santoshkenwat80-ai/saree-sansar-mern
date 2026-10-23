import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Smartphone,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";
export const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [dispatchedOtp, setDispatchedOtp] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
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
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error("Please enter your registered mobile number or email");
      return;
    }
    setIsLoading(true);
    try {
      const res = await authService.sendOtp(identifier.trim(), "phone", "forgot_password");
      if (res.success) {
        setDispatchedOtp(res.otp || null);
        setStep(2);
        setResendTimer(30);
        toast.success("Reset OTP dispatched to your mobile number!", { icon: "\u{1F4F1}" });
      }
    } catch (err) {
      const msg = err.response?.data?.error || "No account found with this mobile number or email";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    try {
      const res = await authService.sendOtp(identifier.trim(), "phone", "forgot_password");
      if (res.success) {
        setDispatchedOtp(res.otp || null);
        setResendTimer(30);
        toast.success("Fresh OTP sent to your mobile number!");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to resend OTP";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }
    setIsLoading(true);
    try {
      const res = await authService.verifyOtp(identifier.trim(), otp.trim(), "forgot_password");
      if (res.success) {
        setStep(3);
        toast.success("Mobile OTP verified! Set your new password.", { icon: "\u2705" });
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid or expired OTP. Please check and try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await authService.resetPasswordWithOtp(identifier.trim(), otp.trim(), newPassword);
      if (res.success) {
        setStep(4);
        toast.success("Password updated successfully! You can now log in.");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update password. Please request a fresh OTP.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAutoFillOtp = () => {
    if (dispatchedOtp) {
      setOtp(dispatchedOtp);
      toast.success("OTP auto-filled from SMS gateway simulation!", { icon: "\u26A1" });
    }
  };
  return <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-xl space-y-6">
        <div>
          <Link
    to="/login"
    className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-4 transition-colors"
  >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>

          <span className="text-xs font-semibold uppercase tracking-widest text-[#a07817] block">
            Account Security Recovery
          </span>
          <h1 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            {step === 1 && "Reset Password via Mobile OTP"}
            {step === 2 && "Verify Mobile OTP"}
            {step === 3 && "Set New Password"}
            {step === 4 && "Password Reset Complete"}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {step === 1 && "Enter your registered 10-digit mobile number or email to receive a secure recovery code."}
            {step === 2 && `Enter the 6-digit code sent via SMS to your mobile: ${identifier}`}
            {step === 3 && "Choose a strong, unique password to secure your Saree Sansar account."}
            {step === 4 && "Your credentials have been updated. You can now access your account."}
          </p>
        </div>

        {
    /* STEP 1: Enter Mobile / Email */
  }
        {step === 1 && <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <Input
    label="Registered Mobile Number or Email"
    type="text"
    required
    placeholder="e.g. 9876543210 or priyanka@sareesansar.com"
    value={identifier}
    onChange={(e) => setIdentifier(e.target.value)}
  />
              <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-[#881930]" />
                <span>We will dispatch a 6-digit OTP directly to your registered mobile device.</span>
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Send Mobile OTP
            </Button>
          </form>}

        {
    /* STEP 2: Enter 6-digit OTP */
  }
        {step === 2 && <form onSubmit={handleVerifyOtp} className="space-y-5">
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
                  &ldquo;Your password reset OTP for Saree Sansar is: <strong>{dispatchedOtp}</strong>. Valid for 10 minutes.&rdquo;
                </p>
                <button
    type="button"
    onClick={handleAutoFillOtp}
    className="w-full py-1.5 bg-amber-200/60 hover:bg-amber-200 text-amber-950 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1"
  >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-fill OTP ({dispatchedOtp})</span>
                </button>
              </div>}

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider text-center">
                Enter 6-Digit OTP Code
              </label>
              <input
    type="text"
    maxLength={6}
    autoFocus
    placeholder="• • • • • •"
    value={otp}
    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
    className="w-full py-3 text-center text-2xl font-mono tracking-[0.5em] font-bold border-2 border-stone-300 rounded-xl focus:outline-none focus:border-[#881930] focus:ring-2 focus:ring-[#881930]/20 bg-stone-50"
  />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
    type="button"
    onClick={() => setStep(1)}
    className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
  >
                <ArrowLeft className="w-3 h-3" />
                <span>Change Mobile Number</span>
              </button>

              <button
    type="button"
    onClick={handleResendOtp}
    disabled={resendTimer > 0 || isLoading}
    className="text-[#881930] hover:underline font-semibold disabled:opacity-40 disabled:no-underline cursor-pointer flex items-center gap-1"
  >
                <RotateCcw className="w-3 h-3" />
                <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP via SMS"}</span>
              </button>
            </div>

            <Button
    type="submit"
    size="lg"
    className="w-full"
    isLoading={isLoading}
    disabled={otp.length !== 6}
  >
              Verify OTP Code
            </Button>
          </form>}

        {
    /* STEP 3: Create New Password */
  }
        {step === 3 && <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <Input
    label="New Password"
    type={showPassword ? "text" : "password"}
    required
    placeholder="Minimum 6 characters"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
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
    label="Confirm New Password"
    type={showPassword ? "text" : "password"}
    required
    placeholder="Re-type new password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />

            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Password Requirements:</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Must be at least 6 characters long. Once updated, you will be required to log in with this new password.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Update &amp; Save Password
            </Button>
          </form>}

        {
    /* STEP 4: Success confirmation */
  }
        {step === 4 && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-emerald-950">
              Password Reset Successfully!
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your password for <strong>{identifier}</strong> has been updated. You can now use your User ID and new password to sign in.
            </p>
            <Button
    onClick={() => navigate("/login")}
    size="lg"
    className="w-full mt-2"
  >
              Sign In with New Password
            </Button>
          </div>}
      </div>
    </div>;
};
export default ForgotPassword;
