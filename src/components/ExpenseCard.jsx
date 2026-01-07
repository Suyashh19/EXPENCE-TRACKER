import React from "react";

const ExpenseCard = ({ title, amount, category, date }) => {
  return (
    <div
      className="
        flex flex-col sm:flex-row
        sm:items-center
        gap-4 sm:gap-6
        p-4 sm:p-5
        rounded-3xl
        border border-transparent
        hover:border-white/60
        hover:bg-white/30
        transition-all
        group
      "
    >
      {/* CATEGORY ICON */}
      <div
        className="
          h-12 w-12 sm:h-14 sm:w-14
          rounded-2xl
          bg-white
          shadow-sm
          flex
          items-center
          justify-center
          font-black
          text-blue-600
          border border-white/80
          shrink-0
        "
      >
        {category?.[0] || "?"}
      </div>

      {/* TITLE + META */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">
          {title}
        </h4>

        <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1 break-words">
          {date} • {category}
        </p>
      </div>

      {/* AMOUNT */}
      <div className="text-left sm:text-right">
        <p className="text-base sm:text-lg font-black text-rose-500 whitespace-nowrap">
          -{amount}
        </p>
      </div>
    </div>
  );
};

export default ExpenseCard;
