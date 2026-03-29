import { useProjectStore } from "../store/useProjectStore";
import { useAuthStore } from "../store/useAuthStore";
import { AnalyticsCards } from "../components/AnalyticsCards";
import { RecentProjects } from "../components/RecentProjects";
import { ProjectTypeCharts } from "../components/ProjectTypeCharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function Dashboard() {
  const projects = useProjectStore((state) => state.projects);
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const isLoading = useProjectStore((state) => state.isLoading);
  const getValidToken = useAuthStore((state) => state.getValidToken);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [loadAttempted, setLoadAttempted] = useState(false);

  // Load projects from backend on mount
  useEffect(() => {
    if (!loadAttempted) {
      console.log("Dashboard: Loading projects with fresh token...");
      setLoadAttempted(true);
      
      // Get a fresh valid token before loading
      getValidToken().then((token) => {
        if (!token) {
          console.error("Dashboard: No valid token available");
          toast.error("Your session has expired. Please log in again.");
          logout();
          navigate("/login");
          return;
        }
        
        loadProjects(token).catch((error) => {
          console.error("Dashboard: Failed to load projects:", error);
          
          // If JWT is invalid, logout and redirect
          if (error?.message?.includes("Unauthorized") || error?.message?.includes("Session expired") || error?.message?.includes("401")) {
            console.log("Dashboard: Invalid token detected, logging out...");
            toast.error("Your session has expired. Please log in again.");
            logout();
            navigate("/login");
          }
        });
      });
    }
  }, [loadAttempted, getValidToken, loadProjects, logout, navigate]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 lg:ml-0 ml-0">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Welcome back! Here's an overview of your UX evaluation projects.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading your projects...</p>
        </div>
      ) : (
        <>
          <AnalyticsCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <ProjectTypeCharts />
          </div>

          <RecentProjects />
        </>
      )}
    </div>
  );
}