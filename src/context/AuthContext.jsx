import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { getPreferredCurrency } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔥 GLOBAL CURRENCY STATE
  const [preferredCurrency, setPreferredCurrency] = useState("INR");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // 🔁 Load preferred currency once on login
        try {
          const currency = await getPreferredCurrency();
          setPreferredCurrency(currency || "INR");
        } catch (err) {
          console.error("Failed to load preferred currency", err);
          setPreferredCurrency("INR");
        }
      } else {
        // Reset on logout
        setPreferredCurrency("INR");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        // ✅ expose both state + setter
        preferredCurrency,
        setPreferredCurrency,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
