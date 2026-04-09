import { render, screen, fireEvent } from "@testing-library/react-native";
import { Input } from "./Input";
import { ThemeProvider } from "@/lib/theme/context";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Input", () => {
  it("renders with label", () => {
    renderWithTheme(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeTruthy();
  });

  it("shows error message", () => {
    renderWithTheme(<Input error="Required field" />);
    expect(screen.getByText("Required field")).toBeTruthy();
  });

  it("calls onChangeText when typing", () => {
    const onChangeText = jest.fn();
    renderWithTheme(
      <Input
        label="Name"
        onChangeText={onChangeText}
        testID="input"
      />
    );
    fireEvent.changeText(screen.getByTestId("input"), "hello");
    expect(onChangeText).toHaveBeenCalledWith("hello");
  });
});
