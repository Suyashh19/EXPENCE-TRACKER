import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { getUserExpenses, deleteExpense } from "../services/expenseService";
import { normalizePaymentMethod } from "../utils/payment";
import { useAuth } from "../context/AuthContext";

/* ✅ IMPORT FROM SINGLE CURRENCY SOURCE */
import {
  getAmountINR,
  formatCurrency,
} from "../utils/currency";

/* ===================== DATE NORMALIZER (🔥 FIX) ===================== */
const getExpenseDateObject = (exp) => {
  // Firestore Timestamp (expenseDate)
  if (exp.expenseDate?.toDate) {
    return exp.expenseDate.toDate();
  }

  // Date string from AddExpense (YYYY-MM-DD)
  if (typeof exp.date === "string") {
    return new Date(exp.date + "T00:00:00");
  }

  // Firestore Timestamp fallback
  if (exp.createdAt?.toDate) {
    return exp.createdAt.toDate();
  }

  return new Date(0); // safe fallback
};

/* ===================== COMPONENT ===================== */

const Expenses = () => {
  const navigate = useNavigate();
  const { preferredCurrency } = useAuth();

  const [expenseList, setExpenseList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    setLoading(true);
    const data = await getUserExpenses();
    setExpenseList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await deleteExpense(id);
    setExpenseList((prev) => prev.filter((e) => e.id !== id));
  };

  /* ===================== FILTER + SORT (🔥 FIXED) ===================== */

  const filteredExpenses = expenseList
    .filter((exp) => {
      const matchesSearch = exp.title
        ?.toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || exp.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aTime = getExpenseDateObject(a).getTime();
      const bTime = getExpenseDateObject(b).getTime();

      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });

  /* ===================== SUMMARY (INR BASE) ===================== */

  const totalAmountINR = filteredExpenses.reduce(
    (sum, exp) => sum + getAmountINR(exp),
    0
  );

  const transactionCount = filteredExpenses.length;

  const averageAmountINR =
    transactionCount > 0 ? totalAmountINR / transactionCount : 0;

  /* ===================== STYLES ===================== */

  const getCategoryStyle = (cat) => {
    const styles = {
      Food: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
      Bills: "bg-rose-500/20 text-rose-600 border-rose-500/30",
      Shopping: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      Transport: "bg-amber-500/20 text-amber-600 border-amber-500/30",
    };
    return styles[cat] || "bg-slate-500/20 text-slate-600 border-slate-500/30";
  };

  const getPaymentStyle = (method) => {
    const styles = {
      Cash: "bg-slate-200 text-slate-700",
      UPI: "bg-blue-100 text-blue-700",
      Card: "bg-purple-100 text-purple-700",
      Online: "bg-indigo-100 text-indigo-700",
      Other: "bg-gray-100 text-gray-600",
    };
    return styles[method] || styles.Other;
  };

  /* ===================== RENDER ===================== */

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <Navbar />

      <div className="rounded-3xl md:rounded-[3.5rem] thin-glass p-6 md:p-10 shadow-2xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              Expense List
            </h2>
            <p className="text-sm text-slate-400">
              Showing {filteredExpenses.length} of {expenseList.length} expenses
            </p>
          </div>

          <button
            onClick={() => navigate("/add")}
            className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white"
          >
            Add Expense
          </button>
        </div>

        {/* FILTERS */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Search expenses..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-2xl border px-4 py-3 text-sm"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-2xl border px-4 py-3 text-sm"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Transport">Transport</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-2xl border px-4 py-3 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Summary
            label="Total"
            value={formatCurrency(totalAmountINR, preferredCurrency)}
          />
          <Summary
            label="Average"
            value={formatCurrency(averageAmountINR, preferredCurrency)}
          />
          <Summary label="Transactions" value={transactionCount} />
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/40">
                <th className="pb-4 pl-4 text-xs font-black uppercase text-slate-400">
                  Date
                </th>
                <th className="pb-4 text-xs font-black uppercase text-slate-400">
                  Description
                </th>
                <th className="pb-4 text-xs font-black uppercase text-slate-400">
                  Category
                </th>
                <th className="pb-4 text-xs font-black uppercase text-slate-400">
                  Payment
                </th>
                <th className="pb-4 pr-4 text-right text-xs font-black uppercase text-slate-400">
                  Amount
                </th>
                <th className="pb-4 pr-4 text-right text-xs font-black uppercase text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/20">
              {filteredExpenses.map((exp) => {
                const payment = normalizePaymentMethod(exp.paymentMethod);
                const amountINR = getAmountINR(exp);
                const dateObj = getExpenseDateObject(exp);

                return (
                  <tr key={exp.id} className="hover:bg-white/20">
                    <td className="py-5 pl-4 text-sm text-slate-500">
                      {dateObj.toLocaleDateString()}
                    </td>
                    <td className="py-5 font-semibold">{exp.title}</td>
                    <td className="py-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getCategoryStyle(
                          exp.category
                        )}`}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${getPaymentStyle(
                          payment
                        )}`}
                      >
                        {payment}
                      </span>
                    </td>
                    <td className="py-5 pr-4 text-right font-semibold">
                      -{formatCurrency(amountINR, preferredCurrency)}
                    </td>
                    <td className="py-5 pr-4 text-right">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-rose-500 text-xs font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Summary = ({ label, value }) => (
  <div className="rounded-2xl border p-4">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-xl font-black">{value}</p>
  </div>
);

export default Expenses;
