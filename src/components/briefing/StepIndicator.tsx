import { CheckCircle2, AlertCircle, Circle } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  completedSteps: boolean[];
}

export function StepIndicator({ steps, currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 px-1">
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isComplete = completedSteps[i];

        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center min-w-[3rem]">
              <div
                className={`step-indicator ${
                  isComplete ? 'step-complete' : isActive ? 'step-active' : 'step-pending'
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isActive ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
              <span className={`text-[10px] mt-1 text-center leading-tight ${
                isActive ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-4 h-0.5 mt-[-14px] ${
                isComplete ? 'bg-success' : 'bg-border'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
