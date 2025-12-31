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

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [monthComparison, setMonthComparison] = useState(null);
  const [chartType, setChartType] = useState("ColumnChart");

  const [chartData, setChartData] = useState([
    ["Month", "Expenses", { role: "style" }],
  ]);

  const today = new Date();

  const pieColors = [
    "#2563eb", "#22c55e", "#f97316", "#e11d48",
    "#a855f7", "#06b6d4", "#84cc16", "#facc15",
    "#fb7185", "#38bdf8", "#c084fc", "#f472b6",
  ];

  // 📊 Chart Data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const expenses = await getUserExpenses();

      const totalForMonth = (monthNum) =>
        expenses
          .filter((exp) => {
            const [year, month] = exp.date.split("-").map(Number);
            return year === today.getFullYear() && month === monthNum;
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

      setChartData([
        ["Month", "Expenses", { role: "style" }],
        ["Jan", totalForMonth(1), "#434E78"],
        ["Feb", totalForMonth(2), "#434E78"],
        ["Mar", totalForMonth(3), "#434E78"],
        ["Apr", totalForMonth(4), "#434E78"],
        ["May", totalForMonth(5), "#434E78"],
        ["Jun", totalForMonth(6), "#434E78"],
        ["Jul", totalForMonth(7), "#434E78"],
        ["Aug", totalForMonth(8), "#434E78"],
        ["Sep", totalForMonth(9), "#434E78"],
        ["Oct", totalForMonth(10), "#434E78"],
        ["Nov", totalForMonth(11), "#434E78"],
        ["Dec", totalForMonth(12), "#434E78"],
      ]);
    });

    return () => unsubscribe();
  }, []);

  // 📈 Stats + Recent
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const stats = await getDashboardStats();
      setStatsData(stats);

      const comparison = await compareCurrAndPrev(
        today.getMonth() + 1,
        today.getFullYear()
      );
      setMonthComparison(comparison);

      const recentData = await getRecentExpenses();
      setRecent(recentData);
    });

    return () => unsubscribe();
  }, []);

  // 📉 Month Trend Renderer (SINGLE VERSION)
  const renderMonthTrend = () => {
    if (!monthComparison) return null;

    if (monthComparison.percentageChange === null) {
      return (
        <p className="text-xs font-bold text-slate-400 mt-2">
          No expenses last month
        </p>
      );
    }

    const isDecrease = monthComparison.percentageChange < 0;
    const isIncrease = monthComparison.percentageChange > 0;

    return (
      <div
        className={`mt-3 flex items-center gap-1 text-sm font-black ${
          isDecrease ? "text-emerald-500" : "text-red-500"
        }`}
      >
        <span>{isDecrease ? "↓" : isIncrease ? "↑" : "→"}</span>
        <span>{Math.abs(monthComparison.percentageChange)}%</span>
        <span className="text-xs font-bold opacity-80">
          {isDecrease ? "less than last month" : "more than last month"}
        </span>
      </div>
    );
  };

  if (!statsData) return null;

  return (
    <div className="flex flex-col gap-8">
      <Navbar />

      {/* STATS */}
      <div className="grid grid-cols-3 gap-8">
        <StatCard label="Total Expense" value={`$${statsData.totalAmount}`} />

        <div className="rounded-[3.5rem] thin-glass p-10">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            This Month
          </p>
          <h3 className="mt-4 text-4xl font-black text-slate-900">
            ${statsData.monthTotal}
          </h3>
          {renderMonthTrend()}
        </div>

        <StatCard
          label="Today's Expenses"
          value={`$${statsData.todayTotal}`}
        />
      </div>

      {/* CHART + RECENT */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="col-span-2 rounded-[4rem] thin-glass p-12">
          <h3 className="text-2xl font-black mb-4">Sales Analysis</h3>

          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="mb-4 rounded border px-3 py-1"
          >
            <option value="ColumnChart">Column</option>
            <option value="LineChart">Line</option>
            <option value="AreaChart">Area</option>
            <option value="PieChart">Pie</option>
          </select>

          {chartData.length > 1 && (
            <Chart
              chartType={chartType}
              width="100%"
              height="260px"
              data={chartData}
              options={{
                backgroundColor: "transparent",
                legend: {
                  position: chartType === "PieChart" ? "right" : "none",
                },
                colors: chartType === "PieChart" ? pieColors : ["#434E78"],
              }}
            />
          )}
        </div>

        <div className="rounded-[4rem] thin-glass p-10">
          <h3 className="text-xl font-black mb-8">Recent Activity</h3>

          <div className="space-y-6">
            {recent.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-black">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.category}</p>
                </div>
                <p className="font-black text-emerald-500">
                  ${item.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value }) => (
  <div className="rounded-[3.5rem] thin-glass p-10">
    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <h3 className="mt-4 text-4xl font-black text-slate-900">{value}</h3>
  </div>
);
