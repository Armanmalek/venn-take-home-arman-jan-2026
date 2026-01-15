import type { ReactNode } from "react";

type StepShellProps = {
  step: number;
  totalSteps: number;
  title: string;
  children: ReactNode;
};

const StepShell = ({ step, totalSteps, title, children }: StepShellProps) => {
  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 px-4 py-16 text-zinc-900">
      <div className="w-full max-w-2xl">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Step {step} of {totalSteps}
        </p>
        <div className="mt-10 rounded-3xl border border-zinc-200 bg-white px-8 py-10 shadow-sm">
          <h1 className="text-center text-2xl font-semibold text-zinc-900">
            {title}
          </h1>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default StepShell;
