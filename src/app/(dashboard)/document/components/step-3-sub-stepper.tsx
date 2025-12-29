"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step3SubStepperProps {
  currentSubStep: number; // 1 or 2
}

const subSteps = [
  { number: 1, label: "Fill Content" },
  { number: 2, label: "Add Signature" },
];

export default function Step3SubStepper({
  currentSubStep,
}: Step3SubStepperProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {subSteps.map((step, index) => {
        const isCompleted = step.number < currentSubStep;
        const isCurrent = step.number === currentSubStep;
        const isLast = index === subSteps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted && "border-green-500 bg-green-500 text-white",
                  isCurrent && "border-neutral-950 bg-neutral-950 text-white",
                  !isCompleted &&
                    !isCurrent &&
                    "border-neutral-300 bg-white text-neutral-400"
                )}
              >
                {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                {isCurrent && <div className="h-2 w-2 rounded-full bg-white" />}
                {!isCompleted && !isCurrent && (
                  <Circle className="h-2.5 w-2.5" fill="currentColor" />
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
                  "mx-2 h-0.5 w-6 transition-colors",
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
