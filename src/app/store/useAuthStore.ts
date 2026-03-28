import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@uxoti.com",
    password: "admin123",
    name: "Admin User",
    role: "Administrator",
  },
  {
    id: "2",
    email: "evaluator@uxoti.com",
    password: "eval123",
    name: "UX Evaluator",
    role: "Evaluator",
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }

        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "uxoti-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
