import { useEffect, useState } from "react";
import { getUserSettings, updateNotifications } from "../../services/userService";

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    emailAlerts: false,
    monthlyReports: false,
    budgetAlerts: false,
    dailyReminders: false,
  });

  useEffect(() => {
    const load = async () => {
      const data = await getUserSettings();
      if (data?.notifications) {
        setSettings(data.notifications);
      }
      setLoading(false);
    };
    load();
  }, []);

  const toggle = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await updateNotifications(updated);
  };

  if (loading) return <p className="font-bold text-slate-400">Loading...</p>;

  return (
    <div className="space-y-6">
      <Toggle
        label="Email Alerts"
        value={settings.emailAlerts}
        onChange={() => toggle("emailAlerts")}
      />

      <Toggle
        label="Monthly Reports"
        value={settings.monthlyReports}
        onChange={() => toggle("monthlyReports")}
      />

      <Toggle
        label="Budget Alerts"
        value={settings.budgetAlerts}
        onChange={() => toggle("budgetAlerts")}
      />

      <Toggle
        label="Daily Expense Reminders"
        value={settings.dailyReminders}
        onChange={() => toggle("dailyReminders")}
      />
    </div>
  );
}

const Toggle = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/10 px-6 py-5">
    <span className="font-black text-slate-800">{label}</span>
    <button
      onClick={onChange}
      className={`h-7 w-14 rounded-full transition-all ${
        value ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <div
        className={`h-6 w-6 rounded-full bg-white transition-all ${
          value ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);
