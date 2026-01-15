export type OnboardingStep = {
  id: number;
  title: string;
  description?: string;
};

export const onboardingSteps: OnboardingStep[] = [
  { id: 1, title: "Onboarding Form" },
  { id: 2, title: "Business Details" },
  { id: 3, title: "Ownership" },
  { id: 4, title: "Verification" },
  { id: 5, title: "Review" },
];

export const TOTAL_STEPS = onboardingSteps.length;

export const getStep = (stepId: number) =>
  onboardingSteps.find((step) => step.id === stepId);
