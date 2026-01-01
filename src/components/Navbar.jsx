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
    <header className="
      flex flex-col sm:flex-row
      items-start sm:items-center
      justify-between
      gap-4 sm:gap-0
      rounded-3xl sm:rounded-[2.5rem]
      thin-glass
      px-5 sm:px-10
      py-4 sm:py-0
      h-auto sm:h-24
    ">
      {/* LEFT */}
      <div className="flex flex-col">
        <h1 className="text-lg sm:text-xl font-black text-slate-900">
          Hi, {firstName || "User"}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-400">
          Welcome back to Finora ✨
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center w-full sm:w-auto">
        <button
          onClick={handleLogout}
          className="
            w-full sm:w-auto
            rounded-xl sm:rounded-2xl
            border border-rose-200
            bg-rose-50
            px-4 sm:px-6
            py-2.5 sm:py-3
            text-xs sm:text-sm
            font-bold
            text-rose-600
            transition-all
            hover:bg-rose-100
            hover:text-rose-700
            active:scale-95
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
