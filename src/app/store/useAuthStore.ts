import { create } from "zustand";
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
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
  getValidToken: () => Promise<string | null>;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-aba765bd`;

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
  
  // Get a valid token, refreshing if necessary
  getValidToken: async () => {
    try {
      console.log("=== AUTH: Getting valid token ===" );
      
      // Get current session from Supabase
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Failed to get session:", error.message);
        return null;
      }
      
      if (!data.session) {
        console.log("No active session found");
        return null;
      }
      
      // Check if token is expired or about to expire (within 60 seconds)
      const expiresAt = data.session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      
      if (expiresAt && expiresAt - now < 60) {
        console.log("Token expired or expiring soon, refreshing...");
        
        // Refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshData.session) {
          console.error("Failed to refresh session:", refreshError?.message);
          // Clear auth state on refresh failure
          set({ user: null, accessToken: null, isAuthenticated: false });
          return null;
        }
        
        console.log("Token refreshed successfully");
        
        // Update store with fresh token
        set({
          accessToken: refreshData.session.access_token,
          user: {
            id: refreshData.session.user.id,
            email: refreshData.session.user.email || "",
            name: refreshData.session.user.user_metadata?.name || "User",
            role: "Evaluator"
          },
          isAuthenticated: true
        });
        
        return refreshData.session.access_token;
      }
      
      // Token is still valid
      console.log("Token is valid");
      
      // Update store if token doesn't match
      if (get().accessToken !== data.session.access_token) {
        set({ accessToken: data.session.access_token });
      }
      
      return data.session.access_token;
    } catch (error) {
      console.error("Exception in getValidToken:", error);
      return null;
    }
  },
  
  // Initialize auth on app load - check for existing session
  initializeAuth: async () => {
    try {
      console.log("=== AUTH INIT: Checking for existing session ===");
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth init error:", error.message);
        set({ user: null, accessToken: null, isAuthenticated: false, isInitialized: true });
        return;
      }
      
      if (data.session) {
        console.log("Auth init: Found existing session");
        console.log("User:", data.session.user.email);
        console.log("Token length:", data.session.access_token.length);
        
        set({
          user: {
            id: data.session.user.id,
            email: data.session.user.email || "",
            name: data.session.user.user_metadata?.name || "User",
            role: "Evaluator"
          },
          accessToken: data.session.access_token,
          isAuthenticated: true,
          isInitialized: true
        });
      } else {
        console.log("Auth init: No existing session");
        set({ user: null, accessToken: null, isAuthenticated: false, isInitialized: true });
      }
    } catch (error) {
      console.error("Auth init exception:", error);
      set({ user: null, accessToken: null, isAuthenticated: false, isInitialized: true });
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      console.log("=== AUTH LOGIN: Starting ===");
      console.log("Email:", email);
      
      // Sign in with Supabase
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

      console.log("=== AUTH LOGIN: Success ===");
      console.log("User ID:", data.user.id);
      console.log("User email:", data.user.email);
      console.log("Token length:", data.session.access_token.length);
      console.log("Token (first 50):", data.session.access_token.substring(0, 50));
      
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
      console.error("Login exception:", error);
      return false;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    try {
      console.log("=== AUTH SIGNUP: Starting ===");
      
      // Call server endpoint to create user with admin privileges
      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      });

      console.log("Signup response status:", response.status);
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMsg = data.error || `Signup failed with status ${response.status}`;
        console.error("Signup failed:", errorMsg);
        return { success: false, error: errorMsg };
      }

      const data = await response.json();
      console.log("User created successfully");

      // Now sign in
      console.log("Auto-login after signup...");
      const loginSuccess = await get().login(email, password);
      
      if (loginSuccess) {
        console.log("=== AUTH SIGNUP: Complete ===");
        return { success: true };
      } else {
        console.error("Auto-login failed after signup");
        return { success: false, error: "Account created but login failed. Please try logging in manually." };
      }
    } catch (error) {
      console.error("Signup exception:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        return { success: false, error: "Network error: Cannot reach server. Please check your connection." };
      }
      return { success: false, error: `Signup error: ${error instanceof Error ? error.message : "Unknown error"}` };
    }
  },

  logout: () => {
    console.log("=== AUTH LOGOUT: User clicked logout ===");
    
    // Clear local state immediately
    set({ user: null, accessToken: null, isAuthenticated: false });
    
    // Sign out from Supabase
    supabase.auth.signOut().catch(err => console.error("Signout error:", err));
  },

  clearAuth: () => {
    console.log("=== AUTH CLEAR: Clearing state only ===");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));