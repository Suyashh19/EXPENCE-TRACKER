import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUserExpenses } from "../services/expenseService";
import { generateText } from "../services/geminiService";



export default function Advice() {
  const [expenses, setExpenses] = useState([]);
  const [advice,setAdvice] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi 👋 I’m your personal finance advisor. Ask me anything about your spending.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadExpenses = async () => {
      const data = await getUserExpenses();
      setExpenses(data || []);
    };
    loadExpenses();
  }, []);

  /* =========================
     BUILD CONTEXT FOR AI
  ========================= */
  const buildExpenseContext = () => {
    if (!expenses.length) return "No expenses recorded.";

    const byPayment = {};

    expenses.forEach((e) => {
      const method = e.paymentMethod || "Other";
      byPayment[method] = (byPayment[method] || 0) + Number(e.amount);
    });

    const paymentSummary = Object.entries(byPayment)
      .map(([k, v]) => `${k}: ₹${v}`)
      .join("\n");

    const detailed = expenses
      .map(
        (e) => `
Title: ${e.title}
Amount: ₹${e.amount}
Category: ${e.category}
Payment Method: ${e.paymentMethod || "Other"}
Date: ${e.date || "Unknown"}
`
      )
      .join("\n");

    return `
PAYMENT SUMMARY:
${paymentSummary}

DETAILED EXPENSES:
${detailed}
`;
  };


  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = async () => {
      if (!input.trim()) return;

      const userMsg = { role: "user", text: input };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const expenseContext = buildExpenseContext();

        const prompt = `
You are a personal finance advisor.

Here is the user's expense data:
${expenseContext}

User question:
"${input}"

Answer clearly using the expense data. If payment method is involved, analyze it properly.
      `;

        const reply = await generateText(prompt);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: reply },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Sorry, I couldn't analyze your expenses right now.",
          },
        ]);
      }
      finally {
        setLoading(false);
      }
    };



    return (
      <div className="flex flex-col gap-8">
        <Navbar />

        <div className="rounded-[4rem] thin-glass p-12 shadow-2xl flex flex-col h-[70vh]">
          {/* CHAT AREA */}
          <div className="flex-1 space-y-6 overflow-y-auto mb-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] rounded-3xl px-6 py-4 text-sm font-semibold ${m.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-white/50 text-slate-800"
                  }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="flex gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cash usage, overspending, tips..."
              className="flex-1 rounded-2xl border px-5 py-4 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="rounded-2xl bg-purple-600 px-6 py-4 font-black text-white hover:scale-105 transition"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    );
  }