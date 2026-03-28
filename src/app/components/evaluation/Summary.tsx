import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar, User, Monitor, Target, CheckCircle, AlertCircle } from "lucide-react";
import type { Project } from "../../store/useProjectStore";

interface SummaryProps {
  projectId: string;
  project: Project;
}

export function Summary({ projectId, project }: SummaryProps) {
  const evaluationData = project.evaluationData;
  const hasData = evaluationData && (
    evaluationData.journeySteps.length > 0 ||
    evaluationData.findings.length > 0 ||
    evaluationData.scores.length > 0
  );

  const getAverageScore = () => {
    if (!evaluationData?.scores || evaluationData.scores.length === 0) return 0;
    const sum = evaluationData.scores.reduce((acc, s) => acc + s.score, 0);
    return Math.round(sum / evaluationData.scores.length);
  };

  const getCriticalFindings = () => {
    if (!evaluationData?.findings) return 0;
    return evaluationData.findings.filter(f => f.severity === "Critical").length;
  };

  const getHighFindings = () => {
    if (!evaluationData?.findings) return 0;
    return evaluationData.findings.filter(f => f.severity === "High").length;
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <h2 className="mb-6">Evaluation Summary</h2>

        <div className="space-y-6">
          <div>
            <h3 className="mb-4">Project Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-input-background border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                    <Target className="text-chart-1" size={20} />
                  </div>
                  <div>
                    <p className="caption text-muted-foreground">Project</p>
                    <p className="mt-1">{project.name}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-input-background border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <Monitor className="text-chart-2" size={20} />
                  </div>
                  <div>
                    <p className="caption text-muted-foreground">Application</p>
                    <p className="mt-1">{project.app}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-input-background border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                    <User className="text-chart-3" size={20} />
                  </div>
                  <div>
                    <p className="caption text-muted-foreground">Evaluator</p>
                    <p className="mt-1">{project.evaluator}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-input-background border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                    <Calendar className="text-chart-4" size={20} />
                  </div>
                  <div>
                    <p className="caption text-muted-foreground">Date</p>
                    <p className="mt-1">{project.date}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="mb-4">Evaluation Details</h3>
            <Card className="p-4 bg-input-background border-border">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="caption text-muted-foreground mb-2">Platform</p>
                  <Badge variant="outline">{project.platform}</Badge>
                </div>
                <div>
                  <p className="caption text-muted-foreground mb-2">Method</p>
                  <Badge variant="outline">{project.method}</Badge>
                </div>
                <div>
                  <p className="caption text-muted-foreground mb-2">Status</p>
                  <Badge
                    variant={
                      project.status === "Completed" ? "default" : "secondary"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="caption text-muted-foreground mb-2">
                  Scope / Flow
                </p>
                <p>{project.scope}</p>
              </div>
            </Card>
          </div>

          {hasData && (
            <div>
              <h3 className="mb-4">Evaluation Progress</h3>
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 bg-input-background border-border">
                  <p className="caption text-muted-foreground mb-2">Journey Steps</p>
                  <p className="text-2xl">{evaluationData.journeySteps.length}</p>
                </Card>

                <Card className="p-4 bg-input-background border-border">
                  <p className="caption text-muted-foreground mb-2">Total Findings</p>
                  <p className="text-2xl">{evaluationData.findings.length}</p>
                  {(getCriticalFindings() > 0 || getHighFindings() > 0) && (
                    <p className="caption text-destructive mt-1">
                      {getCriticalFindings()} Critical, {getHighFindings()} High
                    </p>
                  )}
                </Card>

                <Card className="p-4 bg-input-background border-border">
                  <p className="caption text-muted-foreground mb-2">Average Score</p>
                  <p className="text-2xl">{getAverageScore()}/100</p>
                </Card>
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-4">Report Preview</h3>
            <Card className="p-6 bg-input-background border-border">
              {hasData ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-chart-1 mt-1" size={20} />
                    <div>
                      <p>Evaluation data saved</p>
                      <p className="caption text-muted-foreground mt-1">
                        Your evaluation includes {evaluationData.journeySteps.length} journey steps,{" "}
                        {evaluationData.findings.length} findings, and scoring for{" "}
                        {evaluationData.scores.length} {project.method === "Heuristic" ? "heuristics" : "dimensions"}
                      </p>
                    </div>
                  </div>
                  <p className="caption text-muted-foreground">
                    Click "Generate Report" to create a comprehensive evaluation document
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No evaluation data yet</p>
                  <p className="caption mt-2">
                    Start documenting your evaluation in the other tabs
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}