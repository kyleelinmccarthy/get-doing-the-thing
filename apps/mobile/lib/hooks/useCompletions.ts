import { useQuery } from "@tanstack/react-query";
import { getRecentCompletions } from "@/lib/api/responses";

export function useCompletions() {
  return useQuery({
    queryKey: ["completions"],
    queryFn: () => getRecentCompletions(),
  });
}
