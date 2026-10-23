import apiClient from "./api";
export const authService = {
  async register(name, email, phone, password, otp) {
    const res = await apiClient.post("/auth/register", { name, email, phone, password, otp });
    return res.data;
  },
  async login(email, password, asAdmin = false) {
    const res = await apiClient.post("/auth/login", { email, password, asAdmin });
    return res.data;
  },
  async loginWithOtp(phone, otp) {
    const res = await apiClient.post("/auth/login-otp", { phone, otp });
    return res.data;
  },
  async verifyPhone(userId, phone, otp) {
    const res = await apiClient.post("/auth/verify-phone", { userId, phone, otp });
    return res.data;
  },
  async getUserById(userId) {
    const res = await apiClient.get(`/auth/user/${userId}`);
    return res.data;
  },
  async sendOtp(identifier, type = "phone", purpose = "register") {
    const res = await apiClient.post("/auth/send-otp", { identifier, type, purpose });
    return res.data;
  },
  async verifyOtp(identifier, otp, purpose = "register") {
    const res = await apiClient.post("/auth/verify-otp", { identifier, otp, purpose });
    return res.data;
  },
  async resetPasswordWithOtp(identifier, otp, newPassword) {
    const res = await apiClient.post("/auth/forgot-password/reset", { identifier, otp, newPassword });
    return res.data;
  },
  async getMe() {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },
  async updateProfile(id, updates) {
    const res = await apiClient.put("/auth/profile", { id, ...updates });
    return res.data;
  },
  async addAddress(userId, address) {
    const res = await apiClient.post("/auth/addresses", { userId, address });
    return res.data;
  },
  async saveAddressWithOtp(address, phone, otp, userId) {
    const res = await apiClient.post("/auth/save-address-with-otp", { address, phone, otp, userId });
    return res.data;
  },
  async updateAddress(userId, addressId, address) {
    const res = await apiClient.put(`/auth/addresses/${addressId}`, { userId, address });
    return res.data;
  },
  async deleteAddress(userId, addressId) {
    const res = await apiClient.delete(`/auth/addresses/${addressId}`, { data: { userId } });
    return res.data;
  },
  async setDefaultAddress(userId, addressId) {
    const res = await apiClient.put(`/auth/addresses/${addressId}/default`, { userId });
    return res.data;
  },
  async changePassword(userId, currentPass, newPass) {
    const res = await apiClient.put("/auth/security/password", { userId, currentPass, newPass });
    return res.data;
  },
  async toggleTwoFactor(userId, enabled) {
    const res = await apiClient.put("/auth/security/2fa", { userId, enabled });
    return res.data;
  }
};
export default authService;
