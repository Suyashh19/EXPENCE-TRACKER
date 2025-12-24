import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth } from "./firebase";
import { db } from "./firebase";
import { doc, deleteDoc } from "firebase/firestore";

// ADD EXPENSE
export const addExpense = async ({ title, amount, category, date }) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "expenses"), {
    title,
    amount: Number(amount),
    category,
    date,
    userId: user.uid,
    createdAt: new Date(),
  });
};

// GET ALL USER EXPENSES
export const getUserExpenses = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// DASHBOARD STATS
export const getDashboardStats = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const q = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);
  const expenses = snapshot.docs.map((doc) => doc.data());

  const today = new Date().toISOString().split("T")[0];

  let todayTotal = 0;
  let totalAmount = 0;

  expenses.forEach((exp) => {
    totalAmount += exp.amount;
    if (exp.date === today) {
      todayTotal += exp.amount;
    }
  });

  return {
    todayTotal,
    totalAmount,
    totalOrders: expenses.length,
  };
};

// RECENT ACTIVITY (LAST 5 EXPENSES)
// RECENT ACTIVITY (LAST 5 EXPENSES - GUARANTEED)
export const getRecentExpenses = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.seconds - a.createdAt.seconds;
    })
    .slice(0, 5);
};

// DELETE SINGLE EXPENSE
export const deleteExpense = async (expenseId) => {
  const user = auth.currentUser;
  if (!user) return;

  const expenseRef = doc(db, "expenses", expenseId);
  await deleteDoc(expenseRef);
};