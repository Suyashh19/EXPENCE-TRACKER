import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { auth } from "./firebase";
import { db } from "./firebase";

// ADD EXPENSE (creates doc inside expenses collection)
export const addExpense = async ({ title, amount }) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "expenses"), {
    title ,
    amount,
    userId: user.uid,     // 🔐 THIS creates user separation
    createdAt: new Date(),
  });
};

// GET ONLY LOGGED-IN USER EXPENSES
export const getUserExpenses = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};
