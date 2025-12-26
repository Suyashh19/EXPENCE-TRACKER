import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import PublicLayout from "./layouts/PublicLayout";
import Advice from "./pages/Advice";
import { getUserExpenses } from "./services/expenseService";

// Glass layout for authenticated pages
const GlassLayout = ({ children }) => {
  return (
    <div className="relative flex h-screen w-full gap-8 p-8 antialiased overflow-hidden">
      <div className="glass-world fixed inset-0 -z-10">
        <div className="shine-blob blob-indigo"></div>
        <div className="shine-blob blob-rose"></div>
        <div className="shine-blob blob-sky"></div>
      </div>

      <Sidebar />

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

        {/* ✅ PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Landing />
            </PublicLayout>
          }
        />

        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />

        <Route
          path="/register"
          element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          }
        />

        {/* ✅ AUTHENTICATED ROUTES */}
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

        <Route
          path="/advice"
          element={<GlassLayout><Advice promiseExpenseSummary={getUserExpenses()} /></GlassLayout>}
        />
      </Routes>
    </BrowserRouter>
  );
}
