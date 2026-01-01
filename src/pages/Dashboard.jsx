import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getDashboardStats,
  getRecentExpenses,
  compareCurrAndPrev,
  getUserExpenses,
} from "../services/expenseService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { Chart } from "react-google-charts";

/* 🔥 SETTINGS + HELPERS */
import {
  getUserPreferences,
  getUserNotifications,
} from "../services/settingsService";
import {
  getTodayTotal,
  getCurrentMonthTotal,
  getBudgetUsagePercent,
} from "../utils/helpers";

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [monthComparison, setMonthComparison] = useState(null);
  const [chartType, setChartType] = useState("ColumnChart");
  const [chartData, setChartData] = useState([
    ["Month", "Expenses", { role: "style" }],
  ]);
  const [dailyAlertShown, setDailyAlertShown] = useState(false);

  const today = new Date();

  const pieColors = [
    "#2563eb", "#22c55e", "#f97316", "#e11d48",
    "#a855f7", "#06b6d4", "#84cc16", "#facc15",
  ];

  /* ============================ 📊 CHART DATA ============================ */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const expenses = await getUserExpenses();

      const totalForMonth = (m) =>
        expenses
          .filter((e) => e.date && Number(e.date.split("-")[1]) === m)
          .reduce((s, e) => s + Number(e.amount || 0), 0);

      setChartData([
        ["Month", "Expenses", { role: "style" }],
        ...["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
          .map((m, i) => [m, totalForMonth(i + 1), "#434E78"]),
      ]);
    });

    return () => unsubscribe();
  }, []);

  /* ============================ 📈 STATS ============================ */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setStatsData(await getDashboardStats());
      setMonthComparison(
        await compareCurrAndPrev(today.getMonth() + 1, today.getFullYear())
      );
      setRecent(await getRecentExpenses());
    });

    return () => unsubscribe();
  }, []);

  /* ============================ 🔔 NOTIFICATIONS ============================ */
  useEffect(() => {
    if (!statsData) return;

    const run = async () => {
      const expenses = await getUserExpenses();
      const preferences = await getUserPreferences();
      const notifications = await getUserNotifications();

      if (!preferences || !notifications) return;

      if (
        notifications.dailyExpenseReminder &&
        new Date().getHours() >= 20 &&
        !dailyAlertShown
      ) {
        alert(`You spent ₹${getTodayTotal(expenses)} today`);
        setDailyAlertShown(true);
      }

      if (notifications.monthlyBudgetAlert && preferences.monthlyBudget > 0) {
        const percent = getBudgetUsagePercent(
          getCurrentMonthTotal(expenses),
          preferences.monthlyBudget
        );
        if (percent >= 80)
          alert(`⚠️ You have used ${percent}% of your monthly budget`);
      }
    };

    run();
  }, [statsData]);

  if (!statsData) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <Navbar />

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <StatCard label="Total Expense" value={`₹${statsData.totalAmount}`} />

        <div className="rounded-3xl md:rounded-[3.5rem] thin-glass p-6 md:p-10">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            This Month
          </p>
          <h3 className="mt-4 text-3xl md:text-4xl font-black text-slate-900">
            ₹{statsData.monthTotal}
          </h3>
          {monthComparison && (
            <p className={`mt-3 text-sm font-black ${
              monthComparison.percentageChange < 0
                ? "text-emerald-500"
                : "text-red-500"
            }`}>
              {monthComparison.percentageChange < 0 ? "↓" : "↑"}
              {Math.abs(monthComparison.percentageChange)}%
            </p>
          )}
        </div>

        <StatCard label="Today's Expenses" value={`₹${statsData.todayTotal}`} />
      </div>

      {/* CHART + RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
        <div className="lg:col-span-2 rounded-3xl md:rounded-[4rem] thin-glass p-6 md:p-12">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <h3 className="text-xl md:text-2xl font-black">Sales Analysis</h3>

            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              <option value="ColumnChart">Column</option>
              <option value="LineChart">Line</option>
              <option value="AreaChart">Area</option>
              <option value="PieChart">Pie</option>
            </select>
          </div>

          <Chart
            chartType={chartType}
            width="100%"
            height="220px"
            data={chartData}
            options={{
              backgroundColor: "transparent",
              legend: { position: chartType === "PieChart" ? "right" : "none" },
              colors: chartType === "PieChart" ? pieColors : ["#434E78"],
            }}
          />
        </div>

        <div className="rounded-3xl md:rounded-[4rem] thin-glass p-6 md:p-10">
          <h3 className="text-lg md:text-xl font-black mb-6">
            Recent Activity
          </h3>

          <div className="space-y-4">
            {recent.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-black">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.category}</p>
                </div>
                <p className="font-black text-emerald-500">₹{item.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ STAT CARD ============================ */

const StatCard = ({ label, value }) => (
  <div className="rounded-3xl md:rounded-[3.5rem] thin-glass p-6 md:p-10">
    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <h3 className="mt-4 text-3xl md:text-4xl font-black text-slate-900">
      {value}
    </h3>
  </div>
);
