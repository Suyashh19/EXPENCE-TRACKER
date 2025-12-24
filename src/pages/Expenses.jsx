import React from "react";
import Navbar from "../components/Navbar";

const Expenses = () => {
  // Sample hackathon data
  const expenseList = [
    { id: 1, title: "Netflix Subscription", amount: 15.99, category: "Bills", date: "2025-12-20" },
    { id: 2, title: "Apple Store - iPhone Case", amount: 49.00, category: "Shopping", date: "2025-12-18" },
    { id: 3, title: "Uber Ride", amount: 12.50, category: "Transport", date: "2025-12-15" },
    { id: 4, title: "Whole Foods Market", amount: 124.30, category: "Food", date: "2025-12-14" },
  ];

  const getCategoryStyle = (cat) => {
    const styles = {
      Food: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
      Bills: "bg-rose-500/20 text-rose-600 border-rose-500/30",
      Shopping: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      Transport: "bg-amber-500/20 text-amber-600 border-amber-500/30",
    };
    return styles[cat] || "bg-slate-500/20 text-slate-600 border-slate-500/30";
  };

  return (
    <div className="flex flex-col gap-8">
      <Navbar />

      {/* EXPENSE LIST CONTAINER */}
      <div className="rounded-[3.5rem] thin-glass p-10 shadow-2xl">
        <div className="mb-8 flex items-center justify-between px-4">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Recent Transactions</h2>
          <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
        </div>

        {/* GLASS TABLE */}
        <div className="w-full overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/40">
                <th className="pb-6 pl-4 text-xs font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="pb-6 text-xs font-black uppercase tracking-widest text-slate-400">Expense</th>
                <th className="pb-6 text-xs font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="pb-6 text-right pr-4 text-xs font-black uppercase tracking-widest text-slate-400">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {expenseList.map((exp) => (
                <tr key={exp.id} className="group hover:bg-white/20 transition-all cursor-default">
                  <td className="py-6 pl-4 text-sm font-bold text-slate-500">{exp.date}</td>
                  <td className="py-6 text-sm font-black text-slate-900">{exp.title}</td>
                  <td className="py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getCategoryStyle(exp.category)}`}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-6 text-right pr-4 text-sm font-black text-slate-900">
                    -${exp.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;