import { useState } from "react";
import { registerUser, loginWithGoogle } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { ToastContainer,toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Some error occurred", {
              className: "error-toast",
              bodyClassName: "error-toast-body",
            });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Some error occurred", {
        className: "error-toast",
        bodyClassName: "error-toast-body",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6">

      {/* 🌍 Glass Background */}
      <div className="glass-world fixed inset-0 -z-10">
        <div className="shine-blob blob-indigo"></div>
        <div className="shine-blob blob-sky"></div>
      </div>

      {/* ================= REGISTER CARD ================= */}
      <div className="w-full max-w-md rounded-[3.5rem] thin-glass p-12 shadow-2xl backdrop-blur-[160px]">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Create Account
          </h2>
          <p className="mt-2 text-slate-500 font-semibold">
            Get started with{" "}
            <span className="font-black text-blue-600">Finora</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">

          {/* Email */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-2xl border border-white/60 bg-white/10 px-14 py-4 font-semibold text-slate-800 placeholder:text-slate-400 outline-none backdrop-blur-md focus:ring-2 focus:ring-blue-500/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl border border-white/60 bg-white/10 px-14 py-4 font-semibold text-slate-800 placeholder:text-slate-400 outline-none backdrop-blur-md focus:ring-2 focus:ring-blue-500/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-black text-white shadow-xl hover:scale-[1.02] transition"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/40"></div>
          <span className="text-xs font-bold text-slate-400 uppercase">
            or
          </span>
          <div className="h-px flex-1 bg-white/40"></div>
        </div>

        {/* Google Register (glass style) */}
        <button
          onClick={handleGoogleRegister}
          className="w-full flex items-center justify-center gap-3 rounded-2xl border border-white/60 bg-white/20 py-4 text-lg font-black text-slate-800 shadow-xl backdrop-blur-md hover:bg-white/30 hover:scale-[1.01] transition"
        >
          {/* Google Logo */}
          <svg width="22" height="22" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.3 0 6.3 1.1 8.6 3.2l6.4-6.4C34.8 2.5 29.7 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.5 5.8C12.3 13.2 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-2.8-.4-4H24v7.6h12.7c-.3 2-1.6 5-4.6 7l7.1 5.5c4.1-3.8 6.9-9.3 6.9-16.1z"/>
            <path fill="#FBBC05" d="M10.2 28.9c-.5-1.4-.8-2.9-.8-4.4s.3-3 .8-4.4l-7.5-5.8C.9 17.5 0 20.7 0 24s.9 6.5 2.7 9.7l7.5-5.8z"/>
            <path fill="#34A853" d="M24 48c5.7 0 10.5-1.9 14-5.1l-7.1-5.5c-1.9 1.3-4.5 2.2-6.9 2.2-6.3 0-11.7-3.7-13.8-9.1l-7.5 5.8C6.6 42.6 14.6 48 24 48z"/>
          </svg>

          <span>Continue with Google</span>
        </button>

        {/* Footer */}
        <p className="mt-8 text-center text-sm font-semibold text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-black text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
