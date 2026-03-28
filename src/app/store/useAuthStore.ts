import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-aba765bd`;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            console.error("Login failed:", data.error);
            return false;
          }

          set({ 
            user: { ...data.user, role: "Evaluator" },
            accessToken: data.access_token,
            isAuthenticated: true 
          });
          
          return true;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },

      signup: async (email: string, password: string, name: string) => {
        try {
          const response = await fetch(`${API_BASE}/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, name }),
          });

          const data = await response.json();

          if (!response.ok) {
            return { success: false, error: data.error || "Signup failed" };
          }

          // Auto-login after signup
          const loginSuccess = await get().login(email, password);
          
          if (loginSuccess) {
            return { success: true };
          } else {
            return { success: false, error: "Account created but login failed. Please try logging in manually." };
          }
        } catch (error) {
          console.error("Signup error:", error);
          return { success: false, error: "Signup failed. Please try again." };
        }
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      setUser: (user: User, token: string) => {
        set({ user, accessToken: token, isAuthenticated: true });
      },
    }),
    {
      name: "uxoti-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);