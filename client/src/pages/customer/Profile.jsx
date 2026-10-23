import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  MapPin,
  Package,
  Heart,
  Plus,
  Trash2,
  Check,
  Shield,
  Lock,
  Key,
  Smartphone,
  Laptop,
  LogOut,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Calendar,
  Mail,
  Phone,
  Home,
  Briefcase,
  Clock,
  Eye,
  EyeOff,
  QrCode,
  Sparkles,
  ShieldCheck,
  Copy
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { AddressModalWithOtp } from "../../components/common/AddressModalWithOtp";
import { isValidIndianPhone, isValidIndianPincode } from "../../utils/validators";
import toast from "react-hot-toast";
const PINCODE_MAP = {
  "110001": { city: "New Delhi", state: "Delhi", locality: "Connaught Place" },
  "122002": { city: "Gurugram", state: "Haryana", locality: "Cyber City" },
  "400001": { city: "Mumbai", state: "Maharashtra", locality: "Fort / Colaba" },
  "560001": { city: "Bengaluru", state: "Karnataka", locality: "MG Road" },
  "600001": { city: "Chennai", state: "Tamil Nadu", locality: "George Town" },
  "700001": { city: "Kolkata", state: "West Bengal", locality: "BBD Bagh" },
  "221001": { city: "Varanasi", state: "Uttar Pradesh", locality: "Varanasi Cantt / Silk Chowk" },
  "631501": { city: "Kanchipuram", state: "Tamil Nadu", locality: "Temple Silk Enclave" },
  "473446": { city: "Chanderi", state: "Madhya Pradesh", locality: "Chanderi Handloom Nagar" },
  "500001": { city: "Hyderabad", state: "Telangana", locality: "Abids" },
  "380001": { city: "Ahmedabad", state: "Gujarat", locality: "Bhadra" },
  "302001": { city: "Jaipur", state: "Rajasthan", locality: "Johari Bazaar" }
};
const AVATAR_OPTIONS = [
  { id: "av-1", label: "Crimson Silk", bg: "bg-[#6b1426] text-amber-200" },
  { id: "av-2", label: "Royal Gold", bg: "bg-[#b8860b] text-[#2c0e16]" },
  { id: "av-3", label: "Peacock Indigo", bg: "bg-[#1b3b6f] text-cyan-200" },
  { id: "av-4", label: "Emerald Brocade", bg: "bg-[#1b4332] text-emerald-200" },
  { id: "av-5", label: "Plum Zari", bg: "bg-[#4a1236] text-rose-200" }
];
export const Profile = () => {
  const {
    user,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    changePassword,
    toggleTwoFactor,
    terminateOtherSessions,
    deleteAccount,
    logout,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("contact");
  const [contactForm, setContactForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    alternatePhone: user?.alternatePhone || "",
    gender: user?.gender || "female",
    dateOfBirth: user?.dateOfBirth || "",
    anniversary: user?.anniversary || "",
    avatar: user?.avatar || "av-1",
    whatsappAlerts: user?.preferences?.whatsappAlerts ?? true,
    smsTracking: user?.preferences?.smsTracking ?? true,
    newsletter: user?.preferences?.newsletter ?? true
  });
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [deleteConfirmAddressId, setDeleteConfirmAddressId] = useState(null);
  const [addrForm, setAddrForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    alternatePhone: "",
    pincode: "",
    state: "",
    city: "",
    locality: "",
    addressLine: "",
    landmark: "",
    type: "HOME",
    isDefault: false
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);
  const [backupCodes, setBackupCodes] = useState([
    "SS-8921-XK82",
    "SS-4412-PQ90",
    "SS-7729-MN31",
    "SS-1294-ZK55",
    "SS-6034-BR78",
    "SS-9381-LT40"
  ]);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  useEffect(() => {
    if (user) {
      setContactForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        alternatePhone: user.alternatePhone || "",
        gender: user.gender || "female",
        dateOfBirth: user.dateOfBirth || "",
        anniversary: user.anniversary || "",
        avatar: user.avatar || "av-1",
        whatsappAlerts: user.preferences?.whatsappAlerts ?? true,
        smsTracking: user.preferences?.smsTracking ?? true,
        newsletter: user.preferences?.newsletter ?? true
      });
    }
  }, [user]);
  if (!user) {
    return <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#881930] border border-amber-200">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">Sign in to your Account</h2>
        <p className="text-sm text-stone-500 mt-2 mb-6">
          Access your royal silk profile, saved delivery addresses, and security settings.
        </p>
        <Button onClick={() => navigate("/login")} className="w-full">
          Sign In / Register
        </Button>
      </div>;
  }
  const handleSaveContactDetails = async (e) => {
    e.preventDefault();
    if (!contactForm.name.trim()) {
      toast.error("Full Name cannot be empty");
      return;
    }
    if (contactForm.phone && !isValidIndianPhone(contactForm.phone)) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return;
    }
    if (contactForm.alternatePhone && !isValidIndianPhone(contactForm.alternatePhone)) {
      toast.error("Please enter a valid 10-digit alternate phone number");
      return;
    }
    setIsSavingContact(true);
    try {
      await updateProfile({
        name: contactForm.name.trim(),
        phone: contactForm.phone.trim(),
        alternatePhone: contactForm.alternatePhone.trim(),
        gender: contactForm.gender,
        dateOfBirth: contactForm.dateOfBirth,
        anniversary: contactForm.anniversary,
        avatar: contactForm.avatar,
        preferences: {
          whatsappAlerts: contactForm.whatsappAlerts,
          smsTracking: contactForm.smsTracking,
          newsletter: contactForm.newsletter
        }
      });
      toast.success("Contact and personal details saved successfully");
    } catch {
      toast.error("Failed to update details");
    } finally {
      setIsSavingContact(false);
    }
  };
  const handlePincodeChange = (pin) => {
    setAddrForm((prev) => {
      const updated = { ...prev, pincode: pin };
      if (pin.length === 6 && PINCODE_MAP[pin]) {
        const match = PINCODE_MAP[pin];
        updated.city = match.city;
        updated.state = match.state;
        if (!updated.locality && match.locality) {
          updated.locality = match.locality;
        }
      }
      return updated;
    });
  };
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrForm({
      fullName: user.name || "",
      phone: user.phone || "",
      alternatePhone: user.alternatePhone || "",
      pincode: "",
      state: "",
      city: "",
      locality: "",
      addressLine: "",
      landmark: "",
      type: "HOME",
      isDefault: (user.addresses || []).length === 0
    });
    setIsAddressModalOpen(true);
  };
  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddrForm({
      fullName: addr.fullName,
      phone: addr.phone,
      alternatePhone: addr.alternatePhone || "",
      pincode: addr.pincode,
      state: addr.state,
      city: addr.city,
      locality: addr.locality,
      addressLine: addr.addressLine,
      landmark: addr.landmark || "",
      type: addr.type,
      isDefault: addr.isDefault
    });
    setIsAddressModalOpen(true);
  };
  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    if (!addrForm.fullName.trim() || !addrForm.addressLine.trim() || !addrForm.city.trim() || !addrForm.state.trim()) {
      toast.error("Please fill in all required address fields");
      return;
    }
    if (!isValidIndianPhone(addrForm.phone)) {
      toast.error("Please enter a valid 10-digit Indian phone number for delivery contact");
      return;
    }
    if (addrForm.alternatePhone && !isValidIndianPhone(addrForm.alternatePhone)) {
      toast.error("Please enter a valid 10-digit alternate phone number");
      return;
    }
    if (!isValidIndianPincode(addrForm.pincode)) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }
    if (editingAddressId) {
      await updateAddress(editingAddressId, addrForm);
      toast.success("Address updated successfully");
    } else {
      await addAddress(addrForm);
      toast.success("New address added to your address book");
    }
    setIsAddressModalOpen(false);
    setEditingAddressId(null);
  };
  const handleConfirmDeleteAddress = async () => {
    if (deleteConfirmAddressId) {
      await deleteAddress(deleteConfirmAddressId);
      setDeleteConfirmAddressId(null);
    }
  };
  const passwordLengthOk = newPassword.length >= 8;
  const passwordHasNumber = /\d/.test(newPassword);
  const passwordHasUpper = /[A-Z]/.test(newPassword);
  const passwordHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: "", color: "bg-stone-200" };
    let score = 0;
    if (passwordLengthOk) score += 1;
    if (passwordHasNumber) score += 1;
    if (passwordHasUpper) score += 1;
    if (passwordHasSpecial) score += 1;
    if (score <= 1) return { score: 25, label: "Weak", color: "bg-rose-500 text-rose-700" };
    if (score === 2) return { score: 50, label: "Fair", color: "bg-amber-500 text-amber-700" };
    if (score === 3) return { score: 75, label: "Good", color: "bg-emerald-500 text-emerald-700" };
    return { score: 100, label: "Strong", color: "bg-emerald-600 text-emerald-800" };
  };
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsUpdatingPassword(true);
    const success = await changePassword(currentPassword, newPassword);
    setIsUpdatingPassword(false);
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };
  const handleVerifyAndActivate2FA = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Please enter the 6-digit verification code from your authenticator app");
      return;
    }
    setIsVerifying2FA(true);
    setTimeout(async () => {
      await toggleTwoFactor(true);
      setIsVerifying2FA(false);
      setIs2FAModalOpen(false);
      setOtpCode("");
      toast.success("Two-factor authentication has been enabled on your account");
    }, 700);
  };
  const handleDeleteAccountConfirm = async () => {
    if (deleteConfirmationText !== "DELETE") {
      toast.error('Please type "DELETE" exactly to confirm account closure');
      return;
    }
    await deleteAccount();
    setIsDeleteAccountModalOpen(false);
    navigate("/");
  };
  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === (user.avatar || "av-1")) || AVATAR_OPTIONS[0];
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      {
    /* Royal Profile Header Banner */
  }
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#380913] via-[#540d1e] to-[#78142b] text-white p-6 sm:p-8 border border-[#881930] shadow-md">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 -mb-10 w-48 h-48 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {
    /* Avatar */
  }
            <div className={`w-20 h-20 rounded-full flex items-center justify-center font-serif text-3xl font-bold shadow-lg border-2 border-amber-300/40 ${currentAvatar.bg}`}>
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 tracking-wide">
                  {user.name}
                </h1>
                {isAdmin ? <span className="text-[11px] font-bold text-amber-900 bg-amber-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Store Manager (Admin)
                  </span> : <span className="text-[11px] font-semibold text-amber-200 bg-black/30 border border-amber-300/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Royal Silk Patron
                  </span>}
                {user.twoFactorEnabled && <span className="text-[11px] font-semibold text-emerald-200 bg-emerald-950/50 border border-emerald-400/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    2FA Secured
                  </span>}
                <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Mobile &amp; Email OTP Verified
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-300 mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-300" />
                  {user.email}
                </span>
                {user.phone && <span className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-amber-300" />
                    +91 {user.phone}
                  </span>}
                <span className="flex items-center gap-1.5 text-amber-200/80">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
    onClick={() => setActiveTab("addresses")}
    className="flex-1 sm:flex-initial px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
  >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Addresses ({user.addresses?.length || 0})</span>
            </button>
            <button
    onClick={logout}
    className="flex-1 sm:flex-initial px-4 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-200 rounded-lg text-xs font-medium border border-rose-800/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
  >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {
    /* Quick Access Badges (Orders, Wishlist, Admin) */
  }
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
    onClick={() => navigate("/my-orders")}
    className="p-4 bg-white border border-stone-200 rounded-xl hover:border-[#881930] hover:shadow-sm transition-all text-left flex items-center justify-between group cursor-pointer"
  >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#881930] flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">My Orders & Tracking</h3>
              <p className="text-xs text-stone-500">Live order journey with stage timeline</p>
            </div>
          </div>
          <span className="text-xs text-[#881930] font-semibold group-hover:translate-x-0.5 transition-transform">
            View &rarr;
          </span>
        </button>

        <button
    onClick={() => navigate("/wishlist")}
    className="p-4 bg-white border border-stone-200 rounded-xl hover:border-[#881930] hover:shadow-sm transition-all text-left flex items-center justify-between group cursor-pointer"
  >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-[#881930] flex items-center justify-center border border-rose-100 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">My Saved Wishlist</h3>
              <p className="text-xs text-stone-500">Saved drapes & quick-buy items</p>
            </div>
          </div>
          <span className="text-xs text-[#881930] font-semibold group-hover:translate-x-0.5 transition-transform">
            View &rarr;
          </span>
        </button>

        {isAdmin ? <button
    onClick={() => navigate("/admin/dashboard")}
    className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl hover:shadow-sm transition-all text-left flex items-center justify-between group cursor-pointer"
  >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-200 text-[#7a520e] flex items-center justify-center border border-amber-300">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 text-sm">Admin Portal</h3>
                <p className="text-xs text-amber-800">Inventory, orders & catalogue</p>
              </div>
            </div>
            <span className="text-xs text-amber-800 font-semibold">&rarr;</span>
          </button> : <button
    onClick={() => setActiveTab("security")}
    className="p-4 bg-white border border-stone-200 rounded-xl hover:border-[#881930] hover:shadow-sm transition-all text-left flex items-center justify-between group cursor-pointer"
  >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 text-sm">Account Security</h3>
                <p className="text-xs text-stone-500">Password, 2FA & sessions</p>
              </div>
            </div>
            <span className="text-xs text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
              Manage &rarr;
            </span>
          </button>}
      </div>

      {
    /* Main Navigation Tabs */
  }
      <div className="border-b border-stone-200">
        <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto pb-1 no-scrollbar">
          <button
    onClick={() => setActiveTab("contact")}
    className={`py-3 px-3 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${activeTab === "contact" ? "border-[#881930] text-[#881930] font-semibold" : "border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300"}`}
  >
            <UserIcon className="w-4 h-4" />
            <span>Contact & Personal Details</span>
          </button>

          <button
    onClick={() => setActiveTab("addresses")}
    className={`py-3 px-3 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${activeTab === "addresses" ? "border-[#881930] text-[#881930] font-semibold" : "border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300"}`}
  >
            <MapPin className="w-4 h-4" />
            <span>Delivery Addresses</span>
            <span className="text-[10px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded-full">
              {user.addresses?.length || 0}
            </span>
          </button>

          <button
    onClick={() => setActiveTab("security")}
    className={`py-3 px-3 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${activeTab === "security" ? "border-[#881930] text-[#881930] font-semibold" : "border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300"}`}
  >
            <Shield className="w-4 h-4" />
            <span>Security & Authentication</span>
            {user.twoFactorEnabled && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
          </button>

          <button
    onClick={() => setActiveTab("preferences")}
    className={`py-3 px-3 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${activeTab === "preferences" ? "border-[#881930] text-[#881930] font-semibold" : "border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300"}`}
  >
            <Bell className="w-4 h-4" />
            <span>Preferences & Silk Club</span>
          </button>
        </nav>
      </div>

      {
    /* TAB 1: CONTACT DETAILS & PERSONAL INFO */
  }
      {activeTab === "contact" && <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSaveContactDetails} className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
              <div className="border-b pb-4">
                <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#881930]" />
                  Contact Information
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Keep your phone and contact details up-to-date for delivery confirmations and courier tracking.
                </p>
              </div>

              {
    /* Avatar Selector */
  }
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Choose Royal Avatar Style
                </label>
                <div className="flex flex-wrap gap-3">
                  {AVATAR_OPTIONS.map((av) => <button
    type="button"
    key={av.id}
    onClick={() => setContactForm({ ...contactForm, avatar: av.id })}
    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border-2 transition-all cursor-pointer ${contactForm.avatar === av.id ? "border-[#881930] bg-rose-50/50 shadow-xs ring-1 ring-[#881930]" : "border-stone-200 bg-white hover:border-stone-300"}`}
  >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${av.bg}`}>
                        {user.name.charAt(0)}
                      </span>
                      <span>{av.label}</span>
                    </button>)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
    label="Full Name *"
    required
    value={contactForm.name}
    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
    placeholder="e.g. Priyanka Sharma"
  />

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
    type="email"
    disabled
    value={contactForm.email}
    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-600 text-sm cursor-not-allowed pr-24"
  />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Primary email used for order receipts and password resets.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Primary Mobile (Indian 10-Digit) *
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-200 bg-stone-50 text-stone-600 text-xs font-mono font-medium">
                      +91
                    </span>
                    <input
    type="tel"
    maxLength={10}
    required
    placeholder="9876543210"
    value={contactForm.phone}
    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value.replace(/\D/g, "") })}
    className="w-full px-3.5 py-2.5 rounded-r-lg border border-stone-200 bg-white text-stone-900 text-sm focus:border-[#881930] focus:ring-1 focus:ring-[#881930] outline-none font-mono"
  />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Used for BlueDart / Delhivery delivery verification & OTPs.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Alternate / Emergency Phone
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-stone-200 bg-stone-50 text-stone-600 text-xs font-mono font-medium">
                      +91
                    </span>
                    <input
    type="tel"
    maxLength={10}
    placeholder="Optional 10-digit number"
    value={contactForm.alternatePhone}
    onChange={(e) => setContactForm({ ...contactForm, alternatePhone: e.target.value.replace(/\D/g, "") })}
    className="w-full px-3.5 py-2.5 rounded-r-lg border border-stone-200 bg-white text-stone-900 text-sm focus:border-[#881930] focus:ring-1 focus:ring-[#881930] outline-none font-mono"
  />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
    value={contactForm.gender}
    onChange={(e) => setContactForm({ ...contactForm, gender: e.target.value })}
    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-900 text-sm focus:border-[#881930] focus:ring-1 focus:ring-[#881930] outline-none"
  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Non-binary / Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
    type="date"
    value={contactForm.dateOfBirth}
    onChange={(e) => setContactForm({ ...contactForm, dateOfBirth: e.target.value })}
    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-900 text-sm focus:border-[#881930] focus:ring-1 focus:ring-[#881930] outline-none"
  />
                  <span className="text-[10px] text-amber-800 font-medium">Earn birthday silk gift voucher</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Wedding Anniversary
                  </label>
                  <input
    type="date"
    value={contactForm.anniversary}
    onChange={(e) => setContactForm({ ...contactForm, anniversary: e.target.value })}
    className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-white text-stone-900 text-sm focus:border-[#881930] focus:ring-1 focus:ring-[#881930] outline-none"
  />
                  <span className="text-[10px] text-amber-800 font-medium">Bridal anniversary perks</span>
                </div>
              </div>

              {
    /* Communication Preferences */
  }
              <div className="pt-4 border-t space-y-3">
                <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                  Order Dispatch & Tracking Alerts
                </h3>

                <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg cursor-pointer hover:bg-stone-100/70 transition-colors">
                  <input
    type="checkbox"
    checked={contactForm.whatsappAlerts}
    onChange={(e) => setContactForm({ ...contactForm, whatsappAlerts: e.target.checked })}
    className="w-4 h-4 mt-0.5 rounded text-[#881930] accent-[#881930] cursor-pointer"
  />
                  <div>
                    <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Receive Real-Time Tracking on WhatsApp
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Get live delivery notifications, courier agent contact details, and OTP directly on your WhatsApp number.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg cursor-pointer hover:bg-stone-100/70 transition-colors">
                  <input
    type="checkbox"
    checked={contactForm.smsTracking}
    onChange={(e) => setContactForm({ ...contactForm, smsTracking: e.target.checked })}
    className="w-4 h-4 mt-0.5 rounded text-[#881930] accent-[#881930] cursor-pointer"
  />
                  <div>
                    <span className="text-xs font-semibold text-stone-900">
                      SMS Dispatch Notifications
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Receive tracking airway bill (AWB) links via SMS when packages leave Varanasi or Kanchipuram loom hubs.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button type="submit" disabled={isSavingContact}>
                  {isSavingContact ? "Saving Changes..." : "Save Contact Details"}
                </Button>
              </div>
            </form>
          </div>

          {
    /* Side Info Cards */
  }
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#fcf9f2] to-[#f7eedc] p-6 rounded-xl border border-amber-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#7a520e]">
                <Sparkles className="w-5 h-5 text-[#b8860b]" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Silk Mark Patron Guarantee
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                As a registered patron of Saree Sansar, all orders placed under your account include authenticated Silk Mark India QR certifications and verified artisan lineage certificates.
              </p>
              <div className="pt-3 border-t border-amber-200/60 text-xs text-stone-700 space-y-1.5 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Complimentary Handloom Gift Box</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Personal Draping & Styling Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free insured express shipping across India</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
              <h4 className="font-semibold text-xs text-stone-800 uppercase tracking-wider">
                Need Help with Details?
              </h4>
              <p className="text-xs text-stone-500">
                Contact our royal concierge team for custom bridal trousseau consultations or shipping address redirection.
              </p>
              <p className="text-xs font-mono text-[#881930] font-semibold">
                concierge@sareesansar.com
              </p>
            </div>
          </div>
        </div>}

      {
    /* TAB 2: SAVED DELIVERY ADDRESSES */
  }
      {activeTab === "addresses" && <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#881930]" />
                  Saved Delivery Addresses
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Save multiple addresses for your home, office, and family gifts. Your default address is automatically chosen at checkout.
                </p>
              </div>
              <Button onClick={handleOpenAddAddress} size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Add New Address
              </Button>
            </div>

            {!user.addresses || user.addresses.length === 0 ? <div className="py-12 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
                <MapPin className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <h3 className="font-serif font-semibold text-stone-800">No delivery addresses saved yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                  Add your primary residential or work address for seamless, 1-click checkout and doorstep deliveries.
                </p>
                <Button onClick={handleOpenAddAddress} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add First Address
                </Button>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.addresses.map((addr) => <div
    key={addr.id}
    className={`p-5 rounded-xl border-2 flex flex-col justify-between transition-all relative ${addr.isDefault ? "border-[#881930] bg-[#881930]/[0.03] shadow-xs" : "border-stone-200 hover:border-stone-300 bg-white"}`}
  >
                    <div>
                      {
    /* Address Header Tag */
  }
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded flex items-center gap-1.5">
                          {addr.type === "HOME" && <Home className="w-3 h-3 text-stone-600" />}
                          {addr.type === "WORK" && <Briefcase className="w-3 h-3 text-stone-600" />}
                          {addr.type === "OTHER" && <MapPin className="w-3 h-3 text-stone-600" />}
                          {addr.type}
                        </span>

                        {addr.isDefault ? <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Default Shipping
                          </span> : <button
    onClick={() => setDefaultAddress(addr.id)}
    className="text-[11px] text-[#881930] hover:text-[#520d1c] font-semibold hover:underline cursor-pointer"
  >
                            Set as Default
                          </button>}
                      </div>

                      {
    /* Recipient and details */
  }
                      <p className="font-semibold text-stone-900 text-sm">{addr.fullName}</p>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {addr.addressLine}
                      </p>
                      {addr.locality && <p className="text-xs text-stone-600">{addr.locality}</p>}
                      {addr.landmark && <p className="text-xs text-stone-500 italic mt-0.5">
                          Landmark: {addr.landmark}
                        </p>}
                      <p className="text-xs text-stone-800 font-medium mt-1">
                        {addr.city}, {addr.state} — <span className="font-mono font-semibold">{addr.pincode}</span>
                      </p>
                      <div className="mt-3 pt-2 border-t border-stone-100 space-y-0.5 text-xs text-stone-500 font-mono">
                        <p>Contact: +91 {addr.phone}</p>
                        {addr.alternatePhone && <p>Alt: +91 {addr.alternatePhone}</p>}
                      </div>
                    </div>

                    {
    /* Action buttons */
  }
                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                      <button
    onClick={() => handleOpenEditAddress(addr)}
    className="text-xs font-semibold text-stone-700 hover:text-[#881930] flex items-center gap-1 cursor-pointer transition-colors"
  >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Address</span>
                      </button>

                      <button
    onClick={() => setDeleteConfirmAddressId(addr.id)}
    className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer transition-colors"
  >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>)}
              </div>}
          </div>
        </div>}

      {
    /* TAB 3: ACCOUNT SECURITY & AUTHENTICATION */
  }
      {activeTab === "security" && <div className="space-y-8">
          {
    /* Change Password Card */
  }
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
            <div className="border-b pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#881930]" />
                  Password Management
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Ensure your account is protected with a strong, distinct password.
                </p>
              </div>
              <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded font-mono">
                SHA-256 Encrypted
              </span>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Current Password *
                </label>
                <div className="relative">
                  <input
    type={showCurrentPass ? "text" : "password"}
    required
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    placeholder="Enter existing password"
    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-900 text-sm focus:border-[#881930] focus:ring-1 focus:ring-[#881930] outline-none pr-10"
  />
                  <button
    type="button"
    onClick={() => setShowCurrentPass(!showCurrentPass)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  New Password *
                </label>
                <div className="relative">
                  <input
    type={showNewPass ? "text" : "password"}
    required
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    placeholder="Minimum 8 characters"
    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-900 text-sm focus:border-[#881930] focus:ring-1 focus:ring-[#881930] outline-none pr-10"
  />
                  <button
    type="button"
    onClick={() => setShowNewPass(!showNewPass)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {
    /* Password Strength Indicator */
  }
                {newPassword && <div className="mt-2.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">Strength:</span>
                      <span className={`font-semibold ${getPasswordStrength().color.split(" ")[1]}`}>
                        {getPasswordStrength().label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
    className={`h-full transition-all duration-300 ${getPasswordStrength().color.split(" ")[0]}`}
    style={{ width: `${getPasswordStrength().score}%` }}
  />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-stone-600">
                      <span className={`flex items-center gap-1 ${passwordLengthOk ? "text-emerald-700 font-semibold" : ""}`}>
                        <Check className={`w-3 h-3 ${passwordLengthOk ? "text-emerald-600" : "text-stone-300"}`} />
                        8+ characters
                      </span>
                      <span className={`flex items-center gap-1 ${passwordHasUpper ? "text-emerald-700 font-semibold" : ""}`}>
                        <Check className={`w-3 h-3 ${passwordHasUpper ? "text-emerald-600" : "text-stone-300"}`} />
                        Uppercase letter
                      </span>
                      <span className={`flex items-center gap-1 ${passwordHasNumber ? "text-emerald-700 font-semibold" : ""}`}>
                        <Check className={`w-3 h-3 ${passwordHasNumber ? "text-emerald-600" : "text-stone-300"}`} />
                        Number (0-9)
                      </span>
                      <span className={`flex items-center gap-1 ${passwordHasSpecial ? "text-emerald-700 font-semibold" : ""}`}>
                        <Check className={`w-3 h-3 ${passwordHasSpecial ? "text-emerald-600" : "text-stone-300"}`} />
                        Special symbol (!@#)
                      </span>
                    </div>
                  </div>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password *
                </label>
                <input
    type="password"
    required
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Re-enter new password"
    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-900 text-sm focus:border-[#881930] focus:ring-1 focus:ring-[#881930] outline-none"
  />
              </div>

              <Button type="submit" disabled={isUpdatingPassword} size="sm">
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>

          {
    /* Two-Factor Authentication Card */
  }
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#881930]" />
                  <h2 className="font-serif font-bold text-xl text-stone-900">
                    Two-Factor Authentication (2FA)
                  </h2>
                  {user.twoFactorEnabled ? <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Enabled
                    </span> : <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Add an extra layer of protection when logging into your account.
                </p>
              </div>

              {user.twoFactorEnabled ? <Button
    onClick={() => toggleTwoFactor(false)}
    variant="outline"
    size="sm"
    className="text-rose-600 border-rose-200 hover:bg-rose-50"
  >
                  Disable 2FA
                </Button> : <Button
    onClick={() => setIs2FAModalOpen(true)}
    size="sm"
    className="bg-emerald-700 hover:bg-emerald-800 text-white"
  >
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  Enable Two-Factor Auth
                </Button>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#881930]" />
                  Authenticator Apps Supported
                </span>
                <p className="text-stone-500 text-[11px] leading-relaxed">
                  Google Authenticator, Microsoft Authenticator, Authy, or Apple Keychain TOTP.
                </p>
              </div>
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-[#881930]" />
                  Emergency Backup Codes
                </span>
                <p className="text-stone-500 text-[11px] leading-relaxed">
                  Single-use recovery codes to regain access in case you lose your phone.
                </p>
              </div>
            </div>
          </div>

          {
    /* Active Devices & Sessions */
  }
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-[#881930]" />
                  Active Login Sessions
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Devices that are currently signed into your Saree Sansar account.
                </p>
              </div>
              <Button
    onClick={terminateOtherSessions}
    variant="outline"
    size="sm"
    className="text-stone-700"
  >
                Log Out All Other Devices
              </Button>
            </div>

            <div className="space-y-3">
              {(user.activeSessions && user.activeSessions.length > 0 ? user.activeSessions : [
    {
      id: "sess-curr",
      device: "Current Browser / Web Device",
      browser: "Chrome 131",
      location: "New Delhi, India",
      ip: "103.21.244.18",
      lastActive: "Active Now",
      isCurrent: true
    }
  ]).map((sess) => <div
    key={sess.id}
    className="p-4 rounded-lg border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/50"
  >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                      {sess.device.includes("iPhone") || sess.device.includes("Android") ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-stone-900 text-xs sm:text-sm">
                          {sess.device}
                        </p>
                        {sess.isCurrent && <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            This Device
                          </span>}
                      </div>
                      <p className="text-xs text-stone-500 font-mono mt-0.5">
                        {sess.browser} &bull; {sess.location} &bull; IP: {sess.ip}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-stone-500 font-mono">
                    {sess.lastActive}
                  </span>
                </div>)}
            </div>
          </div>

          {
    /* Security Activity Logs */
  }
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
            <div className="border-b pb-4">
              <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#881930]" />
                Recent Security Activity
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Audit trail of recent logins, password updates, and address modifications.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-stone-400 font-mono uppercase tracking-wider">
                    <th className="py-2.5 px-3">Event</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Location & IP</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {(user.securityLogs && user.securityLogs.length > 0 ? user.securityLogs : [
    {
      id: "log-1",
      event: "Web Portal Login",
      timestamp: "Today, 09:12 AM",
      ip: "103.21.244.18",
      location: "New Delhi, India",
      status: "SUCCESS"
    }
  ]).map((log) => <tr key={log.id} className="hover:bg-stone-50/60">
                      <td className="py-3 px-3 font-semibold text-stone-800">{log.event}</td>
                      <td className="py-3 px-3 text-stone-500 font-mono">{log.timestamp}</td>
                      <td className="py-3 px-3 text-stone-500 font-mono">
                        {log.location} ({log.ip})
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {log.status}
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>

          {
    /* Danger Zone: Account Closure */
  }
          <div className="bg-rose-50/50 p-6 sm:p-8 rounded-xl border border-rose-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h2 className="font-serif font-bold text-lg">Danger Zone</h2>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
              Permanently delete your Saree Sansar account, saved addresses, wishlist items, and order history. This action cannot be undone.
            </p>
            <div>
              <Button
    onClick={() => setIsDeleteAccountModalOpen(true)}
    variant="outline"
    size="sm"
    className="text-rose-700 border-rose-300 hover:bg-rose-100"
  >
                Delete Account
              </Button>
            </div>
          </div>
        </div>}

      {
    /* TAB 4: PREFERENCES & SILK CLUB */
  }
      {activeTab === "preferences" && <div className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b pb-4">
            <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#881930]" />
              Patron Preferences & Silk Club
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Customize your heirloom saree recommendations and artisan alerts.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Preferred Handloom Fabrics
              </label>
              <div className="flex flex-wrap gap-2">
                {["Banarasi Silk", "Kanjivaram Silk", "Chanderi & Organza", "Tussar Silk", "Jamdani Cotton", "Georgette Brocade"].map(
    (fab) => <span
      key={fab}
      className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#f5eedf] text-[#6b1426] border border-[#e2d5bc]"
    >
                      {fab}
                    </span>
  )}
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                Exclusive Silk Drop Notifications
              </h3>
              <p className="text-xs text-stone-600">
                Receive first-look alerts 12 hours before new Varanasi and Kanchipuram master-weaver collections are released publicly.
              </p>
              <Button onClick={() => toast.success("Preferences saved successfully")} size="sm">
                Save Preferences
              </Button>
            </div>
          </div>
        </div>}

      {
    /* MODAL: ADD / EDIT DELIVERY ADDRESS WITH MOBILE OTP & DB PERSISTENCE */
  }
      <AddressModalWithOtp
    isOpen={isAddressModalOpen}
    onClose={() => {
      setIsAddressModalOpen(false);
      setEditingAddressId(null);
    }}
    onSuccess={() => {
      setIsAddressModalOpen(false);
      setEditingAddressId(null);
    }}
    initialAddress={editingAddressId ? user?.addresses?.find((a) => a.id === editingAddressId) : null}
    title={editingAddressId ? "\u0921\u093F\u0932\u0940\u0935\u0930\u0940 \u092A\u0924\u093E \u092C\u0926\u0932\u0947\u0902 (Edit Address)" : "\u0928\u092F\u093E \u0921\u093F\u0932\u0940\u0935\u0930\u0940 \u092A\u0924\u093E \u091C\u094B\u0921\u093C\u0947\u0902 (Add Delivery Address)"}
  />

      {
    /* MODAL: DELETE ADDRESS CONFIRMATION */
  }
      <Modal
    isOpen={!!deleteConfirmAddressId}
    onClose={() => setDeleteConfirmAddressId(null)}
    title="Remove Delivery Address"
    maxWidth="sm"
  >
        <div className="space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Are you sure you want to remove this delivery address from your profile? This cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button
    type="button"
    variant="outline"
    onClick={() => setDeleteConfirmAddressId(null)}
  >
              Cancel
            </Button>
            <Button
    type="button"
    onClick={handleConfirmDeleteAddress}
    className="bg-rose-700 hover:bg-rose-800 text-white"
  >
              Delete Address
            </Button>
          </div>
        </div>
      </Modal>

      {
    /* MODAL: 2FA SETUP WIZARD */
  }
      <Modal
    isOpen={is2FAModalOpen}
    onClose={() => setIs2FAModalOpen(false)}
    title="Set Up Two-Factor Authentication (2FA)"
    maxWidth="md"
  >
        <div className="space-y-5">
          <p className="text-xs text-stone-600 leading-relaxed">
            Scan this QR code using Google Authenticator, Microsoft Authenticator, or 1Password on your mobile device.
          </p>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center justify-center space-y-3">
            <div className="w-44 h-44 bg-white p-3 rounded-lg border border-stone-300 shadow-xs flex flex-col items-center justify-center">
              <QrCode className="w-36 h-36 text-stone-800" />
            </div>
            <div className="text-center">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                Secret Setup Key:
              </span>
              <p className="font-mono text-xs font-bold text-stone-800 select-all mt-0.5">
                SAR-SANS-7789-QZ24
              </p>
            </div>
          </div>

          {
    /* Backup recovery codes */
  }
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">Backup Emergency Codes:</span>
              <button
    type="button"
    onClick={() => {
      navigator.clipboard.writeText(backupCodes.join(", "));
      toast.success("Backup codes copied to clipboard");
    }}
    className="text-[11px] text-[#881930] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
  >
                <Copy className="w-3 h-3" />
                Copy Codes
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-2.5 bg-stone-100 rounded-lg font-mono text-[11px] text-stone-700">
              {backupCodes.map((c, i) => <span key={i}>{c}</span>)}
            </div>
          </div>

          <form onSubmit={handleVerifyAndActivate2FA} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Enter 6-Digit App Code to Confirm:
              </label>
              <input
    type="text"
    maxLength={6}
    required
    placeholder="e.g. 123456"
    value={otpCode}
    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-900 text-center tracking-widest text-lg font-mono font-bold focus:border-[#881930] outline-none"
  />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <Button
    type="button"
    variant="outline"
    onClick={() => setIs2FAModalOpen(false)}
  >
                Cancel
              </Button>
              <Button type="submit" disabled={isVerifying2FA}>
                {isVerifying2FA ? "Verifying..." : "Activate 2FA"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {
    /* MODAL: DELETE ACCOUNT CONFIRMATION */
  }
      <Modal
    isOpen={isDeleteAccountModalOpen}
    onClose={() => setIsDeleteAccountModalOpen(false)}
    title="Permanently Delete Account"
    maxWidth="sm"
  >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
            <strong className="block mb-1">Warning: Irreversible Action</strong>
            All your saved addresses, past orders, and royal member points will be wiped out immediately.
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Type <span className="font-mono text-rose-700 font-bold">DELETE</span> to confirm:
            </label>
            <input
    type="text"
    value={deleteConfirmationText}
    onChange={(e) => setDeleteConfirmationText(e.target.value)}
    placeholder="DELETE"
    className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono text-sm focus:border-rose-600 outline-none"
  />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button
    type="button"
    variant="outline"
    onClick={() => setIsDeleteAccountModalOpen(false)}
  >
              Cancel
            </Button>
            <Button
    type="button"
    onClick={handleDeleteAccountConfirm}
    disabled={deleteConfirmationText !== "DELETE"}
    className="bg-rose-700 hover:bg-rose-800 text-white disabled:opacity-50"
  >
              Confirm Account Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>;
};
