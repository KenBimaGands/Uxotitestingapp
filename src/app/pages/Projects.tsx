import { useState } from "react";
import { useProjectStore } from "../store/useProjectStore";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Link } from "react-router";
import { Plus, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { NewProjectDialog } from "../components/NewProjectDialog";

export function Projects() {
  const projects = useProjectStore((state) => state.projects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.app.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesMethod = methodFilter === "all" || project.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage all your UX evaluation projects
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Heuristic">Heuristic</SelectItem>
                <SelectItem value="7 Dimensions">7 Dimensions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all cursor-pointer h-full">
              <div className="space-y-4">
                <div className="pb-4 border-b border-border">
                  <h2>{project.name}</h2>
                  <p className="text-muted-foreground mt-1 text-sm">{project.app}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Evaluator</span>
                    <span className="text-foreground">{project.evaluator}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Date</span>
                    <span className="text-foreground">{project.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Platform</span>
                    <span className="text-foreground">{project.platform}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Method</span>
                    <span className="text-foreground">{project.method}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Last modified: {project.lastModified}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="p-12 bg-card border-border">
          <div className="text-center text-muted-foreground">
            <p>No projects found</p>
            <p className="caption mt-1">Try adjusting your filters or create a new project</p>
          </div>
        </Card>
      )}

      <NewProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}