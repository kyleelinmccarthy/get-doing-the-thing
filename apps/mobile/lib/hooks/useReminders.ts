import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReminders,
  createReminder,
  deleteReminder,
} from "@/lib/api/reminders";

export function useReminders(thingId: string) {
  return useQuery({
    queryKey: ["things", thingId, "reminders"],
    queryFn: () => getReminders(thingId),
    enabled: !!thingId,
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      thingId,
      scheduleCron,
    }: {
      thingId: string;
      scheduleCron: string;
    }) => createReminder(thingId, scheduleCron),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["things", variables.thingId, "reminders"],
      });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["things"] });
    },
  });
}
