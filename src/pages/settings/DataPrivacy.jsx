import { useState } from "react";
import { auth } from "../../services/firebase";
import {
  exportUserData,
  deleteAccount,
} from "../../services/dataPrivacyService";
import { toast , ToastContainer } from "react-toastify";

export default function DataPrivacy() {
  const user = auth.currentUser;
  const provider = user?.providerData[0]?.providerId;

  const [showWarning, setShowWarning] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 📤 EXPORT DATA
  const handleExport = async () => {
    const data = await exportUserData();
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "my-expense-data.json";
    a.click();
  };

  // ❌ DELETE ACCOUNT
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteAccount(password);
      toast.success("Account deleted permanently",{
        className: "glass-success-toast",
      });
      window.location.href = "/";
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* EXPORT */}
      <div>
        <h3 className="text-lg font-black">Export Data</h3>
        <p className="text-sm text-slate-500 mb-4">
          Download all your data in JSON format.
        </p>
        <button
          onClick={handleExport}
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
        >
          Download My Data
        </button>
      </div>

      {/* DELETE ACCOUNT */}
      <div className="pt-6 border-t border-white/30">
        <h3 className="text-lg font-black text-rose-600">
          Delete Account
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          This will permanently delete your account and all data.
        </p>

        {!showWarning && (
          <button
            onClick={() => setShowWarning(true)}
            className="rounded-xl bg-rose-600 px-6 py-3 font-bold text-white"
          >
            Delete Account
          </button>
        )}

        {showWarning && (
          <div className="mt-4 space-y-4 rounded-xl border border-rose-300 bg-rose-50 p-4">
            <p className="text-sm font-bold text-rose-600">
              This action is irreversible.
            </p>

            {provider === "password" && (
              <input
                type="password"
                placeholder="Confirm password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl p-3"
              />
            )}

            <button
              onClick={handleDelete}
              disabled={loading}
              className="rounded-xl bg-rose-600 px-6 py-3 font-bold text-white"
            >
              Permanently Delete
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
