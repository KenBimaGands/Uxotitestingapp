import { useEffect } from "react";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import type { EvaluationMethod, Score, Finding } from "../../store/useProjectStore";

interface ScoringProps {
  projectId: string;
  method: EvaluationMethod;
  scores: Score[];
  findings: Finding[];
  onScoresChange: (scores: Score[]) => void;
}

const heuristicPrinciples = [
  "Visibility of system status",
  "Match between system and real world",
  "User control and freedom",
  "Consistency and standards",
  "Error prevention",
  "Recognition rather than recall",
  "Flexibility and efficiency of use",
  "Aesthetic and minimalist design",
  "Help users recognize, diagnose, and recover from errors",
  "Help and documentation",
];

const sevenDimensions = [
  "Usefulness",
  "Usability",
  "Desirability",
  "Findability",
  "Accessibility",
  "Credibility",
  "Value",
];

export function Scoring({ projectId, method, scores, findings, onScoresChange }: ScoringProps) {
  // Auto-calculate scores based on findings
  useEffect(() => {
    const items = method === "Heuristic" ? heuristicPrinciples : sevenDimensions;
    
    const calculatedScores = items.map((name) => {
      // Get all findings for this heuristic/dimension
      const relatedFindings = findings.filter((f) => 
        method === "Heuristic" ? f.heuristic === name : f.dimension === name
      );
      
      if (relatedFindings.length === 0) {
        // No findings = perfect score of 100
        return { name, score: 100 };
      }
      
      // Calculate average severity score
      const avgSeverityScore = relatedFindings.reduce((sum, f) => sum + f.severityScore, 0) / relatedFindings.length;
      
      // Convert severity score (0-27) to inverted score (0-100)
      // Higher severity = lower score
      // Formula: 100 - (avgSeverityScore / 27 * 100)
      const score = Math.max(0, Math.round(100 - (avgSeverityScore / 27 * 100)));
      
      return { name, score };
    });
    
    onScoresChange(calculatedScores);
  }, [findings, method, onScoresChange]);

  const calculateAverage = (scores: { score: number }[]) => {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, item) => acc + item.score, 0);
    return Math.round(sum / scores.length);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-chart-1";
    if (score >= 60) return "text-chart-2";
    if (score >= 40) return "text-chart-4";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const averageScore = calculateAverage(scores);

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="mb-6">
          <h2>Automated Evaluation Scoring</h2>
          <p className="text-muted-foreground mt-1">
            Scores are automatically calculated based on findings severity
          </p>
        </div>

        <Card className="p-6 bg-input-background border-border mb-6">
          <div className="text-center">
            <p className="caption text-muted-foreground mb-2">Overall Score</p>
            <div className={`mb-2 ${getScoreColor(averageScore)}`}>
              <span style={{ fontSize: "48px", fontWeight: "600" }}>
                {averageScore}
              </span>
              <span style={{ fontSize: "24px" }}>/100</span>
            </div>
            <p className={getScoreColor(averageScore)}>
              {getScoreLabel(averageScore)}
            </p>
            <Progress value={averageScore} className="mt-4" />
          </div>
        </Card>

        <div className="space-y-4">
          {scores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Add findings to generate automated scores</p>
            </div>
          ) : (
            <>
              {scores.map((item) => {
                const relatedFindings = findings.filter((f) => 
                  method === "Heuristic" ? f.heuristic === item.name : f.dimension === item.name
                );
                
                return (
                  <Card key={item.name} className="p-4 bg-input-background border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4>{item.name}</h4>
                      <span className={`text-2xl font-semibold ${getScoreColor(item.score)}`}>
                        {item.score}/100
                      </span>
                    </div>
                    <Progress value={item.score} className="mb-2" />
                    <div className="flex items-center justify-between caption text-muted-foreground">
                      <span>{relatedFindings.length} finding{relatedFindings.length !== 1 ? 's' : ''}</span>
                      <span className={getScoreColor(item.score)}>{getScoreLabel(item.score)}</span>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </div>

        <Card className="p-4 bg-input-background border-border mt-6">
          <h4 className="mb-2">How Scoring Works</h4>
          <ul className="caption text-muted-foreground space-y-1">
            <li>• Each finding's severity is calculated: Frequency × Impact × Persistence</li>
            <li>• Scores per {method === "Heuristic" ? "heuristic" : "dimension"} are inversely proportional to severity</li>
            <li>• No findings = 100 (perfect score)</li>
            <li>• Higher severity findings = lower scores</li>
            <li>• Overall score is the average across all {method === "Heuristic" ? "heuristics" : "dimensions"}</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
}