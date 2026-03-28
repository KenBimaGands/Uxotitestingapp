import { useProjectStore } from "../store/useProjectStore";
import { AnalyticsCards } from "../components/AnalyticsCards";
import { RecentProjects } from "../components/RecentProjects";
import { ProjectTypeCharts } from "../components/ProjectTypeCharts";

export function Dashboard() {
  const projects = useProjectStore((state) => state.projects);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your UX evaluation projects.
        </p>
      </div>

      <AnalyticsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectTypeCharts />
      </div>

      <RecentProjects />
    </div>
  );
}