import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Charts from "../components/Charts";
import {
  getDashboardStats,
  getRecentExpenses,
} from "../services/expenseService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const data = await getDashboardStats();
      setStatsData(data);

      const recentData = await getRecentExpenses();
      setRecent(recentData);
    });

    return () => unsubscribe();
  }, []);

  if (!statsData) return null;

  return (
    <div className="flex flex-col gap-8">

      {/* NAVBAR */}
      <Navbar />

      {/* STATS GRID */}
      <div className="grid grid-cols-3 gap-8">
        <StatCard
          label="Today's Expense"
          value={`$${statsData.todayTotal}`}
        />

        <StatCard
          label="Total Expense"
          value={`$${statsData.totalAmount}`}
        />

        <StatCard
          label="Total Orders"
          value={statsData.totalOrders}
        />
      </div>

      <div className="grid grid-cols-3 gap-8 mb-10">

        {/* SALES ANALYSIS */}
        <div className="col-span-2 rounded-[4rem] thin-glass p-12 shadow-2xl">
          <h3 className="text-2xl font-black text-slate-900">
            Sales Analysis
          </h3>
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
                className="flex items-center gap-4 border-b pb-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow flex items-center justify-center font-bold text-blue-600">
                  ID
                </div>

                <div className="flex-1">
                  <p className="font-black">{item.title}</p>
                  <p className="text-xs text-slate-400">
                    {item.category}
                  </p>
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
  <div className="group relative overflow-hidden rounded-[3.5rem] thin-glass p-10">
    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
      {label}
    </p>
    <h3 className="mt-4 text-4xl font-black text-slate-900">
      {value}
    </h3>
  </div>
);
