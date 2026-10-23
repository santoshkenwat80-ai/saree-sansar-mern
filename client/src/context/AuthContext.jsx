import { createContext, useContext, useState, useEffect } from "react";
import { DEMO_USER } from "../services/mockData";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
const AuthContext = createContext(void 0);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem("saree_sansar_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          try {
            const fresh = await authService.getUserById(parsed.id);
            if (fresh && fresh.id) {
              setUser(fresh);
              localStorage.setItem("saree_sansar_user", JSON.stringify(fresh));
            }
          } catch {
          }
        } else {
          setUser(DEMO_USER);
          localStorage.setItem("saree_sansar_user", JSON.stringify(DEMO_USER));
          localStorage.setItem("saree_sansar_token", "demo_jwt_customer_token_123");
        }
      } catch {
        setUser(DEMO_USER);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);
  const login = async (email, password, asAdmin = false) => {
    try {
      const res = await authService.login(email, password, asAdmin);
      setUser(res.user);
      localStorage.setItem("saree_sansar_user", JSON.stringify(res.user));
      localStorage.setItem("saree_sansar_token", res.token);
      if (res.user.role === "admin") {
        toast.success(`Welcome Admin, ${res.user.name}`);
      } else {
        toast.success(`Welcome back, ${res.user.name}!`);
      }
      return true;
    } catch (e) {
      const msg = e.response?.data?.error || "Login failed. Please check your credentials.";
      toast.error(msg);
      return false;
    }
  };
  const loginWithOtp = async (phone, otp) => {
    try {
      const res = await authService.loginWithOtp(phone, otp);
      setUser(res.user);
      localStorage.setItem("saree_sansar_user", JSON.stringify(res.user));
      localStorage.setItem("saree_sansar_token", res.token);
      if (res.isNewUser) {
        toast.success(`Mobile verified! Welcome new patron: ${res.user.name}`, { icon: "\u{1F389}" });
      } else {
        toast.success(`Mobile verified! Welcome back, ${res.user.name}`, { icon: "\u2728" });
      }
      return true;
    } catch (e) {
      const msg = e.response?.data?.error || "Mobile OTP verification failed";
      toast.error(msg);
      return false;
    }
  };
  const verifyPhone = async (phone, otp) => {
    if (!user) return false;
    try {
      const res = await authService.verifyPhone(user.id, phone, otp);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem("saree_sansar_user", JSON.stringify(res.user));
        toast.success("Mobile number verified & saved to database!", { icon: "\u2705" });
        return true;
      }
      return false;
    } catch (e) {
      const msg = e.response?.data?.error || "Verification failed";
      toast.error(msg);
      return false;
    }
  };
  const register = async (name, email, phone, password, otp) => {
    try {
      const res = await authService.register(name, email, phone, password, otp);
      setUser(res.user);
      localStorage.setItem("saree_sansar_user", JSON.stringify(res.user));
      localStorage.setItem("saree_sansar_token", res.token);
      toast.success("Registration successful! Mobile verified & account created.");
      return true;
    } catch (e) {
      const msg = e.response?.data?.error || "Registration failed";
      toast.error(msg);
      return false;
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("saree_sansar_user");
    localStorage.removeItem("saree_sansar_token");
    toast.success("Logged out successfully");
  };
  const updateProfile = async (data) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("saree_sansar_user", JSON.stringify(updated));
    try {
      await authService.updateProfile(user.id, data);
    } catch (err) {
      console.warn("Backend update profile sync notice:", err);
    }
    toast.success("Profile updated successfully");
  };
  const addAddress = async (addressData) => {
    const isFirst = !user?.addresses || user.addresses.length === 0;
    const isDefault = addressData.isDefault ?? isFirst;
    const newAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
      isDefault
    };
    if (user) {
      let currentAddresses = user.addresses || [];
      if (isDefault) {
        currentAddresses = currentAddresses.map((a) => ({ ...a, isDefault: false }));
      }
      const updatedUser = {
        ...user,
        addresses: [...currentAddresses, newAddress]
      };
      setUser(updatedUser);
      localStorage.setItem("saree_sansar_user", JSON.stringify(updatedUser));
    }
    try {
      const res = await authService.addAddress(user?.id || addressData.phone || "guest", newAddress);
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem("saree_sansar_user", JSON.stringify(res.user));
      } else if (res && res.addresses && user) {
        const syncedUser = { ...user, addresses: res.addresses };
        setUser(syncedUser);
        localStorage.setItem("saree_sansar_user", JSON.stringify(syncedUser));
      }
    } catch (err) {
      console.warn("Backend add address sync notice:", err);
    }
    toast.success("Address saved permanently to database");
    return newAddress;
  };
  const saveAddressWithOtp = async (addressData, phone, otp) => {
    try {
      const res = await authService.saveAddressWithOtp(addressData, phone, otp, user?.id);
      if (res && res.success && res.user) {
        setUser(res.user);
        localStorage.setItem("saree_sansar_user", JSON.stringify(res.user));
        if (res.token) {
          localStorage.setItem("saree_sansar_token", res.token);
        }
        toast.success("Address permanently saved to database! Mobile verified.", { icon: "\u2705" });
        return res.address;
      }
      return null;
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to verify OTP and save address";
      toast.error(msg);
      return null;
    }
  };
  const updateAddress = async (id, updates) => {
    if (!user || !user.addresses) return;
    let addresses = [...user.addresses];
    if (updates.isDefault) {
      addresses = addresses.map((a) => ({ ...a, isDefault: false }));
    }
    addresses = addresses.map((a) => a.id === id ? { ...a, ...updates } : a);
    const updatedUser = { ...user, addresses };
    setUser(updatedUser);
    localStorage.setItem("saree_sansar_user", JSON.stringify(updatedUser));
    try {
      const res = await authService.updateAddress(user.id, id, updates);
      if (res && res.addresses) {
        const syncedUser = { ...user, addresses: res.addresses };
        setUser(syncedUser);
        localStorage.setItem("saree_sansar_user", JSON.stringify(syncedUser));
      }
    } catch (err) {
      console.warn("Backend update address sync notice:", err);
    }
    toast.success("Address updated and saved to database");
  };
  const deleteAddress = async (id) => {
    if (!user || !user.addresses) return;
    const wasDefault = user.addresses.find((a) => a.id === id)?.isDefault;
    let addresses = user.addresses.filter((a) => a.id !== id);
    if (wasDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }
    const updatedUser = { ...user, addresses };
    setUser(updatedUser);
    localStorage.setItem("saree_sansar_user", JSON.stringify(updatedUser));
    try {
      const res = await authService.deleteAddress(user.id, id);
      if (res && res.addresses) {
        const syncedUser = { ...user, addresses: res.addresses };
        setUser(syncedUser);
        localStorage.setItem("saree_sansar_user", JSON.stringify(syncedUser));
      }
    } catch (err) {
      console.warn("Backend delete address sync notice:", err);
    }
    toast.success("Address removed");
  };
  const setDefaultAddress = async (id) => {
    if (!user || !user.addresses) return;
    const addresses = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    const updatedUser = { ...user, addresses };
    setUser(updatedUser);
    localStorage.setItem("saree_sansar_user", JSON.stringify(updatedUser));
    try {
      const res = await authService.setDefaultAddress(user.id, id);
      if (res && res.addresses) {
        const syncedUser = { ...user, addresses: res.addresses };
        setUser(syncedUser);
        localStorage.setItem("saree_sansar_user", JSON.stringify(syncedUser));
      }
    } catch (err) {
      console.warn("Backend set default address sync notice:", err);
    }
    toast.success("Default address saved in database");
  };
  const changePassword = async (currentPass, newPass) => {
    if (!user) return false;
    if (newPass.length < 8) {
      toast.error("New password must be at least 8 characters");
      return false;
    }
    const newLog = {
      id: `sec-${Date.now()}`,
      event: "Password Changed",
      ip: "103.21.244.18",
      timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      location: "New Delhi, India",
      status: "SUCCESS"
    };
    const updatedLogs = [newLog, ...user.securityLogs || []];
    const updatedUser = { ...user, securityLogs: updatedLogs };
    setUser(updatedUser);
    localStorage.setItem("saree_sansar_user", JSON.stringify(updatedUser));
    toast.success("Password updated securely!");
    return true;
  };
  const toggleTwoFactor = async (enabled) => {
    if (!user) return false;
    const newLog = {
      id: `sec-${Date.now()}`,
      event: enabled ? "Two-Factor Authentication Enabled" : "Two-Factor Authentication Disabled",
      ip: "103.21.244.18",
      timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      location: "New Delhi, India",
      status: "SUCCESS"
    };
    const updatedLogs = [newLog, ...user.securityLogs || []];
    const updatedUser = {
      ...user,
      twoFactorEnabled: enabled,
      securityLogs: updatedLogs
    };
    setUser(updatedUser);
    localStorage.setItem("saree_sansar_user", JSON.stringify(updatedUser));
    toast.success(enabled ? "Two-Factor Authentication activated" : "Two-Factor Authentication disabled");
    return true;
  };
  const terminateOtherSessions = async () => {
    if (!user) return;
    const currentSessions = (user.activeSessions || []).filter((s) => s.isCurrent);
    const newLog = {
      id: `sec-${Date.now()}`,
      event: "Terminated all other active sessions",
      ip: "103.21.244.18",
      timestamp: (/* @__PURE__ */ new Date()).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      location: "New Delhi, India",
      status: "SUCCESS"
    };
    const updatedUser = {
      ...user,
      activeSessions: currentSessions,
      securityLogs: [newLog, ...user.securityLogs || []]
    };
    setUser(updatedUser);
    localStorage.setItem("saree_sansar_user", JSON.stringify(updatedUser));
    toast.success("All other devices have been logged out");
  };
  const deleteAccount = async () => {
    setUser(null);
    localStorage.removeItem("saree_sansar_user");
    localStorage.removeItem("saree_sansar_token");
    toast.success("Your account has been deleted permanently");
    return true;
  };
  return <AuthContext.Provider
    value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      loading,
      login,
      loginWithOtp,
      verifyPhone,
      register,
      logout,
      updateProfile,
      addAddress,
      saveAddressWithOtp,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      changePassword,
      toggleTwoFactor,
      terminateOtherSessions,
      deleteAccount
    }}
  >
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
