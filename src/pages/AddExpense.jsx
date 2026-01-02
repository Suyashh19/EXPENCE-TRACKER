import { useState } from "react";
import Navbar from "../components/Navbar";
import { addExpense } from "../services/expenseService";
import { parseExpenseMessage } from "../services/geminiService";
import { getUserNotifications } from "../services/settingsService";
import { ToastContainer, toast } from "react-toastify";
import { normalizePaymentMethod } from "../utils/payment";

export default function AddExpense() {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    paymentMethod: "UPI",
    date: new Date().toISOString().split("T")[0],
  });

  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Others",
  ];

  const paymentMethods = ["UPI", "Card", "Cash", "Online", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleAIParse = async () => {
    if (!aiInput.trim()) {
      toast.warning("Please enter an expense message");
      return;
    }

    try {
      setAiLoading(true);
      const parsed = await parseExpenseMessage(aiInput);

      setFormData((p) => ({
        ...p,
        title: parsed.title ?? p.title,
        amount: parsed.amount ?? p.amount,
        category: parsed.category ?? p.category,
        paymentMethod: parsed.paymentMethod ?? p.paymentMethod,
        date: parsed.date ?? p.date,
      }));

      toast.success("Expense parsed successfully ✨");
    } catch {
      toast.error("Could not parse expense");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await addExpense({
      ...formData,
      amount: Number(formData.amount),
      paymentMethod: normalizePaymentMethod(formData.paymentMethod), // ✅ FIX
    });

    toast.success("Expense saved successfully 💸");

    const notifications = await getUserNotifications();
    if (
      notifications?.monthlyBudgetAlert &&
      result?.monthlyBudget &&
      result?.monthTotal / result.monthlyBudget >= 0.8
    ) {
      const percent = Math.round(
        (result.monthTotal / result.monthlyBudget) * 100
      );
      toast.warning(`⚠️ You used ${percent}% of your budget`);
    }

    setFormData({
      title: "",
      amount: "",
      category: "Food",
      paymentMethod: "UPI",
      date: new Date().toISOString().split("T")[0],
    });
    setAiInput("");
  } catch (err){
    console.log(err)
    toast.error("Failed to save expense");
  }
};


  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <Navbar />

      <div className="flex justify-center px-4 md:px-0 py-6 md:py-10">
        <div className="
          w-full max-w-2xl
          rounded-3xl md:rounded-[3.5rem]
          thin-glass
          p-6 md:p-12
          shadow-2xl
        ">
          {/* HEADER */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              Add New Expense
            </h2>
            <p className="text-sm md:text-base text-slate-400 font-bold mt-2">
              Track your spending with precision
            </p>
          </div>

          {/* AI INPUT */}
          <div className="mb-8 space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">
              Add Expense using AI
            </label>

            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="e.g. Paid 350 via UPI for food"
              className="w-full rounded-2xl border bg-white/20 px-4 py-3 text-sm outline-none"
            />

            <button
              type="button"
              onClick={handleAIParse}
              disabled={aiLoading}
              className="w-full sm:w-auto rounded-xl bg-purple-600 px-6 py-3 text-white font-black"
            >
              {aiLoading ? "Parsing..." : "Parse with AI"}
            </button>
          </div>

          {/* FORM */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Expense Title" name="title" value={formData.title} onChange={handleChange} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Amount" type="number" name="amount" value={formData.amount} onChange={handleChange} />
              <Input label="Date" type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>

            <Select label="Category" name="category" value={formData.category} options={categories} onChange={handleChange} />
            <Select label="Payment Method" name="paymentMethod" value={formData.paymentMethod} options={paymentMethods} onChange={handleChange} />

            <button
              type="submit"
              className="w-full rounded-2xl md:rounded-3xl bg-blue-600 py-4 text-base md:text-lg font-black text-white"
            >
              Save Transaction
            </button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-2xl border bg-white/20 px-4 py-3 text-sm outline-none"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="space-y-2">
    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">
      {label}
    </label>
    <select
      {...props}
      className="w-full rounded-2xl border bg-white/20 px-4 py-3 text-sm outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);
