import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Card } from "./Card";
import { ThemeProvider } from "@/lib/theme/context";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Card", () => {
  it("renders children", () => {
    renderWithTheme(
      <Card>
        <Text>Card content</Text>
      </Card>
    );
    expect(screen.getByText("Card content")).toBeTruthy();
  });
});
