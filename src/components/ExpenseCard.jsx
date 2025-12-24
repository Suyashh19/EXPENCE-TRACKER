import React from "react";

const ExpenseCard = ({ title, amount, category, date }) => {
  return (
    <div className="flex items-center gap-6 p-4 rounded-3xl hover:bg-white/30 transition-all group border border-transparent hover:border-white/60">
      <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-blue-600 border border-white/80">
        {category[0]}
      </div>
      <div className="flex-1">
        <h4 className="text-base font-black text-slate-900 tracking-tight">{title}</h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{date} • {category}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-black text-rose-500">-${amount}</p>
      </div>
    </div>
  );
};

export default ExpenseCard;