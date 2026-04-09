import { useQuery } from "@tanstack/react-query";
import { getThing } from "@/lib/api/things";

export function useThing(id: string) {
  return useQuery({
    queryKey: ["things", id],
    queryFn: () => getThing(id),
    enabled: !!id,
  });
}
