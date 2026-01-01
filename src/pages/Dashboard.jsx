import { useEffect, useMemo, useState } from "react";
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
  hasShownDailyReminderToday,
  markDailyReminderShown,
} from "../utils/helpers";
import { normalizePaymentMethod } from "../utils/payment";

/* 🔔 TOAST */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [monthComparison, setMonthComparison] = useState(null);
  const [chartType, setChartType] = useState("ColumnChart");
  const [chartData, setChartData] = useState([
    ["Month", "Expenses", { role: "style" }],
  ]);
  const [expenses, setExpenses] = useState([]);

  const today = new Date();
  const currentYear = today.getFullYear();

  const pieColors = [
    "#2563eb",
    "#22c55e",
    "#f97316",
    "#e11d48",
    "#a855f7",
    "#06b6d4",
    "#84cc16",
    "#facc15",
  ];

  /* ============================ LOAD EXPENSES + CHART ============================ */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const allExpenses = await getUserExpenses();
      setExpenses(allExpenses);

      const totalForMonth = (month) =>
        allExpenses
          .filter((e) => {
            if (!e.date) return false;
            const [y, m] = e.date.split("-").map(Number);
            return y === currentYear && m === month;
          })
          .reduce((s, e) => s + Number(e.amount || 0), 0);

      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec",
      ];

      setChartData([
        ["Month", "Expenses", { role: "style" }],
        ...months.map((m, i) => [m, totalForMonth(i + 1), "#434E78"]),
      ]);
    });

    return () => unsubscribe();
  }, [currentYear]);

  /* ============================ STATS + RECENT ============================ */
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

  /* ============================ 🔔 NOTIFICATIONS (FIXED + UI) ============================ */
  useEffect(() => {
    if (!statsData || expenses.length === 0) return;

    const runNotifications = async () => {
      const preferences = await getUserPreferences();
      const notifications = await getUserNotifications();
      if (!preferences || !notifications) return;

      const hour = new Date().getHours();

      /* 🔔 DAILY REMINDER — ONLY ONCE PER DAY AFTER 8 PM */
      if (
        notifications.dailyExpenseReminder &&
        hour >= 20 &&
        !hasShownDailyReminderToday()
      ) {
        toast.info(
          `🧾 Today you spent ₹${getTodayTotal(expenses)}`,
          { autoClose: 6000 }
        );
        markDailyReminderShown();
      }

      /* 🔔 MONTHLY BUDGET WARNING */
      if (
        notifications.monthlyBudgetAlert &&
        preferences.monthlyBudget > 0
      ) {
        const percent = getBudgetUsagePercent(
          getCurrentMonthTotal(expenses),
          preferences.monthlyBudget
        );

        if (percent >= 80) {
          toast.warning(
            `⚠️ You have used ${percent}% of your monthly budget`,
            { autoClose: 7000 }
          );
        }
      }
    };

    runNotifications();
  }, [statsData, expenses]);

  /* ============================ PAYMENT INSIGHT ============================ */
  const paymentInsight = useMemo(() => {
    let cash = 0;
    let digital = 0;

    expenses.forEach((e) => {
      const method = normalizePaymentMethod(e.paymentMethod);
      if (method === "Cash") cash += Number(e.amount || 0);
      else digital += Number(e.amount || 0);
    });

    return { cash, digital };
  }, [expenses]);

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
            <p
              className={`mt-3 text-sm font-black ${
                monthComparison.percentageChange < 0
                  ? "text-emerald-600"
                  : "text-rose-500"
              }`}
            >
              {monthComparison.percentageChange < 0 ? "▼" : "▲"}{" "}
              {Math.abs(monthComparison.percentageChange)}%
            </p>
          )}
        </div>

        <StatCard
          label="Today's Expenses"
          value={`₹${statsData.todayTotal}`}
        />
      </div>

      {/* QUICK INSIGHT */}
      <div className="rounded-3xl md:rounded-[3.5rem] thin-glass p-6 md:p-8">
        <p className="text-sm font-black text-slate-700 mb-2">
          💡 Spending Insight
        </p>
        <p className="text-slate-600 font-semibold">
          You spent{" "}
          <span className="font-black text-slate-900">
            ₹{paymentInsight.digital}
          </span>{" "}
          digitally and{" "}
          <span className="font-black text-slate-900">
            ₹{paymentInsight.cash}
          </span>{" "}
          using cash this month.
        </p>
      </div>

      {/* CHART + RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
        <div className="lg:col-span-2 rounded-3xl md:rounded-[4rem] thin-glass p-6 md:p-12">
          <Chart
            chartType={chartType}
            width="100%"
            height="220px"
            data={chartData}
            options={{
              backgroundColor: "transparent",
              legend: {
                position: chartType === "PieChart" ? "right" : "none",
              },
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
                  <p className="text-xs text-slate-400">
                    {item.category} •{" "}
                    {normalizePaymentMethod(item.paymentMethod)}
                  </p>
                </div>
                <p className="font-black text-emerald-600">
                  ₹{item.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔔 TOAST UI */}
      <ToastContainer position="top-right" />
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
