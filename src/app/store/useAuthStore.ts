import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "/src/lib/supabase";
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
  clearAuth: () => void;
  checkSession: () => Promise<void>;
  getValidToken: () => Promise<string | null>;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-aba765bd`;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      
      // Get a valid token, refreshing if necessary
      getValidToken: async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error || !data.session) {
            console.error("Failed to get valid token:", error?.message);
            set({ user: null, accessToken: null, isAuthenticated: false });
            return null;
          }
          
          // Update store with fresh token
          if (data.session.access_token !== get().accessToken) {
            console.log("Token was refreshed, updating store...");
            set({
              accessToken: data.session.access_token,
              user: {
                id: data.session.user.id,
                email: data.session.user.email || "",
                name: data.session.user.user_metadata?.name || "User",
                role: "Evaluator"
              },
              isAuthenticated: true
            });
          }
          
          return data.session.access_token;
        } catch (error) {
          console.error("Error getting valid token:", error);
          return null;
        }
      },
      
      checkSession: async () => {
        try {
          console.log("Auth store: Checking existing session...");
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Session check error:", error.message);
            // Clear invalid session
            set({ user: null, accessToken: null, isAuthenticated: false });
            return;
          }
          
          if (data.session) {
            console.log("Auth store: Valid session found, updating state...");
            set({
              user: {
                id: data.session.user.id,
                email: data.session.user.email || "",
                name: data.session.user.user_metadata?.name || "User",
                role: "Evaluator"
              },
              accessToken: data.session.access_token,
              isAuthenticated: true
            });
          } else {
            console.log("Auth store: No valid session found, clearing state...");
            set({ user: null, accessToken: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Session check exception:", error);
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },
      
      login: async (email: string, password: string) => {
        try {
          console.log("Auth store: Attempting client-side login...");
          
          // Use Supabase client to sign in
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("Login failed:", error.message);
            return false;
          }

          if (!data.session) {
            console.error("Login failed: No session returned");
            return false;
          }

          console.log("Auth store: Login successful!");
          console.log("Auth store: User ID:", data.user.id);
          
          set({ 
            user: {
              id: data.user.id,
              email: data.user.email || "",
              name: data.user.user_metadata?.name || "User",
              role: "Evaluator"
            },
            accessToken: data.session.access_token,
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
          console.log("Auth store: Starting signup process...");
          
          // Clear any existing auth state first
          set({ user: null, accessToken: null, isAuthenticated: false });
          
          // Call server endpoint to create user with admin privileges
          const response = await fetch(`${API_BASE}/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({ email, password, name }),
          });

          console.log("Auth store: Signup response status:", response.status);
          
          if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            const errorMsg = data.error || `Signup failed with status ${response.status}`;
            console.error("Auth store: Signup failed:", errorMsg);
            return { success: false, error: errorMsg };
          }

          const data = await response.json();
          console.log("Auth store: User created successfully:", data.user);

          // Now sign in with Supabase client
          console.log("Auth store: Attempting client-side login after signup...");
          const loginSuccess = await get().login(email, password);
          
          if (loginSuccess) {
            console.log("Auth store: Signup and login complete!");
            return { success: true };
          } else {
            console.error("Auth store: Auto-login failed after signup");
            return { success: false, error: "Account created but login failed. Please try logging in manually." };
          }
        } catch (error) {
          console.error("Auth store: Signup exception:", error);
          if (error instanceof TypeError && error.message.includes("fetch")) {
            return { success: false, error: "Network error: Cannot reach server. Please check your connection." };
          }
          return { success: false, error: `Signup error: ${error instanceof Error ? error.message : "Unknown error"}` };
        }
      },

      logout: () => {
        console.log("Auth store: Logging out...");
        // First clear local state
        set({ user: null, accessToken: null, isAuthenticated: false });
        // Then sign out from Supabase (this will trigger SIGNED_OUT event, but state is already cleared)
        supabase.auth.signOut().catch(err => console.error("Signout error:", err));
      },

      setUser: (user: User, token: string) => {
        set({ user, accessToken: token, isAuthenticated: true });
      },

      clearAuth: () => {
        console.log("Auth store: Clearing auth state...");
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "uxoti-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);