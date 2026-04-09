import { render, screen, fireEvent } from "@testing-library/react-native";
import { Button } from "./Button";
import { ThemeProvider } from "@/lib/theme/context";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Button", () => {
  it("renders button text", () => {
    renderWithTheme(<Button>Press me</Button>);
    expect(screen.getByText("Press me")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    renderWithTheme(<Button onPress={onPress}>Tap</Button>);
    fireEvent.press(screen.getByText("Tap"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Button onPress={onPress} disabled>
        Tap
      </Button>
    );
    fireEvent.press(screen.getByText("Tap"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders all variants without crashing", () => {
    const variants = ["success", "neutral", "muted", "ghost", "danger"] as const;
    for (const variant of variants) {
      renderWithTheme(<Button variant={variant}>Test</Button>);
    }
  });
});
