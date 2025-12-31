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

// --------------------
// ADD EXPENSE
// --------------------
export const addExpense = async ({ title, amount, category, date }) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "expenses"), {
    title,
    amount: Number(amount),
    category,
    date,
    userId: user.uid,
    createdAt: Timestamp.now(),
  });
};

// --------------------
// GET ALL USER EXPENSES
// --------------------
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

// --------------------
// MONTHLY TOTAL
// --------------------
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

// --------------------
// PREVIOUS MONTH HELPER
// --------------------
export const getPrevMonthAndYear = (month, year) => {
  if (month === 1) {
    return { prevMonth: 12, prevYear: year - 1 };
  }
  return { prevMonth: month - 1, prevYear: year };
};

// --------------------
// COMPARE CURRENT VS PREVIOUS MONTH
// --------------------
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

// --------------------
// DASHBOARD STATS
// --------------------
export const getDashboardStats = async () => {
  const expenses = await getUserExpenses();
  if (!expenses.length) {
    return {
      totalAmount: 0,
      monthTotal: 0,
      todayTotal: 0,
      totalOrders: 0,
    };
  }

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

// --------------------
// RECENT EXPENSES (LAST 5)
// --------------------
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

// --------------------
// DELETE EXPENSE
// --------------------
export const deleteExpense = async (expenseId) => {
  const user = auth.currentUser;
  if (!user) return;

  await deleteDoc(doc(db, "expenses", expenseId));
};
