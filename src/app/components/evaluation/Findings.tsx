import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import type { EvaluationMethod, Finding } from "../../store/useProjectStore";

interface FindingsProps {
  projectId: string;
  method: EvaluationMethod;
  findings: Finding[];
  onFindingsChange: (findings: Finding[]) => void;
}

type Severity = "Critical" | "High" | "Medium" | "Low";

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

// Calculate severity based on frequency × impact × persistence
const calculateSeverity = (frequency: number, impact: number, persistence: number): { severity: Severity; score: number } => {
  const score = frequency * impact * persistence;
  let severity: Severity;
  
  if (score >= 18) severity = "Critical";
  else if (score >= 9) severity = "High";
  else if (score >= 3) severity = "Medium";
  else severity = "Low";
  
  return { severity, score };
};

export function Findings({ projectId, method, findings, onFindingsChange }: FindingsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newFinding, setNewFinding] = useState<Finding>({
    id: "",
    title: "",
    description: "",
    frequency: 0,
    impact: 0,
    persistence: 0,
    severity: "Low",
    severityScore: 0,
    location: "",
    recommendation: "",
    heuristic: method === "Heuristic" ? heuristicPrinciples[0] : undefined,
    dimension: method === "7 Dimensions" ? sevenDimensions[0] : undefined,
  });

  const updateNewFindingMetrics = (field: 'frequency' | 'impact' | 'persistence', value: number) => {
    const updated = { ...newFinding, [field]: value };
    const { severity, score } = calculateSeverity(updated.frequency, updated.impact, updated.persistence);
    setNewFinding({ ...updated, severity, severityScore: score });
  };

  const addFinding = () => {
    if (!newFinding.title || !newFinding.description) return;

    const updatedFindings = [
      ...findings,
      {
        ...newFinding,
        id: Date.now().toString(),
      },
    ];

    onFindingsChange(updatedFindings);

    setNewFinding({
      id: "",
      title: "",
      description: "",
      frequency: 0,
      impact: 0,
      persistence: 0,
      severity: "Low",
      severityScore: 0,
      location: "",
      recommendation: "",
      heuristic: method === "Heuristic" ? heuristicPrinciples[0] : undefined,
      dimension: method === "7 Dimensions" ? sevenDimensions[0] : undefined,
    });
    setIsAdding(false);
  };

  const removeFinding = (id: string) => {
    const updatedFindings = findings.filter((f) => f.id !== id);
    onFindingsChange(updatedFindings);
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case "Critical":
        return "destructive";
      case "High":
        return "default";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
    }
  };

  const getSeverityEmoji = (severity: Severity) => {
    switch (severity) {
      case "Critical":
        return "🔴";
      case "High":
        return "🟠";
      case "Medium":
        return "🟡";
      case "Low":
        return "⚪";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2>Findings & Issues</h2>
            <p className="text-muted-foreground mt-1">
              Document usability issues with automated severity scoring
            </p>
          </div>
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={16} className="mr-2" />
            Add Finding
          </Button>
        </div>

        {isAdding && (
          <Card className="p-4 bg-input-background border-border mb-4">
            <h3 className="mb-4">New Finding</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Title</label>
                <Input
                  value={newFinding.title}
                  onChange={(e) =>
                    setNewFinding({ ...newFinding, title: e.target.value })
                  }
                  placeholder="Brief issue title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Location</label>
                  <Input
                    value={newFinding.location}
                    onChange={(e) =>
                      setNewFinding({ ...newFinding, location: e.target.value })
                    }
                    placeholder="Screen/page name"
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    {method === "Heuristic" ? "Heuristic" : "Dimension"}
                  </label>
                  <Select
                    value={
                      method === "Heuristic"
                        ? newFinding.heuristic
                        : newFinding.dimension
                    }
                    onValueChange={(value) =>
                      method === "Heuristic"
                        ? setNewFinding({ ...newFinding, heuristic: value })
                        : setNewFinding({ ...newFinding, dimension: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(method === "Heuristic"
                        ? heuristicPrinciples
                        : sevenDimensions
                      ).map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Severity Calculator */}
              <Card className="p-4 bg-card border-border">
                <h4 className="mb-3">Severity Calculator</h4>
                <p className="caption text-muted-foreground mb-4">
                  Rate each factor from 0-3 to calculate severity
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-sm">Frequency</label>
                    <Input
                      type="number"
                      min="0"
                      max="3"
                      value={newFinding.frequency}
                      onChange={(e) => updateNewFindingMetrics('frequency', Number(e.target.value))}
                      placeholder="0-3"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Impact</label>
                    <Input
                      type="number"
                      min="0"
                      max="3"
                      value={newFinding.impact}
                      onChange={(e) => updateNewFindingMetrics('impact', Number(e.target.value))}
                      placeholder="0-3"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Persistence</label>
                    <Input
                      type="number"
                      min="0"
                      max="3"
                      value={newFinding.persistence}
                      onChange={(e) => updateNewFindingMetrics('persistence', Number(e.target.value))}
                      placeholder="0-3"
                    />
                  </div>
                </div>

                <div className="p-3 bg-input-background rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="caption text-muted-foreground">Severity Score</p>
                      <p className="text-2xl font-semibold">{newFinding.severityScore}</p>
                    </div>
                    <div className="text-right">
                      <p className="caption text-muted-foreground">Category</p>
                      <p className="font-semibold">
                        {getSeverityEmoji(newFinding.severity)} {newFinding.severity}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div>
                <label className="block mb-2">Description</label>
                <Textarea
                  value={newFinding.description}
                  onChange={(e) =>
                    setNewFinding({ ...newFinding, description: e.target.value })
                  }
                  placeholder="Detailed description of the issue..."
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <label className="block mb-2">Recommendation</label>
                <Textarea
                  value={newFinding.recommendation}
                  onChange={(e) =>
                    setNewFinding({ ...newFinding, recommendation: e.target.value })
                  }
                  placeholder="How to fix this issue..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={addFinding}>Add Finding</Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {findings.length === 0 && !isAdding && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No findings documented yet</p>
              <p className="caption mt-2">Click "Add Finding" to document issues</p>
            </div>
          )}

          {findings.map((finding) => (
            <Card key={finding.id} className="p-4 bg-input-background border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3>{finding.title}</h3>
                    <Badge variant={getSeverityColor(finding.severity)}>
                      {getSeverityEmoji(finding.severity)} {finding.severity}
                    </Badge>
                    <span className="caption text-muted-foreground">
                      Score: {finding.severityScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 caption text-muted-foreground">
                    {finding.location && <span>📍 {finding.location}</span>}
                    <span>
                      {method === "Heuristic"
                        ? `🎯 ${finding.heuristic}`
                        : `📊 ${finding.dimension}`}
                    </span>
                    <span>
                      F:{finding.frequency} I:{finding.impact} P:{finding.persistence}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFinding(finding.id)}
                >
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>

              <div className="space-y-3 mt-4">
                <div>
                  <p className="caption text-muted-foreground mb-1">Description</p>
                  <p>{finding.description}</p>
                </div>
                {finding.recommendation && (
                  <div>
                    <p className="caption text-muted-foreground mb-1">
                      Recommendation
                    </p>
                    <p>{finding.recommendation}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}