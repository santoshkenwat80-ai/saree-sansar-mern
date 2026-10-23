export const formatINR = (amount) => {
  if (isNaN(amount)) return "\u20B90";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
};
export const calculateDiscount = (original, current) => {
  if (!original || original <= current) return 0;
  return Math.round((original - current) / original * 100);
};
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
};
