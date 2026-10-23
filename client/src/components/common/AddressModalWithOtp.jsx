import { useState, useEffect, useRef } from "react";
import {
  Smartphone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  Building,
  Home,
  Briefcase
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { isValidIndianPhone, isValidIndianPincode } from "../../utils/validators";
import { lookupPincode } from "../../utils/pincode";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";
import toast from "react-hot-toast";
export const AddressModalWithOtp = ({
  isOpen,
  onClose,
  onSuccess,
  initialAddress,
  title = "\u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0921\u093F\u0932\u0940\u0935\u0930\u0940 \u092A\u0924\u093E \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (Delivery Address)"
}) => {
  const { user, saveAddressWithOtp } = useAuth();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [type, setType] = useState("HOME");
  const [isDefault, setIsDefault] = useState(true);
  const [otp, setOtp] = useState("");
  const [dispatchedOtp, setDispatchedOtp] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState(null);
  const [smsUrl, setSmsUrl] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);
  const otpInputRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setOtp("");
      setDispatchedOtp(null);
      if (initialAddress) {
        setFullName(initialAddress.fullName || user?.name || "");
        setPhone(initialAddress.phone || user?.phone || "");
        setAlternatePhone(initialAddress.alternatePhone || "");
        setPincode(initialAddress.pincode || "");
        setState(initialAddress.state || "");
        setCity(initialAddress.city || "");
        setLocality(initialAddress.locality || "");
        setAddressLine(initialAddress.addressLine || "");
        setLandmark(initialAddress.landmark || "");
        setType(initialAddress.type || "HOME");
        setIsDefault(initialAddress.isDefault ?? true);
      } else {
        setFullName(user?.name || "");
        setPhone(user?.phone || "");
        setAlternatePhone("");
        setPincode("");
        setState("");
        setCity("");
        setLocality("");
        setAddressLine("");
        setLandmark("");
        setType("HOME");
        setIsDefault(true);
      }
    }
  }, [isOpen, initialAddress, user]);
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
  useEffect(() => {
    let interval;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1e3);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);
  const handlePincodeChange = async (val) => {
    const cleanPin = val.replace(/\D/g, "").slice(0, 6);
    setPincode(cleanPin);
    if (cleanPin.length === 6) {
      setIsLookingUpPin(true);
      try {
        const found = await lookupPincode(cleanPin);
        if (found) {
          if (!city || city === "") setCity(found.city);
          if (!state || state === "") setState(found.state);
          toast.success(`Location detected: ${found.city}, ${found.state}`, { icon: "\u{1F4CD}", duration: 2500 });
        }
      } catch {
      } finally {
        setIsLookingUpPin(false);
      }
    }
  };
  const handleInitiateOtpForAddress = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("\u0915\u0943\u092A\u092F\u093E \u0905\u092A\u0928\u093E \u092A\u0942\u0930\u093E \u0928\u093E\u092E \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (Please enter full name)");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (!isValidIndianPhone(cleanPhone)) {
      toast.error("\u0915\u0943\u092A\u092F\u093E \u092E\u093E\u0928\u094D\u092F 10-\u0905\u0902\u0915\u0940\u092F \u092D\u093E\u0930\u0924\u0940\u092F \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (Valid 10-digit mobile required)");
      return;
    }
    if (!isValidIndianPincode(pincode)) {
      toast.error("\u0915\u0943\u092A\u092F\u093E \u092E\u093E\u0928\u094D\u092F 6-\u0905\u0902\u0915\u0940\u092F \u092A\u093F\u0928\u0915\u094B\u0921 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (Valid 6-digit PIN code required)");
      return;
    }
    if (!city.trim() || !state.trim()) {
      toast.error("\u0915\u0943\u092A\u092F\u093E \u0936\u0939\u0930 \u090F\u0935\u0902 \u0930\u093E\u091C\u094D\u092F \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (City and State are required)");
      return;
    }
    if (!addressLine.trim()) {
      toast.error("\u0915\u0943\u092A\u092F\u093E \u092E\u0915\u093E\u0928 \u0928\u0902\u092C\u0930 / \u0917\u0932\u0940 / \u0938\u0921\u093C\u0915 \u0915\u093E \u0935\u093F\u0935\u0930\u0923 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902 (Address line is required)");
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await authService.sendOtp(cleanPhone, "phone", "verify_address");
      if (res.success) {
        setDispatchedOtp(res.otp || null);
        setWhatsappUrl(res.whatsappUrl || null);
        setSmsUrl(res.smsUrl || null);
        setStep(2);
        setResendTimer(30);
        playSmsTone();
        toast.success(`OTP dispatched to +91 ${cleanPhone}!`, { icon: "\u{1F4F1}" });
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 300);
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to dispatch OTP. Please check your mobile number.";
      toast.error(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };
  const handleVerifyAndSave = async (codeToVerify) => {
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const cleanOtp = codeToVerify.replace(/\D/g, "").slice(0, 6);
    if (cleanOtp.length !== 6) {
      toast.error("\u0915\u0943\u092A\u092F\u093E 6-\u0905\u0902\u0915\u0940\u092F OTP \u0915\u094B\u0921 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902");
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const addressData = {
        fullName: fullName.trim(),
        phone: cleanPhone,
        alternatePhone: alternatePhone ? alternatePhone.replace(/\D/g, "").slice(-10) : void 0,
        pincode: pincode.trim(),
        state: state.trim(),
        city: city.trim(),
        locality: locality.trim() || city.trim(),
        addressLine: addressLine.trim(),
        landmark: landmark.trim() || void 0,
        type,
        isDefault
      };
      const saved = await saveAddressWithOtp(addressData, cleanPhone, cleanOtp);
      if (saved) {
        toast.success("\u{1F389} \u0906\u092A\u0915\u093E \u092A\u0924\u093E Database \u092E\u0947\u0902 \u0939\u092E\u0947\u0936\u093E \u0915\u0947 \u0932\u093F\u090F \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 Save \u0939\u094B \u0917\u092F\u093E \u0939\u0948!", {
          duration: 4e3,
          icon: "\u2705"
        });
        onSuccess(saved);
        onClose();
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };
  const handleAutoFillAndProceed = async () => {
    if (dispatchedOtp) {
      setOtp(dispatchedOtp);
      toast.success("\u26A1 OTP \u0938\u094D\u0935\u0924\u0903 \u092D\u0930\u093E \u0917\u092F\u093E! Database \u092E\u0947\u0902 \u092A\u0924\u093E \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0939\u094B \u0930\u0939\u093E \u0939\u0948...", { icon: "\u26A1" });
      await handleVerifyAndSave(dispatchedOtp);
    }
  };
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    setIsSendingOtp(true);
    try {
      const res = await authService.sendOtp(cleanPhone, "phone", "verify_address");
      if (res.success) {
        setDispatchedOtp(res.otp || null);
        setWhatsappUrl(res.whatsappUrl || null);
        setSmsUrl(res.smsUrl || null);
        setResendTimer(30);
        playSmsTone();
        toast.success(`\u0928\u092F\u093E OTP +91 ${cleanPhone} \u092A\u0930 \u092D\u0947\u091C\u093E \u0917\u092F\u093E!`, { icon: "\u{1F4F1}" });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };
  return <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <div className="space-y-5">
        {
    /* Step Indicator Header */
  }
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span
    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? "bg-[#881930] text-white" : "bg-emerald-600 text-white"}`}
  >
              {step === 2 ? "\u2713" : "1"}
            </span>
            <span className={`text-xs font-semibold ${step === 1 ? "text-[#881930]" : "text-stone-500"}`}>
              पते का विवरण (Address Details)
            </span>
          </div>

          <div className="h-0.5 w-8 bg-stone-200" />

          <div className="flex items-center gap-2">
            <span
    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? "bg-[#881930] text-white" : "bg-stone-100 text-stone-400"}`}
  >
              2
            </span>
            <span className={`text-xs font-semibold ${step === 2 ? "text-[#881930]" : "text-stone-400"}`}>
              मोबाइल OTP सत्यापन (Security Verification)
            </span>
          </div>
        </div>

        {
    /* STEP 1: Address Details Form */
  }
        {step === 1 && <form onSubmit={handleInitiateOtpForAddress} className="space-y-4">
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>स्थाई Database बचत सुरक्षा:</strong> एक बार पता दर्ज करने के बाद, आपके मोबाइल नंबर पर OTP सत्यापन होगा। OTP वेरिफिकेशन के बाद आपका पता हमेशा के लिए Database में सुरक्षित रहेगा!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
    label="पूरा नाम (Full Name) *"
    type="text"
    required
    placeholder="उदा. संतोष कुमार केनवट"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
  />

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  मोबाइल नंबर (10-Digit Mobile Number) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                    +91
                  </span>
                  <input
    type="tel"
    required
    maxLength={10}
    placeholder="उदा. 6267961163"
    value={phone}
    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
    className="w-full pl-14 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#881930] focus:ring-1 focus:ring-[#881930] font-mono tracking-wide"
  />
                </div>
                <p className="text-[10px] text-stone-400 mt-0.5">इसी नंबर पर डिलीवरी OTP भेजा जाएगा</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <Input
    label="पिनकोड (6-Digit PIN Code) *"
    type="text"
    required
    maxLength={6}
    placeholder="उदा. 492001 या 221001"
    value={pincode}
    onChange={(e) => handlePincodeChange(e.target.value)}
  />
                {isLookingUpPin && <span className="text-[10px] text-[#881930] animate-pulse">शहर खोजा जा रहा है...</span>}
              </div>

              <Input
    label="शहर / जिला (City / District) *"
    type="text"
    required
    placeholder="उदा. रायपुर / वाराणसी"
    value={city}
    onChange={(e) => setCity(e.target.value)}
  />

              <Input
    label="राज्य (State) *"
    type="text"
    required
    placeholder="उदा. छत्तीसगढ़ / उत्तर प्रदेश"
    value={state}
    onChange={(e) => setState(e.target.value)}
  />
            </div>

            <Input
    label="मकान सं. / भवन / गली / सड़क (House / Flat / Road / Street) *"
    type="text"
    required
    placeholder="उदा. मकान नं. 24, मेन रोड, ब्लॉक B"
    value={addressLine}
    onChange={(e) => setAddressLine(e.target.value)}
  />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
    label="इलाका / मोहल्ला / कॉलोनी (Locality / Area)"
    type="text"
    placeholder="उदा. शांति नगर / अस्सी घाट"
    value={locality}
    onChange={(e) => setLocality(e.target.value)}
  />

              <Input
    label="नजदीकी पहचान (Landmark - Optional)"
    type="text"
    placeholder="उदा. शिव मंदिर के पास / पोस्ट ऑफिस के सामने"
    value={landmark}
    onChange={(e) => setLandmark(e.target.value)}
  />
            </div>

            {
    /* Address Type Selection */
  }
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                पते का प्रकार (Address Type)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
    { id: "HOME", label: "\u0918\u0930 (Home)", icon: Home },
    { id: "WORK", label: "\u0915\u093E\u0930\u094D\u092F\u093E\u0932\u092F (Work)", icon: Briefcase },
    { id: "OTHER", label: "\u0905\u0928\u094D\u092F (Other)", icon: Building }
  ].map((item) => {
    const Icon = item.icon;
    const isSelected = type === item.id;
    return <button
      key={item.id}
      type="button"
      onClick={() => setType(item.id)}
      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${isSelected ? "border-[#881930] bg-rose-50/50 text-[#881930] font-bold shadow-2xs" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>;
  })}
              </div>
            </div>

            {
    /* Set as Default Checkbox */
  }
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
    type="checkbox"
    checked={isDefault}
    onChange={(e) => setIsDefault(e.target.checked)}
    className="w-4 h-4 rounded text-[#881930] focus:ring-[#881930]"
  />
              <span className="text-xs text-stone-700">
                इसे मेरा मुख्य डिलीवरी पता बनाएं (Make this my default delivery address)
              </span>
            </label>

            {
    /* Submit Action */
  }
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                रद्द करें (Cancel)
              </Button>
              <Button type="submit" size="sm" isLoading={isSendingOtp} className="px-5">
                <span>पता सुरक्षित करें एवं OTP प्राप्त करें</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>}

        {
    /* STEP 2: Mobile OTP Verification */
  }
        {step === 2 && <div className="space-y-4">
            {
    /* Target Phone Info */
  }
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#881930]" />
                <span>
                  मोबाइल नंबर: <strong className="font-mono text-stone-900">+91 {phone}</strong>
                </span>
              </div>
              <button
    type="button"
    onClick={() => setStep(1)}
    className="text-[11px] text-[#881930] hover:underline font-semibold"
  >
                नंबर बदलें (Edit)
              </button>
            </div>

            {
    /* Incoming SMS Notification Simulation Card */
  }
            {dispatchedOtp && <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-xl border border-stone-700 space-y-3 ring-2 ring-emerald-500/50 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold tracking-wide text-stone-200">
                      VK-SAREES (मोबाइल SMS संदेश)
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded">
                    ● अभी प्राप्त हुआ (Live)
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-stone-300">
                    साड़ी संसार पता सुरक्षित करने हेतु आपका 6-अंकीय OTP है:
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-black tracking-widest text-[#f2ce6e] bg-stone-800 px-3 py-1 rounded-lg border border-amber-400/30">
                      {dispatchedOtp}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      (10 मिनट तक वैध)
                    </span>
                  </div>
                </div>

                {
    /* 1-Click Auto Fill Action */
  }
                <button
    type="button"
    onClick={handleAutoFillAndProceed}
    disabled={isVerifyingOtp}
    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ring-2 ring-emerald-400/50"
  >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    {isVerifyingOtp ? "\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0939\u094B \u0930\u0939\u093E \u0939\u0948..." : `\u26A1 1-\u0915\u094D\u0932\u093F\u0915 Auto-Fill \u0915\u0930\u0947\u0902 \u0914\u0930 \u092A\u0924\u093E \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0915\u0930\u0947\u0902 (${dispatchedOtp})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>}

            {
    /* Direct Multi-Channel Delivery Buttons */
  }
            <div className="grid grid-cols-2 gap-2 text-xs">
              {whatsappUrl && <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 transition-colors"
  >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp पर OTP</span>
                  <ExternalLink className="w-3 h-3 text-emerald-500" />
                </a>}
              {smsUrl && <a
    href={smsUrl}
    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold border border-stone-200 transition-colors"
  >
                  <Smartphone className="w-3.5 h-3.5 text-stone-600" />
                  <span>SMS App खोलें</span>
                </a>}
            </div>

            {
    /* Manual OTP Input */
  }
            <div className="space-y-2 text-center pt-1">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                6-अंकीय OTP कोड दर्ज करें (Enter 6-Digit OTP)
              </label>
              <input
    ref={otpInputRef}
    type="text"
    maxLength={6}
    autoFocus
    placeholder="• • • • • •"
    value={otp}
    onChange={(e) => {
      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
      setOtp(val);
      if (val.length === 6) {
        handleVerifyAndSave(val);
      }
    }}
    className="w-full max-w-xs mx-auto py-3 text-center text-2xl font-mono tracking-[0.5em] font-bold border-2 border-stone-300 rounded-xl focus:outline-none focus:border-[#881930] focus:ring-2 focus:ring-[#881930]/20 bg-stone-50"
  />
              <p className="text-[11px] text-stone-500">
                (6 अंक दर्ज होते ही स्वतः सत्यापित होकर Database में सुरक्षित हो जाएगा)
              </p>
            </div>

            {
    /* Actions & Resend Timer */
  }
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
              <button
    type="button"
    onClick={handleResendOtp}
    disabled={resendTimer > 0 || isSendingOtp}
    className="text-xs text-stone-600 hover:text-[#881930] flex items-center gap-1.5 disabled:opacity-50 cursor-pointer font-medium"
  >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {resendTimer > 0 ? `\u092A\u0941\u0928\u0903 OTP \u092D\u0947\u091C\u0947\u0902 (${resendTimer}s)` : isSendingOtp ? "\u092D\u0947\u091C\u093E \u091C\u093E \u0930\u0939\u093E \u0939\u0948..." : "\u092A\u0941\u0928\u0903 OTP \u092D\u0947\u091C\u0947\u0902 (Resend OTP)"}
                </span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => setStep(1)}
    className="flex-1 sm:flex-none"
  >
                  वापस (Back)
                </Button>
                <Button
    type="button"
    size="sm"
    isLoading={isVerifyingOtp}
    onClick={() => handleVerifyAndSave(otp)}
    className="flex-1 sm:flex-none px-5"
  >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>Verify & Save</span>
                </Button>
              </div>
            </div>
          </div>}
      </div>
    </Modal>;
};
