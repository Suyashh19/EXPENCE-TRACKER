import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

import {
  Sparkles,
  BarChart3,
  ShieldCheck,
  Zap,
  Target,
  PieChart,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  // ✅ AUTO REDIRECT IF USER IS ALREADY LOGGED IN
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* 🌍 GLASS BACKGROUND */}
      <div className="glass-world fixed inset-0 -z-10">
        <div className="shine-blob blob-indigo"></div>
        <div className="shine-blob blob-sky"></div>
      </div>

      {/* ================= NAVBAR ================= */}
      <header className="mx-8 mt-6 rounded-[2.5rem] thin-glass px-10 py-6 flex items-center justify-between backdrop-blur-[140px]">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
            <div className="h-4 w-4 bg-white rotate-45 rounded-sm"></div>
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Finora
          </h1>
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-2 rounded-xl font-bold text-slate-700 hover:bg-white/40 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-black shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="mt-28 flex justify-center px-6">
        <div className="max-w-4xl w-full rounded-[3.5rem] thin-glass p-16 text-center shadow-2xl backdrop-blur-[160px]">

          <span className="inline-flex items-center gap-2 mb-6 rounded-full bg-blue-600/10 px-6 py-2 text-xs font-black uppercase tracking-widest text-blue-600">
            <Sparkles size={14} />
            AI-Powered Financial Management
          </span>

          <h2 className="text-5xl font-black tracking-tight text-slate-900">
            Take Control of Your <br />
            <span className="text-blue-600">Financial Future</span>
          </h2>

          <p className="mt-6 text-lg font-semibold text-slate-500 max-w-2xl mx-auto">
            Track expenses effortlessly, gain AI-powered insights, and make
            smarter financial decisions with{" "}
            <span className="font-black text-slate-800">Finora</span>.
          </p>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="mt-36 px-24">
        <h3 className="text-4xl font-black text-center text-slate-900">
          Powerful Features
        </h3>
        <p className="mt-4 text-center text-slate-500 font-semibold">
          Everything you need to manage your finances effectively
        </p>

        <div className="mt-16 grid grid-cols-3 gap-8">
          {[
            {
              icon: Sparkles,
              title: "AI-Powered Insights",
              desc: "Smart recommendations & financial guidance",
            },
            {
              icon: BarChart3,
              title: "Advanced Analytics",
              desc: "Visual spending breakdowns & trends",
            },
            {
              icon: ShieldCheck,
              title: "Secure & Private",
              desc: "Bank-level encryption for your data",
            },
            {
              icon: Zap,
              title: "Real-time Tracking",
              desc: "Instant expense updates as you spend",
            },
            {
              icon: Target,
              title: "Budget Goals",
              desc: "Set limits and track progress visually",
            },
            {
              icon: PieChart,
              title: "Category Breakdown",
              desc: "Understand exactly where money goes",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-[2.5rem] thin-glass p-8 shadow-xl backdrop-blur-[140px] hover:-translate-y-1 transition-all"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {title}
              </h4>
              <p className="mt-2 text-slate-500 font-semibold">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= GLASS CTA ================= */}
      <section className="mt-40 px-24 pb-24">
        <div className="rounded-[4rem] thin-glass p-16 shadow-2xl grid grid-cols-2 gap-16 backdrop-blur-[160px]">

          {/* LEFT */}
          <div>
            <h3 className="text-4xl font-black text-slate-900">
              Start tracking for free
            </h3>

            <p className="mt-4 font-semibold text-slate-500 max-w-md">
              Join thousands of users already taking control of their finances with{" "}
              <span className="font-black text-blue-600">Finora</span>.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Unlimited expense tracking",
                "AI financial advisor",
                "Detailed analytics & reports",
                "Multi-category support",
                "Budget planning tools",
                "Export data anytime",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-slate-700 font-semibold"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 font-black">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className="inline-flex items-center gap-3 mt-10 rounded-2xl bg-blue-600 px-8 py-4 text-white text-lg font-black shadow-xl hover:scale-[1.02] transition"
            >
              Create Free Account →
            </Link>
          </div>

          {/* RIGHT MINI CARDS */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { title: "AI Powered", desc: "Smart insights", icon: Sparkles },
              { title: "Secure", desc: "Encrypted data", icon: ShieldCheck },
              { title: "Analytics", desc: "Visual reports", icon: BarChart3 },
              { title: "Fast", desc: "Real-time updates", icon: Zap },
            ].map(({ title, desc, icon: Icon }) => (
              <div
                key={title}
                className="group rounded-[2.5rem] thin-glass p-8 shadow-xl backdrop-blur-[160px] transition-all hover:-translate-y-1"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                  <Icon size={22} strokeWidth={2.2} />
                </div>

                <h4 className="text-lg font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  {title}
                </h4>

                <p className="mt-2 text-slate-500 font-semibold">
                  {desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
