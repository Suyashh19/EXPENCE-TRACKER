import { useEffect, useState } from "react";
import { getUserProfile } from "../services/settingsService";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { getMonthlyHealth } from "../utils/dashboardCalculation";
import { getExpenseVelocity } from "../utils/dashboardCalculation";

const Navbar = ({ monthlyBudget, allTotal ,totalDays}) => {
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);
  const [velocity, setVelocity] = useState(null);



  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getUserProfile();
      if (profile?.fullName) {
        const name = profile.fullName.trim().split(" ")[0];
        setFirstName(name);
      }
    };
    loadProfile();

    if (monthlyBudget && allTotal !== undefined) {
      setHealth(getMonthlyHealth(allTotal, monthlyBudget));
    }
    if (monthlyBudget && allTotal !== undefined) {
      setHealth(getMonthlyHealth(allTotal, monthlyBudget));

      const v = getExpenseVelocity(allTotal, monthlyBudget,totalDays);
      setVelocity(Number(v.toFixed(2)));
    }

  }, [monthlyBudget, allTotal]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const healthMeta = {
    Good: { icon: "🟢", text: "On track", color: "text-emerald-600" },
    Okay: { icon: "🟡", text: "Be mindful", color: "text-yellow-600" },
    Risky: { icon: "🔴", text: "High spending", color: "text-rose-600" },
  };

  const velocityMeta = (v) => {
    if (v < 1) {
      return { label: "Under budget pace", color: "text-emerald-600" };
    }
    if (v < 1.2) {
      return { label: "On budget pace", color: "text-yellow-600" };
    }
    return { label: "Overspending pace", color: "text-rose-600" };
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

          {health && (
            <span
              className={`ml-2 font-bold ${healthMeta[health.label]?.color}`}
            >
              {healthMeta[health.label]?.icon} {healthMeta[health.label]?.text}
            </span>
          )}

        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {velocity !== null && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/40 backdrop-blur-sm">
            <span className="text-3xl">🚀</span>

            <div className="flex flex-col leading-tight">
              <span
                className={`text-lg font-black ${velocityMeta(velocity).color
                  }`}
              >
                {velocity}x
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {velocityMeta(velocity).label}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="
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
