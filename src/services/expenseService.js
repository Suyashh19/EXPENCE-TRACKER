import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { auth } from "./firebase";
import { db } from "./firebase";
import { getAveragePastMonths } from "../utils/dashboardCalculation";

/* 🔥 EXISTING IMPORTS */
import { getUserPreferences } from "./settingsService";
import { getCurrentMonthTotal } from "../utils/helpers";

/* ============================
   STEP-2: EXCHANGE RATES
   Base currency = INR
============================ */

// 1 INR = X currency
const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

// Convert any currency → INR
const convertToINR = (amount, currency = "INR") => {
  if (!EXCHANGE_RATES[currency]) return amount;
  return Number(amount) / EXCHANGE_RATES[currency];
};

/* ============================
   GET ALL USER EXPENSES
============================ */

export const getUserExpenses = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

/* ============================
   ADD EXPENSE (UPDATED – STEP 2)
============================ */

export const addExpense = async ({
  title,
  amount,
  currency = "INR", // 🔥 NEW (safe default)
  category,
  date,
  paymentMethod,
}) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const numericAmount = Number(amount);

  /* 🔒 GET USER BUDGET */
  const preferences = await getUserPreferences();
  const monthlyBudget = preferences?.monthlyBudget || 0;

  /* 🔢 GET CURRENT MONTH TOTAL (IN INR) */
  const expensesBefore = await getUserExpenses();
  const monthTotalBefore = getCurrentMonthTotal(
    expensesBefore.map((e) => ({
      ...e,
      amount: e.amountINR ?? e.amount, // backward compatibility
    }))
  );

  /* 🔁 CONVERT TO INR */
  const amountINR = convertToINR(numericAmount, currency);
  const newMonthTotal = monthTotalBefore + amountINR;

  /* 🚫 HARD BLOCK IF BUDGET EXCEEDED (unchanged) */
  // if (monthlyBudget > 0 && newMonthTotal > monthlyBudget) {
  //   throw new Error(
  //     "Monthly budget exceeded. Please update your budget in Preferences."
  //   );
  // }

  /* ✅ SAVE EXPENSE (INR BASED) */
  await addDoc(collection(db, "expenses"), {
    title,
    amountINR,                 // 🔥 BASE VALUE
    originalAmount: numericAmount,
    originalCurrency: currency,
    category,
    paymentMethod,
    date,
    userId: user.uid,
    createdAt: Timestamp.now(),
  });

  /* 🔔 RETURN RELIABLE VALUES */
  return {
    monthTotal: newMonthTotal,
    monthlyBudget,
  };
};

/* ============================
   MONTHLY TOTAL (BY MONTH)
============================ */

export const getUserExpensesByMonth = async (month, year) => {
  const expenses = await getUserExpenses();

  return expenses
    .filter((exp) => {
      if (!exp.date) return false;
      const [y, m] = exp.date.split("-").map(Number);
      return y === year && m === month;
    })
    .reduce(
      (sum, exp) =>
        sum + Number(exp.amountINR ?? exp.amount ?? 0),
      0
    );
};

/* ============================
   PREVIOUS MONTH HELPER
============================ */

export const getPrevMonthAndYear = (month, year) => {
  if (month === 1) {
    return { prevMonth: 12, prevYear: year - 1 };
  }
  return { prevMonth: month - 1, prevYear: year };
};

export const compareCurrAndPrev = async (currentMonth, currentYear) => {
  try {
    const { prevMonth, prevYear } = getPrevMonthAndYear(
      currentMonth,
      currentYear
    );

    const prev = await getUserExpensesByMonth(prevMonth, prevYear);
    const curr = await getUserExpensesByMonth(currentMonth, currentYear);

    if (prev === 0) {
      return {
        percentageChange: null,
        message: "No expenses in previous month",
        current: curr,
        previous: prev,
      };
    }

    const change = ((curr - prev) / prev) * 100;

    return {
      percentageChange: Number(change.toFixed(2)),
      message:
        change > 0
          ? "Spending increased"
          : change < 0
          ? "Spending decreased"
          : "No change",
      current: curr,
      previous: prev,
    };
  } catch (error) {
    console.error("Compare error:", error);
    throw new Error("Failed to compare expenses");
  }
};

/* ============================
   DASHBOARD STATS
============================ */

export const getDashboardStats = async () => {
  const expenses = await getUserExpenses();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const totalAmount = expenses.reduce(
    (sum, exp) =>
      sum + Number(exp.amountINR ?? exp.amount ?? 0),
    0
  );

  const averageMonth = await getAveragePastMonths(expenses);

  const monthTotal = expenses
    .filter((exp) => exp.date?.startsWith(todayStr.slice(0, 7)))
    .reduce(
      (sum, exp) =>
        sum + Number(exp.amountINR ?? exp.amount ?? 0),
      0
    );

  const todayTotal = expenses
    .filter((exp) => exp.date === todayStr)
    .reduce(
      (sum, exp) =>
        sum + Number(exp.amountINR ?? exp.amount ?? 0),
      0
    );

  let totalCalendarDays = 0;

  if (expenses.length > 0) {
    const validDates = expenses
      .map((e) => new Date(e.date))
      .filter((d) => !isNaN(d));

    if (validDates.length > 0) {
      const firstExpenseDate = new Date(
        Math.min(...validDates.map((d) => d.getTime()))
      );

      const diffMs = today.getTime() - firstExpenseDate.getTime();

      totalCalendarDays =
        Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    }
  }

  return {
    totalAmount,
    monthTotal,
    todayTotal,
    totalOrders: expenses.length,
    averageMonth,
    totalCalendarDays,
  };
};

/* ============================
   RECENT EXPENSES
============================ */

export const getRecentExpenses = async () => {
  const expenses = await getUserExpenses();

  return expenses
    .filter((e) => e.createdAt)
    .sort(
      (a, b) =>
        (b.createdAt.seconds || 0) - (a.createdAt.seconds || 0)
    )
    .slice(0, 5);
};

/* ============================
   DELETE EXPENSE
============================ */

export const deleteExpense = async (expenseId) => {
  const user = auth.currentUser;
  if (!user) return;

  await deleteDoc(doc(db, "expenses", expenseId));
};
