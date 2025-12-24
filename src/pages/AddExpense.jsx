import React, { useState } from "react";
import Navbar from "../components/Navbar";

const AddExpense = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Reusable Navbar */}
      <Navbar />

      {/* CENTERED GLASS FORM CONTAINER */}
      <div className="flex justify-center items-center py-10">
        <div className="w-full max-w-2xl rounded-[3.5rem] thin-glass p-12 shadow-2xl relative overflow-hidden">
          
          {/* Form Header */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Add New Expense</h2>
            <p className="text-slate-400 font-bold mt-2">Track your spending with precision</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Expense Title</label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Starbucks Coffee"
                className="w-full rounded-2xl border border-white/80 bg-white/20 px-6 py-4 text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Amount Input */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Amount ($)</label>
                <input 
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-white/80 bg-white/20 px-6 py-4 text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-md"
                />
              </div>

              {/* Date Input */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Date</label>
                <input 
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/80 bg-white/20 px-6 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-md"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/80 bg-white/20 px-6 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-md appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full mt-4 rounded-3xl bg-blue-600 py-5 text-lg font-black text-white shadow-2xl shadow-blue-400/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Save Transaction
            </button>
          </form>

          {/* Decorative Corner Glow */}
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;