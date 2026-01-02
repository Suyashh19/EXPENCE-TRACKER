import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { db } from "./firebase";

/* ============================
   USER PREFERENCES (EXISTING)
============================ */

// GET USER PREFERENCES (monthly budget etc.)
export const getUserPreferences = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data().preferences || null;
};

// UPDATE USER PREFERENCES
export const updateUserPreferences = async (preferences) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  await updateDoc(ref, { preferences });
};

/* ============================
   USER PROFILE (EXISTING)
============================ */

// GET USER PROFILE (name, avatar etc.)
export const getUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data().profile || null;
};

// UPDATE USER PROFILE
export const updateUserProfile = async (profile) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  await setDoc(
    ref,
    { profile },
    { merge: true } // keeps preferences, currency, notifications safe
  );
};

/* ============================
   CURRENCY PREFERENCE (STEP-1)
============================ */

// GET preferred currency (default = INR)
export const getPreferredCurrency = async () => {
  const user = auth.currentUser;
  if (!user) return "INR";

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return "INR";

  return snap.data().preferredCurrency || "INR";
};

// UPDATE preferred currency
export const updatePreferredCurrency = async (currency) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  await setDoc(
    ref,
    { preferredCurrency: currency },
    { merge: true } // 🔥 safe merge
  );
};

/* ============================
   USER SETTINGS (EXISTING)
============================ */

// GET FULL USER SETTINGS (optional helper)
export const getUserSettings = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : null;
};

// UPDATE NOTIFICATIONS
export const updateNotifications = async (notifications) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  await setDoc(
    ref,
    { notifications },
    { merge: true } // preserves profile, preferences, currency
  );
};
