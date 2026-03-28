import { useProjectStore } from "../store/useProjectStore";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function RecentProjects() {
  const projects = useProjectStore((state) => state.projects);
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    .slice(0, 5);

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 style={{ fontFamily: 'Crimson Text' }}>Recent Projects</h3>
        <Link
          to="/projects"
          className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors"
        >
          <span className="caption">View all</span>
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {recentProjects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="block p-4 rounded-lg bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors border border-border"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="truncate">{project.name}</h4>
                <p className="caption text-muted-foreground mt-1">{project.app}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={project.status === "Completed" ? "default" : "secondary"}
                    className="caption"
                  >
                    {project.status}
                  </Badge>
                  <span className="caption text-muted-foreground">{project.method}</span>
                  <span className="caption text-muted-foreground">•</span>
                  <span className="caption text-muted-foreground">{project.platform}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {recentProjects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground col-span-full">
            <p>No projects yet</p>
            <p className="caption mt-1">Create your first evaluation project to get started</p>
          </div>
        )}
      </div>
    </Card>
  );
}