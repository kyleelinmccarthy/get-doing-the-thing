import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { useThings } from "./useThings";

jest.mock("@/lib/api/things", () => ({
  getThings: jest.fn().mockResolvedValue([
    {
      id: "1",
      userId: "u1",
      label: "Exercise",
      snoozeMinutes: 15,
      deferralThreshold: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ]),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

describe("useThings", () => {
  it("fetches things and returns data", async () => {
    const { result } = renderHook(() => useThings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].label).toBe("Exercise");
  });
});
