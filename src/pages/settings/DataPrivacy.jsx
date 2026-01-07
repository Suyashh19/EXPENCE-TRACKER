import { useState } from "react";
import { auth } from "../../services/firebase";
import {
  exportUserData,
  deleteAccount,
} from "../../services/dataPrivacyService";
import { toast, ToastContainer } from "react-toastify";

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
      toast.success("Account deleted permanently", {
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
    <div className="space-y-8 px-4 sm:px-0 max-w-xl">
      {/* EXPORT */}
      <div className="space-y-3">
        <h3 className="text-lg sm:text-xl font-black text-slate-900">
          Export Data
        </h3>
        <p className="text-sm text-slate-500">
          Download all your data in JSON format.
        </p>

        <button
          onClick={handleExport}
          className="
            w-full sm:w-auto
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-bold
            text-white
            shadow-lg
            hover:scale-[1.02]
            transition
          "
        >
          Download My Data
        </button>
      </div>

      {/* DELETE ACCOUNT */}
      <div className="pt-6 border-t border-white/30 space-y-4">
        <h3 className="text-lg sm:text-xl font-black text-rose-600">
          Delete Account
        </h3>
        <p className="text-sm text-slate-500">
          This will permanently delete your account and all data.
        </p>

        {!showWarning && (
          <button
            onClick={() => setShowWarning(true)}
            className="
              w-full sm:w-auto
              rounded-xl
              bg-rose-600
              px-6
              py-3
              font-bold
              text-white
              shadow-lg
            "
          >
            Delete Account
          </button>
        )}

        {showWarning && (
          <div
            className="
              space-y-4
              rounded-2xl
              border
              border-rose-300
              bg-rose-50
              p-4 sm:p-6
            "
          >
            <p className="text-sm font-bold text-rose-600">
              ⚠️ This action is irreversible.
            </p>

            {provider === "password" && (
              <input
                type="password"
                placeholder="Confirm password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-rose-200
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-rose-400/50
                "
              />
            )}

            <button
              onClick={handleDelete}
              disabled={loading}
              className="
                w-full sm:w-auto
                rounded-xl
                bg-rose-600
                px-6
                py-3
                font-bold
                text-white
                shadow-lg
                disabled:opacity-50
              "
            >
              {loading ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
