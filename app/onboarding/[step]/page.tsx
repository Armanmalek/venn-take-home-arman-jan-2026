import StepShell from "@/components/onboarding/StepShell";
import StepRenderer from "@/components/onboarding/StepRenderer";
import { getStep, TOTAL_STEPS } from "@/lib/onboarding/flow";
import { getOnboardingDraft } from "@/lib/session/onboardingSession";
import type { Step1Values } from "@/lib/validation/schemas";

const INVALID_STEP_MESSAGE = "Invalid step";

type OnboardingPageProps = {
  params: { step: string };
};

const emptyStep1Values: Step1Values = {
  firstName: "",
  lastName: "",
  phone: "",
  corporationNumber: "",
};

const OnboardingPage = async ({ params }: OnboardingPageProps) => {
  const stepNumber = Number(params.step);
  const step = Number.isInteger(stepNumber) ? getStep(stepNumber) : undefined;

  if (!step) {
    return (
      <StepShell step={1} totalSteps={TOTAL_STEPS} title="Onboarding">
        <p className="text-center text-sm text-zinc-500">
          {INVALID_STEP_MESSAGE}
        </p>
      </StepShell>
    );
  }

  const draft =
    stepNumber === 1 ? await getOnboardingDraft() : emptyStep1Values;

  const step1Values: Step1Values = {
    ...emptyStep1Values,
    ...draft,
  };

  return (
    <StepShell step={stepNumber} totalSteps={TOTAL_STEPS} title={step.title}>
      <StepRenderer step={stepNumber} defaultValues={step1Values} />
    </StepShell>
  );
};

export default OnboardingPage;
