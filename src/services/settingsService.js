import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { db } from "./firebase";

/* ============================
   PROFILE
============================ */

// GET USER PROFILE
export const getUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data().profile || null;
};

// UPDATE USER PROFILE
export const updateUserProfile = async (fullName) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  await setDoc(
    ref,
    {
      profile: {
        fullName,
        email: user.email, // 🔒 always synced from auth
      },
    },
    { merge: true }
  );
};

/* ============================
   PREFERENCES
============================ */

export const getUserPreferences = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data().preferences || null : null;
};

export const updateUserPreferences = async (preferences) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  await setDoc(ref, { preferences }, { merge: true });
};

/* ============================
   NOTIFICATIONS
============================ */

// UPDATE NOTIFICATIONS
export const updateNotifications = async (notifications) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  await setDoc(ref, { notifications }, { merge: true });
};

export const getUserNotifications = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const raw = snap.data().notifications || {};

  // 🔥 BACKWARD-COMPATIBLE NORMALIZATION
  const normalized = {
    monthlyBudgetAlert:
      raw.monthlyBudgetAlert ?? raw.budgetAlerts ?? false,

    dailyExpenseReminder:
      raw.dailyExpenseReminder ?? raw.dailyReminders ?? false,
  };

  // 🔒 AUTO-MIGRATE (runs once per user)
  await setDoc(
    ref,
    { notifications: normalized },
    { merge: true }
  );

  return normalized;
};

