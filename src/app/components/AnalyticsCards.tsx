import { useProjectStore } from "../store/useProjectStore";
import { Card } from "./ui/card";
import { FolderKanban, BarChart3, Monitor, CheckCircle } from "lucide-react";

export function AnalyticsCards() {
  const projects = useProjectStore((state) => state.projects);

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;
  
  const methodCounts = {
    Heuristic: projects.filter((p) => p.method === "Heuristic").length,
    "7 Dimensions": projects.filter((p) => p.method === "7 Dimensions").length,
  };

  const platformCounts = {
    Mobile: projects.filter((p) => p.platform === "Mobile").length,
    Web: projects.filter((p) => p.platform === "Web").length,
    Desktop: projects.filter((p) => p.platform === "Desktop").length,
    "Cross-platform": projects.filter((p) => p.platform === "Cross-platform").length,
  };

  const totalPlatformTypes = Object.values(platformCounts).filter((count) => count > 0).length;

  const cards = [
    {
      title: "Total Projects",
      value: totalProjects,
      description: `${completedProjects} completed`,
      icon: FolderKanban,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Evaluation Methods",
      value: Object.values(methodCounts).filter((count) => count > 0).length,
      description: `${methodCounts.Heuristic} Heuristic, ${methodCounts["7 Dimensions"]} 7D`,
      icon: BarChart3,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Platform Types",
      value: totalPlatformTypes,
      description: `Across ${totalProjects} projects`,
      icon: Monitor,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Completion Rate",
      value: `${totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%`,
      description: `${completedProjects} of ${totalProjects} projects`,
      icon: CheckCircle,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="p-4 bg-card border-border flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between mb-1">
              <p className="text-muted-foreground text-sm">{card.title}</p>
              <div className={`w-8 h-8 rounded-md ${card.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={card.color} size={16} />
              </div>
            </div>
            <div>
              <h1 className={`text-4xl ${card.color}`}>{card.value}</h1>
              <p className="caption text-muted-foreground mt-1">{card.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}