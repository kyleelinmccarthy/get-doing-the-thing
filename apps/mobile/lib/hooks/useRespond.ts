import { useMutation, useQueryClient } from "@tanstack/react-query";
import { respondToNudge } from "@/lib/api/responses";
import type { NudgeActionValue } from "@doing-the-thing/shared";

export function useRespond() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      thingId,
      action,
    }: {
      thingId: string;
      action: NudgeActionValue;
    }) => respondToNudge(thingId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["things"] });
      queryClient.invalidateQueries({ queryKey: ["completions"] });
    },
  });
}
