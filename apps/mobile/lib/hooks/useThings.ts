import { useQuery } from "@tanstack/react-query";
import { getThings } from "@/lib/api/things";

export function useThings() {
  return useQuery({
    queryKey: ["things"],
    queryFn: getThings,
  });
}
