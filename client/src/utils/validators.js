export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
export const isValidIndianPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, "");
  return /^[6-9]\d{9}$/.test(cleanPhone);
};
export const isValidIndianPincode = (pincode) => {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
};
