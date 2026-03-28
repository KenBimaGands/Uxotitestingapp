import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useProjectStore, type EvaluationMethod, type Platform, type ProjectStatus } from "../store/useProjectStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const addProject = useProjectStore((state) => state.addProject);
  const syncProjects = useProjectStore((state) => state.syncProjects);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [formData, setFormData] = useState({
    name: "",
    app: "",
    evaluator: "",
    date: "",
    platform: "" as Platform,
    scope: "",
    status: "In Progress" as ProjectStatus,
    method: "" as EvaluationMethod,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.app || !formData.evaluator || !formData.date || 
        !formData.platform || !formData.method || !formData.scope) {
      return;
    }

    addProject(formData);
    
    // Sync with backend
    if (accessToken) {
      await syncProjects(accessToken);
      toast.success("Project created and synced!");
    }
    
    // Reset form
    setFormData({
      name: "",
      app: "",
      evaluator: "",
      date: "",
      platform: "" as Platform,
      scope: "",
      status: "In Progress",
      method: "" as EvaluationMethod,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create New Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="E.g., E-commerce Checkout Flow"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="app" className="text-sm">Application Name</Label>
              <Input
                id="app"
                value={formData.app}
                onChange={(e) => setFormData({ ...formData, app: e.target.value })}
                placeholder="E.g., ShopEase Mobile"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="evaluator" className="text-sm">Evaluator</Label>
              <Input
                id="evaluator"
                value={formData.evaluator}
                onChange={(e) => setFormData({ ...formData, evaluator: e.target.value })}
                placeholder="E.g., Sarah Chen"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm">Evaluation Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-sm">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value as Platform })}
                required
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Desktop">Desktop</SelectItem>
                  <SelectItem value="Cross-platform">Cross-platform</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method" className="text-sm">Evaluation Method</Label>
              <Select
                value={formData.method}
                onValueChange={(value) => setFormData({ ...formData, method: value as EvaluationMethod })}
                required
              >
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Heuristic">Heuristic</SelectItem>
                  <SelectItem value="7 Dimensions">7 Dimensions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as ProjectStatus })}
                required
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scope" className="text-sm">Scope</Label>
            <Textarea
              id="scope"
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              placeholder="Describe the evaluation scope..."
              className="min-h-[100px]"
              required
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}