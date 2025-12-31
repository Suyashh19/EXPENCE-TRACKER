import { useEffect, useState } from "react";
import { getUserProfile } from "../services/settingsService";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

const Navbar = () => {
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <header className="flex h-24 items-center justify-between rounded-[2.5rem] thin-glass px-10">
      {/* Left Section */}
      <div>
        <h1 className="text-xl font-black text-slate-900">
          Hi, {firstName || "User"}
        </h1>
        <p className="text-sm font-semibold text-slate-400">
          Welcome back to Finora ✨
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 hover:text-rose-700 active:scale-95"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
