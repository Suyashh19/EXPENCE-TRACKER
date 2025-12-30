import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { db } from "./firebase";

/* ============================
   USER PREFERENCES (EXISTING)
============================ */

export const getUserPreferences = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data().preferences || null;
};

export const updateUserPreferences = async (preferences) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  await updateDoc(ref, { preferences });
};

/* ============================
   USER PROFILE (NEW)
============================ */

// GET USER PROFILE (for Navbar / Profile page)
export const getUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data().profile || null;
};

// UPDATE USER PROFILE (first name etc.)
export const updateUserProfile = async (profile) => {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);

  await setDoc(
    ref,
    { profile },
    { merge: true } // 🔥 keeps preferences, notifications safe
  );
};

/* ============================
   USER SETTINGS (EXISTING)
============================ */

// GET FULL USER SETTINGS (OPTIONAL)
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
    { merge: true } // 🔥 preserves profile & preferences
  );
};
