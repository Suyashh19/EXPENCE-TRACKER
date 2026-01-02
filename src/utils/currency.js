/* ============================
   CURRENCY UTILS (SINGLE SOURCE)
============================ */

/* 🔹 Base: INR */

export const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

export const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

/* ============================
   CORE HELPERS
============================ */

// Always read amount safely
export const getAmountINR = (expense) =>
  Number(expense?.amountINR ?? expense?.amount ?? 0);

// Convert INR → target currency
export const convertFromINR = (amountINR, currency = "INR") =>
  amountINR * (EXCHANGE_RATES[currency] || 1);

// Format currency for UI
export const formatCurrency = (amountINR, currency = "INR") => {
  const symbol = CURRENCY_SYMBOLS[currency] || "";
  const value = convertFromINR(amountINR, currency);
  return `${symbol}${value.toFixed(2)}`;
};
