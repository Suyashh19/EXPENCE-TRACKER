import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { expenseAdvisor } from "../services/geminiService";
import { toast } from "react-toastify";
import { getUserExpenses } from "../services/expenseService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";



export default function Advice() {
  
  const [expenseSummary, setExpenseSummary] = useState([]);
  
  const fetchExpenses = async () => {
    setExpenseSummary(await getUserExpenses())
  };
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  //   const [expenseSummary, setExpenseSummary] = useState([]);
  // console.log(expenseSummary)
  //   const fetchExpenses = async () => {
    //     const data = await getUserExpenses();
    //     setExpenseSummary(data);
    //     console.log(data)
    //   };
    
    const [messages, setMessages] = useState([
      {
        role: "assistant",
        content: "Hi 👋 I’m your personal finance advisor. Ask me anything about your spending."
      }
    ]);
    
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    // 🔹 Build prompt WITH CONTEXT
    const buildPrompt = () => {
      return `
      You are a personal finance advisor chatbot.
      
      User expense summary:
      ${JSON.stringify(expenseSummary, null, 2)}
      
      Conversation so far:
      ${messages
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n")}
        
        User question:
        "${input}"
        
        
        '`;
      };
      const typeAssistantMessage = async (fullText) => {
        let currentText = "";
      
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      
        for (let i = 0; i < fullText.length; i++) {
          currentText += fullText[i];
      
          await new Promise((res) => setTimeout(res, 18)); // typing speed
      
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: currentText
            };
            return updated;
          });
        }
      };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log("Hello")
      const response = await expenseAdvisor(buildPrompt());

      await typeAssistantMessage(response);

    } catch (err) {
      toast.error("Failed to get advice");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full p-6">
        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto space-y-4 rounded-3xl bg-white/20 backdrop-blur-md p-6 shadow-xl">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-900"
                }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>

            </div>
          ))}

          {loading && (
            <div className="bg-slate-100 w-fit px-4 py-2 rounded-xl animate-pulse">
              Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about saving, overspending, tips..."
            className="flex-1 rounded-2xl px-5 py-4 border outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="rounded-2xl bg-purple-600 px-6 py-4 text-white font-bold hover:scale-105 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
