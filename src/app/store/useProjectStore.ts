import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { projectId } from "/utils/supabase/info";

export type EvaluationMethod = "Heuristic" | "7 Dimensions";
export type Platform = "Mobile" | "Web" | "Desktop" | "Cross-platform";
export type ProjectStatus = "In Progress" | "Completed";

export interface JourneyStep {
  id: string;
  name: string;
  description: string;
  userAction: string;
  systemResponse: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  frequency: number; // 0-3 scale
  impact: number; // 0-3 scale
  persistence: number; // 0-3 scale
  severity: "Critical" | "High" | "Medium" | "Low";
  severityScore: number; // frequency × impact × persistence
  location: string;
  recommendation: string;
  heuristic?: string;
  dimension?: string;
}

export interface Score {
  name: string;
  score: number;
}

export interface EvaluationData {
  journeySteps: JourneyStep[];
  findings: Finding[];
  scores: Score[];
}

export interface Project {
  id: string;
  name: string;
  app: string;
  evaluator: string;
  date: string;
  platform: Platform;
  scope: string;
  status: ProjectStatus;
  method: EvaluationMethod;
  lastModified: string;
  evaluationData?: EvaluationData;
}

interface ProjectStore {
  projects: Project[];
  isLoading: boolean;
  isSyncing: boolean;
  addProject: (project: Omit<Project, "id" | "lastModified">) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  saveEvaluationData: (projectId: string, data: EvaluationData) => void;
  loadProjects: (accessToken: string) => Promise<void>;
  syncProjects: (accessToken: string, overrideProjects?: Project[]) => Promise<void>;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-aba765bd`;

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      isLoading: false,
      isSyncing: false,

      loadProjects: async (accessToken: string) => {
        set({ isLoading: true });
        try {
          console.log("=== PROJECT STORE: Loading projects ===");
          console.log("Token (first 50):", accessToken.substring(0, 50));
          console.log("API endpoint:", `${API_BASE}/projects`);
          
          const response = await fetch(`${API_BASE}/projects`, {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          });

          console.log("=== PROJECT STORE: Response received ===");
          console.log("Status:", response.status);
          console.log("Status text:", response.statusText);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("=== PROJECT STORE: Load failed ===", errorData);
            
            // Check if it's an auth error
            if (response.status === 401) {
              set({ projects: [], isLoading: false });
              throw new Error("Unauthorized - Session expired");
            }
            
            throw new Error(errorData.error || "Failed to load projects");
          }

          const data = await response.json();
          console.log("=== PROJECT STORE: Projects loaded successfully ===");
          console.log("Project count:", data.projects?.length || 0);
          set({ projects: data.projects || [], isLoading: false });
        } catch (error) {
          console.error("=== PROJECT STORE: Load error ===", error);
          set({ projects: [], isLoading: false });
          
          // Re-throw auth errors so Dashboard can handle them
          if (error instanceof Error && (error.message.includes("401") || error.message.includes("Unauthorized") || error.message.includes("Session expired"))) {
            throw error;
          }
          
          // For other errors, don't throw (just log) - could be network issues
        }
      },

      syncProjects: async (accessToken: string, overrideProjects?: Project[]) => {
        set({ isSyncing: true });
        try {
          const projects = overrideProjects ?? get().projects;
          
          console.log("Syncing projects to server...");
          console.log("Project count:", projects.length);
          
          const response = await fetch(`${API_BASE}/projects`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ projects }),
          });

          console.log("Sync projects response status:", response.status);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to sync projects:", errorData);
            
            // Check if it's an auth error
            if (response.status === 401) {
              set({ isSyncing: false });
              throw new Error("Unauthorized - Session expired");
            }
            
            throw new Error(errorData.error || "Failed to sync projects");
          }

          console.log("Projects synced successfully");
          set({ isSyncing: false });
        } catch (error) {
          console.error("Error syncing projects:", error);
          set({ isSyncing: false });
          
          // Re-throw auth errors so callers can handle them
          if (error instanceof Error && (error.message.includes("401") || error.message.includes("Unauthorized") || error.message.includes("Session expired"))) {
            throw error;
          }
          
          // For other errors, also throw so callers can handle
          throw error;
        }
      },

      addProject: (project) => {
        const newProject: Project = {
          ...project,
          id: Date.now().toString(),
          lastModified: new Date().toISOString().split("T")[0],
        };
        
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
        
        return newProject;
      },

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, lastModified: new Date().toISOString().split("T")[0] }
              : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      saveEvaluationData: (projectId, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, evaluationData: data } : p
          ),
        })),
    }),
    {
      name: "uxoti-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);