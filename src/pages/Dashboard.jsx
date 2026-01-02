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
import { getAiInsight } from "../services/geminiService";

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
import { useAuth } from "../context/AuthContext";

/* ✅ SINGLE CURRENCY SOURCE */
import {
  getAmountINR,
  formatCurrency,
  convertFromINR,
} from "../utils/currency";

/* 🔔 TOAST */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===================== COMPONENT ===================== */

export default function Dashboard() {
  const { preferredCurrency } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  const [statsData, setStatsData] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  const [recent, setRecent] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [monthComparison, setMonthComparison] = useState(null);
  const [insight, setInsight] = useState("");

  const [chartType, setChartType] = useState("ColumnChart");
  const [chartData, setChartData] = useState([
    ["Month", "Expenses", { role: "style" }],
  ]);

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

  /* ===================== BUILD CHART DATA (CURRENCY AWARE) ===================== */
  const buildChartData = (allExpenses, year) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const totalForMonthINR = (month) =>
      allExpenses
        .filter((e) => {
          if (!e.date) return false;
          const [y, m] = e.date.split("-").map(Number);
          return y === year && m === month;
        })
        .reduce((sum, e) => sum + getAmountINR(e), 0);

    setChartData([
      ["Month", `Expenses (${preferredCurrency})`, { role: "style" }],
      ...months.map((m, i) => [
        m,
        convertFromINR(totalForMonthINR(i + 1), preferredCurrency),
        "#434E78",
      ]),
    ]);
  };

  /* ===================== AUTH + DATA LOAD ===================== */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const [
        allExpenses,
        stats,
        recentTx,
        comparison,
        prefs,
      ] = await Promise.all([
        getUserExpenses(),
        getDashboardStats(),
        getRecentExpenses(),
        compareCurrAndPrev(today.getMonth() + 1, today.getFullYear()),
        getUserPreferences(),
      ]);

      setExpenses(allExpenses);
      const years = Array.from(
        new Set(
          allExpenses
            .map((e) => e.date?.split("-")[0])
            .filter(Boolean)
            .map(Number)
        )
      ).sort((a, b) => b - a);

      setAvailableYears(years);

      if (years.length) {
        setSelectedYear(years[0]); // latest year
      }

      setStatsData(stats);
      setRecent(recentTx);
      setMonthComparison(comparison);
      setPreferences(prefs);
      setDataReady(true);

      buildChartData(allExpenses, selectedYear);
    });

    return unsubscribe;
  }, []);

  /* 🔁 REBUILD CHART WHEN CURRENCY CHANGES */
  useEffect(() => {
    if (expenses.length) {
      buildChartData(expenses, selectedYear);
    }
  }, [preferredCurrency, selectedYear]);

  /* ===================== AI INSIGHT ===================== */
  useEffect(() => {
    if (!dataReady || !statsData) return;

    const context = `
Monthly spent: ${formatCurrency(statsData.monthTotal, preferredCurrency)}
Today's spent: ${formatCurrency(statsData.todayTotal, preferredCurrency)}
Average of past three months: ${formatCurrency(statsData.averageMonth, preferredCurrency)}
`;

    const runAI = async () => {
      try {
        const result = await getAiInsight(context);
        setInsight(result);
      } catch (err) {
        console.error("AI Insight failed", err);
      }
    };

    runAI();
  }, [dataReady, preferredCurrency]);

  /* ===================== 🔔 NOTIFICATIONS ===================== */
  useEffect(() => {
    if (!statsData || expenses.length === 0 || !preferences) return;

    const runNotifications = async () => {
      const notifications = await getUserNotifications();
      if (!notifications) return;

      const hour = new Date().getHours();

      if (
        notifications.dailyExpenseReminder &&
        hour >= 20 &&
        !hasShownDailyReminderToday()
      ) {
        toast.info(
          `🧾 Today you spent ${formatCurrency(
            getTodayTotal(expenses),
            preferredCurrency
          )}`
        );
        markDailyReminderShown();
      }

      if (
        notifications.monthlyBudgetAlert &&
        preferences.monthlyBudget > 0
      ) {
        const percent = getBudgetUsagePercent(
          getCurrentMonthTotal(expenses),
          preferences.monthlyBudget
        );

        if (percent >= 80) {
          toast.warning(`⚠️ You have used ${percent}% of your monthly budget`);
        }
      }
    };

    runNotifications();
  }, [statsData, expenses, preferences, preferredCurrency]);

  if (!statsData) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <Navbar
        monthlyBudget={preferences?.monthlyBudget}
        allTotal={statsData.totalAmount}
        totalDays={statsData.totalCalendarDays}
      />

      {/* ===================== STATS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <StatCard
          label="Spent This Month"
          value={formatCurrency(statsData.monthTotal, preferredCurrency)}
        />
        <StatCard
          label="Today's Expenses"
          value={formatCurrency(statsData.todayTotal, preferredCurrency)}
        />

        <div className="rounded-3xl md:rounded-[3.5rem] thin-glass p-6 md:p-10">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Last three months average
          </p>
          <h3 className="mt-4 text-3xl md:text-4xl font-black text-slate-900">
            {formatCurrency(statsData.averageMonth, preferredCurrency)}
          </h3>

          {monthComparison && (
            <p
              className={`mt-3 text-sm font-black ${monthComparison.percentageChange < 0
                ? "text-emerald-600"
                : "text-rose-500"
                }`}
            >
              {monthComparison.percentageChange < 0 ? "▼" : "▲"}{" "}
              {Math.abs(monthComparison.percentageChange)}%
            </p>
          )}
        </div>
      </div>

      {/* ===================== CHART + RECENT ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
        <div className="lg:col-span-2 rounded-3xl md:rounded-[4rem] thin-glass p-6 md:p-12">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <h3 className="text-xl md:text-2xl font-black">
              Expenses Analysis
            </h3>

            <div className="flex gap-2">
              {/* YEAR SELECT */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="rounded-xl border px-3 py-2 text-sm font-semibold"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* CHART TYPE */}
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="ColumnChart">Column</option>
                <option value="LineChart">Line</option>
                <option value="AreaChart">Area</option>
                <option value="PieChart">Pie</option>
              </select>
            </div>
          </div>


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
                    {item.category} • {normalizePaymentMethod(item.paymentMethod)}
                  </p>
                </div>
                <p className="font-black text-emerald-600">
                  {formatCurrency(getAmountINR(item), preferredCurrency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== QUICK INSIGHT ===================== */}
      <div className="rounded-3xl md:rounded-[4rem] thin-glass p-6 md:p-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">💡</span>
          <p className="text-sm font-black uppercase tracking-wide text-slate-700">
            Spending Insight
          </p>
        </div>

        {insight && (
          <div className="mt-4 rounded-2xl bg-white/40 p-4 backdrop-blur-sm">
            <p className="text-slate-800 font-semibold leading-relaxed">
              {insight}
            </p>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}

/* ===================== STAT CARD ===================== */
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
