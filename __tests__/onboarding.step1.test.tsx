import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import OnboardingForm from "@/components/onboarding/OnboardingForm"
import Step1Fields from "@/components/onboarding/steps/step1"
import ChakraProvider from "@/components/providers/ChakraProvider"
import { step1Schema } from "@/lib/validation/schemas"
import {
  submitStep1,
  validateCorporationNumber,
} from "@/app/onboarding/actions"

jest.mock("@/app/onboarding/actions", () => ({
  submitStep1: jest.fn(),
  validateCorporationNumber: jest.fn(),
}))

const mockedSubmit = submitStep1 as jest.MockedFunction<typeof submitStep1>
const mockedValidate = validateCorporationNumber as jest.MockedFunction<
  typeof validateCorporationNumber
>

const renderStep1 = () => {
  render(
    <ChakraProvider>
      <OnboardingForm
        schema={step1Schema}
        defaultValues={{
          firstName: "",
          lastName: "",
          phone: "",
          corporationNumber: "",
        }}
        onSubmit={submitStep1}
      >
        <Step1Fields />
      </OnboardingForm>
    </ChakraProvider>,
  )
}

describe("Onboarding Step 1", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("required field validation", () => {
    it("shows required validation messages on blur for all fields", async () => {
      renderStep1()
      const user = userEvent.setup()

      const firstName = screen.getByLabelText(/first name/i)
      const lastName = screen.getByLabelText(/last name/i)
      const phone = screen.getByLabelText(/phone number/i)
      const corp = screen.getByLabelText(/corporation number/i)

      await user.click(firstName)
      await user.tab()
      await user.click(lastName)
      await user.tab()
      await user.click(phone)
      await user.tab()
      await user.click(corp)
      await user.tab()

      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument()
      expect(
        screen.getByText(/corporation number is required/i),
      ).toBeInTheDocument()
    })

    it("clears required error when user enters valid input", async () => {
      renderStep1()
      const user = userEvent.setup()

      const firstName = screen.getByLabelText(/first name/i)
      await user.click(firstName)
      await user.tab()

      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()

      await user.type(firstName, "John")
      await user.tab()

      await waitFor(() => {
        expect(
          screen.queryByText(/first name is required/i),
        ).not.toBeInTheDocument()
      })
    })
  })

  describe("first name validation", () => {
    it("shows error when first name exceeds 50 characters", async () => {
      renderStep1()
      const user = userEvent.setup()

      const firstName = screen.getByLabelText(/first name/i)
      await user.type(firstName, "A".repeat(51))
      await user.tab()

      expect(
        await screen.findByText(/first name must be 50 characters or less/i),
      ).toBeInTheDocument()
    })
  })

  describe("last name validation", () => {
    it("shows error when last name exceeds 50 characters", async () => {
      renderStep1()
      const user = userEvent.setup()

      const lastName = screen.getByLabelText(/last name/i)
      await user.type(lastName, "B".repeat(51))
      await user.tab()

      expect(
        await screen.findByText(/last name must be 50 characters or less/i),
      ).toBeInTheDocument()
    })
  })

  describe("phone number validation", () => {
    it("shows error when phone does not start with +1", async () => {
      renderStep1()
      const user = userEvent.setup()

      const phone = screen.getByLabelText(/phone number/i)
      await user.type(phone, "1234567890")
      await user.tab()

      expect(
        await screen.findByText(/phone must start with \+1/i),
      ).toBeInTheDocument()
    })

    it("shows error for invalid Canadian phone number format", async () => {
      renderStep1()
      const user = userEvent.setup()

      const phone = screen.getByLabelText(/phone number/i)
      await user.type(phone, "+10000000000")
      await user.tab()

      expect(
        await screen.findByText(/valid canadian phone number/i),
      ).toBeInTheDocument()
    })

    it("accepts valid Canadian phone number", async () => {
      renderStep1()
      const user = userEvent.setup()

      const phone = screen.getByLabelText(/phone number/i)
      await user.type(phone, "+13062776103")
      await user.tab()

      await waitFor(() => {
        expect(
          screen.queryByText(/phone must start with \+1/i),
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(/valid canadian phone number/i),
        ).not.toBeInTheDocument()
      })
    })
  })

  describe("corporation number validation", () => {
    it("shows error when corporation number is not 9 digits", async () => {
      renderStep1()
      const user = userEvent.setup()

      const corp = screen.getByLabelText(/corporation number/i)
      await user.type(corp, "12345")
      await user.tab()

      expect(
        await screen.findByText(/corporation number must be 9 digits/i),
      ).toBeInTheDocument()
    })

    it("does not call API validation if schema validation fails", async () => {
      renderStep1()
      const user = userEvent.setup()

      const corp = screen.getByLabelText(/corporation number/i)
      await user.type(corp, "123")
      await user.tab()

      await screen.findByText(/corporation number must be 9 digits/i)
      expect(mockedValidate).not.toHaveBeenCalled()
    })

    it("validates corporation number on blur via API when schema passes", async () => {
      mockedValidate.mockResolvedValue({
        valid: false,
        message: "Invalid corporation number",
      })

      renderStep1()
      const user = userEvent.setup()

      const corp = screen.getByLabelText(/corporation number/i)
      await user.type(corp, "123456789")
      await user.tab()

      expect(
        await screen.findByText(/invalid corporation number/i),
      ).toBeInTheDocument()
      expect(mockedValidate).toHaveBeenCalledWith("123456789")
    })

    it("shows 'Validating...' indicator during API validation", async () => {
      mockedValidate.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ valid: true }), 100),
          ),
      )

      renderStep1()
      const user = userEvent.setup()

      const corp = screen.getByLabelText(/corporation number/i)
      await user.type(corp, "826417395")
      await user.tab()

      expect(await screen.findByText(/validating/i)).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByText(/validating/i)).not.toBeInTheDocument()
      })
    })

    it("clears corporation error when user corrects to valid number", async () => {
      mockedValidate
        .mockResolvedValueOnce({ valid: false, message: "Invalid" })
        .mockResolvedValueOnce({ valid: true })

      renderStep1()
      const user = userEvent.setup()

      const corp = screen.getByLabelText(/corporation number/i)

      await user.type(corp, "000000000")
      await user.tab()
      await screen.findByText(/invalid corporation number/i)

      await user.clear(corp)
      await user.type(corp, "826417395")
      await user.tab()

      await waitFor(() => {
        expect(
          screen.queryByText(/invalid corporation number/i),
        ).not.toBeInTheDocument()
      })
    })
  })

  describe("form submission - happy path", () => {
    it("submits valid data and shows success message", async () => {
      mockedValidate.mockResolvedValue({ valid: true })
      mockedSubmit.mockResolvedValue(undefined)

      renderStep1()
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/first name/i), "Hello")
      await user.type(screen.getByLabelText(/last name/i), "World")
      await user.type(screen.getByLabelText(/phone number/i), "+13062776103")

      const corp = screen.getByLabelText(/corporation number/i)
      await user.type(corp, "826417395")
      await user.tab()

      await user.click(screen.getByRole("button", { name: /submit/i }))

      await waitFor(() =>
        expect(mockedSubmit).toHaveBeenCalledWith({
          firstName: "Hello",
          lastName: "World",
          phone: "+13062776103",
          corporationNumber: "826417395",
        }),
      )

      expect(
        await screen.findByText(/submitted successfully/i),
      ).toBeInTheDocument()
    })
  })

  describe("form submission - error handling", () => {
    it("shows server error message when submit fails", async () => {
      mockedValidate.mockResolvedValue({ valid: true })
      mockedSubmit.mockRejectedValue(new Error("Invalid phone number"))

      renderStep1()
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/first name/i), "Hello")
      await user.type(screen.getByLabelText(/last name/i), "World")
      await user.type(screen.getByLabelText(/phone number/i), "+13062776103")

      const corp = screen.getByLabelText(/corporation number/i)
      await user.type(corp, "826417395")
      await user.tab()

      await user.click(screen.getByRole("button", { name: /submit/i }))

      expect(
        await screen.findByText(/invalid phone number/i),
      ).toBeInTheDocument()
    })

    it("does not submit when form has validation errors", async () => {
      renderStep1()
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/first name/i), "John")
      await user.click(screen.getByRole("button", { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
      })
      expect(mockedSubmit).not.toHaveBeenCalled()
    })

    it("shows corporation error from blur validation but allows submission without asyncValidate", async () => {
      // Note: This test demonstrates behavior when asyncValidate is NOT provided.
      // The blur validation shows an error, but form submission is not blocked
      // because the form's onSubmit only uses Zod schema validation.
      // In production, StepRenderer provides asyncValidate which would block submission.
      mockedValidate.mockResolvedValue({
        valid: false,
        message: "Corporation not found",
      })
      mockedSubmit.mockResolvedValue(undefined)

      renderStep1()
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/first name/i), "John")
      await user.type(screen.getByLabelText(/last name/i), "Doe")
      await user.type(screen.getByLabelText(/phone number/i), "+13062776103")

      const corp = screen.getByLabelText(/corporation number/i)
      await user.type(corp, "000000000")
      await user.tab()

      // Error is shown from blur validation
      await screen.findByText(/invalid corporation number/i)

      await user.click(screen.getByRole("button", { name: /submit/i }))

      // Form submits because asyncValidate is not set in this test
      await waitFor(() => {
        expect(mockedSubmit).toHaveBeenCalled()
      })
    })
  })

  describe("loading states", () => {
    it("shows submitting state during form submission", async () => {
      mockedValidate.mockResolvedValue({ valid: true })
      mockedSubmit.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      )

      renderStep1()
      const user = userEvent.setup()

      await user.type(screen.getByLabelText(/first name/i), "John")
      await user.type(screen.getByLabelText(/last name/i), "Doe")
      await user.type(screen.getByLabelText(/phone number/i), "+13062776103")

      const corp = screen.getByLabelText(/corporation number/i)
      await user.type(corp, "826417395")
      await user.tab()

      await user.click(screen.getByRole("button", { name: /submit/i }))

      expect(await screen.findByText(/submitting/i)).toBeInTheDocument()
    })
  })

  describe("complete user journey", () => {
    it("allows user to fix errors and successfully submit", async () => {
      mockedValidate
        .mockResolvedValueOnce({ valid: false, message: "Invalid" })
        .mockResolvedValueOnce({ valid: true })
      mockedSubmit.mockResolvedValue(undefined)

      renderStep1()
      const user = userEvent.setup()

      // Fill form with invalid corporation number
      await user.type(screen.getByLabelText(/first name/i), "John")
      await user.type(screen.getByLabelText(/last name/i), "Doe")
      await user.type(screen.getByLabelText(/phone number/i), "+13062776103")

      const corp = screen.getByLabelText(/corporation number/i)
      await user.type(corp, "000000000")
      await user.tab()

      // See error
      await screen.findByText(/invalid corporation number/i)

      // Fix the error
      await user.clear(corp)
      await user.type(corp, "826417395")
      await user.tab()

      // Error should clear
      await waitFor(() => {
        expect(
          screen.queryByText(/invalid corporation number/i),
        ).not.toBeInTheDocument()
      })

      // Submit successfully
      await user.click(screen.getByRole("button", { name: /submit/i }))

      expect(
        await screen.findByText(/submitted successfully/i),
      ).toBeInTheDocument()
    })

    it("shows all validation errors when submitting empty form", async () => {
      renderStep1()
      const user = userEvent.setup()

      await user.click(screen.getByRole("button", { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
        expect(
          screen.getByText(/phone number is required/i),
        ).toBeInTheDocument()
        expect(
          screen.getByText(/corporation number is required/i),
        ).toBeInTheDocument()
      })

      expect(mockedSubmit).not.toHaveBeenCalled()
    })
  })
})
