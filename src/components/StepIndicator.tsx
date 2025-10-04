type StepIndicatorProps = {
  current: number;
  total: number;
};

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, index) => {
        const stepNumber = index + 1;
        const active = stepNumber === current;
        return (
          <span
            key={stepNumber}
            className={`h-2 w-2 rounded-full transition ${
              active ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          />
        );
      })}
    </div>
  );
}
