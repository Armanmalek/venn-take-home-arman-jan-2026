import { render, RenderOptions } from "@testing-library/react"
import { ReactElement, ReactNode } from "react"
import ChakraProvider from "@/components/providers/ChakraProvider"
import { OnboardingProvider } from "@/components/providers/OnboardingProvider"

type AllProvidersProps = {
  children: ReactNode
}

const AllProviders = ({ children }: AllProvidersProps) => (
  <ChakraProvider>
    <OnboardingProvider>{children}</OnboardingProvider>
  </ChakraProvider>
)

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllProviders, ...options })

export const renderWithChakra = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: ChakraProvider, ...options })

export const createMockValidationResult = (valid: boolean, message?: string) => ({
  valid,
  message,
})

export const createMockStep1Values = (overrides = {}) => ({
  firstName: "John",
  lastName: "Doe",
  phone: "+13062776103",
  corporationNumber: "826417395",
  ...overrides,
})
