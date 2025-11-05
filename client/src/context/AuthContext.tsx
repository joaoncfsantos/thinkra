import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/interfaces/User";

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session on app load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate that the token exists and is not empty
        if (parsedUser.token && parsedUser.token.trim() !== "") {
          setUser(parsedUser);
        } else {
          // Clear invalid stored user
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/api/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    const userData = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name,
      token: data.session.access_token,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const signUp = async (name: string, email: string, password: string) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/api/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    if (data.user && data.session) {
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        token: data.session.access_token,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const forgotPassword = async (email: string) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/api/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
  };

  const resetPassword = async (password: string) => {
    // Get tokens from session storage
    const storedTokens = sessionStorage.getItem("reset_tokens");
    const tokens = storedTokens ? JSON.parse(storedTokens) : null;

    if (!tokens?.access_token) {
      throw new Error("No reset token found");
    }

    // Import the supabase client
    const { default: supabase } = await import("@/utils/supabase");

    // Set the session with the recovery tokens
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    if (sessionError) {
      throw new Error(`Failed to set session: ${sessionError.message}`);
    }

    // Now update the password
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      throw new Error(`Failed to reset password: ${error.message}`);
    }

    // Clear the temporary tokens
    sessionStorage.removeItem("reset_tokens");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        signUp,
        forgotPassword,
        resetPassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
