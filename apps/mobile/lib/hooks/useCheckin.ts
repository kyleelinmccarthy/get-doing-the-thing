import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitCheckin } from "@/lib/api/responses";
import type { CheckinNotes } from "@doing-the-thing/shared";

export function useCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      thingId,
      notes,
    }: {
      thingId: string;
      notes: CheckinNotes;
    }) => submitCheckin(thingId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["things"] });
      queryClient.invalidateQueries({ queryKey: ["completions"] });
    },
  });
}
