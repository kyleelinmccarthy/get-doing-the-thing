import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NudgeCard } from "./NudgeCard";
import { ThemeProvider } from "@/lib/theme/context";

// Mock the respond API
jest.mock("@/lib/api/responses", () => ({
  respondToNudge: jest.fn().mockResolvedValue({ success: true }),
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

const defaultProps = {
  thingId: "test-uuid",
  thingLabel: "Exercise",
  currentDeferralCount: 0,
  deferralThreshold: 3,
  snoozeMinutes: 15,
};

describe("NudgeCard", () => {
  it("renders thing label and action buttons", () => {
    renderWithProviders(<NudgeCard {...defaultProps} />);

    expect(screen.getByText("Exercise")).toBeTruthy();
    expect(screen.getByText("Do the thing.")).toBeTruthy();
    expect(screen.getByText("Did the thing")).toBeTruthy();
    expect(screen.getByText("Doing the thing")).toBeTruthy();
    expect(screen.getByText("Can't right now")).toBeTruthy();
  });

  it("shows friction dialog when deferral is below threshold", () => {
    renderWithProviders(<NudgeCard {...defaultProps} />);

    fireEvent.press(screen.getByText("Can't right now"));
    expect(screen.getByText("Are you sure?")).toBeTruthy();
  });

  it("shows 'Done.' after successful response", async () => {
    renderWithProviders(<NudgeCard {...defaultProps} />);

    fireEvent.press(screen.getByText("Did the thing"));

    await waitFor(() => {
      expect(screen.getByText("Done.")).toBeTruthy();
    });
  });
});
