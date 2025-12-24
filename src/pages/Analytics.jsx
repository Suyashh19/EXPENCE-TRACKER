import React from "react";
import Navbar from "../components/Navbar";

const Analytics = () => {
  return (
    <div className="flex flex-col gap-8">
      <Navbar />

      {/* PRIMARY CHART GLASS PANE */}
      <div className="rounded-[4rem] thin-glass p-12 shadow-2xl min-h-[500px] flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">Financial Growth</h2>
            <p className="text-slate-400 font-bold">Deep dive into your spending habits</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 rounded-2xl bg-white/30 border border-white/60 text-sm font-black text-slate-600">Export Report</div>
          </div>
        </div>

        {/* Visualizer Placeholder */}
        <div className="flex-1 rounded-[3rem] bg-white/5 border border-white/20 flex items-center justify-center relative overflow-hidden">
           {/* Decorative Grid Lines */}
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           <p className="text-slate-300 font-black text-xl italic z-10">Analytics Engine Loading...</p>
        </div>
      </div>

      {/* BOTTOM INSIGHTS GRID */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div className="rounded-[3rem] thin-glass p-10 flex flex-col gap-4">
           <span className="text-xs font-black uppercase tracking-widest text-blue-600">AI Spending Insight</span>
           <p className="text-lg font-bold text-slate-800 leading-relaxed">
             "Your spending on <span className="text-blue-600">Entertainment</span> is 24% higher this week. Consider setting a limit to reach your $500 savings goal."
           </p>
        </div>
        
        <div className="rounded-[3rem] thin-glass p-10 flex flex-col gap-4">
           <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Savings Forecast</span>
           <p className="text-lg font-bold text-slate-800 leading-relaxed">
             "Based on your current habits, you are on track to save <span className="text-emerald-600">$1,240</span> by the end of the quarter."
           </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;