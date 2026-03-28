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
  addProject: (project: Omit<Project, "id" | "lastModified">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  saveEvaluationData: (projectId: string, data: EvaluationData) => void;
  loadProjects: (accessToken: string) => Promise<void>;
  syncProjects: (accessToken: string) => Promise<void>;
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
          const response = await fetch(`${API_BASE}/projects`, {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to load projects");
          }

          const data = await response.json();
          set({ projects: data.projects || [], isLoading: false });
        } catch (error) {
          console.error("Error loading projects:", error);
          set({ isLoading: false });
        }
      },

      syncProjects: async (accessToken: string) => {
        set({ isSyncing: true });
        try {
          const { projects } = get();
          
          const response = await fetch(`${API_BASE}/projects`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ projects }),
          });

          if (!response.ok) {
            throw new Error("Failed to sync projects");
          }

          set({ isSyncing: false });
        } catch (error) {
          console.error("Error syncing projects:", error);
          set({ isSyncing: false });
        }
      },

      addProject: (project) => {
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: Date.now().toString(),
              lastModified: new Date().toISOString().split("T")[0],
            },
          ],
        }));
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