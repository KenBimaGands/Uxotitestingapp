import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useProjectStore } from "../store/useProjectStore";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, Save, FileText, Map, ClipboardList, BarChart3 } from "lucide-react";
import { JourneyMap } from "../components/evaluation/JourneyMap";
import { Findings } from "../components/evaluation/Findings";
import { Scoring } from "../components/evaluation/Scoring";
import { Summary } from "../components/evaluation/Summary";
import { toast } from "sonner";
import type { JourneyStep, Finding, Score } from "../store/useProjectStore";

export function Evaluation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = useProjectStore((state) => state.projects.find((p) => p.id === id));
  const saveEvaluationData = useProjectStore((state) => state.saveEvaluationData);

  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [scores, setScores] = useState<Score[]>([]);

  // Load existing evaluation data when component mounts
  useEffect(() => {
    if (project?.evaluationData) {
      setJourneySteps(project.evaluationData.journeySteps);
      setFindings(project.evaluationData.findings);
      setScores(project.evaluationData.scores);
    }
  }, [project]);

  const handleSaveProgress = () => {
    if (!id) return;

    saveEvaluationData(id, {
      journeySteps,
      findings,
      scores,
    });

    toast.success("Progress saved successfully!", {
      description: "Your evaluation data has been saved.",
    });
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
            to={`/projects/${id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="caption">Back to Project</span>
          </Link>
          <h1>Evaluation Workspace</h1>
          <p className="text-muted-foreground">{project.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveProgress}>
            <Save size={16} className="mr-2" />
            Save Progress
          </Button>
          <Button>
            <FileText size={16} className="mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="caption text-muted-foreground">Method</p>
            <p className="mt-1">{project.method}</p>
          </div>
          <div>
            <p className="caption text-muted-foreground">Platform</p>
            <p className="mt-1">{project.platform}</p>
          </div>
          <div>
            <p className="caption text-muted-foreground">Evaluator</p>
            <p className="mt-1">{project.evaluator}</p>
          </div>
          <div>
            <p className="caption text-muted-foreground">Date</p>
            <p className="mt-1">{project.date}</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="journey" className="w-full">
        <TabsList className="flex gap-3 bg-transparent border-0 p-0">
          <TabsTrigger 
            value="journey" 
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
          >
            <Map size={16} />
            Journey Map
          </TabsTrigger>
          <TabsTrigger 
            value="findings" 
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
          >
            <ClipboardList size={16} />
            Findings
          </TabsTrigger>
          <TabsTrigger 
            value="scoring" 
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
          >
            <BarChart3 size={16} />
            Scoring
          </TabsTrigger>
          <TabsTrigger 
            value="summary" 
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
          >
            <FileText size={16} />
            Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journey" className="mt-6">
          <JourneyMap
            projectId={project.id}
            method={project.method}
            steps={journeySteps}
            onStepsChange={setJourneySteps}
          />
        </TabsContent>

        <TabsContent value="findings" className="mt-6">
          <Findings
            projectId={project.id}
            method={project.method}
            findings={findings}
            onFindingsChange={setFindings}
          />
        </TabsContent>

        <TabsContent value="scoring" className="mt-6">
          <Scoring
            projectId={project.id}
            method={project.method}
            scores={scores}
            findings={findings}
            onScoresChange={setScores}
          />
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <Summary projectId={project.id} project={project} />
        </TabsContent>
      </Tabs>
    </div>
  );
}