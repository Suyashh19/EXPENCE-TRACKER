import { useState } from "react";
import { loginUser, loginWithGoogle } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {/* Background */}
      <div className="glass-world fixed inset-0 -z-10">
        <div className="shine-blob blob-indigo"></div>
      </div>

      <div className="w-96 rounded-[3rem] thin-glass p-12 text-center shadow-2xl">
        <h2 className="text-3xl font-black text-slate-900">Login</h2>
        <p className="mt-4 text-slate-500">Welcome to Expense Tracker</p>

        {/* Email / Password */}
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl bg-white/20 p-4 border border-white/60 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl bg-white/20 p-4 border border-white/60 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 p-4 font-bold text-white shadow-lg"
          >
            Login
          </button>
        </form>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full rounded-2xl bg-red-500 p-4 font-bold text-white shadow-lg"
        >
          Sign in with Google
        </button>

        <p className="mt-6 text-sm text-slate-600">
          New user?{" "}
          <Link to="/register" className="font-bold text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
