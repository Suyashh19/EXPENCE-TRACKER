import { useEffect, useState } from "react";
import {
  getUserNotifications,
  updateNotifications,
} from "../../services/settingsService";

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    monthlyBudgetAlert: false,
    dailyExpenseReminder: false,
  });

  useEffect(() => {
    const load = async () => {
      const data = await getUserNotifications();
      if (data) {
        setNotifications({
          monthlyBudgetAlert: data.monthlyBudgetAlert ?? false,
          dailyExpenseReminder: data.dailyExpenseReminder ?? false,
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const toggle = async (key) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };
    setNotifications(updated);
    await updateNotifications(updated);
  };

  if (loading) {
    return (
      <p className="font-bold text-slate-400 px-4 sm:px-0">
        Loading...
      </p>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-xl px-4 sm:px-0">
      <Toggle
        label="Monthly Budget Alerts"
        value={notifications.monthlyBudgetAlert}
        onChange={() => toggle("monthlyBudgetAlert")}
      />

      <Toggle
        label="Daily Expense Reminder"
        value={notifications.dailyExpenseReminder}
        onChange={() => toggle("dailyExpenseReminder")}
      />
    </div>
  );
}

const Toggle = ({ label, value, onChange }) => (
  <div
    className="
      flex
      items-center
      justify-between
      gap-4
      rounded-2xl
      border border-white/40
      bg-white/10
      px-4 sm:px-6
      py-4 sm:py-5
    "
  >
    <span className="font-black text-slate-800 text-sm sm:text-base">
      {label}
    </span>

    <button
      onClick={onChange}
      className={`
        relative
        h-7
        w-14
        shrink-0
        rounded-full
        transition-all
        ${value ? "bg-blue-600" : "bg-slate-300"}
      `}
    >
      <div
        className={`
          absolute
          top-0.5
          h-6
          w-6
          rounded-full
          bg-white
          transition-all
          ${value ? "translate-x-7" : "translate-x-1"}
        `}
      />
    </button>
  </div>
);
