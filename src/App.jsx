import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses"; // [!code ++]
import Analytics from "./pages/Analytics"; // [!code ++]
import Sidebar from "./components/Sidebar";

// The layout wrapper that provides the "Glass World" environment
const GlassLayout = ({ children }) => {
  return (
    <div className="relative flex h-screen w-full gap-8 p-8 antialiased overflow-hidden">
      {/* --- THE BACKGROUND BLUR (Consistent across all pages) --- */}
      <div className="glass-world fixed inset-0 -z-10">
        <div className="shine-blob blob-indigo"></div>
        <div className="shine-blob blob-rose"></div>
        <div className="shine-blob blob-sky"></div>
      </div>

      {/* --- SIDEBAR --- */}
      <Sidebar />

      {/* --- PAGE CONTENT area with custom scrollbar --- */}
      <main className="flex flex-1 flex-col gap-8 overflow-y-auto pr-4 custom-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes: Standalone pages without glass layout/sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Protected Dashboard Routes: Wrapped in GlassLayout */}
        <Route 
          path="/dashboard" 
          element={<GlassLayout><Dashboard /></GlassLayout>} 
        />
        <Route 
          path="/add" 
          element={<GlassLayout><AddExpense /></GlassLayout>} 
        />
        <Route 
          path="/expenses" 
          element={<GlassLayout><Expenses /></GlassLayout>} 
        />
        <Route 
          path="/analytics" 
          element={<GlassLayout><Analytics /></GlassLayout>} 
        />
      </Routes>
    </BrowserRouter>
  );
}