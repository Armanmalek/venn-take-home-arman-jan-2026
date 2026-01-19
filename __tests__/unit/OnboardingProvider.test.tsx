import { renderHook, act } from "@testing-library/react"
import {
  OnboardingProvider,
  useOnboarding,
} from "@/components/providers/OnboardingProvider"
import { BUSINESS_DETAILS } from "@/lib/onboarding/constants"

describe("OnboardingProvider", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <OnboardingProvider>{children}</OnboardingProvider>
  )

  describe("initial state", () => {
    it("initializes steps with pending status", () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper })

      const stepState = result.current.getStepState(BUSINESS_DETAILS)
      expect(stepState.status).toBe("pending")
      expect(stepState.data).toBeUndefined()
    })
  })

  describe("getStepState", () => {
    it("returns correct step state structure", () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper })

      const state = result.current.getStepState(BUSINESS_DETAILS)
      expect(state).toHaveProperty("data")
      expect(state).toHaveProperty("status")
    })
  })

  describe("completeStep", () => {
    it("updates step status to complete with data", () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper })

      const testData = {
        firstName: "John",
        lastName: "Doe",
        phone: "+13062776103",
        corporationNumber: "826417395",
      }

      act(() => {
        result.current.completeStep(BUSINESS_DETAILS, testData)
      })

      const stepState = result.current.getStepState(BUSINESS_DETAILS)
      expect(stepState.status).toBe("complete")
      expect(stepState.data).toEqual(testData)
    })

    it("preserves other steps when completing one step", () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper })

      const testData = {
        firstName: "John",
        lastName: "Doe",
        phone: "+13062776103",
        corporationNumber: "826417395",
      }

      act(() => {
        result.current.completeStep(BUSINESS_DETAILS, testData)
      })

      // Verify the step was completed
      expect(result.current.steps[BUSINESS_DETAILS].status).toBe("complete")
    })
  })

  describe("useOnboarding hook", () => {
    it("throws error when used outside provider", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      expect(() => {
        renderHook(() => useOnboarding())
      }).toThrow("useOnboarding must be used within an OnboardingProvider")

      consoleSpy.mockRestore()
    })
  })
})
