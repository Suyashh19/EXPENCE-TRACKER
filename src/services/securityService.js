import {
  updatePassword,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";

// 🔁 CHANGE PASSWORD (EMAIL USERS)
export const changePassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No user");

  const credential = EmailAuthProvider.credential(
    user.email,
    currentPassword
  );

  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};

// 📧 PASSWORD RESET EMAIL
export const sendResetLink = async () => {
  const user = auth.currentUser;
  if (!user?.email) throw new Error("No email found");
  await sendPasswordResetEmail(auth, user.email);
};
