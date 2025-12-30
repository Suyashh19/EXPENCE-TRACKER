import { useState } from "react";
import { auth } from "../../services/firebase";
import {
  changePassword,
  sendResetLink,
} from "../../services/securityService";
import { toast,ToastContainer } from "react-toastify";

export default function Security() {
  const user = auth.currentUser;
  const provider = user?.providerData[0]?.providerId;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 GOOGLE USERS
  if (provider === "google.com") {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-black">Account Security</h3>
        <p className="text-slate-500 font-bold">
          You signed in using Google.
        </p>
        <p className="text-sm text-slate-400">
          Password is managed by Google. Please change it from your Google
          account.
        </p>
      </div>
    );
  }

  // 🔹 EMAIL USERS
  const handleChangePassword = async () => {
    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated successfully",{
        className: "glass-success-toast",
      });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await sendResetLink();
      toast.info("Password reset email sent");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black">Change Password</h3>

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full rounded-xl p-4 border border-gray-500"
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full rounded-xl p-4 border border-gray-500"
      />

      <button
        onClick={handleChangePassword}
        disabled={loading}
        className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
      >
        Update Password
      </button>

      <div className="pt-4 border-t border-white/30">
        <button
          onClick={handleReset}
          className="text-sm font-bold text-blue-600"
        >
          Forgot password? Send reset email
        </button>
      </div>
    </div>
  );
}
