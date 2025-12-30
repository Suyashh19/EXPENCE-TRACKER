import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { auth } from "./firebase";
import { db } from "./firebase";

// 📤 EXPORT USER DATA (JSON)
export const exportUserData = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  // Get expenses
  const q = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );
  const snap = await getDocs(q);
  const expenses = snap.docs.map((doc) => doc.data());

  return {
    profile: {
      uid: user.uid,
      email: user.email,
      createdAt: user.metadata.creationTime,
    },
    expenses,
  };
};

// ❌ DELETE ACCOUNT (FULL CLEANUP)
export const deleteAccount = async (password) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user");

  // 🔐 Re-authentication (email users only)
  if (user.providerData[0].providerId === "password") {
    const credential = EmailAuthProvider.credential(
      user.email,
      password
    );
    await reauthenticateWithCredential(user, credential);
  }

  // 🗑️ Delete expenses
  const q = query(
    collection(db, "expenses"),
    where("userId", "==", user.uid)
  );
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));

  // 🗑️ Delete user profile
  await deleteDoc(doc(db, "users", user.uid));

  // ❌ Delete auth user
  await deleteUser(user);
};
