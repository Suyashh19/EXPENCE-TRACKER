import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import { getUserExpenses, deleteExpense } from "../services/expenseService";

const Expenses = () => {
  const navigate = useNavigate();

  const [expenseList, setExpenseList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);

  // 🔹 fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    const data = await getUserExpenses();
    setExpenseList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 🔹 delete expense
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this expense?");
    if (!confirmDelete) return;

    await deleteExpense(id);
    setExpenseList((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔹 filter + sort
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
      if (!a.createdAt || !b.createdAt) return 0;
      return sortOrder === "newest"
        ? b.createdAt.seconds - a.createdAt.seconds
        : a.createdAt.seconds - b.createdAt.seconds;
    });

  // 🔹 summary cards
  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const transactionCount = filteredExpenses.length;

  const averageAmount =
    transactionCount > 0
      ? (totalAmount / transactionCount).toFixed(2)
      : "0.00";

  // 🔹 category styles
  const getCategoryStyle = (cat) => {
    const styles = {
      Food: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
      Bills: "bg-rose-500/20 text-rose-600 border-rose-500/30",
      Shopping: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      Transport: "bg-amber-500/20 text-amber-600 border-amber-500/30",
    };
    return styles[cat] || "bg-slate-500/20 text-slate-600 border-slate-500/30";
  };

  // 🔹 EXPORT (CSV) + TOAST
  const handleExport = () => {
    if (filteredExpenses.length === 0) {
      toast.warning("No expenses to export");
      return;
    }

    const headers = ["Date", "Title", "Category", "Amount"];

    const rows = filteredExpenses.map((exp) => [
      exp.createdAt?.toDate().toLocaleDateString(),
      exp.title,
      exp.category,
      exp.amount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Expenses exported successfully ✅");
  };

  // 🔹 ADD EXPENSE
  const handleAddExpense = () => {
    navigate("/add"); // change if your route differs
  };

  return (
    <div className="flex flex-col gap-8">
      <Navbar />

      <div className="rounded-[3.5rem] thin-glass p-10 shadow-2xl">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Expense List
            </h2>
            <p className="text-sm text-slate-400">
              Showing {filteredExpenses.length} of {expenseList.length} expenses
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleExport}
              className="rounded-xl border px-6 py-2 font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              Export
            </button>

            <button
              onClick={handleAddExpense}
              className="rounded-xl bg-emerald-500 px-6 py-2 font-semibold text-white hover:bg-emerald-600"
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-2xl border px-4 py-3 text-sm outline-none"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-2xl border px-4 py-3 text-sm outline-none"
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
            className="rounded-2xl border px-4 py-3 text-sm outline-none"
          >
            <option value="newest">Date (Newest)</option>
            <option value="oldest">Date (Oldest)</option>
          </select>
        </div>

        {/* SUMMARY CARDS */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border p-6">
            <p className="text-sm text-slate-400">Total Amount</p>
            <p className="text-2xl font-black text-emerald-600">
              ${totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl border p-6">
            <p className="text-sm text-slate-400">Average</p>
            <p className="text-2xl font-black">${averageAmount}</p>
          </div>

          <div className="rounded-3xl border p-6">
            <p className="text-sm text-slate-400">Transactions</p>
            <p className="text-2xl font-black">{transactionCount}</p>
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-bold">
            Loading expenses...
          </div>
        ) : (
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
                <th className="pb-4 text-right pr-4 text-xs font-black uppercase text-slate-400">
                  Amount
                </th>
                <th className="pb-4 pr-4 text-right text-xs font-black uppercase text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/20">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-white/20">
                  <td className="py-5 pl-4 text-sm text-slate-500">
                    {exp.createdAt?.toDate().toLocaleDateString()}
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
                  <td className="py-5 text-right pr-4 font-semibold">
                    -${Number(exp.amount).toFixed(2)}
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Expenses;
