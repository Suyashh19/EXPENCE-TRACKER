// utils/payment.js
export const normalizePaymentMethod = (method) => {
  if (!method) return "Other";

  const m = method.toLowerCase();

  if (m.includes("cash")) return "Cash";
  if (m.includes("card") || m.includes("debit") || m.includes("credit"))
    return "Card";
  if (
    m.includes("upi") ||
    m.includes("gpay") ||
    m.includes("phonepe") ||
    m.includes("paytm")
  )
    return "UPI";
  if (m.includes("online") || m.includes("net"))
    return "Online";

  return "Other";
};
