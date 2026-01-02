import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { useEffect, useState } from "react";

const AuthGuard = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ⏳ Wait until Firebase restores auth state
  if (loading) {
    return <div className="p-10 font-bold">Checking session...</div>;
  }

  // ❌ No user → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ User exists → allow access
  return children;
};

export default AuthGuard;
