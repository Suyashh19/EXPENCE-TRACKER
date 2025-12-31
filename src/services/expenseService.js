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

/* 🔥 NEW IMPORTS */
import { getUserPreferences } from "./settingsService";
import { getCurrentMonthTotal } from "../utils/helpers";

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
   ADD EXPENSE (FIXED + FINAL)
============================ */

export const addExpense = async ({ title, amount, category, date }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const numericAmount = Number(amount);

  /* 🔒 GET USER BUDGET */
  const preferences = await getUserPreferences();
  const monthlyBudget = preferences?.monthlyBudget || 0;

  /* 🔢 GET CURRENT MONTH TOTAL (BEFORE ADD) */
  const expensesBefore = await getUserExpenses();
  const monthTotalBefore = getCurrentMonthTotal(expensesBefore);

  const newMonthTotal = monthTotalBefore + numericAmount;

  /* 🚫 HARD BLOCK IF BUDGET EXCEEDED */
  if (monthlyBudget > 0 && newMonthTotal > monthlyBudget) {
    throw new Error(
      "Monthly budget exceeded. Please update your budget in Preferences."
    );
  }

  /* ✅ SAVE EXPENSE */
  await addDoc(collection(db, "expenses"), {
    title,
    amount: numericAmount,
    category,
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
    .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
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

/* ============================
   DASHBOARD STATS
============================ */

export const getDashboardStats = async () => {
  const expenses = await getUserExpenses();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const monthTotal = expenses
    .filter((exp) => exp.date?.startsWith(todayStr.slice(0, 7)))
    .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  const todayTotal = expenses
    .filter((exp) => exp.date === todayStr)
    .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  return {
    totalAmount,
    monthTotal,
    todayTotal,
    totalOrders: expenses.length,
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
