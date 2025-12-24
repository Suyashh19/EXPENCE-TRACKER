import { useState } from "react";
import { registerUser, loginWithGoogle } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

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
      alert(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="thin-glass p-10 rounded-[3rem]">
        <h2 className="text-2xl font-black">Create Account</h2>

        {/* Minimal logic wiring — UI unchanged */}
        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Register</button>
        </form>

        <button onClick={handleGoogleRegister} className="mt-4">
          Register with Google
        </button>

        <p className="mt-4 text-sm">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
