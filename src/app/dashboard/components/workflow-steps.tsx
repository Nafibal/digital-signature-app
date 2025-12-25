"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStepsProps {
  currentStep: number; // 1-4
}

const steps = [
  { number: 1, label: "Check" },
  { number: 2, label: "Upload" },
  { number: 3, label: "Fill Content" },
  { number: 4, label: "Final Review" },
];

export default function WorkflowSteps({ currentStep }: WorkflowStepsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted && "border-green-500 bg-green-500 text-white",
                  isCurrent && "border-neutral-950 bg-neutral-950 text-white",
                  !isCompleted &&
                    !isCurrent &&
                    "border-neutral-300 bg-white text-neutral-400"
                )}
              >
                {isCompleted && <CheckCircle2 className="h-5 w-5" />}
                {isCurrent && <div className="h-2 w-2 rounded-full bg-white" />}
                {!isCompleted && !isCurrent && (
                  <Circle className="h-3 w-3" fill="currentColor" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isCurrent && "text-neutral-950",
                  !isCurrent && "text-neutral-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-8 transition-colors",
                  isCompleted && "bg-green-500",
                  !isCompleted && "bg-neutral-300"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
