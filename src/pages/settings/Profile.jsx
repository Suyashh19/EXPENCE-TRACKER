import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import {
  getUserProfile,
  updateUserProfile,
} from "../../services/settingsService";

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const data = await getUserProfile();
      if (data) {
        setFullName(data.fullName || "");
        setEmail(data.email || "");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    await updateUserProfile(fullName);
    alert("Profile updated successfully");
  };

  if (loading) {
    return <p className="text-slate-400 font-bold">Loading profile...</p>;
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-black text-slate-900">Profile</h3>

      <div className="space-y-6 max-w-xl">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-2xl border border-white/80 bg-white/20 px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-500">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full cursor-not-allowed rounded-2xl border border-white/60 bg-white/10 px-6 py-4 font-bold text-slate-400"
          />
        </div>

        <button
          onClick={handleSave}
          className="rounded-2xl bg-blue-600 px-8 py-4 font-black text-white shadow-xl shadow-blue-500/40 hover:scale-105 transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
