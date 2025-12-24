import React from "react";

const ExpenseForm = ({ onSubmit }) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Title</label>
        <input type="text" placeholder="Coffee, Rent, Shopping..." className="w-full rounded-2xl border border-white/80 bg-white/10 px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all backdrop-blur-md" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Amount</label>
          <input type="number" placeholder="0.00" className="w-full rounded-2xl border border-white/80 bg-white/10 px-6 py-4 outline-none" required />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Category</label>
          <select className="w-full rounded-2xl border border-white/80 bg-white/10 px-6 py-4 outline-none appearance-none">
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Bills</option>
          </select>
        </div>
      </div>

      <button type="submit" className="w-full mt-6 rounded-3xl bg-blue-600 py-5 text-lg font-black text-white shadow-xl shadow-blue-400/40 hover:scale-[1.02] active:scale-95 transition-all">
        Save Expense
      </button>
    </form>
  );
};

export default ExpenseForm;