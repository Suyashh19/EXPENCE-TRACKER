import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  // Replace with real auth check (Firebase/Supabase)
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;