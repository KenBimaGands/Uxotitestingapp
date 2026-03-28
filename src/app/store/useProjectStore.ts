import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  addProject: (project: Omit<Project, "id" | "lastModified">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  saveEvaluationData: (projectId: string, data: EvaluationData) => void;
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-commerce Checkout Flow",
    app: "ShopEase Mobile",
    evaluator: "Sarah Chen",
    date: "2026-03-15",
    platform: "Mobile",
    scope: "Checkout and payment flow",
    status: "Completed",
    method: "Heuristic",
    lastModified: "2026-03-20",
  },
  {
    id: "2",
    name: "Banking App Onboarding",
    app: "SecureBank",
    evaluator: "Michael Torres",
    date: "2026-03-10",
    platform: "Mobile",
    scope: "User registration and KYC",
    status: "In Progress",
    method: "7 Dimensions",
    lastModified: "2026-03-25",
  },
  {
    id: "3",
    name: "Dashboard Navigation Audit",
    app: "Analytics Pro",
    evaluator: "Emma Wilson",
    date: "2026-03-05",
    platform: "Web",
    scope: "Main dashboard and navigation",
    status: "Completed",
    method: "Heuristic",
    lastModified: "2026-03-18",
  },
  {
    id: "4",
    name: "Desktop App Accessibility",
    app: "DesignTools Suite",
    evaluator: "James Park",
    date: "2026-02-28",
    platform: "Desktop",
    scope: "Accessibility compliance review",
    status: "Completed",
    method: "7 Dimensions",
    lastModified: "2026-03-12",
  },
  {
    id: "5",
    name: "Cross-Platform Consistency",
    app: "CloudDrive",
    evaluator: "Lisa Anderson",
    date: "2026-03-22",
    platform: "Cross-platform",
    scope: "UI consistency across devices",
    status: "In Progress",
    method: "Heuristic",
    lastModified: "2026-03-27",
  },
];

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: mockProjects,
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: Date.now().toString(),
              lastModified: new Date().toISOString().split("T")[0],
            },
          ],
        })),
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