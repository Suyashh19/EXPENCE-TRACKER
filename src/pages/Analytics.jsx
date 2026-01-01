import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getUserExpenses } from "../services/expenseService";
import { normalizePaymentMethod } from "../utils/payment";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

/* ===================== COLORS ===================== */

const PASTEL_COLORS = {
  Cash: "#DBEAFE",
  Card: "#BFDBFE",
  UPI: "#93C5FD",
  Online: "#A5B4FC",
  Other: "#CBD5E1",
};

const CATEGORY_COLORS = [
  "#2563EB",
  "#4F46E5",
  "#0EA5E9",
  "#22D3EE",
  "#60A5FA",
  "#A5B4FC",
];

/* ===================== HELPERS ===================== */

const getExpenseDate = (e) => {
  if (e.date) return e.date;
  if (e.createdAt?.seconds) {
    return new Date(e.createdAt.seconds * 1000)
      .toISOString()
      .split("T")[0];
  }
  return null;
};

const aggregateTrend = (expenses, mode) => {
  const map = {};

  expenses.forEach((e) => {
    const d = getExpenseDate(e);
    if (!d) return;

    let key = d;

    if (mode === "weekly") {
      const date = new Date(d);
      key = `W${Math.ceil(date.getDate() / 7)}`;
    }

    if (mode === "monthly") {
      const date = new Date(d);
      key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
    }

    map[key] = (map[key] || 0) + Number(e.amount);
  });

  return Object.entries(map).map(([name, value]) => ({ name, value }));
};

const aggregateByCategory = (expenses) => {
  const map = {};
  expenses.forEach((e) => {
    const key = e.category || "Other";
    map[key] = (map[key] || 0) + Number(e.amount);
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};

const aggregatePaymentMethods = (expenses) => {
  const map = {};
  expenses.forEach((e) => {
    const key = normalizePaymentMethod(e.paymentMethod);
    map[key] = (map[key] || 0) + Number(e.amount);
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};

/* ===================== ACTIVE PIE ===================== */

const ActivePieSlice = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
}) => (
  <Sector
    cx={cx}
    cy={cy}
    innerRadius={innerRadius}
    outerRadius={outerRadius + 10}
    startAngle={startAngle}
    endAngle={endAngle}
    fill={fill}
  />
);

/* ===================== COMPONENT ===================== */

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [mode, setMode] = useState("monthly");

  useEffect(() => {
    const load = async () => {
      const data = await getUserExpenses();
      setExpenses(data || []);
    };
    load();
  }, []);

  const trendData = useMemo(
    () => aggregateTrend(expenses, mode),
    [expenses, mode]
  );

  const categoryData = useMemo(
    () => aggregateByCategory(expenses),
    [expenses]
  );

  const paymentData = useMemo(
    () => aggregatePaymentMethods(expenses),
    [expenses]
  );

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const highestExpense = Math.max(0, ...expenses.map((e) => Number(e.amount)));

  const avgDaily = (() => {
    const days = new Set(
      expenses.map((e) => getExpenseDate(e)).filter(Boolean)
    ).size;
    return days ? (totalSpent / days).toFixed(2) : "0.00";
  })();

  return (
    <div className="flex flex-col gap-8">
      <Navbar />

      <div className="rounded-[4rem] thin-glass p-12 shadow-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              Financial Growth
            </h2>
            <p className="text-slate-400 font-bold">
              Deep dive into your spending habits
            </p>
          </div>

          <div className="flex gap-2">
            {["daily", "weekly", "monthly"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-2xl text-sm font-black ${
                  mode === m
                    ? "bg-blue-600 text-white"
                    : "bg-white/30 border border-white/60 text-slate-600"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <Stat label="Total Spent" value={`₹${totalSpent.toFixed(2)}`} />
          <Stat label="Daily Avg" value={`₹${avgDaily}`} />
          <Stat label="Highest Expense" value={`₹${highestExpense}`} />
        </div>

        {/* TREND */}
        <div className="h-[300px] mb-12">
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#60A5FA"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY + PAYMENT */}
        <div className="grid grid-cols-2 gap-10">
          {/* CATEGORY */}
          <div>
            <h3 className="text-lg font-black mb-4">Spending by Category</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={75}
                    outerRadius={110}
                    paddingAngle={4}
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth={2}
                    activeShape={ActivePieSlice}
                  >
                    {categoryData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PAYMENT */}
          <div>
            <h3 className="text-lg font-black mb-4">Payment Methods</h3>
            <div className="h-[260px]">
              <ResponsiveContainer>
                <BarChart data={paymentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                    {paymentData.map((e, i) => (
                      <Cell
                        key={i}
                        fill={PASTEL_COLORS[e.name] || "#E5E7EB"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== STAT ===================== */

const Stat = ({ label, value }) => (
  <div className="rounded-3xl bg-white/20 border border-white/40 p-6">
    <p className="text-xs font-black uppercase text-slate-400">{label}</p>
    <p className="text-2xl font-black mt-2">{value}</p>
  </div>
);
