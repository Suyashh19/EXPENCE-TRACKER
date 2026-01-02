import { useEffect, useState } from "react";
import {
  getUserPreferences,
  updateUserPreferences,
} from "../../services/settingsService";
import {
  getPreferredCurrency,
  updatePreferredCurrency,
} from "../../services/userService";

export default function Preferences() {
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [preferredCurrency, setPreferredCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await getUserPreferences();
      const currency = await getPreferredCurrency();

      if (prefs?.monthlyBudget !== undefined) {
        setMonthlyBudget(prefs.monthlyBudget);
      }

      setPreferredCurrency(currency || "INR");
      setLoading(false);
    };

    loadPreferences();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    // existing logic (unchanged)
    await updateUserPreferences({
      monthlyBudget: Number(monthlyBudget),
    });

    // 🔥 currency preference save
    await updatePreferredCurrency(preferredCurrency);

    setSaving(false);
    alert("Preferences saved");
  };

  if (loading) {
    return <div className="text-slate-500 font-bold">Loading...</div>;
  }

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-xl font-black text-slate-900">
        Preferences
      </h2>

      {/* Monthly Budget (UNCHANGED) */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400">
          Monthly Budget
        </label>
        <input
          type="number"
          placeholder="Enter monthly budget"
          value={monthlyBudget}
          onChange={(e) => setMonthlyBudget(e.target.value)}
          className="w-full rounded-2xl border border-white/60 bg-white/20 px-5 py-3 outline-none"
        />
      </div>

      {/* 🔥 Currency Preference (NEW – minimal & safe UI) */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400">
          Preferred Currency
        </label>
        <select
          value={preferredCurrency}
          onChange={(e) => setPreferredCurrency(e.target.value)}
          className="w-full rounded-2xl border border-white/60 bg-white/20 px-5 py-3 outline-none"
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-2xl bg-blue-600 px-8 py-3 font-black text-white shadow-lg disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );
}
