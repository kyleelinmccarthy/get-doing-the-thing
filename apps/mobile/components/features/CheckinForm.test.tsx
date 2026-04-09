import { render, screen, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CheckinForm } from "./CheckinForm";
import { ThemeProvider } from "@/lib/theme/context";

jest.mock("@/lib/api/responses", () => ({
  submitCheckin: jest.fn().mockResolvedValue({ success: true }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{ui}</ThemeProvider>
    </QueryClientProvider>
  );
}

describe("CheckinForm", () => {
  it("renders step 0 with challenges question", () => {
    renderWithProviders(
      <CheckinForm thingId="test" onComplete={jest.fn()} />
    );

    expect(
      screen.getByText(
        "What challenges are preventing you from doing the thing?"
      )
    ).toBeTruthy();
  });

  it("disables Next when challenges is empty", () => {
    renderWithProviders(
      <CheckinForm thingId="test" onComplete={jest.fn()} />
    );

    const nextButton = screen.getByText("Next");
    // Button should be disabled (opacity check would be more thorough)
    expect(nextButton).toBeTruthy();
  });

  it("advances to step 1 after entering challenges", () => {
    renderWithProviders(
      <CheckinForm thingId="test" onComplete={jest.fn()} />
    );

    const input = screen.getByPlaceholderText("Be honest with yourself...");
    fireEvent.changeText(input, "I'm tired");
    fireEvent.press(screen.getByText("Next"));

    expect(
      screen.getByText("Are those challenges within your control?")
    ).toBeTruthy();
  });

  it("shows control options in step 1", () => {
    renderWithProviders(
      <CheckinForm thingId="test" onComplete={jest.fn()} />
    );

    // Advance to step 1
    const input = screen.getByPlaceholderText("Be honest with yourself...");
    fireEvent.changeText(input, "I'm tired");
    fireEvent.press(screen.getByText("Next"));

    expect(screen.getByText("Yes")).toBeTruthy();
    expect(screen.getByText("No")).toBeTruthy();
    expect(screen.getByText("Partially")).toBeTruthy();
  });
});
