import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import Step1Fields from "@/components/onboarding/steps/step1";
import {
  saveDraft,
  submitStep1,
  validateCorporationNumber,
} from "@/app/onboarding/actions";

jest.mock("@/app/onboarding/actions", () => ({
  submitStep1: jest.fn(),
  validateCorporationNumber: jest.fn(),
  saveDraft: jest.fn(),
}));

const mockedSubmit = submitStep1 as jest.MockedFunction<typeof submitStep1>;
const mockedValidate =
  validateCorporationNumber as jest.MockedFunction<
    typeof validateCorporationNumber
  >;
const mockedSaveDraft = saveDraft as jest.MockedFunction<typeof saveDraft>;

const renderStep1 = () => {
  render(
    <OnboardingForm
      schemaKey="step1"
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
  );
};

describe("Onboarding Step 1", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedSaveDraft.mockResolvedValue(undefined);
  });

  it("shows required validation messages on blur", async () => {
    renderStep1();
    const user = userEvent.setup();

    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const phone = screen.getByLabelText(/phone number/i);
    const corp = screen.getByLabelText(/corporation number/i);

    await user.click(firstName);
    await user.tab();
    await user.click(lastName);
    await user.tab();
    await user.click(phone);
    await user.tab();
    await user.click(corp);
    await user.tab();

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/corporation number is required/i)
    ).toBeInTheDocument();
  });

  it("validates corporation number on blur and shows API error", async () => {
    mockedValidate.mockResolvedValue({
      valid: false,
      message: "Invalid corporation number",
    });

    renderStep1();
    const user = userEvent.setup();

    const corp = screen.getByLabelText(/corporation number/i);

    await user.type(corp, "123456789");
    await user.tab();

    expect(
      await screen.findByText(/invalid corporation number/i)
    ).toBeInTheDocument();
  });

  it("submits valid data and shows success", async () => {
    mockedValidate.mockResolvedValue({ valid: true });
    mockedSubmit.mockResolvedValue(undefined);

    renderStep1();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/first name/i), "Hello");
    await user.type(screen.getByLabelText(/last name/i), "World");
    await user.type(screen.getByLabelText(/phone number/i), "+13062776103");

    const corp = screen.getByLabelText(/corporation number/i);
    await user.type(corp, "826417395");
    await user.tab();

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(mockedSubmit).toHaveBeenCalledWith({
        firstName: "Hello",
        lastName: "World",
        phone: "+13062776103",
        corporationNumber: "826417395",
      })
    );

    expect(await screen.findByText(/submitted successfully/i)).toBeInTheDocument();
  });

  it("shows server error message when submit fails", async () => {
    mockedValidate.mockResolvedValue({ valid: true });
    mockedSubmit.mockRejectedValue(new Error("Invalid phone number"));

    renderStep1();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/first name/i), "Hello");
    await user.type(screen.getByLabelText(/last name/i), "World");
    await user.type(screen.getByLabelText(/phone number/i), "+13062776103");

    const corp = screen.getByLabelText(/corporation number/i);
    await user.type(corp, "826417395");
    await user.tab();

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(
      await screen.findByText(/invalid phone number/i)
    ).toBeInTheDocument();
  });
});
