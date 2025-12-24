import React from "react";
import Navbar from "../components/Navbar";
import Charts from "../components/Charts";

const Dashboard = () => {
  const stats = [
    { label: "Today's Sale", val: "$12,426", trend: "+36%", up: true },
    { label: "Total Sales", val: "$2,38,485", trend: "-14%", up: false },
    { label: "Total Orders", val: "84,382", trend: "+36%", up: true }
  ];

  return (
    <div className="flex flex-col gap-8">
      <Navbar />

      {/* STATS GRID */}
      <div className="grid grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden rounded-[3.5rem] thin-glass p-10 transition-all hover:-translate-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            <h3 className="mt-4 text-4xl font-black text-slate-900">{stat.val}</h3>
            <div className={`mt-4 text-sm font-black ${stat.up ? 'text-emerald-500' : 'text-rose-500'}`}>
              {stat.trend} <span className="text-slate-300 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8 mb-10">
        {/* LARGE CHART AREA (2/3 width) */}
        <div className="col-span-2 rounded-[4rem] thin-glass p-12 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Sales Analysis</h3>
            <div className="flex gap-2 rounded-2xl bg-white/20 p-1.5 border border-white/60 shadow-inner">
              {['12 Months', '6 Months', '30 Days'].map((t, i) => (
                <button key={t} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${i === 0 ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <Charts />
          </div>
        </div>

        {/* RECENT CUSTOMERS (1/3 width) */}
        <div className="rounded-[4rem] thin-glass p-10 shadow-2xl">
           <h3 className="text-xl font-black text-slate-900 mb-8">Recent Activity</h3>
           <div className="space-y-6">
              {[1, 2, 3, 4].map(item => (
                <div key={item} className="flex items-center gap-4 border-b border-white/20 pb-4 last:border-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-white border border-white/80 shadow-sm flex items-center justify-center font-bold text-blue-600">ID</div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800">New Purchase</p>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider">2 MINS AGO</p>
                  </div>
                  <p className="text-sm font-black text-emerald-500">+$240</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;