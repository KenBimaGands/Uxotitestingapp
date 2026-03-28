import { useParams, Link, useNavigate } from "react-router";
import { useProjectStore } from "../store/useProjectStore";
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`)) {
      deleteProject(id!);
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
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="caption">Back to Projects</span>
          </Link>
          <h1 style={{ fontFamily: 'Crimson Text, serif', fontSize: '24px' }}>{project.name}</h1>
          <p className="text-muted-foreground">{project.app}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
              <User className="text-chart-1" size={20} />
            </div>
            <div>
              <p className="caption text-muted-foreground">Evaluator</p>
              <p className="mt-1">{project.evaluator}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <Calendar className="text-chart-2" size={20} />
            </div>
            <div>
              <p className="caption text-muted-foreground">Date</p>
              <p className="mt-1">{project.date}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <Monitor className="text-chart-3" size={20} />
            </div>
            <div>
              <p className="caption text-muted-foreground">Platform</p>
              <p className="mt-1">{project.platform}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border">
        <h2 className="pb-2 border-b border-border">Project Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="caption text-muted-foreground mb-1">Evaluation Method</p>
              <Badge variant="outline" className="text-base">
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
            <p>{project.scope}</p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="caption text-muted-foreground text-[11px]">
              Last modified: {project.lastModified}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1">Evaluation Workspace</h3>
            <p className="caption text-muted-foreground">Document findings and generate reports</p>
          </div>
          <Link to={`/projects/${id}/evaluation`}>
            <Button size="lg">
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