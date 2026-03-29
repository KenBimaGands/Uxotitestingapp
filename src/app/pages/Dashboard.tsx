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
  const accessToken = useAuthStore((state) => state.accessToken);
  const [hasLoadedProjects, setHasLoadedProjects] = useState(false);

  // Load projects from backend on mount
  useEffect(() => {
    // If we don't have a token, don't attempt to load
    if (!accessToken) {
      console.log("=== DASHBOARD: No access token available ===");
      return;
    }

    // Only load once
    if (hasLoadedProjects) {
      return;
    }

    console.log("=== DASHBOARD: Loading projects with token ===");
    console.log("Token (first 50):", accessToken.substring(0, 50));
    setHasLoadedProjects(true);
    
    loadProjects(accessToken).catch((error) => {
      console.error("=== DASHBOARD: Failed to load projects ===", error);
      toast.error("Failed to load projects. Please try refreshing the page.");
    });
  }, [accessToken, hasLoadedProjects, loadProjects]);

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