import { useState } from "react";
import Navbar from "../components/Navbar";
import { addExpense } from "../services/expenseService";
import { parseExpenseMessage } from "../services/geminiService";
import { getUserNotifications } from "../services/settingsService";
import { ToastContainer, toast } from "react-toastify";

export default function AddExpense() {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    paymentMethod: "UPI", // ✅ BETTER DEFAULT
    date: new Date().toISOString().split("T")[0],
  });

  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  /* =========================
     AI PARSE HANDLER
  ========================= */
  const handleAIParse = async () => {
    if (!aiInput.trim()) {
      toast.warning("Please enter an expense message");
      return;
    }

    try {
      setAiLoading(true);

      const parsed = await parseExpenseMessage(aiInput);

      setFormData((prev) => ({
        ...prev,
        title: parsed.title ?? prev.title,
        amount: parsed.amount ?? prev.amount,
        category: parsed.category ?? prev.category,
        paymentMethod: parsed.paymentMethod ?? prev.paymentMethod,
        date: parsed.date ?? prev.date,
      }));

      toast.success("Expense parsed successfully ✨", {
        className: "glass-success-toast",
      });
    } catch (error) {
      console.error("AI Parse Error:", error);
      toast.error("Could not parse expense. Try again.", {
        className: "glass-error-toast",
      });
    } finally {
      setAiLoading(false);
    }
  };

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await addExpense({
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        paymentMethod: formData.paymentMethod, // ✅ SAVED CORRECTLY
        date: formData.date,
      });

      toast.success("Expense saved successfully 💸", {
        className: "glass-success-toast",
      });

      /* 🔔 MONTHLY BUDGET ALERT */
      const notifications = await getUserNotifications();

      if (
        notifications?.monthlyBudgetAlert &&
        result?.monthlyBudget &&
        result?.monthTotal / result.monthlyBudget >= 0.8
      ) {
        const percent = Math.round(
          (result.monthTotal / result.monthlyBudget) * 100
        );

        toast.warning(
          `⚠️ You have used ${percent}% of your monthly budget`,
          { autoClose: 6000 }
        );
      }

      setFormData({
        title: "",
        amount: "",
        category: "Food",
        paymentMethod: "UPI",
        date: new Date().toISOString().split("T")[0],
      });
      setAiInput("");
    } catch (error) {
      console.error(error);

      if (
        error?.message &&
        error.message.includes("Monthly budget exceeded")
      ) {
        toast.error(
          "🚫 Monthly budget exceeded. Please update your budget in Preferences.",
          { autoClose: 6000 }
        );
      } else {
        toast.error("Failed to save expense", {
          className: "glass-error-toast",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Navbar />

      <div className="flex justify-center items-center py-10">
        <div className="w-full max-w-2xl rounded-[3.5rem] thin-glass p-12 shadow-2xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-900">
              Add New Expense
            </h2>
            <p className="text-slate-400 font-bold mt-2">
              Track your spending with precision
            </p>
          </div>

          {/* AI INPUT */}
          <div className="mb-10 space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">
              Add Expense using AI
            </label>

            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="e.g. Paid 350 via UPI for food yesterday"
              className="w-full rounded-2xl border border-white/80 bg-white/20 px-6 py-4 outline-none"
            />

            <button
              type="button"
              onClick={handleAIParse}
              disabled={aiLoading}
              className="rounded-xl bg-purple-600 px-6 py-3 text-white font-black hover:scale-105 transition"
            >
              {aiLoading ? "Parsing..." : "Parse with AI"}
            </button>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <Input
              label="Expense Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Starbucks Coffee"
            />

            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
              <Input
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <Select
              label="Category"
              name="category"
              value={formData.category}
              options={categories}
              onChange={handleChange}
            />

            <Select
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              options={paymentMethods}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full rounded-3xl bg-blue-600 py-5 text-lg font-black text-white hover:scale-[1.02] transition"
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

/* =========================
   SMALL REUSABLE COMPONENTS
========================= */

const Input = ({ label, ...props }) => (
  <div className="space-y-3">
    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-2xl border border-white/80 bg-white/20 px-6 py-4 outline-none"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="space-y-3">
    <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-4">
      {label}
    </label>
    <select
      {...props}
      className="w-full rounded-2xl border border-white/80 bg-white/20 px-6 py-4 outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
