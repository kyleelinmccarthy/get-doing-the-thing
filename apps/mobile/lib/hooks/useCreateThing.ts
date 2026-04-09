import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createThing } from "@/lib/api/things";
import type { CreateThingInput } from "@doing-the-thing/shared";

export function useCreateThing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateThingInput) => createThing(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["things"] });
    },
  });
}
