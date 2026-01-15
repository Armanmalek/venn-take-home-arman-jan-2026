import OnboardingForm from "@/components/onboarding/OnboardingForm";
import Step1Fields from "@/components/onboarding/steps/step1";
import { submitStep1 } from "@/app/onboarding/actions";
import type { Step1Values } from "@/lib/validation/schemas";

const NOT_IMPLEMENTED_MESSAGE = "Not implemented";

type StepRendererProps = {
  step: number;
  defaultValues: Step1Values;
};

const StepRenderer = ({ step, defaultValues }: StepRendererProps) => {
  if (step !== 1) {
    return (
      <p className="text-center text-sm text-zinc-500">
        {NOT_IMPLEMENTED_MESSAGE}
      </p>
    );
  }

  return (
    <OnboardingForm
      schemaKey="step1"
      defaultValues={defaultValues}
      onSubmit={submitStep1}
    >
      <Step1Fields />
    </OnboardingForm>
  );
};

export default StepRenderer;
