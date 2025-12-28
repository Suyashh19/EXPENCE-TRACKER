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

export const getUserExpensesByMonth = async (monthNumber, yearNumber) => {
  const user = auth.currentUser;
  if (!user) return null;

  const q = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );
  const snapshot = await getDocs(q);
  const expenses = snapshot.docs.map((doc) => doc.data());
  let monthTotal = expenses.filter((exp) => {
    let dateOfExpense = exp.date.split('-')
    let monthN = parseInt(dateOfExpense[1])
    let yearN = parseInt(dateOfExpense[0])
    return ((monthN == monthNumber) && (yearN == yearNumber))
  }).reduce((sum, exp) => {
    return sum = sum + exp.amount
  }, 0)
  return monthTotal
}

export const getPrevMonthAndYear  = (currentMonthNumber,currentYear) =>{
  let prevMonth = 0
  let prevYear = 0
  if(currentMonthNumber == 1){
    prevMonth = 12
    prevYear = currentYear - 1
    return {
      prevMonth,
      prevYear
    };
  }
  prevMonth = currentMonthNumber-1
  prevYear = currentYear
  return {
    prevMonth,
    prevYear
  }
}

export const compareCurrAndPrev = async (
  currentMonthNumber,
  currentYear
) => {
  try {
    const { prevMonth, prevYear } = getPrevMonthAndYear(
      currentMonthNumber,
      currentYear
    );

    const prevExpenses =
      (await getUserExpensesByMonth(prevMonth, prevYear)) ?? 0;

    const currExpenses =
      (await getUserExpensesByMonth(currentMonthNumber, currentYear)) ?? 0;

    // No spending in previous month
    if (prevExpenses === 0) {
      return {
        percentageChange: null,
        message: "No expenses in previous month",
        current: currExpenses,
        previous: prevExpenses,
      };
    }

    const percentageChange =
      ((currExpenses - prevExpenses) / prevExpenses) * 100;

    return {
      percentageChange: Number(percentageChange.toFixed(2)),
      message:
        percentageChange > 0
          ? "Spending increased"
          : percentageChange < 0
          ? "Spending decreased"
          : "No change in spending",
      current: currExpenses,
      previous: prevExpenses,
    };
  } catch (error) {
    console.error("Error comparing expenses:", error);
    throw new Error("Failed to compare monthly expenses");
  }
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

  const today1 = new Date()
  // const today = today1.toISOString().split("T")[0];
  let totalAmount = expenses.reduce((sum, exp) => {
    return sum = sum + exp.amount
  }, 0)
  let monthTotal = await getUserExpensesByMonth(today1.getMonth() + 1, today1.getFullYear())

  return {
    monthTotal,
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