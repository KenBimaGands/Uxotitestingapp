import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { EvaluationMethod, JourneyStep } from "../../store/useProjectStore";

interface JourneyMapProps {
  projectId: string;
  method: EvaluationMethod;
  steps: JourneyStep[];
  onStepsChange: (steps: JourneyStep[]) => void;
}

export function JourneyMap({ projectId, method, steps, onStepsChange }: JourneyMapProps) {
  // Initialize with one step if empty
  useEffect(() => {
    if (steps.length === 0) {
      onStepsChange([
        {
          id: "1",
          name: "Step 1",
          description: "",
          userAction: "",
          systemResponse: "",
        },
      ]);
    }
  }, []);

  const addStep = () => {
    onStepsChange([
      ...steps,
      {
        id: Date.now().toString(),
        name: `Step ${steps.length + 1}`,
        description: "",
        userAction: "",
        systemResponse: "",
      },
    ]);
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      onStepsChange(steps.filter((step) => step.id !== id));
    }
  };

  const updateStep = (id: string, field: keyof JourneyStep, value: string) => {
    onStepsChange(
      steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-5 lg:p-6 bg-card border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl">User Journey Map</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Document the user flow and interactions
            </p>
          </div>
          <Button onClick={addStep} size="sm" className="w-full sm:w-auto">
            <Plus size={16} className="mr-2" />
            Add Step
          </Button>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <Card key={step.id} className="p-3 sm:p-4 bg-input-background border-border">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="mt-2 text-muted-foreground cursor-move hidden sm:block">
                  <GripVertical size={20} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <Input
                      value={step.name}
                      onChange={(e) => updateStep(step.id, "name", e.target.value)}
                      placeholder="Step name"
                      className="w-full sm:max-w-xs"
                    />
                    {steps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(step.id)}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 size={16} className="text-destructive mr-2 sm:mr-0" />
                        <span className="sm:hidden">Remove Step</span>
                      </Button>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">Description</label>
                    <Textarea
                      value={step.description}
                      onChange={(e) =>
                        updateStep(step.id, "description", e.target.value)
                      }
                      placeholder="Describe this step in the user journey..."
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block mb-2 text-sm">User Action</label>
                      <Textarea
                        value={step.userAction}
                        onChange={(e) =>
                          updateStep(step.id, "userAction", e.target.value)
                        }
                        placeholder="What does the user do?"
                        className="min-h-[60px]"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm">System Response</label>
                      <Textarea
                        value={step.systemResponse}
                        onChange={(e) =>
                          updateStep(step.id, "systemResponse", e.target.value)
                        }
                        placeholder="How does the system respond?"
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex justify-center mt-4">
                  <div className="w-0.5 h-6 bg-border"></div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}