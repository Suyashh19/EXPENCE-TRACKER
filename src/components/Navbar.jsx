import { useEffect, useState } from "react";
import { getUserProfile } from "../services/settingsService";

const Navbar = () => {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getUserProfile();
      if (profile?.fullName) {
        const name = profile.fullName.trim().split(" ")[0];
        setFirstName(name);
      }
    };

    loadProfile();
  }, []);

  return (
    <header className="flex h-24 items-center justify-between rounded-[2.5rem] thin-glass px-10">
      <div>
        <h1 className="text-xl font-black text-slate-900">
          Hi, {firstName || "User"}
        </h1>
        <p className="text-sm font-semibold text-slate-400">
          Welcome back to Finora ✨
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="w-64 rounded-full border border-white/60 bg-white/20 px-6 py-3 text-sm font-medium text-slate-400 shadow-inner backdrop-blur-md">
          Search anything...
        </div>
        
        {/* Action Button */}
        <button className="rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-200 active:scale-95 transition-all cursor-pointer">
          + Add New
        </button>
      </div>
    </header>
  );
};

export default Navbar;
