import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Charts from "../components/Charts";
import {
  getDashboardStats,
  getRecentExpenses,
} from "../services/expenseService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { compareCurrAndPrev } from "../services/expenseService";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recent, setRecent] = useState([]);
  const today = new Date()
  const [monthComparison, setMonthComparison] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      // 🔹 Fetch totals
      const data = await getDashboardStats();

      const comparison = await compareCurrAndPrev(
        today.getMonth() + 1,
        today.getFullYear()
      );

      setMonthComparison(comparison);


      if (data) {
        setStats([
          {
            label: "This Month",
            val: `$${data.monthTotal}`,
            trend: "",
            up: true,
          },
          {
            label: "Total Expense",
            val: `$${data.totalAmount}`,
            trend: "",
            up: true,
          },
          {
            label: "Transactions",
            val: data.totalOrders,
            trend: "",
            up: true,
          },
        ]);
      }

      // 🔹 Fetch recent activity
      const recentData = await getRecentExpenses();
      setRecent(recentData);
    });

    return () => unsubscribe();
  }, []);
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
        className={`mt-3 flex items-center gap-1 text-sm font-black ${isDecrease ? "text-emerald-500" : "text-red-500"
          }`}
      >
        <span>
          {isDecrease ? "↓" : isIncrease ? "↑" : "→"}
        </span>
        <span>
          {Math.abs(monthComparison.percentageChange)}%
        </span>
        <span className="text-xs font-bold opacity-80">
          {isDecrease ? "less than last month" : "more than last month"}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <Navbar />

      {/* STATS GRID */}
      <div className="grid grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-[3.5rem] thin-glass p-10 transition-all hover:-translate-y-2"
          >
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              {stat.label}
            </p>

            <h3 className="mt-4 text-4xl font-black text-slate-900">
              {stat.val}
            </h3>

            <div className="mt-4 text-sm font-black text-emerald-500"></div>

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all"></div>
            {stat.label === "This Month" && renderMonthTrend()}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8 mb-10">
        {/* SALES ANALYSIS (UNCHANGED) */}
        <div className="col-span-2 rounded-[4rem] thin-glass p-12 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Sales Analysis
            </h3>
          </div>

          <div className="h-64">
            <Charts />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="rounded-[4rem] thin-glass p-10 shadow-2xl">
          <h3 className="text-xl font-black text-slate-900 mb-8">
            Recent Activity
          </h3>

          <div className="space-y-6">
            {recent.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-white/20 pb-4 last:border-0"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-white border border-white/80 shadow-sm flex items-center justify-center font-bold text-blue-600">
                  ID
                </div>

                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800">
                    {item.title}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider">
                    {item.category}
                  </p>
                </div>

                <p className="text-sm font-black text-emerald-500">
                  +${item.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
