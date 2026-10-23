import { Router } from "express";
import { db } from '../db.js';
import { User } from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
const router = Router();
const otpStore = /* @__PURE__ */ new Map();
const sanitizeIdentifier = (id) => id.toLowerCase().replace(/[^a-z0-9@._-]/g, "").trim();
router.post("/send-otp", async (req, res) => {
  try {
    const { identifier, type = "phone", purpose = "register" } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: "Mobile number or email is required" });
    }
    const cleanId = sanitizeIdentifier(identifier);
    if (purpose === "register") {
      const existing = db.users.find(
        (u) => u.email.toLowerCase() === cleanId || u.phone && sanitizeIdentifier(u.phone) === cleanId
      );
      if (existing) {
        return res.status(400).json({
          error: type === "phone" ? "This mobile number is already registered. Please sign in or use Forgot Password." : "This email is already registered. Please sign in."
        });
      }
    }
    if (purpose === "forgot_password") {
      let existing = db.users.find(
        (u) => u.email.toLowerCase() === cleanId || u.phone && sanitizeIdentifier(u.phone) === cleanId
      );
      if (!existing && isMongoConnected()) {
        try {
          existing = await User.findOne({
            $or: [{ email: cleanId }, { phone: cleanId }]
          });
        } catch (e) {
          console.warn("MongoDB search notice:", e);
        }
      }
      if (!existing) {
        return res.status(404).json({
          error: "No account found with this mobile number or email. Please register first."
        });
      }
    }
    const existingUser = db.users.find(
      (u) => u.email?.toLowerCase() === cleanId || u.phone && sanitizeIdentifier(u.phone) === cleanId
    );
    const code = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = Date.now() + 10 * 60 * 1e3;
    otpStore.set(cleanId, { code, expiresAt, purpose });
    const smsText = `Your Saree Sansar verification OTP is: ${code}. Valid for 10 minutes. Do not share this OTP with anyone.`;
    let realSmsDispatched = false;
    let gatewayUsed = "SMS Simulator";
    if (process.env.FAST2SMS_API_KEY && cleanId.length === 10) {
      try {
        const fRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            route: "otp",
            variables_values: code,
            numbers: cleanId
          })
        });
        const fData = await fRes.json();
        if (fData && fData.return) {
          realSmsDispatched = true;
          gatewayUsed = "Fast2SMS (Direct Cellular)";
          console.log(`\u{1F4F1} [Fast2SMS Success] Cellular SMS sent to +91 ${cleanId}`);
        }
      } catch (smsErr) {
        console.warn("Fast2SMS dispatch notice:", smsErr);
      }
    }
    if (!realSmsDispatched && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
        const form = new URLSearchParams({
          To: `+91${cleanId}`,
          From: process.env.TWILIO_PHONE_NUMBER,
          Body: smsText
        });
        const tRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: form.toString()
        });
        const tData = await tRes.json();
        if (tData && tData.sid) {
          realSmsDispatched = true;
          gatewayUsed = "Twilio Cellular";
          console.log(`\u{1F4F1} [Twilio Success] Cellular SMS sent to +91 ${cleanId}`);
        }
      } catch (tErr) {
        console.warn("Twilio dispatch notice:", tErr);
      }
    }
    console.log(`
========================================================`);
    console.log(`\u{1F4E8} [SMS GATEWAY DISPATCH: ${gatewayUsed}]`);
    console.log(`Target Mobile / Identifier: ${identifier}`);
    console.log(`Purpose: ${purpose.toUpperCase()}`);
    console.log(`6-Digit OTP Code: >>> ${code} <<< (Valid for 10 minutes)`);
    console.log(`Real Cellular SMS Dispatched: ${realSmsDispatched ? "YES" : "NO (Simulator Active)"}`);
    console.log(`User Exists in DB: ${existingUser ? `Yes (${existingUser.name})` : "No (New Customer)"}`);
    console.log(`========================================================
`);
    const whatsappText = encodeURIComponent(`Your Saree Sansar verification OTP is: ${code}. Valid for 10 minutes. Do not share with anyone.`);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanId}&text=${whatsappText}`;
    const smsUrl = `sms:+91${cleanId}?body=${whatsappText}`;
    res.json({
      success: true,
      message: realSmsDispatched ? `OTP sent to your mobile phone +91 ${cleanId} via cellular network!` : `OTP sent successfully to +91 ${cleanId}!`,
      otp: code,
      // returned for immediate high-visibility SMS alert and 1-click verification
      expiresIn: 600,
      userExists: !!existingUser,
      realSmsDispatched,
      gateway: gatewayUsed,
      whatsappUrl,
      smsUrl
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});
router.post("/verify-otp", (req, res) => {
  const { identifier, otp, purpose } = req.body;
  if (!identifier || !otp) {
    return res.status(400).json({ error: "Identifier and OTP are required" });
  }
  const cleanId = sanitizeIdentifier(identifier);
  const record = otpStore.get(cleanId);
  if (!record) {
    return res.status(400).json({ error: "No active OTP found. Please request a new OTP code." });
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanId);
    return res.status(400).json({ error: "OTP has expired. Please request a new code." });
  }
  if (record.code !== otp.trim()) {
    return res.status(400).json({ error: "Incorrect OTP entered. Please check and try again." });
  }
  if (purpose && record.purpose !== purpose) {
    return res.status(400).json({ error: "Invalid OTP purpose" });
  }
  res.json({ success: true, message: "OTP verified successfully" });
});
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Name, email, mobile phone, and password are required" });
    }
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = sanitizeIdentifier(phone);
    if (otp) {
      const record = otpStore.get(cleanPhone) || otpStore.get(cleanEmail);
      if (!record || record.code !== otp.trim()) {
        return res.status(400).json({ error: "Invalid or expired mobile OTP. Please verify your phone number." });
      }
      otpStore.delete(cleanPhone);
      otpStore.delete(cleanEmail);
    }
    let existingUser = db.users.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.phone && sanitizeIdentifier(u.phone) === cleanPhone
    );
    if (!existingUser && isMongoConnected()) {
      try {
        existingUser = await User.findOne({
          $or: [{ email: cleanEmail }, { phone: cleanPhone }]
        });
      } catch (e) {
        console.warn("MongoDB user lookup notice:", e);
      }
    }
    if (existingUser) {
      return res.status(400).json({ error: "Email or Mobile number is already registered. Please sign in." });
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      phone: phone.trim(),
      isPhoneVerified: true,
      isEmailVerified: true,
      role: "customer",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      addresses: []
    };
    db.users.push(newUser);
    db.save();
    if (isMongoConnected()) {
      try {
        await User.create({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          phone: newUser.phone,
          isPhoneVerified: true,
          isEmailVerified: true,
          role: newUser.role,
          addresses: newUser.addresses
        });
        console.log(`\u2705 [MongoDB Atlas] New Verified Customer saved: ${newUser.email} (${newUser.phone})`);
      } catch (mongoErr) {
        console.error("\u274C Error saving user to MongoDB:", mongoErr);
      }
    }
    const token = `jwt_token_${newUser.id}_${Date.now()}`;
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register account" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password, asAdmin } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "User ID (Email or Phone) and Password are required" });
    }
    const cleanInput = email.toLowerCase().trim();
    const cleanNumeric = sanitizeIdentifier(email);
    if (asAdmin || cleanInput === "admin@sareesansar.com") {
      let admin = db.users.find((u) => u.role === "admin");
      if (!admin && isMongoConnected()) {
        admin = await User.findOne({ role: "admin" });
      }
      if (!admin) {
        return res.status(401).json({ error: "Admin account not found" });
      }
      if (admin.password && admin.password !== password) {
        return res.status(401).json({ error: "Incorrect Admin Password. Access denied." });
      }
      const token2 = `jwt_token_admin_${Date.now()}`;
      return res.json({ user: admin, token: token2 });
    }
    let user = db.users.find(
      (u) => u.email.toLowerCase() === cleanInput || u.phone && sanitizeIdentifier(u.phone) === cleanNumeric
    );
    if (!user && isMongoConnected()) {
      user = await User.findOne({
        $or: [{ email: cleanInput }, { phone: cleanNumeric }]
      });
    }
    if (!user) {
      return res.status(401).json({
        error: "User ID / Email not registered. Please create an account or verify your details."
      });
    }
    if (!user.password || user.password !== password) {
      return res.status(401).json({
        error: "Incorrect Password. Please enter the correct password or reset it via Mobile OTP."
      });
    }
    const token = `jwt_token_user_${user.id}_${Date.now()}`;
    res.json({ user, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});
router.post("/login-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: "Mobile number and OTP are required" });
    }
    const cleanPhone = sanitizeIdentifier(phone);
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: "Please enter a valid 10-digit mobile number" });
    }
    const record = otpStore.get(cleanPhone);
    if (!record) {
      return res.status(400).json({ error: "No active OTP found. Please request an OTP on your mobile number first." });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanPhone);
      return res.status(400).json({ error: "OTP has expired. Please request a new code." });
    }
    if (record.code !== otp.trim()) {
      return res.status(400).json({ error: "Incorrect OTP entered. Please verify and try again." });
    }
    otpStore.delete(cleanPhone);
    let user = db.users.find((u) => u.phone && sanitizeIdentifier(u.phone) === cleanPhone);
    if (!user && isMongoConnected()) {
      try {
        user = await User.findOne({ phone: cleanPhone });
      } catch (e) {
        console.warn("MongoDB search notice:", e);
      }
    }
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = {
        id: `usr-${Date.now()}`,
        name: `Patron ${cleanPhone.slice(-4)}`,
        email: `${cleanPhone}@sareesansar.patron`,
        phone: cleanPhone,
        isPhoneVerified: true,
        isEmailVerified: false,
        role: "customer",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        addresses: []
      };
      db.users.push(user);
      db.save();
      if (isMongoConnected()) {
        try {
          await User.create(user);
          console.log(`\u2705 [MongoDB Atlas] Auto-registered mobile customer: ${cleanPhone}`);
        } catch (e) {
          console.error("MongoDB creation notice:", e);
        }
      }
    } else {
      user.isPhoneVerified = true;
      db.save();
    }
    const token = `jwt_token_user_${user.id}_${Date.now()}`;
    console.log(`\u2705 Customer Mobile OTP Login verified: ${user.name} (${cleanPhone})`);
    res.json({
      success: true,
      user,
      token,
      isNewUser,
      message: "Mobile number verified successfully! Welcome to Saree Sansar."
    });
  } catch (error) {
    console.error("Login OTP error:", error);
    res.status(500).json({ error: "Failed to verify mobile OTP" });
  }
});
router.post("/verify-phone", async (req, res) => {
  try {
    const { userId, phone, otp } = req.body;
    if (!userId || !phone || !otp) {
      return res.status(400).json({ error: "User ID, phone, and OTP are required" });
    }
    const cleanPhone = sanitizeIdentifier(phone);
    const record = otpStore.get(cleanPhone);
    if (!record || record.code !== otp.trim()) {
      return res.status(400).json({ error: "Invalid or expired OTP code" });
    }
    otpStore.delete(cleanPhone);
    const user = findUserByIdentifier(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.phone = phone.trim();
    user.isPhoneVerified = true;
    db.save();
    if (isMongoConnected()) {
      try {
        await User.findOneAndUpdate(
          { email: user.email },
          { phone: user.phone, isPhoneVerified: true }
        );
      } catch (e) {
        console.warn("MongoDB notice:", e);
      }
    }
    res.json({ success: true, message: "Mobile number verified and saved permanently!", user });
  } catch (error) {
    console.error("Verify phone error:", error);
    res.status(500).json({ error: "Failed to verify phone" });
  }
});
router.post("/forgot-password/reset", async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;
    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ error: "Mobile number/email, OTP, and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }
    const cleanId = sanitizeIdentifier(identifier);
    const record = otpStore.get(cleanId);
    if (!record) {
      return res.status(400).json({ error: "No active OTP session found. Please request an OTP first." });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanId);
      return res.status(400).json({ error: "OTP has expired. Please request a new code." });
    }
    if (record.code !== otp.trim()) {
      return res.status(400).json({ error: "Incorrect OTP entered. Please check and try again." });
    }
    let user = db.users.find(
      (u) => u.email.toLowerCase() === cleanId || u.phone && sanitizeIdentifier(u.phone) === cleanId
    );
    if (!user && isMongoConnected()) {
      user = await User.findOne({
        $or: [{ email: cleanId }, { phone: cleanId }]
      });
    }
    if (!user) {
      return res.status(404).json({ error: "User account not found" });
    }
    user.password = newPassword;
    db.save();
    if (isMongoConnected()) {
      try {
        await User.findOneAndUpdate(
          { $or: [{ email: user.email }, { phone: user.phone }] },
          { password: newPassword }
        );
        console.log(`\u2705 [MongoDB Atlas] Password updated for: ${user.email} (${user.phone})`);
      } catch (e) {
        console.warn("MongoDB password update notice:", e);
      }
    }
    otpStore.delete(cleanId);
    res.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password."
    });
  } catch (error) {
    console.error("Forgot password reset error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});
const findUserByIdentifier = (identifier) => {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();
  const cleanNumeric = sanitizeIdentifier(identifier);
  return db.users.find(
    (u) => u.id === identifier || u.email.toLowerCase() === clean || u.phone && sanitizeIdentifier(u.phone) === cleanNumeric
  ) || null;
};
router.get("/me", (req, res) => {
  const queryUserId = req.query.userId || req.headers["x-user-id"];
  const authHeader = req.headers.authorization;
  let targetUser = null;
  if (queryUserId) {
    targetUser = findUserByIdentifier(queryUserId);
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const match = token.match(/jwt_token_(?:user_)?([^_]+)/);
    if (match && match[1]) {
      targetUser = findUserByIdentifier(match[1]);
    }
  }
  if (targetUser) {
    return res.json(targetUser);
  }
  res.json(db.users[0] || null);
});
router.get("/user/:id", (req, res) => {
  const user = findUserByIdentifier(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});
router.put("/profile", async (req, res) => {
  const { id, name, phone, alternatePhone, avatar, gender, dateOfBirth, anniversary, preferences, addresses } = req.body;
  const user = findUserByIdentifier(id) || db.users.find((u) => u.id === id) || db.users[0];
  if (user) {
    if (name) user.name = name;
    if (phone !== void 0) user.phone = phone;
    if (alternatePhone !== void 0) user.alternatePhone = alternatePhone;
    if (avatar !== void 0) user.avatar = avatar;
    if (gender !== void 0) user.gender = gender;
    if (dateOfBirth !== void 0) user.dateOfBirth = dateOfBirth;
    if (anniversary !== void 0) user.anniversary = anniversary;
    if (preferences !== void 0) user.preferences = preferences;
    if (Array.isArray(addresses)) user.addresses = addresses;
    db.save();
    if (isMongoConnected()) {
      try {
        await User.findOneAndUpdate(
          { email: user.email },
          {
            name: user.name,
            phone: user.phone,
            ...user.addresses ? { addresses: user.addresses } : {},
            ...avatar ? { avatar } : {}
          }
        );
      } catch (e) {
        console.warn("MongoDB notice:", e);
      }
    }
    return res.json({ success: true, user });
  }
  res.status(404).json({ error: "User not found" });
});
router.post("/save-address-with-otp", async (req, res) => {
  try {
    const { address, phone, otp, userId } = req.body;
    if (!address || !phone || !otp) {
      return res.status(400).json({ error: "Address details, 10-digit mobile number, and OTP are required" });
    }
    const cleanPhone = sanitizeIdentifier(phone);
    const record = otpStore.get(cleanPhone);
    if (!record) {
      return res.status(400).json({ error: "No active OTP found. Please request a new OTP code." });
    }
    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanPhone);
      return res.status(400).json({ error: "OTP has expired. Please request a fresh OTP code." });
    }
    if (record.code !== otp.trim()) {
      return res.status(400).json({ error: "Incorrect OTP entered. Please check and try again." });
    }
    otpStore.delete(cleanPhone);
    let user = findUserByIdentifier(userId) || findUserByIdentifier(cleanPhone);
    if (!user) {
      user = {
        id: `usr-${Date.now()}`,
        name: address.fullName || `Customer ${cleanPhone.slice(-4)}`,
        email: `${cleanPhone}@sareesansar.patron`,
        phone: cleanPhone,
        isPhoneVerified: true,
        isEmailVerified: false,
        role: "customer",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        addresses: []
      };
      db.users.push(user);
    } else {
      user.isPhoneVerified = true;
      if (!user.phone) user.phone = cleanPhone;
    }
    if (!user.addresses) user.addresses = [];
    const isFirst = user.addresses.length === 0;
    const shouldBeDefault = address.isDefault ?? isFirst;
    const newAddress = {
      ...address,
      id: address.id || `addr-${Date.now()}`,
      phone: cleanPhone,
      isDefault: shouldBeDefault,
      verifiedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (shouldBeDefault) {
      user.addresses.forEach((a) => a.isDefault = false);
    }
    const existingIdx = user.addresses.findIndex((a) => a.id === newAddress.id);
    if (existingIdx >= 0) {
      user.addresses[existingIdx] = newAddress;
    } else {
      user.addresses.push(newAddress);
    }
    db.save();
    if (isMongoConnected()) {
      try {
        await User.findOneAndUpdate(
          { $or: [{ email: user.email }, { phone: user.phone }] },
          {
            phone: user.phone,
            isPhoneVerified: true,
            addresses: user.addresses
          },
          { upsert: true }
        );
      } catch (e) {
        console.warn("MongoDB address notice:", e);
      }
    }
    const token = `jwt_token_user_${user.id}_${Date.now()}`;
    console.log(`\u2705 [Database Saved] Address permanently saved with OTP verification for ${user.name} (${cleanPhone})`);
    res.json({
      success: true,
      message: "Mobile number verified! Address permanently saved to database.",
      user,
      token,
      address: newAddress,
      addresses: user.addresses
    });
  } catch (error) {
    console.error("Save address with OTP error:", error);
    res.status(500).json({ error: "Failed to verify OTP and save address" });
  }
});
router.post("/addresses", async (req, res) => {
  const { userId, address } = req.body;
  let user = findUserByIdentifier(userId) || db.users.find((u) => u.id === userId);
  if (!user && address && address.phone) {
    user = findUserByIdentifier(address.phone);
  }
  if (!user && address && address.phone) {
    const cleanPhone = sanitizeIdentifier(address.phone);
    user = {
      id: `usr-${Date.now()}`,
      name: address.fullName || `Customer ${cleanPhone.slice(-4)}`,
      email: `${cleanPhone}@sareesansar.patron`,
      phone: cleanPhone,
      isPhoneVerified: true,
      isEmailVerified: false,
      role: "customer",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      addresses: []
    };
    db.users.push(user);
  }
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!user.addresses) user.addresses = [];
  const isFirst = user.addresses.length === 0;
  const shouldBeDefault = address.isDefault ?? isFirst;
  const newAddress = {
    ...address,
    id: address.id || `addr-${Date.now()}`,
    isDefault: shouldBeDefault
  };
  if (shouldBeDefault) {
    user.addresses.forEach((a) => a.isDefault = false);
  }
  const existingIdx = user.addresses.findIndex((a) => a.id === newAddress.id);
  if (existingIdx >= 0) {
    user.addresses[existingIdx] = newAddress;
  } else {
    user.addresses.push(newAddress);
  }
  db.save();
  if (isMongoConnected()) {
    try {
      await User.findOneAndUpdate({ email: user.email }, { addresses: user.addresses });
    } catch (e) {
      console.warn("MongoDB notice:", e);
    }
  }
  console.log(`[Address] Permanently saved address for ${user.email} (${newAddress.locality}, ${newAddress.city})`);
  res.status(201).json({ success: true, address: newAddress, addresses: user.addresses, user });
});
router.put("/addresses/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, address } = req.body;
  const user = findUserByIdentifier(userId) || db.users.find((u) => u.id === userId);
  if (!user || !user.addresses) return res.status(404).json({ error: "User not found" });
  if (address.isDefault) {
    user.addresses.forEach((a) => a.isDefault = false);
  }
  const existingIdx = user.addresses.findIndex((a) => a.id === id);
  if (existingIdx >= 0) {
    user.addresses[existingIdx] = { ...user.addresses[existingIdx], ...address, id };
  } else {
    user.addresses.push({ ...address, id });
  }
  db.save();
  if (isMongoConnected()) {
    try {
      await User.findOneAndUpdate({ email: user.email }, { addresses: user.addresses });
    } catch (e) {
      console.warn("MongoDB notice:", e);
    }
  }
  console.log(`[Address] Updated address ${id} for ${user.email}`);
  res.json({ success: true, addresses: user.addresses, user });
});
router.put("/addresses/:id/default", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const user = findUserByIdentifier(userId) || db.users.find((u) => u.id === userId);
  if (!user || !user.addresses) return res.status(404).json({ error: "User not found" });
  user.addresses = user.addresses.map((a) => ({
    ...a,
    isDefault: a.id === id
  }));
  db.save();
  if (isMongoConnected()) {
    try {
      await User.findOneAndUpdate({ email: user.email }, { addresses: user.addresses });
    } catch (e) {
      console.warn("MongoDB notice:", e);
    }
  }
  res.json({ success: true, addresses: user.addresses, user });
});
router.delete("/addresses/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body || {};
  const user = findUserByIdentifier(userId) || db.users.find((u) => u.id === userId);
  if (!user || !user.addresses) return res.status(404).json({ error: "User not found" });
  const wasDefault = user.addresses.find((a) => a.id === id)?.isDefault;
  user.addresses = user.addresses.filter((a) => a.id !== id);
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }
  db.save();
  if (isMongoConnected()) {
    try {
      await User.findOneAndUpdate({ email: user.email }, { addresses: user.addresses });
    } catch (e) {
      console.warn("MongoDB notice:", e);
    }
  }
  res.json({ success: true, addresses: user.addresses });
});
router.put("/security/password", async (req, res) => {
  const { userId, currentPass, newPass } = req.body;
  const user = db.users.find((u) => u.id === userId) || db.users[0];
  if (!user) return res.status(404).json({ error: "User not found" });
  if (!newPass || newPass.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }
  user.password = newPass;
  db.save();
  res.json({ success: true, message: "Password updated successfully" });
});
router.put("/security/2fa", async (req, res) => {
  const { userId, enabled } = req.body;
  const user = db.users.find((u) => u.id === userId) || db.users[0];
  if (!user) return res.status(404).json({ error: "User not found" });
  user.twoFactorEnabled = !!enabled;
  db.save();
  res.json({ success: true, twoFactorEnabled: user.twoFactorEnabled });
});
export default router;
