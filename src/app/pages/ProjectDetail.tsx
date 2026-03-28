import { useParams, Link, useNavigate } from "react-router";
import { useProjectStore } from "../store/useProjectStore";
import { useAuthStore } from "../store/useAuthStore";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Calendar, User, Monitor, Target, Edit, Trash2, PlayCircle } from "lucide-react";
import { EditProjectDialog } from "../components/EditProjectDialog";
import { useState } from "react";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = useProjectStore((state) => state.projects.find((p) => p.id === id));
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const syncProjects = useProjectStore((state) => state.syncProjects);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`)) {
      deleteProject(id!);
      
      // Sync with backend
      if (accessToken) {
        await syncProjects(accessToken);
      }
      
      navigate("/projects");
    }
  };

  if (!project) {
    return (
      <div className="p-8">
        <Card className="p-12 bg-card border-border text-center">
          <h2>Project not found</h2>
          <p className="text-muted-foreground mt-2">
            The project you're looking for doesn't exist.
          </p>
          <Link to="/projects">
            <Button className="mt-4">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="caption">Back to Projects</span>
          </Link>
          <h1 style={{ fontFamily: 'Crimson Text, serif', fontSize: '24px' }}>{project.name}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">{project.app}</p>
        </div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)} className="w-full sm:w-auto">
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <Card className="p-5 lg:p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center flex-shrink-0">
              <User className="text-chart-1" size={20} />
            </div>
            <div className="min-w-0">
              <p className="caption text-muted-foreground">Evaluator</p>
              <p className="mt-1 truncate">{project.evaluator}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 lg:p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="text-chart-2" size={20} />
            </div>
            <div className="min-w-0">
              <p className="caption text-muted-foreground">Date</p>
              <p className="mt-1 truncate">{project.date}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 lg:p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center flex-shrink-0">
              <Monitor className="text-chart-3" size={20} />
            </div>
            <div className="min-w-0">
              <p className="caption text-muted-foreground">Platform</p>
              <p className="mt-1 truncate">{project.platform}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5 lg:p-6 bg-card border-border">
        <h2 className="pb-2 border-b border-border text-lg lg:text-xl">Project Details</h2>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <p className="caption text-muted-foreground mb-1">Evaluation Method</p>
              <Badge variant="outline" className="text-sm lg:text-base">
                {project.method}
              </Badge>
            </div>
            <div>
              <p className="caption text-muted-foreground mb-1">Status</p>
              <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                {project.status}
              </Badge>
            </div>
          </div>

          <div>
            <p className="caption text-muted-foreground mb-1">Scope / Flow</p>
            <p className="text-sm lg:text-base">{project.scope}</p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="caption text-muted-foreground text-[11px]">
              Last modified: {project.lastModified}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-5 lg:p-6 bg-card border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="mb-1 text-lg lg:text-xl">Evaluation Workspace</h3>
            <p className="caption text-muted-foreground">Document findings and generate reports</p>
          </div>
          <Link to={`/projects/${id}/evaluation`} className="w-full lg:w-auto">
            <Button size="lg" className="w-full lg:w-auto">
              <PlayCircle size={20} className="mr-2" />
              Start Evaluation
            </Button>
          </Link>
        </div>
      </Card>

      <EditProjectDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        project={project}
      />
    </div>
  );
}